"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { KpiCumulativePoint } from "~/components/kpi/KpiCumulativeChart";
import type { KpiDashboardPeriod, KpiPeriodSummary } from "~/lib/kpi";

interface KpiTrendExplorerProps {
  initialSummary: KpiPeriodSummary;
  today: string;
}

interface KpiSummaryResponse {
  success: boolean;
  data?: KpiPeriodSummary;
  error?: string;
}

const PERIOD_LABELS: Record<KpiDashboardPeriod, string> = {
  week: "周度",
  month: "月度",
  quarter: "季度",
  half: "半年度",
  year: "年度",
};

const trendDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 1,
});

const KpiCumulativeChart = dynamic(
  () =>
    import("~/components/kpi/KpiCumulativeChart").then(
      (module) => module.KpiCumulativeChart,
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

function formatPcts(value: number): string {
  return `${numberFormatter.format(value)} PTS`;
}

function formatDate(year: number, month: number, day = 1): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getIsoWeekValue(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const isoYear = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

function isoWeekToAnchor(value: string): string | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (!Number.isInteger(year) || week < 1 || week > 53) return null;

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const weekday = januaryFourth.getUTCDay() || 7;
  januaryFourth.setUTCDate(
    januaryFourth.getUTCDate() - weekday + 1 + (week - 1) * 7,
  );
  return januaryFourth.toISOString().slice(0, 10);
}

export function KpiTrendExplorer({
  initialSummary,
  today,
}: KpiTrendExplorerProps) {
  const todayYear = Number(today.slice(0, 4));
  const todayMonth = Number(today.slice(5, 7));
  const [period, setPeriod] = useState<KpiDashboardPeriod>("month");
  const [weekValue, setWeekValue] = useState(() => getIsoWeekValue(today));
  const [monthValue, setMonthValue] = useState(() => today.slice(0, 7));
  const [yearValue, setYearValue] = useState(() => String(todayYear));
  const [quarterValue, setQuarterValue] = useState(() =>
    String(Math.floor((todayMonth - 1) / 3) + 1),
  );
  const [halfValue, setHalfValue] = useState(() =>
    todayMonth <= 6 ? "1" : "2",
  );
  const [summary, setSummary] = useState<KpiPeriodSummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericYear = Number(yearValue);
  const anchorDate = (() => {
    if (period === "week") return isoWeekToAnchor(weekValue);
    if (period === "month")
      return /^\d{4}-\d{2}$/.test(monthValue) ? `${monthValue}-01` : null;
    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1900 ||
      numericYear > 2200
    )
      return null;
    if (period === "quarter")
      return formatDate(numericYear, (Number(quarterValue) - 1) * 3 + 1);
    if (period === "half")
      return formatDate(numericYear, halfValue === "1" ? 1 : 7);
    return formatDate(numericYear, 1);
  })();

  useEffect(() => {
    if (!anchorDate) return;

    const controller = new AbortController();
    async function loadSummary() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/kpi/summary?period=${period}&date=${anchorDate}`,
          { signal: controller.signal, cache: "no-store" },
        );
        const result = (await response.json()) as KpiSummaryResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error ?? "查询 KPI 趋势失败");
        }
        setSummary(result.data);
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        )
          return;
        setError(
          loadError instanceof Error ? loadError.message : "查询 KPI 趋势失败",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadSummary();
    return () => controller.abort();
  }, [anchorDate, initialSummary, period]);

  let cumulativePcts = 0;
  const cumulativeData: KpiCumulativePoint[] = summary.dailyResults
    .filter((day) => day.startDate <= today)
    .map((day) => {
      if (day.actualPcts !== null) cumulativePcts += day.actualPcts;
      return {
        date: day.startDate,
        label: trendDateFormatter.format(
          new Date(`${day.startDate}T00:00:00.000Z`),
        ),
        daily: day.actualPcts,
        cumulative: cumulativePcts,
      };
    });

  return (
    <section className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/70 flex flex-col gap-4 border-b p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <TrendingUp aria-hidden="true" className="size-4" />
            Cumulative Trend
          </p>
          <h2 className="mt-1 text-lg font-semibold">累计实现 PTS 趋势</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            选择任意周、月、季度、半年度或年度查看历史累计结果。
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="kpi-trend-period" className="text-xs">
              时间维度
            </Label>
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as KpiDashboardPeriod)}
            >
              <SelectTrigger id="kpi-trend-period" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {Object.entries(PERIOD_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === "week" ? (
            <div className="space-y-1.5">
              <Label htmlFor="kpi-trend-week" className="text-xs">
                选择周
              </Label>
              <Input
                id="kpi-trend-week"
                type="week"
                value={weekValue}
                onChange={(event) => setWeekValue(event.target.value)}
                className="w-40"
              />
            </div>
          ) : null}

          {period === "month" ? (
            <div className="space-y-1.5">
              <Label htmlFor="kpi-trend-month" className="text-xs">
                选择月份
              </Label>
              <Input
                id="kpi-trend-month"
                type="month"
                value={monthValue}
                onChange={(event) => setMonthValue(event.target.value)}
                className="w-40"
              />
            </div>
          ) : null}

          {period === "quarter" || period === "half" || period === "year" ? (
            <div className="space-y-1.5">
              <Label htmlFor="kpi-trend-year" className="text-xs">
                年份
              </Label>
              <Input
                id="kpi-trend-year"
                type="number"
                min={1900}
                max={2200}
                step={1}
                value={yearValue}
                onChange={(event) => setYearValue(event.target.value)}
                className="w-28 tabular-nums"
              />
            </div>
          ) : null}

          {period === "quarter" ? (
            <div className="space-y-1.5">
              <Label htmlFor="kpi-trend-quarter" className="text-xs">
                季度
              </Label>
              <Select value={quarterValue} onValueChange={setQuarterValue}>
                <SelectTrigger id="kpi-trend-quarter" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {[1, 2, 3, 4].map((quarter) => (
                    <SelectItem key={quarter} value={String(quarter)}>
                      Q{quarter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {period === "half" ? (
            <div className="space-y-1.5">
              <Label htmlFor="kpi-trend-half" className="text-xs">
                半年度
              </Label>
              <Select value={halfValue} onValueChange={setHalfValue}>
                <SelectTrigger id="kpi-trend-half" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="1">上半年</SelectItem>
                  <SelectItem value="2">下半年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs">查询周期</p>
            <p className="mt-0.5 font-medium tabular-nums">
              {summary.startDate} — {summary.endDate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">周期累计</p>
            <p className="mt-0.5 font-semibold text-violet-400 tabular-nums">
              {formatPcts(cumulativePcts)}
            </p>
          </div>
        </div>

        <div
          className="relative h-[320px] w-full"
          role="img"
          aria-label={`${PERIOD_LABELS[period]}累计实现 PTS 折线图`}
          aria-busy={loading}
        >
          {summary.recordedDayCount === 0 && !loading ? (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              该周期暂无 KPI 记录
            </div>
          ) : (
            <KpiCumulativeChart data={cumulativeData} />
          )}
          {loading ? (
            <div className="bg-card/55 text-muted-foreground absolute inset-0 flex items-center justify-center text-sm backdrop-blur-[1px]">
              正在查询…
            </div>
          ) : null}
        </div>

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
          <span>{summary.recordedDayCount} 个交易日已记录</span>
          {error ? (
            <span className="text-destructive" role="alert">
              {error}
            </span>
          ) : (
            <span>实际数据按交易日累计</span>
          )}
        </div>
      </div>
    </section>
  );
}
