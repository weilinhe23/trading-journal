import { NextResponse } from "next/server";
import { getEtDateString, isKpiPeriod, parseUtcTradingDate } from "~/lib/kpi";
import { getKpiPeriodSummary } from "~/lib/kpi-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const periodValue = url.searchParams.get("period") ?? "week";
  const date = url.searchParams.get("date") ?? getEtDateString();

  if (!isKpiPeriod(periodValue) || !parseUtcTradingDate(date)) {
    return NextResponse.json(
      { success: false, error: "周期或日期参数无效" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: await getKpiPeriodSummary(periodValue, date),
  });
}
