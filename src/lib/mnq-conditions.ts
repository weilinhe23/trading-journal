// MNQ 盘前识别条件定义 — 供 MnqScenarioPanel 和 MnqConditionsBlock 共用

import type { MnqDailyPlan } from "../../generated/prisma"

// ─── 识别条件字段名类型 ────────────────────────────────────────────────

export type MnqCondKey =
  | "condRangeMovingOver1h"
  | "condRangeVwapFlat"
  | "condRangeNoMajorNews"
  | "condRangePrevTrend"
  | "condTrendSingleDir"
  | "condTrendVwapTilted"
  | "condFadeNewsWeak"
  | "condHoldNewsReal"

export type MnqEvalKey =
  | "evalRangeMovingOver1h"
  | "evalRangeVwapFlat"
  | "evalRangeNoMajorNews"
  | "evalRangePrevTrend"
  | "evalTrendSingleDir"
  | "evalTrendVwapTilted"
  | "evalFadeNewsWeak"
  | "evalHoldNewsReal"
  | "evalUpBand"
  | "evalDownBand"

// 每项条件的定义：condKey（是否勾选）和 evalKey（盘中评估）一一对应
export interface CondDef {
  condKey: MnqCondKey
  evalKey: MnqEvalKey
  label: string
}

// 震荡日识别条件（4 项 + upband + downband 单独处理）
export const RANGE_COND_DEFS: CondDef[] = [
  {
    condKey: "condRangeMovingOver1h",
    evalKey: "evalRangeMovingOver1h",
    label:   "PMH–PML 区间内运动 > 1 小时",
  },
  {
    condKey: "condRangeVwapFlat",
    evalKey: "evalRangeVwapFlat",
    label:   "VWAP 斜率接近水平",
  },
  {
    condKey: "condRangeNoMajorNews",
    evalKey: "evalRangeNoMajorNews",
    label:   "当日基本面无重大新闻",
  },
  {
    condKey: "condRangePrevTrend",
    evalKey: "evalRangePrevTrend",
    label:   "前日为强趋势日，今日盘前高位震荡",
  },
]

// 趋势日 A 识别条件
export const TREND_A_COND_DEFS: CondDef[] = [
  {
    condKey: "condTrendSingleDir",
    evalKey: "evalTrendSingleDir",
    label:   "盘前价格单边运动，不回归 VWAP",
  },
  {
    condKey: "condTrendVwapTilted",
    evalKey: "evalTrendVwapTilted",
    label:   "VWAP 斜率明显倾斜",
  },
]

// 趋势日 B 识别条件
export const TREND_B_COND_DEFS: CondDef[] = [
  {
    condKey: "condFadeNewsWeak",
    evalKey: "evalFadeNewsWeak",
    label:   "消息可信度存疑或已被市场充分定价",
  },
]

// 趋势日 C 识别条件
export const TREND_C_COND_DEFS: CondDef[] = [
  {
    condKey: "condHoldNewsReal",
    evalKey: "evalHoldNewsReal",
    label:   "消息面真实且持续（确认的政策变化 / 谈判进展）",
  },
]

// ─── 自定义条件 & 边界类型 ─────────────────────────────────────────────

export type ScenarioKey = "RANGE" | "TREND_A" | "TREND_B" | "TREND_C"

export interface CustomCondition {
  id: string
  scenario: ScenarioKey
  label: string
  checked: boolean
  evalValue: boolean | null
  evalNote: string
}

export interface CustomBands {
  up: string[]
  down: string[]
}

export function parseCustomConditions(json?: string | null): CustomCondition[] {
  try { return json ? (JSON.parse(json) as CustomCondition[]) : [] }
  catch { return [] }
}

export function parseCustomBands(json?: string | null): CustomBands {
  try { return json ? (JSON.parse(json) as CustomBands) : { up: [], down: [] } }
  catch { return { up: [], down: [] } }
}

// ─── 按情景获取条件列表 ────────────────────────────────────────────────

import type { MnqScenario } from "~/types"

export function mnqScenarioToKey(scenario: MnqScenario): ScenarioKey {
  const m: Record<MnqScenario, ScenarioKey> = {
    RANGE_SWEEP:    "RANGE",
    TREND_REGULAR:  "TREND_A",
    TREND_GAP_FADE: "TREND_B",
    TREND_GAP_HOLD: "TREND_C",
  }
  return m[scenario]
}

export function getCondDefsForScenario(scenario: MnqScenario | null): CondDef[] {
  switch (scenario) {
    case "RANGE_SWEEP":    return RANGE_COND_DEFS
    case "TREND_REGULAR":  return TREND_A_COND_DEFS
    case "TREND_GAP_FADE": return TREND_B_COND_DEFS
    case "TREND_GAP_HOLD": return TREND_C_COND_DEFS
    default:               return []
  }
}

// ─── 获取已勾选的条件（盘前选中的） ───────────────────────────────────

export function getCheckedCondDefs(
  plan: MnqDailyPlan,
  scenario: MnqScenario | null,
): CondDef[] {
  const defs = getCondDefsForScenario(scenario)
  return defs.filter((d) => plan[d.condKey] === true)
}
