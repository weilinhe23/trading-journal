import Link from "next/link"
import { prisma } from "~/lib/prisma"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

interface MnqOpp {
  captured: boolean | null
  entryPrice: string
  exitPrice: string
  contracts: string
  tradeDirection: "LONG" | "SHORT" | null
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

function calcMnqPnl(mnqPlan: {
  marketPreJson: string | null
  marketOpenJson: string | null
  marketMidJson: string | null
  marketAfternoonJson: string | null
} | null): { pnl: number; trades: number; wins: number } {
  if (!mnqPlan) return { pnl: 0, trades: 0, wins: 0 }
  let pnl = 0, trades = 0, wins = 0
  for (const raw of [mnqPlan.marketPreJson, mnqPlan.marketOpenJson, mnqPlan.marketMidJson, mnqPlan.marketAfternoonJson]) {
    for (const opp of parseMnqOpps(raw)) {
      if (opp.captured !== true) continue
      trades++
      const entry = parseFloat(opp.entryPrice)
      const exit  = parseFloat(opp.exitPrice)
      const qty   = parseFloat(opp.contracts || "1")
      if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
        const dir = opp.tradeDirection === "SHORT" ? -1 : 1
        const p = (exit - entry) * dir * qty * MNQ_TICK
        pnl += p
        if (p > 0) wins++
      }
    }
  }
  return { pnl: Math.round(pnl * 100) / 100, trades, wins }
}

export default async function MonthlyListPage() {
  const sessions = await prisma.dailySession.findMany({
    orderBy: { date: "asc" },
    include: { mnqPlan: true },
  })

  const monthlyReports = await prisma.monthlyReport.findMany()
  const reportMap = new Map(monthlyReports.map((r) => [r.yearMonth, r]))

  // group by month
  const monthMap = new Map<string, typeof sessions>()
  for (const session of sessions) {
    const ym = `${session.date.getUTCFullYear()}-${String(session.date.getUTCMonth() + 1).padStart(2, "0")}`
    const existing = monthMap.get(ym) ?? []
    monthMap.set(ym, [...existing, session])
  }

  const months = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">月报</h1>
        <p className="text-sm text-muted-foreground">共 {months.length} 个月交易记录</p>
      </div>

      {months.length === 0 && (
        <p className="text-center text-muted-foreground py-16 text-sm">暂无交易记录</p>
      )}

      <div className="space-y-3">
        {months.map(([ym, monthSessions]) => {
          const [yearStr, monthStr] = ym.split("-")
          const year  = Number(yearStr)
          const month = Number(monthStr)
          const monthName = MONTH_NAMES[month - 1] ?? ""

          let totalPnl = 0, totalTrades = 0, wins = 0
          for (const s of monthSessions) {
            const stats = calcMnqPnl(s.mnqPlan)
            totalPnl   += stats.pnl
            totalTrades += stats.trades
            wins        += stats.wins
          }
          totalPnl = Math.round(totalPnl * 100) / 100
          const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : null
          const hasReport = reportMap.has(ym) && !!reportMap.get(ym)?.monthInsight

          return (
            <Link key={ym} href={`/monthly/${ym}`} className="block group">
              <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{monthName} {year}</span>
                      {hasReport && (
                        <span className="text-[10px] py-0 px-1.5 rounded border border-green-700 text-green-400">
                          已写月报
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={cn("font-medium", totalPnl >= 0 ? "text-green-400" : "text-red-400")}>
                        {formatPnL(totalPnl)}
                      </span>
                      <span className="text-muted-foreground">{totalTrades} 笔交易</span>
                      {winRate !== null && (
                        <span className="text-muted-foreground">
                          胜率 {winRate}%
                          <span className="ml-1 text-xs">({wins}W / {totalTrades - wins}L)</span>
                        </span>
                      )}
                      <span className="text-muted-foreground">{monthSessions.length} 个交易日</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{ym}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
