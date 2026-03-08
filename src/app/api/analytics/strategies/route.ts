import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// GET /api/analytics/strategies
export async function GET() {
  try {
    const setups = await prisma.tradeSetup.findMany({
      select: {
        strategy: true,
        status: true,
        executions: { select: { pnl: true } },
      },
    })

    // Group by strategy
    const stratMap = new Map<
      string,
      {
        total: number
        executed: number
        missed: number
        wins: number
        losses: number
        totalPnL: number
      }
    >()

    for (const setup of setups) {
      if (!setup.strategy) continue
      const cur = stratMap.get(setup.strategy) ?? {
        total: 0,
        executed: 0,
        missed: 0,
        wins: 0,
        losses: 0,
        totalPnL: 0,
      }

      cur.total++
      if (setup.status === "MISSED") cur.missed++
      if (setup.status === "EXECUTED") cur.executed++

      const setupPnL = setup.executions.reduce((s, e) => s + (e.pnl ?? 0), 0)
      cur.totalPnL += setupPnL
      if (setup.status === "EXECUTED") {
        if (setupPnL > 0) cur.wins++
        else cur.losses++
      }

      stratMap.set(setup.strategy!, cur)
    }

    const strategies = Array.from(stratMap.entries())
      .map(([name, { total, executed, missed, wins, losses, totalPnL }]) => ({
        name,
        total,
        executed,
        missed,
        wins,
        losses,
        winRate:
          executed > 0 ? Math.round((wins / executed) * 1000) / 10 : null,
        totalPnL: Math.round(totalPnL * 100) / 100,
        avgPnL:
          executed > 0
            ? Math.round((totalPnL / executed) * 100) / 100
            : null,
        missRate: total > 0 ? Math.round((missed / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.totalPnL - a.totalPnL)

    return NextResponse.json({ success: true, data: { strategies } })
  } catch (error) {
    console.error("[GET /api/analytics/strategies]", error)
    return NextResponse.json({ success: false, error: "统计查询失败" }, { status: 500 })
  }
}
