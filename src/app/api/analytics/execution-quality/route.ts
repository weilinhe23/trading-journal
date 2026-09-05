import { NextResponse } from "next/server";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";

// GET /api/analytics/execution-quality — MNQ entry/exit accuracy only
export async function GET() {
  try {
    const { executionQuality: quality } = await getMnqAnalyticsSnapshot();
    return NextResponse.json({
      success: true,
      data: {
        ...quality,
        // Compatibility aliases for existing API consumers.
        totalExecutions: quality.totalCaptured,
        entryMetRate: quality.entryAccuracyRate,
        entryMetCount: quality.entryCorrectCount,
        entryTotalWithData: quality.entryEvaluatedCount,
        exitMetRate: quality.exitAccuracyRate,
        exitMetCount: quality.exitCorrectCount,
        exitTotalWithData: quality.exitEvaluatedCount,
        gradeDistribution: [],
        avgPnLDisciplined: quality.avgPnLEntryCorrect,
        avgPnLUndisciplined: quality.avgPnLEntryWrong,
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics/execution-quality]", error);
    return NextResponse.json(
      { success: false, error: "MNQ 执行质量统计失败" },
      { status: 500 },
    );
  }
}
