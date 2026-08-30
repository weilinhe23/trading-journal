import { NextResponse } from "next/server";
import { z } from "zod";
import {
  InsightConflictError,
  InsightNotFoundError,
  updateInsightSource,
} from "~/lib/insights-server";

const SourceUpdateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("LINK"), insightId: z.string().cuid() }),
  z.object({ action: z.literal("IGNORE") }),
  z.object({ action: z.literal("RESTORE") }),
  z.object({ action: z.literal("UNLINK") }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = SourceUpdateSchema.safeParse(
    (await request.json()) as unknown,
  );
  if (!parsed.success)
    return NextResponse.json(
      { success: false, error: "来源操作格式无效" },
      { status: 400 },
    );
  const { id } = await params;
  try {
    return NextResponse.json({
      success: true,
      data: await updateInsightSource(
        id,
        parsed.data.action,
        "insightId" in parsed.data ? parsed.data.insightId : undefined,
      ),
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
    console.error("[PATCH /api/insight-sources/[id]]", error);
    return NextResponse.json(
      { success: false, error: "更新来源失败" },
      { status: 500 },
    );
  }
}
