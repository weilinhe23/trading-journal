import { type NextRequest, NextResponse } from "next/server"
import { fetchExecutionRows } from "~/lib/execution-aggregator"

function csvEscape(val: string | number | boolean | null | undefined): string {
  const s = val === null || val === undefined ? "" : String(val)
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

// GET /api/analytics/executions/export
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

    const dirLabel  = (d: string) => d === "LONG" ? "做多" : d === "SHORT" ? "做空" : "—"
    const boolLabel = (b: boolean | null) => b === null ? "" : b ? "是" : "否"
    const accLabel  = (a: string | null)  => a === "CORRECT" ? "正确" : a === "WRONG" ? "有误" : ""

    const header = [
      "来源", "日期", "周起始", "标的", "方向", "策略", "交易类型", "时段",
      "入场价", "出场价", "数量", "盈亏",
      "入场条件满足", "出场条件满足", "入场准确性", "出场准确性", "执行评分",
    ]

    const dataRows = rows.map((r) => [
      r.source === "MNQ" ? "MNQ期货" : "股票",
      r.date,
      r.weekStart,
      r.symbol,
      dirLabel(r.direction),
      r.strategy ?? "",
      r.tradeTypeName ?? "",
      r.segment ?? "",
      r.entryPrice,
      r.exitPrice ?? "",
      r.quantity,
      r.pnl ?? "持仓中",
      boolLabel(r.entryConditionMet),
      boolLabel(r.exitConditionMet),
      accLabel(r.entryAccuracy),
      accLabel(r.exitAccuracy),
      r.executionGrade ?? "",
    ])

    const allRows = [header, ...dataRows]
    const csv = "﻿" + allRows.map((row) => row.map(csvEscape).join(",")).join("\r\n")

    const today = new Date().toISOString().split("T")[0]!
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="executions-${today}.csv"`,
      },
    })
  } catch (error) {
    console.error("[GET /api/analytics/executions/export]", error)
    return NextResponse.json({ success: false, error: "导出失败" }, { status: 500 })
  }
}
