import { describe, expect, it } from "vitest";
import { getKpiPeriodRange, getTradingDays, getEtDateString } from "~/lib/kpi";
import {
  buildAnalysisPeriod,
  buildComparison,
  buildTrends,
  normalizeSelection,
  periodAnchors,
  validAnalysisDate,
  type AnalysisSource,
  type ComparisonPeriod,
} from "~/lib/kpi-comparison";

const date = (s: string) => new Date(`${s}T00:00:00Z`);
const record = (s: string, actualPcts: number) => ({
  date: date(s),
  actualPcts,
  note: null,
});
const empty: AnalysisSource = { records: [], targets: [], today: "2026-09-05" };
function filled(period: ComparisonPeriod, anchor: string, value: number) {
  const range = getKpiPeriodRange(period, anchor);
  return getTradingDays(range.start, range.end).map((d) => ({
    date: d,
    actualPcts: value,
    note: null,
  }));
}

describe("KPI comparison dates", () => {
  it("rejects rollover dates and reversed ranges", () => {
    expect(validAnalysisDate("2026-02-30")).toBe(false);
    expect(validAnalysisDate("2024-02-29")).toBe(true);
    expect(validAnalysisDate("2025-02-29")).toBe(false);
    expect(() => periodAnchors("month", "2026-06-01", "2026-01-01")).toThrow();
  });
  it("normalizes partial boundaries and crosses year, month and quarter boundaries", () => {
    expect(periodAnchors("week", "2025-12-31", "2026-01-07")).toEqual([
      "2025-12-29",
      "2026-01-05",
    ]);
    expect(periodAnchors("month", "2025-12-15", "2026-02-02")).toEqual([
      "2025-12-01",
      "2026-01-01",
      "2026-02-01",
    ]);
    expect(periodAnchors("quarter", "2025-11-01", "2026-04-20")).toEqual([
      "2025-10-01",
      "2026-01-01",
      "2026-04-01",
    ]);
  });
  it("uses ET today across midnight and daylight saving", () => {
    expect(getEtDateString(new Date("2026-09-05T02:00:00Z"))).toBe(
      "2026-09-04",
    );
    expect(getEtDateString(new Date("2026-03-08T07:00:00Z"))).toBe(
      "2026-03-08",
    );
  });
  it("deduplicates, validates baseline and rejects future periods", () => {
    expect(
      normalizeSelection(
        "month",
        ["2026-03-12", "2026-01-10", "2026-03-01"],
        "2026-01-05",
        empty.today,
      ),
    ).toEqual({
      anchors: ["2026-01-01", "2026-03-01"],
      baseline: "2026-01-01",
    });
    expect(() =>
      normalizeSelection(
        "month",
        ["2026-01-01", "2026-01-20"],
        "2026-01-01",
        empty.today,
      ),
    ).toThrow();
    expect(() =>
      normalizeSelection(
        "month",
        ["2026-01-01", "2026-03-01"],
        "2026-02-01",
        empty.today,
      ),
    ).toThrow();
    expect(() =>
      normalizeSelection(
        "month",
        ["2026-01-01", "2026-10-01"],
        "2026-01-01",
        empty.today,
      ),
    ).toThrow();
  });
});

describe("KPI cumulative and target metrics", () => {
  it("distinguishes missing days, zero, loss and future records", () => {
    const value = buildAnalysisPeriod("week", "2026-08-24", {
      ...empty,
      today: "2026-08-27",
      records: [
        record("2026-08-25", 0),
        record("2026-08-26", -20),
        record("2026-08-28", 1000),
      ],
    });
    expect(value.days.map((d) => d.cumulative)).toEqual([null, 0, -20, -20]);
    expect(value.actual).toBe(-20);
    expect(value.recorded).toBe(2);
    expect(value.expected).toBe(4);
    expect(value.complete).toBe(false);
    expect(value.average).toBe(-10);
  });
  it("keeps no-data periods null instead of zero", () => {
    const value = buildAnalysisPeriod("month", "2026-01-01", empty);
    expect(value.actual).toBeNull();
    expect(value.average).toBeNull();
    expect(value.days.every((d) => d.cumulative === null)).toBe(true);
  });
  it("sums effective daily targets separately for elapsed and whole periods", () => {
    const value = buildAnalysisPeriod("week", "2026-08-24", {
      today: "2026-08-26",
      records: [
        record("2026-08-24", 100),
        record("2026-08-25", 0),
        record("2026-08-26", 300),
      ],
      targets: [
        {
          effectiveFrom: date("2026-08-26"),
          dailyBaseline: 200,
          dailyOptimistic: 400,
        },
      ],
    });
    expect(value.baseline).toBe(400);
    expect(value.fullBaseline).toBe(800);
    expect(value.completion).toBe(100);
    expect(value.fullCompletion).toBe(50);
    expect(value.gap).toBe(0);
    expect(value.hitRate).toBe(66.67);
  });
  it("handles holidays and preserves the original note for editing", () => {
    const value = buildAnalysisPeriod("week", "2026-09-07", {
      ...empty,
      today: "2026-09-11",
      records: [{ ...record("2026-09-08", 20), note: "review" }],
    });
    expect(value.days.map((d) => d.date)).toEqual([
      "2026-09-08",
      "2026-09-09",
      "2026-09-10",
      "2026-09-11",
    ]);
    expect(value.days[0]?.note).toBe("review");
  });
});

