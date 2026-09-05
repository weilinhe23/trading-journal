import { describe, expect, it } from "vitest";
import {
  buildMnqAnalyticsSnapshot,
  type MnqAnalyticsSource,
} from "~/lib/mnq-analytics";

function segment(opportunities: unknown[]): string {
  return JSON.stringify({ opportunities });
}

function source(date: string, opportunities: unknown[]): MnqAnalyticsSource {
  return {
    sessionDate: new Date(`${date}T00:00:00.000Z`),
    marketPreJson: null,
    marketOpenJson: segment(opportunities),
    marketMidJson: null,
    marketAfternoonJson: null,
  };
}

describe("MNQ analytics", () => {
  it("uses MNQ opportunities as the only analytics facts", () => {
    const snapshot = buildMnqAnalyticsSnapshot([
      source("2026-08-28", [
        {
          id: "captured-win",
          description: "开盘回踩做多",
          captured: true,
          tradeDirection: "LONG",
          strategyName: "Trend",
          tradeTypeName: "Pullback",
          entryPrice: "25000",
          exitPrice: "25020",
          contracts: "2",
          entryAccuracy: "CORRECT",
          exitAccuracy: "WRONG",
        },
        {
          id: "missed",
          description: "错过突破",
          captured: false,
          strategyName: "Trend",
          missedReasonCategory: "HESITATION",
          missedRiskPts: "10",
          missedReturnPts: "30",
          missedProcess: "看到信号但没有执行",
        },
        {
          id: "pending",
          description: "尚未确认",
          captured: null,
        },
      ]),
    ]);

    expect(snapshot.summary).toMatchObject({
      totalOpportunities: 3,
      capturedCount: 1,
      missedCount: 1,
      pendingCount: 1,
      settledCount: 1,
      totalPnL: 80,
      winsCount: 1,
    });
    expect(snapshot.rows.map((row) => row.id)).toEqual([
      "2026-08-28:marketOpenJson:captured-win",
      "2026-08-28:marketOpenJson:missed",
      "2026-08-28:marketOpenJson:pending",
    ]);
    expect(snapshot.missed).toMatchObject({
      totalMissed: 1,
      categorizedCount: 1,
      evaluatedCount: 1,
      totalHypotheticalR: 3,
    });
    expect(snapshot.executionQuality).toMatchObject({
      totalCaptured: 1,
      entryAccuracyRate: 100,
      exitAccuracyRate: 0,
      avgPnLEntryCorrect: 80,
      avgPnLExitWrong: 80,
    });
    expect(snapshot.strategies[0]).toMatchObject({
      name: "Trend",
      total: 2,
      captured: 1,
      missed: 1,
      totalPnL: 80,
      missedPotentialR: 3,
    });
  });

  it("does not treat an empty exit price as a settled trade", () => {
    const snapshot = buildMnqAnalyticsSnapshot([
      source("2026-08-29", [
        {
          id: "open-position",
          description: "未填写出场价",
          captured: true,
          tradeDirection: "SHORT",
          entryPrice: "25000",
          exitPrice: "",
          contracts: "1",
        },
      ]),
    ]);

    expect(snapshot.summary.capturedCount).toBe(1);
    expect(snapshot.summary.settledCount).toBe(0);
    expect(snapshot.summary.totalPnL).toBe(0);
    expect(snapshot.rows[0]?.pnl).toBeNull();
  });

  it("keeps uncategorized missed opportunities visible", () => {
    const snapshot = buildMnqAnalyticsSnapshot([
      source("2026-08-30", [
        {
          id: "uncategorized",
          description: "没有填写分类",
          captured: false,
          missedProcess: "记录了过程",
        },
      ]),
    ]);

    expect(snapshot.missed.breakdown).toEqual([
      expect.objectContaining({
        reason: "UNCLASSIFIED",
        label: "未分类",
        count: 1,
      }),
    ]);
  });
});
