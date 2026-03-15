"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, RotateCcw, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import {
  MISSED_REASON_LABELS,
  NEWS_TYPE_LABELS, NEWS_IMPACT_LABELS,
  SETUP_PRIORITY_LABELS, CHART_TIMEFRAME_LABELS,
  type MissedReason, type SetupPriority, type ChartTimeframe,
  type NewsType, type NewsImpact, type MissedReasonOption,
} from "~/types"
import type { Execution } from "../../../generated/prisma"

// ─── 常量 ────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "WATCHING",    label: "观察中",  className: "border-muted-foreground text-muted-foreground" },
  { value: "EXECUTED",   label: "已执行",  className: "border-primary text-primary" },
  { value: "MISSED",     label: "已错过",  className: "border-orange-600 text-orange-400" },
  { value: "INVALIDATED",label: "已失效",  className: "border-destructive text-destructive" },
  { value: "CANCELLED",  label: "已取消",  className: "border-muted-foreground/50 text-muted-foreground/70" },
]

const PRIORITY_OPTIONS = [
  { value: "HIGH",   label: SETUP_PRIORITY_LABELS.HIGH,   activeClass: "bg-red-700 text-white border-red-700" },
  { value: "MEDIUM", label: SETUP_PRIORITY_LABELS.MEDIUM, activeClass: "bg-yellow-700 text-white border-yellow-700" },
  { value: "LOW",    label: SETUP_PRIORITY_LABELS.LOW,    activeClass: "bg-muted text-foreground border-muted-foreground" },
]

const NEWS_TYPE_OPTIONS = [
  { value: "EARNINGS",  label: "财报" },
  { value: "FED",       label: "美联储" },
  { value: "MACRO",     label: "宏观数据" },
  { value: "SECTOR",    label: "行业新闻" },
  { value: "COMPANY",   label: "公司公告" },
  { value: "TECHNICAL", label: "纯技术面" },
]

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  WATCHING:    { label: "观察中", variant: "secondary" },
  EXECUTED:    { label: "已执行", variant: "default" },
  MISSED:      { label: "已错过", variant: "outline" },
  INVALIDATED: { label: "已失效", variant: "destructive" },
  CANCELLED:   { label: "已取消", variant: "outline" },
}

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface SearchScreenshot {
  id: string
  filePath: string
  chartTag: string | null
  caption: string | null
  timeframe: string | null
}

interface SearchSetup {
  id: string
  sessionDate: string | Date
  symbol: string
  direction: string
  priority: string
  status: string
  strategy: string | null
  selectedTradeTypes: string
  newsType: string | null
  newsImpact: string | null
  newsHeadline: string | null
  entryCondition: string | null
  entryPriceNote: string | null
  stopCondition: string | null
  stopPriceNote: string | null
  target1Condition: string | null
  target1PriceNote: string | null
  target2Condition: string | null
  target2PriceNote: string | null
  missedReason: string | null
  missedNotes: string | null
  missedHypoPnL: number | null
  chartTimeframe: string | null
  stockSelectionAccurate: boolean | null
  marketJudgmentAccurate: boolean | null
  strategySelectionAccurate: boolean | null
  entryOpportunityAccurate: boolean | null
  exitOpportunityAccurate: boolean | null
  actualEntryOpportunity: string | null
  actualExitOpportunity: string | null
  dailySummary: string | null
  setupNotes: string | null
  setupGrade: string | null
  plannedRiskReward: number | null
  plannedSize: number | null
  executions: Execution[]
  screenshots: SearchScreenshot[]
}

interface StrategyOption { id: string; name: string; isActive: boolean }

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function toDateStr(d: string | Date): string {
  const s = d instanceof Date ? d.toISOString() : String(d)
  return s.split("T")[0] ?? ""
}

function BoolBadge({ val, label }: { val: boolean | null; label: string }) {
  if (val === null) return null
  return (
    <span className={cn(
      "text-[10px] px-1 py-0.5 rounded border",
      val ? "border-green-700/60 text-green-400" : "border-red-700/60 text-red-400",
    )}>
      {label}{val ? "✓" : "✗"}
    </span>
  )
}

// ─── 查询结果卡片 ─────────────────────────────────────────────────────────────

