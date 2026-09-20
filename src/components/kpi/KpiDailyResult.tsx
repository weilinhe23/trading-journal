import { Check, Minus, Star } from "lucide-react";
import type { KpiBreakdownItem } from "~/lib/kpi";
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

export const KPI_TARGETS = [
  { key: "baselineTarget", label: "基准", tone: "baseline" },
  { key: "optimisticTarget", label: "乐观", tone: "optimistic" },
] as const;

export type KpiDailyState =
  | "optimistic"
  | "achieved"
  | "below"
  | "negative"
  | "unrecorded"
  | "pending";

export const KPI_DAILY_STATUS_LABELS: Record<KpiDailyState, string> = {
  optimistic: "乐观达标",
  achieved: "基准达标",
  below: "未达基准",
  negative: "未达基准",
  unrecorded: "未填写",
  pending: "待开始",
};

export function getKpiDailyState(
  day: KpiBreakdownItem,
  today: string,
): KpiDailyState {
  if (day.actualPcts === null) {
    return day.startDate > today ? "pending" : "unrecorded";
  }
  if (day.actualPcts >= day.optimisticTarget) return "optimistic";
  if (day.actualPcts >= day.baselineTarget) return "achieved";
  return day.actualPcts < 0 ? "negative" : "below";
}

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

export function KpiDailyResult({
  day,
  today,
}: {
  day: KpiBreakdownItem;
  today: string;
}) {
  const actual = day.actualPcts;
  const recorded = actual !== null;
  const future = day.startDate > today;
  const state = getKpiDailyState(day, today);
  const status = KPI_DAILY_STATUS_LABELS[state];
  return (
    <li className={styles.day} data-state={recorded ? state : "empty"}>
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
          {state === "optimistic" ? (
            <Star size={14} />
          ) : state === "achieved" ? (
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
        {KPI_TARGETS.map(({ key, label, tone }) => (
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
