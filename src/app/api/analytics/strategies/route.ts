import { NextResponse } from "next/server";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";

// GET /api/analytics/strategies — MNQ opportunity strategies only
export async function GET() {
  try {
    const { strategies } = await getMnqAnalyticsSnapshot();
    return NextResponse.json({ success: true, data: { strategies } });
  } catch (error) {
    console.error("[GET /api/analytics/strategies]", error);
    return NextResponse.json(
      { success: false, error: "MNQ 策略统计失败" },
      { status: 500 },
    );
  }
}
