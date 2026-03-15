"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  MoreHorizontal, CheckCircle, XCircle, Ban, Eye, Plus,
  ThumbsUp, ThumbsDown, Undo2, ChevronDown, ChevronUp, Save, Check,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import {
  MISSED_REASON_LABELS, NEWS_TYPE_LABELS, NEWS_IMPACT_LABELS,
  PRICE_TIER_LABELS, MARKET_CAP_TIER_LABELS,
  SETUP_PRIORITY_LABELS, CHART_TIMEFRAME_LABELS,
  type MissedReason, type SetupStatus, type NewsType, type NewsImpact,
  type PriceTier, type MarketCapTier, type SetupPriority, type ChartTimeframe,
} from "~/types"
import { MissedReasonPanel } from "./MissedReasonPanel"
import { AddExecutionDialog } from "./AddExecutionDialog"
import { ExecutionRecord } from "./ExecutionRecord"
import { IntraStrategySelector } from "./IntraStrategySelector"
import type { Execution, TradeSetup } from "../../../generated/prisma"

interface Props {
  setup: TradeSetup & { executions: Execution[] }
  intraMode?: boolean
  onDeleted?: (id: string) => void
  onStatusChanged?: (id: string, status: SetupStatus) => void
}

const STATUS_CONFIG: Record<
  SetupStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  WATCHING:    { label: "观察中", variant: "secondary" },
  EXECUTED:    { label: "已执行", variant: "default" },
  MISSED:      { label: "已错过", variant: "outline" },
  INVALIDATED: { label: "已失效", variant: "destructive" },
  CANCELLED:   { label: "已取消", variant: "outline" },
}

const DIRECTION_CONFIG: Record<string, { label: string; className: string }> = {
  LONG:  { label: "做多", className: "bg-green-600 text-white" },
  SHORT: { label: "做空", className: "bg-red-600 text-white" },
  TBD:   { label: "待定", className: "bg-gray-600 text-white" },
}

const PRIORITY_BADGE_CONFIG: Record<SetupPriority, { label: string; className: string }> = {
  HIGH:   { label: "高优先", className: "border-red-700 text-red-400" },
  MEDIUM: { label: "中",     className: "border-yellow-700/60 text-yellow-400/60" },
  LOW:    { label: "低/观察", className: "border-muted-foreground/30 text-muted-foreground/50" },
}

const CHART_TIMEFRAME_OPTIONS: ChartTimeframe[] = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"]

