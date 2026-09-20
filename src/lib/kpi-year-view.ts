import type { KpiBreakdownItem, KpiPeriodSummary } from "~/lib/kpi";

export interface KpiCalendarCell {
  date: string;
  dayNumber: number;
  result: KpiBreakdownItem | null;
}

export interface KpiCalendarMonth {
  month: number;
  cells: Array<KpiCalendarCell | null>;
  actualPcts: number | null;
  recordedDays: number;
  tradingDays: number;
}

// Called on the server: aggregate records before passing the calendar to the client.
export function buildKpiYearView(summary: KpiPeriodSummary, today: string) {
  const year = Number(summary.startDate.slice(0, 4));
  const byDate = new Map(
    summary.dailyResults.map((day) => [day.startDate, day]),
  );
  const recorded = summary.dailyResults.filter(
    (day) => day.actualPcts !== null,
  );
  const todayResult = byDate.get(today);
  const selectedDate =
    (todayResult?.actualPcts != null ? today : undefined) ??
    recorded.filter((day) => day.startDate <= today).at(-1)?.startDate ??
    recorded.at(-1)?.startDate ??
    todayResult?.startDate ??
    summary.dailyResults[0]?.startDate ??
    null;

  const months: KpiCalendarMonth[] = Array.from({ length: 12 }, (_, index) => {
    const first = new Date(
      `${year}-${String(index + 1).padStart(2, "0")}-01T00:00:00Z`,
    );
    const offset = (first.getUTCDay() + 6) % 7;
    const cells: Array<KpiCalendarCell | null> = [];
    let actualPcts = 0;
    let recordedDays = 0;
    let tradingDays = 0;

    for (let slot = 0; slot < 42; slot++) {
      if (slot % 7 >= 5) continue;
      const date = new Date(first);
      date.setUTCDate(1 - offset + slot);
      if (date.getUTCMonth() !== index) {
        cells.push(null);
        continue;
      }
      const dateString = date.toISOString().slice(0, 10);
      const result = byDate.get(dateString) ?? null;
      if (result) tradingDays++;
      if (result?.actualPcts != null) {
        actualPcts += result.actualPcts;
        recordedDays++;
      }
      cells.push({ date: dateString, dayNumber: date.getUTCDate(), result });
    }

    return {
      month: index + 1,
      cells,
      actualPcts: recordedDays
        ? Math.round((actualPcts + Number.EPSILON) * 100) / 100
        : null,
      recordedDays,
      tradingDays,
    };
  });

  return {
    months,
    selectedDate,
    baselineDays: recorded.filter(
      (day) => day.actualPcts! >= day.baselineTarget,
    ).length,
    optimisticDays: recorded.filter(
      (day) => day.actualPcts! >= day.optimisticTarget,
    ).length,
  };
}
