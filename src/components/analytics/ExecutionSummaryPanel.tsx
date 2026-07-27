import { Card, CardContent } from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface ExecutionSummary {
  totalCount: number
  settledCount: number
  totalPnL: number
  winRate: number
  avgPnL: number
  maxWin: number
  maxLoss: number
  profitFactor: number | null
  winsCount: number
  lossesCount: number
}

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
      <CardContent className="pt-4 pb-3">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p
          className={cn(
            "text-xl font-bold tabular-nums",
            positive === true  && "text-green-400",
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

interface Props {
  summary: ExecutionSummary
}

export function ExecutionSummaryPanel({ summary }: Props) {
  const {
    totalCount, settledCount, totalPnL, winRate, avgPnL,
    maxWin, maxLoss, profitFactor, winsCount, lossesCount,
  } = summary

  const fmt = (n: number) => `${n >= 0 ? "+" : ""}$${Math.abs(n).toFixed(2)}`

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <StatCard
        label="总笔数"
        value={String(totalCount)}
        sub={settledCount < totalCount ? `已结 ${settledCount}` : undefined}
      />
      <StatCard
        label="累计盈亏"
        value={settledCount > 0 ? fmt(totalPnL) : "—"}
        positive={totalPnL > 0 ? true : totalPnL < 0 ? false : null}
      />
      <StatCard
        label="胜率"
        value={settledCount > 0 ? `${winRate.toFixed(1)}%` : "—"}
        sub={settledCount > 0 ? `${winsCount} 盈 / ${lossesCount} 亏` : undefined}
        positive={winRate > 50 ? true : winRate < 50 && settledCount > 0 ? false : null}
      />
      <StatCard
        label="平均每笔"
        value={settledCount > 0 ? fmt(avgPnL) : "—"}
        positive={avgPnL > 0 ? true : avgPnL < 0 ? false : null}
      />
      <StatCard
        label="最大盈利"
        value={winsCount > 0 ? fmt(maxWin) : "—"}
        positive={winsCount > 0 ? true : null}
      />
      <StatCard
        label="最大亏损"
        value={lossesCount > 0 ? fmt(maxLoss) : "—"}
        positive={lossesCount > 0 ? false : null}
      />
      <StatCard
        label="盈亏比"
        value={profitFactor !== null ? profitFactor.toFixed(2) : "—"}
        positive={profitFactor !== null ? profitFactor >= 1 : null}
      />
      <StatCard
        label="持仓中"
        value={String(totalCount - settledCount)}
      />
    </div>
  )
}
