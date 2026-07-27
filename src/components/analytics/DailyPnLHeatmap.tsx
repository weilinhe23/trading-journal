"use client"

import { useMemo } from "react"
import { cn } from "~/lib/utils"

interface DayEntry {
  date: string
  pnl: number
  count: number
}

interface Props {
  data: DayEntry[]
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

function getColor(pnl: number, maxAbs: number): string {
  if (pnl === 0) return "bg-muted/40"
  const intensity = Math.min(Math.abs(pnl) / maxAbs, 1)
  if (pnl > 0) {
    if (intensity > 0.66) return "bg-green-500"
    if (intensity > 0.33) return "bg-green-600/70"
    return "bg-green-800/50"
  } else {
    if (intensity > 0.66) return "bg-red-500"
    if (intensity > 0.33) return "bg-red-600/70"
    return "bg-red-800/50"
  }
}

function buildMonthGrid(year: number, month: number, byDate: Map<string, DayEntry>) {
  const firstDay  = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const lastDate  = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const cells: Array<{ day: number | null; entry: DayEntry | null }> = []

  for (let i = 0; i < firstDay; i++) cells.push({ day: null, entry: null })
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    cells.push({ day: d, entry: byDate.get(dateStr) ?? null })
  }
  return cells
}

export function DailyPnLHeatmap({ data }: Props) {
  const { months, byDate, maxAbs } = useMemo(() => {
    const map = new Map<string, DayEntry>()
    for (const d of data) map.set(d.date, d)

    const maxAbs = data.reduce((m, d) => Math.max(m, Math.abs(d.pnl)), 0.01)

    if (data.length === 0) return { months: [], byDate: map, maxAbs }

    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
    const first  = sorted[0]!.date
    const last   = sorted[sorted.length - 1]!.date

    const [fy = 0, fm = 0] = first.split("-").map(Number) as [number, number]
    const [ly = 0, lm = 0] = last.split("-").map(Number)  as [number, number]

    const months: Array<{ year: number; month: number }> = []
    let y = fy, m = fm - 1
    while (y < ly || (y === ly && m <= lm - 1)) {
      months.push({ year: y, month: m })
      m++
      if (m > 11) { m = 0; y++ }
    }

    return { months, byDate: map, maxAbs }
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        暂无数据
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {months.map(({ year, month }) => {
        const cells = buildMonthGrid(year, month, byDate)
        const label = `${year} 年 ${month + 1} 月`
        return (
          <div key={`${year}-${month}`}>
            <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] text-muted-foreground/60">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                if (cell.day === null) {
                  return <div key={i} />
                }
                const { entry } = cell
                const color = entry ? getColor(entry.pnl, maxAbs) : "bg-muted/20"
                const title = entry
                  ? `${cell.day}日 · ${entry.count}笔 · ${entry.pnl >= 0 ? "+" : ""}$${entry.pnl.toFixed(2)}`
                  : `${cell.day}日`
                return (
                  <div
                    key={i}
                    title={title}
                    className={cn(
                      "aspect-square rounded-sm flex items-center justify-center cursor-default transition-opacity hover:opacity-80",
                      color,
                    )}
                  >
                    <span className={cn(
                      "text-[10px] leading-none",
                      entry ? "text-white/80 font-medium" : "text-muted-foreground/40",
                    )}>
                      {cell.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
