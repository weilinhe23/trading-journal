// ─── 枚举镜像（与 Prisma schema 保持一致）────────────────────────────

export type Direction = "LONG" | "SHORT" | "TBD"

export type PriceTier = "BELOW_2" | "BETWEEN_2_20" | "ABOVE_20"

export type MarketCapTier =
  | "BELOW_300M"
  | "BETWEEN_300M_2B"
  | "BETWEEN_2B_10B"
  | "ABOVE_10B"

export type SetupStatus =
  | "WATCHING"
  | "EXECUTED"
  | "MISSED"
  | "INVALIDATED"
  | "CANCELLED"

// 保留旧 MissedReason 用于兼容存量数据的显示
export type MissedReason =
  | "HESITATION"
  | "NO_CLEAR_SIGNAL"
  | "DISTRACTED"
  | "ALREADY_IN_TRADE"
  | "RISK_LIMIT_HIT"
  | "SPREAD_TOO_WIDE"
  | "NEWS_RISK"
  | "CHANGED_ANALYSIS"
  | "FEAR_OF_LOSS"
  | "OTHER"

export type SetupPriority = "HIGH" | "MEDIUM" | "LOW"

export type ChartTimeframe = "M1" | "M5" | "M15" | "M30" | "H1" | "H4" | "D1"

export type Grade = "A" | "B" | "C" | "D"

export type NewsType =
  | "EARNINGS"
  | "FED"
  | "MACRO"
  | "SECTOR"
  | "COMPANY"
  | "TECHNICAL"

export type NewsImpact = "BULLISH" | "BEARISH" | "NEUTRAL" | "UNCERTAIN"

export type ChartTag =
  | "PRE_MARKET_PLAN"
  | "ENTRY_SIGNAL"
  | "EXIT_SIGNAL"
  | "MISSED_SIGNAL"
  | "POST_REVIEW"
  | "MARKET_OVERVIEW"

// ─── 展示用的 NewsType 标签 ───────────────────────────────────────────

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  EARNINGS: "财报",
  FED: "美联储",
  MACRO: "宏观数据",
  SECTOR: "行业新闻",
  COMPANY: "公司公告",
  TECHNICAL: "纯技术面",
}

// ─── 展示用的 NewsImpact 标签 ─────────────────────────────────────────

export const NEWS_IMPACT_LABELS: Record<NewsImpact, string> = {
  BULLISH: "利多",
  BEARISH: "利空",
  NEUTRAL: "中性",
  UNCERTAIN: "不确定",
}

// ─── 展示用的 MissedReason 标签（兼容旧存量数据的枚举 key）─────────────

export const MISSED_REASON_LABELS: Record<MissedReason, string> = {
  HESITATION: "犹豫，不确定",
  NO_CLEAR_SIGNAL: "等待的信号没出现",
  DISTRACTED: "走神 / 错过时间窗口",
  ALREADY_IN_TRADE: "当时已有其他持仓",
  RISK_LIMIT_HIT: "当日亏损到上限",
  SPREAD_TOO_WIDE: "价差不合适",
  NEWS_RISK: "有未知新闻风险",
  CHANGED_ANALYSIS: "重新分析后放弃",
  FEAR_OF_LOSS: "近期亏损带来的恐惧",
  OTHER: "其他",
}

// ─── 展示用的 SetupPriority 标签 ─────────────────────────────────────

export const SETUP_PRIORITY_LABELS: Record<SetupPriority, string> = {
  HIGH:   "高优先",
  MEDIUM: "中",
  LOW:    "低/观察",
}

// ─── 展示用的 ChartTimeframe 标签 ────────────────────────────────────

export const CHART_TIMEFRAME_LABELS: Record<ChartTimeframe, string> = {
  M1:  "1m",
  M5:  "5m",
  M15: "15m",
  M30: "30m",
  H1:  "1h",
  H4:  "4h",
  D1:  "1D",
}

// ─── MissedReasonOption (用户自定义错过原因) ──────────────────────────

export interface MissedReasonOption {
  id:        string
  label:     string
  isActive:  boolean
  sortOrder: number
  createdAt: string
}

// ─── 展示用的 PriceTier 标签 ──────────────────────────────────────────

export const PRICE_TIER_LABELS: Record<PriceTier, string> = {
  BELOW_2: "< $2",
  BETWEEN_2_20: "$2–$20",
  ABOVE_20: "> $20",
}

// ─── 展示用的 MarketCapTier 标签 ──────────────────────────────────────

export const MARKET_CAP_TIER_LABELS: Record<MarketCapTier, string> = {
  BELOW_300M: "< 300M",
  BETWEEN_300M_2B: "300M–2B",
  BETWEEN_2B_10B: "2B–10B",
  ABOVE_10B: "> 10B",
}

// ─── API 响应格式 ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ─── 带关联的 DailySession DTO ────────────────────────────────────────

export interface DailySessionSummary {
  date: string // ISO date string YYYY-MM-DD
  setupCount: number
  executedCount: number
  missedCount: number
  totalPnL: number | null
}

// ─── NewsStrength ─────────────────────────────────────────────────────

export type NewsStrength = "STRONG" | "MEDIUM" | "WEAK"

export const NEWS_STRENGTH_LABELS: Record<NewsStrength, string> = {
  STRONG: "强",
  MEDIUM: "中等",
  WEAK: "弱",
}

export interface NewsCatalogItem {
  id: string
  name: string
  category: string
  subCategory: string | null
  strength: NewsStrength
  description: string | null
  entryConditions: string[]  // 入场基本条件（已从 JSON 解析为数组）
  riskFactors: string[]      // 风险因素（已从 JSON 解析为数组）
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── 截图上传结果 ─────────────────────────────────────────────────────

export interface UploadedScreenshot {
  id: string
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
}

// ─── MNQ 情景相关 ─────────────────────────────────────────────────────

export type MnqScenario = "RANGE_SWEEP" | "TREND_REGULAR" | "TREND_GAP_FADE" | "TREND_GAP_HOLD"

export const MNQ_SCENARIO_LABELS: Record<MnqScenario, string> = {
  RANGE_SWEEP: "震荡日 Sweep 反转",
  TREND_REGULAR: "常规趋势日 (A)",
  TREND_GAP_FADE: "Gap & Fade (B)",
  TREND_GAP_HOLD: "Gap & Hold (C)",
}

// 关键价位标签（仅文字引用，无数值）
export type MnqKeyLevel = "PDH" | "PDL" | "PDC" | "PMH" | "PML" | "ONH" | "ONL"

export const MNQ_KEY_LEVEL_LABELS: Record<MnqKeyLevel, string> = {
  PDH: "PDH (前日高)",
  PDL: "PDL (前日低)",
  PDC: "PDC (前日收)",
  PMH: "PMH (盘前高)",
  PML: "PML (盘前低)",
  ONH: "ONH (隔夜高)",
  ONL: "ONL (隔夜低)",
}

// 震荡日 band 选项
export const MNQ_UPBAND_OPTIONS: MnqKeyLevel[] = ["PDH", "PMH", "ONH", "ONL", "PDC", "PDL"]
export const MNQ_DOWNBAND_OPTIONS: MnqKeyLevel[] = ["PDL", "ONL", "PML", "ONH", "PMH", "PDH", "PDC"]
