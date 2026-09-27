import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getTradingGrowthProgress,
  TradingGrowthConflictError,
  updateTradingGrowthProgress,
} from "~/lib/trading-growth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: await getTradingGrowthProgress(),
  });
}

const updateSchema = z
  .object({
    action: z.enum(["complete", "undo"]),
    revision: z.number().int().nonnegative(),
  })
  .strict();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "请求体不是合法 JSON" },
      { status: 400 },
    );
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "计划操作无效，请刷新后重试。" },
      { status: 400 },
    );
  }

  try {
    const data = await updateTradingGrowthProgress(
      parsed.data.action,
      parsed.data.revision,
    );
    revalidatePath("/");
    revalidatePath("/kpi/growth");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof TradingGrowthConflictError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          data: await getTradingGrowthProgress(),
        },
        { status: 409 },
      );
    }
    console.error("Failed to update trading growth progress", error);
    return NextResponse.json(
      { success: false, error: "保存失败，请重试。" },
      { status: 500 },
    );
  }
}