describe("KPI multiple period comparison", () => {
  it("compares 320 vs 250 at day 8 while preserving later historical curves", () => {
    const records = [
      ...filled("month", "2026-07-01", 31.25),
      ...filled("month", "2026-08-01", 40),
    ];
    const output = buildComparison(
      "month",
      ["2026-07-01", "2026-08-01"],
      "2026-07-01",
      "aligned",
      { ...empty, today: "2026-08-12", records },
    );
    expect(output.alignedDays).toBe(8);
    expect(output.series[1]?.metrics.actual).toBe(320);
    expect(output.series[0]?.metrics.actual).toBe(250);
    expect(output.series[1]?.change).toEqual({
      delta: 70,
      percent: 28,
      reason: null,
    });
    expect(output.points.length).toBeGreaterThan(8);
    expect(output.points[8]?.s1).toBeNull();
    expect(output.points[8]?.s0).not.toBeNull();
  });
  it("supports 6 nonconsecutive periods, arbitrary baseline and short periods", () => {
    const anchors = [
      "2025-10-01",
      "2025-12-01",
      "2026-02-01",
      "2026-04-01",
      "2026-06-01",
      "2026-08-01",
    ];
    const output = buildComparison("month", anchors, "2026-04-01", "full", {
      ...empty,
      records: anchors.flatMap((a) => filled("month", a, 10)),
    });
    expect(output.series).toHaveLength(6);
    expect(output.baseline).toBe("2026-04-01");
    const shortIndex = output.series.findIndex(
      (s) => s.days.length === output.alignedDays,
    );
    expect(output.points[output.alignedDays]?.[`s${shortIndex}`]).toBeNull();
    expect(() =>
      normalizeSelection(
        "month",
        [...anchors, "2026-07-01"],
        anchors[0]!,
        empty.today,
      ),
    ).toThrow();
  });
  it.each([0, -10])(
    "suppresses percentages for a nonpositive base %s",
    (base) => {
      const output = buildComparison(
        "week",
        ["2026-08-17", "2026-08-24"],
        "2026-08-17",
        "full",
        {
          ...empty,
          records: [
            ...filled("week", "2026-08-17", base),
            ...filled("week", "2026-08-24", 10),
          ],
        },
      );
      expect(output.series[1]?.change.percent).toBeNull();
      expect(output.series[1]?.change.delta).toBe(50 - 5 * base);
    },
  );
  it("does not publish percentage improvements when either side has missing data", () => {
    const output = buildComparison(
      "week",
      ["2026-08-17", "2026-08-24"],
      "2026-08-17",
      "aligned",
      {
        ...empty,
        records: [
          ...filled("week", "2026-08-17", 10),
          record("2026-08-24", 100),
        ],
      },
    );
    expect(output.series[1]?.change.percent).toBeNull();
    expect(output.series[1]?.change.reason).toContain("不完整");
  });
});

describe("KPI range trend", () => {
  it("compares first period to the adjacent period outside the range", () => {
    const output = buildTrends("month", ["2026-01-01"], {
      ...empty,
      records: [
        ...filled("month", "2025-12-01", 10),
        ...filled("month", "2026-01-01", 20),
      ],
    });
    expect(output.items).toHaveLength(1);
    expect(output.items[0]?.change.delta).toBe(180);
  });
  it("does not skip an empty previous period", () => {
    const output = buildTrends(
      "month",
      ["2026-01-01", "2026-02-01", "2026-03-01"],
      {
        ...empty,
        records: [
          ...filled("month", "2026-01-01", 10),
          ...filled("month", "2026-03-01", 20),
        ],
      },
    );
    expect(output.items[1]?.actual).toBeNull();
    expect(output.items[2]?.change.delta).toBeNull();
  });
  it("smooths only 4 complete, fully recorded consecutive periods", () => {
    const anchors = periodAnchors("month", "2026-01-01", "2026-05-01");
    const source = {
      ...empty,
      today: "2026-05-10",
      records: anchors.flatMap((a) => filled("month", a, 10)),
    };
    const output = buildTrends("month", anchors, source, "2026-02-01");
    expect(output.items[2]?.movingActual).toBeNull();
    expect(output.items[3]?.movingAverage).toBe(10);
    expect(output.items[4]?.movingActual).toBeNull();
    expect(output.detail?.anchor).toBe("2026-02-01");
    expect(output.items[0]).not.toHaveProperty("days");
  });
});
