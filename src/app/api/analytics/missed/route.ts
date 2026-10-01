import { type NextRequest, NextResponse } from "next/server";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";
import { buildMissedOpportunityResponse } from "~/lib/missed-opportunity-aggregator";
import { fetchDailyScreenshots } from "~/lib/analytics-screenshots";

// GET /api/analytics/missed — MNQ missed opportunities only
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { rows } = await getMnqAnalyticsSnapshot();
    const data = buildMissedOpportunityResponse(rows, {
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      strategy: searchParams.get("strategy"),
      tradeType: searchParams.get("tradeType"),
      reason: searchParams.get("reason"),
    });
    const screenshotsByDate = await fetchDailyScreenshots(
      data.rows.map((row) => row.date),
    );
    return NextResponse.json({
      success: true,
      data: { ...data, screenshotsByDate },
    });
  } catch (error) {
    console.error("[GET /api/analytics/missed]", error);
    return NextResponse.json(
      { success: false, error: "MNQ 错过机会统计失败" },
      { status: 500 },
    );
  }
}
