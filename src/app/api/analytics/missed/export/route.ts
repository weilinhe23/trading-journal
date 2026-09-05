import { type NextRequest, NextResponse } from "next/server";
import { fetchMissedOpportunityRows } from "~/lib/missed-opportunity-aggregator";
import { missedReasonLabel } from "~/lib/mnq-analytics";
import { MNQ_DECISION_TIMEFRAME_LABELS } from "~/types";

function csvEscape(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function directionLabel(direction: "LONG" | "SHORT" | null): string {
  return direction === "LONG" ? "做多" : direction === "SHORT" ? "做空" : "";
}

function categoryLabel(value: string | null): string {
  const normalized = value?.trim();
  return normalized?.length ? normalized : "未分类";
}

// GET /api/analytics/missed/export
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rows = await fetchMissedOpportunityRows({
      dateFrom: searchParams.get("dateFrom"),
      dateTo: searchParams.get("dateTo"),
      strategy: searchParams.get("strategy"),
      tradeType: searchParams.get("tradeType"),
      reason: searchParams.get("reason"),
    });

    const header = [
      "日期",
      "方向",
      "策略",
      "交易类型",
      "时段",
      "交易机会",
      "错过原因",
      "错过经过",
      "决策周期",
      "进入方式",
      "计划风险点数",
      "计划目标R",
      "事后风险点数",
      "事后回报点数",
      "事后回报R",
    ];

    const dataRows = rows.map((row) => [
      row.date,
      directionLabel(row.direction),
      categoryLabel(row.strategy),
      categoryLabel(row.tradeType),
      row.segment,
      row.description,
      missedReasonLabel(row.missedReasonCategory ?? "UNCLASSIFIED"),
      row.missedProcess,
      row.decisionTimeframe
        ? MNQ_DECISION_TIMEFRAME_LABELS[row.decisionTimeframe]
        : "",
      row.entryApproach === "DIRECT"
        ? "直接进入"
        : row.entryApproach === "PULLBACK"
          ? "等待回调"
          : "",
      row.plannedRiskPts,
      row.plannedTargetR,
      row.missedRiskPts,
      row.missedReturnPts,
      row.hypotheticalR,
    ]);

    const csv =
      "\uFEFF" +
      [header, ...dataRows]
        .map((row) => row.map(csvEscape).join(","))
        .join("\r\n");
    const today = new Date().toISOString().split("T")[0]!;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="mnq-missed-opportunities-${today}.csv"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics/missed/export]", error);
    return NextResponse.json(
      { success: false, error: "导出失败" },
      { status: 500 },
    );
  }
}
