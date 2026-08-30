import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/lib/prisma";
import { parseUtcTradingDate } from "~/lib/kpi";
import { getWeeklyInsightSources } from "~/lib/insights-server";

const QuerySchema = z.object({
  weekStart: z.string().optional(),
  state: z.enum(["PENDING", "LINKED", "IGNORED"]).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "查询参数无效" },
      { status: 400 },
    );
  if (parsed.data.weekStart) {
    const weekStart = parseUtcTradingDate(parsed.data.weekStart);
    if (!weekStart)
      return NextResponse.json(
        { success: false, error: "日期格式无效" },
        { status: 400 },
      );
    return NextResponse.json({
      success: true,
      data: await getWeeklyInsightSources(weekStart),
    });
  }
  const records = await prisma.insightSource.findMany({
    where: parsed.data.state ? { state: parsed.data.state } : undefined,
    orderBy: [{ weekStart: "desc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json({ success: true, data: records });
}
