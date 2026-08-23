import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Crosshair,
  Layers3,
  Lightbulb,
  Target,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import {
  analyzeDailyOpportunities,
  type MnqDailyMissedProfitAnalysis,
  type MnqDailyProfitAnalysis,
  type MnqMissedReasonSummary,
  type MnqMarketDayAnalysis,
  type MnqPlanOpportunitySource,
  type MnqSegmentSummary,
  type MnqStrategySummary,
} from "~/lib/daily-opportunity-analysis";
import { cn } from "~/lib/utils";
import {
  MNQ_LEVEL_ACTUAL_REACTIONS,
  MNQ_LEVEL_EXPECTED_REACTIONS,
  MNQ_LEVEL_TIMEFRAME_OPTIONS,
  formatActualLevelName,
  formatActualLevelTimeframe,
  formatLevelName,
  type MnqLevelForecastNode,
} from "~/lib/mnq-level-forecast";
import {
  MNQ_DECISION_TIMEFRAME_LABELS,
  MNQ_MARKET_ACCURACY_LABELS,
  MNQ_MARKET_DEVIATION_REASON_LABELS,
  MNQ_MARKET_DIRECTION_LABELS,
  MNQ_MARKET_IMPACT_TYPE_LABELS,
  MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS,
  MNQ_MARKET_TYPE_LABELS,
  MNQ_MISSED_REASON_LABELS,
} from "~/types";

interface Props {
  plan: MnqPlanOpportunitySource | null;
}

function formatCurrency(value: number): string {
  return `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}`;
}

function percentage(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(0)}%`;
}

function formatR(value: number | null): string {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}R`;
}

function Metric({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="bg-muted/20 rounded-lg border p-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums",
          tone === "positive" && "text-green-400",
          tone === "negative" && "text-red-400",
        )}
      >
        {value}
      </p>
      <p className="text-muted-foreground mt-0.5 text-[11px]">{detail}</p>
    </div>
  );
}

const PROFIT_BAND_STYLES = {
  LOSS: "border-red-500/25 bg-red-950/20 text-red-300",
  BREAKEVEN: "border-slate-500/25 bg-slate-950/20 text-slate-300",
  PARTIAL: "border-emerald-500/25 bg-emerald-950/15 text-emerald-300",
  EXPECTED: "border-green-500/30 bg-green-950/20 text-green-300",
  EXCEEDED: "border-cyan-500/30 bg-cyan-950/20 text-cyan-300",
} as const;

const TRADE_QUALITY_LABELS = {
  STRONG: "质量较高",
  ACCEPTABLE: "基本合理",
  NEEDS_IMPROVEMENT: "需要改进",
  INCOMPLETE: "数据待补充",
} as const;

const TRADE_QUALITY_STYLES = {
  STRONG: "border-green-500/35 bg-green-500/10 text-green-300",
  ACCEPTABLE: "border-cyan-500/35 bg-cyan-500/10 text-cyan-300",
  NEEDS_IMPROVEMENT: "border-amber-500/35 bg-amber-500/10 text-amber-300",
  INCOMPLETE: "border-muted-foreground/30 bg-muted/20 text-muted-foreground",
} as const;

function ProfitSource({
  title,
  source,
  tone,
}: {
  title: string;
  source: MnqDailyProfitAnalysis["largestWinner"];
  tone: "positive" | "negative";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "positive"
          ? "border-green-500/25 bg-green-950/15"
          : "border-red-500/25 bg-red-950/15",
      )}
    >
      <p className="text-muted-foreground text-[11px]">{title}</p>
      {source ? (
        <>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-xs leading-relaxed font-medium">
              {source.description}
            </p>
            <span
              className={cn(
                "shrink-0 text-base font-semibold tabular-nums",
                tone === "positive" ? "text-green-400" : "text-red-400",
              )}
            >
              {formatR(source.realizedR)}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-[10px]">
            {source.strategy} · {source.segment}
            {source.pnl !== null ? ` · ${formatCurrency(source.pnl)}` : ""}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">今日暂无对应记录</p>
      )}
    </div>
  );
}

