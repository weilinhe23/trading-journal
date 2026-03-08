import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// GET /api/sessions — 返回所有有记录的日期（用于日历高亮）
export async function GET() {
  try {
    const sessions = await prisma.dailySession.findMany({
      select: {
        date: true,
        _count: {
          select: { setups: true },
        },
      },
      orderBy: { date: "desc" },
    })

    const data = sessions.map((s) => ({
      date: s.date.toISOString().split("T")[0], // YYYY-MM-DD
      setupCount: s._count.setups,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[GET /api/sessions]", error)
    return NextResponse.json(
      { success: false, error: "获取日历数据失败" },
      { status: 500 },
    )
  }
}