export function SetupCard({ setup, intraMode = false, onDeleted, onStatusChanged }: Props) {
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [showMissPanel, setShowMissPanel] = useState(false)
  const [showExecDialog, setShowExecDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [showIntraEval, setShowIntraEval] = useState(false)
  const [intraSaving, setIntraSaving] = useState(false)
  const [intraSaved, setIntraSaved] = useState(false)

  // 盘中评估状态（批量保存，不再 onBlur）
  const [stockSelectionAccurate, setStockSelectionAccurate] = useState<boolean | null>(
    setup.stockSelectionAccurate ?? null,
  )
  const [stockSelectionNote, setStockSelectionNote] = useState(setup.stockSelectionNote ?? "")
  // 判断准确性（细分四项）
  const s = setup as unknown as Record<string, unknown>
  const [marketJudgmentAccurate, setMarketJudgmentAccurate] = useState<boolean | null>(
    (s.marketJudgmentAccurate as boolean | null | undefined) ?? null,
  )
  const [marketJudgmentNote, setMarketJudgmentNote] = useState((s.marketJudgmentNote as string | undefined) ?? "")
  const [strategySelectionAccurate, setStrategySelectionAccurate] = useState<boolean | null>(
    (s.strategySelectionAccurate as boolean | null | undefined) ?? null,
  )
  const [strategySelectionNote, setStrategySelectionNote] = useState((s.strategySelectionNote as string | undefined) ?? "")
  const [entryOpportunityAccurate, setEntryOpportunityAccurate] = useState<boolean | null>(
    (s.entryOpportunityAccurate as boolean | null | undefined) ?? null,
  )
  const [entryOpportunityNote, setEntryOpportunityNote] = useState((s.entryOpportunityNote as string | undefined) ?? "")
  const [exitOpportunityAccurate, setExitOpportunityAccurate] = useState<boolean | null>(
    (s.exitOpportunityAccurate as boolean | null | undefined) ?? null,
  )
  const [exitOpportunityNote, setExitOpportunityNote] = useState((s.exitOpportunityNote as string | undefined) ?? "")
  const [actualEntryOpportunity, setActualEntryOpportunity] = useState(
    setup.actualEntryOpportunity ?? "",
  )
  const [actualExitOpportunity, setActualExitOpportunity] = useState(
    setup.actualExitOpportunity ?? "",
  )
  const [dailySummary, setDailySummary] = useState(setup.dailySummary ?? "")
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe | null>(
    (s.chartTimeframe as ChartTimeframe | null | undefined) ?? null,
  )

  const statusCfg = STATUS_CONFIG[setup.status as SetupStatus]
  const dirCfg = DIRECTION_CONFIG[setup.direction] ?? DIRECTION_CONFIG["TBD"]!

  const dateStr = (
    setup.sessionDate instanceof Date
      ? setup.sessionDate.toISOString().split("T")[0]
      : String(setup.sessionDate).split("T")[0]
  ) ?? ""

  const totalPnL = setup.executions.reduce<number | null>((acc, ex) => {
    if (ex.pnl === null) return acc
    return (acc ?? 0) + ex.pnl
  }, null)

  // 盘中评估是否已有内容
  const hasIntraData =
    stockSelectionAccurate !== null ||
    marketJudgmentAccurate !== null ||
    strategySelectionAccurate !== null ||
    entryOpportunityAccurate !== null ||
    exitOpportunityAccurate !== null ||
    chartTimeframe !== null ||
    actualEntryOpportunity.trim() ||
    actualExitOpportunity.trim() ||
    dailySummary.trim()

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "DELETE",
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success(`已删除 ${setup.symbol}`)
        onDeleted?.(setup.id)
        router.refresh()
      } else {
        toast.error("删除失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  async function handleQuickStatus(status: "INVALIDATED" | "CANCELLED" | "WATCHING") {
    setStatusUpdating(true)
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        const labels = { INVALIDATED: "已失效", CANCELLED: "已取消", WATCHING: "观察中" }
        toast.success(`${setup.symbol} → ${labels[status]}`)
        onStatusChanged?.(setup.id, status)
        router.refresh()
      } else {
        toast.error("操作失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setStatusUpdating(false)
    }
  }

  /** 批量保存盘中评估所有字段 */
  async function handleSaveIntraEval() {
    setIntraSaving(true)
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockSelectionAccurate,
          stockSelectionNote,
          marketJudgmentAccurate,
          marketJudgmentNote,
          strategySelectionAccurate,
          strategySelectionNote,
          entryOpportunityAccurate,
          entryOpportunityNote,
          exitOpportunityAccurate,
          exitOpportunityNote,
          actualEntryOpportunity,
          actualExitOpportunity,
          dailySummary,
          chartTimeframe,
        }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success("盘中评估已保存")
        setIntraSaved(true)
        router.refresh()
      } else {
        toast.error("保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setIntraSaving(false)
    }
  }

  function toggleBoolField(
    setter: (v: boolean | null) => void,
    value: boolean,
    current: boolean | null,
  ) {
    const next = current === value ? null : value
    setter(next)
    setIntraSaved(false) // mark as unsaved when user modifies
  }

  function renderIntraEvalSection() {
    return (
      <div className="space-y-2.5 mt-2">
        {/* K 线维度 */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">实际交易 K 线维度</Label>
          <div className="flex flex-wrap gap-1">
            {CHART_TIMEFRAME_OPTIONS.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setChartTimeframe((prev) => prev === tf ? null : tf)
                  setIntraSaved(false)
                }}
                className={cn(
                  "text-xs px-2 py-0.5 rounded border transition-colors",
                  chartTimeframe === tf
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                {CHART_TIMEFRAME_LABELS[tf]}
              </button>
            ))}
          </div>
        </div>

        {/* 盘前选股准确性 */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">盘前选股</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={stockSelectionAccurate === true ? "default" : "outline"}
              className={cn(
                "h-6 text-xs gap-1",
                stockSelectionAccurate === true && "bg-green-700 hover:bg-green-800",
              )}
              onClick={() => {
                toggleBoolField(setStockSelectionAccurate, true, stockSelectionAccurate)
              }}
            >
              <ThumbsUp className="h-3 w-3" />选对了
            </Button>
            <Button
              size="sm"
              variant={stockSelectionAccurate === false ? "destructive" : "outline"}
              className="h-6 text-xs gap-1"
              onClick={() => {
                toggleBoolField(setStockSelectionAccurate, false, stockSelectionAccurate)
              }}
            >
              <ThumbsDown className="h-3 w-3" />选错了
            </Button>
          </div>
          {stockSelectionAccurate === false && (
            <Textarea
              placeholder="选股失误原因..."
              value={stockSelectionNote}
              onChange={(e) => { setStockSelectionNote(e.target.value); setIntraSaved(false) }}
              rows={2}
              className="text-xs resize-none mt-1"
            />
          )}
        </div>

        {/* 判断准确性（细分四项） */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">判断准确性</Label>
          {([
            { label: "行情判断", val: marketJudgmentAccurate, set: setMarketJudgmentAccurate, note: marketJudgmentNote, setNote: setMarketJudgmentNote, placeholder: "行情判断失误原因..." },
            { label: "策略选择", val: strategySelectionAccurate, set: setStrategySelectionAccurate, note: strategySelectionNote, setNote: setStrategySelectionNote, placeholder: "策略选择失误原因..." },
            { label: "入场机会", val: entryOpportunityAccurate, set: setEntryOpportunityAccurate, note: entryOpportunityNote, setNote: setEntryOpportunityNote, placeholder: "入场机会判断失误原因..." },
            { label: "出场机会", val: exitOpportunityAccurate, set: setExitOpportunityAccurate, note: exitOpportunityNote, setNote: setExitOpportunityNote, placeholder: "出场机会判断失误原因..." },
          ] as Array<{ label: string; val: boolean | null; set: (v: boolean | null) => void; note: string; setNote: (v: string) => void; placeholder: string }>).map(({ label, val, set, note, setNote, placeholder }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-14 shrink-0">{label}</span>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={val === true ? "default" : "outline"}
                    className={cn("h-6 text-xs gap-1", val === true && "bg-green-700 hover:bg-green-800")}
                    onClick={() => { toggleBoolField(set, true, val); setIntraSaved(false) }}
                  >
                    <ThumbsUp className="h-3 w-3" />准确
                  </Button>
                  <Button
                    size="sm"
                    variant={val === false ? "destructive" : "outline"}
                    className="h-6 text-xs gap-1"
                    onClick={() => { toggleBoolField(set, false, val); setIntraSaved(false) }}
                  >
                    <ThumbsDown className="h-3 w-3" />失误
                  </Button>
                </div>
              </div>
              {val === false && (
                <Textarea
                  placeholder={placeholder}
                  value={note}
                  onChange={(e) => { setNote(e.target.value); setIntraSaved(false) }}
                  rows={2}
                  className="text-xs resize-none ml-16"
                />
              )}
            </div>
          ))}
        </div>

        {/* 实际入场机会 */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">实际入场机会</Label>
          <Textarea
            placeholder="开盘后实际出现的进入机会..."
            value={actualEntryOpportunity}
            onChange={(e) => { setActualEntryOpportunity(e.target.value); setIntraSaved(false) }}
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* 实际出场机会 */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">实际出场机会</Label>
          <Textarea
            placeholder="实际有的退出机会..."
            value={actualExitOpportunity}
            onChange={(e) => { setActualExitOpportunity(e.target.value); setIntraSaved(false) }}
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* 单日标的总结 */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">单日标的总结</Label>
          <Textarea
            placeholder={`${setup.symbol} 今日整体情况总结...`}
            value={dailySummary}
            onChange={(e) => { setDailySummary(e.target.value); setIntraSaved(false) }}
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* 保存按钮 */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={handleSaveIntraEval}
            disabled={intraSaving}
          >
            <Save className="h-3 w-3" />
            {intraSaving ? "保存中..." : "保存盘中评估"}
          </Button>
          {intraSaved && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Check className="h-3 w-3" />已保存
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className={cn(
        "transition-opacity",
        (setup.status === "INVALIDATED" || setup.status === "CANCELLED") && "opacity-50",
      )}>
        <CardHeader className="pb-1.5 pt-3 px-3 flex flex-row items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-sm">{setup.symbol}</span>
            <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", dirCfg.className)}>
              {dirCfg.label}
            </span>
            {/* 优先级别 */}
            {(() => {
              const priority = (setup as unknown as { priority?: SetupPriority }).priority
              if (!priority || priority === "MEDIUM") return null
              const cfg = PRIORITY_BADGE_CONFIG[priority]
              return (
                <Badge variant="outline" className={cn("text-xs py-0", cfg.className)}>
                  {cfg.label}
                </Badge>
              )
            })()}
            {setup.strategy && (
              <Badge variant="secondary" className="text-xs py-0">{setup.strategy}</Badge>
            )}
            {/* 交易类型 badges */}
            {(() => {
              try {
                const types = JSON.parse((setup as unknown as { selectedTradeTypes?: string }).selectedTradeTypes ?? "[]") as string[]
                return types.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs py-0 border-primary/40 text-primary/80">{t}</Badge>
                ))
              } catch { return null }
            })()}
            <Badge variant={statusCfg.variant} className="text-xs py-0">{statusCfg.label}</Badge>

            {/* 价格层级 */}
            {setup.priceTier && (
              <Badge variant="outline" className="text-xs py-0 text-muted-foreground">
                {PRICE_TIER_LABELS[setup.priceTier as PriceTier]}
              </Badge>
            )}
            {/* 市值层级 */}
            {setup.marketCapTier && (
              <Badge variant="outline" className="text-xs py-0 text-muted-foreground">
                {MARKET_CAP_TIER_LABELS[setup.marketCapTier as MarketCapTier]}
              </Badge>
            )}
            {/* 新闻催化剂 */}
            {setup.newsType && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs py-0",
                  setup.newsImpact === "BULLISH" && "border-green-700 text-green-400",
                  setup.newsImpact === "BEARISH" && "border-red-700 text-red-400",
                  setup.newsImpact === "NEUTRAL" && "border-muted-foreground text-muted-foreground",
                  setup.newsImpact === "UNCERTAIN" && "border-yellow-700 text-yellow-400",
                  !setup.newsImpact && "border-muted-foreground text-muted-foreground",
                )}
              >
                {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
                {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                  <span className="ml-1 opacity-70">·{NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}</span>
                )}
              </Badge>
            )}
            {/* 汇总盈亏 */}
            {totalPnL !== null && (
              <span className={cn(
                "text-xs font-medium",
                totalPnL >= 0 ? "text-green-400" : "text-red-400",
              )}>
                {formatPnL(totalPnL)}
              </span>
            )}
            {/* 盘中评估徽章 */}
            {intraMode && stockSelectionAccurate !== null && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs py-0",
                  stockSelectionAccurate ? "border-green-700 text-green-400" : "border-red-700 text-red-400",
                )}
              >
                选股{stockSelectionAccurate ? "✓" : "✗"}
              </Badge>
            )}
            {intraMode && (marketJudgmentAccurate !== null || strategySelectionAccurate !== null || entryOpportunityAccurate !== null || exitOpportunityAccurate !== null) && (() => {
              const vals = [marketJudgmentAccurate, strategySelectionAccurate, entryOpportunityAccurate, exitOpportunityAccurate].filter(v => v !== null)
              const allOk = vals.every(v => v === true)
              return (
                <Badge variant="outline" className={cn("text-xs py-0", allOk ? "border-green-700 text-green-400" : "border-orange-700 text-orange-400")}>
                  判断{allOk ? "✓" : "✗"}
                </Badge>
              )
            })()}
            {/* K 线维度标签 */}
            {intraMode && chartTimeframe && (
              <Badge variant="outline" className="text-xs py-0 border-primary/50 text-primary/80">
                {CHART_TIMEFRAME_LABELS[chartTimeframe]}
              </Badge>
            )}
            {/* 盘中评估已保存指示器 */}
            {intraMode && hasIntraData && intraSaved && (
              <Badge variant="outline" className="text-xs py-0 border-green-800 text-green-400">
                <Check className="h-2.5 w-2.5 mr-0.5" />评估已存
              </Badge>
            )}
          </div>
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-muted-foreground shrink-0"
            onClick={() => setShowDelete(true)}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-1.5 text-sm px-3 pb-3">
          {/* 策略 + 交易类型 */}
          {(() => {
            try {
              const types = JSON.parse((setup as unknown as { selectedTradeTypes?: string }).selectedTradeTypes ?? "[]") as string[]
              if (!setup.strategy && types.length === 0) return null
              const label = [setup.strategy, types.length > 0 ? types.join(" / ") : null].filter(Boolean).join("  ·  ")
              return (
                <div className="flex gap-1.5">
                  <span className="text-violet-400 font-medium text-xs w-8 shrink-0">策略</span>
                  <span className="text-xs text-foreground/80 leading-tight">{label}</span>
                </div>
              )
            } catch { return null }
          })()}
          {/* 催化剂 — 始终显示 */}
          <div className="flex gap-1.5">
            <span className="text-yellow-500/80 font-medium text-xs w-10 shrink-0">催化剂</span>
            {setup.newsType ? (
              <span className={cn(
                "text-xs leading-tight",
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
                {setup.newsHeadline && (
                  <span className="text-yellow-500/60 ml-1">— {setup.newsHeadline}</span>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">无</span>
            )}
          </div>
          {setup.setupLogic && (
            <p className="text-muted-foreground text-xs line-clamp-2">{setup.setupLogic}</p>
          )}

          {/* 三行条件 */}
          <div className="space-y-1">
            {setup.entryCondition && (
              <div className="flex gap-1.5">
                <span className="text-green-500 font-medium text-xs w-8 shrink-0">入场</span>
                <span className="text-xs text-foreground/80 leading-tight">
                  {setup.entryCondition}
                  {setup.entryPriceNote && (
                    <span className="text-muted-foreground ml-1">({setup.entryPriceNote})</span>
                  )}
                </span>
              </div>
            )}
            {(setup.stopCondition ?? setup.stopPriceNote) && (
              <div className="flex gap-1.5">
                <span className="text-red-500 font-medium text-xs w-8 shrink-0">止损</span>
                <span className="text-xs text-foreground/80 leading-tight">
                  {setup.stopCondition ?? ""}
                  {setup.stopPriceNote && (
                    <span className="text-muted-foreground ml-1">({setup.stopPriceNote})</span>
                  )}
                </span>
              </div>
            )}
            {(setup.target1Condition ?? setup.target1PriceNote) && (
              <div className="flex gap-1.5">
                <span className="text-blue-400 font-medium text-xs w-8 shrink-0">目标1</span>
                <span className="text-xs text-foreground/80 leading-tight">
                  {setup.target1Condition ?? ""}
                  {setup.target1PriceNote && (
                    <span className="text-muted-foreground ml-1">({setup.target1PriceNote})</span>
                  )}
                </span>
              </div>
            )}
            {(setup.target2Condition ?? (setup as unknown as { target2PriceNote?: string }).target2PriceNote) && (
              <div className="flex gap-1.5">
                <span className="text-blue-400/70 font-medium text-xs w-8 shrink-0">目标2</span>
                <span className="text-xs text-foreground/70 leading-tight">
                  {setup.target2Condition ?? ""}
                  {(setup as unknown as { target2PriceNote?: string }).target2PriceNote && (
                    <span className="text-muted-foreground ml-1">
                      ({(setup as unknown as { target2PriceNote?: string }).target2PriceNote})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* 错过原因 */}
          {setup.status === "MISSED" && setup.missedReason && (
            <>
              <Separator className="my-1" />
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">错过：</span>
                {/* 兼容旧存量枚举 key，新数据直接存中文标签 */}
                {MISSED_REASON_LABELS[setup.missedReason as MissedReason] ?? setup.missedReason}
                {setup.missedNotes && <span className="ml-1">— {setup.missedNotes}</span>}
              </div>
            </>
          )}

          {/* 计划 R/仓位 */}
          {(setup.plannedRiskReward ?? setup.plannedSize) && (
            <div className="flex gap-3 text-xs text-muted-foreground">
              {setup.plannedRiskReward && <span>计划R: {setup.plannedRiskReward}R</span>}
              {setup.plannedSize && <span>仓位: {setup.plannedSize}股</span>}
            </div>
          )}

          {/* 执行记录 */}
          {setup.executions.length > 0 && (
            <>
              <Separator className="my-1.5" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    执行记录（{setup.executions.length}笔）
                  </span>
                  <Button
                    variant="ghost" size="sm"
                    className="h-5 text-xs gap-1 text-muted-foreground"
                    onClick={() => setShowExecDialog(true)}
                  >
                    <Plus className="h-3 w-3" />加仓
                  </Button>
                </div>
                {setup.executions.map((ex, i) => (
                  <ExecutionRecord
                    key={ex.id}
                    execution={ex}
                    direction={setup.direction as "LONG" | "SHORT"}
                    index={i}
                  />
                ))}
              </div>
            </>
          )}

          {/* 盘中操作按钮 */}
          {intraMode && setup.status === "WATCHING" && (
            <>
              <Separator className="my-1.5" />
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm" variant="outline"
                  className="h-7 text-xs gap-1 text-green-400 border-green-800 hover:bg-green-950"
                  disabled={statusUpdating}
                  onClick={() => setShowExecDialog(true)}
                >
                  <CheckCircle className="h-3 w-3" />已执行
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-7 text-xs gap-1 text-orange-400 border-orange-800 hover:bg-orange-950"
                  disabled={statusUpdating}
                  onClick={() => setShowMissPanel(true)}
                >
                  <Eye className="h-3 w-3" />已错过
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-7 text-xs gap-1 text-muted-foreground"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatus("INVALIDATED")}
                >
                  <XCircle className="h-3 w-3" />失效
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-7 text-xs gap-1 text-muted-foreground"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatus("CANCELLED")}
                >
                  <Ban className="h-3 w-3" />取消
                </Button>
              </div>
            </>
          )}

          {/* 撤销按钮 */}
          {intraMode && (setup.status === "INVALIDATED" || setup.status === "CANCELLED") && (
            <>
              <Separator className="my-1.5" />
              <Button
                size="sm" variant="outline"
                className="h-7 text-xs gap-1 text-blue-400 border-blue-800 hover:bg-blue-950"
                disabled={statusUpdating}
                onClick={() => handleQuickStatus("WATCHING")}
              >
                <Undo2 className="h-3 w-3" />撤销，恢复观察中
              </Button>
            </>
          )}

          {/* 盘中策略选择 */}
          {intraMode && (
            <>
              <Separator className="my-1.5" />
              <IntraStrategySelector
                setupId={setup.id}
                dateStr={dateStr}
                currentStrategyId={(setup as unknown as { strategyId?: string | null }).strategyId ?? null}
                currentStrategy={setup.strategy ?? null}
                currentSelectedTradeTypes={(() => {
                  try {
                    return JSON.parse(
                      (setup as unknown as { selectedTradeTypes?: string }).selectedTradeTypes ?? "[]",
                    ) as string[]
                  } catch { return [] }
                })()}
              />
            </>
          )}

          {/* 盘中评估区域（可折叠） */}
          {intraMode && (
            <>
              <Separator className="my-1.5" />
              <button
                onClick={() => setShowIntraEval((v) => !v)}
                className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-medium flex items-center gap-1.5">
                  盘中评估
                  {hasIntraData && !intraSaved && (
                    <span className="text-yellow-500 text-[10px]">● 未保存</span>
                  )}
                </span>
                {showIntraEval
                  ? <ChevronUp className="h-3 w-3" />
                  : <ChevronDown className="h-3 w-3" />
                }
              </button>
              {showIntraEval && renderIntraEvalSection()}
            </>
          )}
        </CardContent>
      </Card>

      {/* 确认删除 */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>删除 Setup</DialogTitle>
            <DialogDescription>
              确定删除 {setup.symbol} ({setup.strategy}) 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 错过原因面板 */}
      <MissedReasonPanel
        open={showMissPanel}
        setupId={setup.id}
        setupSymbol={setup.symbol}
        dateStr={dateStr}
        onClose={() => setShowMissPanel(false)}
        onSuccess={() => {
          setShowMissPanel(false)
          onStatusChanged?.(setup.id, "MISSED")
          router.refresh()
        }}
      />

      {/* 添加执行记录弹窗 */}
      <AddExecutionDialog
        open={showExecDialog}
        setupId={setup.id}
        setupSymbol={setup.symbol}
        direction={setup.direction as "LONG" | "SHORT" | "TBD"}
        onClose={() => setShowExecDialog(false)}
        onSuccess={() => {
          setShowExecDialog(false)
          onStatusChanged?.(setup.id, "EXECUTED")
        }}
      />
    </>
  )
}
