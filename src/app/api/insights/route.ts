import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createInsight,
  getInsightLibrary,
  InsightConflictError,
} from "~/lib/insights-server";

const InsightCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().max(5000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  sourceId: z.string().cuid().optional(),
});

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: await getInsightLibrary(),
    });
  } catch (error) {
    console.error("[GET /api/insights]", error);
    return NextResponse.json(
      { success: false, error: "读取经验库失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = InsightCreateSchema.safeParse(
    (await request.json()) as unknown,
  );
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "经验内容格式无效" },
      { status: 400 },
    );
  try {
    return NextResponse.json(
      { success: true, data: await createInsight(parsed.data) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof InsightConflictError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 },
      );
    console.error("[POST /api/insights]", error);
    return NextResponse.json(
      { success: false, error: "创建经验失败" },
      { status: 500 },
    );
  }
}
