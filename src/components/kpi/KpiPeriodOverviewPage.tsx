import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { KpiHistoryViewNav } from "~/components/kpi/KpiHistoryViewNav";
import { Button } from "~/components/ui/button";
import { getEtDateString, type KpiBreakdownItem } from "~/lib/kpi";
import { getKpiPeriodSummary } from "~/lib/kpi-server";
import { cn } from "~/lib/utils";

type OverviewPeriod = "week" | "month" | "quarter";
type CompletionStatus =
  | "EXCEEDED"
  | "COMPLETED"
  | "BELOW_EXPECTATION"
  | "SEVERELY_BELOW"
  | "UNRECORDED"
  | "PENDING";

interface PeriodResult extends KpiBreakdownItem {
  progress: number | null;
  completionStatus: CompletionStatus;
  iconTop: string;
  iconMain: string;
}

interface PeriodConfig {
  currentView: "weekly" | "monthly" | "quarterly";
  eyebrow: string;
  title: string;
  description: string;
  itemName: string;
  route: string;
  icon: LucideIcon;
}

const PERIOD_CONFIG: Record<OverviewPeriod, PeriodConfig> = {
  week: {
    currentView: "weekly",
    eyebrow: "Yearly Weekly View",
    title: "每周 KPI 完成情况",
    description: "将每日记录按自然周累计，仅计算美股交易日。",
    itemName: "周",
    route: "/kpi/weekly",
    icon: CalendarClock,
  },
  month: {
    currentView: "monthly",
    eyebrow: "Yearly Monthly View",
    title: "每月 KPI 完成情况",
    description: "将每日记录按自然月累计，仅计算美股交易日。",
    itemName: "月",
    route: "/kpi/monthly",
    icon: CalendarDays,
  },
  quarter: {
    currentView: "quarterly",
    eyebrow: "Yearly Quarterly View",
    title: "每季度 KPI 完成情况",
    description: "将每日记录按自然季度累计，仅计算美股交易日。",
    itemName: "季度",
    route: "/kpi/quarterly",
    icon: CalendarRange,
  },
};

const STATUS_CONFIG: Record<
  CompletionStatus,
  { label: string; description: string; cardClass: string; iconClass: string }
> = {
  EXCEEDED: {
    label: "超预期",
    description: "完成目标 120% 及以上",
    cardClass: "border-emerald-500/30 bg-emerald-500/[0.06]",
    iconClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  },
  COMPLETED: {
    label: "完成",
    description: "完成目标 100%–119.99%",
    cardClass: "border-blue-500/30 bg-blue-500/[0.06]",
    iconClass: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  },
  BELOW_EXPECTATION: {
    label: "不如预期",
    description: "完成目标 80%–99.99%",
    cardClass: "border-amber-500/30 bg-amber-500/[0.06]",
    iconClass: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  },
  SEVERELY_BELOW: {
    label: "严重不如预期",
    description: "完成目标低于 80%",
    cardClass: "border-rose-500/30 bg-rose-500/[0.06]",
    iconClass: "border-rose-500/30 bg-rose-500/15 text-rose-300",
  },
  UNRECORDED: {
    label: "未记录",
    description: "该周期尚无 KPI 数据",
    cardClass: "border-border/70 bg-card/50",
    iconClass: "border-border bg-muted/50 text-muted-foreground",
  },
  PENDING: {
    label: "待记录",
    description: "未来周期",
    cardClass: "border-border/50 bg-muted/20 opacity-70",
    iconClass: "border-border/70 bg-muted/40 text-muted-foreground",
  },
};

const STATUS_ORDER: CompletionStatus[] = [
  "EXCEEDED",
  "COMPLETED",
  "BELOW_EXPECTATION",
  "SEVERELY_BELOW",
  "UNRECORDED",
  "PENDING",
];

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

function parseYear(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d{4}$/.test(raw)) return fallback;
  const year = Number(raw);
  return year >= 1900 && year <= 2200 ? year : fallback;
}

