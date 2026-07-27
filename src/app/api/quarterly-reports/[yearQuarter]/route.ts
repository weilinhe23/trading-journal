import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

function isValidYearQuarter(s: string): boolean {
  return /^\d{4}-Q[1-4]$/.test(s)
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ yearQuarter: string }> },
) {
  const { yearQuarter } = await params
  if (!isValidYearQuarter(yearQuarter)) {
    return NextResponse.json({ success: false, error: "格式无效，应为 YYYY-Q[1-4]" }, { status: 400 })
  }
  const report = await prisma.quarterlyReport.findUnique({ where: { yearQuarter } })
  return NextResponse.json({ success: true, data: report })
}

const UpdateSchema = z.object({
  quarterInsight: z.string().nullable().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ yearQuarter: string }> },
) {
  const { yearQuarter } = await params
  if (!isValidYearQuarter(yearQuarter)) {
    return NextResponse.json({ success: false, error: "格式无效，应为 YYYY-Q[1-4]" }, { status: 400 })
  }

  const body = await req.json() as unknown
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "数据格式无效" }, { status: 400 })
  }

  try {
    const report = await prisma.quarterlyReport.upsert({
      where: { yearQuarter },
      create: { yearQuarter, ...parsed.data },
      update: parsed.data,
    })
    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error("[PUT /api/quarterly-reports/[yearQuarter]]", error)
    return NextResponse.json({ success: false, error: "保存失败" }, { status: 500 })
  }
}