function TradeQualityAnalysis({
  analysis,
}: {
  analysis: MnqDailyProfitAnalysis;
}) {
  if (analysis.tradeQuality.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-violet-500/25 bg-violet-950/10 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
            <Crosshair className="h-3.5 w-3.5" />
            已成交交易质量分析
          </div>
          <p className="text-muted-foreground mt-1 text-[10px]">
            综合计划 R、实际 R、最高盈利 MFE 与最大回撤 MAE；均按计划风险换算
          </p>
        </div>
        <span className="text-muted-foreground text-[10px]">
          {analysis.completeQualityCount}/{analysis.tradeQuality.length}{" "}
          笔数据完整
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <div className="bg-background/30 rounded-md border p-2.5">
          <p className="text-muted-foreground text-[10px]">平均计划达成率</p>
          <p className="mt-1 text-base font-semibold tabular-nums">
            {percentage(analysis.averagePlanAttainmentRate)}
          </p>
        </div>
        <div className="bg-background/30 rounded-md border p-2.5">
          <p className="text-muted-foreground text-[10px]">平均盈利捕获率</p>
          <p className="mt-1 text-base font-semibold tabular-nums">
            {percentage(analysis.averageProfitCaptureRate)}
          </p>
        </div>
        <div className="bg-background/30 rounded-md border p-2.5">
          <p className="text-muted-foreground text-[10px]">平均最大回撤</p>
          <p className="mt-1 text-base font-semibold text-red-300 tabular-nums">
            {analysis.averageMaxDrawdownR !== null
              ? `-${analysis.averageMaxDrawdownR.toFixed(2)}R`
              : "—"}
          </p>
        </div>
        <div className="bg-background/30 rounded-md border p-2.5">
          <p className="text-muted-foreground text-[10px]">平均潜力未兑现</p>
          <p className="mt-1 text-base font-semibold text-amber-300 tabular-nums">
            {formatR(analysis.averageUnrealizedPotentialR)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[9px]">
            潜在最高 R 减实际 R
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {analysis.tradeQuality.map((trade) => (
          <div
            key={trade.id}
            className="bg-background/25 rounded-lg border p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs leading-relaxed font-medium">
                  {trade.description}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  {trade.segment} · {trade.strategy}
                </p>
              </div>
              <Badge
                variant="outline"
                className={TRADE_QUALITY_STYLES[trade.qualityLevel]}
              >
                {TRADE_QUALITY_LABELS[trade.qualityLevel]}
              </Badge>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-1.5 md:grid-cols-4">
              <div className="bg-muted/20 rounded px-2 py-1.5">
                <p className="text-muted-foreground text-[9px]">计划 R</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">
                  {formatR(trade.plannedTargetR)}
                </p>
              </div>
              <div className="bg-muted/20 rounded px-2 py-1.5">
                <p className="text-muted-foreground text-[9px]">实际 R</p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-semibold tabular-nums",
                    trade.realizedR !== null && trade.realizedR > 0
                      ? "text-green-400"
                      : trade.realizedR !== null && trade.realizedR < 0
                        ? "text-red-400"
                        : "text-foreground",
                  )}
                >
                  {formatR(trade.realizedR)}
                </p>
              </div>
              <div className="rounded bg-green-950/15 px-2 py-1.5">
                <p className="text-muted-foreground text-[9px]">
                  潜在最高 R · MFE
                </p>
                <p className="mt-0.5 text-sm font-semibold text-green-300 tabular-nums">
                  {formatR(trade.maxFavorableR)}
                </p>
              </div>
              <div className="rounded bg-red-950/15 px-2 py-1.5">
                <p className="text-muted-foreground text-[9px]">
                  最大回撤 R · MAE
                </p>
                <p className="mt-0.5 text-sm font-semibold text-red-300 tabular-nums">
                  {trade.maxDrawdownR !== null
                    ? `-${trade.maxDrawdownR.toFixed(2)}R`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-1.5 text-center md:grid-cols-4">
              <div className="rounded border border-violet-500/15 px-1.5 py-1.5">
                <p className="text-muted-foreground text-[9px]">计划达成率</p>
                <p className="mt-0.5 text-xs font-medium tabular-nums">
                  {percentage(trade.planAttainmentRate)}
                </p>
              </div>
              <div className="rounded border border-violet-500/15 px-1.5 py-1.5">
                <p className="text-muted-foreground text-[9px]">盈利捕获率</p>
                <p className="mt-0.5 text-xs font-medium tabular-nums">
                  {percentage(trade.profitCaptureRate)}
                </p>
              </div>
              <div className="rounded border border-violet-500/15 px-1.5 py-1.5">
                <p className="text-muted-foreground text-[9px]">
                  机会空间 / 计划
                </p>
                <p className="mt-0.5 text-xs font-medium tabular-nums">
                  {percentage(trade.opportunityVsPlanRate)}
                </p>
              </div>
              <div className="rounded border border-violet-500/15 px-1.5 py-1.5">
                <p className="text-muted-foreground text-[9px]">潜力未兑现</p>
                <p className="mt-0.5 text-xs font-medium text-amber-300 tabular-nums">
                  {formatR(trade.unrealizedPotentialR)}
                </p>
              </div>
            </div>

            <div className="mt-2 rounded-md bg-violet-950/20 px-2.5 py-2">
              <p className="text-[9px] font-medium text-violet-300/80">
                主要改进方向
              </p>
              <p className="text-foreground/75 mt-0.5 text-[11px] leading-relaxed">
                {trade.diagnosis}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfitDetailAnalysis({
  analysis,
}: {
  analysis: MnqDailyProfitAnalysis;
}) {
  const totalTone =
    analysis.totalRealizedR > 0
      ? "text-green-400"
      : analysis.totalRealizedR < 0
        ? "text-red-400"
        : "text-foreground";

  return (
    <div className="space-y-3 rounded-xl border border-emerald-500/25 bg-emerald-950/10 p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <CircleDollarSign className="h-4 w-4" />
            今日盈利详细分析
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            实际成交与错失机会分开统计；保本区间按 ±0.1R 处理
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-300"
        >
          {analysis.evaluatedCount} 笔已计算实际 R
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">实际总 R</p>
          <p
            className={cn("mt-1 text-xl font-semibold tabular-nums", totalTone)}
          >
            {analysis.evaluatedCount > 0
              ? formatR(analysis.totalRealizedR)
              : "—"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.missingRCount > 0
              ? `${analysis.missingRCount} 笔成交尚缺实际 R`
              : "已成交记录均已纳入"}
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">平均实际 R</p>
          <p
            className={cn("mt-1 text-xl font-semibold tabular-nums", totalTone)}
          >
            {formatR(analysis.averageRealizedR)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            每笔已评估成交的平均结果
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border border-orange-500/20 p-3">
          <p className="text-muted-foreground text-[11px]">错失机会假设 R</p>
          <p className="mt-1 text-xl font-semibold text-orange-300 tabular-nums">
            {analysis.missedEvaluatedCount > 0
              ? formatR(analysis.missedPotentialR)
              : "—"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.missedEvaluatedCount} 笔事后评估，不计入实际盈利
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">实际与计划差异</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold tabular-nums",
              analysis.planGapR !== null && analysis.planGapR >= 0
                ? "text-green-400"
                : analysis.planGapR !== null
                  ? "text-red-400"
                  : "text-foreground",
            )}
          >
            {formatR(analysis.planGapR)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.planComparedCount > 0
              ? `${analysis.planComparedCount} 笔实际 R 减计划目标 R`
              : "填写计划目标 R 后可比较"}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium">盈利分布</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {analysis.distribution.map((band) => (
            <div
              key={band.key}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-center",
                PROFIT_BAND_STYLES[band.key],
              )}
            >
              <p className="text-[11px] font-medium">{band.label}</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums">
                {band.count} 笔
              </p>
              <p className="text-[10px] opacity-75">
                合计 {formatR(band.totalR)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <ProfitSource
          title="最大盈利贡献"
          source={analysis.largestWinner}
          tone="positive"
        />
        <ProfitSource
          title="最大亏损来源"
          source={analysis.largestLoser}
          tone="negative"
        />
      </div>

      <TradeQualityAnalysis analysis={analysis} />

      {analysis.disciplineWarnings.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            超额盈利但违反退出计划
          </div>
          <div className="mt-2 space-y-1.5">
            {analysis.disciplineWarnings.map((warning, index) => (
              <div
                key={`${warning.description}:${index}`}
                className="flex items-start justify-between gap-3 text-[11px]"
              >
                <span className="text-foreground/80">
                  {warning.description} · {warning.strategy}
                </span>
                <span className="shrink-0 font-semibold text-amber-300 tabular-nums">
                  {formatR(warning.realizedR)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.strategies.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b">
              <tr>
                <th className="px-3 py-2 font-medium">策略</th>
                <th className="px-3 py-2 font-medium">实际 R</th>
                <th className="px-3 py-2 font-medium">平均 R</th>
                <th className="px-3 py-2 font-medium">胜率</th>
                <th className="px-3 py-2 font-medium">平均盈利 / 亏损</th>
                <th className="px-3 py-2 font-medium">当日期望值</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analysis.strategies.map((strategy) => (
                <tr key={strategy.name}>
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-emerald-300">
                      {strategy.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-[10px]">
                      {strategy.evaluatedCount}/{strategy.tradeCount} 笔已计算 R
                    </p>
                  </td>
                  <td className="px-3 py-2.5 font-medium tabular-nums">
                    {strategy.evaluatedCount > 0
                      ? formatR(strategy.totalR)
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {strategy.evaluatedCount > 0
                      ? formatR(strategy.averageR)
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {percentage(strategy.winRate)}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    <span className="text-green-400">
                      {formatR(strategy.averageWinR)}
                    </span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-red-400">
                      {formatR(strategy.averageLossR)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="font-semibold tabular-nums">
                      {strategy.evaluatedCount > 0
                        ? formatR(strategy.expectancyR)
                        : "—"}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-[9px]">
                      当日样本均值
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MissedOpportunitySource({
  title,
  source,
  value,
}: {
  title: string;
  source: MnqDailyMissedProfitAnalysis["largestHypotheticalOpportunity"];
  value: "planned" | "hypothetical";
}) {
  const displayedR =
    value === "planned" ? source?.plannedTargetR : source?.hypotheticalR;

  return (
    <div className="rounded-lg border border-orange-500/25 bg-orange-950/15 p-3">
      <p className="text-muted-foreground text-[11px]">{title}</p>
      {source ? (
        <>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-xs leading-relaxed font-medium">
              {source.description}
            </p>
            <span className="shrink-0 text-base font-semibold text-orange-300 tabular-nums">
              {formatR(displayedR ?? null)}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-[10px]">
            {source.strategy} · {source.segment} · {source.missedReason}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">相关字段尚未填写</p>
      )}
    </div>
  );
}

function MissedProfitDetailAnalysis({
  analysis,
}: {
  analysis: MnqDailyMissedProfitAnalysis;
}) {
  if (analysis.missedCount === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border border-orange-500/30 bg-orange-950/10 p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
            <AlertTriangle className="h-4 w-4" />
            今日错失交易盈利详细分析
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            计划目标 R 衡量当时的计划；事后假设 R 衡量行情实际走出的空间
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-orange-500/35 text-orange-300"
        >
          {analysis.missedCount} 笔错失机会
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">计划目标 R 合计</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {analysis.plannedCount > 0 ? formatR(analysis.totalPlannedR) : "—"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.plannedCount}/{analysis.missedCount} 笔已记录，平均{" "}
            {formatR(analysis.averagePlannedR)}
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border border-orange-500/20 p-3">
          <p className="text-muted-foreground text-[11px]">事后假设 R 合计</p>
          <p className="mt-1 text-xl font-semibold text-orange-300 tabular-nums">
            {analysis.evaluatedCount > 0
              ? formatR(analysis.totalHypotheticalR)
              : "—"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.evaluatedCount}/{analysis.missedCount} 笔已评估，平均{" "}
            {formatR(analysis.averageHypotheticalR)}
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">事后空间超出计划</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold tabular-nums",
              analysis.hindsightGapR !== null && analysis.hindsightGapR > 0
                ? "text-orange-300"
                : "text-foreground",
            )}
          >
            {formatR(analysis.hindsightGapR)}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            {analysis.comparableCount > 0
              ? `${analysis.comparableCount} 笔事后假设 R 减计划目标 R`
              : "同笔填写两项 R 后可比较"}
          </p>
        </div>
        <div className="bg-background/30 rounded-lg border p-3">
          <p className="text-muted-foreground text-[11px]">高价值错失</p>
          <p className="mt-1 text-xl font-semibold text-amber-300 tabular-nums">
            {analysis.highValueCount} 笔
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            事后假设回报超过 2R
          </p>
        </div>
      </div>

      <p className="rounded-md bg-orange-950/20 px-2.5 py-2 text-[10px] leading-relaxed text-orange-100/70">
        错失机会 R 是复盘用的机会成本；多笔合计值不代表当天能够全部实现的收益。
      </p>

      <div>
        <p className="mb-2 text-xs font-medium">事后机会空间分布</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {analysis.distribution.map((band) => (
            <div
              key={band.key}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-center",
                PROFIT_BAND_STYLES[band.key],
              )}
            >
              <p className="text-[11px] font-medium">{band.label}</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums">
                {band.count} 笔
              </p>
              <p className="text-[10px] opacity-75">
                合计 {formatR(band.totalR)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <MissedOpportunitySource
          title="计划中潜力最大的错失机会"
          source={analysis.largestPlannedOpportunity}
          value="planned"
        />
        <MissedOpportunitySource
          title="事后机会成本最大的错失机会"
          source={analysis.largestHypotheticalOpportunity}
          value="hypothetical"
        />
      </div>

      {analysis.reasons.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium">错失原因造成的机会成本</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {analysis.reasons.map((reason) => (
              <div
                key={reason.label}
                className="bg-background/25 rounded-lg border p-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium">{reason.label}</p>
                  <span className="text-sm font-semibold text-orange-300 tabular-nums">
                    {reason.evaluatedCount > 0
                      ? formatR(reason.totalHypotheticalR)
                      : "—"}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  {reason.count} 笔 · 平均事后{" "}
                  {formatR(reason.averageHypotheticalR)}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  计划记录 {reason.plannedCount}/{reason.count} 笔
                  {reason.plannedCount > 0
                    ? ` · 合计 ${formatR(reason.totalPlannedR)}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.strategies.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b">
              <tr>
                <th className="px-3 py-2 font-medium">策略</th>
                <th className="px-3 py-2 font-medium">错失次数</th>
                <th className="px-3 py-2 font-medium">平均计划 R</th>
                <th className="px-3 py-2 font-medium">事后假设 R</th>
                <th className="px-3 py-2 font-medium">平均事后 R</th>
                <th className="px-3 py-2 font-medium">事后超计划</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {analysis.strategies.map((strategy) => (
                <tr key={strategy.name}>
                  <td className="px-3 py-2.5 font-medium text-orange-200">
                    {strategy.name}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {strategy.missedCount} 笔
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {formatR(strategy.averagePlannedR)}
                    <p className="text-muted-foreground mt-0.5 text-[9px]">
                      {strategy.plannedCount}/{strategy.missedCount} 笔已记录
                    </p>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-orange-300 tabular-nums">
                    {strategy.evaluatedCount > 0
                      ? formatR(strategy.totalHypotheticalR)
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {formatR(strategy.averageHypotheticalR)}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {formatR(strategy.hindsightGapR)}
                    <p className="text-muted-foreground mt-0.5 text-[9px]">
                      {strategy.comparableCount} 笔可比较
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StrategyComparison({
  strategies,
  insights,
}: {
  strategies: MnqStrategySummary[];
  insights: string[];
}) {
  if (strategies.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-indigo-500/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Layers3 className="h-3.5 w-3.5" />
            当日策略对比
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            同时比较机会供给、执行覆盖、实际结果和错失成本
          </p>
        </div>
        <span className="text-muted-foreground text-[10px]">
          仅代表当日样本
        </span>
      </div>

      {insights.length > 0 && (
        <div className="grid gap-2 md:grid-cols-3">
          {insights.map((insight) => (
            <div
              key={insight}
              className="text-foreground/75 rounded-md bg-indigo-950/25 px-2.5 py-2 text-[11px] leading-relaxed"
            >
              {insight}
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground border-b">
            <tr>
              <th className="px-3 py-2 font-medium">策略</th>
              <th className="px-3 py-2 font-medium">机会与把握</th>
              <th className="px-3 py-2 font-medium">实际结果</th>
              <th className="px-3 py-2 font-medium">错失成本</th>
              <th className="px-3 py-2 font-medium">执行准确性</th>
              <th className="px-3 py-2 font-medium">当日诊断</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {strategies.map((strategy) => (
              <tr key={strategy.name} className="align-top">
                <td className="max-w-48 px-3 py-2.5">
                  <div className="font-medium text-indigo-300">
                    {strategy.name}
                  </div>
                  {strategy.tradeTypes.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {strategy.tradeTypes.map((tradeType) => (
                        <span
                          key={tradeType}
                          className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]"
                        >
                          {tradeType}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="font-medium tabular-nums">
                    {percentage(strategy.captureRate)}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[10px]">
                    {strategy.totalCount} 机会 · {strategy.capturedCount} 把握 ·{" "}
                    {strategy.missedCount} 错失
                    {strategy.pendingCount > 0
                      ? ` · ${strategy.pendingCount} 待标记`
                      : ""}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div
                    className={cn(
                      "font-medium tabular-nums",
                      strategy.actualPnL > 0 && "text-green-400",
                      strategy.actualPnL < 0 && "text-red-400",
                    )}
                  >
                    {strategy.settledCount > 0
                      ? formatCurrency(strategy.actualPnL)
                      : "—"}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[10px]">
                    {strategy.realizedRCount > 0
                      ? `${strategy.realizedR >= 0 ? "+" : ""}${strategy.realizedR.toFixed(2)}R`
                      : "实际 R 未完整"}
                    {strategy.winRate !== null
                      ? ` · 胜率 ${strategy.winRate.toFixed(0)}%`
                      : ""}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div
                    className={cn(
                      "font-medium tabular-nums",
                      strategy.missedPotentialR > 0 && "text-orange-400",
                    )}
                  >
                    {strategy.missedEvaluatedCount > 0
                      ? `${strategy.missedPotentialR >= 0 ? "+" : ""}${strategy.missedPotentialR.toFixed(2)}R`
                      : "—"}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[10px]">
                    {strategy.missedEvaluatedCount}/{strategy.missedCount}{" "}
                    个已评估
                  </div>
                  {strategy.topMissedReason && (
                    <div className="mt-1 text-[10px] text-orange-300/80">
                      主要：{strategy.topMissedReason}
                    </div>
                  )}
                </td>
                <td className="text-muted-foreground px-3 py-2.5">
                  <div>进入 {percentage(strategy.entryAccuracyRate)}</div>
                  <div className="mt-0.5">
                    退出 {percentage(strategy.exitAccuracyRate)}
                  </div>
                </td>
                <td className="text-foreground/75 max-w-64 px-3 py-2.5 text-[11px] leading-relaxed">
                  {strategy.assessment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MissedReasonAnalysis({
  reasons,
}: {
  reasons: MnqMissedReasonSummary[];
}) {
  if (reasons.length === 0) return null;
  const maxCount = Math.max(...reasons.map((reason) => reason.count), 1);
  const unclassified = reasons.find(
    (reason) => reason.category === "UNCLASSIFIED",
  );

  return (
    <div className="space-y-3 rounded-lg border border-orange-500/20 p-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          错失原因诊断
        </div>
        <p className="text-muted-foreground mt-1 text-[11px]">
          同时观察发生次数和对应的假设 R，优先解决高频且高成本的原因
        </p>
      </div>

      {unclassified && (
        <div className="rounded-md bg-amber-950/25 px-2.5 py-2 text-[11px] text-amber-300/90">
          有 {unclassified.count}{" "}
          个错失机会尚未分类，可在“盘中记录”的对应机会中补选。
        </div>
      )}

      <div className="space-y-2">
        {reasons.map((reason) => (
          <div
            key={reason.category}
            className="bg-background/20 space-y-2.5 rounded-lg border p-2.5"
          >
            <div className="grid grid-cols-[8rem_1fr_auto] items-center gap-2">
              <div>
                <p className="truncate text-[11px] font-medium">
                  {reason.label}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {reason.count} 次 · {reason.share.toFixed(0)}%
                </p>
              </div>
              <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    reason.category === "UNCLASSIFIED"
                      ? "bg-muted-foreground/50"
                      : "bg-orange-500/75",
                  )}
                  style={{ width: `${(reason.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="min-w-14 text-right text-[11px] font-medium text-orange-400 tabular-nums">
                {reason.hypotheticalR > 0
                  ? `+${reason.hypotheticalR.toFixed(2)}R`
                  : "—"}
              </span>
            </div>

            <div className="space-y-1.5 border-t border-orange-500/10 pt-2">
              {reason.details.map((detail) => (
                <div
                  key={detail.id}
                  className="rounded-md bg-orange-950/15 px-2.5 py-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-foreground/85 text-[11px] leading-relaxed font-medium">
                      {detail.description}
                    </p>
                    {detail.hypotheticalR !== null && (
                      <span className="shrink-0 text-[11px] font-semibold text-orange-300 tabular-nums">
                        {formatR(detail.hypotheticalR)}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[9px]">
                    {detail.segment} · {detail.strategy}
                  </p>
                  <div className="mt-1.5 border-l-2 border-orange-500/35 pl-2">
                    <p className="text-[9px] font-medium text-orange-300/80">
                      具体错失过程
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-[11px] leading-relaxed whitespace-pre-wrap",
                        detail.process
                          ? "text-foreground/75"
                          : "text-muted-foreground italic",
                      )}
                    >
                      {detail.process ? detail.process : "尚未填写具体错失过程"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function expectedLevelDescription(node: MnqLevelForecastNode): string {
  const timeframe = MNQ_LEVEL_TIMEFRAME_OPTIONS.find(
    (option) => option.value === node.decisionTimeframe,
  )?.label;
  const reaction = MNQ_LEVEL_EXPECTED_REACTIONS.find(
    (option) => option.value === node.expectedReaction,
  )?.label;
  return `${formatLevelName(node)}${timeframe ? ` [${timeframe}]` : ""}${
    reaction ? `，预期${reaction}` : ""
  }`;
}

function actualLevelDescription(node: MnqLevelForecastNode): string {
  if (!node.actualReaction) {
    return `${formatLevelName(node)}${
      node.status === "PLANNED" ? "尚未激活" : "尚未记录实际反应"
    }`;
  }
  if (node.actualReaction === "NOT_TESTED") {
    return `${formatLevelName(node)}未触及`;
  }

  const reaction = MNQ_LEVEL_ACTUAL_REACTIONS.find(
    (option) => option.value === node.actualReaction,
  )?.label;
  const timeframe = formatActualLevelTimeframe(node);
  const accuracy =
    node.accuracy === "CORRECT"
      ? "判断正确"
      : node.accuracy === "PARTIAL"
        ? "部分正确"
        : node.accuracy === "WRONG"
          ? "判断错误"
          : "尚未评估";
  const expectedLevel = formatLevelName(node);
  const actualLevel = formatActualLevelName(node);
  if (actualLevel === "尚未选择") {
    return `${expectedLevel}的实际 Level 尚未补录，实际反应为${
      reaction ?? "待补录"
    }，${accuracy}`;
  }
  const levelComparison =
    actualLevel === expectedLevel
      ? actualLevel
      : `${expectedLevel}对应的实际 Level 为${actualLevel}`;
  return `${levelComparison}${
    timeframe === "未选择" ? "" : `（${timeframe}）`
  }出现${reaction ?? "实际反应待补录"}，${accuracy}`;
}

function buildLevelSituationSummary(segment: MnqSegmentSummary): {
  side: "upper" | "lower" | "summary";
  text: string;
}[] {
  const summaries = (["upper", "lower"] as const).flatMap((side) => {
    const chain = segment.levelForecasts[side];
    if (chain.length === 0) return [];
    const sideLabel = side === "upper" ? "上端" : "下端";
    const expectedPath = chain.map(expectedLevelDescription).join(" → ");
    const actualPath = chain.map(actualLevelDescription).join("；");
    return [
      {
        side,
        text: `${sideLabel}预计路径为 ${expectedPath}。实际为 ${actualPath}。`,
      },
    ];
  });

  const { evaluated, correct, partial, wrong, notTested } =
    segment.levelSummary;
  let conclusion: string;
  if (evaluated === 0) {
    conclusion =
      notTested > 0
        ? `本时段有 ${notTested} 个预计 Level 未触及，暂无有效准确性结论。`
        : "本时段尚未完成 Level 实际判断。";
  } else if (wrong === 0 && partial === 0) {
    conclusion = `已验证 ${evaluated} 个 Level，全部符合预计路径。`;
  } else {
    const resultBreakdown = [
      correct > 0 ? `正确 ${correct} 个` : "",
      partial > 0 ? `部分正确 ${partial} 个` : "",
      wrong > 0 ? `错误 ${wrong} 个` : "",
      notTested > 0 ? `另有 ${notTested} 个未触及` : "",
    ]
      .filter(Boolean)
      .join("、");
    conclusion = `已验证 ${evaluated} 个 Level：${resultBreakdown}。`;
  }

  const deepest = segment.levelSummary.deepestCompletedSequence;
  if (deepest > 1) {
    conclusion += ` 行情最深推进至第 ${deepest} 层 Level。`;
  }

  return [...summaries, { side: "summary", text: conclusion }];
}

function MarketJudgmentReview({ segments }: { segments: MnqSegmentSummary[] }) {
  const premarketSegment = segments.find(
    (segment) =>
      segment.key === "marketPreJson" && segment.premarketPhases.length > 0,
  );
  const coreSegments = segments.filter(
    (segment) =>
      (segment.key === "marketOpenJson" || segment.key === "marketMidJson") &&
      [
        segment.expectedType,
        segment.expectedDirection,
        segment.expectedNote,
        segment.actualType,
        segment.actualDirection,
        segment.actualNote,
        segment.accuracy,
        segment.levelSummary.planned > 0,
        segment.opportunityImpact,
        segment.impactNote,
      ].some(Boolean),
  );
  const afternoonSegment = segments.find(
    (segment) => segment.key === "marketAfternoonJson",
  );
  const hasAfternoonData = Boolean(
    afternoonSegment &&
    [
      afternoonSegment.actualType,
      afternoonSegment.actualDirection,
      afternoonSegment.actualNote,
      afternoonSegment.captured,
      afternoonSegment.missed,
      afternoonSegment.pending,
    ].some(Boolean),
  );
  if (!premarketSegment && coreSegments.length === 0 && !hasAfternoonData)
    return null;

  const accuracyTone = (accuracy: MnqSegmentSummary["accuracy"]) =>
    cn(
      "border px-2 py-1 text-[11px] font-semibold",
      accuracy === "CORRECT" &&
        "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
      accuracy === "PARTIAL" &&
        "border-amber-500/40 bg-amber-500/15 text-amber-300",
      accuracy === "WRONG" && "border-red-500/40 bg-red-500/15 text-red-300",
    );

  const impactTone = (impact: MnqSegmentSummary["opportunityImpact"]) =>
    cn(
      "border",
      impact === "POSITIVE" && "border-emerald-500/25 bg-emerald-500/10",
      impact === "NEGATIVE" && "border-red-500/25 bg-red-500/10",
      impact === "NONE" && "border-slate-500/20 bg-slate-500/10",
    );

  return (
    <div className="space-y-3 rounded-lg border border-violet-500/20 p-3">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
          <Crosshair className="h-3.5 w-3.5" />
          MNQ 分时行情复盘
        </div>
        <p className="text-muted-foreground mt-1 text-[11px]">
          汇总盘前细分、核心交易时段与午盘收尾；部分准确按 0.5 计入综合得分
        </p>
      </div>
      {premarketSegment && (
        <div className="space-y-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <div>
            <p className="text-xs font-semibold text-cyan-300">盘前行情细分</p>
            <p className="text-muted-foreground mt-0.5 text-[10px]">
              对照隔夜结构与美国盘前变化，观察行情是否延续或反转
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {premarketSegment.premarketPhases.map((phase) => (
              <div
                key={phase.key}
                className="border-border/50 bg-background/20 space-y-1.5 rounded-md border p-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground/90 text-[11px] font-semibold">
                    {phase.label}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {phase.time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {phase.type && (
                    <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-medium text-cyan-200">
                      {MNQ_MARKET_TYPE_LABELS[phase.type]}
                    </span>
                  )}
                  {phase.direction && (
                    <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-200">
                      {MNQ_MARKET_DIRECTION_LABELS[phase.direction]}
                    </span>
                  )}
                  {!phase.type && !phase.direction && !phase.note && (
                    <span className="text-muted-foreground text-[10px]">
                      未记录
                    </span>
                  )}
                </div>
                {phase.note && (
                  <p className="text-foreground/60 text-[11px] leading-relaxed">
                    {phase.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {coreSegments.map((segment) => (
          <div
            key={segment.key}
            className="border-border/60 bg-muted/10 space-y-3 rounded-lg border p-3"
          >
            <div className="border-border/40 flex items-center justify-between gap-3 border-b pb-2.5">
              <div>
                <p className="text-foreground text-xs font-semibold">
                  {segment.label}行情
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px]">
                  预计与实际对照
                </p>
              </div>
              {segment.accuracy ? (
                <span
                  className={cn("rounded-md", accuracyTone(segment.accuracy))}
                >
                  {MNQ_MARKET_ACCURACY_LABELS[segment.accuracy]}
                </span>
              ) : (
                <span className="border-border/60 text-muted-foreground rounded-md border px-2 py-1 text-[10px]">
                  未评估
                </span>
              )}
            </div>

            <div className="grid gap-3 text-[11px] sm:grid-cols-2">
              <div className="space-y-1.5 border-l-2 border-cyan-500/50 pl-2.5">
                <p className="text-[10px] font-medium tracking-wide text-cyan-400">
                  预计行情
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {segment.expectedType && (
                    <span className="rounded bg-cyan-500/12 px-1.5 py-0.5 font-medium text-cyan-200">
                      {MNQ_MARKET_TYPE_LABELS[segment.expectedType]}
                    </span>
                  )}
                  {segment.expectedDirection && (
                    <span className="rounded bg-cyan-500/12 px-1.5 py-0.5 font-medium text-cyan-200">
                      {MNQ_MARKET_DIRECTION_LABELS[segment.expectedDirection]}
                    </span>
                  )}
                  {!segment.expectedType && !segment.expectedDirection && (
                    <span className="text-muted-foreground">
                      未填写结构判断
                    </span>
                  )}
                </div>
                {segment.expectedNote && (
                  <p className="text-foreground/60 leading-relaxed">
                    {segment.expectedNote}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 border-l-2 border-violet-500/50 pl-2.5">
                <p className="text-[10px] font-medium tracking-wide text-violet-400">
                  实际行情
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {segment.actualType && (
                    <span className="rounded bg-violet-500/12 px-1.5 py-0.5 font-medium text-violet-200">
                      {MNQ_MARKET_TYPE_LABELS[segment.actualType]}
                    </span>
                  )}
                  {segment.actualDirection && (
                    <span className="rounded bg-violet-500/12 px-1.5 py-0.5 font-medium text-violet-200">
                      {MNQ_MARKET_DIRECTION_LABELS[segment.actualDirection]}
                    </span>
                  )}
                  {!segment.actualType && !segment.actualDirection && (
                    <span className="text-muted-foreground">
                      未填写结构判断
                    </span>
                  )}
                </div>
                {segment.actualNote && (
                  <p className="text-foreground/60 leading-relaxed">
                    {segment.actualNote}
                  </p>
                )}
              </div>
            </div>

            {segment.levelSummary.planned > 0 ? (
              <div className="space-y-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 p-2.5">
                <p className="text-[10px] font-semibold text-violet-300">
                  Level 行情总结
                </p>
                {buildLevelSituationSummary(segment).map((summary, index) => (
                  <p
                    key={`${summary.side}-${index}`}
                    className={cn(
                      "text-[11px] leading-relaxed",
                      summary.side === "upper" && "text-emerald-200/80",
                      summary.side === "lower" && "text-rose-200/80",
                      summary.side === "summary" &&
                        "text-foreground/75 border-border/40 border-t pt-1.5 font-medium",
                    )}
                  >
                    {summary.text}
                  </p>
                ))}
              </div>
            ) : null}

            {segment.levelSummary.planned > 0 ? (
              <div className="space-y-2 rounded-md border border-cyan-500/15 bg-slate-950/20 p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold text-cyan-300">
                    Level 预计与实际明细
                  </p>
                  <span className="text-muted-foreground text-[9px]">
                    计划 {segment.levelSummary.planned} · 已验证{" "}
                    {segment.levelSummary.evaluated} · 未触及{" "}
                    {segment.levelSummary.notTested}
                  </span>
                </div>

                {(["upper", "lower"] as const).map((side) => {
                  const chain = segment.levelForecasts[side];
                  if (chain.length === 0) return null;
                  return (
                    <div key={side} className="space-y-1.5">
                      <p
                        className={cn(
                          "text-[10px] font-medium",
                          side === "upper"
                            ? "text-emerald-300"
                            : "text-rose-300",
                        )}
                      >
                        {side === "upper" ? "上端链" : "下端链"}
                      </p>
                      {chain.map((node) => {
                        const timeframe = MNQ_LEVEL_TIMEFRAME_OPTIONS.find(
                          (option) => option.value === node.decisionTimeframe,
                        )?.label;
                        const expectedReaction =
                          MNQ_LEVEL_EXPECTED_REACTIONS.find(
                            (option) => option.value === node.expectedReaction,
                          )?.label;
                        const actualReaction = MNQ_LEVEL_ACTUAL_REACTIONS.find(
                          (option) => option.value === node.actualReaction,
                        )?.label;
                        return (
                          <div
                            key={node.id}
                            className="border-border/50 bg-background/20 space-y-1.5 rounded border p-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold">
                                  {node.sequence}. {formatLevelName(node)}
                                  {node.referencePrice
                                    ? ` · ${node.referencePrice}`
                                    : ""}
                                </span>
                                {timeframe ? (
                                  <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-medium text-violet-200">
                                    {timeframe} 判断
                                  </span>
                                ) : null}
                              </div>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[9px]",
                                  node.status === "ACTIVE" &&
                                    "bg-cyan-500/15 text-cyan-300",
                                  node.status === "PLANNED" &&
                                    "bg-slate-500/15 text-slate-400",
                                  node.status === "COMPLETED" &&
                                    "bg-emerald-500/15 text-emerald-300",
                                  node.status === "PAUSED" &&
                                    "bg-red-500/15 text-red-300",
                                  node.status === "INVALIDATED" &&
                                    "bg-zinc-500/15 text-zinc-400",
                                )}
                              >
                                {node.status === "ACTIVE"
                                  ? "当前"
                                  : node.status === "PLANNED"
                                    ? "待激活"
                                    : node.status === "COMPLETED"
                                      ? "已完成"
                                      : node.status === "PAUSED"
                                        ? "已暂停"
                                        : "已失效"}
                              </span>
                            </div>

                            <div className="grid gap-1.5 sm:grid-cols-2">
                              <div className="border-l-2 border-cyan-500/40 pl-2">
                                <p className="text-[9px] font-medium text-cyan-300/80">
                                  预计反应
                                </p>
                                <p className="text-foreground/75 mt-0.5 text-[10px]">
                                  {expectedReaction ?? "未记录"}
                                </p>
                                {node.confirmationCondition ? (
                                  <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                                    判断依据：{node.confirmationCondition}
                                  </p>
                                ) : null}
                                {node.expectedNote ? (
                                  <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                                    {node.expectedNote}
                                  </p>
                                ) : null}
                              </div>

                              <div className="border-l-2 border-violet-500/40 pl-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[9px] font-medium text-violet-300/80">
                                    实际反应
                                  </p>
                                  {node.accuracy ? (
                                    <span
                                      className={cn(
                                        "rounded px-1 py-0.5 text-[9px]",
                                        node.accuracy === "CORRECT" &&
                                          "bg-green-500/15 text-green-300",
                                        node.accuracy === "PARTIAL" &&
                                          "bg-amber-500/15 text-amber-300",
                                        node.accuracy === "WRONG" &&
                                          "bg-red-500/15 text-red-300",
                                        node.accuracy === "NOT_TRIGGERED" &&
                                          "bg-slate-500/15 text-slate-300",
                                      )}
                                    >
                                      {node.accuracy === "CORRECT"
                                        ? "正确"
                                        : node.accuracy === "PARTIAL"
                                          ? "部分正确"
                                          : node.accuracy === "WRONG"
                                            ? "错误"
                                            : "未触及"}
                                    </span>
                                  ) : null}
                                </div>
                                {node.actualReaction &&
                                node.actualReaction !== "NOT_TESTED" ? (
                                  <p className="text-foreground/75 mt-0.5 text-[10px]">
                                    实际 Level：{formatActualLevelName(node)}
                                    {" · "}
                                    {formatActualLevelTimeframe(node)}
                                  </p>
                                ) : null}
                                <p className="text-foreground/75 mt-0.5 text-[10px]">
                                  {actualReaction ?? "尚未记录"}
                                </p>
                                {node.actualNote ? (
                                  <p className="text-muted-foreground mt-1 text-[10px] leading-relaxed">
                                    {node.actualNote}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {(segment.accuracy === "PARTIAL" ||
              segment.accuracy === "WRONG") && (
              <div className="rounded-md border border-amber-500/25 bg-amber-500/10 p-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-0.5 text-[10px] font-semibold text-amber-400">
                    判断偏差
                  </span>
                  {segment.deviationReason ? (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
                      {
                        MNQ_MARKET_DEVIATION_REASON_LABELS[
                          segment.deviationReason
                        ]
                      }
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[10px]">
                      尚未分类
                    </span>
                  )}
                  {segment.secondaryDeviationReasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-200/80"
                    >
                      {MNQ_MARKET_DEVIATION_REASON_LABELS[reason]}
                    </span>
                  ))}
                </div>
                {segment.deviationNote && (
                  <p className="text-foreground/65 mt-1.5 text-[11px] leading-relaxed">
                    {segment.deviationNote}
                  </p>
                )}
              </div>
            )}

            {segment.opportunityImpact && (
              <div
                className={cn(
                  "rounded-md p-2.5",
                  impactTone(segment.opportunityImpact),
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "mr-0.5 text-[10px] font-semibold",
                      segment.opportunityImpact === "POSITIVE" &&
                        "text-emerald-400",
                      segment.opportunityImpact === "NEGATIVE" &&
                        "text-red-400",
                      segment.opportunityImpact === "NONE" && "text-slate-400",
                    )}
                  >
                    机会影响
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      segment.opportunityImpact === "POSITIVE" &&
                        "bg-emerald-500/15 text-emerald-200",
                      segment.opportunityImpact === "NEGATIVE" &&
                        "bg-red-500/15 text-red-200",
                      segment.opportunityImpact === "NONE" &&
                        "bg-slate-500/15 text-slate-300",
                    )}
                  >
                    {
                      MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS[
                        segment.opportunityImpact
                      ]
                    }
                  </span>
                  {segment.impactTypes.map((type) => (
                    <span
                      key={type}
                      className="text-foreground/70 rounded border border-current/20 px-1.5 py-0.5 text-[10px]"
                    >
                      {MNQ_MARKET_IMPACT_TYPE_LABELS[type]}
                    </span>
                  ))}
                  {segment.affectedOpportunities.length > 0 && (
                    <span className="text-foreground/70 text-[10px] font-medium">
                      关联 {segment.affectedOpportunities.length} 个机会
                    </span>
                  )}
                </div>
                {segment.impactNote && (
                  <p className="text-foreground/65 mt-1.5 text-[11px] leading-relaxed">
                    {segment.impactNote}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {afternoonSegment && (
        <div className="space-y-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-indigo-300">午盘行情</p>
              <p className="text-muted-foreground mt-0.5 text-[10px]">
                13:00–收盘
              </p>
            </div>
            {afternoonSegment.captured +
              afternoonSegment.missed +
              afternoonSegment.pending >
              0 && (
              <div className="flex gap-1.5 text-[10px]">
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-300">
                  把握 {afternoonSegment.captured}
                </span>
                <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-orange-300">
                  错失 {afternoonSegment.missed}
                </span>
                {afternoonSegment.pending > 0 && (
                  <span className="rounded bg-slate-500/15 px-1.5 py-0.5 text-slate-300">
                    待评 {afternoonSegment.pending}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {afternoonSegment.actualType && (
              <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium text-indigo-200">
                {MNQ_MARKET_TYPE_LABELS[afternoonSegment.actualType]}
              </span>
            )}
            {afternoonSegment.actualDirection && (
              <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium text-violet-200">
                {MNQ_MARKET_DIRECTION_LABELS[afternoonSegment.actualDirection]}
              </span>
            )}
            {!hasAfternoonData && (
              <span className="text-muted-foreground text-[10px]">
                未记录午盘行情
              </span>
            )}
          </div>
          {afternoonSegment.actualNote && (
            <p className="text-foreground/60 text-[11px] leading-relaxed">
              {afternoonSegment.actualNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MarketDaySynthesis({ analysis }: { analysis: MnqMarketDayAnalysis }) {
  if (analysis.recordedCount === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-sky-500/25 bg-sky-500/5 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
            <Lightbulb className="h-3.5 w-3.5" />
            当日行情综合分析
          </div>
          <p className="text-foreground/90 mt-1 text-sm font-semibold">
            {analysis.headline}
          </p>
        </div>
        <div className="flex gap-1.5 text-[10px]">
          <span className="rounded border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-sky-300">
            已记录 {analysis.recordedCount}/5
          </span>
          <span className="rounded border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-violet-300">
            切换 {analysis.transitionCount} 次
          </span>
        </div>
      </div>

      <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
        {analysis.points.map((point, index) => (
          <div key={point.key} className="contents">
            {index > 0 && (
              <span className="text-muted-foreground/40 flex shrink-0 items-center text-xs">
                →
              </span>
            )}
            <div
              className={cn(
                "min-w-28 flex-1 rounded-md border p-2",
                point.recorded
                  ? "bg-background/25 border-sky-500/20"
                  : "border-border/50 bg-muted/5 border-dashed",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-foreground/85 text-[10px] font-semibold">
                  {point.label}
                </span>
                <span className="text-muted-foreground/60 text-[9px]">
                  {point.time}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {point.type && (
                  <span className="rounded bg-cyan-500/15 px-1 py-0.5 text-[9px] text-cyan-200">
                    {MNQ_MARKET_TYPE_LABELS[point.type]}
                  </span>
                )}
                {point.direction && (
                  <span className="rounded bg-violet-500/15 px-1 py-0.5 text-[9px] text-violet-200">
                    {MNQ_MARKET_DIRECTION_LABELS[point.direction]}
                  </span>
                )}
                {!point.recorded && (
                  <span className="text-muted-foreground text-[9px]">
                    未记录
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {analysis.insights.length > 0 && (
        <div className="grid gap-1.5 md:grid-cols-2">
          {analysis.insights.map((insight) => (
            <div
              key={insight}
              className="bg-background/20 text-foreground/70 flex gap-2 rounded-md px-2.5 py-2 text-[11px] leading-relaxed"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/70" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DailyOpportunityAnalysis({ plan }: Props) {
  const analysis = analyzeDailyOpportunities(plan);

  return (
    <Card className="overflow-hidden border-cyan-500/25">
      <CardContent className="space-y-4 pt-5 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold">
                MNQ 今日交易机会综合分析
              </h2>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              汇总 MNQ 盘前、开盘、盘中与午盘行情中记录的交易机会
            </p>
          </div>
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">
            {analysis.totalCount} 个记录机会
          </Badge>
        </div>

        <MarketDaySynthesis analysis={analysis.marketDayAnalysis} />
        <MarketJudgmentReview segments={analysis.segments} />

        {analysis.totalCount === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-cyan-400/60" />
            <p className="mt-3 text-sm font-medium">
              MNQ 行情中尚未记录交易机会
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              在盘中记录的 MNQ 行情时段下添加机会后，这里会自动生成综合分析。
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Metric
                label="机会把握率"
                value={percentage(analysis.captureRate)}
                detail={`${analysis.capturedCount} 把握 / ${analysis.missedCount} 错失${analysis.pendingCount > 0 ? ` / ${analysis.pendingCount} 待标记` : ""}`}
              />
              <Metric
                label="已把握实际盈亏"
                value={
                  analysis.settledCount > 0
                    ? formatCurrency(analysis.actualPnL)
                    : "—"
                }
                detail={`${analysis.settledCount}/${analysis.capturedCount} 笔已填写完整价格`}
                tone={
                  analysis.actualPnL > 0
                    ? "positive"
                    : analysis.actualPnL < 0
                      ? "negative"
                      : "neutral"
                }
              />
              <Metric
                label="成交胜率"
                value={percentage(analysis.winRate)}
                detail={`${analysis.wins} 盈 / ${analysis.losses} 亏`}
              />
              <Metric
                label="错失机会假设回报"
                value={
                  analysis.missedEvaluatedCount > 0
                    ? `${analysis.missedPotentialR >= 0 ? "+" : ""}${analysis.missedPotentialR.toFixed(2)}R`
                    : "—"
                }
                detail={`${analysis.missedEvaluatedCount}/${analysis.missedCount} 个已评估风险回报`}
                tone={analysis.missedPotentialR > 0 ? "negative" : "neutral"}
              />
            </div>

            <ProfitDetailAnalysis analysis={analysis.profitAnalysis} />

            <MissedProfitDetailAnalysis
              analysis={analysis.missedProfitAnalysis}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium">
                  <Crosshair className="h-3.5 w-3.5 text-violet-400" />
                  判断与执行质量
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-semibold tabular-nums">
                      {percentage(analysis.segmentAccuracyRate)}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      行情判断
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-[9px]">
                      {analysis.segmentAccuracyCounts.correct}准 ·{" "}
                      {analysis.segmentAccuracyCounts.partial}部分 ·{" "}
                      {analysis.segmentAccuracyCounts.wrong}错
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold tabular-nums">
                      {percentage(analysis.entryAccuracyRate)}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      进入准确率
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold tabular-nums">
                      {percentage(analysis.exitAccuracyRate)}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      退出准确率
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium">
                  <CircleDollarSign className="h-3.5 w-3.5 text-amber-400" />
                  分时段机会分布
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {analysis.segments.map((segment) => (
                    <div
                      key={segment.key}
                      className="bg-muted/30 rounded px-1 py-1.5"
                    >
                      <p className="text-[11px] font-medium">{segment.label}</p>
                      <p className="text-muted-foreground mt-0.5 text-[10px]">
                        <span className="text-green-400">
                          {segment.captured}
                        </span>{" "}
                        /{" "}
                        <span className="text-orange-400">
                          {segment.missed}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-2 text-center text-[10px]">
                  绿色为把握，橙色为错失
                </p>
              </div>
            </div>

            <StrategyComparison
              strategies={analysis.strategies}
              insights={analysis.strategyInsights}
            />

            <MissedReasonAnalysis reasons={analysis.missedReasons} />

            {analysis.insights.length > 0 && (
              <div className="rounded-lg bg-cyan-950/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-cyan-300">
                  <Lightbulb className="h-3.5 w-3.5" />
                  今日评估要点
                </div>
                <ul className="space-y-1.5">
                  {analysis.insights.map((insight) => (
                    <li
                      key={insight}
                      className="text-foreground/80 flex gap-2 text-xs leading-relaxed"
                    >
                      <span className="text-cyan-400">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b">
                  <tr>
                    <th className="px-3 py-2 font-medium">时段与机会</th>
                    <th className="px-3 py-2 font-medium">结果</th>
                    <th className="px-3 py-2 font-medium">策略</th>
                    <th className="px-3 py-2 font-medium">盈亏影响</th>
                    <th className="px-3 py-2 font-medium">准确性</th>
                    <th className="px-3 py-2 font-medium">复盘记录</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analysis.rows.map((row) => (
                    <tr key={row.id} className="align-top">
                      <td className="max-w-64 px-3 py-2.5">
                        <div className="font-medium">
                          {row.segment} · {row.segmentTime}
                        </div>
                        <div className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                          {row.description}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            row.status === "CAPTURED" && "text-green-400",
                            row.status === "MISSED" && "text-orange-400",
                            row.status === "PENDING" && "text-muted-foreground",
                          )}
                        >
                          {row.status === "CAPTURED" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : row.status === "MISSED" ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <Clock3 className="h-3 w-3" />
                          )}
                          {row.status === "CAPTURED"
                            ? "已把握"
                            : row.status === "MISSED"
                              ? "已错失"
                              : "待标记"}
                        </span>
                        {row.direction && (
                          <div className="text-muted-foreground mt-1 text-[10px]">
                            {row.direction === "LONG" ? "做多" : "做空"}
                          </div>
                        )}
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5">
                        <div>{row.strategy ?? "未选择"}</div>
                        {(row.tradeType ?? row.decisionTimeframe) && (
                          <div className="mt-0.5 text-[10px]">
                            {row.tradeType ?? ""}
                            {row.tradeType && row.decisionTimeframe
                              ? " · "
                              : ""}
                            {row.decisionTimeframe
                              ? MNQ_DECISION_TIMEFRAME_LABELS[
                                  row.decisionTimeframe
                                ]
                              : ""}
                          </div>
                        )}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 font-medium tabular-nums",
                          (row.pnl ?? 0) > 0 && "text-green-400",
                          (row.pnl ?? 0) < 0 && "text-red-400",
                          row.hypotheticalR !== null && "text-orange-400",
                        )}
                      >
                        <div>
                          {row.pnl !== null
                            ? formatCurrency(row.pnl)
                            : row.hypotheticalR !== null
                              ? `假设 ${row.hypotheticalR.toFixed(2)}R`
                              : "未评估"}
                        </div>
                        {row.status === "CAPTURED" &&
                          (row.realizedR !== null ||
                            row.plannedTargetR !== null) && (
                            <div className="text-muted-foreground mt-0.5 text-[10px] font-normal">
                              {row.realizedR !== null
                                ? `实际 ${row.realizedR >= 0 ? "+" : ""}${row.realizedR.toFixed(2)}R`
                                : "实际 R 未完整"}
                              {row.plannedTargetR !== null
                                ? ` · 计划 ${row.plannedTargetR.toFixed(2)}R`
                                : ""}
                            </div>
                          )}
                        {row.status === "MISSED" &&
                          row.plannedTargetR !== null && (
                            <div className="mt-0.5 text-[10px] font-normal text-cyan-400/80">
                              计划 {row.plannedTargetR.toFixed(2)}R
                              {row.hypotheticalR !== null
                                ? ` · 潜力差 ${row.hypotheticalR - row.plannedTargetR >= 0 ? "+" : ""}${(row.hypotheticalR - row.plannedTargetR).toFixed(2)}R`
                                : ""}
                            </div>
                          )}
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5">
                        <div>
                          进入{" "}
                          {row.entryAccuracy === "CORRECT"
                            ? "准"
                            : row.entryAccuracy === "WRONG"
                              ? "误"
                              : "—"}
                        </div>
                        <div className="mt-0.5">
                          退出{" "}
                          {row.exitAccuracy === "CORRECT"
                            ? "准"
                            : row.exitAccuracy === "WRONG"
                              ? "误"
                              : "—"}
                        </div>
                      </td>
                      <td className="text-muted-foreground max-w-52 px-3 py-2.5">
                        {row.status === "MISSED" ? (
                          <>
                            <div className="mb-1 text-[10px] font-medium text-orange-300">
                              {row.missedReasonCategory
                                ? MNQ_MISSED_REASON_LABELS[
                                    row.missedReasonCategory
                                  ]
                                : "未分类"}
                            </div>
                            {row.missedProcess || "未填写错失过程"}
                          </>
                        ) : (
                          row.resultNote || "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
