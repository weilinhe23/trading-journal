import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "~/lib/prisma"

const MissSchema = z.object({
  missedReason: z.enum([
    "HESITATION", "NO_CLEAR_SIGNAL", "DISTRACTED", "ALREADY_IN_TRADE",
    "RISK_LIMIT_HIT", "SPREAD_TOO_WIDE", "NEWS_RISK", "CHANGED_ANALYSIS",
    "FEAR_OF_LOSS", "OTHER",
  ]),
  missedNotes: z.string().optional(),
  missedHypoPnL: z.number().optional(),
})

// POST /api/sessions/[date]/setups/[id]/miss
export async function POST(
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

  const parsed = MissSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0]?.message ?? "参数错误" },
      { status: 400 },
    )
  }

  try {
    const setup = await prisma.tradeSetup.update({
      where: { id },
      data: { status: "MISSED", ...parsed.data },
    })
    return NextResponse.json({ success: true, data: setup })
  } catch (error) {
    console.error("[POST /api/setups/[id]/miss]", error)
    return NextResponse.json({ success: false, error: "标记错过失败" }, { status: 500 })
  }
}
