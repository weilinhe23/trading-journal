import { prisma } from "~/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"

function WinRateBar({ rate }: { rate: number | null }) {
  if (rate === null) return <span className="text-muted-foreground text-xs">—</span>
  const color =
    rate >= 60 ? "bg-green-500" : rate >= 45 ? "bg-yellow-500" : "bg-red-500"
  const textColor =
    rate >= 60 ? "text-green-400" : rate >= 45 ? "text-yellow-400" : "text-red-400"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${rate}%` }} />
      </div>
      <span className={cn("text-xs font-medium w-10 text-right", textColor)}>
        {rate.toFixed(0)}%
      </span>
    </div>
  )
}

export default async function StrategiesPage() {
  const setups = await prisma.tradeSetup.findMany({
    select: {
      strategy: true,
      status: true,
      executions: { select: { pnl: true } },
    },
  })

  // Group by strategy
  type StratData = {
    total: number
    executed: number
    missed: number
    wins: number
    losses: number
    totalPnL: number
  }
  const stratMap = new Map<string, StratData>()

  for (const setup of setups) {
    if (!setup.strategy) continue
    const cur = stratMap.get(setup.strategy) ?? {
      total: 0, executed: 0, missed: 0, wins: 0, losses: 0, totalPnL: 0,
    }
    cur.total++
    if (setup.status === "MISSED") cur.missed++
    if (setup.status === "EXECUTED") {
      cur.executed++
      const pnl = setup.executions.reduce((s, e) => s + (e.pnl ?? 0), 0)
      cur.totalPnL += pnl
      if (pnl > 0) cur.wins++
      else cur.losses++
    }
    stratMap.set(setup.strategy, cur)
  }

  const strategies = Array.from(stratMap.entries())
    .map(([name, d]) => ({
      name,
      ...d,
      winRate: d.executed > 0 ? (d.wins / d.executed) * 100 : null,
      avgPnL: d.executed > 0 ? d.totalPnL / d.executed : null,
      missRate: d.total > 0 ? (d.missed / d.total) * 100 : 0,
    }))
    .sort((a, b) => b.totalPnL - a.totalPnL)

  if (strategies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          暂无策略数据，添加并执行 Setup 后显示
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary totals */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">策略种类</p>
            <p className="text-2xl font-bold">{strategies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">最佳策略</p>
            <p className="text-lg font-bold truncate text-green-400">
              {strategies[0]?.name ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PnL 最高
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">总 Setup 数</p>
            <p className="text-2xl font-bold">{setups.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">各策略表现</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2.5 font-medium">策略名称</th>
                  <th className="text-right px-3 py-2.5 font-medium">执行</th>
                  <th className="text-right px-3 py-2.5 font-medium">错过</th>
                  <th className="px-3 py-2.5 font-medium min-w-[120px]">胜率</th>
                  <th className="text-right px-3 py-2.5 font-medium">总盈亏</th>
                  <th className="text-right px-4 py-2.5 font-medium">均盈亏</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {strategies.map((s) => (
                  <tr key={s.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.name}</span>
                        {s.total > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {s.total}个
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-right px-3 py-3 text-muted-foreground">
                      {s.executed}
                    </td>
                    <td className="text-right px-3 py-3">
                      {s.missed > 0 ? (
                        <span className="text-orange-400">{s.missed}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <WinRateBar rate={s.winRate} />
                    </td>
                    <td className="text-right px-3 py-3">
                      <span
                        className={cn(
                          "font-medium",
                          s.totalPnL > 0
                            ? "text-green-400"
                            : s.totalPnL < 0
                              ? "text-red-400"
                              : "text-muted-foreground",
                        )}
                      >
                        {s.totalPnL !== 0
                          ? `${s.totalPnL >= 0 ? "+" : ""}$${s.totalPnL.toFixed(2)}`
                          : "—"}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      {s.avgPnL !== null ? (
                        <span
                          className={cn(
                            "text-xs",
                            s.avgPnL > 0
                              ? "text-green-400"
                              : s.avgPnL < 0
                                ? "text-red-400"
                                : "text-muted-foreground",
                          )}
                        >
                          {s.avgPnL >= 0 ? "+" : ""}${s.avgPnL.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Per-strategy cards for more detail */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {strategies.slice(0, 6).map((s) => (
          <Card key={s.name}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between mb-3">
                <p className="font-medium text-sm">{s.name}</p>
                <span
                  className={cn(
                    "text-sm font-bold",
                    s.totalPnL > 0 ? "text-green-400" : s.totalPnL < 0 ? "text-red-400" : "text-muted-foreground",
                  )}
                >
                  {s.totalPnL !== 0
                    ? `${s.totalPnL >= 0 ? "+" : ""}$${s.totalPnL.toFixed(2)}`
                    : "$0"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-muted-foreground">胜率</p>
                  <p className={cn("font-medium mt-0.5", s.winRate !== null && s.winRate >= 50 ? "text-green-400" : "text-red-400")}>
                    {s.winRate !== null ? `${s.winRate.toFixed(0)}%` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">执行/错过</p>
                  <p className="font-medium mt-0.5">
                    {s.executed}/{s.missed}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">均盈亏</p>
                  <p className={cn("font-medium mt-0.5", s.avgPnL !== null && s.avgPnL >= 0 ? "text-green-400" : "text-red-400")}>
                    {s.avgPnL !== null ? `${s.avgPnL >= 0 ? "+" : ""}$${s.avgPnL.toFixed(2)}` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
