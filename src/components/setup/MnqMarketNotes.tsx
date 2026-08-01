"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Check, TrendingUp, Plus, X, CheckCircle2, XCircle, Moon, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import {
  MNQ_DECISION_TIMEFRAME_LABELS,
  MNQ_DECISION_TIMEFRAME_OPTIONS,
  isMnqDecisionTimeframe,
  type MnqDecisionTimeframe,
} from "~/types"
import type { MnqDailyPlan } from "../../../generated/prisma"

interface TradeTypeOption {
  id: string
  name: string
}

interface StrategyOption {
  id: string
  name: string
  tradeTypes: TradeTypeOption[]
}

// ── 类型 ──────────────────────────────────────────────────────────────────
export type MarketType = "RANGE" | "TREND"

export type TradeResult = "PROFIT_MET" | "PROFIT_PARTIAL" | "BREAKEVEN" | "LOSS"

export type EntryApproach = "DIRECT" | "PULLBACK"

export interface TradeOpportunity {
  id: string
  description: string
  decisionTimeframe: MnqDecisionTimeframe | null
  entryApproach: EntryApproach | null  // 直接进入 or 等回调进入
  captured: boolean | null  // null = 未标记, true = 把握住, false = 错过
  missedProcess: string     // 仅当 captured === false 时使用
  tradeResult: TradeResult | null  // 仅当 captured === true 时使用
  tradeResultNote: string          // 交易结果备注
  // 具体交易记录（仅当 captured === true 时使用）
  tradeDirection: "LONG" | "SHORT" | null
  entryTime: string         // HH:MM
  exitTime: string          // HH:MM
  entryPrice: string        // 字符串方便输入，空字符串表示未填
  exitPrice: string
  contracts: string         // 合约数
  stopPrice: string         // 止损价
  targetPrice: string       // 目标价
  strategyId: string | null    // 关联策略库 ID
  strategyName: string | null  // 关联策略名称（冗余存储，便于展示）
  tradeTypeId: string | null   // 关联子策略（交易类型）ID
  tradeTypeName: string | null // 关联子策略名称
  // 回报指标（字符串方便输入，空字符串表示未填）
  plannedRiskPts: string       // 计划风险（点位）
  maxDrawdownPts: string       // MAE 最大回撤（点位）
  maxFavorablePts: string      // MFE 最高盈利空间（点位）
  // 持仓过夜
  heldOvernight: boolean       // 是否持仓过夜，默认 false
  overnightReason: string      // 持仓过夜理由
  // 执行评估（仅当 captured === true 时使用）
  entryAccuracy: MarketAccuracy | null  // 进入是否准确
  entryAccuracyNote: string             // 进入评估说明
  exitAccuracy: MarketAccuracy | null   // 退出是否准确
  exitAccuracyNote: string              // 退出评估说明
  // 错过交易的假设 R
  missedRiskPts: string        // 假设风险（点位），仅当 captured === false
  missedReturnPts: string      // 假设回报（点位），仅当 captured === false
}

export type MarketAccuracy = "CORRECT" | "WRONG"

export interface MarketSegmentData {
  type: MarketType | null
  note: string
  accuracy: MarketAccuracy | null
  opportunities: TradeOpportunity[]
}

const EMPTY_SEGMENT: MarketSegmentData = { type: null, note: "", accuracy: null, opportunities: [] }

function genId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function createOpportunity(): TradeOpportunity {
  return {
    id: genId(), description: "", decisionTimeframe: null, entryApproach: null, captured: null, missedProcess: "",
    tradeResult: null, tradeResultNote: "",
    tradeDirection: null,
    entryTime: "", exitTime: "", entryPrice: "", exitPrice: "",
    contracts: "", stopPrice: "", targetPrice: "",
    strategyId: null, strategyName: null,
    tradeTypeId: null, tradeTypeName: null,
    plannedRiskPts: "", maxDrawdownPts: "", maxFavorablePts: "",
    heldOvernight: false, overnightReason: "",
    entryAccuracy: null, entryAccuracyNote: "",
    exitAccuracy: null, exitAccuracyNote: "",
    missedRiskPts: "", missedReturnPts: "",
  }
}

