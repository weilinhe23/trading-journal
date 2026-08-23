export const DEFAULT_KPI_TARGETS = {
  baseline: 100,
  optimistic: 200,
} as const;

export const KPI_PERIODS = [
  "day",
  "week",
  "month",
  "quarter",
  "half",
  "year",
] as const;

export type KpiPeriod = (typeof KPI_PERIODS)[number];

export const KPI_DASHBOARD_PERIODS = [
  "week",
  "month",
  "quarter",
  "half",
  "year",
] as const satisfies readonly KpiPeriod[];

export type KpiDashboardPeriod = (typeof KPI_DASHBOARD_PERIODS)[number];

export type KpiStatus =
  | "UNRECORDED"
  | "BELOW_BASELINE"
  | "BASELINE"
  | "OPTIMISTIC";

export interface KpiTargetValue {
  effectiveFrom: Date;
  dailyBaseline: number;
  dailyOptimistic: number;
}

export interface KpiRecordValue {
  date: Date;
  actualPcts: number;
  note: string | null;
}

export interface KpiPeriodRange {
  start: Date;
  end: Date;
  startDate: string;
  endDate: string;
}

export interface KpiBreakdownItem {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
  tradingDayCount: number;
  recordedDayCount: number;
  actualPcts: number | null;
  baselineTarget: number;
  optimisticTarget: number;
  status: KpiStatus;
}

export interface KpiPeriodSummary extends KpiBreakdownItem {
  period: KpiPeriod;
  anchorDate: string;
  previousAnchor: string;
  nextAnchor: string;
  breakdown: KpiBreakdownItem[];
  dailyResults: KpiBreakdownItem[];
  records: Array<{
    date: string;
    actualPcts: number;
    note: string | null;
  }>;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ET_TIME_ZONE = "America/New_York";
const holidayCache = new Map<number, Set<string>>();

export function isKpiPeriod(value: unknown): value is KpiPeriod {
  return typeof value === "string" && KPI_PERIODS.includes(value as KpiPeriod);
}

export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseUtcTradingDate(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getEtDateString(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ET_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function formatEtDisplayDate(date = new Date()): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: ET_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
): Date {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month, 1 + offset + (occurrence - 1) * 7));
}

function lastWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
): Date {
  const last = new Date(Date.UTC(year, month + 1, 0));
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  last.setUTCDate(last.getUTCDate() - offset);
  return last;
}

function observedDate(year: number, month: number, day: number): Date {
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() - 1);
  if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
  return date;
}

// Gregorian Easter calculation (Meeus/Jones/Butcher)
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function getUsMarketHolidays(year: number): Set<string> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const holidays = new Set<string>();
  const addIfInYear = (date: Date) => {
    if (date.getUTCFullYear() === year) holidays.add(toDateString(date));
  };

  addIfInYear(observedDate(year, 0, 1));
  addIfInYear(observedDate(year + 1, 0, 1));
  addIfInYear(nthWeekdayOfMonth(year, 0, 1, 3)); // MLK Day
  addIfInYear(nthWeekdayOfMonth(year, 1, 1, 3)); // Presidents Day

  const goodFriday = easterSunday(year);
  goodFriday.setUTCDate(goodFriday.getUTCDate() - 2);
  addIfInYear(goodFriday);

  addIfInYear(lastWeekdayOfMonth(year, 4, 1)); // Memorial Day
  if (year >= 2022) addIfInYear(observedDate(year, 5, 19)); // Juneteenth
  addIfInYear(observedDate(year, 6, 4)); // Independence Day
  addIfInYear(nthWeekdayOfMonth(year, 8, 1, 1)); // Labor Day
  addIfInYear(nthWeekdayOfMonth(year, 10, 4, 4)); // Thanksgiving
  addIfInYear(observedDate(year, 11, 25)); // Christmas

  holidayCache.set(year, holidays);
  return holidays;
}

export function isUsMarketTradingDay(date: Date): boolean {
  const weekday = date.getUTCDay();
  if (weekday === 0 || weekday === 6) return false;
  return !getUsMarketHolidays(date.getUTCFullYear()).has(toDateString(date));
}

