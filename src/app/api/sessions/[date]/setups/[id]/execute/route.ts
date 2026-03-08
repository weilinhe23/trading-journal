import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// POST /api/sessions/[date]/setups/[id]/execute
// 将 Setup 标记为已执行，状态改为 EXECUTED
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const setup = await prisma.tradeSetup.update({
      where: { id },
      data: { status: "EXECUTED" },
    })
    return NextResponse.json({ success: true, data: setup })
  } catch (error) {
    console.error("[POST /api/setups/[id]/execute]", error)
    return NextResponse.json({ success: false, error: "标记执行失败" }, { status: 500 })
  }
}
