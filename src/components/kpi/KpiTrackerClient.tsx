"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Gauge,
  ListChecks,
  Save,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { KpiChartPoint } from "~/components/kpi/KpiProgressChart";
import { KpiTrendExplorer } from "~/components/kpi/KpiTrendExplorer";
import {
  KpiTradeDetailsTable,
  type KpiMnqTradeDetail,
} from "~/components/kpi/KpiTradeDetailsTable";
import type { KpiPeriod, KpiPeriodSummary } from "~/lib/kpi";
import type { ActiveKpiTargets } from "~/lib/kpi-server";
import { cn } from "~/lib/utils";

interface KpiEntry {
  date: string;
  actualPcts: number;
  note: string | null;
}

interface KpiTrackerClientProps {
  summaries: KpiPeriodSummary[];
  activeTargets: ActiveKpiTargets;
  today: string;
  initialEntry: KpiEntry | null;
  todayIsTradingDay: boolean;
  mnqTrades: KpiMnqTradeDetail[];
}

const PERIOD_LABELS: Partial<Record<KpiPeriod, string>> = {
  week: "本周",
  month: "本月",
  quarter: "本季度",
  half: "本半年度",
  year: "本年度",
};

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "UTC",
});

function formatPcts(value: number): string {
  return `${numberFormatter.format(value)} PTS`;
}

function formatPercent(value: number): string {
  return `${numberFormatter.format(value)}%`;
}

function calculateProgress(actual: number | null, target: number): number {
  if (actual === null || target <= 0) return 0;
  return (actual / target) * 100;
}

const KpiProgressChart = dynamic(
  () =>
    import("~/components/kpi/KpiProgressChart").then(
      (module) => module.KpiProgressChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        加载图表…
      </div>
    ),
  },
);