function formatShortDate(value: string): string {
  return `${Number(value.slice(5, 7))}/${Number(value.slice(8, 10))}`;
}

function getMonday(dateValue: string): Date {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - weekday + 1);
  return date;
}

function getIsoWeek(dateValue: string): { year: number; week: number } {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const isoYear = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return { year: isoYear, week };
}

function groupKey(period: OverviewPeriod, day: KpiBreakdownItem): string {
  if (period === "week")
    return getMonday(day.startDate).toISOString().slice(0, 10);
  if (period === "month") return day.startDate.slice(0, 7);
  const month = Number(day.startDate.slice(5, 7));
  return `${day.startDate.slice(0, 4)}-Q${Math.ceil(month / 3)}`;
}

function getPeriodIdentity(
  period: OverviewPeriod,
  firstDay: KpiBreakdownItem,
): Pick<PeriodResult, "label" | "iconTop" | "iconMain"> {
  const year = Number(firstDay.startDate.slice(0, 4));
  const month = Number(firstDay.startDate.slice(5, 7));

  if (period === "week") {
    const iso = getIsoWeek(firstDay.startDate);
    return {
      label: `${iso.year} 年第 ${iso.week} 周`,
      iconTop: String(iso.year),
      iconMain: `W${iso.week}`,
    };
  }

  if (period === "month") {
    return {
      label: `${year} 年 ${month} 月`,
      iconTop: String(year),
      iconMain: `${month}月`,
    };
  }

  const quarter = Math.ceil(month / 3);
  return {
    label: `${year} 年第 ${quarter} 季度`,
    iconTop: String(year),
    iconMain: `Q${quarter}`,
  };
}

function classifyPeriod(
  item: Omit<PeriodResult, "progress" | "completionStatus">,
  today: string,
): PeriodResult {
  if (item.actualPcts === null) {
    return {
      ...item,
      progress: null,
      completionStatus: item.startDate > today ? "PENDING" : "UNRECORDED",
    };
  }

  const progress =
    item.baselineTarget > 0 ? (item.actualPcts / item.baselineTarget) * 100 : 0;
  const completionStatus: CompletionStatus =
    progress >= 120
      ? "EXCEEDED"
      : progress >= 100
        ? "COMPLETED"
        : progress >= 80
          ? "BELOW_EXPECTATION"
          : "SEVERELY_BELOW";

  return { ...item, progress, completionStatus };
}

function aggregatePeriods(
  period: OverviewPeriod,
  days: readonly KpiBreakdownItem[],
  today: string,
): PeriodResult[] {
  const groups = new Map<string, KpiBreakdownItem[]>();

  for (const day of days) {
    const key = groupKey(period, day);
    const group = groups.get(key) ?? [];
    group.push(day);
    groups.set(key, group);
  }

  return Array.from(groups, ([key, group]) => {
    const first = group[0]!;
    const last = group[group.length - 1]!;
    let actualPcts = 0;
    let recordedDayCount = 0;
    let baselineTarget = 0;
    let optimisticTarget = 0;

    for (const day of group) {
      baselineTarget += day.baselineTarget;
      optimisticTarget += day.optimisticTarget;
      if (day.actualPcts !== null) {
        actualPcts += day.actualPcts;
        recordedDayCount += 1;
      }
    }

    const identity = getPeriodIdentity(period, first);
    return classifyPeriod(
      {
        key,
        ...identity,
        startDate: first.startDate,
        endDate: last.endDate,
        tradingDayCount: group.length,
        recordedDayCount,
        actualPcts: recordedDayCount > 0 ? actualPcts : null,
        baselineTarget,
        optimisticTarget,
        status: "UNRECORDED",
      },
      today,
    );
  });
}

