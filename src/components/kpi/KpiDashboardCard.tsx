import Link from "next/link";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { KpiPeriodSummary } from "~/lib/kpi";

export function KpiDashboardCard({ summary }: { summary: KpiPeriodSummary }) {
  const completedDays = summary.dailyResults.filter(
    (day) => day.actualPcts !== null && day.actualPcts >= day.baselineTarget,
  ).length;
  const completionRate =
    summary.tradingDayCount === 0
      ? 0
      : Math.min(100, (completedDays / summary.tradingDayCount) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b">
        <div>
          <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <Target aria-hidden="true" className="size-3.5" />
            Weekly KPI
          </div>
          <CardTitle className="text-base">本周目标完成日</CardTitle>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link
            href={`/kpi?period=week&date=${summary.anchorDate}&goal=baseline`}
          >
            查看
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold tracking-tight tabular-nums">
              {completedDays}
              <span className="text-muted-foreground ml-1 text-base font-normal">
                / {summary.tradingDayCount} 天
              </span>
            </p>
            <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
              <CheckCircle2
                aria-hidden="true"
                className="size-3.5 text-emerald-400"
              />
              基准目标达标交易日
            </p>
          </div>
          <span className="text-muted-foreground text-sm tabular-nums">
            {Math.round(completionRate)}%
          </span>
        </div>
        <div className="bg-muted mt-5 h-1.5 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