export function getTradingDays(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  const cursor = new Date(start);
  cursor.setUTCHours(0, 0, 0, 0);

  while (cursor <= end) {
    if (isUsMarketTradingDay(cursor)) result.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

export function getKpiPeriodRange(
  period: KpiPeriod,
  anchorDate: string,
): KpiPeriodRange {
  const anchor = parseUtcTradingDate(anchorDate);
  if (!anchor) throw new Error("日期格式错误，应为 YYYY-MM-DD");

  const start = new Date(anchor);
  const end = new Date(anchor);

  if (period === "week") {
    const weekday = start.getUTCDay();
    start.setUTCDate(start.getUTCDate() + (weekday === 0 ? -6 : 1 - weekday));
    end.setTime(start.getTime());
    end.setUTCDate(end.getUTCDate() + 6);
  } else if (period === "month") {
    start.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + 1, 0);
  } else if (period === "quarter") {
    const quarterStartMonth = Math.floor(start.getUTCMonth() / 3) * 3;
    start.setUTCMonth(quarterStartMonth, 1);
    end.setUTCMonth(quarterStartMonth + 3, 0);
  } else if (period === "half") {
    const halfStartMonth = start.getUTCMonth() < 6 ? 0 : 6;
    start.setUTCMonth(halfStartMonth, 1);
    end.setUTCMonth(halfStartMonth + 6, 0);
  } else if (period === "year") {
    start.setUTCMonth(0, 1);
    end.setUTCMonth(11, 31);
  }

  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  return {
    start,
    end,
    startDate: toDateString(start),
    endDate: toDateString(end),
  };
}

function nextTradingDay(date: Date, direction: 1 | -1): Date {
  const result = new Date(date);
  do {
    result.setUTCDate(result.getUTCDate() + direction);
  } while (!isUsMarketTradingDay(result));
  return result;
}

export function shiftKpiAnchor(
  period: KpiPeriod,
  anchorDate: string,
  direction: 1 | -1,
): string {
  const anchor = parseUtcTradingDate(anchorDate);
  if (!anchor) throw new Error("日期格式错误，应为 YYYY-MM-DD");

  if (period === "day") return toDateString(nextTradingDay(anchor, direction));
  if (period === "week") anchor.setUTCDate(anchor.getUTCDate() + 7 * direction);
  if (period === "month")
    anchor.setUTCMonth(anchor.getUTCMonth() + direction, 1);
  if (period === "quarter")
    anchor.setUTCMonth(anchor.getUTCMonth() + 3 * direction, 1);
  if (period === "half")
    anchor.setUTCMonth(anchor.getUTCMonth() + 6 * direction, 1);
  if (period === "year")
    anchor.setUTCFullYear(anchor.getUTCFullYear() + direction, 0, 1);
  return toDateString(anchor);
}

function evaluateKpi(
  actualPcts: number | null,
  baselineTarget: number,
  optimisticTarget: number,
): KpiStatus {
  if (actualPcts === null) return "UNRECORDED";
  if (actualPcts >= optimisticTarget) return "OPTIMISTIC";
  if (actualPcts >= baselineTarget) return "BASELINE";
  return "BELOW_BASELINE";
}

function getTargetsForDate(
  date: Date,
  sortedTargets: readonly KpiTargetValue[],
): { baseline: number; optimistic: number } {
  let baseline: number = DEFAULT_KPI_TARGETS.baseline;
  let optimistic: number = DEFAULT_KPI_TARGETS.optimistic;

  for (const target of sortedTargets) {
    if (target.effectiveFrom > date) break;
    baseline = target.dailyBaseline;
    optimistic = target.dailyOptimistic;
  }

  return { baseline, optimistic };
}

function summarizeDays(
  days: readonly Date[],
  recordsByDate: ReadonlyMap<string, KpiRecordValue>,
  targets: readonly KpiTargetValue[],
): Omit<KpiBreakdownItem, "key" | "label" | "startDate" | "endDate"> {
  let actualPcts = 0;
  let recordedDayCount = 0;
  let baselineTarget = 0;
  let optimisticTarget = 0;

  for (const day of days) {
    const dailyTargets = getTargetsForDate(day, targets);
    baselineTarget += dailyTargets.baseline;
    optimisticTarget += dailyTargets.optimistic;

    const record = recordsByDate.get(toDateString(day));
    if (record) {
      recordedDayCount += 1;
      actualPcts += record.actualPcts;
    }
  }

  const actual = recordedDayCount > 0 ? actualPcts : null;
  return {
    tradingDayCount: days.length,
    recordedDayCount,
    actualPcts: actual,
    baselineTarget,
    optimisticTarget,
    status: evaluateKpi(actual, baselineTarget, optimisticTarget),
  };
}

function monthLabel(date: Date): string {
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月`;
}

function dayLabel(date: Date): string {
  const weekday = new Intl.DateTimeFormat("zh-CN", {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
  return `${weekday} ${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}`;
}

function buildBreakdownGroups(
  period: KpiPeriod,
  tradingDays: readonly Date[],
): Array<{
  key: string;
  label: string;
  days: Date[];
}> {
  if (period === "day") return [];

  const groups = new Map<string, { label: string; days: Date[] }>();
  for (const day of tradingDays) {
    let key: string;
    let label: string;

    if (period === "week") {
      key = toDateString(day);
      label = dayLabel(day);
    } else if (period === "month") {
      const monday = new Date(day);
      monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() - 1));
      key = toDateString(monday);
      label = "";
    } else {
      key = `${day.getUTCFullYear()}-${String(day.getUTCMonth() + 1).padStart(2, "0")}`;
      label = monthLabel(day);
    }

    const group = groups.get(key) ?? { label, days: [] };
    group.days.push(day);
    groups.set(key, group);
  }

  return Array.from(groups, ([key, group]) => {
    const first = group.days[0]!;
    const last = group.days[group.days.length - 1]!;
    return {
      key,
      label:
        period === "month"
          ? `${String(first.getUTCMonth() + 1).padStart(2, "0")}/${String(first.getUTCDate()).padStart(2, "0")} – ${String(last.getUTCMonth() + 1).padStart(2, "0")}/${String(last.getUTCDate()).padStart(2, "0")}`
          : group.label,
      days: group.days,
    };
  });
}

export function buildKpiPeriodSummary({
  period,
  anchorDate,
  records,
  targets,
}: {
  period: KpiPeriod;
  anchorDate: string;
  records: readonly KpiRecordValue[];
  targets: readonly KpiTargetValue[];
}): KpiPeriodSummary {
  const range = getKpiPeriodRange(period, anchorDate);
  const tradingDays = getTradingDays(range.start, range.end);
  const recordsByDate = new Map(
    records.map((record) => [toDateString(record.date), record]),
  );
  const sortedTargets = [...targets].sort(
    (a, b) => a.effectiveFrom.getTime() - b.effectiveFrom.getTime(),
  );
  const periodValues = summarizeDays(tradingDays, recordsByDate, sortedTargets);

  const breakdown = buildBreakdownGroups(period, tradingDays).map((group) => {
    const values = summarizeDays(group.days, recordsByDate, sortedTargets);
    return {
      key: group.key,
      label: group.label,
      startDate: toDateString(group.days[0]!),
      endDate: toDateString(group.days[group.days.length - 1]!),
      ...values,
    };
  });

  const dailyResults = tradingDays.map((day) => {
    const values = summarizeDays([day], recordsByDate, sortedTargets);
    const date = toDateString(day);
    return {
      key: date,
      label: dayLabel(day),
      startDate: date,
      endDate: date,
      ...values,
    };
  });

  return {
    key: `${period}:${range.startDate}`,
    label: formatKpiPeriodLabel(period, range),
    period,
    anchorDate,
    startDate: range.startDate,
    endDate: range.endDate,
    previousAnchor: shiftKpiAnchor(period, anchorDate, -1),
    nextAnchor: shiftKpiAnchor(period, anchorDate, 1),
    ...periodValues,
    breakdown,
    dailyResults,
    records: records
      .filter(
        (record) => record.date >= range.start && record.date <= range.end,
      )
      .map((record) => ({
        date: toDateString(record.date),
        actualPcts: record.actualPcts,
        note: record.note,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function formatKpiPeriodLabel(
  period: KpiPeriod,
  range: KpiPeriodRange,
): string {
  const start = range.start;
  if (period === "day")
    return `${start.getUTCFullYear()}年${start.getUTCMonth() + 1}月${start.getUTCDate()}日`;
  if (period === "month") return monthLabel(start);
  if (period === "quarter") {
    return `${start.getUTCFullYear()}年 Q${Math.floor(start.getUTCMonth() / 3) + 1}`;
  }
  if (period === "half") {
    return `${start.getUTCFullYear()}年${start.getUTCMonth() < 6 ? "上" : "下"}半年`;
  }
  if (period === "year") return `${start.getUTCFullYear()}年`;
  return `${range.startDate} – ${range.endDate}`;
}
