"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
} from "date-fns"
import { zhCN } from "date-fns/locale"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

interface SessionMeta {
  date: string
  setupCount: number
}

export default function JournalPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sessions, setSessions] = useState<SessionMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/sessions")
        const json = (await res.json()) as { success: boolean; data: SessionMeta[] }
        if (json.success) setSessions(json.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    void fetchSessions()
  }, [])

  // 有记录的日期 Set，方便 O(1) 查询
  const sessionDates = new Set(sessions.map((s) => s.date))
  const sessionMap = new Map(sessions.map((s) => [s.date, s]))

  // 当月所有日期
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 日历首行从周一开始：startOfMonth 是周几（0=周日）
  const startWeekday = (getDay(monthStart) + 6) % 7 // 转换为 0=周一

  const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"]

  function handleDayClick(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd")
    router.push(`/journal/${dateStr}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">交易日志</h1>
        <div className="flex gap-2">
          <Link href="/journal/search">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search className="h-3.5 w-3.5" />
              批量查询
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/journal/${format(new Date(), "yyyy-MM-dd")}`)}
          >
            今天
          </Button>
        </div>
      </div>

      {/* 月份导航 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-lg">
          {format(currentMonth, "yyyy年 MM月", { locale: zhCN })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 日历网格 */}
      <div className="border rounded-lg overflow-hidden">
        {/* 星期标题行 */}
        <div className="grid grid-cols-7 border-b">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs text-muted-foreground font-medium"
            >
              周{d}
            </div>
          ))}
        </div>

        {/* 日期格子 */}
        <div className="grid grid-cols-7">
          {/* 空白占位（月初对齐） */}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 border-b border-r last:border-r-0" />
          ))}

          {days.map((day, idx) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const hasSession = sessionDates.has(dateStr)
            const meta = sessionMap.get(dateStr)
            const today = isToday(day)
            const inMonth = isSameMonth(day, currentMonth)
            const col = (startWeekday + idx) % 7

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "h-16 border-b border-r last:border-r-0 p-1.5 text-left transition-colors",
                  "hover:bg-accent",
                  !inMonth && "opacity-30",
                  col === 6 && "border-r-0", // 最后一列无右边框
                )}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={cn(
                      "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                      today && "bg-primary text-primary-foreground",
                      !today && "text-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {hasSession && meta && (
                    <div className="mt-auto">
                      <span className="text-xs text-muted-foreground">
                        {meta.setupCount > 0 ? `${meta.setupCount} 个 Setup` : "已记录"}
                      </span>
                    </div>
                  )}
                  {hasSession && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {loading && (
        <p className="text-center text-sm text-muted-foreground">加载中...</p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        点击任意日期打开当天交易日志
      </p>
    </div>
  )
}