// 兼容旧格式（opportunity: string）和新格式（opportunities: TradeOpportunity[]）
function parseSegment(raw: string | null | undefined): MarketSegmentData {
  if (!raw) return { ...EMPTY_SEGMENT }
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    // 旧格式迁移：opportunity string → 单条 opportunities
    if (typeof parsed.opportunity === "string" && !Array.isArray(parsed.opportunities)) {
      const opp = parsed.opportunity.trim()
      return {
        type: (parsed.type as MarketType) ?? null,
        note: (parsed.note as string) ?? "",
        accuracy: (parsed.accuracy as MarketAccuracy) ?? null,
        opportunities: opp
          ? [{ id: genId(), description: opp, decisionTimeframe: null, entryApproach: null, captured: null, missedProcess: "", tradeResult: null, tradeResultNote: "", tradeDirection: null, entryTime: "", exitTime: "", entryPrice: "", exitPrice: "", contracts: "", stopPrice: "", targetPrice: "", strategyId: null, strategyName: null, tradeTypeId: null, tradeTypeName: null, plannedRiskPts: "", maxDrawdownPts: "", maxFavorablePts: "", heldOvernight: false, overnightReason: "", entryAccuracy: null, entryAccuracyNote: "", exitAccuracy: null, exitAccuracyNote: "", missedRiskPts: "", missedReturnPts: "" }]
          : [],
      }
    }
    const opps = Array.isArray(parsed.opportunities)
      ? (parsed.opportunities as TradeOpportunity[]).map((o) => ({
          ...o,
          decisionTimeframe: isMnqDecisionTimeframe(o.decisionTimeframe) ? o.decisionTimeframe : null,
          entryApproach: o.entryApproach ?? null,
          tradeResult: o.tradeResult ?? null,
          tradeResultNote: o.tradeResultNote ?? "",
          tradeDirection: o.tradeDirection ?? null,
          entryTime: o.entryTime ?? "",
          exitTime: o.exitTime ?? "",
          entryPrice: o.entryPrice ?? "",
          exitPrice: o.exitPrice ?? "",
          contracts: o.contracts ?? "",
          stopPrice: o.stopPrice ?? "",
          targetPrice: o.targetPrice ?? "",
          strategyId: o.strategyId ?? null,
          strategyName: o.strategyName ?? null,
          tradeTypeId: o.tradeTypeId ?? null,
          tradeTypeName: o.tradeTypeName ?? null,
          plannedRiskPts: o.plannedRiskPts ?? "",
          maxDrawdownPts: o.maxDrawdownPts ?? "",
          maxFavorablePts: o.maxFavorablePts ?? "",
          heldOvernight: o.heldOvernight ?? false,
          overnightReason: o.overnightReason ?? "",
          entryAccuracy: o.entryAccuracy ?? null,
          entryAccuracyNote: o.entryAccuracyNote ?? "",
          exitAccuracy: o.exitAccuracy ?? null,
          exitAccuracyNote: o.exitAccuracyNote ?? "",
          missedRiskPts: o.missedRiskPts ?? "",
          missedReturnPts: o.missedReturnPts ?? "",
        }))
      : []
    return {
      type: (parsed.type as MarketType) ?? null,
      note: (parsed.note as string) ?? "",
      accuracy: (parsed.accuracy as MarketAccuracy) ?? null,
      opportunities: opps,
    }
  } catch {
    return { ...EMPTY_SEGMENT }
  }
}

// ── 静态配置 ──────────────────────────────────────────────────────────────
const SEGMENTS = [
  {
    key: "marketPreJson" as const,
    label: "盘前行情",
    time: "开盘前",
    notePlaceholder: "盘前期货走势、缺口大小、关键价位突破情况...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketOpenJson" as const,
    label: "开盘行情",
    time: "09:30–10:00",
    notePlaceholder: "开盘方向、首段走势、VWAP 关系、成交量...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketMidJson" as const,
    label: "盘中行情",
    time: "10:00–13:00",
    notePlaceholder: "趋势延续或反转、震荡区间、关键支撑/阻力测试...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketAfternoonJson" as const,
    label: "午盘行情",
    time: "13:00–收盘",
    notePlaceholder: "尾盘走势、收盘强弱、次日盘前参考...",
    oppPlaceholder: "描述这个交易机会...",
  },
] as const

type SegmentKey = (typeof SEGMENTS)[number]["key"]

// ── 行情类型按钮 ──────────────────────────────────────────────────────────
const MARKET_TYPES: { value: MarketType; label: string; activeClass: string }[] = [
  { value: "RANGE", label: "震荡", activeClass: "bg-yellow-600/80 border-yellow-600 text-white" },
  { value: "TREND", label: "趋势", activeClass: "bg-blue-600/80 border-blue-600 text-white" },
]

// ── 交易结果选项 ──────────────────────────────────────────────────────────
const TRADE_RESULT_OPTIONS: { value: TradeResult; label: string; activeClass: string }[] = [
  { value: "PROFIT_MET",     label: "符合盈利预期", activeClass: "bg-green-700/80 border-green-600 text-white" },
  { value: "PROFIT_PARTIAL", label: "部分盈利",     activeClass: "bg-emerald-700/80 border-emerald-600 text-white" },
  { value: "BREAKEVEN",      label: "保本",         activeClass: "bg-gray-600/80 border-gray-500 text-white" },
  { value: "LOSS",           label: "亏损",         activeClass: "bg-red-800/80 border-red-700 text-white" },
]

