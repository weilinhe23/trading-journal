import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import type { KpiPeriodSummary } from "~/lib/kpi";
import { KpiDailyResult, KPI_TARGETS } from "./KpiDailyResult";
import styles from "./KpiDashboardCard.module.css";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const points = (value: number) => numberFormatter.format(value);
const signedPoints = (value: number) =>
  `${value > 0 ? "+" : ""}${points(value)}`;

// Server component: totals come from the same server summary used by the KPI page.
export function KpiDashboardCard({ summary }: { summary: KpiPeriodSummary }) {
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
          <div className={styles.weeklyGaps}>
            {KPI_TARGETS.map(({ key, label, tone }) => {
              const gap =
                summary.actualPcts === null
                  ? null
                  : summary[key] - summary.actualPcts;
              return (
                <div key={key} className={styles.weeklyGap} data-tone={tone}>
                  <dl>
                    <dt>{label}全周应实现</dt>
                    <dd>{points(summary[key])} pts</dd>
                  </dl>
                  <p className={styles.gapValue}>
                    <span>
                      {gap === null
                        ? "待填写"
                        : gap > 0
                          ? "还差"
                          : gap < 0
                            ? "超出"
                            : "差额"}
                    </span>
                    <strong>
                      {gap === null ? "—" : points(Math.abs(gap))}
                    </strong>
                    <span>pts</span>
                    {gap === 0 && <span>（已达标）</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {KPI_TARGETS.map(({ key, label, tone }) => (
          <div key={key} className={styles.completion} data-tone={tone}>
            <p className={styles.metricLabel}>{label}达标交易日</p>
            <p className={styles.completionValue}>
              {
                summary.dailyResults.filter(
                  (day) =>
                    day.actualPcts !== null && day.actualPcts >= day[key],
                ).length
              }
              <span>/ {summary.tradingDayCount} 天</span>
            </p>
            <div className={styles.dayMarkers} aria-hidden="true">
              {summary.dailyResults.map((day) => (
                <span
                  key={day.key}
                  data-achieved={
                    day.actualPcts !== null && day.actualPcts >= day[key]
                  }
                />
              ))}
            </div>
          </div>
        ))}
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
            <KpiDailyResult
              key={day.key}
              day={day}
              today={summary.anchorDate}
            />
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>本周没有 KPI 交易日。</p>
      )}
      <footer className={styles.footer}>
        <p>来自 KPI 每日填写的 pts · 基准与乐观均按当日生效的目标判定</p>
        <p>交易日历与 KPI 页面一致</p>
      </footer>
    </section>
  );
}
