import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getActiveKpiTargets } from "~/lib/kpi-server";
import { getEtDateString, parseUtcTradingDate } from "~/lib/kpi";
import { prisma } from "~/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dateString = url.searchParams.get("date") ?? getEtDateString();
  if (!parseUtcTradingDate(dateString)) {
    return NextResponse.json(
      { success: false, error: "日期格式错误，应为 YYYY-MM-DD" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: await getActiveKpiTargets(dateString),
  });
}

const UpdateTargetSchema = z
  .object({
    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dailyBaseline: z.number().finite().positive(),
    dailyOptimistic: z.number().finite().positive(),
  })
  .refine((value) => value.dailyOptimistic >= value.dailyBaseline, {
    message: "乐观目标不能低于基准目标",
    path: ["dailyOptimistic"],
  });

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "请求体不是合法 JSON" },
      { status: 400 },
    );
  }

  const parsed = UpdateTargetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "目标数据无效",
      },
      { status: 400 },
    );
  }

  const effectiveFrom = parseUtcTradingDate(parsed.data.effectiveFrom);
  if (!effectiveFrom) {
    return NextResponse.json(
      { success: false, error: "生效日期无效" },
      { status: 400 },
    );
  }

  const target = await prisma.kpiTargetSetting.upsert({
    where: { effectiveFrom },
    create: {
      effectiveFrom,
      dailyBaseline: parsed.data.dailyBaseline,
      dailyOptimistic: parsed.data.dailyOptimistic,
    },
    update: {
      dailyBaseline: parsed.data.dailyBaseline,
      dailyOptimistic: parsed.data.dailyOptimistic,
    },
  });

  revalidatePath("/kpi");
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    data: {
      effectiveFrom: target.effectiveFrom.toISOString().slice(0, 10),
      dailyBaseline: target.dailyBaseline,
      dailyOptimistic: target.dailyOptimistic,
    },
  });
}
