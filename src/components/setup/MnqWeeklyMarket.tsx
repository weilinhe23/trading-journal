"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Check, CalendarDays, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { MnqDailyPlan } from "../../../generated/prisma"

// ── 类型 ──────────────────────────────────────────────────────────────────

export type DayTrend = "UP" | "DOWN" | "RANGE" | null

export interface WeeklyMarketData {
  mon: DayTrend
  tue: DayTrend
  wed: DayTrend
  thu: DayTrend
  fri: DayTrend
}

const EMPTY_WEEK: WeeklyMarketData = {
  mon: null, tue: null, wed: null, thu: null, fri: null,
}

const DAYS: { key: keyof WeeklyMarketData; label: string }[] = [
  { key: "mon", label: "周一" },
  { key: "tue", label: "周二" },
  { key: "wed", label: "周三" },
  { key: "thu", label: "周四" },
  { key: "fri", label: "周五" },
]

const TREND_OPTIONS: {
  value: DayTrend
  label: string
  icon: React.ReactNode
  activeClass: string
  hoverClass: string
}[] = [
  {
    value: "UP",
    label: "Up",
    icon: <TrendingUp className="h-3 w-3" />,
    activeClass: "bg-green-700/80 border-green-600 text-green-100",
    hoverClass: "hover:border-green-700 hover:text-green-400",
  },
  {
    value: "DOWN",
    label: "Down",
    icon: <TrendingDown className="h-3 w-3" />,
    activeClass: "bg-red-800/80 border-red-700 text-red-100",
    hoverClass: "hover:border-red-700 hover:text-red-400",
  },
  {
    value: "RANGE",
    label: "Range",
    icon: <Minus className="h-3 w-3" />,
    activeClass: "bg-yellow-700/70 border-yellow-600 text-yellow-100",
    hoverClass: "hover:border-yellow-700 hover:text-yellow-400",
  },
]

function parseWeeklyMarket(raw: string | null | undefined): WeeklyMarketData {
  if (!raw) return { ...EMPTY_WEEK }
  try {
    const parsed = JSON.parse(raw) as Partial<WeeklyMarketData>
    return {
      mon: parsed.mon ?? null,
      tue: parsed.tue ?? null,
      wed: parsed.wed ?? null,
      thu: parsed.thu ?? null,
      fri: parsed.fri ?? null,
    }
  } catch {
    return { ...EMPTY_WEEK }
  }
}

// ── 主组件 ────────────────────────────────────────────────────────────────

interface Props {
  plan: MnqDailyPlan
  date: string
}

export function MnqWeeklyMarket({ plan, date }: Props) {
  const router = useRouter()
  const rawField = (plan as unknown as { weeklyMarketJson?: string | null }).weeklyMarketJson

  const [week, setWeek] = useState<WeeklyMarketData>(() => parseWeeklyMarket(rawField))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleTrend(day: keyof WeeklyMarketData, trend: DayTrend) {
    setWeek((prev) => ({ ...prev, [day]: prev[day] === trend ? null : trend }))
    setSaved(false)
  }

  const hasAnyData = Object.values(week).some((v) => v !== null)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyMarketJson: hasAnyData ? JSON.stringify(week) : null,
        }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success("周行情已保存")
        setSaved(true)
        router.refresh()
      } else {
        toast.error("保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2.5 pt-2 border-t border-border/40">
      {/* 标题 */}
      <div className="flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-violet-400" />
        <span className="text-xs font-medium text-violet-400">本周行情</span>
      </div>

      {/* 周一到周五 */}
      <div className="space-y-1.5">
        {DAYS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            {/* 日期标签 */}
            <span className="text-xs text-muted-foreground w-8 shrink-0">{label}</span>

            {/* 三个趋势按钮 */}
            <div className="flex gap-1">
              {TREND_OPTIONS.map(({ value, label: btnLabel, icon, activeClass, hoverClass }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleTrend(key, value)}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                    week[key] === value
                      ? activeClass
                      : cn(
                          "border-muted-foreground/25 text-muted-foreground/60",
                          hoverClass,
                        ),
                  )}
                >
                  {icon}
                  {btnLabel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 保存按钮 */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5 border-violet-800 text-violet-400 hover:bg-violet-950"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-3 w-3" />
          {saving ? "保存中..." : "保存周行情"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" />已保存
          </span>
        )}
      </div>
    </div>
  )
}
