import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

// 默认错过原因（首次使用时自动写入）
const DEFAULT_REASONS = [
  "犹豫，不确定",
  "等待的信号没出现",
  "走神 / 错过时间窗口",
  "当时已有其他持仓",
  "当日亏损到上限",
  "价差不合适",
  "有未知新闻风险",
  "重新分析后放弃",
  "近期亏损带来的恐惧",
  "其他",
]

// GET /api/missed-reasons
export async function GET() {
  try {
    let options = await prisma.missedReasonOption.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })

    // 首次使用时自动写入默认选项
    if (options.length === 0) {
      await prisma.missedReasonOption.createMany({
        data: DEFAULT_REASONS.map((label, i) => ({ label, sortOrder: i })),
      })
      options = await prisma.missedReasonOption.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      })
    }

    return NextResponse.json({ success: true, data: options })
  } catch (error) {
    console.error("[GET /api/missed-reasons]", error)
    return NextResponse.json({ success: false, error: "获取错过原因失败" }, { status: 500 })
  }
}

const CreateSchema = z.object({
  label: z.string().min(1, "原因描述不能为空").max(50, "原因描述过长"),
})

// POST /api/missed-reasons
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "请求体不是合法 JSON" }, { status: 400 })
  }

  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    const maxOrder = await prisma.missedReasonOption.aggregate({ _max: { sortOrder: true } })
    const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1

    const option = await prisma.missedReasonOption.create({
      data: { label: parsed.data.label, sortOrder: nextOrder },
    })
    return NextResponse.json({ success: true, data: option }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/missed-reasons]", error)
    return NextResponse.json({ success: false, error: "创建失败" }, { status: 500 })
  }
}
