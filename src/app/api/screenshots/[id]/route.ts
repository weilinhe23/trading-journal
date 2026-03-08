import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"
import { deleteFile } from "~/lib/upload"

const CHART_TAGS = [
  "PRE_MARKET_PLAN",
  "ENTRY_SIGNAL",
  "EXIT_SIGNAL",
  "MISSED_SIGNAL",
  "POST_REVIEW",
  "MARKET_OVERVIEW",
] as const

const UpdateSchema = z.object({
  caption: z.string().optional(),
  timeframe: z.string().optional(),
  chartTag: z.enum(CHART_TAGS).nullable().optional(),
  // Assignment: pass setupId OR executionId (or null to unassign)
  setupId: z.string().nullable().optional(),
  executionId: z.string().nullable().optional(),
})

// PUT /api/screenshots/[id] — update metadata / assignment
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "请求体不是合法 JSON" }, { status: 400 })
  }

  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    const screenshot = await prisma.screenshot.update({
      where: { id },
      data: parsed.data,
    })
    return NextResponse.json({ success: true, data: screenshot })
  } catch (error) {
    console.error("[PUT /api/screenshots/[id]]", error)
    return NextResponse.json({ success: false, error: "更新截图失败" }, { status: 500 })
  }
}

// DELETE /api/screenshots/[id] — delete DB record + physical file
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const screenshot = await prisma.screenshot.findUnique({ where: { id } })
    if (!screenshot) {
      return NextResponse.json({ success: false, error: "截图不存在" }, { status: 404 })
    }

    await prisma.screenshot.delete({ where: { id } })
    await deleteFile(screenshot.filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/screenshots/[id]]", error)
    return NextResponse.json({ success: false, error: "删除截图失败" }, { status: 500 })
  }
}
