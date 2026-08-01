import { notFound } from "next/navigation"
import { format, getISOWeek, getYear } from "date-fns"
import { zhCN } from "date-fns/locale"
import { prisma } from "~/lib/prisma"
import { WeeklyReportClient } from "~/components/weekly/WeeklyReportClient"
import type { DayRecord, TradeRecord, MissedRecord, MnqMissedRecord, MnqTimeframeStat, SegmentAccuracyRecord } from "~/components/weekly/WeeklyReportClient"
import { isMnqDecisionTimeframe, type MnqDecisionTimeframe } from "~/types"

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const

function parseWeekStart(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  const d = new Date(`${s}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function mnqScenarioToRegime(scenario: string | null): "TREND" | "CHOP" | null {
  if (!scenario) return null
  if (scenario.startsWith("TREND")) return "TREND"
  if (scenario === "RANGE_SWEEP") return "CHOP"
  return null
}

function parseMnqOpps(raw: string | null | undefined) {
  if (!raw) return []
  try {
    const seg = JSON.parse(raw) as {
      opportunities?: Array<{
        captured: boolean | null
        decisionTimeframe?: MnqDecisionTimeframe | null
        tradeDirection: "LONG" | "SHORT" | null
        entryPrice: string
        exitPrice: string
        contracts: string
        entryTime: string
        exitTime: string
        description: string
        strategyId?: string | null
        strategyName?: string | null
        tradeTypeId?: string | null
        tradeTypeName?: string | null
        entryApproach?: "DIRECT" | "PULLBACK" | null
        stopPrice?: string | null
        targetPrice?: string | null
        tradeResult?: string | null
        tradeResultNote?: string | null
        plannedRiskPts?: string | null
        maxDrawdownPts?: string | null
        maxFavorablePts?: string | null
        heldOvernight?: boolean | null
        overnightReason?: string | null
        missedRiskPts?: string | null
        missedReturnPts?: string | null
        missedProcess?: string | null
        entryAccuracy?: "CORRECT" | "WRONG" | null
        entryAccuracyNote?: string | null
        exitAccuracy?: "CORRECT" | "WRONG" | null
        exitAccuracyNote?: string | null
      }>
    }
    return seg.opportunities ?? []
  } catch {
    return []
  }
}

function parseSegmentAccuracy(raw: string | null | undefined): "CORRECT" | "WRONG" | null {
  if (!raw) return null
  try {
    const seg = JSON.parse(raw) as { accuracy?: string | null }
    const acc = seg.accuracy
    return acc === "CORRECT" || acc === "WRONG" ? acc : null
  } catch { return null }
}

const MNQ_SEGMENT_LABELS: Record<string, string> = {
  marketPreJson:       "MNQ盘前",
  marketOpenJson:      "MNQ开盘",
  marketMidJson:       "MNQ盘中",
  marketAfternoonJson: "MNQ午盘",
}

function parseFirstTradeType(json: string): string | null {
  try {
    const arr = JSON.parse(json) as string[]
    return arr.length > 0 ? (arr[0] ?? null) : null
  } catch { return null }
}

interface PageProps {
  params: Promise<{ weekStart: string }>
}

export default async function WeeklyDetailPage({ params }: PageProps) {
  const { weekStart: weekStartStr } = await params
  const weekStart = parseWeekStart(weekStartStr)
  if (!weekStart) notFound()

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)

  const friday = new Date(weekStart)
  friday.setUTCDate(friday.getUTCDate() + 4)

  const MNQ_TICK = 2

  const [report, sessions, allSessions] = await Promise.all([
    prisma.weeklyReport.findUnique({ where: { weekStart } }),
    prisma.dailySession.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      include: {
        setups: {
          include: { executions: true },
          orderBy: { createdAt: "asc" },
        },
        mnqPlan: true,
      },
    }),
    prisma.dailySession.findMany({ select: { date: true }, orderBy: { date: "asc" } }),
  ])

  // ── aggregate stats ──────────────────────────────────────────────────────────
  let totalPnL = 0
  let executedCount = 0
  let winCount = 0
  let missedCount = 0
  let totalSetups = 0
  let mnqTotalPnL = 0
  let mnqTradeCount = 0
  let mnqWinCount = 0
  let mnqMissedCount = 0

  // system score components (today's rating fields only)
  let planSum = 0, planN = 0
  let emotionSum = 0, emotionN = 0
  let focusSum = 0, focusN = 0

  const days: DayRecord[] = []
  const trades: TradeRecord[] = []
  const missed: MissedRecord[] = []
  const mnqMissed: MnqMissedRecord[] = []
  const timeframeStatsMap = new Map<MnqDecisionTimeframe | null, MnqTimeframeStat>()
  const getTimeframeStat = (timeframe: MnqDecisionTimeframe | null) => {
    const existing = timeframeStatsMap.get(timeframe)
    if (existing) return existing
    const created = { timeframe, captured: 0, missed: 0, pnl: 0 }
    timeframeStatsMap.set(timeframe, created)
    return created
  }
  let tradeIndex = 1
  let mnqIndex = 1
  let mnqMissedIndex = 1

  const segAccMap: Record<string, { totalDays: number; correctDays: number; wrongDays: number }> = {
    "MNQ盘前": { totalDays: 0, correctDays: 0, wrongDays: 0 },
    "MNQ开盘": { totalDays: 0, correctDays: 0, wrongDays: 0 },
    "MNQ盘中": { totalDays: 0, correctDays: 0, wrongDays: 0 },
    "MNQ午盘": { totalDays: 0, correctDays: 0, wrongDays: 0 },
  }

  for (const session of sessions) {
    const dayLabel = DAY_LABELS[session.date.getUTCDay()] ?? "MON"
    const dateStr = session.date.toISOString().split("T")[0]!
    let dayPnL = 0
    let dayExecuted = 0
    let dayMissed = 0

    // session-level ratings
    if (session.planFollowed != null) { planSum += session.planFollowed; planN++ }
    if (session.emotionRating != null) { emotionSum += session.emotionRating; emotionN++ }
    if (session.focusRating != null) { focusSum += session.focusRating; focusN++ }

    for (const setup of session.setups) {
      totalSetups++

      if (setup.status === "MISSED") {
        missedCount++
        dayMissed++
        missed.push({
          day: dayLabel,
          symbol: setup.symbol,
          direction: setup.direction as "LONG" | "SHORT",
          reason: setup.missedReason ?? null,
          hypoPnl: setup.missedHypoPnL ?? null,
          strategy: setup.strategy ?? null,
          tradeTypeName: parseFirstTradeType(setup.selectedTradeTypes),
        })
      }

      if (setup.status === "EXECUTED") {
        executedCount++
        dayExecuted++

        for (const ex of setup.executions) {
          if (ex.pnl != null) {
            dayPnL += ex.pnl
            totalPnL += ex.pnl
            if (ex.pnl > 0) winCount++
          }

          const timeStr = ex.entryTime.toISOString().slice(11, 16)
          trades.push({
            id: `T${String(tradeIndex++).padStart(2, "0")}`,
            day: dayLabel,
            time: timeStr,
            symbol: setup.symbol,
            direction: setup.direction as "LONG" | "SHORT",
            entryPrice: ex.entryPrice,
            exitPrice: ex.exitPrice ?? null,
            pnl: ex.pnl != null ? Math.round(ex.pnl * 100) / 100 : null,
            executionGrade: (ex.executionGrade as "A" | "B" | "C" | "D" | null) ?? null,
            strategy: setup.strategy ?? null,
            notes: ex.executionNotes ?? null,
            stopPrice: null,
            targetPrice: null,
            tradeResult: null,
            tradeResultNote: null,
            plannedRiskPts: null,
            maxDrawdownPts: null,
            maxFavorablePts: null,
            heldOvernight: false,
            overnightReason: null,
            tradeTypeName: parseFirstTradeType(setup.selectedTradeTypes),
            entryApproach: null,
            decisionTimeframe: null,
            entryAccuracy: null,
            entryAccuracyNote: null,
            exitAccuracy: null,
            exitAccuracyNote: null,
            segment: null,
          })
        }
      }
    }

    // MNQ stats
    let mnqDayPnL = 0
    let mnqDayTrades = 0
    let mnqDayMissed = 0
    const plan = session.mnqPlan
    if (plan) {
      const MNQ_SEGS = [
        { key: "marketPreJson",       raw: plan.marketPreJson },
        { key: "marketOpenJson",      raw: plan.marketOpenJson },
        { key: "marketMidJson",       raw: plan.marketMidJson },
        { key: "marketAfternoonJson", raw: plan.marketAfternoonJson },
      ]
      for (const { key, raw } of MNQ_SEGS) {
        const segLabel = MNQ_SEGMENT_LABELS[key] ?? "MNQ"
        const segAcc = parseSegmentAccuracy(raw)
        const segEntry = segAccMap[segLabel]
        if (segEntry && (segAcc !== null || parseMnqOpps(raw).length > 0)) {
          segEntry.totalDays++
          if (segAcc === "CORRECT") segEntry.correctDays++
          else if (segAcc === "WRONG") segEntry.wrongDays++
        }
        for (const opp of parseMnqOpps(raw)) {
          const decisionTimeframe = isMnqDecisionTimeframe(opp.decisionTimeframe) ? opp.decisionTimeframe : null
          if (opp.captured === false) {
            mnqMissedCount++; mnqDayMissed++
            getTimeframeStat(decisionTimeframe).missed++
            const riskPts = opp.missedRiskPts ? parseFloat(opp.missedRiskPts) : null
            const returnPts = opp.missedReturnPts ? parseFloat(opp.missedReturnPts) : null
            mnqMissed.push({
              id: `X${String(mnqMissedIndex++).padStart(2, "0")}`,
              day: dayLabel,
              segment: MNQ_SEGMENT_LABELS[key] ?? "MNQ",
              description: opp.description || "",
              missedProcess: opp.missedProcess ?? "",
              riskPts: riskPts !== null && !isNaN(riskPts) ? riskPts : null,
              returnPts: returnPts !== null && !isNaN(returnPts) ? returnPts : null,
              tradeDirection: opp.tradeDirection ?? null,
              strategyName: opp.strategyName ?? null,
              tradeTypeName: opp.tradeTypeName ?? null,
              entryApproach: opp.entryApproach ?? null,
              decisionTimeframe,
            })
            continue
          }
          if (opp.captured !== true) continue
          mnqDayTrades++
          mnqTradeCount++
          const timeframeStat = getTimeframeStat(decisionTimeframe)
          timeframeStat.captured++
          const entry = parseFloat(opp.entryPrice)
          const exit = parseFloat(opp.exitPrice)
          const qty = parseFloat(opp.contracts || "1")
          let oppPnl: number | null = null
          if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
            const dir = opp.tradeDirection === "SHORT" ? -1 : 1
            oppPnl = (exit - entry) * dir * qty * MNQ_TICK
            mnqDayPnL += oppPnl
            mnqTotalPnL += oppPnl
            if (oppPnl > 0) mnqWinCount++
            timeframeStat.pnl += oppPnl
          }
          if (opp.tradeDirection !== null) {
            const stopPx = opp.stopPrice ? parseFloat(opp.stopPrice) : null
            const targetPx = opp.targetPrice ? parseFloat(opp.targetPrice) : null
            const riskPts = opp.plannedRiskPts ? parseFloat(opp.plannedRiskPts) : null
            const maePts = opp.maxDrawdownPts ? parseFloat(opp.maxDrawdownPts) : null
            const mfePts = opp.maxFavorablePts ? parseFloat(opp.maxFavorablePts) : null
            trades.push({
              id: `M${String(mnqIndex++).padStart(2, "0")}`,
              day: dayLabel,
              time: opp.entryTime || "",
              symbol: "MNQ",
              direction: opp.tradeDirection,
              entryPrice: !isNaN(entry) && entry > 0 ? entry : 0,
              exitPrice: !isNaN(exit) && exit > 0 ? exit : null,
              pnl: oppPnl !== null ? Math.round(oppPnl * 100) / 100 : null,
              executionGrade: null,
              strategy: opp.strategyName ?? null,
              notes: opp.description || null,
              tradeTypeName: opp.tradeTypeName ?? null,
              entryApproach: opp.entryApproach ?? null,
              decisionTimeframe,
              stopPrice: stopPx !== null && !isNaN(stopPx) ? stopPx : null,
              targetPrice: targetPx !== null && !isNaN(targetPx) ? targetPx : null,
              tradeResult: opp.tradeResult ?? null,
              tradeResultNote: opp.tradeResultNote ?? null,
              plannedRiskPts: riskPts !== null && !isNaN(riskPts) ? riskPts : null,
              maxDrawdownPts: maePts !== null && !isNaN(maePts) ? maePts : null,
              maxFavorablePts: mfePts !== null && !isNaN(mfePts) ? mfePts : null,
              heldOvernight: opp.heldOvernight ?? false,
              overnightReason: opp.overnightReason ?? null,
              entryAccuracy: opp.entryAccuracy ?? null,
              entryAccuracyNote: opp.entryAccuracyNote ?? null,
              exitAccuracy: opp.exitAccuracy ?? null,
              exitAccuracyNote: opp.exitAccuracyNote ?? null,
              segment: MNQ_SEGMENT_LABELS[key] ?? null,
            })
          }
        }
      }
    }

    days.push({
      date: dateStr,
      dayLabel,
      regime: mnqScenarioToRegime(plan?.scenario ?? null),
      pnl: Math.round(mnqDayPnL * 100) / 100,
      tradeCount: mnqDayTrades,
      missedCount: mnqDayMissed,
      note: session.lessonsLearned ?? session.whatWentWell ?? null,
      planFollowed: session.planFollowed ?? null,
      emotionRating: session.emotionRating ?? null,
      focusRating: session.focusRating ?? null,
    })
  }

  // equity curve: cumulative PnL delta
  const equity: number[] = [0]
  let cumPnl = 0
  for (const day of days) {
    cumPnl += day.pnl
    equity.push(Math.round(cumPnl * 100) / 100)
  }

  // system score — from daily rating fields (planFollowed / emotionRating / focusRating, 1-5 → 0-100)
  const winRate = mnqTradeCount > 0 ? Math.round((mnqWinCount / mnqTradeCount) * 100) : null
  const planScore    = planN    > 0 ? Math.round((planSum    / planN)    * 20) : null
  const emotionScore = emotionN > 0 ? Math.round((emotionSum / emotionN) * 20) : null
  const focusScore   = focusN   > 0 ? Math.round((focusSum   / focusN)   * 20) : null

  const scoreDims = [
    { label: "遵守计划", score: planScore },
    { label: "情绪管理", score: emotionScore },
    { label: "专注度",   score: focusScore },
  ].filter((d) => d.score !== null) as { label: string; score: number }[]

  const systemScoreTotal =
    scoreDims.length > 0
      ? Math.round(scoreDims.reduce((s, d) => s + d.score, 0) / scoreDims.length)
      : null

  // prev/next week navigation
  const uniqueMondays = [
    ...new Set(allSessions.map((s) => getMondayOf(s.date).toISOString().split("T")[0]!)),
  ].sort()
  const currentIdx = uniqueMondays.indexOf(weekStartStr)
  const prevWeek = currentIdx > 0 ? (uniqueMondays[currentIdx - 1] ?? null) : null
  const nextWeek =
    currentIdx >= 0 && currentIdx < uniqueMondays.length - 1
      ? (uniqueMondays[currentIdx + 1] ?? null)
      : null

  const weekNum = getISOWeek(weekStart)
  const year = getYear(weekStart)
  const dateRange = `${format(weekStart, "MM/dd", { locale: zhCN })} – ${format(friday, "MM/dd", { locale: zhCN })}`
  const weekLabel = `${year}年 第${weekNum}周  (${dateRange})`

  return (
    <WeeklyReportClient
      weekStart={weekStartStr}
      prevWeek={prevWeek}
      nextWeek={nextWeek}
      weekLabel={weekLabel}
      weekNum={weekNum}
      year={year}
      dateRange={dateRange}
      initialReport={
        report
          ? {
              summary: report.summary,
              strengths: report.strengths,
              weaknesses: report.weaknesses,
              keyLessons: report.keyLessons,
              nextWeekPlan: report.nextWeekPlan,
              overallRating: report.overallRating,
            }
          : null
      }
      stats={{
        totalPnL: Math.round(mnqTotalPnL * 100) / 100,
        executedCount: mnqTradeCount,
        winCount: mnqWinCount,
        missedCount: mnqMissedCount,
        totalSetups: mnqTradeCount + mnqMissedCount,
      }}
      days={days}
      trades={trades}
      missed={missed}
      mnqMissed={mnqMissed}
      timeframeStats={[...timeframeStatsMap.values()].map((stat) => ({
        ...stat,
        pnl: Math.round(stat.pnl * 100) / 100,
      }))}
      equity={equity}
      systemScore={
        systemScoreTotal !== null
          ? { total: systemScoreTotal, dims: scoreDims }
          : null
      }
      segmentAccuracy={
        Object.entries(segAccMap).map(([segment, v]) => ({
          segment,
          totalDays: v.totalDays,
          correctDays: v.correctDays,
          wrongDays: v.wrongDays,
        })) as SegmentAccuracyRecord[]
      }
    />
  )
}
