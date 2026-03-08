import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

// 将 YYYY-MM-DD 转为 UTC 00:00:00 的 Date 对象
function parseDateParam(dateStr: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr)
  if (!match) return null
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

// GET /api/sessions/[date] — 获取（或自动创建）某天的 Session
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateParam } = await params
  const date = parseDateParam(dateParam)
  if (!date) {
    return NextResponse.json(
      { success: false, error: "日期格式错误，应为 YYYY-MM-DD" },
      { status: 400 },
    )
  }

  try {
    // upsert：不存在则自动创建
    const session = await prisma.dailySession.upsert({
      where: { date },
      create: { date },
      update: {},
      include: {
        newsEvents: { orderBy: { createdAt: "asc" } },
        setups: {
          orderBy: { createdAt: "asc" },
          include: {
            executions: true,
            screenshots: true,
          },
        },
        screenshots: true,
      },
    })

    return NextResponse.json({ success: true, data: session })
  } catch (error) {
    console.error("[GET /api/sessions/[date]]", error)
    return NextResponse.json(
      { success: false, error: "获取日志失败" },
      { status: 500 },
    )
  }
}

const UpdateSessionSchema = z.object({
  marketContext: z.string().optional(),
  preMarketPlan: z.string().optional(),
  selectedStrategy: z.string().optional(), // JSON array string
  postReview: z.string().optional(),
  lessonsLearned: z.string().optional(),
  whatWentWell: z.string().optional(),
  planFollowed: z.number().int().min(1).max(5).optional(),
  emotionRating: z.number().int().min(1).max(5).optional(),
  focusRating: z.number().int().min(1).max(5).optional(),
})

// PUT /api/sessions/[date] — 更新 Session 字段
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date: dateParam } = await params
  const date = parseDateParam(dateParam)
  if (!date) {
    return NextResponse.json(
      { success: false, error: "日期格式错误，应为 YYYY-MM-DD" },
      { status: 400 },
    )
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

  const parsed = UpdateSessionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.message },
      { status: 400 },
    )
  }

  try {
    const session = await prisma.dailySession.upsert({
      where: { date },
      create: { date, ...parsed.data },
      update: parsed.data,
    })

    return NextResponse.json({ success: true, data: session })
  } catch (error) {
    console.error("[PUT /api/sessions/[date]]", error)
    return NextResponse.json(
      { success: false, error: "更新日志失败" },
      { status: 500 },
    )
  }
}
