import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"
import { MISSED_REASON_LABELS } from "~/types"
import type { MissedReason } from "~/types"

// GET /api/analytics/missed
export async function GET() {
  try {
    const missed = await prisma.tradeSetup.findMany({
      where: { status: "MISSED" },
      select: {
        missedReason: true,
        missedHypoPnL: true,
        symbol: true,
        strategy: true,
        sessionDate: true,
      },
    })

    // Group by reason
    const byReason = new Map<
      string,
      { count: number; hypoPnL: number; hasHypoPnL: boolean }
    >()

    for (const s of missed) {
      const key = s.missedReason ?? "OTHER"
      const existing = byReason.get(key) ?? { count: 0, hypoPnL: 0, hasHypoPnL: false }
      byReason.set(key, {
        count: existing.count + 1,
        hypoPnL: existing.hypoPnL + (s.missedHypoPnL ?? 0),
        hasHypoPnL: existing.hasHypoPnL || s.missedHypoPnL !== null,
      })
    }

    const totalHypoPnL = missed.reduce((s, m) => s + (m.missedHypoPnL ?? 0), 0)

    const breakdown = Array.from(byReason.entries())
      .map(([reason, { count, hypoPnL, hasHypoPnL }]) => ({
        reason,
        label: MISSED_REASON_LABELS[reason as MissedReason] ?? reason,
        count,
        hypoPnL: hasHypoPnL ? Math.round(hypoPnL * 100) / 100 : null,
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      data: {
        totalMissed: missed.length,
        totalHypoPnL: Math.round(totalHypoPnL * 100) / 100,
        breakdown,
      },
    })
  } catch (error) {
    console.error("[GET /api/analytics/missed]", error)
    return NextResponse.json({ success: false, error: "统计查询失败" }, { status: 500 })
  }
}
