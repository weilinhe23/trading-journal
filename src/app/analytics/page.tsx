import { prisma } from "~/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { PnLCurveChart } from "~/components/analytics/PnLCurveChart"
import { cn } from "~/lib/utils"

function StatCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string
  value: string
  sub?: string
  positive?: boolean | null
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p
          className={cn(
            "text-2xl font-bold",
            positive === true && "text-green-400",
            positive === false && "text-red-400",
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default async function AnalyticsSummaryPage() {
  // ── Fetch directly from Prisma ────────────────────────────────────────
  const executions = await prisma.execution.findMany({
    select: {
      pnl: true,
      entryTime: true,
      setup: { select: { sessionDate: true } },
    },
    orderBy: { entryTime: "asc" },
  })

  const setupGroups = await prisma.tradeSetup.groupBy({
    by: ["status"],
    _count: { status: true },
  })

  // ── Compute stats ─────────────────────────────────────────────────────
  const withPnL = executions.filter((e) => e.pnl !== null)
  const totalPnL = withPnL.reduce((s, e) => s + (e.pnl ?? 0), 0)
  const profitable = withPnL.filter((e) => (e.pnl ?? 0) > 0)
  const winRate = withPnL.length > 0 ? (profitable.length / withPnL.length) * 100 : 0
  const avgPnL = withPnL.length > 0 ? totalPnL / withPnL.length : 0

  const countByStatus = Object.fromEntries(
    setupGroups.map((g) => [g.status, g._count.status]),
  )
  const totalSetups = setupGroups.reduce((s, g) => s + g._count.status, 0)

  // ── Daily PnL for curve ───────────────────────────────────────────────
  const dailyMap = new Map<string, number>()
  for (const exec of executions) {
    if (exec.pnl === null) continue
    const date = exec.setup.sessionDate.toISOString().split("T")[0]!
    dailyMap.set(date, (dailyMap.get(date) ?? 0) + exec.pnl)
  }
  let running = 0
  const dailyPnL = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => {
      running += pnl
      return { date, pnl: Math.round(pnl * 100) / 100, cumPnL: Math.round(running * 100) / 100 }
    })

  const pnlPositive = totalPnL > 0 ? true : totalPnL < 0 ? false : null
  const avgPositive = avgPnL > 0 ? true : avgPnL < 0 ? false : null

  return (
    <div className="space-y-5">
      {/* Core metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="累计盈亏"
          value={`${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`}
          sub={`${withPnL.length} 笔已结`}
          positive={pnlPositive}
        />
        <StatCard
          label="胜率"
          value={withPnL.length > 0 ? `${winRate.toFixed(1)}%` : "—"}
          sub={`${profitable.length} 盈 / ${withPnL.length - profitable.length} 亏`}
          positive={winRate > 50 ? true : winRate < 50 ? false : null}
        />
        <StatCard
          label="平均每笔"
          value={withPnL.length > 0 ? `${avgPnL >= 0 ? "+" : ""}$${avgPnL.toFixed(2)}` : "—"}
          positive={avgPositive}
        />
        <StatCard
          label="Setup 总计"
          value={String(totalSetups)}
          sub={`执行 ${countByStatus["EXECUTED"] ?? 0} · 错过 ${countByStatus["MISSED"] ?? 0}`}
        />
      </div>

      {/* PnL Curve */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">累计盈亏曲线</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <PnLCurveChart data={dailyPnL} />
        </CardContent>
      </Card>

      {/* Setup status breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">机会状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                ["EXECUTED", "已执行", "text-green-400"],
                ["MISSED", "已错过", "text-red-400"],
                ["WATCHING", "观察中", "text-yellow-400"],
                ["INVALIDATED", "已失效", "text-muted-foreground"],
                ["CANCELLED", "已取消", "text-muted-foreground"],
              ] as const
            ).map(([status, label, color]) => (
              <div key={status} className="text-center p-3 rounded-lg border">
                <p className={`text-xl font-bold ${color}`}>
                  {countByStatus[status] ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
