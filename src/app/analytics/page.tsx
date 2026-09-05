import { PnLCurveChart } from "~/components/analytics/PnLCurveChart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean | null;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-muted-foreground mb-1 text-xs">{label}</p>
        <p
          className={cn(
            "text-2xl font-bold",
            positive === true && "text-green-400",
            positive === false && "text-red-400",
          )}
        >
          {value}
        </p>
        {sub ? (
          <p className="text-muted-foreground mt-0.5 text-xs">{sub}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default async function AnalyticsSummaryPage() {
  const { summary } = await getMnqAnalyticsSnapshot();
  const pnlPositive =
    summary.totalPnL > 0 ? true : summary.totalPnL < 0 ? false : null;
  const avgPositive =
    summary.avgPnL === null
      ? null
      : summary.avgPnL > 0
        ? true
        : summary.avgPnL < 0
          ? false
          : null;

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground text-sm">
        仅统计每日 MNQ 行情记录中的交易机会；历史股票和旧 Setup 不参与计算。
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="累计盈亏"
          value={
            summary.settledCount > 0
              ? `${summary.totalPnL >= 0 ? "+" : ""}$${summary.totalPnL.toFixed(2)}`
              : "—"
          }
          sub={`${summary.settledCount} 笔可计算`}
          positive={pnlPositive}
        />
        <StatCard
          label="胜率"
          value={
            summary.winRate === null ? "—" : `${summary.winRate.toFixed(1)}%`
          }
          sub={`${summary.winsCount} 盈 · ${summary.lossesCount} 亏 · ${summary.breakevenCount} 保本`}
          positive={
            summary.winRate === null
              ? null
              : summary.winRate > 50
                ? true
                : summary.winRate < 50
                  ? false
                  : null
          }
        />
        <StatCard
          label="平均每笔"
          value={
            summary.avgPnL === null
              ? "—"
              : `${summary.avgPnL >= 0 ? "+" : ""}$${summary.avgPnL.toFixed(2)}`
          }
          positive={avgPositive}
        />
        <StatCard
          label="MNQ 机会总计"
          value={String(summary.totalOpportunities)}
          sub={`把握 ${summary.capturedCount} · 错过 ${summary.missedCount}`}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            MNQ 累计盈亏曲线
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <PnLCurveChart data={summary.dailyPnL} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">机会状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["已把握", summary.capturedCount, "text-green-400"],
              ["已错过", summary.missedCount, "text-orange-400"],
              ["待确认", summary.pendingCount, "text-yellow-400"],
            ].map(([label, count, color]) => (
              <div
                key={String(label)}
                className="rounded-lg border p-3 text-center"
              >
                <p className={cn("text-xl font-bold", color)}>{count}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
