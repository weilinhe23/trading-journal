import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

const UpdateSetupSchema = z.object({
  symbol: z.string().min(1).toUpperCase().optional(),
  direction: z.enum(["LONG", "SHORT", "TBD"]).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  priceTier: z.enum(["BELOW_2", "BETWEEN_2_20", "ABOVE_20"]).nullable().optional(),
  marketCapTier: z.enum(["BELOW_300M", "BETWEEN_300M_2B", "BETWEEN_2B_10B", "ABOVE_10B"]).nullable().optional(),
  strategy: z.string().nullable().optional(),
  strategyId: z.string().nullable().optional(),
  selectedTradeTypes: z.string().optional(),
  setupLogic: z.string().optional(),
  entryCondition: z.string().optional(),
  entryPriceNote: z.string().optional(),
  entryPriceExact: z.number().optional(),
  stopCondition: z.string().optional(),
  stopPriceNote: z.string().optional(),
  stopPriceExact: z.number().optional(),
  target1Condition: z.string().optional(),
  target1PriceNote: z.string().optional(),
  target1PriceExact: z.number().optional(),
  target2Condition: z.string().optional(),
  target2PriceNote: z.string().optional(),
  target2PriceExact: z.number().optional(),
  plannedRiskReward: z.number().positive().optional(),
  plannedSize: z.number().int().positive().optional(),
  status: z.enum(["WATCHING", "EXECUTED", "MISSED", "INVALIDATED", "CANCELLED"]).optional(),
  setupGrade: z.enum(["A", "B", "C", "D"]).optional(),
  setupNotes: z.string().optional(),
  newsType: z.enum(["EARNINGS", "FED", "MACRO", "SECTOR", "COMPANY", "TECHNICAL"]).optional(),
  newsImpact: z.enum(["BULLISH", "BEARISH", "NEUTRAL", "UNCERTAIN"]).optional(),
  newsHeadline: z.string().optional(),
  // 盘中评估字段
  stockSelectionAccurate: z.boolean().nullable().optional(),
  stockSelectionNote: z.string().optional(),
  marketJudgmentAccurate: z.boolean().nullable().optional(),
  marketJudgmentNote: z.string().optional(),
  strategySelectionAccurate: z.boolean().nullable().optional(),
  strategySelectionNote: z.string().optional(),
  entryOpportunityAccurate: z.boolean().nullable().optional(),
  entryOpportunityNote: z.string().optional(),
  exitOpportunityAccurate: z.boolean().nullable().optional(),
  exitOpportunityNote: z.string().optional(),
  actualEntryOpportunity: z.string().optional(),
  actualExitOpportunity: z.string().optional(),
  dailySummary: z.string().optional(),
  chartTimeframe: z.enum(["M1", "M5", "M15", "M30", "H1", "H4", "D1"]).nullable().optional(),
})

// GET /api/sessions/[date]/setups/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const setup = await prisma.tradeSetup.findUnique({
      where: { id },
      include: { executions: true, screenshots: true, newsEvents: true },
    })
    if (!setup) {
      return NextResponse.json({ success: false, error: "Setup 不存在" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: setup })
  } catch (error) {
    console.error("[GET /api/setups/[id]]", error)
    return NextResponse.json({ success: false, error: "获取 Setup 失败" }, { status: 500 })
  }
}

// PUT /api/sessions/[date]/setups/[id]
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

  const parsed = UpdateSetupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    const setup = await prisma.tradeSetup.update({
      where: { id },
      data: parsed.data,
    })
    return NextResponse.json({ success: true, data: setup })
  } catch (error) {
    console.error("[PUT /api/setups/[id]]", error)
    return NextResponse.json({ success: false, error: "更新 Setup 失败" }, { status: 500 })
  }
}

// DELETE /api/sessions/[date]/setups/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    await prisma.tradeSetup.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/setups/[id]]", error)
    return NextResponse.json({ success: false, error: "删除 Setup 失败" }, { status: 500 })
  }
}
