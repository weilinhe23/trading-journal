import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"
import { MNQ_DECISION_TIMEFRAME_OPTIONS, isMnqDecisionTimeframe, type MnqDecisionTimeframe } from "~/types"

function parseWeekStart(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const d = new Date(`${s}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

// ── MNQ 行情记录解析 ─────────────────────────────────────────────────────────

interface MnqTradeOpportunity {
  captured: boolean | null
  tradeDirection: "LONG" | "SHORT" | null
  entryPrice: string
  exitPrice: string
  contracts: string
  decisionTimeframe?: MnqDecisionTimeframe | null
}

interface MnqSegment {
  opportunities?: MnqTradeOpportunity[]
}

interface MnqDayStats {
  pnl: number
  tradeCount: number
  winCount: number
  missedCount: number
  timeframeStats: Record<MnqDecisionTimeframe, { captured: number; missed: number }>
}

function createEmptyTimeframeStats(): MnqDayStats["timeframeStats"] {
  return Object.fromEntries(
    MNQ_DECISION_TIMEFRAME_OPTIONS.map((timeframe) => [timeframe, { captured: 0, missed: 0 }]),
  ) as MnqDayStats["timeframeStats"]
}

function parseMnqSegment(raw: string | null | undefined): MnqSegment {
  if (!raw) return {}
  try { return JSON.parse(raw) as MnqSegment } catch { return {} }
}

// MNQ 每合约每点 $2
const MNQ_TICK_VALUE = 2

function calcMnqDayStats(mnqPlan: {
  marketPreJson: string | null
  marketOpenJson: string | null
  marketMidJson: string | null
  marketAfternoonJson: string | null
} | null): MnqDayStats {
  const result: MnqDayStats = {
    pnl: 0,
    tradeCount: 0,
    winCount: 0,
    missedCount: 0,
    timeframeStats: createEmptyTimeframeStats(),
  }
  if (!mnqPlan) return result

  const segments = [
    mnqPlan.marketPreJson,
    mnqPlan.marketOpenJson,
    mnqPlan.marketMidJson,
    mnqPlan.marketAfternoonJson,
  ]

  for (const raw of segments) {
    const seg = parseMnqSegment(raw)
    for (const opp of seg.opportunities ?? []) {
      if (opp.captured === false) {
        result.missedCount++
        if (isMnqDecisionTimeframe(opp.decisionTimeframe)) result.timeframeStats[opp.decisionTimeframe].missed++
        continue
      }
      if (opp.captured !== true) continue

      result.tradeCount++
      if (isMnqDecisionTimeframe(opp.decisionTimeframe)) result.timeframeStats[opp.decisionTimeframe].captured++
      const entry = parseFloat(opp.entryPrice)
      const exit = parseFloat(opp.exitPrice)
      const qty = parseFloat(opp.contracts || "1")
      if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
        const dir = opp.tradeDirection === "SHORT" ? -1 : 1
        const pnl = (exit - entry) * dir * qty * MNQ_TICK_VALUE
        result.pnl += pnl
        if (pnl > 0) result.winCount++
      }
    }
  }

  result.pnl = Math.round(result.pnl * 100) / 100
  return result
}

// GET /api/weekly-reports/[weekStart]
// 返回该周的周报内容 + 从 DailySession 自动计算的统计数据
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: weekStartStr } = await params
  const weekStart = parseWeekStart(weekStartStr)
  if (!weekStart) {
    return NextResponse.json({ success: false, error: "日期格式无效" }, { status: 400 })
  }

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)

  const [report, sessions] = await Promise.all([
    prisma.weeklyReport.findUnique({ where: { weekStart } }),
    prisma.dailySession.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      include: {
        setups: { include: { executions: true } },
        mnqPlan: true,
      },
    }),
  ])

  let totalPnL = 0
  let executedCount = 0
  let winCount = 0
  let missedCount = 0
  let totalSetups = 0

  // MNQ 汇总
  let mnqTotalPnL = 0
  let mnqTradeCount = 0
  let mnqWinCount = 0
  let mnqMissedCount = 0
  const mnqTimeframeStats = createEmptyTimeframeStats()

  const dailyBreakdown = sessions.map((session) => {
    let dayPnL = 0
    let dayExecuted = 0
    let dayMissed = 0
    for (const setup of session.setups) {
      totalSetups++
      if (setup.status === "MISSED") { missedCount++; dayMissed++ }
      if (setup.status === "EXECUTED") {
        executedCount++; dayExecuted++
        for (const ex of setup.executions) {
          if (ex.pnl !== null) {
            dayPnL += ex.pnl
            totalPnL += ex.pnl
            if (ex.pnl > 0) winCount++
          }
        }
      }
    }

    const mnqDay = calcMnqDayStats(session.mnqPlan)
    mnqTotalPnL += mnqDay.pnl
    mnqTradeCount += mnqDay.tradeCount
    mnqWinCount += mnqDay.winCount
    mnqMissedCount += mnqDay.missedCount
    for (const timeframe of MNQ_DECISION_TIMEFRAME_OPTIONS) {
      mnqTimeframeStats[timeframe].captured += mnqDay.timeframeStats[timeframe].captured
      mnqTimeframeStats[timeframe].missed += mnqDay.timeframeStats[timeframe].missed
    }

    return {
      date: session.date.toISOString().split("T")[0]!,
      pnl: Math.round(dayPnL * 100) / 100,
      executed: dayExecuted,
      missed: dayMissed,
      mnqPnl: mnqDay.pnl,
      mnqTrades: mnqDay.tradeCount,
      mnqMissed: mnqDay.missedCount,
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      report,
      stats: { totalPnL: Math.round(totalPnL * 100) / 100, executedCount, winCount, missedCount, totalSetups },
      dailyBreakdown,
      mnqStats: {
        totalPnL: Math.round(mnqTotalPnL * 100) / 100,
        tradeCount: mnqTradeCount,
        winCount: mnqWinCount,
        missedCount: mnqMissedCount,
        timeframeStats: mnqTimeframeStats,
      },
    },
  })
}

const UpdateSchema = z.object({
  summary:       z.string().optional(),
  strengths:     z.string().optional(),
  weaknesses:    z.string().optional(),
  keyLessons:    z.string().optional(),
  nextWeekPlan:  z.string().optional(),
  overallRating: z.number().int().min(1).max(5).nullable().optional(),
})

// PUT /api/weekly-reports/[weekStart]
// upsert 周报内容
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: weekStartStr } = await params
  const weekStart = parseWeekStart(weekStartStr)
  if (!weekStart) {
    return NextResponse.json({ success: false, error: "日期格式无效" }, { status: 400 })
  }

  const body = await req.json() as unknown
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "数据格式无效" }, { status: 400 })
  }

  try {
    const report = await prisma.weeklyReport.upsert({
      where: { weekStart },
      create: { weekStart, ...parsed.data },
      update: parsed.data,
    })
    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error("[PUT /api/weekly-reports/[weekStart]]", error)
    return NextResponse.json({ success: false, error: "保存失败" }, { status: 500 })
  }
}
