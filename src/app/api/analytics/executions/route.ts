import { type NextRequest, NextResponse } from "next/server"
import { fetchExecutionRows, computeSummary, computeCharts } from "~/lib/execution-aggregator"

// GET /api/analytics/executions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const rows = await fetchExecutionRows({
      dateFrom:  searchParams.get("dateFrom"),
      dateTo:    searchParams.get("dateTo"),
      symbol:    searchParams.get("symbol"),
      strategy:  searchParams.get("strategy"),
      direction: searchParams.get("direction"),
      result:    searchParams.get("result"),
      source:    searchParams.get("source"),
    })

    return NextResponse.json({
      success: true,
      data: {
        executions: rows,
        summary:    computeSummary(rows),
        charts:     computeCharts(rows),
      },
    })
  } catch (error) {
    console.error("[GET /api/analytics/executions]", error)
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 })
  }
}
