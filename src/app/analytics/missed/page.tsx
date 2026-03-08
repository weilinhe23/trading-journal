import { prisma } from "~/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { MissedReasonChart } from "~/components/analytics/MissedReasonChart"
import { MISSED_REASON_LABELS } from "~/types"
import type { MissedReason } from "~/types"

export default async function MissedAnalysisPage() {
  const missed = await prisma.tradeSetup.findMany({
    where: { status: "MISSED" },
    select: {
      id: true,
      symbol: true,
      strategy: true,
      missedReason: true,
      missedNotes: true,
      missedHypoPnL: true,
      sessionDate: true,
      direction: true,
    },
    orderBy: { sessionDate: "desc" },
  })

  // Group by reason
  const byReason = new Map<string, { count: number; hypoPnL: number }>()
  for (const s of missed) {
    const key = s.missedReason ?? "OTHER"
    const cur = byReason.get(key) ?? { count: 0, hypoPnL: 0 }
    byReason.set(key, {
      count: cur.count + 1,
      hypoPnL: cur.hypoPnL + (s.missedHypoPnL ?? 0),
    })
  }

  const totalHypoPnL = missed.reduce((s, m) => s + (m.missedHypoPnL ?? 0), 0)

  const breakdown = Array.from(byReason.entries())
    .map(([reason, { count, hypoPnL }]) => ({
      reason,
      label: MISSED_REASON_LABELS[reason as MissedReason] ?? reason,
      count,
      hypoPnL: hypoPnL !== 0 ? hypoPnL : null,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">总错过次数</p>
            <p className="text-2xl font-bold text-orange-400">{missed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">假设总盈亏</p>
            <p
              className={`text-2xl font-bold ${
                totalHypoPnL > 0 ? "text-green-400" : totalHypoPnL < 0 ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              {totalHypoPnL !== 0
                ? `${totalHypoPnL >= 0 ? "+" : ""}$${totalHypoPnL.toFixed(2)}`
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">按计划执行的估算</p>
          </CardContent>
        </Card>
      </div>

      {/* Reason distribution chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">错过原因分布</CardTitle>
        </CardHeader>
        <CardContent>
          <MissedReasonChart data={breakdown} />
        </CardContent>
      </Card>

      {/* Detailed list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">错过记录明细</CardTitle>
        </CardHeader>
        <CardContent>
          {missed.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">暂无错过记录</p>
          ) : (
            <div className="space-y-2">
              {missed.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 p-3 rounded-lg border text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{s.symbol}</span>
                      <Badge variant="outline" className="text-xs">{s.strategy}</Badge>
                      {s.missedReason && (
                        <Badge variant="secondary" className="text-xs">
                          {MISSED_REASON_LABELS[s.missedReason]}
                        </Badge>
                      )}
                    </div>
                    {s.missedNotes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {s.missedNotes}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {s.sessionDate.toISOString().split("T")[0]}
                    </p>
                    {s.missedHypoPnL !== null && (
                      <p
                        className={`text-xs font-medium ${
                          s.missedHypoPnL > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {s.missedHypoPnL >= 0 ? "+" : ""}${s.missedHypoPnL.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
