import { NextResponse } from "next/server";
import {
  KpiQueryError,
  parseAnalysisQuery,
  queryKpiAnalysis,
} from "~/lib/kpi-comparison-server";

export async function GET(request: Request) {
  try {
    const query = parseAnalysisQuery(
      new URL(request.url).searchParams,
      "trends",
    );
    return NextResponse.json({
      success: true,
      data: await queryKpiAnalysis(query),
    });
  } catch (error) {
    if (error instanceof KpiQueryError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    console.error("KPI trends query failed", error);
    return NextResponse.json(
      { success: false, error: "查询趋势失败，请重试" },
      { status: 500 },
    );
  }
}