export function KpiTrackerClient({
  summaries,
  activeTargets,
  today,
  initialEntry,
  todayIsTradingDay,
  mnqTrades,
}: KpiTrackerClientProps) {
  const router = useRouter();
  const [actualInput, setActualInput] = useState(
    initialEntry ? String(initialEntry.actualPcts) : "",
  );
  const [note, setNote] = useState(initialEntry?.note ?? "");
  const [entryExists, setEntryExists] = useState(initialEntry !== null);
  const [savingEntry, setSavingEntry] = useState(false);

  useEffect(() => {
    function refreshWhenVisible() {
      if (document.visibilityState === "visible") router.refresh();
    }

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [router]);

  const chartData: KpiChartPoint[] = summaries.map((summary) => ({
    period: summary.period,
    label: PERIOD_LABELS[summary.period] ?? summary.label,
    actual: summary.actualPcts ?? 0,
    baselineTarget: summary.baselineTarget,
    optimisticTarget: summary.optimisticTarget,
    baselineProgress: calculateProgress(
      summary.actualPcts,
      summary.baselineTarget,
    ),
    optimisticProgress: calculateProgress(
      summary.actualPcts,
      summary.optimisticTarget,
    ),
  }));

  const todayActual = initialEntry?.actualPcts ?? null;
  const baselineCompleted =
    todayActual !== null && todayActual >= activeTargets.dailyBaseline;
  const optimisticCompleted =
    todayActual !== null && todayActual >= activeTargets.dailyOptimistic;

  async function handleEntrySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const actualPcts = Number(actualInput);
    if (actualInput.trim() === "" || !Number.isFinite(actualPcts)) {
      toast.error("请输入有效的实际 PTS");
      return;
    }

    setSavingEntry(true);
    try {
      const response = await fetch(`/api/kpi/records/${today}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualPcts, note: note.trim() || null }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!response.ok || !result.success) {
        toast.error(result.error ?? "保存 KPI 记录失败");
        return;
      }

      setEntryExists(true);
      toast.success("今日 KPI 已保存");
      router.refresh();
    } catch {
      toast.error("网络错误，请稍后重试");
    } finally {
      setSavingEntry(false);
    }
  }

  async function handleDeleteEntry() {
    if (!entryExists || !window.confirm(`确认清除 ${today} 的 KPI 记录？`))
      return;

    const response = await fetch(`/api/kpi/records/${today}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as {
      success: boolean;
      error?: string;
    };
    if (!response.ok || !result.success) {
      toast.error(result.error ?? "清除 KPI 记录失败");
      return;
    }

    setEntryExists(false);
    setActualInput("");
    setNote("");
    toast.success("今日 KPI 已清除");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
            <Gauge aria-hidden="true" className="size-4" />
            KPI Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            今日 KPI
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            记录当天结果，自动更新全部周期目标。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/kpi/yearly?year=${today.slice(0, 4)}`}>
              <CalendarRange aria-hidden="true" className="size-4" />
              年度每日视图
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/kpi/weekly?year=${today.slice(0, 4)}`}>
              <CalendarClock aria-hidden="true" className="size-4" />
              每周视图
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/kpi/monthly?year=${today.slice(0, 4)}`}>
              <CalendarDays aria-hidden="true" className="size-4" />
              每月视图
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/kpi/quarterly?year=${today.slice(0, 4)}`}>
              <CalendarRange aria-hidden="true" className="size-4" />
              每季度视图
            </Link>
          </Button>
          <div className="border-border/70 bg-card/50 flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <CalendarDays
              aria-hidden="true"
              className="text-muted-foreground size-4"
            />
            <time dateTime={today} className="font-medium tabular-nums">
              美东交易日 ·{" "}
              {dateFormatter.format(new Date(`${today}T00:00:00.000Z`))}
            </time>
          </div>
        </div>
      </header>

      <section className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Daily Entry
                </p>
                <h2 className="mt-1 text-lg font-semibold">记录本日交易结果</h2>
              </div>
              {entryExists ? (
                <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-medium">
                  已记录
                </span>
              ) : null}
            </div>

            <form onSubmit={handleEntrySubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="kpi-entry-value">本日实际 PTS</Label>
                <Input
                  id="kpi-entry-value"
                  name="actualPcts"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={actualInput}
                  onChange={(event) => setActualInput(event.target.value)}
                  disabled={!todayIsTradingDay}
                  autoComplete="off"
                  placeholder="输入本日 PTS…"
                  className="h-11 text-lg tabular-nums"
                />
              </div>

              {!todayIsTradingDay ? (
                <p className="text-sm text-amber-400" role="status">
                  系统当日不是美股交易日，不能录入。
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="kpi-entry-note">备注（可选）</Label>
                <Textarea
                  id="kpi-entry-note"
                  name="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={500}
                  rows={3}
                  disabled={!todayIsTradingDay}
                  autoComplete="off"
                  placeholder="记录今天的执行情况…"
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  disabled={!entryExists}
                  onClick={() => void handleDeleteEntry()}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  清除
                </Button>
                <Button
                  type="submit"
                  disabled={savingEntry || !todayIsTradingDay}
                >
                  <Save aria-hidden="true" className="size-4" />
                  {savingEntry ? "保存中…" : "保存本日记录"}
                </Button>
              </div>
            </form>
          </div>

          <aside className="border-border/70 bg-background/30 border-t p-5 lg:border-t-0 lg:border-l lg:p-6">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Daily Targets
            </p>
            <h2 className="mt-1 text-lg font-semibold">本日目标状态</h2>

            <div className="mt-6 space-y-3">
              <DailyTargetRow
                label="基准"
                target={activeTargets.dailyBaseline}
                actual={todayActual}
                completed={baselineCompleted}
                color="blue"
              />
              <DailyTargetRow
                label="乐观"
                target={activeTargets.dailyOptimistic}
                actual={todayActual}
                completed={optimisticCompleted}
                color="emerald"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/70 flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Progress Overview
            </p>
            <h2 className="mt-1 text-lg font-semibold">周期 KPI 完成情况</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              完成率 = 周期累计实际 PTS ÷ 周期目标 PTS
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-blue-500" />
              基准
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-emerald-500" />
              乐观
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-red-500" />
              负值
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div
            className="h-[340px] w-full"
            role="img"
            aria-label="本周、本月、本季度、本半年度和本年度的基准与乐观 KPI 完成率柱状图"
          >
            <KpiProgressChart data={chartData} />
          </div>

          <div className="border-border/70 mt-4 overflow-hidden rounded-lg border">
            {chartData.map((item, index) => (
              <div
                key={item.period}
                className={cn(
                  "grid gap-3 px-4 py-3 text-sm sm:grid-cols-[100px_minmax(100px,1fr)_minmax(150px,1.35fr)_minmax(150px,1.35fr)] sm:items-center",
                  index > 0 && "border-border/70 border-t",
                )}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  累计 {formatPcts(item.actual)}
                </span>
                <PeriodProgress
                  label="基准"
                  progress={item.baselineProgress}
                  target={item.baselineTarget}
                  color="bg-blue-500"
                />
                <PeriodProgress
                  label="乐观"
                  progress={item.optimisticProgress}
                  target={item.optimisticTarget}
                  color="bg-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <KpiTrendExplorer
        initialSummary={
          summaries.find((summary) => summary.period === "month") ??
          summaries[0]!
        }
        today={today}
      />

      <section className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/70 border-b p-5 sm:p-6">
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <ListChecks aria-hidden="true" className="size-4" />
            MNQ Trade Details
          </p>
          <h2 className="mt-1 text-lg font-semibold">MNQ 交易明细</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            直接读取每日 MNQ 日志并自动更新；点击任意交易可返回原始记录。PTS
            按交易方向计算，未平仓交易不计入 KPI。
          </p>
        </div>
        <KpiTradeDetailsTable trades={mnqTrades} />
      </section>
    </div>
  );
}

function DailyTargetRow({
  label,
  target,
  actual,
  completed,
  color,
}: {
  label: string;
  target: number;
  actual: number | null;
  completed: boolean;
  color: "blue" | "emerald";
}) {
  const progress = calculateProgress(actual, target);
  return (
    <div className="border-border/70 bg-card/60 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs">{label}目标</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatPcts(target)}
          </p>
        </div>
        {completed ? (
          <CheckCircle2
            aria-label={`${label}目标已完成`}
            className={cn(
              "size-5",
              color === "blue" ? "text-blue-400" : "text-emerald-400",
            )}
          />
        ) : (
          <Target
            aria-label={`${label}目标未完成`}
            className="text-muted-foreground size-5"
          />
        )}
      </div>
      <div className="bg-muted mt-4 h-1.5 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width] motion-reduce:transition-none",
            color === "blue" ? "bg-blue-500" : "bg-emerald-500",
          )}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <p className="text-muted-foreground mt-2 text-xs tabular-nums">
        {actual === null
          ? "等待本日记录"
          : `${formatPercent(progress)} · 实际 ${formatPcts(actual)}`}
      </p>
    </div>
  );
}

function PeriodProgress({
  label,
  progress,
  target,
  color,
}: {
  label: string;
  progress: number;
  target: number;
  color: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
        <span>{label}</span>
        <span className="whitespace-nowrap tabular-nums">
          <span className={progress < 0 ? "text-rose-400" : undefined}>
            {formatPercent(progress)}
          </span>{" "}
          / {formatPcts(target)}
        </span>
      </div>
      <div className="bg-muted mt-1.5 h-1.5 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width] motion-reduce:transition-none",
            color,
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
