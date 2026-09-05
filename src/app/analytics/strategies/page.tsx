import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

function RateBar({ rate }: { rate: number | null }) {
  if (rate === null)
    return <span className="text-muted-foreground text-xs">—</span>;
  const color =
    rate >= 60 ? "bg-green-500" : rate >= 45 ? "bg-yellow-500" : "bg-red-500";
  const textColor =
    rate >= 60
      ? "text-green-400"
      : rate >= 45
        ? "text-yellow-400"
        : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={cn("w-10 text-right text-xs font-medium", textColor)}>
        {rate.toFixed(0)}%
      </span>
    </div>
  );
}

export default async function StrategiesPage() {
  const { rows, strategies } = await getMnqAnalyticsSnapshot();
  const bestStrategy = strategies.find((strategy) => strategy.settled > 0);

  if (strategies.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-12 text-center text-sm">
          暂无 MNQ 策略数据
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground text-sm">
        按 MNQ 机会中的策略和交易类型聚合；“未分类”机会也会保留在统计中。
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">策略种类</p>
            <p className="text-2xl font-bold">{strategies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">当前盈亏最高</p>
            <p className="truncate text-lg font-bold text-green-400">
              {bestStrategy?.name ?? "—"}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              仅基于已结算机会
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">MNQ 机会总数</p>
            <p className="text-2xl font-bold">{rows.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">各策略表现</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-xs">
                  <th className="px-4 py-2.5 text-left font-medium">
                    策略名称
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">把握</th>
                  <th className="px-3 py-2.5 text-right font-medium">错过</th>
                  <th className="min-w-[120px] px-3 py-2.5 font-medium">
                    胜率
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium">总盈亏</th>
                  <th className="px-3 py-2.5 text-right font-medium">均盈亏</th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    错过机会成本
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {strategies.map((strategy) => (
                  <tr
                    key={strategy.name}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{strategy.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {strategy.total} 个
                        </Badge>
                        {strategy.tradeTypes.slice(0, 2).map((tradeType) => (
                          <Badge
                            key={tradeType}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tradeType}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="text-muted-foreground px-3 py-3 text-right">
                      {strategy.captured}
                    </td>
                    <td className="px-3 py-3 text-right text-orange-400">
                      {strategy.missed}
                    </td>
                    <td className="px-3 py-3">
                      <RateBar rate={strategy.winRate} />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={cn(
                          "font-medium",
                          strategy.totalPnL > 0
                            ? "text-green-400"
                            : strategy.totalPnL < 0
                              ? "text-red-400"
                              : "text-muted-foreground",
                        )}
                      >
                        {strategy.settled > 0
                          ? `${strategy.totalPnL >= 0 ? "+" : ""}$${strategy.totalPnL.toFixed(2)}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs">
                      {strategy.avgPnL === null
                        ? "—"
                        : `${strategy.avgPnL >= 0 ? "+" : ""}$${strategy.avgPnL.toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-cyan-400">
                      {strategy.missedEvaluatedCount > 0
                        ? `${strategy.missedPotentialR.toFixed(2)}R`
                        : "未评估"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
