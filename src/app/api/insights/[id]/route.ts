import { NextResponse } from "next/server";
import { z } from "zod";
import { InsightNotFoundError, updateInsight } from "~/lib/insights-server";

const InsightUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    content: z.string().max(5000).nullable().optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
    isPinned: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = InsightUpdateSchema.safeParse(
    (await request.json()) as unknown,
  );
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "更新内容格式无效" },
      { status: 400 },
    );
  const { id } = await params;
  try {
    return NextResponse.json({
      success: true,
      data: await updateInsight(id, parsed.data),
    });
  } catch (error) {
    if (error instanceof InsightNotFoundError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 },
      );
    console.error("[PATCH /api/insights/[id]]", error);
    return NextResponse.json(
      { success: false, error: "更新经验失败" },
      { status: 500 },
    );
  }
}
