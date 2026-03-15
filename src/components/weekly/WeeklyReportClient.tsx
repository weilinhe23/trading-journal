"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Save, ChevronLeft, ChevronRight } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"

// ─── 类型 ────────────────────────────────────────────────────────────────────

export interface DayData {
  date: string
  pnl: number
  executed: number
  missed: number
}

export interface WeeklyStats {
  totalPnL: number
  executedCount: number
  winCount: number
  missedCount: number
  totalSetups: number
}

export interface WeeklyReportData {
  summary:       string | null
  strengths:     string | null
  weaknesses:    string | null
  keyLessons:    string | null
  nextWeekPlan:  string | null
  overallRating: number | null
}

interface Props {
  weekStart:      string
  prevWeek:       string | null
  nextWeek:       string | null
  weekLabel:      string
  initialReport:  WeeklyReportData | null
  stats:          WeeklyStats
  dailyBreakdown: DayData[]
}

// ─── 子组件 ───────────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={cn(
            "text-2xl transition-colors hover:scale-110",
            (value ?? 0) >= star ? "text-yellow-400" : "text-muted-foreground/30",
          )}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function DayPnLChart({ data }: { data: DayData[] }) {
  if (data.length === 0) return null

  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    pnl: d.pnl,
  }))

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          formatter={(v: number | undefined) => [
            v === undefined ? "—" : v >= 0 ? `+$${v.toFixed(2)}` : `-$${Math.abs(v).toFixed(2)}`,
            "PnL",
          ]}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            fontSize: 11,
          }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
        <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.pnl >= 0 ? "#16a34a" : "#dc2626"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

export function WeeklyReportClient({
  weekStart, prevWeek, nextWeek, weekLabel,
  initialReport, stats, dailyBreakdown,
}: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    summary:       initialReport?.summary       ?? "",
    strengths:     initialReport?.strengths     ?? "",
    weaknesses:    initialReport?.weaknesses    ?? "",
    keyLessons:    initialReport?.keyLessons    ?? "",
    nextWeekPlan:  initialReport?.nextWeekPlan  ?? "",
    overallRating: initialReport?.overallRating ?? null as number | null,
  })
  const [saving, setSaving] = useState(false)

  const set = useCallback(<K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/weekly-reports/${weekStart}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary:       form.summary       || undefined,
          strengths:     form.strengths     || undefined,
          weaknesses:    form.weaknesses    || undefined,
          keyLessons:    form.keyLessons    || undefined,
          nextWeekPlan:  form.nextWeekPlan  || undefined,
          overallRating: form.overallRating,
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success("周报已保存")
        router.refresh()
      } else {
        toast.error(json.error ?? "保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  const winRate =
    stats.executedCount > 0
      ? Math.round((stats.winCount / stats.executedCount) * 100)
      : null

  // 用于跳转批量查询的 URL 参数
  const weekEnd = useMemo(() => {
    const d = new Date(`${weekStart}T00:00:00.000Z`)
    d.setUTCDate(d.getUTCDate() + 6)
    return d.toISOString().split("T")[0]!
  }, [weekStart])

  const executedLink = `/journal/search?status=EXECUTED&dateFrom=${weekStart}&dateTo=${weekEnd}`
  const missedLink   = `/journal/search?status=MISSED&dateFrom=${weekStart}&dateTo=${weekEnd}`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/weekly" className="text-muted-foreground hover:text-foreground text-sm">
            ← 周报
          </Link>
          <h1 className="text-xl font-bold">{weekLabel}</h1>
        </div>
        <div className="flex items-center gap-1">
          {prevWeek && (
            <Button variant="ghost" size="icon" onClick={() => router.push(`/weekly/${prevWeek}`)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {nextWeek && (
            <Button variant="ghost" size="icon" onClick={() => router.push(`/weekly/${nextWeek}`)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 统计数字（可点击跳转批量查询） */}
      <div className="grid grid-cols-4 gap-3">
        <Link href={executedLink} className="rounded-lg border p-3 text-center hover:border-primary/50 transition-colors block">
          <p className="text-xs text-muted-foreground mb-1">本周盈亏</p>
          <p className={cn("text-lg font-bold", stats.totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
            {formatPnL(stats.totalPnL)}
          </p>
        </Link>
        <Link href={executedLink} className="rounded-lg border p-3 text-center hover:border-primary/50 transition-colors block">
          <p className="text-xs text-muted-foreground mb-1">执行次数</p>
          <p className="text-lg font-bold">{stats.executedCount}</p>
        </Link>
        <Link href={executedLink} className="rounded-lg border p-3 text-center hover:border-primary/50 transition-colors block">
          <p className="text-xs text-muted-foreground mb-1">胜率</p>
          <p className="text-lg font-bold">
            {winRate !== null ? `${winRate}%` : "—"}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {stats.winCount}W / {stats.executedCount - stats.winCount}L
          </p>
        </Link>
        <Link href={missedLink} className="rounded-lg border p-3 text-center hover:border-orange-700/50 transition-colors block">
          <p className="text-xs text-muted-foreground mb-1">错过机会</p>
          <p className={cn("text-lg font-bold", stats.missedCount > 0 ? "text-orange-400" : "text-foreground")}>
            {stats.missedCount}
          </p>
        </Link>
      </div>

      {/* 每日盈亏柱状图 */}
      {dailyBreakdown.length > 0 && (
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground mb-3">本周每日盈亏</p>
          <DayPnLChart data={dailyBreakdown} />
        </div>
      )}

      {/* 文字区块 */}
      <div className="space-y-4">
        {/* 本周总结 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">本周总结</Label>
          <Textarea
            placeholder="本周整体行情环境如何？主要交易哪些类型的机会？整体执行感受..."
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />
        </div>

        {/* 亮点 / 不足 并排 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-green-400">✓ 本周亮点</Label>
            <Textarea
              placeholder="什么执行做对了？哪些判断准确？"
              value={form.strengths}
              onChange={(e) => set("strengths", e.target.value)}
              rows={5}
              className="resize-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-red-400">✗ 本周不足</Label>
            <Textarea
              placeholder="哪些地方执行不到位？哪些判断失误？"
              value={form.weaknesses}
              onChange={(e) => set("weaknesses", e.target.value)}
              rows={5}
              className="resize-none text-sm"
            />
          </div>
        </div>

        {/* 核心经验教训 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-yellow-400">◆ 核心经验教训</Label>
          <Textarea
            placeholder="本周最重要的 2-3 条交易教训，可以指导下周行动的具体规则或洞察..."
            value={form.keyLessons}
            onChange={(e) => set("keyLessons", e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />
        </div>

        {/* 下周展望 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-400">→ 下周展望与计划</Label>
          <Textarea
            placeholder="下周关注哪些宏观事件？计划重点练习什么？有哪些需要特别注意的点？"
            value={form.nextWeekPlan}
            onChange={(e) => set("nextWeekPlan", e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* 整体评分 + 保存 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-muted-foreground">本周整体评分</Label>
          <StarRating value={form.overallRating} onChange={(v) => set("overallRating", v)} />
        </div>
        <Button onClick={() => void handleSave()} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "保存中..." : "保存周报"}
        </Button>
      </div>
    </div>
  )
}
