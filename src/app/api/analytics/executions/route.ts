import { type NextRequest, NextResponse } from "next/server";
import {
  fetchExecutionRows,
  computeSummary,
  computeCharts,
  filterExecutionRows,
  buildExecutionFilterOptions,
} from "~/lib/execution-aggregator";

// GET /api/analytics/executions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const allRows = await fetchExecutionRows();
    const rows = filterExecutionRows(allRows, {
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      symbol: searchParams.get("symbol"),
      strategy: searchParams.get("strategy"),
      tradeType: searchParams.get("tradeType"),
      direction: searchParams.get("direction"),
      result: searchParams.get("result"),
    });

    return NextResponse.json({
      success: true,
      data: {
        executions: rows,
        summary: computeSummary(rows),
        charts: computeCharts(rows),
        filterOptions: buildExecutionFilterOptions(allRows),
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics/executions]", error);
    return NextResponse.json(
      { success: false, error: "查询失败" },
      { status: 500 },
    );
  }
}
