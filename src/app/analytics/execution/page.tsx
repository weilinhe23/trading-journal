import { prisma } from "~/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"

function RateBar({ rate, label }: { rate: number | null; label: string }) {
  if (rate === null) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-muted-foreground">暂无数据</span>
        </div>
        <div className="h-2 rounded-full bg-muted" />
      </div>
    )
  }
  const color =
    rate >= 70 ? "bg-green-500" : rate >= 50 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium",
            rate >= 70 ? "text-green-400" : rate >= 50 ? "text-yellow-400" : "text-red-400",
          )}
        >
          {rate.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  )
}

function PnLCompare({
  disciplined,
  undisciplined,
}: {
  disciplined: number | null
  undisciplined: number | null
}) {
  if (disciplined === null && undisciplined === null) {
    return <p className="text-sm text-muted-foreground text-center py-4">暂无对比数据</p>
  }
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="p-4 rounded-lg border border-green-900/40 bg-green-900/10">
        <p className="text-xs text-muted-foreground mb-1">遵守入场条件</p>
        <p className={`text-xl font-bold ${(disciplined ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
          {disciplined !== null
            ? `${disciplined >= 0 ? "+" : ""}$${disciplined.toFixed(2)}`
            : "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">平均每笔</p>
      </div>
      <div className="p-4 rounded-lg border border-red-900/40 bg-red-900/10">
        <p className="text-xs text-muted-foreground mb-1">未遵守入场条件</p>
        <p className={`text-xl font-bold ${(undisciplined ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
          {undisciplined !== null
            ? `${undisciplined >= 0 ? "+" : ""}$${undisciplined.toFixed(2)}`
            : "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">平均每笔</p>
      </div>
    </div>
  )
}

export default async function ExecutionQualityPage() {
  const executions = await prisma.execution.findMany({
    select: {
      entryConditionMet: true,
      exitConditionMet: true,
      executionGrade: true,
      pnl: true,
    },
  })

  // Entry rate
  const entryWithData = executions.filter((e) => e.entryConditionMet !== null)
  const entryMet = entryWithData.filter((e) => e.entryConditionMet === true)
  const entryRate =
    entryWithData.length > 0 ? (entryMet.length / entryWithData.length) * 100 : null

  // Exit rate
  const exitWithData = executions.filter((e) => e.exitConditionMet !== null)
  const exitMet = exitWithData.filter((e) => e.exitConditionMet === true)
  const exitRate =
    exitWithData.length > 0 ? (exitMet.length / exitWithData.length) * 100 : null

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
  const grades = gradeOrder.filter((g) => gradeMap.has(g)).map((g) => {
    const { count, totalPnL } = gradeMap.get(g)!
    return { grade: g, count, avgPnL: count > 0 ? totalPnL / count : 0 }
  })

  // Discipline PnL comparison
  const disciplinedExecs = executions.filter(
    (e) => e.entryConditionMet === true && e.pnl !== null,
  )
  const undisciplinedExecs = executions.filter(
    (e) => e.entryConditionMet === false && e.pnl !== null,
  )
  const avgPnLDisciplined =
    disciplinedExecs.length > 0
      ? disciplinedExecs.reduce((s, e) => s + (e.pnl ?? 0), 0) / disciplinedExecs.length
      : null
  const avgPnLUndisciplined =
    undisciplinedExecs.length > 0
      ? undisciplinedExecs.reduce((s, e) => s + (e.pnl ?? 0), 0) / undisciplinedExecs.length
      : null

  const gradeColors: Record<string, string> = {
    A: "text-green-400",
    B: "text-blue-400",
    C: "text-yellow-400",
    D: "text-red-400",
  }

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">总执行笔数</p>
            <p className="text-2xl font-bold">{executions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">入场纪律记录</p>
            <p className="text-2xl font-bold">{entryWithData.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">已填写评估</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-1">出场纪律记录</p>
            <p className="text-2xl font-bold">{exitWithData.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">已填写评估</p>
          </CardContent>
        </Card>
      </div>

      {/* Discipline rates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">执行纪律达标率</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RateBar rate={entryRate} label={`入场条件达标 (${entryMet.length}/${entryWithData.length})`} />
          <RateBar rate={exitRate} label={`出场条件达标 (${exitMet.length}/${exitWithData.length})`} />
        </CardContent>
      </Card>

      {/* Discipline vs PnL */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">纪律与盈亏的关系</CardTitle>
        </CardHeader>
        <CardContent>
          <PnLCompare disciplined={avgPnLDisciplined} undisciplined={avgPnLUndisciplined} />
        </CardContent>
      </Card>

      {/* Grade distribution */}
      {grades.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">执行质量评分分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {grades.map(({ grade, count, avgPnL }) => (
                <div key={grade} className="text-center p-3 rounded-lg border">
                  <p className={`text-2xl font-bold ${gradeColors[grade] ?? ""}`}>{grade}</p>
                  <p className="text-sm font-medium mt-1">{count} 笔</p>
                  <p
                    className={`text-xs mt-0.5 ${
                      avgPnL >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    均{avgPnL >= 0 ? "+" : ""}${avgPnL.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
