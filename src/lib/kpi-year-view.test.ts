import { describe, expect, it } from "vitest";
import { buildKpiPeriodSummary, type KpiRecordValue } from "./kpi";
import { buildKpiYearView } from "./kpi-year-view";

const record = (date: string, actualPcts: number): KpiRecordValue => ({
  date: new Date(`${date}T00:00:00Z`),
  actualPcts,
  note: null,
});
const summary = (year: number, records: KpiRecordValue[] = []) =>
  buildKpiPeriodSummary({
    period: "year",
    anchorDate: `${year}-01-01`,
    records,
    targets: [],
  });

describe("yearly KPI calendar", () => {
  it("keeps weekdays aligned, holidays empty, and every trading day exactly once", () => {
    const source = summary(2026);
    const view = buildKpiYearView(source, "2026-09-18");
    const tradingDates: string[] = [];
    expect(view.months).toHaveLength(12);
    for (const month of view.months) {
      expect(month.cells).toHaveLength(30);
      month.cells.forEach((cell, index) => {
        if (!cell) return;
        const date = new Date(`${cell.date}T00:00:00Z`);
        expect(date.getUTCDay()).toBe((index % 5) + 1);
        expect(date.getUTCMonth() + 1).toBe(month.month);
        if (cell.result) tradingDates.push(cell.date);
      });
    }
    expect(tradingDates).toEqual(
      source.dailyResults.map((day) => day.startDate),
    );
    const newYear = view.months[0]!.cells.find(
      (cell) => cell?.date === "2026-01-01",
    );
    expect(newYear?.result).toBeNull();
  });

  it("includes leap day and handles a month beginning on a weekend", () => {
    const view = buildKpiYearView(summary(2024), "2024-03-01");
    expect(
      view.months[1]!.cells.some((cell) => cell?.date === "2024-02-29"),
    ).toBe(true);
    const june = view.months[5]!;
    expect(june.cells.slice(0, 5)).toEqual([null, null, null, null, null]);
    expect(june.cells[5]?.date).toBe("2024-06-03");
  });

  it("distinguishes zero from missing data and includes optimistic days in baseline counts", () => {
    const source = summary(2026, [
      record("2026-01-02", 0),
      record("2026-02-02", 100),
      record("2026-02-03", 200),
      record("2026-02-04", -20.5),
    ]);
    const view = buildKpiYearView(source, "2026-02-04");
    expect(view.months[0]!.actualPcts).toBe(0);
    expect(view.months[0]!.recordedDays).toBe(1);
    expect(view.months[1]!.actualPcts).toBe(279.5);
    expect(view.months[2]!.actualPcts).toBeNull();
    expect(view.baselineDays).toBe(2);
    expect(view.optimisticDays).toBe(1);
  });

  it("selects today's zero record, otherwise the latest recorded day", () => {
    const source = summary(2026, [
      record("2026-09-17", 120),
      record("2026-09-18", 0),
    ]);
    expect(buildKpiYearView(source, "2026-09-18").selectedDate).toBe(
      "2026-09-18",
    );
    expect(buildKpiYearView(source, "2026-09-21").selectedDate).toBe(
      "2026-09-18",
    );
    expect(buildKpiYearView(summary(2026), "2026-09-18").selectedDate).toBe(
      "2026-09-18",
    );
    expect(buildKpiYearView(summary(2027), "2026-09-18").selectedDate).toBe(
      "2027-01-04",
    );
  });
});
