import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"
import { calculatePnL } from "~/lib/pnl"

const CreateExecutionSchema = z.object({
  setupId: z.string().min(1),
  actualDirection: z.enum(["LONG", "SHORT"]).optional(),
  entryPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  entryTime: z.string().datetime().or(z.string().min(1)), // ISO string
  exitPrice: z.number().positive().optional(),
  exitTime: z.string().optional(),
  commission: z.number().min(0).default(0),
  entryConditionMet: z.boolean().optional(),
  entryConditionNotes: z.string().optional(),
  exitConditionMet: z.boolean().optional(),
  exitConditionNotes: z.string().optional(),
  executionNotes: z.string().optional(),
})

// POST /api/executions — 创建执行记录，自动计算盈亏，并将 Setup 状态改为 EXECUTED
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "请求体不是合法 JSON" }, { status: 400 })
  }

  const parsed = CreateExecutionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  const {
    setupId, actualDirection, entryPrice, quantity, entryTime,
    exitPrice, exitTime, commission,
    entryConditionMet, entryConditionNotes,
    exitConditionMet, exitConditionNotes,
    executionNotes,
  } = parsed.data

  // 获取 setup 方向，用于盈亏计算（actualDirection 优先）
  const setup = await prisma.tradeSetup.findUnique({
    where: { id: setupId },
    select: { direction: true },
  })
  if (!setup) {
    return NextResponse.json({ success: false, error: "Setup 不存在" }, { status: 404 })
  }

  // 实际方向：优先使用 actualDirection，其次使用 setup 方向（TBD 时无法计算盈亏）
  const effectiveDirection = actualDirection ?? (setup.direction !== "TBD" ? setup.direction as "LONG" | "SHORT" : null)

  // 计算盈亏（若已有出场价且方向确定）
  let pnl: number | null = null
  if (exitPrice !== undefined && effectiveDirection) {
    pnl = calculatePnL(effectiveDirection, entryPrice, exitPrice, quantity, commission)
  }

  try {
    const [execution] = await prisma.$transaction([
      // 创建执行记录
      prisma.execution.create({
        data: {
          setupId,
          actualDirection: actualDirection ?? null,
          entryPrice,
          quantity,
          entryTime: new Date(entryTime),
          exitPrice: exitPrice ?? null,
          exitTime: exitTime ? new Date(exitTime) : null,
          commission,
          pnl,
          entryConditionMet: entryConditionMet ?? null,
          entryConditionNotes: entryConditionNotes ?? null,
          exitConditionMet: exitConditionMet ?? null,
          exitConditionNotes: exitConditionNotes ?? null,
          executionNotes: executionNotes ?? null,
        },
      }),
      // 同步将 Setup 状态改为 EXECUTED
      prisma.tradeSetup.update({
        where: { id: setupId },
        data: { status: "EXECUTED" },
      }),
    ])

    return NextResponse.json({ success: true, data: execution }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/executions]", error)
    return NextResponse.json({ success: false, error: "创建执行记录失败" }, { status: 500 })
  }
}