function SetupResultCard({ setup }: { setup: SearchSetup }) {
  const [expanded, setExpanded] = useState(false)
  const dateStr = toDateStr(setup.sessionDate)
  const statusCfg = STATUS_CONFIG[setup.status] ?? STATUS_CONFIG["WATCHING"]!
  const priority = setup.priority as SetupPriority
  const totalPnL = setup.executions.reduce<number | null>((acc, ex) => {
    if (ex.pnl === null) return acc
    return (acc ?? 0) + ex.pnl
  }, null)

  let tradeTypes: string[] = []
  try { tradeTypes = JSON.parse(setup.selectedTradeTypes || "[]") as string[] } catch { /* noop */ }

  const hasEvalData =
    setup.stockSelectionAccurate !== null ||
    setup.marketJudgmentAccurate !== null ||
    setup.strategySelectionAccurate !== null ||
    setup.entryOpportunityAccurate !== null ||
    setup.exitOpportunityAccurate !== null ||
    setup.actualEntryOpportunity ||
    setup.actualExitOpportunity ||
    setup.dailySummary

  return (
    <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
      {/* 头部 */}
      <div className="px-3 pt-3 pb-2 flex items-start gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {/* 日期 */}
          <Link
            href={`/journal/${dateStr}`}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 shrink-0"
          >
            {dateStr}
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
          <span className="text-muted-foreground/40 text-xs">·</span>

          {/* 标的 + 方向 */}
          <span className="font-bold text-sm">{setup.symbol}</span>
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded font-medium",
            setup.direction === "LONG" ? "bg-green-600 text-white" :
            setup.direction === "SHORT" ? "bg-red-600 text-white" : "bg-gray-600 text-white",
          )}>
            {setup.direction === "LONG" ? "做多" : setup.direction === "SHORT" ? "做空" : "待定"}
          </span>

          {/* 优先级（非 MEDIUM 才显示）*/}
          {priority && priority !== "MEDIUM" && (
            <Badge variant="outline" className={cn(
              "text-xs py-0",
              priority === "HIGH" ? "border-red-700 text-red-400" : "border-muted-foreground/30 text-muted-foreground/50",
            )}>
              {SETUP_PRIORITY_LABELS[priority]}
            </Badge>
          )}

          {/* 状态 */}
          <Badge variant={statusCfg.variant} className="text-xs py-0">{statusCfg.label}</Badge>

          {/* K 线维度 */}
          {setup.chartTimeframe && (
            <Badge variant="outline" className="text-xs py-0 border-primary/50 text-primary/80">
              {CHART_TIMEFRAME_LABELS[setup.chartTimeframe as ChartTimeframe]}
            </Badge>
          )}

          {/* 总 PnL */}
          {totalPnL !== null && (
            <span className={cn("text-xs font-medium", totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
              {formatPnL(totalPnL)}
            </span>
          )}

          {/* 复盘评分 */}
          {setup.setupGrade && (
            <Badge variant="outline" className="text-xs py-0">评分 {setup.setupGrade}</Badge>
          )}
        </div>

        {/* 展开/收起 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* 核心信息（始终显示）*/}
      <div className="px-3 pb-2 space-y-1 text-xs">
        {/* 策略 */}
        {(setup.strategy || tradeTypes.length > 0) && (
          <div className="flex gap-1.5">
            <span className="text-violet-400 font-medium w-8 shrink-0">策略</span>
            <span className="text-foreground/80 leading-tight">
              {[setup.strategy, tradeTypes.length > 0 ? tradeTypes.join(" / ") : null].filter(Boolean).join("  ·  ")}
            </span>
          </div>
        )}

        {/* 催化剂 */}
        <div className="flex gap-1.5">
          <span className="text-yellow-500/80 font-medium w-10 shrink-0">催化剂</span>
          {setup.newsType ? (
            <span className={cn(
              "leading-tight",
              setup.newsImpact === "BULLISH" && "text-green-400",
              setup.newsImpact === "BEARISH" && "text-red-400",
              setup.newsImpact === "NEUTRAL" && "text-muted-foreground",
              setup.newsImpact === "UNCERTAIN" && "text-yellow-400",
              !setup.newsImpact && "text-foreground/80",
            )}>
              {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
              {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                <span className="ml-1 opacity-90">· {NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}</span>
              )}
              {setup.newsHeadline && <span className="text-yellow-500/60 ml-1">— {setup.newsHeadline}</span>}
            </span>
          ) : (
            <span className="text-muted-foreground">无</span>
          )}
        </div>

        {/* 入场/止损/目标条件 */}
        <div className="space-y-0.5">
          {setup.entryCondition && (
            <div className="flex gap-1.5">
              <span className="text-green-500 font-medium w-8 shrink-0">入场</span>
              <span className="text-foreground/80 leading-tight">
                {setup.entryCondition}
                {setup.entryPriceNote && <span className="text-muted-foreground ml-1">({setup.entryPriceNote})</span>}
              </span>
            </div>
          )}
          {(setup.stopCondition ?? setup.stopPriceNote) && (
            <div className="flex gap-1.5">
              <span className="text-red-500 font-medium w-8 shrink-0">止损</span>
              <span className="text-foreground/80 leading-tight">
                {setup.stopCondition ?? ""}
                {setup.stopPriceNote && <span className="text-muted-foreground ml-1">({setup.stopPriceNote})</span>}
              </span>
            </div>
          )}
          {(setup.target1Condition ?? setup.target1PriceNote) && (
            <div className="flex gap-1.5">
              <span className="text-blue-400 font-medium w-8 shrink-0">目标1</span>
              <span className="text-foreground/80 leading-tight">
                {setup.target1Condition ?? ""}
                {setup.target1PriceNote && <span className="text-muted-foreground ml-1">({setup.target1PriceNote})</span>}
              </span>
            </div>
          )}
          {(setup.target2Condition ?? setup.target2PriceNote) && (
            <div className="flex gap-1.5">
              <span className="text-blue-400/70 font-medium w-8 shrink-0">目标2</span>
              <span className="text-foreground/70 leading-tight">
                {setup.target2Condition ?? ""}
                {setup.target2PriceNote && <span className="text-muted-foreground ml-1">({setup.target2PriceNote})</span>}
              </span>
            </div>
          )}
        </div>

        {/* 错过原因 */}
        {setup.status === "MISSED" && setup.missedReason && (
          <div className="text-muted-foreground">
            <span className="font-medium text-orange-400">错过：</span>
            {MISSED_REASON_LABELS[setup.missedReason as MissedReason] ?? setup.missedReason}
            {setup.missedNotes && <span className="ml-1">— {setup.missedNotes}</span>}
            {setup.missedHypoPnL !== null && setup.missedHypoPnL !== undefined && (
              <span className={cn("ml-2 font-medium", setup.missedHypoPnL >= 0 ? "text-green-400" : "text-red-400")}>
                假设{formatPnL(setup.missedHypoPnL)}
              </span>
            )}
          </div>
        )}

        {/* 执行记录摘要 */}
        {setup.executions.length > 0 && (
          <div className="text-muted-foreground">
            <span className="font-medium text-foreground/70">执行 {setup.executions.length} 笔</span>
            {totalPnL !== null && (
              <span className={cn("ml-2 font-medium", totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
                {formatPnL(totalPnL)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 展开内容：盘中评估 + 日总结 + 复盘 */}
      {expanded && hasEvalData && (
        <>
          <Separator />
          <div className="px-3 py-2 space-y-1.5 text-xs">
            {/* 判断准确性标签 */}
            {(setup.stockSelectionAccurate !== null ||
              setup.marketJudgmentAccurate !== null ||
              setup.strategySelectionAccurate !== null ||
              setup.entryOpportunityAccurate !== null ||
              setup.exitOpportunityAccurate !== null) && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-muted-foreground w-14 shrink-0">评估</span>
                <BoolBadge val={setup.stockSelectionAccurate} label="选股" />
                <BoolBadge val={setup.marketJudgmentAccurate} label="行情" />
                <BoolBadge val={setup.strategySelectionAccurate} label="策略" />
                <BoolBadge val={setup.entryOpportunityAccurate} label="入场" />
                <BoolBadge val={setup.exitOpportunityAccurate} label="出场" />
              </div>
            )}

            {/* 实际入场机会 */}
            {setup.actualEntryOpportunity && (
              <div className="flex gap-1.5">
                <span className="text-muted-foreground w-14 shrink-0">实际入场</span>
                <span className="text-foreground/80 leading-tight">{setup.actualEntryOpportunity}</span>
              </div>
            )}

            {/* 实际出场机会 */}
            {setup.actualExitOpportunity && (
              <div className="flex gap-1.5">
                <span className="text-muted-foreground w-14 shrink-0">实际出场</span>
                <span className="text-foreground/80 leading-tight">{setup.actualExitOpportunity}</span>
              </div>
            )}

            {/* 日总结 */}
            {setup.dailySummary && (
              <div className="flex gap-1.5">
                <span className="text-muted-foreground w-14 shrink-0">日总结</span>
                <span className="text-foreground/80 leading-tight">{setup.dailySummary}</span>
              </div>
            )}

            {/* 盘后复盘 */}
            {setup.setupNotes && (
              <div className="flex gap-1.5">
                <span className="text-muted-foreground w-14 shrink-0">复盘</span>
                <span className="text-foreground/80 leading-tight">{setup.setupNotes}</span>
              </div>
            )}

            {/* 执行明细 */}
            {setup.executions.length > 0 && (
              <div className="space-y-0.5">
                <span className="text-muted-foreground">执行明细</span>
                {setup.executions.map((ex, i) => (
                  <div key={ex.id} className="ml-14 flex gap-2 flex-wrap text-foreground/70">
                    <span>#{i + 1}</span>
                    <span>入 {ex.entryPrice}</span>
                    {ex.exitPrice && <span>出 {ex.exitPrice}</span>}
                    <span>{ex.quantity}股</span>
                    {ex.pnl !== null && (
                      <span className={cn("font-medium", ex.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                        {formatPnL(ex.pnl)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 截图缩略图 */}
            {setup.screenshots.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <span className="text-muted-foreground">截图 ({setup.screenshots.length})</span>
                <div className="flex flex-wrap gap-2">
                  {setup.screenshots.map((sc) => (
                    <a
                      key={sc.id}
                      href={sc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative shrink-0"
                      title={[sc.chartTag, sc.caption, sc.timeframe].filter(Boolean).join(" · ") || sc.filePath}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sc.filePath}
                        alt={sc.caption ?? sc.chartTag ?? "截图"}
                        className="h-20 w-auto max-w-[140px] object-cover rounded border border-border group-hover:border-primary/60 transition-colors"
                      />
                      {(sc.chartTag ?? sc.timeframe) && (
                        <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-black/70 text-white px-1 rounded leading-tight">
                          {[sc.chartTag, sc.timeframe].filter(Boolean).join(" ")}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── 主搜索组件 ───────────────────────────────────────────────────────────────

export function SetupSearchClient() {
  const searchParams = useSearchParams()

  // 筛选条件（从 URL params 初始化，支持从周报卡片跳转时预填充）
  const [symbol, setSymbol]           = useState(() => searchParams.get("symbol") ?? "")
  const [selectedStatus, setSelectedStatus]     = useState<string[]>(() => {
    const s = searchParams.get("status"); return s ? s.split(",").filter(Boolean) : []
  })
  const [selectedPriority, setSelectedPriority] = useState<string[]>(() => {
    const s = searchParams.get("priority"); return s ? s.split(",").filter(Boolean) : []
  })
  const [selectedNewsType, setSelectedNewsType] = useState<string[]>(() => {
    const s = searchParams.get("newsType"); return s ? [s] : []
  })
  const [selectedStrategy, setSelectedStrategy] = useState(() => searchParams.get("strategy") ?? "")
  const [selectedMissedReason, setSelectedMissedReason] = useState(() => searchParams.get("missedReason") ?? "")
  const [dateFrom, setDateFrom]       = useState(() => searchParams.get("dateFrom") ?? "")
  const [dateTo, setDateTo]           = useState(() => searchParams.get("dateTo") ?? "")

  // 数据
  const [results, setResults]         = useState<SearchSetup[] | null>(null)
  const [loading, setLoading]         = useState(false)
  const [strategies, setStrategies]   = useState<StrategyOption[]>([])
  const [missedReasonOptions, setMissedReasonOptions] = useState<MissedReasonOption[]>([])

  // 初始化：加载策略和错过原因
  useEffect(() => {
    fetch("/api/strategies")
      .then((r) => r.json() as Promise<{ success: boolean; data: StrategyOption[] }>)
      .then((j) => { if (j.success) setStrategies(j.data.filter((s) => s.isActive)) })
      .catch(() => undefined)

    fetch("/api/missed-reasons")
      .then((r) => r.json() as Promise<{ success: boolean; data: MissedReasonOption[] }>)
      .then((j) => { if (j.success) setMissedReasonOptions(j.data) })
      .catch(() => undefined)
  }, [])

  function toggleList(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (symbol.trim()) params.set("symbol", symbol.trim())
      if (selectedStatus.length > 0) params.set("status", selectedStatus.join(","))
      if (selectedPriority.length > 0) params.set("priority", selectedPriority.join(","))
      if (selectedNewsType.length > 0) params.set("newsType", selectedNewsType[0]!)
      if (selectedStrategy) params.set("strategy", selectedStrategy)
      if (selectedMissedReason) params.set("missedReason", selectedMissedReason)
      if (dateFrom) params.set("dateFrom", dateFrom)
      if (dateTo) params.set("dateTo", dateTo)

      const res = await fetch(`/api/setups/search?${params.toString()}`)
      const json = (await res.json()) as { success: boolean; data: SearchSetup[] }
      if (json.success) setResults(json.data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [symbol, selectedStatus, selectedPriority, selectedNewsType, selectedStrategy, selectedMissedReason, dateFrom, dateTo])

  // 若 URL 带有筛选参数（如从周报卡片跳转），自动执行一次查询
  const autoSearched = useRef(false)
  const handleSearchRef = useRef(handleSearch)
  useEffect(() => { handleSearchRef.current = handleSearch }, [handleSearch])
  useEffect(() => {
    const hasParams = searchParams.get("status") ?? searchParams.get("dateFrom") ?? searchParams.get("symbol")
    if (!autoSearched.current && hasParams) {
      autoSearched.current = true
      void handleSearchRef.current()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleReset() {
    setSymbol("")
    setSelectedStatus([])
    setSelectedPriority([])
    setSelectedNewsType([])
    setSelectedStrategy("")
    setSelectedMissedReason("")
    setDateFrom("")
    setDateTo("")
    setResults(null)
  }

  const hasFilter =
    symbol.trim() ||
    selectedStatus.length > 0 ||
    selectedPriority.length > 0 ||
    selectedNewsType.length > 0 ||
    selectedStrategy ||
    selectedMissedReason ||
    dateFrom ||
    dateTo

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* 页头 */}
      <div className="flex items-center gap-3">
        <Link href="/journal" className="text-muted-foreground hover:text-foreground text-sm">← 日志</Link>
        <h1 className="text-xl font-bold">Setup 批量查询</h1>
      </div>

      {/* 筛选面板 */}
      <div className="rounded-lg border bg-card p-4 space-y-4">

        {/* 标的 + 日期范围 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">标的代码</Label>
            <Input
              placeholder="TSLA"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="text-sm h-8"
              onKeyDown={(e) => { if (e.key === "Enter") void handleSearch() }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">起始日期</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">结束日期</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm h-8"
            />
          </div>
        </div>

        <Separator />

        {/* 状态多选 */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">状态（可多选）</Label>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleList(selectedStatus, setSelectedStatus, o.value)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded border transition-colors",
                  selectedStatus.includes(o.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : `${o.className} hover:opacity-100 opacity-70`,
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* 优先级 + 新闻类型 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">优先级（可多选）</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleList(selectedPriority, setSelectedPriority, o.value)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded border transition-colors",
                    selectedPriority.includes(o.value)
                      ? o.activeClass
                      : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">新闻催化剂类型</Label>
            <div className="flex flex-wrap gap-1">
              {NEWS_TYPE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggleList(selectedNewsType, setSelectedNewsType, o.value)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    selectedNewsType.includes(o.value)
                      ? "bg-yellow-700 text-white border-yellow-700"
                      : "border-yellow-800/50 text-yellow-400/70 hover:border-yellow-600 hover:text-yellow-400",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 策略 + 错过原因 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">策略</Label>
            <div className="flex flex-wrap gap-1">
              {strategies.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStrategy(selectedStrategy === s.name ? "" : s.name)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    selectedStrategy === s.name
                      ? "bg-violet-700 text-white border-violet-700"
                      : "border-violet-800/50 text-violet-400/70 hover:border-violet-600 hover:text-violet-400",
                  )}
                >
                  {s.name}
                </button>
              ))}
              {strategies.length === 0 && (
                <span className="text-xs text-muted-foreground">暂无策略</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">已错过原因</Label>
            <div className="flex flex-wrap gap-1">
              {missedReasonOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedMissedReason(selectedMissedReason === o.label ? "" : o.label)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    selectedMissedReason === o.label
                      ? "bg-orange-700 text-white border-orange-700"
                      : "border-orange-800/50 text-orange-400/70 hover:border-orange-600 hover:text-orange-400",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => void handleSearch()}
            disabled={loading}
          >
            <Search className="h-3.5 w-3.5" />
            {loading ? "查询中..." : "查询"}
          </Button>
          {hasFilter && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              重置
            </Button>
          )}
        </div>
      </div>

      {/* 查询结果 */}
      {results !== null && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{results.length}</span> 条 Setup 记录
            {results.length > 0 && (
              <span className="ml-2 text-xs">（点击右上角 ↕ 展开完整评估内容）</span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              没有符合条件的 Setup
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((setup) => (
                <SetupResultCard key={setup.id} setup={setup} />
              ))}
            </div>
          )}
        </div>
      )}

      {results === null && !loading && (
        <p className="text-center text-sm text-muted-foreground py-8">
          设置筛选条件后点击「查询」
        </p>
      )}
    </div>
  )
}
