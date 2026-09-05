import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getMissed } from "~/app/api/analytics/missed/route";
import { GET as exportMissed } from "~/app/api/analytics/missed/export/route";
import {
  fetchMissedOpportunityRows,
  type MissedOpportunityFilterOptions,
} from "~/lib/missed-opportunity-aggregator";
import type { MnqMissedAnalytics } from "~/lib/mnq-analytics";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("~/lib/prisma", () => ({ prisma: { mnqDailyPlan: { findMany } } }));

const missedProcess = '看到信号后犹豫，等到 "确认" 时已经走远\n没有追单';

beforeEach(() => {
  findMany.mockResolvedValue([
    {
      sessionDate: new Date("2026-09-04T00:00:00.000Z"),
      marketPreJson: null,
      marketOpenJson: JSON.stringify({
        opportunities: [
          {
            id: "range-pullback",
            description: "PML 回踩后做多",
            captured: false,
            tradeDirection: "LONG",
            strategyName: "MNQ Range trend",
            tradeTypeName: "回调",
            decisionTimeframe: "M5",
            entryApproach: "PULLBACK",
            missedReasonCategory: "HESITATION",
            missedProcess,
            missedPlannedRiskPts: "10",
            missedPlannedReturnPts: "20",
            missedRiskPts: "8",
            missedReturnPts: "24",
          },
          {
            id: "range-breakout",
            description: "区间突破",
            captured: false,
            tradeDirection: "SHORT",
            strategyName: "MNQ Range trend",
            tradeTypeName: "突破",
            missedReasonCategory: "RECOGNIZED_LATE",
          },
          {
            id: "trend-pullback",
            description: "另一策略的同名交易类型",
            captured: false,
            strategyName: "MNQ trend trade",
            tradeTypeName: "回调",
            missedReasonCategory: "HESITATION",
          },
          {
            id: "uncategorized",
            description: "历史记录未分类",
            captured: false,
            strategyName: " ",
            tradeTypeName: null,
          },
          {
            id: "captured",
            description: "不属于错过明细",
            captured: true,
            strategyName: "Captured only",
            tradeTypeName: "回调",
          },
        ],
      }),
      marketMidJson: null,
      marketAfternoonJson: null,
    },
  ]);
});

function request(path: string, query = "") {
  return new NextRequest(`http://localhost${path}?${query}`);
}

describe("MNQ missed opportunity detail", () => {
  it("preserves the missed description, process and plan versus hindsight values", async () => {
    const rows = await fetchMissedOpportunityRows();
    expect(rows).toHaveLength(4);
    expect(
      rows.find((row) => row.opportunityId === "range-pullback"),
    ).toMatchObject({
      description: "PML 回踩后做多",
      missedProcess,
      plannedRiskPts: 10,
      plannedTargetR: 2,
      missedRiskPts: 8,
      missedReturnPts: 24,
      hypotheticalR: 3,
      decisionTimeframe: "M5",
      entryApproach: "PULLBACK",
    });
  });

  it("combines strategy, trade type, reason and date filters and recomputes totals", async () => {
    const query = new URLSearchParams({
      strategy: "MNQ Range trend",
      tradeType: "回调",
      reason: "HESITATION",
      dateFrom: "2026-09-04",
      dateTo: "2026-09-04",
    });
    const response = await getMissed(
      request("/api/analytics/missed", query.toString()),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      data: MnqMissedAnalytics & {
        filterOptions: MissedOpportunityFilterOptions;
      };
    };

    expect(body.data.rows.map((row) => row.opportunityId)).toEqual([
      "range-pullback",
    ]);
    expect(body.data).toMatchObject({
      totalMissed: 1,
      categorizedCount: 1,
      evaluatedCount: 1,
      totalHypotheticalR: 3,
    });
    expect(body.data.breakdown).toEqual([
      {
        reason: "HESITATION",
        label: "犹豫 / 害怕亏损",
        count: 1,
        share: 100,
        hypotheticalR: 3,
        evaluatedCount: 1,
      },
    ]);
    expect(body.data.filterOptions.strategies).toEqual(
      expect.arrayContaining([
        { name: "MNQ Range trend", tradeTypes: ["回调", "突破"] },
        { name: "MNQ trend trade", tradeTypes: ["回调"] },
        { name: "未分类", tradeTypes: ["未分类"] },
      ]),
    );
    expect(body.data.filterOptions.strategies).toHaveLength(3);
    expect(body.data.filterOptions.reasons).toEqual(
      expect.arrayContaining([
        { value: "HESITATION", label: "犹豫 / 害怕亏损" },
        { value: "RECOGNIZED_LATE", label: "发现太晚" },
        { value: "UNCLASSIFIED", label: "未分类" },
      ]),
    );
  });

  it("supports trade type alone, unclassified values and exact category matching", async () => {
    expect(
      await fetchMissedOpportunityRows({ tradeType: "回调" }),
    ).toHaveLength(2);
    expect(
      await fetchMissedOpportunityRows({ strategy: "MNQ Range" }),
    ).toHaveLength(0);
    expect(
      await fetchMissedOpportunityRows({
        strategy: "未分类",
        tradeType: "未分类",
        reason: "UNCLASSIFIED",
      }),
    ).toHaveLength(1);
    expect(await fetchMissedOpportunityRows({ dateTo: "2026-09-03" })).toEqual(
      [],
    );
  });

  it("exports the same filtered record and escapes multiline review text", async () => {
    const query = new URLSearchParams({
      strategy: "MNQ Range trend",
      tradeType: "回调",
    });
    const response = await exportMissed(
      request("/api/analytics/missed/export", query.toString()),
    );
    expect(response.status).toBe(200);
    const csv = await response.text();
    expect(csv).toContain("交易机会,错过原因,错过经过");
    expect(csv).toContain("PML 回踩后做多");
    expect(csv).toContain(
      '"看到信号后犹豫，等到 ""确认"" 时已经走远\n没有追单"',
    );
    expect(csv).toContain("等待回调,10,2,8,24,3");
    expect(csv).not.toContain("区间突破");
    expect(csv).not.toContain("另一策略的同名交易类型");
  });
});
