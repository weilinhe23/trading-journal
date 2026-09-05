import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

function RateBar({ rate, label }: { rate: number | null; label: string }) {
  if (rate === null) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-muted-foreground">暂无数据</span>
        </div>
        <div className="bg-muted h-2 rounded-full" />
      </div>
    );
  }
  const color =
    rate >= 70 ? "bg-green-500" : rate >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium",
            rate >= 70
              ? "text-green-400"
              : rate >= 50
                ? "text-yellow-400"
                : "text-red-400",
          )}
        >
          {rate.toFixed(1)}%
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

function PnLCompare({
  title,
  correct,
  wrong,
}: {
  title: string;
  correct: number | null;
  wrong: number | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          {[
            ["判断正确", correct, "border-green-900/40 bg-green-900/10"],
            ["判断有误", wrong, "border-red-900/40 bg-red-900/10"],
          ].map(([label, value, className]) => (
            <div
              key={String(label)}
              className={cn("rounded-lg border p-4", className)}
            >
              <p className="text-muted-foreground mb-1 text-xs">{label}</p>
              <p
                className={cn(
                  "text-xl font-bold",
                  typeof value === "number" && value >= 0
                    ? "text-green-400"
                    : "text-red-400",
                )}
              >
                {typeof value === "number"
                  ? `${value >= 0 ? "+" : ""}$${value.toFixed(2)}`
                  : "—"}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">平均每笔</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ExecutionQualityPage() {
  const { executionQuality: quality } = await getMnqAnalyticsSnapshot();

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground text-sm">
        使用 MNQ 已把握机会中的入场准确性和出场准确性评估，不再读取旧 Execution
        纪律字段。
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">已把握机会</p>
            <p className="text-2xl font-bold">{quality.totalCaptured}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">入场评估</p>
            <p className="text-2xl font-bold">{quality.entryEvaluatedCount}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">已填写准确性</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">出场评估</p>
            <p className="text-2xl font-bold">{quality.exitEvaluatedCount}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">已填写准确性</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">执行准确率</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RateBar
            rate={quality.entryAccuracyRate}
            label={`入场判断正确 (${quality.entryCorrectCount}/${quality.entryEvaluatedCount})`}
          />
          <RateBar
            rate={quality.exitAccuracyRate}
            label={`出场判断正确 (${quality.exitCorrectCount}/${quality.exitEvaluatedCount})`}
          />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PnLCompare
          title="入场准确性与盈亏"
          correct={quality.avgPnLEntryCorrect}
          wrong={quality.avgPnLEntryWrong}
        />
        <PnLCompare
          title="出场准确性与盈亏"
          correct={quality.avgPnLExitCorrect}
          wrong={quality.avgPnLExitWrong}
        />
      </div>
    </div>
  );
}
