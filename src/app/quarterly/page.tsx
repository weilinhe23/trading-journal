import Link from "next/link"
import { prisma } from "~/lib/prisma"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"

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

function getQuarter(month: number): number {
  return Math.ceil((month + 1) / 3)
}

export default async function QuarterlyListPage() {
  const sessions = await prisma.dailySession.findMany({
    orderBy: { date: "asc" },
    include: { mnqPlan: true },
  })

  const quarterlyReports = await prisma.quarterlyReport.findMany()
  const reportMap = new Map(quarterlyReports.map((r) => [r.yearQuarter, r]))

  // group by quarter
  const quarterMap = new Map<string, typeof sessions>()
  for (const session of sessions) {
    const year = session.date.getUTCFullYear()
    const month = session.date.getUTCMonth() // 0-indexed
    const q = getQuarter(month)
    const yq = `${year}-Q${q}`
    const existing = quarterMap.get(yq) ?? []
    quarterMap.set(yq, [...existing, session])
  }

  const quarters = [...quarterMap.entries()].sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">季报</h1>
        <p className="text-sm text-muted-foreground">共 {quarters.length} 个季度交易记录</p>
      </div>

      {quarters.length === 0 && (
        <p className="text-center text-muted-foreground py-16 text-sm">暂无交易记录</p>
      )}

      <div className="space-y-3">
        {quarters.map(([yq, qSessions]) => {
          const [yearStr, qLabel] = yq.split("-")
          const year = Number(yearStr)
          const qNum = Number(qLabel?.replace("Q", "") ?? "1")
          const startMonth = (qNum - 1) * 3 + 1
          const endMonth   = qNum * 3
          const monthRange = `Q${qNum} (${startMonth}月–${endMonth}月)`

          let totalPnl = 0, totalTrades = 0, wins = 0
          for (const s of qSessions) {
            const stats = calcMnqPnl(s.mnqPlan)
            totalPnl    += stats.pnl
            totalTrades += stats.trades
            wins        += stats.wins
          }
          totalPnl = Math.round(totalPnl * 100) / 100
          const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : null
          const hasReport = reportMap.has(yq) && !!reportMap.get(yq)?.quarterInsight

          return (
            <Link key={yq} href={`/quarterly/${yq}`} className="block group">
              <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{year} {monthRange}</span>
                      {hasReport && (
                        <span className="text-[10px] py-0 px-1.5 rounded border border-green-700 text-green-400">
                          已写季报
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
                      <span className="text-muted-foreground">{qSessions.length} 个交易日</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{yq}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
