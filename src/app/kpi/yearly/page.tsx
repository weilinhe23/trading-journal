import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Target,
  Star,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { KpiHistoryViewNav } from "~/components/kpi/KpiHistoryViewNav";
import { KpiYearCalendar } from "~/components/kpi/KpiYearCalendar";
import { getEtDateString } from "~/lib/kpi";
import { getKpiPeriodSummary } from "~/lib/kpi-server";
import { buildKpiYearView } from "~/lib/kpi-year-view";
import styles from "~/components/kpi/KpiYearView.module.css";

export const dynamic = "force-dynamic";

const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function parseYear(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d{4}$/.test(raw)) return fallback;
  const year = Number(raw);
  return year >= 1900 && year <= 2200 ? year : fallback;
}

export default async function YearlyKpiPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const today = getEtDateString();
  const { year: requestedYear } = await searchParams;
  const year = parseYear(requestedYear, Number(today.slice(0, 4)));
  const summary = await getKpiPeriodSummary("year", `${year}-01-01`);
  const view = buildKpiYearView(summary, today);
  const actual = summary.actualPcts;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/kpi" className={styles.backLink}>
            <ArrowLeft size={14} aria-hidden="true" /> 返回 KPI
          </Link>
          <p className={styles.eyebrow}>THE TRADING YEAR</p>
          <h1>
            每一天，都算数<span>.</span>
          </h1>
          <p className={styles.subtitle}>
            {year} 年交易成绩 · 从全年的轨迹，看见每一天的进步。
          </p>
        </div>
        <nav aria-label="切换年度" className={styles.yearNav}>
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            disabled={year <= 1900}
          >
            <Link
              href={`/kpi/yearly?year=${year - 1}`}
              aria-label={`查看 ${year - 1} 年`}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </Link>
          </Button>
          <span>{year}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            disabled={year >= 2200}
          >
            <Link
              href={`/kpi/yearly?year=${year + 1}`}
              aria-label={`查看 ${year + 1} 年`}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </header>

      <section className={styles.overview} aria-label="年度成绩概览">
        <div className={styles.score}>
          <p className={styles.eyebrow}>YEAR TO DATE / {year}</p>
          <h2>年度累计实际</h2>
          <p
            className={styles.scoreValue}
            data-negative={actual !== null && actual < 0}
          >
            {actual === null
              ? "—"
              : `${actual > 0 ? "+" : ""}${format.format(actual)}`}
            <span>pts</span>
          </p>
          <p className={styles.scoreCaption}>
            {actual === null
              ? "等待第一笔记录，开启这一年的交易轨迹。"
              : "每一笔记录，汇成这一年的成绩。"}
          </p>
        </div>
        <div className={styles.yearTargets}>
          {(
            [
              {
                label: "基准目标",
                target: summary.baselineTarget,
                tone: "baseline",
                icon: Target,
              },
              {
                label: "乐观目标",
                target: summary.optimisticTarget,
                tone: "optimistic",
                icon: Star,
              },
            ] as const
          ).map(({ label, target, tone, icon: Icon }) => {
            const percent =
              actual !== null && target > 0 ? (actual / target) * 100 : 0;
            const gap = actual === null ? null : target - actual;
            return (
              <div key={tone} className={styles.yearTarget} data-tone={tone}>
                <div className={styles.targetHeading}>
                  <span>
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </span>
                  <strong>
                    {actual === null ? "—" : format.format(percent)}
                    <small>%</small>
                  </strong>
                </div>
                <div className={styles.progressTrack} aria-hidden="true">
                  <span
                    style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                  />
                </div>
                <div className={styles.targetFoot}>
                  <span>全年 {format.format(target)} pts</span>
                  <span>
                    {gap === null
                      ? "待填写"
                      : gap === 0
                        ? "已达标"
                        : `${gap > 0 ? "还差" : "超出"} ${format.format(Math.abs(gap))} pts`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.metrics}>
          <div>
            <span>已记录交易日</span>
            <p>
              {summary.recordedDayCount}
              <small>/ {summary.tradingDayCount} 天</small>
            </p>
          </div>
          <div>
            <span>
              <i data-tone="baseline" />
              基准达标
            </span>
            <p>
              {view.baselineDays}
              <small>天</small>
            </p>
          </div>
          <div>
            <span>
              <i data-tone="optimistic" />
              乐观达标
            </span>
            <p>
              {view.optimisticDays}
              <small>天</small>
            </p>
          </div>
          <p className={styles.metricNote}>
            达标天数按当日目标统计
            <br />
            基准达标包含乐观达标
          </p>
        </div>
      </section>

      <KpiHistoryViewNav current="daily" year={year} />
      <KpiYearCalendar
        key={year}
        months={view.months}
        today={today}
        initialSelectedDate={view.selectedDate}
      />
    </div>
  );
}
