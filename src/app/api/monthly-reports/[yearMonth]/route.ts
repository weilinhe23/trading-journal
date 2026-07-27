import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

function isValidYearMonth(s: string): boolean {
  const m = /^(\d{4})-(\d{2})$/.exec(s)
  if (!m) return false
  const month = Number(m[2])
  return month >= 1 && month <= 12
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ yearMonth: string }> },
) {
  const { yearMonth } = await params
  if (!isValidYearMonth(yearMonth)) {
    return NextResponse.json({ success: false, error: "格式无效，应为 YYYY-MM" }, { status: 400 })
  }

  const report = await prisma.monthlyReport.findUnique({ where: { yearMonth } })
  return NextResponse.json({ success: true, data: report })
}

const UpdateSchema = z.object({
  monthInsight: z.string().nullable().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ yearMonth: string }> },
) {
  const { yearMonth } = await params
  if (!isValidYearMonth(yearMonth)) {
    return NextResponse.json({ success: false, error: "格式无效，应为 YYYY-MM" }, { status: 400 })
  }

  const body = await req.json() as unknown
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "数据格式无效" }, { status: 400 })
  }

  try {
    const report = await prisma.monthlyReport.upsert({
      where: { yearMonth },
      create: { yearMonth, ...parsed.data },
      update: parsed.data,
    })
    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error("[PUT /api/monthly-reports/[yearMonth]]", error)
    return NextResponse.json({ success: false, error: "保存失败" }, { status: 500 })
  }
}
