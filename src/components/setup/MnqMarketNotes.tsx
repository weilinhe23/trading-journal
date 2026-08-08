"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Save,
  Check,
  TrendingUp,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Moon,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  MNQ_DECISION_TIMEFRAME_LABELS,
  MNQ_DECISION_TIMEFRAME_OPTIONS,
  MNQ_MARKET_ACCURACY_OPTIONS,
  MNQ_MARKET_DEVIATION_REASON_OPTIONS,
  MNQ_MARKET_DIRECTION_OPTIONS,
  MNQ_MARKET_IMPACT_TYPE_OPTIONS,
  MNQ_MARKET_OPPORTUNITY_IMPACT_OPTIONS,
  MNQ_MARKET_TYPE_OPTIONS,
  MNQ_MISSED_REASON_OPTIONS,
  isMnqDecisionTimeframe,
  isMnqMarketAccuracy,
  isMnqMarketDeviationReason,
  isMnqMarketDirection,
  isMnqMarketImpactType,
  isMnqMarketOpportunityImpact,
  isMnqMarketType,
  isMnqMissedReasonCategory,
  type MnqDecisionTimeframe,
  type MnqMarketAccuracy,
  type MnqMarketDeviationReason,
  type MnqMarketDirection,
  type MnqMarketImpactType,
  type MnqMarketOpportunityImpact,
  type MnqMarketType,
  type MnqMissedReasonCategory,
} from "~/types";
import type { MnqDailyPlan } from "../../../generated/prisma";

interface TradeTypeOption {
  id: string;
  name: string;
}

interface StrategyOption {
  id: string;
  name: string;
  tradeTypes: TradeTypeOption[];
}

// ── 类型 ──────────────────────────────────────────────────────────────────
export type TradeResult =
  | "PROFIT_MET"
  | "PROFIT_PARTIAL"
  | "BREAKEVEN"
  | "LOSS";

export type EntryApproach = "DIRECT" | "PULLBACK";

type ExecutionAccuracy = "CORRECT" | "WRONG";

export interface TradeOpportunity {
  id: string;
  description: string;
  decisionTimeframe: MnqDecisionTimeframe | null;
  entryApproach: EntryApproach | null; // 直接进入 or 等回调进入
  captured: boolean | null; // null = 未标记, true = 把握住, false = 错过
  missedReasonCategory: MnqMissedReasonCategory | null; // 主要错失原因分类
  missedProcess: string; // 仅当 captured === false 时使用
  tradeResult: TradeResult | null; // 仅当 captured === true 时使用
  tradeResultNote: string; // 交易结果备注
  // 具体交易记录（仅当 captured === true 时使用）
  tradeDirection: "LONG" | "SHORT" | null;
  entryTime: string; // HH:MM
  exitTime: string; // HH:MM
  entryPrice: string; // 字符串方便输入，空字符串表示未填
  exitPrice: string;
  contracts: string; // 合约数
  stopPrice: string; // 止损价
  targetPrice: string; // 目标价
  strategyId: string | null; // 关联策略库 ID
  strategyName: string | null; // 关联策略名称（冗余存储，便于展示）
  tradeTypeId: string | null; // 关联子策略（交易类型）ID
  tradeTypeName: string | null; // 关联子策略名称
  // 回报指标（字符串方便输入，空字符串表示未填）
  plannedRiskPts: string; // 计划风险（点位）
  plannedReturnPts: string; // 计划回报（点位），用于自动计算计划目标 R
  maxDrawdownPts: string; // MAE 最大回撤（点位）
  maxFavorablePts: string; // MFE 最高盈利空间（点位）
  // 持仓过夜
  heldOvernight: boolean; // 是否持仓过夜，默认 false
  overnightReason: string; // 持仓过夜理由
  // 执行评估（仅当 captured === true 时使用）
  entryAccuracy: ExecutionAccuracy | null; // 进入是否准确
  entryAccuracyNote: string; // 进入评估说明
  exitAccuracy: ExecutionAccuracy | null; // 退出是否准确
  exitAccuracyNote: string; // 退出评估说明
  // 错失交易的事前计划 R
  missedPlannedRiskPts: string; // 当时计划风险（点位）
  missedPlannedReturnPts: string; // 当时计划回报（点位）
  // 错过交易的假设 R
  missedRiskPts: string; // 假设风险（点位），仅当 captured === false
  missedReturnPts: string; // 假设回报（点位），仅当 captured === false
}

export interface MarketSegmentData {
  type: MnqMarketType | null;
  note: string;
  expectedType: MnqMarketType | null;
  expectedDirection: MnqMarketDirection | null;
  expectedNote: string;
  actualType: MnqMarketType | null;
  actualDirection: MnqMarketDirection | null;
  actualNote: string;
  accuracy: MnqMarketAccuracy | null;
  deviationReason: MnqMarketDeviationReason | null;
  secondaryDeviationReasons: MnqMarketDeviationReason[];
  deviationNote: string;
  opportunityImpact: MnqMarketOpportunityImpact | null;
  impactTypes: MnqMarketImpactType[];
  impactOpportunityIds: string[];
  impactNote: string;
  premarketPhases: PremarketPhasesData;
  opportunities: TradeOpportunity[];
}

type PremarketPhaseKey = "overnight" | "usPremarket";

interface PremarketPhaseData {
  type: MnqMarketType | null;
  direction: MnqMarketDirection | null;
  note: string;
}

type PremarketPhasesData = Record<PremarketPhaseKey, PremarketPhaseData>;

function createEmptyPremarketPhases(): PremarketPhasesData {
  return {
    overnight: { type: null, direction: null, note: "" },
    usPremarket: { type: null, direction: null, note: "" },
  };
}

const EMPTY_SEGMENT: MarketSegmentData = {
  type: null,
  note: "",
  expectedType: null,
  expectedDirection: null,
  expectedNote: "",
  actualType: null,
  actualDirection: null,
  actualNote: "",
  accuracy: null,
  deviationReason: null,
  secondaryDeviationReasons: [],
  deviationNote: "",
  opportunityImpact: null,
  impactTypes: [],
  impactOpportunityIds: [],
  impactNote: "",
  premarketPhases: createEmptyPremarketPhases(),
  opportunities: [],
};

function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function createOpportunity(): TradeOpportunity {
  return {
    id: genId(),
    description: "",
    decisionTimeframe: null,
    entryApproach: null,
    captured: null,
    missedReasonCategory: null,
    missedProcess: "",
    tradeResult: null,
    tradeResultNote: "",
    tradeDirection: null,
    entryTime: "",
    exitTime: "",
    entryPrice: "",
    exitPrice: "",
    contracts: "",
    stopPrice: "",
    targetPrice: "",
    strategyId: null,
    strategyName: null,
    tradeTypeId: null,
    tradeTypeName: null,
    plannedRiskPts: "",
    plannedReturnPts: "",
    maxDrawdownPts: "",
    maxFavorablePts: "",
    heldOvernight: false,
    overnightReason: "",
    entryAccuracy: null,
    entryAccuracyNote: "",
    exitAccuracy: null,
    exitAccuracyNote: "",
    missedPlannedRiskPts: "",
    missedPlannedReturnPts: "",
    missedRiskPts: "",
    missedReturnPts: "",
  };
}

