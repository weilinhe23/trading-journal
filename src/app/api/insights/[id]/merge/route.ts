import { NextResponse } from "next/server";
import { z } from "zod";
import {
  InsightConflictError,
  InsightNotFoundError,
  mergeInsights,
} from "~/lib/insights-server";

const MergeSchema = z.object({
  targetId: z.string().cuid(),
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().max(5000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = MergeSchema.safeParse((await request.json()) as unknown);
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "合并内容格式无效" },
      { status: 400 },
    );
  const { id } = await params;
  const { targetId, ...resolved } = parsed.data;
  try {
    return NextResponse.json({
      success: true,
      data: await mergeInsights(id, targetId, resolved),
    });
  } catch (error) {
    if (error instanceof InsightNotFoundError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 },
      );
    if (error instanceof InsightConflictError)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 },
      );
    console.error("[POST /api/insights/[id]/merge]", error);
    return NextResponse.json(
      { success: false, error: "合并经验失败" },
      { status: 500 },
    );
  }
}
