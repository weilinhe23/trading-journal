// MNQ 情景条件模板 — 选定情景后自动填充到 TradeSetup

import type { MnqScenario } from "~/types"

export interface MnqScenarioTemplate {
  direction: "LONG" | "SHORT" | "TBD"
  entryCondition: string
  stopCondition: string
  target1Condition: string
  setupLogic: string
}

// ─── 震荡日 Sweep 反转 ────────────────────────────────────────────────

export function getRangeSweepTemplate(
  upBand: string,
  downBand: string,
): MnqScenarioTemplate {
  return {
    direction: "TBD",
    entryCondition: `价格 sweep ${upBand} 或 ${downBand} 后反转回区间，出现反转 K 线确认（pin bar / engulfing）`,
    stopCondition: `突破 ${upBand}（做空时）或 ${downBand}（做多时）后持续运行，无法回归区间`,
    target1Condition: `反方向边界：做多目标 ${upBand}，做空目标 ${downBand}`,
    setupLogic: `【震荡日 Sweep 反转】\n区间上界: ${upBand}，下界: ${downBand}\n\n适用条件：\n• PMH–PML 区间内运动 > 1 小时\n• VWAP 斜率接近水平\n• 当日基本面无重大新闻\n• 前一天为强趋势日，盘前与前一天趋势形成高位震荡\n\n交易逻辑：等待价格 sweep 区间边界后反转回区间内交易`,
  }
}

// ─── 趋势日 A: 常规趋势日（四幕剧）────────────────────────────────────

export const TREND_REGULAR_TEMPLATE: MnqScenarioTemplate = {
  direction: "TBD",
  entryCondition: "盘前趋势方向确认，回调至 VWAP 站稳后沿趋势方向入场",
  stopCondition: "跌破/突破 VWAP 且反向收盘确认",
  target1Condition: "趋势延伸至下一关键位（PDH/PDL/ONH/ONL）",
  setupLogic: `【常规趋势日 (A)】\n\n识别特征：\n• 盘前无重大消息 Gap\n• 盘前价格单边运动，不回归 VWAP\n• VWAP 斜率明显倾斜\n\n交易逻辑：四幕剧结构，沿趋势方向回调入场`,
}

// ─── 趋势日 B: Gap & Fade ─────────────────────────────────────────────

export const TREND_GAP_FADE_TEMPLATE: MnqScenarioTemplate = {
  direction: "TBD",
  entryCondition: "Gap 方向动能衰竭，PDH/PDL 被拒绝后反转入场",
  stopCondition: "突破 Gap 方向新高/新低",
  target1Condition: "Gap 回补区域（PDC 附近）",
  setupLogic: `【Gap & Fade (B)】\n\n识别特征：\n• 盘前消息驱动大幅 Gap Up/Down\n• 消息可信度存疑或已被市场充分定价\n\n交易逻辑：Gap 无法维持，做反向回补`,
}

// ─── 趋势日 C: Gap & Hold ─────────────────────────────────────────────

export const TREND_GAP_HOLD_TEMPLATE: MnqScenarioTemplate = {
  direction: "TBD",
  entryCondition: "沿 Gap 方向，价格站稳关键位（VWAP / 盘前支撑压力）后顺势入场",
  stopCondition: "Gap 开始回补，失守关键支撑/压力位",
  target1Condition: "Gap 方向趋势延伸至下一关键位",
  setupLogic: `【Gap & Hold (C)】\n\n识别特征：\n• 盘前消息驱动大幅 Gap Up/Down\n• 消息面真实且持续（如确认的政策变化 / 确认的谈判进展）\n\n交易逻辑：Gap 能 Hold，顺势做延续`,
}

// ─── 根据情景获取模板 ─────────────────────────────────────────────────

export function getScenarioTemplate(
  scenario: MnqScenario,
  upBand?: string | null,
  downBand?: string | null,
): MnqScenarioTemplate {
  switch (scenario) {
    case "RANGE_SWEEP":
      return getRangeSweepTemplate(upBand ?? "PDH", downBand ?? "PDL")
    case "TREND_REGULAR":
      return TREND_REGULAR_TEMPLATE
    case "TREND_GAP_FADE":
      return TREND_GAP_FADE_TEMPLATE
    case "TREND_GAP_HOLD":
      return TREND_GAP_HOLD_TEMPLATE
  }
}