function parseSegmentFields(
  parsed: Record<string, unknown>,
): Omit<MarketSegmentData, "opportunities"> {
  const legacyType = isMnqMarketType(parsed.type) ? parsed.type : null;
  const legacyNote = typeof parsed.note === "string" ? parsed.note : "";
  const secondaryDeviationReasons = Array.isArray(
    parsed.secondaryDeviationReasons,
  )
    ? parsed.secondaryDeviationReasons.filter(isMnqMarketDeviationReason)
    : [];
  const impactTypes = Array.isArray(parsed.impactTypes)
    ? parsed.impactTypes.filter(isMnqMarketImpactType)
    : [];
  const impactOpportunityIds = Array.isArray(parsed.impactOpportunityIds)
    ? parsed.impactOpportunityIds.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const rawPremarketPhases =
    parsed.premarketPhases && typeof parsed.premarketPhases === "object"
      ? (parsed.premarketPhases as Record<string, unknown>)
      : null;
  const parsePremarketPhase = (key: PremarketPhaseKey): PremarketPhaseData => {
    const rawPhase = rawPremarketPhases?.[key];
    if (!rawPhase || typeof rawPhase !== "object") {
      return { type: null, direction: null, note: "" };
    }
    const phase = rawPhase as Record<string, unknown>;
    return {
      type: isMnqMarketType(phase.type) ? phase.type : null,
      direction: isMnqMarketDirection(phase.direction) ? phase.direction : null,
      note: typeof phase.note === "string" ? phase.note : "",
    };
  };
  const premarketPhases = rawPremarketPhases
    ? {
        overnight: parsePremarketPhase("overnight"),
        usPremarket: parsePremarketPhase("usPremarket"),
      }
    : {
        overnight: { type: null, direction: null, note: "" },
        // 旧盘前记录最接近开盘前的美国盘前时段，自动迁移到这里显示。
        usPremarket: { type: legacyType, direction: null, note: legacyNote },
      };

  return {
    type: legacyType,
    note: legacyNote,
    expectedType: isMnqMarketType(parsed.expectedType)
      ? parsed.expectedType
      : null,
    expectedDirection: isMnqMarketDirection(parsed.expectedDirection)
      ? parsed.expectedDirection
      : null,
    expectedNote:
      typeof parsed.expectedNote === "string" ? parsed.expectedNote : "",
    actualType: isMnqMarketType(parsed.actualType)
      ? parsed.actualType
      : legacyType,
    actualDirection: isMnqMarketDirection(parsed.actualDirection)
      ? parsed.actualDirection
      : null,
    actualNote:
      typeof parsed.actualNote === "string" ? parsed.actualNote : legacyNote,
    accuracy: isMnqMarketAccuracy(parsed.accuracy) ? parsed.accuracy : null,
    deviationReason: isMnqMarketDeviationReason(parsed.deviationReason)
      ? parsed.deviationReason
      : null,
    secondaryDeviationReasons,
    deviationNote:
      typeof parsed.deviationNote === "string" ? parsed.deviationNote : "",
    opportunityImpact: isMnqMarketOpportunityImpact(parsed.opportunityImpact)
      ? parsed.opportunityImpact
      : null,
    impactTypes,
    impactOpportunityIds,
    impactNote: typeof parsed.impactNote === "string" ? parsed.impactNote : "",
    premarketPhases,
  };
}

// 兼容旧格式（opportunity: string）和新格式（opportunities: TradeOpportunity[]）
function parseSegment(raw: string | null | undefined): MarketSegmentData {
  if (!raw)
    return { ...EMPTY_SEGMENT, premarketPhases: createEmptyPremarketPhases() };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const segmentFields = parseSegmentFields(parsed);
    // 旧格式迁移：opportunity string → 单条 opportunities
    if (
      typeof parsed.opportunity === "string" &&
      !Array.isArray(parsed.opportunities)
    ) {
      const opp = parsed.opportunity.trim();
      return {
        ...segmentFields,
        opportunities: opp
          ? [
              {
                id: genId(),
                description: opp,
                decisionTimeframe: null,
                entryApproach: null,
                captured: null,
                missedReasonCategory: null,
                missedProcess: "",
                tradeResult: null,
                tradeResultNote: "",
                tradeDirection: null,
                entryTime: "",
                exitTime: "",
                entryPrice: "",
                exitPrice: "",
                contracts: "",
                stopPrice: "",
                targetPrice: "",
                strategyId: null,
                strategyName: null,
                tradeTypeId: null,
                tradeTypeName: null,
                plannedRiskPts: "",
                plannedReturnPts: "",
                maxDrawdownPts: "",
                maxFavorablePts: "",
                heldOvernight: false,
                overnightReason: "",
                entryAccuracy: null,
                entryAccuracyNote: "",
                exitAccuracy: null,
                exitAccuracyNote: "",
                missedPlannedRiskPts: "",
                missedPlannedReturnPts: "",
                missedRiskPts: "",
                missedReturnPts: "",
              },
            ]
          : [],
      };
    }
    const opps = Array.isArray(parsed.opportunities)
      ? (parsed.opportunities as TradeOpportunity[]).map((o) => ({
          ...o,
          decisionTimeframe: isMnqDecisionTimeframe(o.decisionTimeframe)
            ? o.decisionTimeframe
            : null,
          entryApproach: o.entryApproach ?? null,
          missedReasonCategory: isMnqMissedReasonCategory(
            o.missedReasonCategory,
          )
            ? o.missedReasonCategory
            : null,
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
          plannedReturnPts: o.plannedReturnPts ?? "",
          maxDrawdownPts: o.maxDrawdownPts ?? "",
          maxFavorablePts: o.maxFavorablePts ?? "",
          heldOvernight: o.heldOvernight ?? false,
          overnightReason: o.overnightReason ?? "",
          entryAccuracy: o.entryAccuracy ?? null,
          entryAccuracyNote: o.entryAccuracyNote ?? "",
          exitAccuracy: o.exitAccuracy ?? null,
          exitAccuracyNote: o.exitAccuracyNote ?? "",
          missedPlannedRiskPts: o.missedPlannedRiskPts ?? "",
          missedPlannedReturnPts: o.missedPlannedReturnPts ?? "",
          missedRiskPts: o.missedRiskPts ?? "",
          missedReturnPts: o.missedReturnPts ?? "",
        }))
      : [];
    return {
      ...segmentFields,
      opportunities: opps,
    };
  } catch {
    return { ...EMPTY_SEGMENT, premarketPhases: createEmptyPremarketPhases() };
  }
}

// ── 静态配置 ──────────────────────────────────────────────────────────────
const SEGMENTS = [
  {
    key: "marketPreJson" as const,
    label: "盘前行情",
    time: "开盘前",
    isCore: false,
    notePlaceholder: "盘前期货走势、缺口大小、关键价位突破情况...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketOpenJson" as const,
    label: "开盘行情",
    time: "09:30–10:00",
    isCore: true,
    notePlaceholder: "开盘方向、首段走势、VWAP 关系、成交量...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketMidJson" as const,
    label: "盘中行情",
    time: "10:00–13:00",
    isCore: true,
    notePlaceholder: "趋势延续或反转、震荡区间、关键支撑/阻力测试...",
    oppPlaceholder: "描述这个交易机会...",
  },
  {
    key: "marketAfternoonJson" as const,
    label: "午盘行情",
    time: "13:00–收盘",
    isCore: false,
    notePlaceholder: "尾盘走势、收盘强弱、次日盘前参考...",
    oppPlaceholder: "描述这个交易机会...",
  },
] as const;

type SegmentKey = (typeof SEGMENTS)[number]["key"];

// ── 行情类型按钮 ──────────────────────────────────────────────────────────
const MARKET_TYPES: {
  value: MnqMarketType;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "RANGE",
    label: "震荡",
    activeClass: "bg-yellow-600/80 border-yellow-600 text-white",
  },
  {
    value: "TREND",
    label: "趋势",
    activeClass: "bg-blue-600/80 border-blue-600 text-white",
  },
];

const PREMARKET_PHASES = [
  {
    key: "overnight" as const,
    label: "隔夜行情",
    time: "19:00 之前",
    notePlaceholder: "记录隔夜走势、ONH/ONL、亚洲与欧洲时段结构及重要 Level...",
  },
  {
    key: "usPremarket" as const,
    label: "美国盘前行情",
    time: "19:00–21:30",
    notePlaceholder: "记录美股盘前走势、消息反应、PMH/PML 与开盘前方向变化...",
  },
] as const;

// ── 交易结果选项 ──────────────────────────────────────────────────────────
const TRADE_RESULT_OPTIONS: {
  value: TradeResult;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "PROFIT_MET",
    label: "符合盈利预期",
    activeClass: "bg-green-700/80 border-green-600 text-white",
  },
  {
    value: "PROFIT_PARTIAL",
    label: "部分盈利",
    activeClass: "bg-emerald-700/80 border-emerald-600 text-white",
  },
  {
    value: "BREAKEVEN",
    label: "保本",
    activeClass: "bg-gray-600/80 border-gray-500 text-white",
  },
  {
    value: "LOSS",
    label: "亏损",
    activeClass: "bg-red-800/80 border-red-700 text-white",
  },
];

