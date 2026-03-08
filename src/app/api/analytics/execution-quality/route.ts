import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// GET /api/analytics/execution-quality
export async function GET() {
  try {
    const executions = await prisma.execution.findMany({
      select: {
        entryConditionMet: true,
        exitConditionMet: true,
        executionGrade: true,
        pnl: true,
      },
    })

    // Entry condition stats
    const entryWithData = executions.filter((e) => e.entryConditionMet !== null)
    const entryMet = entryWithData.filter((e) => e.entryConditionMet === true)
    const entryMetRate =
      entryWithData.length > 0
        ? Math.round((entryMet.length / entryWithData.length) * 1000) / 10
        : null

    // Exit condition stats
    const exitWithData = executions.filter((e) => e.exitConditionMet !== null)
    const exitMet = exitWithData.filter((e) => e.exitConditionMet === true)
    const exitMetRate =
      exitWithData.length > 0
        ? Math.round((exitMet.length / exitWithData.length) * 1000) / 10
        : null

    // Grade distribution
    const gradeMap = new Map<string, { count: number; totalPnL: number }>()
    for (const exec of executions) {
      if (!exec.executionGrade) continue
      const cur = gradeMap.get(exec.executionGrade) ?? { count: 0, totalPnL: 0 }
      gradeMap.set(exec.executionGrade, {
        count: cur.count + 1,
        totalPnL: cur.totalPnL + (exec.pnl ?? 0),
      })
    }

    const gradeOrder = ["A", "B", "C", "D"]
    const gradeDistribution = gradeOrder
      .filter((g) => gradeMap.has(g))
      .map((g) => {
        const { count, totalPnL } = gradeMap.get(g)!
        return {
          grade: g,
          count,
          avgPnL: count > 0 ? Math.round((totalPnL / count) * 100) / 100 : 0,
        }
      })

    // PnL comparison: discipline vs non-discipline
    const disciplined = executions.filter(
      (e) => e.entryConditionMet === true && e.pnl !== null,
    )
    const undisciplined = executions.filter(
      (e) => e.entryConditionMet === false && e.pnl !== null,
    )
    const avgPnLDisciplined =
      disciplined.length > 0
        ? Math.round(
            (disciplined.reduce((s, e) => s + (e.pnl ?? 0), 0) / disciplined.length) * 100,
          ) / 100
        : null
    const avgPnLUndisciplined =
      undisciplined.length > 0
        ? Math.round(
            (undisciplined.reduce((s, e) => s + (e.pnl ?? 0), 0) / undisciplined.length) * 100,
          ) / 100
        : null

    return NextResponse.json({
      success: true,
      data: {
        totalExecutions: executions.length,
        entryMetRate,
        entryMetCount: entryMet.length,
        entryTotalWithData: entryWithData.length,
        exitMetRate,
        exitMetCount: exitMet.length,
        exitTotalWithData: exitWithData.length,
        gradeDistribution,
        avgPnLDisciplined,
        avgPnLUndisciplined,
      },
    })
  } catch (error) {
    console.error("[GET /api/analytics/execution-quality]", error)
    return NextResponse.json({ success: false, error: "统计查询失败" }, { status: 500 })
  }
}
