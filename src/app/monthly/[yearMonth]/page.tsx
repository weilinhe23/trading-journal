import { notFound } from "next/navigation"
import { format, getISOWeek } from "date-fns"
import { prisma } from "~/lib/prisma"
import { MonthlyReportClient } from "~/components/monthly/MonthlyReportClient"
import type {
  WeekSummary,
  RecurringLesson,
  PersistentIssue,
  MonthlyTradeRecord,
  MonthlyMnqMissedRecord,
  TradeMini,
} from "~/components/monthly/MonthlyReportClient"

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseYearMonth(s: string): { year: number; month: number } | null {
  if (!/^\d{4}-\d{2}$/.test(s)) return null
  const parts = s.split("-").map(Number) as [number, number]
  const [year, month] = parts
  if (!year || !month || month < 1 || month > 12) return null
  return { year, month }
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

interface MnqOpp {
  captured: boolean | null
  tradeDirection: "LONG" | "SHORT" | null
  entryPrice: string
  exitPrice: string
  contracts: string
  entryTime: string
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
}

function parseMnqOpps(raw: string | null | undefined): MnqOpp[] {
  if (!raw) return []
  try {
    const seg = JSON.parse(raw) as { opportunities?: MnqOpp[] }
    return seg.opportunities ?? []
  } catch {
    return []
  }
}

const MNQ_TICK = 2
const MNQ_SEG_LABELS: Record<string, string> = {
  marketPreJson: "MNQ盘前",
  marketOpenJson: "MNQ开盘",
  marketMidJson: "MNQ盘中",
  marketAfternoonJson: "MNQ午盘",
}

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function extractLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text.split("\n").map((s) => s.trim()).filter(Boolean)
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ yearMonth: string }>
}

