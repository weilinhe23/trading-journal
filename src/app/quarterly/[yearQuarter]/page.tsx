import { notFound } from "next/navigation"
import { format } from "date-fns"
import { prisma } from "~/lib/prisma"
import { QuarterlyReportClient } from "~/components/quarterly/QuarterlyReportClient"
import type {
  MonthSummary,
  RecurringLesson,
  PersistentIssue,
  QuarterlyTradeRecord,
  QuarterlyMnqMissedRecord,
  TradeMini,
} from "~/components/quarterly/QuarterlyReportClient"

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseYearQuarter(s: string): { year: number; quarter: number } | null {
  const m = /^(\d{4})-Q([1-4])$/.exec(s)
  if (!m) return null
  return { year: Number(m[1]), quarter: Number(m[2]) }
}

function quarterMonths(quarter: number): [number, number, number] {
  const start = (quarter - 1) * 3 + 1
  return [start, start + 1, start + 2]
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
  strategyName?: string | null
  tradeTypeName?: string | null
  entryApproach?: "DIRECT" | "PULLBACK" | null
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
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function extractLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text.split("\n").map((s) => s.trim()).filter(Boolean)
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ yearQuarter: string }>
}

export default async function QuarterlyDetailPage({ params }: PageProps) {
  const { yearQuarter } = await params
  const parsed = parseYearQuarter(yearQuarter)
  if (!parsed) notFound()
  const { year, quarter } = parsed

  const [m1, m2, m3] = quarterMonths(quarter)
  const qStart = new Date(Date.UTC(year, m1 - 1, 1))
  const qEnd   = new Date(Date.UTC(year, m3, 0, 23, 59, 59, 999))

  const monthYMs = [m1, m2, m3].map((m) => `${year}-${String(m).padStart(2, "0")}`)

  const [sessions, quarterlyReport, monthlyReports, weeklyReports, allSessions] = await Promise.all([
    prisma.dailySession.findMany({
      where: { date: { gte: qStart, lte: qEnd } },
      orderBy: { date: "asc" },
      include: {
        setups: { include: { executions: true }, orderBy: { createdAt: "asc" } },
        mnqPlan: true,
      },
    }),
    prisma.quarterlyReport.findUnique({ where: { yearQuarter } }),
    prisma.monthlyReport.findMany({ where: { yearMonth: { in: monthYMs } } }),
    prisma.weeklyReport.findMany({
      where: { weekStart: { gte: qStart, lte: qEnd } },
    }),
    prisma.dailySession.findMany({ select: { date: true }, orderBy: { date: "asc" } }),
  ])

  const monthlyReportMap = new Map(monthlyReports.map((r) => [r.yearMonth, r]))

  // ── group weekly reports by month ────────────────────────────────────────────
  const weeklyReportsByMonth = new Map<string, typeof weeklyReports>()
  for (const report of weeklyReports) {
    const d = report.weekStart
    const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
    const existing = weeklyReportsByMonth.get(ym) ?? []
    weeklyReportsByMonth.set(ym, [...existing, report])
  }

  // ── build per-month summaries ────────────────────────────────────────────────
  const months: MonthSummary[] = []
  const allTrades: QuarterlyTradeRecord[] = []
  const allMnqMissed: QuarterlyMnqMissedRecord[] = []
  let tradeIdx = 1
  let mnqIdx = 1
  let mnqMissedIdx = 1

  for (const monthNum of [m1, m2, m3]) {
    const ym = `${year}-${String(monthNum).padStart(2, "0")}`
    const monthStart = new Date(Date.UTC(year, monthNum - 1, 1))
    const monthEnd   = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999))
    const monthSessions = sessions.filter(
      (s) => s.date >= monthStart && s.date <= monthEnd
    )

    let monthPnL = 0
    let monthTrades = 0
    let monthWins = 0
    const regimes = { TREND: 0, CHOP: 0, RANGE: 0 }
    let planSum = 0, planN = 0
    let emotionSum = 0, emotionN = 0
    let focusSum = 0, focusN = 0
    const monthEquity: number[] = [0]
    let cumPnl = 0

    for (const session of monthSessions) {
      const dayLabel = DAY_LABELS[session.date.getUTCDay()] ?? "MON"

      if (session.planFollowed  != null) { planSum    += session.planFollowed;  planN++    }
      if (session.emotionRating != null) { emotionSum += session.emotionRating; emotionN++ }
      if (session.focusRating   != null) { focusSum   += session.focusRating;   focusN++   }

      const regime = mnqScenarioToRegime(session.mnqPlan?.scenario ?? null)
      if (regime === "TREND") regimes.TREND++
      else if (regime === "CHOP") regimes.CHOP++

      let dayPnL = 0
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
                yearMonth: ym,
                monthLabel: MONTH_NAMES[monthNum - 1]!,
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
            monthTrades++
            const entry = parseFloat(opp.entryPrice)
            const exit  = parseFloat(opp.exitPrice)
            const qty   = parseFloat(opp.contracts || "1")
            let oppPnl: number | null = null
            if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
              const dir = opp.tradeDirection === "SHORT" ? -1 : 1
              oppPnl = (exit - entry) * dir * qty * MNQ_TICK
              dayPnL   += oppPnl
              monthPnL += oppPnl
              if (oppPnl > 0) monthWins++
            }
            if (opp.tradeDirection !== null) {
              allTrades.push({
                id:            `M${String(mnqIdx++).padStart(2, "0")}`,
                yearMonth:     ym,
                monthLabel:    MONTH_NAMES[monthNum - 1]!,
                day:           dayLabel,
                time:          opp.entryTime || "",
                symbol:        "MNQ",
                direction:     opp.tradeDirection,
                entryPrice:    !isNaN(entry) && entry > 0 ? entry : null,
                exitPrice:     !isNaN(exit)  && exit  > 0 ? exit  : null,
                pnl:           oppPnl !== null ? Math.round(oppPnl * 100) / 100 : null,
                executionGrade: null,
                strategy:      opp.strategyName ?? (MNQ_SEG_LABELS[key] ?? "MNQ"),
                notes:         opp.description || null,
                tradeTypeName: opp.tradeTypeName ?? null,
                entryApproach: opp.entryApproach ?? null,
              })
            }
          }
        }
      }

      for (const setup of session.setups) {
        if (setup.status !== "EXECUTED") continue
        for (const ex of setup.executions) {
          allTrades.push({
            id:            `T${String(tradeIdx++).padStart(2, "0")}`,
            yearMonth:     ym,
            monthLabel:    MONTH_NAMES[monthNum - 1]!,
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
            tradeTypeName: null,
            entryApproach: null,
          })
        }
      }

      cumPnl += dayPnL
      monthEquity.push(Math.round(cumPnl * 100) / 100)
    }

    const scoreDims: number[] = []
    if (planN    > 0) scoreDims.push(Math.round((planSum    / planN)    * 20))
    if (emotionN > 0) scoreDims.push(Math.round((emotionSum / emotionN) * 20))
    if (focusN   > 0) scoreDims.push(Math.round((focusSum   / focusN)   * 20))
    const score =
      scoreDims.length > 0
        ? Math.round(scoreDims.reduce((s, d) => s + d, 0) / scoreDims.length)
        : monthlyReportMap.get(ym) !== undefined ? null : null  // no fallback here

    const lastDay  = new Date(Date.UTC(year, monthNum, 0))
    const rangeStr = `${format(monthStart, "MM/dd")} – ${format(lastDay, "MM/dd")}`

    months.push({
      yearMonth:   ym,
      monthLabel:  MONTH_NAMES[monthNum - 1]!,
      shortLabel:  MONTH_SHORT[monthNum - 1]!,
      range:       rangeStr,
      pnl:         Math.round(monthPnL  * 100) / 100,
      trades:      monthTrades,
      wins:        monthWins,
      winRate:     monthTrades > 0 ? Math.round((monthWins / monthTrades) * 100) : 0,
      score,
      insight:     monthlyReportMap.get(ym)?.monthInsight ?? null,
      regimes,
      equity:      monthEquity,
    })
  }

  // ── quarter equity (stitched) ────────────────────────────────────────────────
  const quarterEquity: number[] = []
  const monthBoundaryIndices: number[] = []
  let offset = 0
  for (let i = 0; i < months.length; i++) {
    const mEq = months[i]!.equity
    if (i === 0) {
      quarterEquity.push(...mEq)
    } else {
      for (let j = 1; j < mEq.length; j++) {
        quarterEquity.push(offset + mEq[j]!)
      }
    }
    offset = quarterEquity[quarterEquity.length - 1] ?? 0
    monthBoundaryIndices.push(quarterEquity.length - 1)
  }

  // ── aggregate stats ──────────────────────────────────────────────────────────
  const totalPnL        = Math.round(months.reduce((s, m) => s + m.pnl,    0) * 100) / 100
  const totalTrades     = months.reduce((s, m) => s + m.trades, 0)
  const winCount        = months.reduce((s, m) => s + m.wins,   0)
  const profitableMonths = months.filter((m) => m.pnl > 0).length
  const scoresWithData  = months.filter((m) => m.score !== null)
  const avgScore        = scoresWithData.length > 0
    ? Math.round(scoresWithData.reduce((s, m) => s + m.score!, 0) / scoresWithData.length)
    : null

  // ── recurring lessons (from WeeklyReport.keyLessons grouped by month) ────────
  const lessonMap = new Map<string, { text: string; months: string[] }>()
  for (const ym of monthYMs) {
    const reports = weeklyReportsByMonth.get(ym) ?? []
    const seenInMonth = new Set<string>()
    for (const report of reports) {
      for (const line of extractLines(report.keyLessons)) {
        const norm = line.toLowerCase()
        if (!seenInMonth.has(norm)) {
          seenInMonth.add(norm)
          const existing = lessonMap.get(norm)
          if (existing) {
            lessonMap.set(norm, { ...existing, months: [...existing.months, ym] })
          } else {
            lessonMap.set(norm, { text: line, months: [ym] })
          }
        }
      }
    }
  }

  const recurringLessons: RecurringLesson[] = [...lessonMap.values()]
    .filter(({ months: mths }) => new Set(mths).size >= 2)
    .map(({ text, months: mths }) => {
      const unique = [...new Set(mths)].sort()
      const labels = unique.map((ym) => {
        const mNum = parseInt(ym.split("-")[1] ?? "1")
        return MONTH_SHORT[mNum - 1] ?? ym
      })
      return {
        text,
        occurredIn: unique,
        occurredLabels: labels,
        severity: (unique.length >= 3 ? "high" : unique.length >= 2 ? "medium" : "low"),
      }
    })
    .sort((a, b) => b.occurredIn.length - a.occurredIn.length)

  // ── persistent issues (from WeeklyReport.weaknesses grouped by month) ────────
  const issueMap = new Map<string, { issue: string; months: string[] }>()
  for (const ym of monthYMs) {
    const reports = weeklyReportsByMonth.get(ym) ?? []
    const seenInMonth = new Set<string>()
    for (const report of reports) {
      for (const line of extractLines(report.weaknesses)) {
        const norm = line.toLowerCase()
        if (!seenInMonth.has(norm)) {
          seenInMonth.add(norm)
          const existing = issueMap.get(norm)
          if (existing) {
            issueMap.set(norm, { ...existing, months: [...existing.months, ym] })
          } else {
            issueMap.set(norm, { issue: line, months: [ym] })
          }
        }
      }
    }
  }

  const allMonthLabels = monthYMs.map((ym) => {
    const mNum = parseInt(ym.split("-")[1] ?? "1")
    return MONTH_SHORT[mNum - 1] ?? ym
  })

  const persistentIssues: PersistentIssue[] = [...issueMap.values()]
    .filter(({ months: mths }) => new Set(mths).size >= 2)
    .map(({ issue, months: mths }) => ({
      issue,
      monthsAffected: [...new Set(mths)].sort(),
      allMonthYMs:    monthYMs,
      allMonthLabels,
    }))
    .sort((a, b) => b.monthsAffected.length - a.monthsAffected.length)

  // ── best / worst trade ───────────────────────────────────────────────────────
  const sortedByPnl = allTrades
    .filter((t) => t.pnl !== null)
    .sort((a, b) => b.pnl! - a.pnl!)

  const toMini = (t: QuarterlyTradeRecord): TradeMini => ({
    yearMonth:  t.yearMonth,
    monthLabel: t.monthLabel,
    day:        t.day,
    symbol:     t.symbol,
    direction:  t.direction,
    pnl:        t.pnl!,
  })
  const bestTrade  = sortedByPnl.length > 0 ? toMini(sortedByPnl[0]!) : null
  const worstTrade = sortedByPnl.length > 1 ? toMini(sortedByPnl[sortedByPnl.length - 1]!) : null

  // ── quarter navigation ───────────────────────────────────────────────────────
  const allQuarters = [
    ...new Set(
      allSessions.map((s) => {
        const y = s.date.getUTCFullYear()
        const q = Math.ceil((s.date.getUTCMonth() + 1) / 3)
        return `${y}-Q${q}`
      })
    ),
  ].sort()
  const curIdx     = allQuarters.indexOf(yearQuarter)
  const prevQuarter = curIdx > 0                               ? (allQuarters[curIdx - 1] ?? null) : null
  const nextQuarter = curIdx >= 0 && curIdx < allQuarters.length - 1 ? (allQuarters[curIdx + 1] ?? null) : null

  // ── labels ───────────────────────────────────────────────────────────────────
  const quarterLabel = `Q${quarter} ${year}`
  const rangeStart   = sessions.length > 0 ? format(sessions[0]!.date, "MM/dd") : format(qStart, "MM/dd")
  const rangeEnd     = sessions.length > 0 ? format(sessions[sessions.length - 1]!.date, "MM/dd") : format(qEnd, "MM/dd")
  const range        = `${rangeStart} – ${rangeEnd}`

  return (
    <QuarterlyReportClient
      yearQuarter={yearQuarter}
      quarterLabel={quarterLabel}
      range={range}
      prevQuarter={prevQuarter}
      nextQuarter={nextQuarter}
      totalPnL={totalPnL}
      totalTrades={totalTrades}
      winCount={winCount}
      profitableMonths={profitableMonths}
      avgScore={avgScore}
      quarterEquity={quarterEquity}
      monthBoundaryIndices={monthBoundaryIndices}
      months={months}
      recurringLessons={recurringLessons}
      persistentIssues={persistentIssues}
      allTrades={allTrades}
      mnqMissed={allMnqMissed}
      bestTrade={bestTrade}
      worstTrade={worstTrade}
      initialInsight={quarterlyReport?.quarterInsight ?? null}
    />
  )
}