export async function KpiPeriodOverviewPage({
  period,
  requestedYear,
}: {
  period: OverviewPeriod;
  requestedYear: string | string[] | undefined;
}) {
  const today = getEtDateString();
  const currentYear = Number(today.slice(0, 4));
  const year = parseYear(requestedYear, currentYear);
  const config = PERIOD_CONFIG[period];
  const Icon = config.icon;
  const yearlySummary = await getKpiPeriodSummary("year", `${year}-01-01`);
  const results = aggregatePeriods(period, yearlySummary.dailyResults, today);
  const counts: Record<CompletionStatus, number> = {
    EXCEEDED: 0,
    COMPLETED: 0,
    BELOW_EXPECTATION: 0,
    SEVERELY_BELOW: 0,
    UNRECORDED: 0,
    PENDING: 0,
  };

  for (const result of results) counts[result.completionStatus] += 1;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link href="/kpi">
            <ArrowLeft aria-hidden="true" className="size-4" />
            返回 KPI
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
              <Icon aria-hidden="true" className="size-4" />
              {config.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {year} 年{config.title}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {config.description}
            </p>
          </div>

          <nav
            aria-label="切换年度"
            className="border-border/70 bg-card/50 flex w-fit items-center rounded-lg border p-1"
          >
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href={`${config.route}?year=${year - 1}`}
                aria-label={`查看 ${year - 1} 年`}
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <span className="min-w-24 px-3 text-center text-sm font-semibold tabular-nums">
              {year} 年
            </span>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href={`${config.route}?year=${year + 1}`}
                aria-label={`查看 ${year + 1} 年`}
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <KpiHistoryViewNav current={config.currentView} year={year} />

      <section
        aria-label={`年度每${config.itemName}状态汇总`}
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {STATUS_ORDER.map((status) => {
          const statusConfig = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={cn(
                "rounded-lg border px-3 py-3",
                statusConfig.cardClass,
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  {statusConfig.label}
                </span>
                <strong className="text-lg tabular-nums">
                  {counts[status]}
                </strong>
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                {statusConfig.description}
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3 border-b pb-2">
          <h2 className="text-xl font-semibold">
            {year} 年全部{config.itemName}
          </h2>
          <p className="text-muted-foreground text-xs">
            {
              results.filter(
                ({ completionStatus }) =>
                  completionStatus !== "UNRECORDED" &&
                  completionStatus !== "PENDING",
              ).length
            }{" "}
            / {results.length} 个周期已记录
          </p>
        </div>

        <div
          className={cn(
            "grid gap-3 [contain-intrinsic-size:600px] [content-visibility:auto]",
            period === "quarter"
              ? "sm:grid-cols-2 xl:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {results.map((result) => (
            <PeriodCard key={result.key} result={result} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PeriodCard({ result }: { result: PeriodResult }) {
  const statusConfig = STATUS_CONFIG[result.completionStatus];

  return (
    <article
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border p-3",
        statusConfig.cardClass,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex size-14 shrink-0 flex-col items-center justify-center overflow-hidden rounded-md border text-center",
          statusConfig.iconClass,
        )}
      >
        <span className="text-[9px] font-semibold tracking-wide uppercase">
          {result.iconTop}
        </span>
        <strong className="text-base leading-tight tabular-nums">
          {result.iconMain}
        </strong>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{statusConfig.label}</p>
          <span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
            {formatShortDate(result.startDate)}–
            {formatShortDate(result.endDate)}
          </span>
        </div>
        {result.actualPcts !== null && result.progress !== null ? (
          <>
            <p className="text-muted-foreground mt-1 truncate text-xs tabular-nums">
              {numberFormatter.format(result.actualPcts)} /{" "}
              {numberFormatter.format(result.baselineTarget)} PTS ·{" "}
              {numberFormatter.format(result.progress)}%
            </p>
            <p className="text-muted-foreground mt-0.5 truncate text-[10px]">
              {result.recordedDayCount} / {result.tradingDayCount}{" "}
              个交易日已记录
            </p>
          </>
        ) : (
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {statusConfig.description}
          </p>
        )}
      </div>
    </article>
  );
}
