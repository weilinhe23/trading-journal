import Link from "next/link";
import {
  ArrowLeft,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { KpiHistoryViewNav } from "~/components/kpi/KpiHistoryViewNav";
import { getEtDateString, type KpiBreakdownItem } from "~/lib/kpi";
import { getKpiPeriodSummary } from "~/lib/kpi-server";
import { cn } from "~/lib/utils";

export const dynamic = "force-dynamic";

interface YearlyKpiPageProps {
  searchParams: Promise<{ year?: string | string[] }>;
}

type CompletionStatus =
  | "EXCEEDED"
  | "COMPLETED"
  | "BELOW_EXPECTATION"
  | "SEVERELY_BELOW"
  | "UNRECORDED"
  | "PENDING";

interface YearDayResult {
  day: KpiBreakdownItem;
  progress: number | null;
  status: CompletionStatus;
}

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
    description: "交易日尚无 KPI 数据",
    cardClass: "border-border/70 bg-card/50",
    iconClass: "border-border bg-muted/50 text-muted-foreground",
  },
  PENDING: {
    label: "待记录",
    description: "未来交易日",
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

const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", {
  weekday: "short",
  timeZone: "UTC",
});

function parseYear(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d{4}$/.test(raw)) return fallback;
  const year = Number(raw);
  return year >= 1900 && year <= 2200 ? year : fallback;
}

function classifyDay(day: KpiBreakdownItem, today: string): YearDayResult {
  if (day.actualPcts === null) {
    return {
      day,
      progress: null,
      status: day.startDate > today ? "PENDING" : "UNRECORDED",
    };
  }

  const progress =
    day.baselineTarget > 0 ? (day.actualPcts / day.baselineTarget) * 100 : 0;
  const status: CompletionStatus =
    progress >= 120
      ? "EXCEEDED"
      : progress >= 100
        ? "COMPLETED"
        : progress >= 80
          ? "BELOW_EXPECTATION"
          : "SEVERELY_BELOW";

  return { day, progress, status };
}

export default async function YearlyKpiPage({
  searchParams,
}: YearlyKpiPageProps) {
  const today = getEtDateString();
  const currentYear = Number(today.slice(0, 4));
  const { year: requestedYear } = await searchParams;
  const year = parseYear(requestedYear, currentYear);
  const summary = await getKpiPeriodSummary("year", `${year}-01-01`);
  const results = summary.dailyResults.map((day) => classifyDay(day, today));

  const months = new Map<number, YearDayResult[]>();
  const counts: Record<CompletionStatus, number> = {
    EXCEEDED: 0,
    COMPLETED: 0,
    BELOW_EXPECTATION: 0,
    SEVERELY_BELOW: 0,
    UNRECORDED: 0,
    PENDING: 0,
  };

  for (const result of results) {
    const month = Number(result.day.startDate.slice(5, 7));
    const group = months.get(month) ?? [];
    group.push(result);
    months.set(month, group);
    counts[result.status] += 1;
  }

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
              <CalendarRange aria-hidden="true" className="size-4" />
              Yearly Daily View
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {year} 年每日 KPI 完成情况
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              按当日基准目标计算，仅展示美股交易日。
            </p>
          </div>

          <nav
            aria-label="切换年度"
            className="border-border/70 bg-card/50 flex w-fit items-center rounded-lg border p-1"
          >
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                href={`/kpi/yearly?year=${year - 1}`}
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
                href={`/kpi/yearly?year=${year + 1}`}
                aria-label={`查看 ${year + 1} 年`}
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <KpiHistoryViewNav current="daily" year={year} />

      <section
        aria-label="年度状态汇总"
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {STATUS_ORDER.map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={cn("rounded-lg border px-3 py-3", config.cardClass)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{config.label}</span>
                <strong className="text-lg tabular-nums">
                  {counts[status]}
                </strong>
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">
                {config.description}
              </p>
            </div>
          );
        })}
      </section>

      <div className="space-y-8">
        {Array.from(months.entries()).map(([month, days]) => {
          const recordedCount = days.filter(
            ({ status }) => status !== "UNRECORDED" && status !== "PENDING",
          ).length;
          return (
            <section
              key={month}
              className="[contain-intrinsic-size:520px] [content-visibility:auto]"
            >
              <div className="mb-3 flex items-end justify-between gap-3 border-b pb-2">
                <h2 className="text-xl font-semibold">{month} 月</h2>
                <p className="text-muted-foreground text-xs">
                  {recordedCount} / {days.length} 个交易日已记录
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {days.map((result) => (
                  <YearDayCard key={result.day.key} result={result} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function YearDayCard({ result }: { result: YearDayResult }) {
  const { day, progress, status } = result;
  const config = STATUS_CONFIG[status];
  const date = new Date(`${day.startDate}T00:00:00.000Z`);
  const month = date.getUTCMonth() + 1;
  const dateNumber = date.getUTCDate();

  return (
    <article
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border p-3",
        config.cardClass,
      )}
    >
      <time
        dateTime={day.startDate}
        className={cn(
          "flex size-12 shrink-0 flex-col items-center justify-center overflow-hidden rounded-md border text-center",
          config.iconClass,
        )}
      >
        <span className="text-[9px] font-semibold tracking-wide uppercase">
          {month} 月
        </span>
        <strong className="text-lg leading-none tabular-nums">
          {dateNumber}
        </strong>
      </time>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{config.label}</p>
          <span className="text-muted-foreground shrink-0 text-[10px]">
            {weekdayFormatter.format(date)}
          </span>
        </div>
        {day.actualPcts !== null && progress !== null ? (
          <p className="text-muted-foreground mt-1 truncate text-xs tabular-nums">
            {numberFormatter.format(day.actualPcts)} /{" "}
            {numberFormatter.format(day.baselineTarget)} PTS ·{" "}
            {numberFormatter.format(progress)}%
          </p>
        ) : (
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {config.description}
          </p>
        )}
      </div>
    </article>
  );
}
