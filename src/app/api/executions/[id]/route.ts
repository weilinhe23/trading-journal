import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"
import { calculatePnL } from "~/lib/pnl"

const UpdateExecutionSchema = z.object({
  exitPrice: z.number().positive().optional(),
  exitTime: z.string().optional(),
  commission: z.number().min(0).optional(),
  entryConditionMet: z.boolean().optional(),
  entryConditionNotes: z.string().optional(),
  exitConditionMet: z.boolean().optional(),
  exitConditionNotes: z.string().optional(),
  executionGrade: z.enum(["A", "B", "C", "D"]).optional(),
  executionNotes: z.string().optional(),
})

// PUT /api/executions/[id] — 更新执行记录（主要用于补录出场价）
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

  const parsed = UpdateExecutionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  // 若传入了出场价，重新计算盈亏
  let pnl: number | undefined
  if (parsed.data.exitPrice !== undefined) {
    const existing = await prisma.execution.findUnique({
      where: { id },
      include: { setup: { select: { direction: true } } },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: "执行记录不存在" }, { status: 404 })
    }
    pnl = calculatePnL(
      existing.setup.direction as "LONG" | "SHORT",
      existing.entryPrice,
      parsed.data.exitPrice,
      existing.quantity,
      parsed.data.commission ?? existing.commission,
    )
  }

  try {
    const execution = await prisma.execution.update({
      where: { id },
      data: {
        ...parsed.data,
        exitTime: parsed.data.exitTime ? new Date(parsed.data.exitTime) : undefined,
        ...(pnl !== undefined && { pnl }),
      },
    })
    return NextResponse.json({ success: true, data: execution })
  } catch (error) {
    console.error("[PUT /api/executions/[id]]", error)
    return NextResponse.json({ success: false, error: "更新执行记录失败" }, { status: 500 })
  }
}

// DELETE /api/executions/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    await prisma.execution.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/executions/[id]]", error)
    return NextResponse.json({ success: false, error: "删除执行记录失败" }, { status: 500 })
  }
}