// ── 单条交易机会卡片 ──────────────────────────────────────────────────────
const ENTRY_APPROACH_OPTIONS: { value: EntryApproach; label: string; activeClass: string }[] = [
  { value: "DIRECT",   label: "直接进入",   activeClass: "bg-orange-700/80 border-orange-600 text-white" },
  { value: "PULLBACK", label: "等回调进入", activeClass: "bg-sky-700/80 border-sky-600 text-white" },
]

interface OpportunityCardProps {
  opp: TradeOpportunity
  index: number
  placeholder: string
  segmentType: MarketType | null
  onChange: (patch: Partial<TradeOpportunity>) => void
  onRemove: () => void
  strategies: StrategyOption[]
}

function OpportunityCard({ opp, index, placeholder, segmentType, onChange, onRemove, strategies }: OpportunityCardProps) {
  return (
    <div className="rounded border border-border/50 bg-muted/20 p-2 space-y-2">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">机会 #{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground/50 hover:text-destructive transition-colors"
          aria-label="删除"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* 机会描述 */}
      <Textarea
        placeholder={placeholder}
        value={opp.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={2}
        className="text-xs resize-none"
      />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground shrink-0">决策周期：</span>
        {MNQ_DECISION_TIMEFRAME_OPTIONS.map((timeframe) => (
          <button
            key={timeframe}
            type="button"
            onClick={() => onChange({ decisionTimeframe: opp.decisionTimeframe === timeframe ? null : timeframe })}
            className={cn(
              "text-xs px-2.5 py-0.5 rounded border transition-colors",
              opp.decisionTimeframe === timeframe
                ? "bg-cyan-700/80 border-cyan-600 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-cyan-600 hover:text-cyan-400",
            )}
          >
            {MNQ_DECISION_TIMEFRAME_LABELS[timeframe]}
          </button>
        ))}
      </div>

      {/* 入场方式（仅 RANGE / TREND 时显示） */}
      {segmentType !== null && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground shrink-0">入场方式：</span>
          {ENTRY_APPROACH_OPTIONS.map(({ value, label, activeClass }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ entryApproach: opp.entryApproach === value ? null : value })}
              className={cn(
                "text-xs px-2.5 py-0.5 rounded border transition-colors",
                opp.entryApproach === value
                  ? activeClass
                  : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* 是否把握住 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground shrink-0">是否把握住：</span>
        <button
          type="button"
          onClick={() => onChange({ captured: opp.captured === true ? null : true, missedProcess: "" })}
          className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
            opp.captured === true
              ? "bg-green-700/70 border-green-600 text-green-100"
              : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          把握住了
        </button>
        <button
          type="button"
          onClick={() => onChange({ captured: opp.captured === false ? null : false })}
          className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
            opp.captured === false
              ? "bg-red-800/70 border-red-600 text-red-100"
              : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
          )}
        >
          <XCircle className="h-3 w-3" />
          错过了
        </button>
      </div>

      {/* 交易记录 + 结果（仅当选择"把握住了"时显示） */}
      {opp.captured === true && (
        <div className="space-y-2.5">
          {/* 交易详情 */}
          <div className="space-y-1.5 rounded border border-green-900/30 bg-green-950/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-green-400/80 font-medium uppercase tracking-wide">交易详情</span>
              {/* 做多/做空 */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ tradeDirection: opp.tradeDirection === "LONG" ? null : "LONG" })}
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded border font-medium transition-colors",
                    opp.tradeDirection === "LONG"
                      ? "bg-green-700 border-green-600 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  做多
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ tradeDirection: opp.tradeDirection === "SHORT" ? null : "SHORT" })}
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded border font-medium transition-colors",
                    opp.tradeDirection === "SHORT"
                      ? "bg-red-700 border-red-600 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                  )}
                >
                  做空
                </button>
              </div>
            </div>

            {/* 策略选择 */}
            {strategies.length > 0 && (() => {
              const selectedStrategy = strategies.find((s) => s.id === opp.strategyId)
              return (
                <div className="space-y-1.5">
                  {/* 大策略下拉 */}
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-muted-foreground">使用策略</label>
                    <select
                      value={opp.strategyId ?? ""}
                      onChange={(e) => {
                        const id = e.target.value
                        const found = strategies.find((s) => s.id === id)
                        onChange({
                          strategyId: id || null,
                          strategyName: found?.name ?? null,
                          tradeTypeId: null,
                          tradeTypeName: null,
                        })
                      }}
                      className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                    >
                      <option value="">— 选择策略（可选）—</option>
                      {strategies.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 子策略（交易类型）按钮组 */}
                  {selectedStrategy && selectedStrategy.tradeTypes.length > 0 && (
                    <div className="space-y-0.5">
                      <label className="text-[10px] text-muted-foreground">子策略类型</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedStrategy.tradeTypes.map((tt) => (
                          <button
                            key={tt.id}
                            type="button"
                            onClick={() =>
                              onChange(
                                opp.tradeTypeId === tt.id
                                  ? { tradeTypeId: null, tradeTypeName: null }
                                  : { tradeTypeId: tt.id, tradeTypeName: tt.name },
                              )
                            }
                            className={cn(
                              "text-xs px-2 py-0.5 rounded border transition-colors",
                              opp.tradeTypeId === tt.id
                                ? "bg-blue-700/80 border-blue-600 text-white"
                                : "border-muted-foreground/30 text-muted-foreground hover:border-blue-600 hover:text-blue-400",
                            )}
                          >
                            {tt.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* 时间行 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] text-muted-foreground">入场时间</label>
                <input
                  type="time"
                  value={opp.entryTime}
                  onChange={(e) => onChange({ entryTime: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-muted-foreground">出场时间</label>
                <input
                  type="time"
                  value={opp.exitTime}
                  onChange={(e) => onChange({ exitTime: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                />
              </div>
            </div>

            {/* 价格行 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] text-green-400/70">入场价</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  value={opp.entryPrice}
                  onChange={(e) => onChange({ entryPrice: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-muted-foreground">出场价</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  value={opp.exitPrice}
                  onChange={(e) => onChange({ exitPrice: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-muted-foreground">合约数</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="1"
                  value={opp.contracts}
                  onChange={(e) => onChange({ contracts: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                />
              </div>
            </div>

            {/* 止损/目标行 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[10px] text-red-400/70">止损价</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  value={opp.stopPrice}
                  onChange={(e) => onChange({ stopPrice: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-red-900/60"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[10px] text-blue-400/70">目标价</label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  value={opp.targetPrice}
                  onChange={(e) => onChange({ targetPrice: e.target.value })}
                  className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-900/60"
                />
              </div>
            </div>

            {/* 自动计算盈亏（入场价 + 出场价 + 合约数均填时显示） */}
            {(() => {
              const entry = parseFloat(opp.entryPrice)
              const exit = parseFloat(opp.exitPrice)
              const qty = parseFloat(opp.contracts || "1")
              if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
                const dir = opp.tradeDirection === "SHORT" ? -1 : 1
                const points = (exit - entry) * dir
                // MNQ 每合约每点 $2
                const pnl = points * qty * 2
                const isProfit = pnl >= 0
                return (
                  <div className="flex items-center gap-3 pt-0.5 border-t border-green-900/20">
                    <span className="text-[10px] text-muted-foreground">盈亏点数</span>
                    <span className={cn("text-xs font-medium", isProfit ? "text-green-400" : "text-red-400")}>
                      {points >= 0 ? "+" : ""}{points.toFixed(2)} pts
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-2">盈亏金额</span>
                    <span className={cn("text-xs font-medium", isProfit ? "text-green-400" : "text-red-400")}>
                      {pnl >= 0 ? "+" : ""}${pnl.toFixed(0)}
                    </span>
                  </div>
                )
              }
              return null
            })()}

            {/* 回报指标 */}
            <div className="space-y-1.5 pt-1 border-t border-green-900/20">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                回报指标
              </span>

              {/* 计划风险 */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-muted-foreground">计划风险（pts）</label>
                <div className="flex items-center gap-1.5">
                  {/* 快速选择按钮 */}
                  {["50", "100"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ plannedRiskPts: opp.plannedRiskPts === preset ? "" : preset })}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded border font-medium transition-colors shrink-0",
                        opp.plannedRiskPts === preset
                          ? "bg-orange-700/80 border-orange-600 text-white"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-orange-600 hover:text-orange-400",
                      )}
                    >
                      {preset} pts
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.25"
                    placeholder="自定义"
                    value={opp.plannedRiskPts}
                    onChange={(e) => onChange({ plannedRiskPts: e.target.value })}
                    className="w-20 rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-orange-900/60"
                  />
                </div>
              </div>

              {/* MAE / MFE */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] text-red-400/70">最大回撤 MAE（pts）</label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="0"
                    value={opp.maxDrawdownPts}
                    onChange={(e) => onChange({ maxDrawdownPts: e.target.value })}
                    className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-red-900/60"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] text-green-400/70">最高盈利 MFE（pts）</label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="0"
                    value={opp.maxFavorablePts}
                    onChange={(e) => onChange({ maxFavorablePts: e.target.value })}
                    className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                  />
                </div>
              </div>

              {/* R 倍数（自动计算） */}
              {(() => {
                const entry = parseFloat(opp.entryPrice)
                const exit = parseFloat(opp.exitPrice)
                const risk = parseFloat(opp.plannedRiskPts)
                if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0 && risk > 0) {
                  const dir = opp.tradeDirection === "SHORT" ? -1 : 1
                  const pnlPts = (exit - entry) * dir
                  const r = pnlPts / risk
                  return (
                    <div className={cn(
                      "flex items-center justify-between px-2 py-1 rounded text-xs font-medium",
                      r >= 0 ? "bg-green-950/60 text-green-400" : "bg-red-950/60 text-red-400",
                    )}>
                      <span className="text-[10px] font-normal opacity-70">R 倍数</span>
                      <span>{r >= 0 ? "+" : ""}{r.toFixed(2)} R</span>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>

          {/* 交易结果 */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-green-400/80 font-medium">交易结果</span>
            <div className="flex flex-wrap gap-1">
              {TRADE_RESULT_OPTIONS.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ tradeResult: opp.tradeResult === value ? null : value })}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    opp.tradeResult === value
                      ? activeClass
                      : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="交易过程和结果说明..."
              value={opp.tradeResultNote}
              onChange={(e) => onChange({ tradeResultNote: e.target.value })}
              rows={2}
              className="text-xs resize-none border-green-900/40 focus-visible:ring-green-900/60"
            />
          </div>

          {/* 执行评估 */}
          <div className="space-y-2 pt-1 border-t border-green-900/20">
            <span className="text-[10px] text-green-400/80 font-medium uppercase tracking-wide">执行评估</span>

            {/* 进入评估 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground shrink-0">进入：</span>
                <button
                  type="button"
                  onClick={() => onChange({ entryAccuracy: opp.entryAccuracy === "CORRECT" ? null : "CORRECT" })}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                    opp.entryAccuracy === "CORRECT"
                      ? "bg-green-700/80 border-green-600 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                  进入准确
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ entryAccuracy: opp.entryAccuracy === "WRONG" ? null : "WRONG" })}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                    opp.entryAccuracy === "WRONG"
                      ? "bg-red-800/80 border-red-700 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                  进入有误
                </button>
              </div>
              {opp.entryAccuracy !== null && (
                <Textarea
                  placeholder={opp.entryAccuracy === "CORRECT" ? "进入准确的原因（信号清晰、条件完全满足...）" : "进入有误的原因（追高、信号不完整、仓位过重...）"}
                  value={opp.entryAccuracyNote}
                  onChange={(e) => onChange({ entryAccuracyNote: e.target.value })}
                  rows={2}
                  className={cn(
                    "text-xs resize-none",
                    opp.entryAccuracy === "CORRECT"
                      ? "border-green-900/40 focus-visible:ring-green-900/60"
                      : "border-red-900/40 focus-visible:ring-red-900/60",
                  )}
                />
              )}
            </div>

            {/* 退出评估 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground shrink-0">退出：</span>
                <button
                  type="button"
                  onClick={() => onChange({ exitAccuracy: opp.exitAccuracy === "CORRECT" ? null : "CORRECT" })}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                    opp.exitAccuracy === "CORRECT"
                      ? "bg-green-700/80 border-green-600 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                  退出准确
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ exitAccuracy: opp.exitAccuracy === "WRONG" ? null : "WRONG" })}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                    opp.exitAccuracy === "WRONG"
                      ? "bg-red-800/80 border-red-700 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                  退出有误
                </button>
              </div>
              {opp.exitAccuracy !== null && (
                <Textarea
                  placeholder={opp.exitAccuracy === "CORRECT" ? "退出准确的原因（目标达到、按计划止盈...）" : "退出有误的原因（过早平仓、扛单、没有执行止损...）"}
                  value={opp.exitAccuracyNote}
                  onChange={(e) => onChange({ exitAccuracyNote: e.target.value })}
                  rows={2}
                  className={cn(
                    "text-xs resize-none",
                    opp.exitAccuracy === "CORRECT"
                      ? "border-green-900/40 focus-visible:ring-green-900/60"
                      : "border-red-900/40 focus-visible:ring-red-900/60",
                  )}
                />
              )}
            </div>
          </div>

          {/* 持仓过夜 */}
          <div className="space-y-1.5 pt-1 border-t border-green-900/20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-green-400/80 font-medium">持仓过夜</span>
              <button
                type="button"
                onClick={() => onChange({ heldOvernight: false, overnightReason: "" })}
                className={cn(
                  "text-xs px-2 py-0.5 rounded border transition-colors",
                  !opp.heldOvernight
                    ? "bg-muted border-muted-foreground/40 text-foreground"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                )}
              >
                否
              </button>
              <button
                type="button"
                onClick={() => onChange({ heldOvernight: true })}
                className={cn(
                  "text-xs px-2 py-0.5 rounded border transition-colors",
                  opp.heldOvernight
                    ? "bg-indigo-700/80 border-indigo-600 text-white"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-indigo-600 hover:text-indigo-400",
                )}
              >
                是
              </button>
            </div>
            {opp.heldOvernight && (
              <Textarea
                placeholder="持仓过夜理由（目标未达到、行情持续、计划延续...）"
                value={opp.overnightReason}
                onChange={(e) => onChange({ overnightReason: e.target.value })}
                rows={2}
                className="text-xs resize-none border-indigo-900/40 focus-visible:ring-indigo-900/60"
              />
            )}
          </div>
        </div>
      )}

      {/* 错过经过 + 假设 R/R（仅当选择"错过了"时显示） */}
      {opp.captured === false && (
        <div className="space-y-2 rounded border border-red-900/30 bg-red-950/10 p-2">
          {/* 交易方向 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-red-400/80 font-medium shrink-0">交易方向：</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange({ tradeDirection: opp.tradeDirection === "LONG" ? null : "LONG" })}
                className={cn(
                  "text-xs px-2.5 py-0.5 rounded border font-medium transition-colors",
                  opp.tradeDirection === "LONG"
                    ? "bg-green-700 border-green-600 text-white"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                )}
              >
                做多
              </button>
              <button
                type="button"
                onClick={() => onChange({ tradeDirection: opp.tradeDirection === "SHORT" ? null : "SHORT" })}
                className={cn(
                  "text-xs px-2.5 py-0.5 rounded border font-medium transition-colors",
                  opp.tradeDirection === "SHORT"
                    ? "bg-red-700 border-red-600 text-white"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                )}
              >
                做空
              </button>
            </div>
          </div>

          {/* 策略选择 */}
          {strategies.length > 0 && (() => {
            const selectedStrategy = strategies.find((s) => s.id === opp.strategyId)
            return (
              <div className="space-y-1.5">
                <div className="space-y-0.5">
                  <label className="text-[10px] text-red-400/80 font-medium">使用策略</label>
                  <select
                    value={opp.strategyId ?? ""}
                    onChange={(e) => {
                      const id = e.target.value
                      const found = strategies.find((s) => s.id === id)
                      onChange({
                        strategyId: id || null,
                        strategyName: found?.name ?? null,
                        tradeTypeId: null,
                        tradeTypeName: null,
                      })
                    }}
                    className="w-full rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-red-900/60"
                  >
                    <option value="">— 选择策略（可选）—</option>
                    {strategies.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {selectedStrategy && selectedStrategy.tradeTypes.length > 0 && (
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-muted-foreground">子策略类型</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedStrategy.tradeTypes.map((tt) => (
                        <button
                          key={tt.id}
                          type="button"
                          onClick={() =>
                            onChange(
                              opp.tradeTypeId === tt.id
                                ? { tradeTypeId: null, tradeTypeName: null }
                                : { tradeTypeId: tt.id, tradeTypeName: tt.name },
                            )
                          }
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border transition-colors",
                            opp.tradeTypeId === tt.id
                              ? "bg-blue-700/80 border-blue-600 text-white"
                              : "border-muted-foreground/30 text-muted-foreground hover:border-blue-600 hover:text-blue-400",
                          )}
                        >
                          {tt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          <div className="space-y-1">
            <span className="text-[10px] text-red-400/80 font-medium">错过经过</span>
            <Textarea
              placeholder="当时发生了什么？为什么没有入场？（犹豫、看漏信号、仓位已满...）"
              value={opp.missedProcess}
              onChange={(e) => onChange({ missedProcess: e.target.value })}
              rows={2}
              className="text-xs resize-none border-red-900/40 focus-visible:ring-red-900/60"
            />
          </div>

          {/* 假设 R/R */}
          <div className="space-y-1.5 pt-1 border-t border-red-900/20">
            <span className="text-[10px] font-medium text-red-400/80 uppercase tracking-wide">假设 Risk / Return（pts）</span>
            <div className="grid grid-cols-2 gap-2">
              {/* 风险 */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-red-400/70">风险 Risk（pts）</label>
                <div className="flex items-center gap-1 flex-wrap">
                  {["50", "100"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ missedRiskPts: opp.missedRiskPts === preset ? "" : preset })}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded border font-medium transition-colors shrink-0",
                        opp.missedRiskPts === preset
                          ? "bg-red-700/80 border-red-600 text-white"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.25"
                    placeholder="自定义"
                    value={opp.missedRiskPts}
                    onChange={(e) => onChange({ missedRiskPts: e.target.value })}
                    className="w-16 rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-red-900/60"
                  />
                </div>
              </div>

              {/* 回报 */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-green-400/70">回报 Return（pts）</label>
                <div className="flex items-center gap-1 flex-wrap">
                  {["100", "200"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onChange({ missedReturnPts: opp.missedReturnPts === preset ? "" : preset })}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded border font-medium transition-colors shrink-0",
                        opp.missedReturnPts === preset
                          ? "bg-green-700/80 border-green-600 text-white"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                  <input
                    type="number"
                    step="0.25"
                    placeholder="自定义"
                    value={opp.missedReturnPts}
                    onChange={(e) => onChange({ missedReturnPts: e.target.value })}
                    className="w-16 rounded border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-green-900/60"
                  />
                </div>
              </div>
            </div>

            {/* 假设 R 倍数（自动计算） */}
            {(() => {
              const risk = parseFloat(opp.missedRiskPts)
              const ret = parseFloat(opp.missedReturnPts)
              if (risk > 0 && ret > 0) {
                const r = ret / risk
                return (
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="text-[10px] text-muted-foreground">假设 R 倍数</span>
                    <span className="text-xs font-medium text-amber-400">
                      {r.toFixed(2)} R
                    </span>
                  </div>
                )
              }
              return null
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────────
interface Props {
  plan: MnqDailyPlan
  date: string
}

export function MnqMarketNotes({ plan, date }: Props) {
  const router = useRouter()

  const [segments, setSegments] = useState<Record<SegmentKey, MarketSegmentData>>({
    marketPreJson:       parseSegment(plan.marketPreJson),
    marketOpenJson:      parseSegment(plan.marketOpenJson),
    marketMidJson:       parseSegment(plan.marketMidJson),
    marketAfternoonJson: parseSegment(plan.marketAfternoonJson),
  })
  const [heldOvernight, setHeldOvernight] = useState<boolean | null>(
    plan.heldOvernight ?? null,
  )
  const [overnightNote, setOvernightNote] = useState(plan.overnightNote ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [strategies, setStrategies] = useState<StrategyOption[]>([])

  useEffect(() => {
    fetch("/api/strategies")
      .then((r) => r.json())
      .then((json: { success: boolean; data: Array<{ id: string; name: string; isActive: boolean; tradeTypes: TradeTypeOption[] }> }) => {
        if (json.success) {
          setStrategies(
            json.data
              .filter((s) => s.isActive)
              .map((s) => ({ id: s.id, name: s.name, tradeTypes: s.tradeTypes ?? [] })),
          )
        }
      })
      .catch(() => { /* silent */ })
  }, [])

  function updateSegment(key: SegmentKey, patch: Partial<MarketSegmentData>) {
    setSegments((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
    setSaved(false)
  }

  function toggleType(key: SegmentKey, type: MarketType) {
    const current = segments[key].type
    updateSegment(key, { type: current === type ? null : type })
  }

  function addOpportunity(key: SegmentKey) {
    const prev = segments[key].opportunities
    updateSegment(key, { opportunities: [...prev, createOpportunity()] })
  }

  function updateOpportunity(key: SegmentKey, oppId: string, patch: Partial<TradeOpportunity>) {
    setSegments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        opportunities: prev[key].opportunities.map((o) =>
          o.id === oppId ? { ...o, ...patch } : o,
        ),
      },
    }))
    setSaved(false)
  }

  function removeOpportunity(key: SegmentKey, oppId: string) {
    setSegments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        opportunities: prev[key].opportunities.filter((o) => o.id !== oppId),
      },
    }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const toJson = (seg: MarketSegmentData) => {
        const isEmpty =
          seg.type === null &&
          !seg.note.trim() &&
          seg.opportunities.length === 0
        return isEmpty ? null : JSON.stringify(seg)
      }

      const res = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketPreJson:       toJson(segments.marketPreJson),
          marketOpenJson:      toJson(segments.marketOpenJson),
          marketMidJson:       toJson(segments.marketMidJson),
          marketAfternoonJson: toJson(segments.marketAfternoonJson),
          heldOvernight,
          overnightNote: overnightNote.trim() || null,
        }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success("行情记录已保存")
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

  const hasAnyData = Object.values(segments).some(
    (s) => s.type !== null || s.note.trim() || s.opportunities.length > 0,
  )

  return (
    <div className="space-y-4 pt-2 border-t border-border/40">
      {/* 标题 */}
      <div className="flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-xs font-medium text-cyan-400">MNQ 行情记录</span>
      </div>

      {/* 四个时段 */}
      <div className="space-y-4">
        {SEGMENTS.map(({ key, label, time, notePlaceholder, oppPlaceholder }) => {
          const seg = segments[key]
          return (
            <div key={key} className="space-y-2 rounded-md border border-border/40 p-2.5">
              {/* 时段标题 */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground/90">{label}</span>
                <span className="text-[10px] text-muted-foreground/60">{time}</span>
              </div>

              {/* ① 行情情况：类型按钮 + 判断准确性 + 文本 */}
              <div className="space-y-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  行情情况
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {MARKET_TYPES.map(({ value, label: btnLabel, activeClass }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleType(key, value)}
                      className={cn(
                        "text-xs px-2.5 py-0.5 rounded border transition-colors",
                        seg.type === value
                          ? activeClass
                          : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                      )}
                    >
                      {btnLabel}
                    </button>
                  ))}

                  {/* 判断准确性（仅当选择了行情类型后显示） */}
                  {seg.type !== null && (
                    <>
                      <span className="text-[10px] text-muted-foreground/50 mx-0.5">|</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSegment(key, {
                            accuracy: seg.accuracy === "CORRECT" ? null : "CORRECT",
                          })
                        }
                        className={cn(
                          "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                          seg.accuracy === "CORRECT"
                            ? "bg-green-700/80 border-green-600 text-white"
                            : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                        )}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        判断准确
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSegment(key, {
                            accuracy: seg.accuracy === "WRONG" ? null : "WRONG",
                          })
                        }
                        className={cn(
                          "flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors",
                          seg.accuracy === "WRONG"
                            ? "bg-red-800/80 border-red-700 text-white"
                            : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
                        )}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        判断有误
                      </button>
                    </>
                  )}
                </div>
                <Textarea
                  placeholder={notePlaceholder}
                  value={seg.note}
                  onChange={(e) => updateSegment(key, { note: e.target.value })}
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>

              {/* ② 交易机会列表 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    交易机会
                    {seg.opportunities.length > 0 && (
                      <span className="ml-1 text-muted-foreground/50">
                        ({seg.opportunities.length})
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => addOpportunity(key)}
                    className="flex items-center gap-0.5 text-[10px] text-cyan-500 hover:text-cyan-300 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    添加机会
                  </button>
                </div>

                {seg.opportunities.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => addOpportunity(key)}
                    className="w-full rounded border border-dashed border-border/40 py-3 text-[11px] text-muted-foreground/50 hover:border-cyan-800 hover:text-cyan-600 transition-colors"
                  >
                    + 点击添加交易机会
                  </button>
                ) : (
                  <div className="space-y-2">
                    {seg.opportunities.map((opp, idx) => (
                      <OpportunityCard
                        key={opp.id}
                        opp={opp}
                        index={idx}
                        placeholder={oppPlaceholder}
                        segmentType={seg.type}
                        onChange={(patch) => updateOpportunity(key, opp.id, patch)}
                        onRemove={() => removeOpportunity(key, opp.id)}
                        strategies={strategies}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => addOpportunity(key)}
                      className="flex items-center gap-1 text-[10px] text-cyan-600/70 hover:text-cyan-400 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      再添加一个机会
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 持仓过夜 */}
      <div className="rounded-md border border-border/40 p-2.5 space-y-2">
        <div className="flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs font-medium text-indigo-400">持仓过夜</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setHeldOvernight((prev) => (prev === true ? null : true))
              setSaved(false)
            }}
            className={cn(
              "flex items-center gap-1 text-xs px-2.5 py-0.5 rounded border transition-colors",
              heldOvernight === true
                ? "bg-indigo-700/80 border-indigo-600 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-indigo-600 hover:text-indigo-400",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            是，持仓过夜
          </button>
          <button
            type="button"
            onClick={() => {
              setHeldOvernight((prev) => (prev === false ? null : false))
              setSaved(false)
            }}
            className={cn(
              "flex items-center gap-1 text-xs px-2.5 py-0.5 rounded border transition-colors",
              heldOvernight === false
                ? "bg-green-700/80 border-green-600 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
            )}
          >
            <XCircle className="h-3 w-3" />
            否，当日平仓
          </button>
          {heldOvernight !== null && (
            <button
              type="button"
              onClick={() => {
                setHeldOvernight(null)
                setSaved(false)
              }}
              className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              清除
            </button>
          )}
        </div>
        {heldOvernight === true && (
          <Textarea
            placeholder="持仓原因、计划过夜目标、风险控制措施..."
            value={overnightNote}
            onChange={(e) => {
              setOvernightNote(e.target.value)
              setSaved(false)
            }}
            rows={2}
            className="text-xs resize-none border-indigo-900/40 focus-visible:ring-indigo-900/60"
          />
        )}
      </div>

      {/* 保存按钮 */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5 border-cyan-800 text-cyan-400 hover:bg-cyan-950"
          onClick={handleSave}
          disabled={saving || !hasAnyData}
        >
          <Save className="h-3 w-3" />
          {saving ? "保存中..." : "保存行情记录"}
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
