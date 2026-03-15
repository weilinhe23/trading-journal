import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

function parseWeekStart(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const d = new Date(`${s}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
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
      include: { setups: { include: { executions: true } } },
    }),
  ])

  let totalPnL = 0
  let executedCount = 0
  let winCount = 0
  let missedCount = 0
  let totalSetups = 0

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
    return {
      date: session.date.toISOString().split("T")[0]!,
      pnl: Math.round(dayPnL * 100) / 100,
      executed: dayExecuted,
      missed: dayMissed,
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      report,
      stats: { totalPnL: Math.round(totalPnL * 100) / 100, executedCount, winCount, missedCount, totalSetups },
      dailyBreakdown,
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
