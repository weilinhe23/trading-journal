import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

function parseDateParam(dateStr: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr)
  if (!match) return null
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

// GET /api/sessions/[date]/setups
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateParam } = await params
  const date = parseDateParam(dateParam)
  if (!date) {
    return NextResponse.json({ success: false, error: "日期格式错误" }, { status: 400 })
  }

  try {
    const setups = await prisma.tradeSetup.findMany({
      where: { sessionDate: date },
      orderBy: { createdAt: "asc" },
      include: { executions: true, screenshots: true, newsEvents: true },
    })
    return NextResponse.json({ success: true, data: setups })
  } catch (error) {
    console.error("[GET /api/sessions/[date]/setups]", error)
    return NextResponse.json({ success: false, error: "获取 Setup 失败" }, { status: 500 })
  }
}

const CreateSetupSchema = z.object({
  symbol: z.string().min(1, "标的不能为空").toUpperCase(),
  direction: z.enum(["LONG", "SHORT", "TBD"]),
  priceTier: z.enum(["BELOW_2", "BETWEEN_2_20", "ABOVE_20"]).optional(),
  marketCapTier: z.enum(["BELOW_300M", "BETWEEN_300M_2B", "BETWEEN_2B_10B", "ABOVE_10B"]).optional(),
  strategy: z.string().min(1).optional(),
  strategyId: z.string().optional(),
  setupLogic: z.string().optional(),
  entryCondition: z.string().optional(),
  entryPriceNote: z.string().optional(),
  stopCondition: z.string().optional(),
  stopPriceNote: z.string().optional(),
  target1Condition: z.string().optional(),
  target1PriceNote: z.string().optional(),
  target2Condition: z.string().optional(),
  target2PriceNote: z.string().optional(),
  plannedRiskReward: z.number().positive().optional(),
  plannedSize: z.number().int().positive().optional(),
  newsType: z.enum(["EARNINGS", "FED", "MACRO", "SECTOR", "COMPANY", "TECHNICAL"]).optional(),
  newsImpact: z.enum(["BULLISH", "BEARISH", "NEUTRAL", "UNCERTAIN"]).optional(),
  newsHeadline: z.string().optional(),
})

// POST /api/sessions/[date]/setups
export async function POST(
  req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateParam } = await params
  const date = parseDateParam(dateParam)
  if (!date) {
    return NextResponse.json({ success: false, error: "日期格式错误" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "请求体不是合法 JSON" }, { status: 400 })
  }

  const parsed = CreateSetupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    // 确保 Session 存在
    await prisma.dailySession.upsert({
      where: { date },
      create: { date },
      update: {},
    })

    const setup = await prisma.tradeSetup.create({
      data: { sessionDate: date, ...parsed.data },
      include: { executions: true, screenshots: true },
    })

    return NextResponse.json({ success: true, data: setup }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/sessions/[date]/setups]", error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? msg : "创建 Setup 失败" }, { status: 500 })
  }
}
