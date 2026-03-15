import Link from "next/link"
import { format, getISOWeek, getYear } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Badge } from "~/components/ui/badge"
import { prisma } from "~/lib/prisma"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import { CreateWeeklyReportButton } from "~/components/weekly/CreateWeeklyReportButton"

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export default async function WeeklyListPage() {
  const sessions = await prisma.dailySession.findMany({
    orderBy: { date: "asc" },
    include: { setups: { include: { executions: true } } },
  })

  // Group sessions by ISO week Monday
  const weekMap = new Map<string, { monday: Date; sessions: typeof sessions }>()
  for (const session of sessions) {
    const monday = getMondayOf(session.date)
    const key = monday.toISOString().split("T")[0]!
    if (!weekMap.has(key)) weekMap.set(key, { monday, sessions: [] })
    weekMap.get(key)!.sessions.push(session)
  }

  // Fetch reports for weeks that have sessions
  const weekStarts = Array.from(weekMap.values()).map((w) => w.monday)
  const reports = await prisma.weeklyReport.findMany({
    where: { weekStart: { in: weekStarts } },
  })
  const reportMap = new Map(reports.map((r) => [r.weekStart.toISOString().split("T")[0]!, r]))

  // Sort desc
  const weeks = Array.from(weekMap.entries()).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">每周周报</h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">共 {weeks.length} 周交易记录</p>
          <CreateWeeklyReportButton />
        </div>
      </div>

      {weeks.length === 0 && (
        <p className="text-center text-muted-foreground py-16 text-sm">暂无交易记录</p>
      )}

      <div className="space-y-3">
        {weeks.map(([key, { monday, sessions: weekSessions }]) => {
          const friday = new Date(monday)
          friday.setUTCDate(friday.getUTCDate() + 4)
          const weekNum = getISOWeek(monday)
          const year = getYear(monday)

          let totalPnL = 0
          let executedCount = 0
          let winCount = 0
          let missedCount = 0

          for (const session of weekSessions) {
            for (const setup of session.setups) {
              if (setup.status === "MISSED") missedCount++
              if (setup.status === "EXECUTED") {
                executedCount++
                for (const ex of setup.executions) {
                  if (ex.pnl !== null) {
                    totalPnL += ex.pnl
                    if (ex.pnl > 0) winCount++
                  }
                }
              }
            }
          }

          const report = reportMap.get(key)
          const winRate = executedCount > 0 ? Math.round((winCount / executedCount) * 100) : null

          return (
            <Link key={key} href={`/weekly/${key}`} className="block group">
              <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {year}年 第{weekNum}周
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(monday, "MM/dd", { locale: zhCN })} – {format(friday, "MM/dd", { locale: zhCN })}
                      </span>
                      {report ? (
                        <Badge variant="outline" className="text-[10px] py-0 border-green-700 text-green-400">
                          已写周报
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] py-0 text-muted-foreground/40">
                          待填写
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className={cn("font-medium", totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
                        {formatPnL(Math.round(totalPnL * 100) / 100)}
                      </span>
                      <span className="text-muted-foreground">{executedCount} 笔交易</span>
                      {winRate !== null && (
                        <span className="text-muted-foreground">
                          胜率 {winRate}%
                          <span className="ml-1 text-xs">({winCount}W / {executedCount - winCount}L)</span>
                        </span>
                      )}
                      {missedCount > 0 && (
                        <span className="text-orange-400/70">错过 {missedCount}</span>
                      )}
                    </div>
                  </div>

                  {report?.overallRating && (
                    <div className="text-yellow-400 text-sm shrink-0">
                      {"★".repeat(report.overallRating)}
                      <span className="text-muted-foreground/30">{"★".repeat(5 - report.overallRating)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
