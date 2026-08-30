import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { parseUtcTradingDate } from "~/lib/kpi";
import {
  getWeeklyInsightSources,
  syncWeeklyInsightSources,
} from "~/lib/insights-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: value } = await params;
  const weekStart = parseUtcTradingDate(value);
  if (!weekStart)
    return NextResponse.json(
      { success: false, error: "日期格式无效" },
      { status: 400 },
    );
  try {
    return NextResponse.json({
      success: true,
      data: await getWeeklyInsightSources(weekStart),
    });
  } catch (error) {
    console.error("[GET /api/weekly-reports/[weekStart]/insights]", error);
    return NextResponse.json(
      { success: false, error: "读取本周经验失败" },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: value } = await params;
  const weekStart = parseUtcTradingDate(value);
  if (!weekStart)
    return NextResponse.json(
      { success: false, error: "日期格式无效" },
      { status: 400 },
    );
  const report = await prisma.weeklyReport.findUnique({
    where: { weekStart },
    select: { keyLessons: true },
  });
  if (!report)
    return NextResponse.json(
      { success: false, error: "周报不存在" },
      { status: 404 },
    );
  try {
    return NextResponse.json({
      success: true,
      data: await syncWeeklyInsightSources(weekStart, report.keyLessons),
    });
  } catch (error) {
    console.error("[POST /api/weekly-reports/[weekStart]/insights]", error);
    return NextResponse.json(
      { success: false, error: "同步本周经验失败" },
      { status: 500 },
    );
  }
}
