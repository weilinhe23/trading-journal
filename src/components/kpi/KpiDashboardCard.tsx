import Link from "next/link";
import { ArrowRight, Check, Minus, Star, Target } from "lucide-react";
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

const TARGETS = [
  { key: "baselineTarget", label: "基准", tone: "baseline" },
  { key: "optimisticTarget", label: "乐观", tone: "optimistic" },
] as const;

function TargetProgress({
  actual,
  target,
  label,
  tone,
  future,
}: {
  actual: number | null;
  target: number;
  label: string;
  tone: string;
  future: boolean;
}) {
  const difference = actual === null ? null : actual - target;
  const achieved = difference !== null && difference >= 0;
  const progress =
    actual !== null && target > 0
      ? Math.min(100, Math.max(0, (actual / target) * 100))
      : 0;

  return (
    <div className={styles.targetBlock} data-tone={tone}>
      <div className={styles.targetLabel}>
        <span className={styles.targetName}>{label}</span>
        <span>{points(target)} pts</span>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.targetStatus} data-achieved={achieved}>
        {achieved && <Check size={11} aria-hidden="true" />}
        {actual === null
          ? future
            ? "待开始"
            : "未填写"
          : achieved
            ? "已达标"
            : "未达标"}
      </p>
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
  );
}

function DailyResult({ day, today }: { day: KpiBreakdownItem; today: string }) {
  const actual = day.actualPcts;
  const recorded = actual !== null;
  const achieved = recorded && actual >= day.baselineTarget;
  const optimisticAchieved = recorded && actual >= day.optimisticTarget;
  const future = day.startDate > today;
  const state = !recorded
    ? "empty"
    : optimisticAchieved
      ? "optimistic"
      : achieved
        ? "achieved"
        : actual < 0
          ? "negative"
          : "below";
  const status = recorded
    ? optimisticAchieved
      ? "乐观达标"
      : achieved
        ? "基准达标"
        : "未达基准"
    : future
      ? "待开始"
      : "未填写";

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
          {optimisticAchieved ? (
            <Star size={14} />
          ) : achieved ? (
            <Check size={16} />
          ) : (
            <Minus size={14} />
          )}
        </span>
      </div>
      <div className={styles.dailyValue}>
        <span>{recorded ? signedPoints(actual) : "—"}</span>
        <span className={styles.unit}>pts</span>
      </div>
      <p className={styles.status}>{status}</p>
      <div className={styles.targets}>
        {TARGETS.map(({ key, label, tone }) => (
          <TargetProgress
            key={key}
            actual={actual}
            target={day[key]}
            label={label}
            tone={tone}
            future={future}
          />
        ))}
      </div>
    </li>
  );
}

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
            {TARGETS.map(({ key, label, tone }) => {
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
        {TARGETS.map(({ key, label, tone }) => (
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
            <DailyResult key={day.key} day={day} today={summary.anchorDate} />
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