export default async function MonthlyDetailPage({ params }: PageProps) {
  const { yearMonth } = await params
  const parsed = parseYearMonth(yearMonth)
  if (!parsed) notFound()
  const { year, month } = parsed

  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
  const queryStart = getMondayOf(monthStart)

  const [sessions, monthlyReport, allSessions] = await Promise.all([
    prisma.dailySession.findMany({
      where: { date: { gte: queryStart, lte: monthEnd } },
      orderBy: { date: "asc" },
      include: {
        setups: { include: { executions: true }, orderBy: { createdAt: "asc" } },
        mnqPlan: true,
      },
    }),
    prisma.monthlyReport.findUnique({ where: { yearMonth } }),
    prisma.dailySession.findMany({ select: { date: true }, orderBy: { date: "asc" } }),
  ])

  // ── group sessions by week (Monday) ─────────────────────────────────────────
  const weekMap = new Map<string, typeof sessions>()
  for (const session of sessions) {
    const monday = getMondayOf(session.date)
    const key = monday.toISOString().split("T")[0]!
    const existing = weekMap.get(key) ?? []
    weekMap.set(key, [...existing, session])
  }
  const weekStarts = [...weekMap.keys()].sort()

  // ── fetch WeeklyReport records ───────────────────────────────────────────────
  const weekStartDates = weekStarts.map((s) => new Date(`${s}T00:00:00.000Z`))
  const weeklyReports = await prisma.weeklyReport.findMany({
    where: { weekStart: { in: weekStartDates } },
  })
  const weeklyReportMap = new Map(
    weeklyReports.map((r) => [r.weekStart.toISOString().split("T")[0]!, r])
  )

  // ── build week summaries ─────────────────────────────────────────────────────
  const weeks: WeekSummary[] = []
  const allTrades: MonthlyTradeRecord[] = []
  const allMnqMissed: MonthlyMnqMissedRecord[] = []
  let tradeIdx = 1
  let mnqIdx = 1
  let mnqMissedIdx = 1

  for (const weekStartStr of weekStarts) {
    const weekSessions = weekMap.get(weekStartStr) ?? []
    const weekReport = weeklyReportMap.get(weekStartStr) ?? null
    const weekStartDate = new Date(`${weekStartStr}T00:00:00.000Z`)
    const friday = new Date(weekStartDate)
    friday.setUTCDate(friday.getUTCDate() + 4)
    const weekNum = getISOWeek(weekStartDate)
    const dateRange = `${format(weekStartDate, "MM/dd")} – ${format(friday, "MM/dd")}`

    let weekPnL = 0
    let weekTrades = 0
    let weekWins = 0
    const regimes = { TREND: 0, CHOP: 0, RANGE: 0 }
    let planSum = 0, planN = 0
    let emotionSum = 0, emotionN = 0
    let focusSum = 0, focusN = 0
    const weekEquity: number[] = [0]
    let cumPnl = 0

    for (const session of weekSessions) {
      const dayLabel = DAY_LABELS[session.date.getUTCDay()] ?? "MON"

      // ratings
      if (session.planFollowed != null) { planSum += session.planFollowed; planN++ }
      if (session.emotionRating != null) { emotionSum += session.emotionRating; emotionN++ }
      if (session.focusRating != null) { focusSum += session.focusRating; focusN++ }

      // regime
      const regime = mnqScenarioToRegime(session.mnqPlan?.scenario ?? null)
      if (regime === "TREND") regimes.TREND++
      else if (regime === "CHOP") regimes.CHOP++

      let dayPnL = 0

      // MNQ trades
      const plan = session.mnqPlan
      if (plan) {
        const segs = [
          { key: "marketPreJson",       raw: plan.marketPreJson },
          { key: "marketOpenJson",      raw: plan.marketOpenJson },
          { key: "marketMidJson",       raw: plan.marketMidJson },
          { key: "marketAfternoonJson", raw: plan.marketAfternoonJson },
        ]
        for (const { key, raw } of segs) {
          for (const opp of parseMnqOpps(raw)) {
            if (opp.captured === false) {
              const riskPts = opp.missedRiskPts ? parseFloat(opp.missedRiskPts) : null
              const returnPts = opp.missedReturnPts ? parseFloat(opp.missedReturnPts) : null
              allMnqMissed.push({
                id: `X${String(mnqMissedIdx++).padStart(2, "0")}`,
                weekNum,
                weekStart: weekStartStr,
                day: dayLabel,
                segment: MNQ_SEG_LABELS[key] ?? "MNQ",
                description: opp.description || "",
                missedProcess: opp.missedProcess ?? "",
                riskPts: riskPts !== null && !isNaN(riskPts) ? riskPts : null,
                returnPts: returnPts !== null && !isNaN(returnPts) ? returnPts : null,
                tradeDirection: opp.tradeDirection ?? null,
                strategyName: opp.strategyName ?? null,
                tradeTypeName: opp.tradeTypeName ?? null,
                entryApproach: opp.entryApproach ?? null,
              })
              continue
            }
            if (opp.captured !== true) continue
            weekTrades++
            const entry = parseFloat(opp.entryPrice)
            const exit  = parseFloat(opp.exitPrice)
            const qty   = parseFloat(opp.contracts || "1")
            let oppPnl: number | null = null
            if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
              const dir = opp.tradeDirection === "SHORT" ? -1 : 1
              oppPnl = (exit - entry) * dir * qty * MNQ_TICK
              dayPnL += oppPnl
              weekPnL += oppPnl
              if (oppPnl > 0) weekWins++
            }
            if (opp.tradeDirection !== null) {
              const stopPx = opp.stopPrice ? parseFloat(opp.stopPrice) : null
              const targetPx = opp.targetPrice ? parseFloat(opp.targetPrice) : null
              const riskPts = opp.plannedRiskPts ? parseFloat(opp.plannedRiskPts) : null
              const maePts = opp.maxDrawdownPts ? parseFloat(opp.maxDrawdownPts) : null
              const mfePts = opp.maxFavorablePts ? parseFloat(opp.maxFavorablePts) : null
              allTrades.push({
                id:            `M${String(mnqIdx++).padStart(2, "0")}`,
                weekNum,
                weekStart:     weekStartStr,
                day:           dayLabel,
                time:          opp.entryTime || "",
                symbol:        "MNQ",
                direction:     opp.tradeDirection,
                entryPrice:    !isNaN(entry) && entry > 0 ? entry : null,
                exitPrice:     !isNaN(exit) && exit > 0 ? exit : null,
                pnl:           oppPnl !== null ? Math.round(oppPnl * 100) / 100 : null,
                executionGrade: null,
                strategy:      opp.strategyName ?? (MNQ_SEG_LABELS[key] ?? "MNQ"),
                notes:         opp.description || null,
                tradeTypeName: opp.tradeTypeName ?? null,
                entryApproach: opp.entryApproach ?? null,
                stopPrice:     stopPx !== null && !isNaN(stopPx) ? stopPx : null,
                targetPrice:   targetPx !== null && !isNaN(targetPx) ? targetPx : null,
                tradeResult:   opp.tradeResult ?? null,
                tradeResultNote: opp.tradeResultNote ?? null,
                plannedRiskPts: riskPts !== null && !isNaN(riskPts) ? riskPts : null,
                maxDrawdownPts: maePts !== null && !isNaN(maePts) ? maePts : null,
                maxFavorablePts: mfePts !== null && !isNaN(mfePts) ? mfePts : null,
                heldOvernight: opp.heldOvernight ?? false,
                overnightReason: opp.overnightReason ?? null,
              })
            }
          }
        }
      }

      // TradeSetup executions
      for (const setup of session.setups) {
        if (setup.status !== "EXECUTED") continue
        for (const ex of setup.executions) {
          allTrades.push({
            id:            `T${String(tradeIdx++).padStart(2, "0")}`,
            weekNum,
            weekStart:     weekStartStr,
            day:           dayLabel,
            time:          ex.entryTime.toISOString().slice(11, 16),
            symbol:        setup.symbol,
            direction:     setup.direction as "LONG" | "SHORT",
            entryPrice:    ex.entryPrice,
            exitPrice:     ex.exitPrice ?? null,
            pnl:           ex.pnl != null ? Math.round(ex.pnl * 100) / 100 : null,
            executionGrade: ex.executionGrade as "A" | "B" | "C" | "D" | null,
            strategy:      setup.strategy ?? null,
            notes:         ex.executionNotes ?? null,
            stopPrice:     null,
            targetPrice:   null,
            tradeResult:   null,
            tradeResultNote: null,
            plannedRiskPts: null,
            maxDrawdownPts: null,
            maxFavorablePts: null,
            heldOvernight: false,
            overnightReason: null,
            tradeTypeName: null,
            entryApproach: null,
          })
        }
      }

      cumPnl += dayPnL
      weekEquity.push(Math.round(cumPnl * 100) / 100)
    }

    // system score
    const scoreDims: number[] = []
    if (planN > 0)    scoreDims.push(Math.round((planSum    / planN)    * 20))
    if (emotionN > 0) scoreDims.push(Math.round((emotionSum / emotionN) * 20))
    if (focusN > 0)   scoreDims.push(Math.round((focusSum   / focusN)   * 20))
    const score =
      scoreDims.length > 0
        ? Math.round(scoreDims.reduce((s, d) => s + d, 0) / scoreDims.length)
        : weekReport?.overallRating
          ? weekReport.overallRating * 20
          : null

    weeks.push({
      weekStart:  weekStartStr,
      weekNum,
      range:      dateRange,
      pnl:        Math.round(weekPnL * 100) / 100,
      trades:     weekTrades,
      wins:       weekWins,
      winRate:    weekTrades > 0 ? Math.round((weekWins / weekTrades) * 100) : 0,
      score,
      summary:    weekReport?.summary ?? null,
      highlight:  extractLines(weekReport?.strengths)[0] ?? null,
      weakness:   extractLines(weekReport?.weaknesses)[0] ?? null,
      lesson:     extractLines(weekReport?.keyLessons)[0] ?? null,
      regimes,
      equity:     weekEquity,
    })
  }

  // ── month equity (stitched) ──────────────────────────────────────────────────
  const monthEquity: number[] = []
  const weekBoundaryIndices: number[] = []
  let offset = 0
  for (let i = 0; i < weeks.length; i++) {
    const wEq = weeks[i]!.equity
    if (i === 0) {
      monthEquity.push(...wEq)
    } else {
      for (let j = 1; j < wEq.length; j++) {
        monthEquity.push(offset + wEq[j]!)
      }
    }
    offset = monthEquity[monthEquity.length - 1] ?? 0
    weekBoundaryIndices.push(monthEquity.length - 1)
  }

  // ── aggregate stats ──────────────────────────────────────────────────────────
  const totalPnL        = Math.round(weeks.reduce((s, w) => s + w.pnl, 0) * 100) / 100
  const totalTrades     = weeks.reduce((s, w) => s + w.trades, 0)
  const winCount        = weeks.reduce((s, w) => s + w.wins, 0)
  const profitableWeeks = weeks.filter((w) => w.pnl > 0).length
  const scoresWithData  = weeks.filter((w) => w.score !== null)
  const avgScore        = scoresWithData.length > 0
    ? Math.round(scoresWithData.reduce((s, w) => s + w.score!, 0) / scoresWithData.length)
    : null

  // ── recurring lessons ────────────────────────────────────────────────────────
  const lessonMap = new Map<string, { text: string; weekNums: number[] }>()
  for (const week of weeks) {
    const report = weeklyReportMap.get(week.weekStart)
    for (const line of extractLines(report?.keyLessons)) {
      const norm = line.toLowerCase()
      const existing = lessonMap.get(norm)
      if (existing) {
        lessonMap.set(norm, { ...existing, weekNums: [...existing.weekNums, week.weekNum] })
      } else {
        lessonMap.set(norm, { text: line, weekNums: [week.weekNum] })
      }
    }
  }
  const recurringLessons: RecurringLesson[] = [...lessonMap.values()]
    .filter(({ weekNums }) => new Set(weekNums).size >= 2)
    .map(({ text, weekNums }) => {
      const unique = [...new Set(weekNums)].sort()
      return {
        text,
        occurredIn: unique,
        severity: (unique.length >= 3 ? "high" : unique.length >= 2 ? "medium" : "low") as "high" | "medium" | "low",
      }
    })
    .sort((a, b) => b.occurredIn.length - a.occurredIn.length)

  // ── persistent issues (from weaknesses) ─────────────────────────────────────
  const issueMap = new Map<string, { issue: string; weekNums: number[] }>()
  for (const week of weeks) {
    const report = weeklyReportMap.get(week.weekStart)
    for (const line of extractLines(report?.weaknesses)) {
      const norm = line.toLowerCase()
      const existing = issueMap.get(norm)
      if (existing) {
        issueMap.set(norm, { ...existing, weekNums: [...existing.weekNums, week.weekNum] })
      } else {
        issueMap.set(norm, { issue: line, weekNums: [week.weekNum] })
      }
    }
  }
  const allWeekNums = weeks.map((w) => w.weekNum)
  const persistentIssues: PersistentIssue[] = [...issueMap.values()]
    .filter(({ weekNums }) => [...new Set(weekNums)].length >= 2)
    .map(({ issue, weekNums }) => ({
      issue,
      weeksAffected: [...new Set(weekNums)].sort(),
      allWeekNums,
    }))
    .sort((a, b) => b.weeksAffected.length - a.weeksAffected.length)

  // ── best / worst trade ───────────────────────────────────────────────────────
  const sortedByPnl = allTrades
    .filter((t) => t.pnl !== null)
    .sort((a, b) => b.pnl! - a.pnl!)

  const toMini = (t: MonthlyTradeRecord): TradeMini => ({
    weekNum: t.weekNum,
    day: t.day,
    symbol: t.symbol,
    direction: t.direction,
    pnl: t.pnl!,
  })
  const bestTrade  = sortedByPnl.length > 0 ? toMini(sortedByPnl[0]!) : null
  const worstTrade = sortedByPnl.length > 1 ? toMini(sortedByPnl[sortedByPnl.length - 1]!) : null

  // ── month navigation ─────────────────────────────────────────────────────────
  const allMonths = [
    ...new Set(
      allSessions.map((s) => {
        const d = s.date
        return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
      })
    ),
  ].sort()
  const curIdx   = allMonths.indexOf(yearMonth)
  const prevMonth = curIdx > 0                              ? (allMonths[curIdx - 1] ?? null) : null
  const nextMonth = curIdx >= 0 && curIdx < allMonths.length - 1 ? (allMonths[curIdx + 1] ?? null) : null

  // ── labels ───────────────────────────────────────────────────────────────────
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`
  const rangeStart = sessions.length > 0 ? format(sessions[0]!.date, "MM/dd") : format(monthStart, "MM/dd")
  const rangeEnd   = sessions.length > 0 ? format(sessions[sessions.length - 1]!.date, "MM/dd") : format(monthEnd, "MM/dd")
  const range      = `${rangeStart} – ${rangeEnd}`

  return (
    <MonthlyReportClient
      yearMonth={yearMonth}
      monthLabel={monthLabel}
      range={range}
      prevMonth={prevMonth}
      nextMonth={nextMonth}
      totalPnL={totalPnL}
      totalTrades={totalTrades}
      winCount={winCount}
      profitableWeeks={profitableWeeks}
      avgScore={avgScore}
      monthEquity={monthEquity}
      weekBoundaryIndices={weekBoundaryIndices}
      weeks={weeks}
      recurringLessons={recurringLessons}
      persistentIssues={persistentIssues}
      allTrades={allTrades}
      mnqMissed={allMnqMissed}
      bestTrade={bestTrade}
      worstTrade={worstTrade}
      initialInsight={monthlyReport?.monthInsight ?? null}
    />
  )
}
