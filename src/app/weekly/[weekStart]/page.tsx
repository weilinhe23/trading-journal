import { notFound } from "next/navigation"
import { format, getISOWeek, getYear } from "date-fns"
import { zhCN } from "date-fns/locale"
import { prisma } from "~/lib/prisma"
import { WeeklyReportClient } from "~/components/weekly/WeeklyReportClient"

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

  const [report, sessions, allSessions] = await Promise.all([
    prisma.weeklyReport.findUnique({ where: { weekStart } }),
    prisma.dailySession.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      include: { setups: { include: { executions: true } } },
    }),
    prisma.dailySession.findMany({ select: { date: true }, orderBy: { date: "asc" } }),
  ])

  // Compute stats + daily breakdown
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

  // Prev / next week navigation (only weeks that have sessions)
  const uniqueMondays = [
    ...new Set(allSessions.map((s) => getMondayOf(s.date).toISOString().split("T")[0]!)),
  ].sort()
  const currentIdx = uniqueMondays.indexOf(weekStartStr)
  const prevWeek = currentIdx > 0 ? (uniqueMondays[currentIdx - 1] ?? null) : null
  const nextWeek = currentIdx >= 0 && currentIdx < uniqueMondays.length - 1
    ? (uniqueMondays[currentIdx + 1] ?? null)
    : null

  const weekNum = getISOWeek(weekStart)
  const year = getYear(weekStart)
  const weekLabel = `${year}年 第${weekNum}周  (${format(weekStart, "MM/dd", { locale: zhCN })} – ${format(friday, "MM/dd", { locale: zhCN })})`

  return (
    <WeeklyReportClient
      weekStart={weekStartStr}
      prevWeek={prevWeek}
      nextWeek={nextWeek}
      weekLabel={weekLabel}
      initialReport={report ? {
        summary:       report.summary,
        strengths:     report.strengths,
        weaknesses:    report.weaknesses,
        keyLessons:    report.keyLessons,
        nextWeekPlan:  report.nextWeekPlan,
        overallRating: report.overallRating,
      } : null}
      stats={{ totalPnL: Math.round(totalPnL * 100) / 100, executedCount, winCount, missedCount, totalSetups }}
      dailyBreakdown={dailyBreakdown}
    />
  )
}
