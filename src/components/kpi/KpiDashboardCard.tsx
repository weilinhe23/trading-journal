import Link from "next/link";
import { ArrowRight, Check, Minus, Target } from "lucide-react";
import type { KpiBreakdownItem, KpiPeriodSummary } from "~/lib/kpi";
import styles from "./KpiDashboardCard.module.css";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});
const points = (value: number) => numberFormatter.format(value);
const signedPoints = (value: number) =>
  `${value > 0 ? "+" : ""}${points(value)}`;

function DailyResult({ day, today }: { day: KpiBreakdownItem; today: string }) {
  const actual = day.actualPcts;
  const recorded = actual !== null;
  const achieved = recorded && actual >= day.baselineTarget;
  const future = day.startDate > today;
  const state = !recorded
    ? "empty"
    : achieved
      ? "achieved"
      : actual < 0
        ? "negative"
        : "below";
  const status = recorded
    ? achieved
      ? "基准达标"
      : "未达基准"
    : future
      ? "待开始"
      : "未填写";
  const difference = recorded ? actual - day.baselineTarget : null;
  const progress =
    recorded && day.baselineTarget > 0
      ? Math.min(100, Math.max(0, (actual / day.baselineTarget) * 100))
      : 0;

  return (
    <li className={styles.day} data-state={state}>
      <div className={styles.dayHeading}>
        <div>
          <p className={styles.weekday} lang="en">
            {weekdayFormatter.format(new Date(`${day.startDate}T00:00:00Z`))}
          </p>
          <p className={styles.dayDate}>
            <time dateTime={day.startDate}>
              {day.startDate.slice(5).replace("-", "/")}
            </time>
            {day.startDate === today && (
              <span className={styles.today}>今天</span>
            )}
          </p>
        </div>
        <span className={styles.seal} aria-hidden="true">
          {achieved ? <Check size={16} /> : <Minus size={14} />}
        </span>
      </div>
      <div className={styles.dailyValue}>
        <span>{recorded ? signedPoints(actual) : "—"}</span>
        <span className={styles.unit}>pts</span>
      </div>
      <p className={styles.status}>{status}</p>
      <div className={styles.targetBlock}>
        <div className={styles.targetLabel}>
          <span>基准</span>
          <span>{points(day.baselineTarget)} pts</span>
        </div>
        <div className={styles.track} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.difference}>
          {difference === null
            ? future
              ? "等待这个交易日"
              : "等待 KPI 记录"
            : difference === 0
              ? "刚好达标"
              : difference > 0
                ? `超出 ${points(difference)} pts`
                : `距目标 ${points(Math.abs(difference))} pts`}
        </p>
      </div>
    </li>
  );
}

// Server component: totals come from the same server summary used by the KPI page.
export function KpiDashboardCard({ summary }: { summary: KpiPeriodSummary }) {
  const completedDays = summary.dailyResults.filter(
    (day) => day.actualPcts !== null && day.actualPcts >= day.baselineTarget,
  ).length;
  return (
    <section className={styles.board} aria-labelledby="weekly-kpi-heading">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            <Target size={14} aria-hidden="true" /> Weekly KPI
          </p>
          <h2 id="weekly-kpi-heading" className={styles.title}>
            本周交易成绩
          </h2>
        </div>
        <Link className={styles.detailLink} href="/kpi">
          查看 KPI <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>
      <div className={styles.overview}>
        <div className={styles.total}>
          <p className={styles.metricLabel}>本周累计实际</p>
          <p
            className={styles.totalValue}
            data-negative={
              summary.actualPcts !== null && summary.actualPcts < 0
            }
          >
            {summary.actualPcts === null
              ? "—"
              : signedPoints(summary.actualPcts)}
            <span>pts</span>
          </p>
        </div>
        <div className={styles.completion}>
          <p className={styles.metricLabel}>基准达标交易日</p>
          <p className={styles.completionValue}>
            {completedDays}
            <span>/ {summary.tradingDayCount} 天</span>
          </p>
          <div className={styles.dayMarkers} aria-hidden="true">
            {summary.dailyResults.map((day) => (
              <span
                key={day.key}
                data-achieved={
                  day.actualPcts !== null &&
                  day.actualPcts >= day.baselineTarget
                }
              />
            ))}
          </div>
        </div>
        <div className={styles.period}>
          <p className={styles.periodLabel} lang="en">
            THE WEEK IN POINTS
          </p>
          <p>
            {summary.startDate.replaceAll("-", ".")} —{" "}
            {summary.endDate.slice(5).replace("-", ".")}
          </p>
          <p className={styles.periodNote}>
            美东时间 · 已填写 {summary.recordedDayCount} /{" "}
            {summary.tradingDayCount} 天
          </p>
        </div>
      </div>
      {summary.dailyResults.length > 0 ? (
        <ol
          className={styles.days}
          style={{
            gridTemplateColumns: `repeat(${summary.dailyResults.length}, minmax(0, 1fr))`,
          }}
        >
          {summary.dailyResults.map((day) => (
            <DailyResult key={day.key} day={day} today={summary.anchorDate} />
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>本周没有 KPI 交易日。</p>
      )}
      <footer className={styles.footer}>
        <p>来自 KPI 每日填写的 pts · 基准按当日生效的目标判定</p>
        <p>交易日历与 KPI 页面一致</p>
      </footer>
    </section>
  );
}
