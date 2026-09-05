import { NextResponse } from "next/server";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";

// GET /api/analytics/summary — MNQ opportunity facts only
export async function GET() {
  try {
    const { summary } = await getMnqAnalyticsSnapshot();
    return NextResponse.json({
      success: true,
      data: {
        ...summary,
        // Compatibility aliases for existing API consumers.
        totalExecutions: summary.capturedCount,
        executionsWithPnL: summary.settledCount,
        profitableExecutions: summary.winsCount,
        totalSetups: summary.totalOpportunities,
        executedSetups: summary.capturedCount,
        missedSetups: summary.missedCount,
        watchingSetups: summary.pendingCount,
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics/summary]", error);
    return NextResponse.json(
      { success: false, error: "MNQ 统计查询失败" },
      { status: 500 },
    );
  }
}
