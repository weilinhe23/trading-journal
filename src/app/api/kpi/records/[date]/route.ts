import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isUsMarketTradingDay, parseUtcTradingDate } from "~/lib/kpi";
import { prisma } from "~/lib/prisma";

function parseDate(value: string) {
  const date = parseUtcTradingDate(value);
  return date && isUsMarketTradingDay(date) ? date : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateString } = await params;
  const date = parseUtcTradingDate(dateString);
  if (!date) {
    return NextResponse.json(
      { success: false, error: "日期格式错误，应为 YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const record = await prisma.kpiDailyRecord.findUnique({ where: { date } });
  return NextResponse.json({
    success: true,
    isTradingDay: isUsMarketTradingDay(date),
    data: record
      ? {
          date: dateString,
          actualPcts: record.actualPcts,
          note: record.note,
        }
      : null,
  });
}

const UpdateRecordSchema = z.object({
  actualPcts: z.number().finite(),
  note: z.string().max(500).nullable().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateString } = await params;
  const date = parseDate(dateString);
  if (!date) {
    return NextResponse.json(
      { success: false, error: "只能记录美股交易日" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "请求体不是合法 JSON" },
      { status: 400 },
    );
  }

  const parsed = UpdateRecordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "记录数据无效",
      },
      { status: 400 },
    );
  }

  const record = await prisma.kpiDailyRecord.upsert({
    where: { date },
    create: {
      date,
      actualPcts: parsed.data.actualPcts,
      note: parsed.data.note ?? null,
    },
    update: {
      actualPcts: parsed.data.actualPcts,
      note: parsed.data.note ?? null,
    },
  });

  revalidatePath("/kpi");
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    data: {
      date: dateString,
      actualPcts: record.actualPcts,
      note: record.note,
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateString } = await params;
  const date = parseUtcTradingDate(dateString);
  if (!date) {
    return NextResponse.json(
      { success: false, error: "日期格式错误，应为 YYYY-MM-DD" },
      { status: 400 },
    );
  }

  await prisma.kpiDailyRecord.deleteMany({ where: { date } });
  revalidatePath("/kpi");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
