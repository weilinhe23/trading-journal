import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ records: vi.fn(), targets: vi.fn() }));
vi.mock("~/lib/prisma", () => ({
  prisma: {
    kpiDailyRecord: { findMany: mocks.records },
    kpiTargetSetting: { findMany: mocks.targets },
  },
}));
import {
  KpiQueryError,
  parseAnalysisQuery,
  queryKpiAnalysis,
} from "~/lib/kpi-comparison-server";
import { GET as trendsGet } from "~/app/api/kpi/trends/route";
import { GET as comparisonGet } from "~/app/api/kpi/comparison/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.records.mockResolvedValue([]);
  mocks.targets.mockResolvedValue([]);
});
describe("KPI query API", () => {
  it("defaults to four natural weeks including the current week across New Year", () => {
    const query = parseAnalysisQuery(
      new URLSearchParams(),
      "trends",
      "2026-01-07",
    );
    expect(query.period).toBe("week");
    expect(query.anchors).toEqual([
      "2025-12-15",
      "2025-12-22",
      "2025-12-29",
      "2026-01-05",
    ]);
  });
  it.each(["period=year", "from=2026-02-30", "from=2026-06-01&to=2026-01-01"])(
    "returns 400 for invalid range: %s",
    async (query) => {
      expect(
        (
          await trendsGet(
            new Request(`http://localhost/api/kpi/trends?${query}`),
          )
        ).status,
      ).toBe(400);
      expect(mocks.records).not.toHaveBeenCalled();
    },
  );
  it.each([
    "mode=bad",
    "anchors=2026-01-01,2026-01-20",
    "anchors=2026-01-01,2026-02-01&baseline=2026-03-01",
  ])("returns 400 for invalid selection: %s", async (query) => {
    expect(
      (
        await comparisonGet(
          new Request(`http://localhost/api/kpi/comparison?${query}`),
        )
      ).status,
    ).toBe(400);
  });
  it("reads previous-year data and returns a successful payload", async () => {
    const response = await trendsGet(
      new Request(
        "http://localhost/api/kpi/trends?period=month&from=2026-01-01&to=2026-01-31",
      ),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { success: boolean };
    expect(body.success).toBe(true);
    const call = mocks.records.mock.calls[0]?.[0] as {
      where: { OR: Array<{ date: { gte: Date; lte: Date } }> };
    };
    expect(call.where.OR[0]).toEqual({
      date: {
        gte: new Date("2025-12-01T00:00:00Z"),
        lte: new Date("2026-01-31T23:59:59.999Z"),
      },
    });
  });
  it("reads nonconsecutive quarters and includes target history", async () => {
    const query = parseAnalysisQuery(
      new URLSearchParams(
        "period=quarter&anchors=2025-10-01,2026-04-01&baseline=2026-04-01",
      ),
      "comparison",
      "2026-09-05",
    );
    const result = await queryKpiAnalysis(query);
    expect(result).toHaveProperty("baseline", "2026-04-01");
    expect(mocks.targets).toHaveBeenCalled();
    expect(mocks.records).toHaveBeenCalledTimes(1);
  });
  it("rejects future selections using ET today", () => {
    expect(() =>
      parseAnalysisQuery(
        new URLSearchParams("anchors=2026-08-01,2026-10-01"),
        "comparison",
        "2026-09-05",
      ),
    ).toThrow(KpiQueryError);
  });
  it("returns 500 rather than mislabelling a database failure as bad input", async () => {
    mocks.records.mockRejectedValueOnce(new Error("test database failure"));
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const response = await trendsGet(
        new Request(
          "http://localhost/api/kpi/trends?from=2026-01-01&to=2026-02-01",
        ),
      );
      expect(response.status).toBe(500);
    } finally {
      log.mockRestore();
    }
  });
});