// ── 单条交易机会卡片 ──────────────────────────────────────────────────────
const ENTRY_APPROACH_OPTIONS: {
  value: EntryApproach;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "DIRECT",
    label: "直接进入",
    activeClass: "bg-orange-700/80 border-orange-600 text-white",
  },
  {
    value: "PULLBACK",
    label: "等回调进入",
    activeClass: "bg-sky-700/80 border-sky-600 text-white",
  },
];

interface OpportunityCardProps {
  opp: TradeOpportunity;
  index: number;
  placeholder: string;
  segmentType: MnqMarketType | null;
  onChange: (patch: Partial<TradeOpportunity>) => void;
  onRemove: () => void;
  strategies: StrategyOption[];
}

function OpportunityCard({
  opp,
  index,
  placeholder,
  segmentType,
  onChange,
  onRemove,
  strategies,
}: OpportunityCardProps) {
  return (
    <div className="border-border/50 bg-muted/20 space-y-2 rounded border p-2">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[10px]">
          机会 #{index + 1}
        </span>
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
        className="resize-none text-xs"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-[10px]">
          决策周期：
        </span>
        {MNQ_DECISION_TIMEFRAME_OPTIONS.map((timeframe) => (
          <button
            key={timeframe}
            type="button"
            onClick={() =>
              onChange({
                decisionTimeframe:
                  opp.decisionTimeframe === timeframe ? null : timeframe,
              })
            }
            className={cn(
              "rounded border px-2.5 py-0.5 text-xs transition-colors",
              opp.decisionTimeframe === timeframe
                ? "border-cyan-600 bg-cyan-700/80 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-cyan-600 hover:text-cyan-400",
            )}
          >
            {MNQ_DECISION_TIMEFRAME_LABELS[timeframe]}
          </button>
        ))}
      </div>

      {/* 入场方式（仅 RANGE / TREND 时显示） */}
      {segmentType !== null && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-[10px]">
            入场方式：
          </span>
          {ENTRY_APPROACH_OPTIONS.map(({ value, label, activeClass }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                onChange({
                  entryApproach: opp.entryApproach === value ? null : value,
                })
              }
              className={cn(
                "rounded border px-2.5 py-0.5 text-xs transition-colors",
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
        <span className="text-muted-foreground shrink-0 text-[10px]">
          是否把握住：
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              captured: opp.captured === true ? null : true,
              missedReasonCategory: null,
              missedProcess: "",
            })
          }
          className={cn(
            "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
            opp.captured === true
              ? "border-green-600 bg-green-700/70 text-green-100"
              : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          把握住了
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ captured: opp.captured === false ? null : false })
          }
          className={cn(
            "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
            opp.captured === false
              ? "border-red-600 bg-red-800/70 text-red-100"
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
              <span className="text-[10px] font-medium tracking-wide text-green-400/80 uppercase">
                交易详情
              </span>
              {/* 做多/做空 */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      tradeDirection:
                        opp.tradeDirection === "LONG" ? null : "LONG",
                    })
                  }
                  className={cn(
                    "rounded border px-2.5 py-0.5 text-xs font-medium transition-colors",
                    opp.tradeDirection === "LONG"
                      ? "border-green-600 bg-green-700 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  做多
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      tradeDirection:
                        opp.tradeDirection === "SHORT" ? null : "SHORT",
                    })
                  }
                  className={cn(
                    "rounded border px-2.5 py-0.5 text-xs font-medium transition-colors",
                    opp.tradeDirection === "SHORT"
                      ? "border-red-600 bg-red-700 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                  )}
                >
                  做空
                </button>
              </div>
            </div>

            {/* 策略选择 */}
            {strategies.length > 0 &&
              (() => {
                const selectedStrategy = strategies.find(
                  (s) => s.id === opp.strategyId,
                );
                return (
                  <div className="space-y-1.5">
                    {/* 大策略下拉 */}
                    <div className="space-y-0.5">
                      <label className="text-muted-foreground text-[10px]">
                        使用策略
                      </label>
                      <select
                        value={opp.strategyId ?? ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const found = strategies.find((s) => s.id === id);
                          onChange({
                            strategyId: id || null,
                            strategyName: found?.name ?? null,
                            tradeTypeId: null,
                            tradeTypeName: null,
                          });
                        }}
                        className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                      >
                        <option value="">— 选择策略（可选）—</option>
                        {strategies.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 子策略（交易类型）按钮组 */}
                    {selectedStrategy &&
                      selectedStrategy.tradeTypes.length > 0 && (
                        <div className="space-y-0.5">
                          <label className="text-muted-foreground text-[10px]">
                            子策略类型
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {selectedStrategy.tradeTypes.map((tt) => (
                              <button
                                key={tt.id}
                                type="button"
                                onClick={() =>
                                  onChange(
                                    opp.tradeTypeId === tt.id
                                      ? {
                                          tradeTypeId: null,
                                          tradeTypeName: null,
                                        }
                                      : {
                                          tradeTypeId: tt.id,
                                          tradeTypeName: tt.name,
                                        },
                                  )
                                }
                                className={cn(
                                  "rounded border px-2 py-0.5 text-xs transition-colors",
                                  opp.tradeTypeId === tt.id
                                    ? "border-blue-600 bg-blue-700/80 text-white"
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
                );
              })()}

            {/* 时间行 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-muted-foreground text-[10px]">
                  入场时间
                </label>
                <input
                  type="time"
                  value={opp.entryTime}
                  onChange={(e) => onChange({ entryTime: e.target.value })}
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-muted-foreground text-[10px]">
                  出场时间
                </label>
                <input
                  type="time"
                  value={opp.exitTime}
                  onChange={(e) => onChange({ exitTime: e.target.value })}
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
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
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-muted-foreground text-[10px]">
                  出场价
                </label>
                <input
                  type="number"
                  step="0.25"
                  placeholder="0.00"
                  value={opp.exitPrice}
                  onChange={(e) => onChange({ exitPrice: e.target.value })}
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-muted-foreground text-[10px]">
                  合约数
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="1"
                  value={opp.contracts}
                  onChange={(e) => onChange({ contracts: e.target.value })}
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
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
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-red-900/60 focus:outline-none"
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
                  className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-blue-900/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 自动计算盈亏（入场价 + 出场价 + 合约数均填时显示） */}
            {(() => {
              const entry = parseFloat(opp.entryPrice);
              const exit = parseFloat(opp.exitPrice);
              const qty = parseFloat(opp.contracts || "1");
              if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
                const dir = opp.tradeDirection === "SHORT" ? -1 : 1;
                const points = (exit - entry) * dir;
                // MNQ 每合约每点 $2
                const pnl = points * qty * 2;
                const isProfit = pnl >= 0;
                return (
                  <div className="flex items-center gap-3 border-t border-green-900/20 pt-0.5">
                    <span className="text-muted-foreground text-[10px]">
                      盈亏点数
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isProfit ? "text-green-400" : "text-red-400",
                      )}
                    >
                      {points >= 0 ? "+" : ""}
                      {points.toFixed(2)} pts
                    </span>
                    <span className="text-muted-foreground ml-2 text-[10px]">
                      盈亏金额
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isProfit ? "text-green-400" : "text-red-400",
                      )}
                    >
                      {pnl >= 0 ? "+" : ""}${pnl.toFixed(0)}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            {/* 回报指标 */}
            <div className="space-y-1.5 border-t border-green-900/20 pt-1">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                回报指标
              </span>

              {/* 计划风险 / 回报 */}
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  {
                    field: "plannedRiskPts" as const,
                    label: "计划风险（pts）",
                    activeClass:
                      "bg-orange-700/80 border-orange-600 text-white",
                    hoverClass: "hover:border-orange-600 hover:text-orange-400",
                    focusClass: "focus:ring-orange-900/60",
                  },
                  {
                    field: "plannedReturnPts" as const,
                    label: "计划回报（pts）",
                    activeClass: "bg-green-700/80 border-green-600 text-white",
                    hoverClass: "hover:border-green-600 hover:text-green-400",
                    focusClass: "focus:ring-green-900/60",
                  },
                ].map((config) => (
                  <div key={config.field} className="space-y-0.5">
                    <label className="text-muted-foreground text-[10px]">
                      {config.label}
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["50", "100", "200"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() =>
                            onChange({
                              [config.field]:
                                opp[config.field] === preset ? "" : preset,
                            })
                          }
                          className={cn(
                            "shrink-0 rounded border px-2 py-0.5 text-xs font-medium transition-colors",
                            opp[config.field] === preset
                              ? config.activeClass
                              : cn(
                                  "border-muted-foreground/30 text-muted-foreground",
                                  config.hoverClass,
                                ),
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        aria-label={config.label}
                        placeholder="手动输入"
                        value={opp[config.field]}
                        onChange={(event) =>
                          onChange({ [config.field]: event.target.value })
                        }
                        className={cn(
                          "border-input bg-background text-foreground w-24 rounded border px-2 py-1 text-xs focus:ring-1 focus:outline-none",
                          config.focusClass,
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 计划目标 R（自动计算） */}
              {(() => {
                const risk = parseFloat(opp.plannedRiskPts);
                const plannedReturn = parseFloat(opp.plannedReturnPts);
                if (risk > 0 && plannedReturn >= 0) {
                  return (
                    <div className="flex items-center justify-between rounded bg-cyan-950/50 px-2 py-1 text-xs font-medium text-cyan-300">
                      <span className="text-[10px] font-normal text-cyan-300/70">
                        计划目标 R
                      </span>
                      <span>{(plannedReturn / risk).toFixed(2)} R</span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* MAE / MFE */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] text-red-400/70">
                    最大回撤 MAE（pts）
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="0"
                    value={opp.maxDrawdownPts}
                    onChange={(e) =>
                      onChange({ maxDrawdownPts: e.target.value })
                    }
                    className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-red-900/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[10px] text-green-400/70">
                    最高盈利 MFE（pts）
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    placeholder="0"
                    value={opp.maxFavorablePts}
                    onChange={(e) =>
                      onChange({ maxFavorablePts: e.target.value })
                    }
                    className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* R 倍数（自动计算） */}
              {(() => {
                const entry = parseFloat(opp.entryPrice);
                const exit = parseFloat(opp.exitPrice);
                const risk = parseFloat(opp.plannedRiskPts);
                if (
                  !isNaN(entry) &&
                  !isNaN(exit) &&
                  entry > 0 &&
                  exit > 0 &&
                  risk > 0
                ) {
                  const dir = opp.tradeDirection === "SHORT" ? -1 : 1;
                  const pnlPts = (exit - entry) * dir;
                  const r = pnlPts / risk;
                  return (
                    <div
                      className={cn(
                        "flex items-center justify-between rounded px-2 py-1 text-xs font-medium",
                        r >= 0
                          ? "bg-green-950/60 text-green-400"
                          : "bg-red-950/60 text-red-400",
                      )}
                    >
                      <span className="text-[10px] font-normal opacity-70">
                        实际 R 倍数
                      </span>
                      <span>
                        {r >= 0 ? "+" : ""}
                        {r.toFixed(2)} R
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* 交易结果 */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-medium text-green-400/80">
              交易结果
            </span>
            <div className="flex flex-wrap gap-1">
              {TRADE_RESULT_OPTIONS.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    onChange({
                      tradeResult: opp.tradeResult === value ? null : value,
                    })
                  }
                  className={cn(
                    "rounded border px-2 py-0.5 text-xs transition-colors",
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
              className="resize-none border-green-900/40 text-xs focus-visible:ring-green-900/60"
            />
          </div>

          {/* 执行评估 */}
          <div className="space-y-2 border-t border-green-900/20 pt-1">
            <span className="text-[10px] font-medium tracking-wide text-green-400/80 uppercase">
              执行评估
            </span>

            {/* 进入评估 */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground shrink-0 text-[10px]">
                  进入：
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      entryAccuracy:
                        opp.entryAccuracy === "CORRECT" ? null : "CORRECT",
                    })
                  }
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                    opp.entryAccuracy === "CORRECT"
                      ? "border-green-600 bg-green-700/80 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                  进入准确
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      entryAccuracy:
                        opp.entryAccuracy === "WRONG" ? null : "WRONG",
                    })
                  }
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                    opp.entryAccuracy === "WRONG"
                      ? "border-red-700 bg-red-800/80 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                  进入有误
                </button>
              </div>
              {opp.entryAccuracy !== null && (
                <Textarea
                  placeholder={
                    opp.entryAccuracy === "CORRECT"
                      ? "进入准确的原因（信号清晰、条件完全满足...）"
                      : "进入有误的原因（追高、信号不完整、仓位过重...）"
                  }
                  value={opp.entryAccuracyNote}
                  onChange={(e) =>
                    onChange({ entryAccuracyNote: e.target.value })
                  }
                  rows={2}
                  className={cn(
                    "resize-none text-xs",
                    opp.entryAccuracy === "CORRECT"
                      ? "border-green-900/40 focus-visible:ring-green-900/60"
                      : "border-red-900/40 focus-visible:ring-red-900/60",
                  )}
                />
              )}
            </div>

            {/* 退出评估 */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground shrink-0 text-[10px]">
                  退出：
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      exitAccuracy:
                        opp.exitAccuracy === "CORRECT" ? null : "CORRECT",
                    })
                  }
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                    opp.exitAccuracy === "CORRECT"
                      ? "border-green-600 bg-green-700/80 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                  退出准确
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      exitAccuracy:
                        opp.exitAccuracy === "WRONG" ? null : "WRONG",
                    })
                  }
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                    opp.exitAccuracy === "WRONG"
                      ? "border-red-700 bg-red-800/80 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                  退出有误
                </button>
              </div>
              {opp.exitAccuracy !== null && (
                <Textarea
                  placeholder={
                    opp.exitAccuracy === "CORRECT"
                      ? "退出准确的原因（目标达到、按计划止盈...）"
                      : "退出有误的原因（过早平仓、扛单、没有执行止损...）"
                  }
                  value={opp.exitAccuracyNote}
                  onChange={(e) =>
                    onChange({ exitAccuracyNote: e.target.value })
                  }
                  rows={2}
                  className={cn(
                    "resize-none text-xs",
                    opp.exitAccuracy === "CORRECT"
                      ? "border-green-900/40 focus-visible:ring-green-900/60"
                      : "border-red-900/40 focus-visible:ring-red-900/60",
                  )}
                />
              )}
            </div>
          </div>

          {/* 持仓过夜 */}
          <div className="space-y-1.5 border-t border-green-900/20 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-green-400/80">
                持仓过夜
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({ heldOvernight: false, overnightReason: "" })
                }
                className={cn(
                  "rounded border px-2 py-0.5 text-xs transition-colors",
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
                  "rounded border px-2 py-0.5 text-xs transition-colors",
                  opp.heldOvernight
                    ? "border-indigo-600 bg-indigo-700/80 text-white"
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
                className="resize-none border-indigo-900/40 text-xs focus-visible:ring-indigo-900/60"
              />
            )}
          </div>
        </div>
      )}

      {/* 错过经过 + 假设 R/R（仅当选择"错过了"时显示） */}
      {opp.captured === false && (
        <div className="space-y-2 rounded border border-red-900/30 bg-red-950/10 p-2">
          {/* 交易方向 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="shrink-0 text-[10px] font-medium text-red-400/80">
              交易方向：
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    tradeDirection:
                      opp.tradeDirection === "LONG" ? null : "LONG",
                  })
                }
                className={cn(
                  "rounded border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  opp.tradeDirection === "LONG"
                    ? "border-green-600 bg-green-700 text-white"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                )}
              >
                做多
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    tradeDirection:
                      opp.tradeDirection === "SHORT" ? null : "SHORT",
                  })
                }
                className={cn(
                  "rounded border px-2.5 py-0.5 text-xs font-medium transition-colors",
                  opp.tradeDirection === "SHORT"
                    ? "border-red-600 bg-red-700 text-white"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                )}
              >
                做空
              </button>
            </div>
          </div>

          {/* 策略选择 */}
          {strategies.length > 0 &&
            (() => {
              const selectedStrategy = strategies.find(
                (s) => s.id === opp.strategyId,
              );
              return (
                <div className="space-y-1.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-medium text-red-400/80">
                      使用策略
                    </label>
                    <select
                      value={opp.strategyId ?? ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const found = strategies.find((s) => s.id === id);
                        onChange({
                          strategyId: id || null,
                          strategyName: found?.name ?? null,
                          tradeTypeId: null,
                          tradeTypeName: null,
                        });
                      }}
                      className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-red-900/60 focus:outline-none"
                    >
                      <option value="">— 选择策略（可选）—</option>
                      {strategies.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedStrategy &&
                    selectedStrategy.tradeTypes.length > 0 && (
                      <div className="space-y-0.5">
                        <label className="text-muted-foreground text-[10px]">
                          子策略类型
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {selectedStrategy.tradeTypes.map((tt) => (
                            <button
                              key={tt.id}
                              type="button"
                              onClick={() =>
                                onChange(
                                  opp.tradeTypeId === tt.id
                                    ? { tradeTypeId: null, tradeTypeName: null }
                                    : {
                                        tradeTypeId: tt.id,
                                        tradeTypeName: tt.name,
                                      },
                                )
                              }
                              className={cn(
                                "rounded border px-2 py-0.5 text-xs transition-colors",
                                opp.tradeTypeId === tt.id
                                  ? "border-blue-600 bg-blue-700/80 text-white"
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
              );
            })()}

          <div className="space-y-1.5 rounded border border-red-900/30 bg-red-950/10 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-red-400/80">
                主要错失原因（单选）
              </span>
              {!opp.missedReasonCategory && (
                <span className="text-[10px] text-amber-400/80">建议选择</span>
              )}
            </div>
            {(["识别", "决策", "执行", "约束"] as const).map((group) => (
              <div key={group} className="flex items-start gap-1.5">
                <span className="text-muted-foreground/60 w-6 shrink-0 pt-1 text-[9px]">
                  {group}
                </span>
                <div className="flex flex-wrap gap-1">
                  {MNQ_MISSED_REASON_OPTIONS.filter(
                    (option) => option.group === group,
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        onChange({
                          missedReasonCategory:
                            opp.missedReasonCategory === option.value
                              ? null
                              : option.value,
                        })
                      }
                      className={cn(
                        "rounded border px-2 py-0.5 text-[10px] transition-colors",
                        opp.missedReasonCategory === option.value
                          ? "border-red-600 bg-red-800/70 text-red-100"
                          : "border-muted-foreground/25 text-muted-foreground hover:border-red-700 hover:text-red-300",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-medium text-red-400/80">
              错过经过
            </span>
            <Textarea
              placeholder="当时发生了什么？为什么没有入场？（犹豫、看漏信号、仓位已满...）"
              value={opp.missedProcess}
              onChange={(e) => onChange({ missedProcess: e.target.value })}
              rows={2}
              className="resize-none border-red-900/40 text-xs focus-visible:ring-red-900/60"
            />
          </div>

          {/* 错失机会的事前计划 R/R */}
          <div className="space-y-1.5 rounded border border-cyan-900/35 bg-cyan-950/10 p-2">
            <div>
              <span className="text-[10px] font-medium tracking-wide text-cyan-300 uppercase">
                当时的交易计划
              </span>
              <p className="text-muted-foreground mt-0.5 text-[10px]">
                按机会出现时的信息填写，不根据最终行情反推
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  field: "missedPlannedRiskPts" as const,
                  label: "计划风险（pts）",
                  ariaLabel: "错失机会计划风险（pts）",
                  activeClass: "border-orange-600 bg-orange-700/80 text-white",
                  hoverClass: "hover:border-orange-600 hover:text-orange-400",
                },
                {
                  field: "missedPlannedReturnPts" as const,
                  label: "计划回报（pts）",
                  ariaLabel: "错失机会计划回报（pts）",
                  activeClass: "border-green-600 bg-green-700/80 text-white",
                  hoverClass: "hover:border-green-600 hover:text-green-400",
                },
              ].map((config) => (
                <div key={config.field} className="space-y-0.5">
                  <label className="text-muted-foreground text-[10px]">
                    {config.label}
                  </label>
                  <div className="flex flex-wrap items-center gap-1">
                    {["50", "100", "200"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          onChange({
                            [config.field]:
                              opp[config.field] === preset ? "" : preset,
                          })
                        }
                        className={cn(
                          "shrink-0 rounded border px-2 py-0.5 text-xs font-medium transition-colors",
                          opp[config.field] === preset
                            ? config.activeClass
                            : cn(
                                "border-muted-foreground/30 text-muted-foreground",
                                config.hoverClass,
                              ),
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      aria-label={config.ariaLabel}
                      placeholder="手动输入"
                      value={opp[config.field]}
                      onChange={(event) =>
                        onChange({ [config.field]: event.target.value })
                      }
                      className="border-input bg-background text-foreground w-24 rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-900/60 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            {(() => {
              const risk = parseFloat(opp.missedPlannedRiskPts);
              const plannedReturn = parseFloat(opp.missedPlannedReturnPts);
              if (risk > 0 && plannedReturn >= 0) {
                return (
                  <div className="flex items-center justify-between rounded bg-cyan-950/60 px-2 py-1 text-xs font-medium text-cyan-300">
                    <span className="text-[10px] font-normal text-cyan-300/70">
                      计划目标 R
                    </span>
                    <span>{(plannedReturn / risk).toFixed(2)} R</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* 事后假设 R/R */}
          <div className="space-y-1.5 border-t border-red-900/20 pt-1">
            <div>
              <span className="text-[10px] font-medium tracking-wide text-red-400/80 uppercase">
                事后机会评估
              </span>
              <p className="text-muted-foreground mt-0.5 text-[10px]">
                行情走完后评估实际提供的风险与盈利空间
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* 风险 */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-red-400/70">
                  风险 Risk（pts）
                </label>
                <div className="flex flex-wrap items-center gap-1">
                  {["50", "100"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        onChange({
                          missedRiskPts:
                            opp.missedRiskPts === preset ? "" : preset,
                        })
                      }
                      className={cn(
                        "shrink-0 rounded border px-2 py-0.5 text-xs font-medium transition-colors",
                        opp.missedRiskPts === preset
                          ? "border-red-600 bg-red-700/80 text-white"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-red-600 hover:text-red-400",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                  <input
                    type="number"
                    aria-label="事后假设风险（pts）"
                    step="0.25"
                    placeholder="自定义"
                    value={opp.missedRiskPts}
                    onChange={(e) =>
                      onChange({ missedRiskPts: e.target.value })
                    }
                    className="border-input bg-background text-foreground w-16 rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-red-900/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* 回报 */}
              <div className="space-y-0.5">
                <label className="text-[10px] text-green-400/70">
                  回报 Return（pts）
                </label>
                <div className="flex flex-wrap items-center gap-1">
                  {["100", "200"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        onChange({
                          missedReturnPts:
                            opp.missedReturnPts === preset ? "" : preset,
                        })
                      }
                      className={cn(
                        "shrink-0 rounded border px-2 py-0.5 text-xs font-medium transition-colors",
                        opp.missedReturnPts === preset
                          ? "border-green-600 bg-green-700/80 text-white"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-green-600 hover:text-green-400",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                  <input
                    type="number"
                    aria-label="事后假设回报（pts）"
                    step="0.25"
                    placeholder="自定义"
                    value={opp.missedReturnPts}
                    onChange={(e) =>
                      onChange({ missedReturnPts: e.target.value })
                    }
                    className="border-input bg-background text-foreground w-16 rounded border px-2 py-1 text-xs focus:ring-1 focus:ring-green-900/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 假设 R 倍数（自动计算） */}
            {(() => {
              const risk = parseFloat(opp.missedRiskPts);
              const ret = parseFloat(opp.missedReturnPts);
              if (risk > 0 && ret > 0) {
                const r = ret / risk;
                return (
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="text-muted-foreground text-[10px]">
                      假设 R 倍数
                    </span>
                    <span className="text-xs font-medium text-amber-400">
                      {r.toFixed(2)} R
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────
interface Props {
  plan: MnqDailyPlan;
  date: string;
}

export function MnqMarketNotes({ plan, date }: Props) {
  const router = useRouter();

  const [segments, setSegments] = useState<
    Record<SegmentKey, MarketSegmentData>
  >({
    marketPreJson: parseSegment(plan.marketPreJson),
    marketOpenJson: parseSegment(plan.marketOpenJson),
    marketMidJson: parseSegment(plan.marketMidJson),
    marketAfternoonJson: parseSegment(plan.marketAfternoonJson),
  });
  const [heldOvernight, setHeldOvernight] = useState<boolean | null>(
    plan.heldOvernight ?? null,
  );
  const [overnightNote, setOvernightNote] = useState(plan.overnightNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [strategies, setStrategies] = useState<StrategyOption[]>([]);

  useEffect(() => {
    fetch("/api/strategies")
      .then((r) => r.json())
      .then(
        (json: {
          success: boolean;
          data: Array<{
            id: string;
            name: string;
            isActive: boolean;
            tradeTypes: TradeTypeOption[];
          }>;
        }) => {
          if (json.success) {
            setStrategies(
              json.data
                .filter((s) => s.isActive)
                .map((s) => ({
                  id: s.id,
                  name: s.name,
                  tradeTypes: s.tradeTypes ?? [],
                })),
            );
          }
        },
      )
      .catch(() => {
        /* silent */
      });
  }, []);

  function updateSegment(key: SegmentKey, patch: Partial<MarketSegmentData>) {
    setSegments((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    setSaved(false);
  }

  function toggleType(key: SegmentKey, type: MnqMarketType) {
    const current = segments[key].type;
    updateSegment(key, { type: current === type ? null : type });
  }

  function toggleSecondaryDeviationReason(
    key: SegmentKey,
    reason: MnqMarketDeviationReason,
  ) {
    const current = segments[key].secondaryDeviationReasons;
    updateSegment(key, {
      secondaryDeviationReasons: current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    });
  }

  function toggleImpactType(key: SegmentKey, impactType: MnqMarketImpactType) {
    const current = segments[key].impactTypes;
    updateSegment(key, {
      impactTypes: current.includes(impactType)
        ? current.filter((item) => item !== impactType)
        : [...current, impactType],
    });
  }

  function toggleImpactOpportunity(key: SegmentKey, opportunityId: string) {
    const current = segments[key].impactOpportunityIds;
    updateSegment(key, {
      impactOpportunityIds: current.includes(opportunityId)
        ? current.filter((item) => item !== opportunityId)
        : [...current, opportunityId],
    });
  }

  function addOpportunity(key: SegmentKey) {
    const prev = segments[key].opportunities;
    updateSegment(key, { opportunities: [...prev, createOpportunity()] });
  }

  function updateOpportunity(
    key: SegmentKey,
    oppId: string,
    patch: Partial<TradeOpportunity>,
  ) {
    setSegments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        opportunities: prev[key].opportunities.map((o) =>
          o.id === oppId ? { ...o, ...patch } : o,
        ),
      },
    }));
    setSaved(false);
  }

  function removeOpportunity(key: SegmentKey, oppId: string) {
    setSegments((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        opportunities: prev[key].opportunities.filter((o) => o.id !== oppId),
        impactOpportunityIds: prev[key].impactOpportunityIds.filter(
          (id) => id !== oppId,
        ),
      },
    }));
    setSaved(false);
  }

  async function handleSave() {
    for (const key of ["marketOpenJson", "marketMidJson"] as const) {
      const segment = segments[key];
      const label = key === "marketOpenJson" ? "开盘行情" : "盘中行情";
      const hasExpected = [
        segment.expectedType,
        segment.expectedDirection,
        segment.expectedNote.trim(),
      ].some(Boolean);
      const hasActual = [
        segment.actualType,
        segment.actualDirection,
        segment.actualNote.trim(),
      ].some(Boolean);
      if (hasExpected && hasActual && segment.accuracy === null) {
        toast.error(`${label}已填写预计与实际，请选择判断准确性`);
        return;
      }
      if (
        hasExpected &&
        (segment.accuracy === "PARTIAL" || segment.accuracy === "WRONG") &&
        (!segment.deviationReason || !segment.deviationNote.trim())
      ) {
        toast.error(`${label}为部分准确或错误时，请选择主要原因并填写具体说明`);
        return;
      }
      if (
        hasExpected &&
        (segment.accuracy === "PARTIAL" || segment.accuracy === "WRONG") &&
        segment.opportunityImpact === null
      ) {
        toast.error(`${label}判断存在偏差，请记录是否影响交易机会`);
        return;
      }
      if (
        segment.opportunityImpact === "POSITIVE" ||
        segment.opportunityImpact === "NEGATIVE"
      ) {
        if (segment.impactTypes.length === 0 || !segment.impactNote.trim()) {
          toast.error(`${label}有交易机会影响时，请选择影响类型并填写说明`);
          return;
        }
        if (
          segment.opportunities.length > 0 &&
          segment.impactOpportunityIds.length === 0
        ) {
          toast.error(`${label}已有交易机会，请至少关联一个受影响的机会`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const toJson = (key: SegmentKey, seg: MarketSegmentData) => {
        const isCore = key === "marketOpenJson" || key === "marketMidJson";
        const hasPremarketPhaseData = Object.values(seg.premarketPhases).some(
          (phase) =>
            phase.type !== null ||
            phase.direction !== null ||
            phase.note.trim(),
        );
        const isEmpty =
          seg.type === null &&
          !seg.note.trim() &&
          seg.expectedType === null &&
          seg.expectedDirection === null &&
          !seg.expectedNote.trim() &&
          seg.actualType === null &&
          seg.actualDirection === null &&
          !seg.actualNote.trim() &&
          seg.accuracy === null &&
          seg.opportunityImpact === null &&
          seg.impactTypes.length === 0 &&
          seg.impactOpportunityIds.length === 0 &&
          !seg.impactNote.trim() &&
          !hasPremarketPhaseData &&
          seg.opportunities.length === 0;
        if (isEmpty) return null;
        if (key === "marketPreJson") {
          return JSON.stringify({
            ...seg,
            // 同步旧字段，确保尚未适配新结构的历史展示仍能读取美国盘前记录。
            type: seg.premarketPhases.usPremarket.type,
            note: seg.premarketPhases.usPremarket.note,
          });
        }
        return JSON.stringify(
          isCore ? { ...seg, type: seg.actualType, note: seg.actualNote } : seg,
        );
      };

      const res = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketPreJson: toJson("marketPreJson", segments.marketPreJson),
          marketOpenJson: toJson("marketOpenJson", segments.marketOpenJson),
          marketMidJson: toJson("marketMidJson", segments.marketMidJson),
          marketAfternoonJson: toJson(
            "marketAfternoonJson",
            segments.marketAfternoonJson,
          ),
          heldOvernight,
          overnightNote: overnightNote.trim() || null,
        }),
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        toast.success("行情记录已保存");
        setSaved(true);
        router.refresh();
      } else {
        toast.error("保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setSaving(false);
    }
  }

  const hasAnyData = Object.values(segments).some(
    (s) =>
      s.type !== null ||
      s.note.trim() ||
      s.expectedType !== null ||
      s.expectedDirection !== null ||
      s.expectedNote.trim() ||
      s.actualType !== null ||
      s.actualDirection !== null ||
      s.actualNote.trim() ||
      s.opportunityImpact !== null ||
      s.impactTypes.length > 0 ||
      s.impactNote.trim() ||
      Object.values(s.premarketPhases).some(
        (phase) =>
          phase.type !== null || phase.direction !== null || phase.note.trim(),
      ) ||
      s.opportunities.length > 0,
  );

  return (
    <div className="border-border/40 space-y-4 border-t pt-2">
      {/* 标题 */}
      <div className="flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-xs font-medium text-cyan-400">MNQ 行情记录</span>
      </div>

      {/* 四个时段 */}
      <div className="space-y-4">
        {SEGMENTS.map(
          ({ key, label, time, isCore, notePlaceholder, oppPlaceholder }) => {
            const seg = segments[key];
            return (
              <div
                key={key}
                className="border-border/40 space-y-2 rounded-md border p-2.5"
              >
                {/* 时段标题 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground/90 text-xs font-medium">
                    {label}
                  </span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    {time}
                  </span>
                </div>

                {key === "marketPreJson" ? (
                  <div className="space-y-2.5">
                    <p className="text-muted-foreground text-[10px] leading-relaxed">
                      将开盘前走势拆分记录，便于识别隔夜结构是否在美国盘前得到延续或反转。
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {PREMARKET_PHASES.map((phaseConfig) => {
                        const phase = seg.premarketPhases[phaseConfig.key];
                        const updatePhase = (
                          patch: Partial<PremarketPhaseData>,
                        ) =>
                          updateSegment(key, {
                            premarketPhases: {
                              ...seg.premarketPhases,
                              [phaseConfig.key]: { ...phase, ...patch },
                            },
                          });
                        return (
                          <div
                            key={phaseConfig.key}
                            className="space-y-2 rounded-md border border-cyan-900/35 bg-cyan-950/10 p-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-medium text-cyan-300">
                                {phaseConfig.label}
                              </span>
                              <span className="text-muted-foreground text-[10px]">
                                {phaseConfig.time}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px]">
                                行情类型
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {MNQ_MARKET_TYPE_OPTIONS.filter(
                                  (option) => option.value !== "UNCERTAIN",
                                ).map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                      updatePhase({
                                        type:
                                          phase.type === option.value
                                            ? null
                                            : option.value,
                                      })
                                    }
                                    className={cn(
                                      "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                      phase.type === option.value
                                        ? "border-cyan-600 bg-cyan-800/70 text-white"
                                        : "border-muted-foreground/25 text-muted-foreground hover:border-cyan-700 hover:text-cyan-300",
                                    )}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-[10px]">
                                行情方向
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {MNQ_MARKET_DIRECTION_OPTIONS.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                      updatePhase({
                                        direction:
                                          phase.direction === option.value
                                            ? null
                                            : option.value,
                                      })
                                    }
                                    className={cn(
                                      "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                      phase.direction === option.value
                                        ? "border-violet-600 bg-violet-800/70 text-white"
                                        : "border-muted-foreground/25 text-muted-foreground hover:border-violet-700 hover:text-violet-300",
                                    )}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <Textarea
                              placeholder={phaseConfig.notePlaceholder}
                              value={phase.note}
                              onChange={(event) =>
                                updatePhase({ note: event.target.value })
                              }
                              rows={3}
                              className="resize-none text-xs"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : isCore ? (
                  <div className="space-y-3">
                    <div className="space-y-2 rounded-md border border-cyan-900/40 bg-cyan-950/10 p-2.5">
                      <div>
                        <p className="text-[11px] font-medium text-cyan-300">
                          预计行情
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          在该时段开始前记录，避免盘后重构判断
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px]">
                          预计类型
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {MNQ_MARKET_TYPE_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateSegment(key, {
                                  expectedType:
                                    seg.expectedType === option.value
                                      ? null
                                      : option.value,
                                })
                              }
                              className={cn(
                                "rounded border px-2 py-0.5 text-[11px] transition-colors",
                                seg.expectedType === option.value
                                  ? "border-cyan-600 bg-cyan-800/70 text-white"
                                  : "border-muted-foreground/30 text-muted-foreground hover:border-cyan-700 hover:text-cyan-300",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px]">
                          预计方向
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {MNQ_MARKET_DIRECTION_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateSegment(key, {
                                  expectedDirection:
                                    seg.expectedDirection === option.value
                                      ? null
                                      : option.value,
                                })
                              }
                              className={cn(
                                "rounded border px-2 py-0.5 text-[11px] transition-colors",
                                seg.expectedDirection === option.value
                                  ? "border-cyan-600 bg-cyan-800/70 text-white"
                                  : "border-muted-foreground/30 text-muted-foreground hover:border-cyan-700 hover:text-cyan-300",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="预期运行路径、关键 Level 反应及判断依据..."
                        value={seg.expectedNote}
                        onChange={(e) =>
                          updateSegment(key, { expectedNote: e.target.value })
                        }
                        rows={2}
                        className="resize-none text-xs"
                      />
                    </div>

                    <div className="space-y-2 rounded-md border border-violet-900/40 bg-violet-950/10 p-2.5">
                      <div>
                        <p className="text-[11px] font-medium text-violet-300">
                          实际行情
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          在该时段结束后记录实际结构和关键转折
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px]">
                          实际类型
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {MNQ_MARKET_TYPE_OPTIONS.filter(
                            (option) => option.value !== "UNCERTAIN",
                          ).map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateSegment(key, {
                                  actualType:
                                    seg.actualType === option.value
                                      ? null
                                      : option.value,
                                })
                              }
                              className={cn(
                                "rounded border px-2 py-0.5 text-[11px] transition-colors",
                                seg.actualType === option.value
                                  ? "border-violet-600 bg-violet-800/70 text-white"
                                  : "border-muted-foreground/30 text-muted-foreground hover:border-violet-700 hover:text-violet-300",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px]">
                          实际方向
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {MNQ_MARKET_DIRECTION_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateSegment(key, {
                                  actualDirection:
                                    seg.actualDirection === option.value
                                      ? null
                                      : option.value,
                                })
                              }
                              className={cn(
                                "rounded border px-2 py-0.5 text-[11px] transition-colors",
                                seg.actualDirection === option.value
                                  ? "border-violet-600 bg-violet-800/70 text-white"
                                  : "border-muted-foreground/30 text-muted-foreground hover:border-violet-700 hover:text-violet-300",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder={notePlaceholder}
                        value={seg.actualNote}
                        onChange={(e) =>
                          updateSegment(key, { actualNote: e.target.value })
                        }
                        rows={2}
                        className="resize-none text-xs"
                      />
                    </div>

                    <div className="border-border/50 space-y-2 rounded-md border p-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="mr-1 text-[11px] font-medium">
                          判断准确性
                        </span>
                        {MNQ_MARKET_ACCURACY_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              updateSegment(key, {
                                accuracy:
                                  seg.accuracy === option.value
                                    ? null
                                    : option.value,
                                ...(option.value === "CORRECT"
                                  ? {
                                      deviationReason: null,
                                      secondaryDeviationReasons: [],
                                      deviationNote: "",
                                    }
                                  : {}),
                              })
                            }
                            className={cn(
                              "rounded border px-2.5 py-0.5 text-xs transition-colors",
                              seg.accuracy !== option.value &&
                                "border-muted-foreground/30 text-muted-foreground",
                              seg.accuracy === "CORRECT" &&
                                option.value === "CORRECT" &&
                                "border-green-600 bg-green-700/80 text-white",
                              seg.accuracy === "PARTIAL" &&
                                option.value === "PARTIAL" &&
                                "border-amber-600 bg-amber-700/80 text-white",
                              seg.accuracy === "WRONG" &&
                                option.value === "WRONG" &&
                                "border-red-700 bg-red-800/80 text-white",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {(seg.accuracy === "PARTIAL" ||
                        seg.accuracy === "WRONG") && (
                        <div className="border-border/40 space-y-2 border-t pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-medium text-orange-300">
                              主要偏差原因（必选）
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_MARKET_DEVIATION_REASON_OPTIONS.map(
                                (option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                      updateSegment(key, {
                                        deviationReason:
                                          seg.deviationReason === option.value
                                            ? null
                                            : option.value,
                                        secondaryDeviationReasons:
                                          seg.secondaryDeviationReasons.filter(
                                            (item) => item !== option.value,
                                          ),
                                      })
                                    }
                                    className={cn(
                                      "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                      seg.deviationReason === option.value
                                        ? "border-orange-600 bg-orange-800/70 text-white"
                                        : "border-muted-foreground/30 text-muted-foreground hover:border-orange-700 hover:text-orange-300",
                                    )}
                                  >
                                    {option.label}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px]">
                              次要原因（可多选）
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_MARKET_DEVIATION_REASON_OPTIONS.filter(
                                (option) =>
                                  option.value !== seg.deviationReason,
                              ).map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    toggleSecondaryDeviationReason(
                                      key,
                                      option.value,
                                    )
                                  }
                                  className={cn(
                                    "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                    seg.secondaryDeviationReasons.includes(
                                      option.value,
                                    )
                                      ? "border-amber-700 bg-amber-900/50 text-amber-200"
                                      : "border-muted-foreground/20 text-muted-foreground/70",
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            placeholder="具体说明预计与实际的差异，以及下次应如何判断...（必填）"
                            value={seg.deviationNote}
                            onChange={(e) =>
                              updateSegment(key, {
                                deviationNote: e.target.value,
                              })
                            }
                            rows={2}
                            className="resize-none text-xs"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 rounded-md border border-emerald-900/40 bg-emerald-950/10 p-2.5">
                      <div>
                        <p className="text-[11px] font-medium text-emerald-300">
                          是否影响交易机会
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          记录行情判断如何改变机会识别、过滤或执行
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {MNQ_MARKET_OPPORTUNITY_IMPACT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const nextImpact =
                                seg.opportunityImpact === option.value
                                  ? null
                                  : option.value;
                              const validImpactTypes =
                                nextImpact === "POSITIVE" ||
                                nextImpact === "NEGATIVE"
                                  ? seg.impactTypes.filter((impactType) =>
                                      MNQ_MARKET_IMPACT_TYPE_OPTIONS.some(
                                        (item) =>
                                          item.value === impactType &&
                                          item.impact === nextImpact,
                                      ),
                                    )
                                  : [];
                              updateSegment(key, {
                                opportunityImpact: nextImpact,
                                impactTypes: validImpactTypes,
                                impactOpportunityIds:
                                  nextImpact === "POSITIVE" ||
                                  nextImpact === "NEGATIVE"
                                    ? seg.impactOpportunityIds
                                    : [],
                                impactNote:
                                  nextImpact === "POSITIVE" ||
                                  nextImpact === "NEGATIVE"
                                    ? seg.impactNote
                                    : "",
                              });
                            }}
                            className={cn(
                              "rounded border px-2.5 py-0.5 text-xs transition-colors",
                              seg.opportunityImpact !== option.value &&
                                "border-muted-foreground/30 text-muted-foreground",
                              seg.opportunityImpact === "NONE" &&
                                option.value === "NONE" &&
                                "border-slate-600 bg-slate-700/70 text-white",
                              seg.opportunityImpact === "POSITIVE" &&
                                option.value === "POSITIVE" &&
                                "border-green-600 bg-green-700/80 text-white",
                              seg.opportunityImpact === "NEGATIVE" &&
                                option.value === "NEGATIVE" &&
                                "border-red-700 bg-red-800/80 text-white",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {(seg.opportunityImpact === "POSITIVE" ||
                        seg.opportunityImpact === "NEGATIVE") && (
                        <div className="border-border/40 space-y-2 border-t pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-medium text-emerald-300">
                              影响类型（可多选，至少一项）
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_MARKET_IMPACT_TYPE_OPTIONS.filter(
                                (option) =>
                                  option.impact === seg.opportunityImpact,
                              ).map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    toggleImpactType(key, option.value)
                                  }
                                  className={cn(
                                    "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                    seg.impactTypes.includes(option.value)
                                      ? seg.opportunityImpact === "POSITIVE"
                                        ? "border-green-600 bg-green-900/60 text-green-200"
                                        : "border-red-700 bg-red-950/60 text-red-200"
                                      : "border-muted-foreground/25 text-muted-foreground",
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] font-medium">
                              关联机会
                              {seg.opportunities.length > 0
                                ? "（可多选，至少一项）"
                                : ""}
                            </span>
                            {seg.opportunities.length > 0 ? (
                              <div className="grid gap-1 sm:grid-cols-2">
                                {seg.opportunities.map((opportunity, index) => (
                                  <button
                                    key={opportunity.id}
                                    type="button"
                                    onClick={() =>
                                      toggleImpactOpportunity(
                                        key,
                                        opportunity.id,
                                      )
                                    }
                                    className={cn(
                                      "rounded border px-2 py-1 text-left text-[10px] leading-relaxed transition-colors",
                                      seg.impactOpportunityIds.includes(
                                        opportunity.id,
                                      )
                                        ? "border-emerald-600 bg-emerald-900/40 text-emerald-100"
                                        : "border-muted-foreground/20 text-muted-foreground",
                                    )}
                                  >
                                    <span className="font-medium">
                                      机会 {index + 1}
                                    </span>
                                    <span className="ml-1">
                                      {opportunity.description.trim() ||
                                        "未填写描述"}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground/70 text-[10px]">
                                该时段没有已记录机会，可只填写影响类型和说明。
                              </p>
                            )}
                          </div>

                          <Textarea
                            placeholder="说明行情判断如何影响了具体交易机会，以及应保留或改进什么...（必填）"
                            value={seg.impactNote}
                            onChange={(e) =>
                              updateSegment(key, { impactNote: e.target.value })
                            }
                            rows={2}
                            className="resize-none text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                      行情情况
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {MARKET_TYPES.map(
                        ({ value, label: btnLabel, activeClass }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => toggleType(key, value)}
                            className={cn(
                              "rounded border px-2.5 py-0.5 text-xs transition-colors",
                              seg.type === value
                                ? activeClass
                                : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                            )}
                          >
                            {btnLabel}
                          </button>
                        ),
                      )}
                      {seg.type !== null && (
                        <>
                          <span className="text-muted-foreground/50 mx-0.5 text-[10px]">
                            |
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSegment(key, {
                                accuracy:
                                  seg.accuracy === "CORRECT" ? null : "CORRECT",
                              })
                            }
                            className={cn(
                              "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                              seg.accuracy === "CORRECT"
                                ? "border-green-600 bg-green-700/80 text-white"
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
                                accuracy:
                                  seg.accuracy === "WRONG" ? null : "WRONG",
                              })
                            }
                            className={cn(
                              "flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors",
                              seg.accuracy === "WRONG"
                                ? "border-red-700 bg-red-800/80 text-white"
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
                      onChange={(e) =>
                        updateSegment(key, { note: e.target.value })
                      }
                      rows={2}
                      className="resize-none text-xs"
                    />
                  </div>
                )}

                {/* ② 交易机会列表 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                      交易机会
                      {seg.opportunities.length > 0 && (
                        <span className="text-muted-foreground/50 ml-1">
                          ({seg.opportunities.length})
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => addOpportunity(key)}
                      className="flex items-center gap-0.5 text-[10px] text-cyan-500 transition-colors hover:text-cyan-300"
                    >
                      <Plus className="h-3 w-3" />
                      添加机会
                    </button>
                  </div>

                  {seg.opportunities.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => addOpportunity(key)}
                      className="border-border/40 text-muted-foreground/50 w-full rounded border border-dashed py-3 text-[11px] transition-colors hover:border-cyan-800 hover:text-cyan-600"
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
                          onChange={(patch) =>
                            updateOpportunity(key, opp.id, patch)
                          }
                          onRemove={() => removeOpportunity(key, opp.id)}
                          strategies={strategies}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addOpportunity(key)}
                        className="flex items-center gap-1 text-[10px] text-cyan-600/70 transition-colors hover:text-cyan-400"
                      >
                        <Plus className="h-3 w-3" />
                        再添加一个机会
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* 持仓过夜 */}
      <div className="border-border/40 space-y-2 rounded-md border p-2.5">
        <div className="flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs font-medium text-indigo-400">持仓过夜</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setHeldOvernight((prev) => (prev === true ? null : true));
              setSaved(false);
            }}
            className={cn(
              "flex items-center gap-1 rounded border px-2.5 py-0.5 text-xs transition-colors",
              heldOvernight === true
                ? "border-indigo-600 bg-indigo-700/80 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-indigo-600 hover:text-indigo-400",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            是，持仓过夜
          </button>
          <button
            type="button"
            onClick={() => {
              setHeldOvernight((prev) => (prev === false ? null : false));
              setSaved(false);
            }}
            className={cn(
              "flex items-center gap-1 rounded border px-2.5 py-0.5 text-xs transition-colors",
              heldOvernight === false
                ? "border-green-600 bg-green-700/80 text-white"
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
                setHeldOvernight(null);
                setSaved(false);
              }}
              className="text-muted-foreground/50 hover:text-muted-foreground text-[10px] transition-colors"
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
              setOvernightNote(e.target.value);
              setSaved(false);
            }}
            rows={2}
            className="resize-none border-indigo-900/40 text-xs focus-visible:ring-indigo-900/60"
          />
        )}
      </div>

      {/* 保存按钮 */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 border-cyan-800 text-xs text-cyan-400 hover:bg-cyan-950"
          onClick={handleSave}
          disabled={saving || !hasAnyData}
        >
          <Save className="h-3 w-3" />
          {saving ? "保存中..." : "保存行情记录"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" />
            已保存
          </span>
        )}
      </div>
    </div>
  );
}
