import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { aggregateWeeklyMnq } from "~/lib/weekly-mnq-analysis";

function parseWeekStart(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: weekStartValue } = await params;
  const weekStart = parseWeekStart(weekStartValue);
  if (!weekStart) {
    return NextResponse.json(
      { success: false, error: "日期格式无效" },
      { status: 400 },
    );
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 4);
  weekEnd.setUTCHours(23, 59, 59, 999);

  const [report, sessions] = await Promise.all([
    prisma.weeklyReport.findUnique({ where: { weekStart } }),
    prisma.dailySession.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      select: {
        date: true,
        lessonsLearned: true,
        whatWentWell: true,
        planFollowed: true,
        emotionRating: true,
        focusRating: true,
        mnqPlan: true,
      },
    }),
  ]);
  const analysis = aggregateWeeklyMnq(sessions);

  return NextResponse.json({
    success: true,
    data: {
      report,
      stats: analysis.stats,
      completeness: analysis.completeness,
      dailyBreakdown: analysis.days,
      diagnostics: {
        deviationReasons: analysis.deviationReasons,
        opportunityImpacts: analysis.opportunityImpacts,
        impactTypes: analysis.impactTypes,
        missedReasons: analysis.missedReasons,
      },
      mnqStats: {
        totalPnL: analysis.stats.totalPnL,
        tradeCount: analysis.stats.executedCount,
        winCount: analysis.stats.winCount,
        missedCount: analysis.stats.missedCount,
        totalRealizedR: analysis.stats.totalRealizedR,
        missedPotentialR: analysis.stats.missedPotentialR,
        timeframeStats: analysis.timeframeStats,
      },
    },
  });
}

const UpdateSchema = z.object({
  summary: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  keyLessons: z.string().optional(),
  nextWeekPlan: z.string().optional(),
  overallRating: z.number().int().min(1).max(5).nullable().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ weekStart: string }> },
) {
  const { weekStart: weekStartValue } = await params;
  const weekStart = parseWeekStart(weekStartValue);
  if (!weekStart) {
    return NextResponse.json(
      { success: false, error: "日期格式无效" },
      { status: 400 },
    );
  }

  const parsed = UpdateSchema.safeParse((await request.json()) as unknown);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "数据格式无效" },
      { status: 400 },
    );
  }

  try {
    const report = await prisma.weeklyReport.upsert({
      where: { weekStart },
      create: { weekStart, ...parsed.data },
      update: parsed.data,
    });
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("[PUT /api/weekly-reports/[weekStart]]", error);
    return NextResponse.json(
      { success: false, error: "保存失败" },
      { status: 500 },
    );
  }
}
