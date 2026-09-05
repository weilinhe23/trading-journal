import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getExecutions } from "~/app/api/analytics/executions/route";
import { GET as exportExecutions } from "~/app/api/analytics/executions/export/route";
import {
  fetchExecutionRows,
  type computeSummary,
  type computeCharts,
  type ExecutionFilterOptions,
} from "~/lib/execution-aggregator";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("~/lib/prisma", () => ({ prisma: { mnqDailyPlan: { findMany } } }));

const entryNote = '等待确认后进入，信号为 "failed lower"\n没有追高';
const exitNote = "过早退出,没有等待目标";

beforeEach(() => {
  findMany.mockResolvedValue([
    {
      sessionDate: new Date("2026-09-04T00:00:00.000Z"),
      marketPreJson: null,
      marketOpenJson: JSON.stringify({
        opportunities: [
          {
            id: "range-long",
            description: "PML 回踩后做多\n等待 15M 确认",
            captured: true,
            tradeDirection: "LONG",
            strategyName: "MNQ Range trend",
            tradeTypeName: "回调",
            entryPrice: "25000",
            exitPrice: "25020",
            contracts: "2",
            entryAccuracy: "CORRECT",
            entryAccuracyNote: entryNote,
            exitAccuracy: "WRONG",
            exitAccuracyNote: exitNote,
          },
          {
            id: "range-short",
            description: "突破失败",
            captured: true,
            tradeDirection: "SHORT",
            strategyName: "MNQ Range trend",
            tradeTypeName: "回调至PMH",
            entryPrice: "25000",
            exitPrice: "25010",
            contracts: "1",
          },
          {
            id: "trend-long",
            description: "另一策略的同名交易类型",
            captured: true,
            tradeDirection: "LONG",
            strategyName: "MNQ trend trade",
            tradeTypeName: "回调",
            entryPrice: "25000",
            exitPrice: "25000",
            contracts: "1",
          },
          {
            id: "uncategorized",
            description: "历史记录没有分类",
            captured: true,
            tradeDirection: "LONG",
            strategyName: "  ",
            tradeTypeName: null,
            entryAccuracyNote: "只有文字，尚未选择准确性",
          },
          {
            id: "missed",
            description: "仅存在于错过机会的分类",
            captured: false,
            strategyName: "Missed only",
            tradeTypeName: "突破",
          },
        ],
      }),
      marketMidJson: null,
      marketAfternoonJson: null,
    },
  ]);
});

function request(query = "") {
  return new NextRequest(`http://localhost/api/analytics/executions?${query}`);
}

describe("MNQ execution detail", () => {
  it("preserves the opportunity and both accuracy descriptions from raw records", async () => {
    const rows = await fetchExecutionRows();
    expect(rows).toHaveLength(4);
    expect(
      rows.find((row) => row.opportunityId === "range-long"),
    ).toMatchObject({
      description: "PML 回踩后做多\n等待 15M 确认",
      entryAccuracy: "CORRECT",
      entryAccuracyNote: entryNote,
      exitAccuracy: "WRONG",
      exitAccuracyNote: exitNote,
    });
    expect(
      rows.find((row) => row.opportunityId === "uncategorized"),
    ).toMatchObject({
      strategy: null,
      tradeTypeName: null,
      entryAccuracy: null,
      entryAccuracyNote: "只有文字，尚未选择准确性",
      exitAccuracyNote: "",
    });
  });

  it("combines exact strategy and trade type filters for rows, totals and charts", async () => {
    const query = new URLSearchParams({
      strategy: "MNQ Range trend",
      tradeType: "回调",
    });
    const response = await getExecutions(request(query.toString()));
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      data: {
        executions: Awaited<ReturnType<typeof fetchExecutionRows>>;
        summary: ReturnType<typeof computeSummary>;
        charts: ReturnType<typeof computeCharts>;
        filterOptions: ExecutionFilterOptions;
      };
    };
    expect(body.data.executions).toHaveLength(1);
    expect(body.data.executions[0]?.opportunityId).toBe("range-long");
    expect(body.data.summary).toMatchObject({ totalCount: 1, totalPnL: 80 });
    expect(body.data.charts.cumulative).toEqual([
      { date: "2026-09-04", pnl: 80, cumPnL: 80 },
    ]);
    // Options remain available after narrowing the result, including historical empty names.
    expect(body.data.filterOptions.strategies).toEqual(
      expect.arrayContaining([
        { name: "MNQ Range trend", tradeTypes: ["回调", "回调至PMH"] },
        { name: "MNQ trend trade", tradeTypes: ["回调"] },
        { name: "未分类", tradeTypes: ["未分类"] },
      ]),
    );
    expect(body.data.filterOptions.tradeTypes).toEqual([
      "回调",
      "回调至PMH",
      "未分类",
    ]);
    expect(body.data.filterOptions.strategies).toHaveLength(3);
  });

  it("supports trade type alone, unclassified values and other filter intersections", async () => {
    expect(await fetchExecutionRows({ tradeType: "回调" })).toHaveLength(2);
    expect(await fetchExecutionRows({ strategy: "MNQ Range" })).toHaveLength(0);
    expect(
      await fetchExecutionRows({ strategy: "未分类", tradeType: "未分类" }),
    ).toHaveLength(1);
    const rows = await fetchExecutionRows({
      strategy: " mnq range trend ",
      tradeType: "回调至PMH",
      direction: "SHORT",
      result: "LOSS",
      dateFrom: "2026-09-04",
      dateTo: "2026-09-04",
    });
    expect(rows.map((row) => row.opportunityId)).toEqual(["range-short"]);
    expect(
      await fetchExecutionRows({ tradeType: "回调", dateTo: "2026-09-03" }),
    ).toEqual([]);
  });

  it("exports the same filtered records with multiline review descriptions escaped", async () => {
    const query = new URLSearchParams({
      strategy: "MNQ Range trend",
      tradeType: "回调",
    });
    const response = await exportExecutions(request(query.toString()));
    expect(response.status).toBe(200);
    const csv = await response.text();
    expect(csv).toContain("交易机会,进入评估说明,退出评估说明");
    expect(csv).toContain('"PML 回踩后做多\n等待 15M 确认"');
    expect(csv).toContain(
      '"等待确认后进入，信号为 ""failed lower""\n没有追高"',
    );
    expect(csv).toContain('"过早退出,没有等待目标"');
    expect(csv).not.toContain("突破失败");
    expect(csv).not.toContain("另一策略的同名交易类型");
  });
});
