import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

function parseDateParam(dateStr: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr)
  if (!match) return null
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

// GET /api/sessions/[date]/mnq-plan
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
    // 自动创建（upsert）
    const plan = await prisma.mnqDailyPlan.upsert({
      where: { sessionDate: date },
      create: { sessionDate: date },
      update: {},
    })
    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error("[GET /api/sessions/[date]/mnq-plan]", error)
    return NextResponse.json(
      { success: false, error: "获取 MNQ 计划失败" },
      { status: 500 },
    )
  }
}

const UpdateMnqPlanSchema = z.object({
  scenario: z
    .enum(["RANGE_SWEEP", "TREND_REGULAR", "TREND_GAP_FADE", "TREND_GAP_HOLD"])
    .nullable()
    .optional(),
  sweepUpBand: z.string().nullable().optional(),
  sweepDownBand: z.string().nullable().optional(),
  hasNewsGap: z.boolean().optional(),
  gapCanHold: z.boolean().optional(),
  // 震荡日识别条件
  condRangeMovingOver1h: z.boolean().optional(),
  condRangeVwapFlat: z.boolean().optional(),
  condRangeNoMajorNews: z.boolean().optional(),
  condRangePrevTrend: z.boolean().optional(),
  // 趋势日 A 识别条件
  condTrendSingleDir: z.boolean().optional(),
  condTrendVwapTilted: z.boolean().optional(),
  // 趋势日 B 识别条件
  condFadeNewsWeak: z.boolean().optional(),
  // 趋势日 C 识别条件
  condHoldNewsReal: z.boolean().optional(),
  // 盘中评估（null = 未评估）
  evalRangeMovingOver1h: z.boolean().nullable().optional(),
  evalRangeVwapFlat:     z.boolean().nullable().optional(),
  evalRangeNoMajorNews:  z.boolean().nullable().optional(),
  evalRangePrevTrend:    z.boolean().nullable().optional(),
  evalTrendSingleDir:    z.boolean().nullable().optional(),
  evalTrendVwapTilted:   z.boolean().nullable().optional(),
  evalFadeNewsWeak:      z.boolean().nullable().optional(),
  evalHoldNewsReal:      z.boolean().nullable().optional(),
  evalUpBand:            z.boolean().nullable().optional(),
  evalDownBand:          z.boolean().nullable().optional(),
  evalNotesJson:         z.string().nullable().optional(),
  customConditionsJson:  z.string().nullable().optional(),
  customBandsJson:       z.string().nullable().optional(),
  actCheckpointsJson:    z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

// PUT /api/sessions/[date]/mnq-plan
export async function PUT(
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
    return NextResponse.json(
      { success: false, error: "请求体不是合法 JSON" },
      { status: 400 },
    )
  }

  const parsed = UpdateMnqPlanSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    const plan = await prisma.mnqDailyPlan.upsert({
      where: { sessionDate: date },
      create: { sessionDate: date, ...parsed.data },
      update: parsed.data,
    })
    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error("[PUT /api/sessions/[date]/mnq-plan]", error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development" ? msg : "更新 MNQ 计划失败",
      },
      { status: 500 },
    )
  }
}
