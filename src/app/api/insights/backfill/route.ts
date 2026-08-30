import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { splitInsightLines } from "~/lib/insights";
import { syncWeeklyInsightSources } from "~/lib/insights-server";

const BackfillSchema = z.object({ dryRun: z.boolean().default(true) });

export async function POST(request: Request) {
  const parsed = BackfillSchema.safeParse((await request.json()) as unknown);
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "回填参数无效" },
      { status: 400 },
    );
  const reports = await prisma.weeklyReport.findMany({
    where: { keyLessons: { not: null } },
    select: { weekStart: true, keyLessons: true },
    orderBy: { weekStart: "asc" },
  });
  const eligible = reports.filter(
    (report) => splitInsightLines(report.keyLessons).length > 0,
  );
  if (parsed.data.dryRun) {
    return NextResponse.json({
      success: true,
      data: {
        dryRun: true,
        reportCount: eligible.length,
        sourceCount: eligible.reduce(
          (sum, report) => sum + splitInsightLines(report.keyLessons).length,
          0,
        ),
      },
    });
  }

  const failures: Array<{ weekStart: string; error: string }> = [];
  let sourceCount = 0;
  for (const report of eligible) {
    try {
      const result = await syncWeeklyInsightSources(
        report.weekStart,
        report.keyLessons,
      );
      sourceCount += result.total;
    } catch (error) {
      failures.push({
        weekStart: report.weekStart.toISOString().slice(0, 10),
        error: error instanceof Error ? error.message : "未知错误",
      });
    }
  }
  return NextResponse.json({
    success: failures.length === 0,
    data: {
      dryRun: false,
      reportCount: eligible.length,
      sourceCount,
      failures,
    },
  });
}
