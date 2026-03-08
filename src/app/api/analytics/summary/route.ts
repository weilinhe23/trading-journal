import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// GET /api/analytics/summary
export async function GET() {
  try {
    // All executions with session date
    const executions = await prisma.execution.findMany({
      select: {
        pnl: true,
        entryTime: true,
        setup: { select: { sessionDate: true } },
      },
      orderBy: { entryTime: "asc" },
    })

    // Setup status counts
    const setupGroups = await prisma.tradeSetup.groupBy({
      by: ["status"],
      _count: { status: true },
    })

    // ── Execution stats ───────────────────────────────────────────────
    const withPnL = executions.filter((e) => e.pnl !== null)
    const totalPnL = withPnL.reduce((s, e) => s + (e.pnl ?? 0), 0)
    const profitable = withPnL.filter((e) => (e.pnl ?? 0) > 0)
    const winRate = withPnL.length > 0 ? profitable.length / withPnL.length : 0
    const avgPnL = withPnL.length > 0 ? totalPnL / withPnL.length : 0

    // ── Setup counts ──────────────────────────────────────────────────
    const countByStatus = Object.fromEntries(
      setupGroups.map((g) => [g.status, g._count.status]),
    )
    const totalSetups = setupGroups.reduce((s, g) => s + g._count.status, 0)

    // ── Daily cumulative PnL curve ────────────────────────────────────
    const dailyMap = new Map<string, number>()
    for (const exec of executions) {
      if (exec.pnl === null) continue
      const date = exec.setup.sessionDate.toISOString().split("T")[0]!
      dailyMap.set(date, (dailyMap.get(date) ?? 0) + exec.pnl)
    }

    let running = 0
    const dailyPnL = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, pnl]) => {
        running += pnl
        return { date, pnl: Math.round(pnl * 100) / 100, cumPnL: Math.round(running * 100) / 100 }
      })

    return NextResponse.json({
      success: true,
      data: {
        totalPnL: Math.round(totalPnL * 100) / 100,
        winRate: Math.round(winRate * 1000) / 10,   // percentage, 1 decimal
        totalExecutions: executions.length,
        executionsWithPnL: withPnL.length,
        profitableExecutions: profitable.length,
        avgPnL: Math.round(avgPnL * 100) / 100,
        totalSetups,
        executedSetups: countByStatus["EXECUTED"] ?? 0,
        missedSetups: countByStatus["MISSED"] ?? 0,
        watchingSetups: countByStatus["WATCHING"] ?? 0,
        dailyPnL,
      },
    })
  } catch (error) {
    console.error("[GET /api/analytics/summary]", error)
    return NextResponse.json({ success: false, error: "统计查询失败" }, { status: 500 })
  }
}
