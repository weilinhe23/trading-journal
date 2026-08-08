// ─── 枚举镜像（与 Prisma schema 保持一致）────────────────────────────

export type Direction = "LONG" | "SHORT" | "TBD";

export type PriceTier = "BELOW_2" | "BETWEEN_2_20" | "ABOVE_20";

export type MarketCapTier =
  | "BELOW_300M"
  | "BETWEEN_300M_2B"
  | "BETWEEN_2B_10B"
  | "ABOVE_10B";

export type SetupStatus =
  | "WATCHING"
  | "EXECUTED"
  | "MISSED"
  | "INVALIDATED"
  | "CANCELLED";

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
  | "OTHER";

export type SetupPriority = "HIGH" | "MEDIUM" | "LOW";

export type ChartTimeframe = "M1" | "M5" | "M15" | "M30" | "H1" | "H4" | "D1";

export type MnqDecisionTimeframe = "M1" | "M5" | "M15" | "M30" | "H1";

export type MnqMarketType =
  | "RANGE"
  | "TREND"
  | "TREND_TO_RANGE"
  | "RANGE_TO_TREND"
  | "UNCERTAIN";

export type MnqMarketDirection = "UP" | "DOWN" | "TWO_WAY" | "NONE";

export type MnqMarketAccuracy = "CORRECT" | "PARTIAL" | "WRONG";

export type MnqMarketOpportunityImpact = "NONE" | "POSITIVE" | "NEGATIVE";

export type MnqMarketImpactType =
  | "DISCOVERED_EXTRA_OPPORTUNITY"
  | "FILTERED_INVALID_OPPORTUNITY"
  | "MISSED_OPPORTUNITY"
  | "WRONG_DIRECTION"
  | "ENTRY_TIMING_ERROR"
  | "WRONG_STRATEGY"
  | "FAILED_TO_UPDATE_BIAS"
  | "INVALIDATED_PLANNED_OPPORTUNITY";

export type MnqMarketDeviationReason =
  | "REGIME_WRONG"
  | "DIRECTION_WRONG"
  | "LEVEL_MISREAD"
  | "TIMEFRAME_MISMATCH"
  | "CONTINUATION_REVERSAL_WRONG"
  | "PREMATURE_JUDGMENT"
  | "CONTEXT_IGNORED"
  | "FAILED_TO_UPDATE"
  | "PLAN_TOO_VAGUE"
  | "OTHER";

export type MnqMissedReasonCategory =
  | "NOT_RECOGNIZED"
  | "RECOGNIZED_LATE"
  | "TIMEFRAME_MISSED"
  | "HESITATION"
  | "RULE_UNCLEAR"
  | "ORDER_NOT_FILLED"
  | "ORDER_MANAGEMENT"
  | "RISK_CONSTRAINT"
  | "ALREADY_IN_TRADE"
  | "INTENTIONAL_FILTER"
  | "DISTRACTED"
  | "OTHER";

export type Grade = "A" | "B" | "C" | "D";

export type NewsType =
  | "EARNINGS"
  | "FED"
  | "MACRO"
  | "SECTOR"
  | "COMPANY"
  | "TECHNICAL";

export type NewsImpact = "BULLISH" | "BEARISH" | "NEUTRAL" | "UNCERTAIN";

export type ChartTag =
  | "PRE_MARKET_PLAN"
  | "ENTRY_SIGNAL"
  | "EXIT_SIGNAL"
  | "MISSED_SIGNAL"
  | "POST_REVIEW"
  | "MARKET_OVERVIEW";

// ─── 展示用的 NewsType 标签 ───────────────────────────────────────────

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  EARNINGS: "财报",
  FED: "美联储",
  MACRO: "宏观数据",
  SECTOR: "行业新闻",
  COMPANY: "公司公告",
  TECHNICAL: "纯技术面",
};

// ─── 展示用的 NewsImpact 标签 ─────────────────────────────────────────

export const NEWS_IMPACT_LABELS: Record<NewsImpact, string> = {
  BULLISH: "利多",
  BEARISH: "利空",
  NEUTRAL: "中性",
  UNCERTAIN: "不确定",
};

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
};

// ─── 展示用的 SetupPriority 标签 ─────────────────────────────────────

export const SETUP_PRIORITY_LABELS: Record<SetupPriority, string> = {
  HIGH: "高优先",
  MEDIUM: "中",
  LOW: "低/观察",
};

// ─── 展示用的 ChartTimeframe 标签 ────────────────────────────────────

export const CHART_TIMEFRAME_LABELS: Record<ChartTimeframe, string> = {
  M1: "1m",
  M5: "5m",
  M15: "15m",
  M30: "30m",
  H1: "1h",
  H4: "4h",
  D1: "1D",
};

export const MNQ_DECISION_TIMEFRAME_OPTIONS = [
  "M1",
  "M5",
  "M15",
  "M30",
  "H1",
] as const;

export const MNQ_DECISION_TIMEFRAME_LABELS: Record<
  MnqDecisionTimeframe,
  string
> = {
  M1: "1min",
  M5: "5min",
  M15: "15min",
  M30: "30min",
  H1: "1h",
};

export function isMnqDecisionTimeframe(
  value: unknown,
): value is MnqDecisionTimeframe {
  return (
    typeof value === "string" &&
    MNQ_DECISION_TIMEFRAME_OPTIONS.some((option) => option === value)
  );
}

export const MNQ_MARKET_TYPE_OPTIONS: ReadonlyArray<{
  value: MnqMarketType;
  label: string;
}> = [
  { value: "RANGE", label: "震荡" },
  { value: "TREND", label: "趋势" },
  { value: "TREND_TO_RANGE", label: "趋势转震荡" },
  { value: "RANGE_TO_TREND", label: "震荡转趋势" },
  { value: "UNCERTAIN", label: "不确定" },
];

export const MNQ_MARKET_TYPE_LABELS: Record<MnqMarketType, string> =
  Object.fromEntries(
    MNQ_MARKET_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
  ) as Record<MnqMarketType, string>;

export const MNQ_MARKET_DIRECTION_OPTIONS: ReadonlyArray<{
  value: MnqMarketDirection;
  label: string;
}> = [
  { value: "UP", label: "上涨" },
  { value: "DOWN", label: "下跌" },
  { value: "TWO_WAY", label: "双向" },
  { value: "NONE", label: "无明确方向" },
];

export const MNQ_MARKET_DIRECTION_LABELS: Record<MnqMarketDirection, string> =
  Object.fromEntries(
    MNQ_MARKET_DIRECTION_OPTIONS.map(({ value, label }) => [value, label]),
  ) as Record<MnqMarketDirection, string>;

export const MNQ_MARKET_ACCURACY_OPTIONS: ReadonlyArray<{
  value: MnqMarketAccuracy;
  label: string;
}> = [
  { value: "CORRECT", label: "准确" },
  { value: "PARTIAL", label: "部分准确" },
  { value: "WRONG", label: "错误" },
];

export const MNQ_MARKET_ACCURACY_LABELS: Record<MnqMarketAccuracy, string> = {
  CORRECT: "准确",
  PARTIAL: "部分准确",
  WRONG: "错误",
};

export const MNQ_MARKET_OPPORTUNITY_IMPACT_OPTIONS: ReadonlyArray<{
  value: MnqMarketOpportunityImpact;
  label: string;
}> = [
  { value: "NONE", label: "无明显影响" },
  { value: "POSITIVE", label: "正面影响" },
  { value: "NEGATIVE", label: "负面影响" },
];

export const MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS: Record<
  MnqMarketOpportunityImpact,
  string
> = Object.fromEntries(
  MNQ_MARKET_OPPORTUNITY_IMPACT_OPTIONS.map(({ value, label }) => [
    value,
    label,
  ]),
) as Record<MnqMarketOpportunityImpact, string>;

export const MNQ_MARKET_IMPACT_TYPE_OPTIONS: ReadonlyArray<{
  value: MnqMarketImpactType;
  label: string;
  impact: "POSITIVE" | "NEGATIVE";
}> = [
  {
    value: "DISCOVERED_EXTRA_OPPORTUNITY",
    label: "发现了额外机会",
    impact: "POSITIVE",
  },
  {
    value: "FILTERED_INVALID_OPPORTUNITY",
    label: "正确过滤无效机会",
    impact: "POSITIVE",
  },
  { value: "MISSED_OPPORTUNITY", label: "错失了交易机会", impact: "NEGATIVE" },
  { value: "WRONG_DIRECTION", label: "选择了错误方向", impact: "NEGATIVE" },
  { value: "ENTRY_TIMING_ERROR", label: "入场过早或过晚", impact: "NEGATIVE" },
  { value: "WRONG_STRATEGY", label: "使用了错误策略", impact: "NEGATIVE" },
  {
    value: "FAILED_TO_UPDATE_BIAS",
    label: "未及时调整行情判断",
    impact: "NEGATIVE",
  },
  {
    value: "INVALIDATED_PLANNED_OPPORTUNITY",
    label: "导致计划内机会失效",
    impact: "NEGATIVE",
  },
];

export const MNQ_MARKET_IMPACT_TYPE_LABELS: Record<
  MnqMarketImpactType,
  string
> = Object.fromEntries(
  MNQ_MARKET_IMPACT_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<MnqMarketImpactType, string>;

export const MNQ_MARKET_DEVIATION_REASON_OPTIONS: ReadonlyArray<{
  value: MnqMarketDeviationReason;
  label: string;
}> = [
  { value: "REGIME_WRONG", label: "行情类型判断错误" },
  { value: "DIRECTION_WRONG", label: "方向判断错误" },
  { value: "LEVEL_MISREAD", label: "关键 Level 解读错误" },
  { value: "TIMEFRAME_MISMATCH", label: "时间周期使用不当" },
  { value: "CONTINUATION_REVERSAL_WRONG", label: "延续 / 反转判断错误" },
  { value: "PREMATURE_JUDGMENT", label: "判断过早、确认不足" },
  { value: "CONTEXT_IGNORED", label: "忽略新闻或时段特征" },
  { value: "FAILED_TO_UPDATE", label: "行情变化后未及时更新" },
  { value: "PLAN_TOO_VAGUE", label: "计划描述不够明确" },
  { value: "OTHER", label: "其他" },
];

export const MNQ_MARKET_DEVIATION_REASON_LABELS: Record<
  MnqMarketDeviationReason,
  string
> = Object.fromEntries(
  MNQ_MARKET_DEVIATION_REASON_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<MnqMarketDeviationReason, string>;

export function isMnqMarketType(value: unknown): value is MnqMarketType {
  return (
    typeof value === "string" &&
    MNQ_MARKET_TYPE_OPTIONS.some((option) => option.value === value)
  );
}

export function isMnqMarketDirection(
  value: unknown,
): value is MnqMarketDirection {
  return (
    typeof value === "string" &&
    MNQ_MARKET_DIRECTION_OPTIONS.some((option) => option.value === value)
  );
}

export function isMnqMarketAccuracy(
  value: unknown,
): value is MnqMarketAccuracy {
  return (
    typeof value === "string" &&
    MNQ_MARKET_ACCURACY_OPTIONS.some((option) => option.value === value)
  );
}

export function isMnqMarketOpportunityImpact(
  value: unknown,
): value is MnqMarketOpportunityImpact {
  return (
    typeof value === "string" &&
    MNQ_MARKET_OPPORTUNITY_IMPACT_OPTIONS.some(
      (option) => option.value === value,
    )
  );
}

export function isMnqMarketImpactType(
  value: unknown,
): value is MnqMarketImpactType {
  return (
    typeof value === "string" &&
    MNQ_MARKET_IMPACT_TYPE_OPTIONS.some((option) => option.value === value)
  );
}

export function isMnqMarketDeviationReason(
  value: unknown,
): value is MnqMarketDeviationReason {
  return (
    typeof value === "string" &&
    MNQ_MARKET_DEVIATION_REASON_OPTIONS.some((option) => option.value === value)
  );
}

export const MNQ_MISSED_REASON_OPTIONS: ReadonlyArray<{
  value: MnqMissedReasonCategory;
  label: string;
  group: "识别" | "决策" | "执行" | "约束";
}> = [
  { value: "NOT_RECOGNIZED", label: "未识别信号", group: "识别" },
  { value: "RECOGNIZED_LATE", label: "发现太晚", group: "识别" },
  { value: "TIMEFRAME_MISSED", label: "遗漏周期确认", group: "识别" },
  { value: "HESITATION", label: "犹豫 / 害怕亏损", group: "决策" },
  { value: "RULE_UNCLEAR", label: "策略规则不清", group: "决策" },
  { value: "ORDER_NOT_FILLED", label: "挂单未成交", group: "执行" },
  { value: "ORDER_MANAGEMENT", label: "订单调整不及时", group: "执行" },
  { value: "DISTRACTED", label: "分心 / 注意力中断", group: "执行" },
  { value: "RISK_CONSTRAINT", label: "风险限制", group: "约束" },
  { value: "ALREADY_IN_TRADE", label: "已有其他持仓", group: "约束" },
  { value: "INTENTIONAL_FILTER", label: "主动过滤 / 合理放弃", group: "约束" },
  { value: "OTHER", label: "其他", group: "约束" },
];

export const MNQ_MISSED_REASON_LABELS: Record<MnqMissedReasonCategory, string> =
  Object.fromEntries(
    MNQ_MISSED_REASON_OPTIONS.map((option) => [option.value, option.label]),
  ) as Record<MnqMissedReasonCategory, string>;

export function isMnqMissedReasonCategory(
  value: unknown,
): value is MnqMissedReasonCategory {
  return (
    typeof value === "string" &&
    MNQ_MISSED_REASON_OPTIONS.some((option) => option.value === value)
  );
}

// ─── MissedReasonOption (用户自定义错过原因) ──────────────────────────

export interface MissedReasonOption {
  id: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

// ─── 展示用的 PriceTier 标签 ──────────────────────────────────────────

export const PRICE_TIER_LABELS: Record<PriceTier, string> = {
  BELOW_2: "< $2",
  BETWEEN_2_20: "$2–$20",
  ABOVE_20: "> $20",
};

// ─── 展示用的 MarketCapTier 标签 ──────────────────────────────────────

export const MARKET_CAP_TIER_LABELS: Record<MarketCapTier, string> = {
  BELOW_300M: "< 300M",
  BETWEEN_300M_2B: "300M–2B",
  BETWEEN_2B_10B: "2B–10B",
  ABOVE_10B: "> 10B",
};

// ─── API 响应格式 ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── 带关联的 DailySession DTO ────────────────────────────────────────

export interface DailySessionSummary {
  date: string; // ISO date string YYYY-MM-DD
  setupCount: number;
  executedCount: number;
  missedCount: number;
  totalPnL: number | null;
}

// ─── NewsStrength ─────────────────────────────────────────────────────

export type NewsStrength = "STRONG" | "MEDIUM" | "WEAK";

export const NEWS_STRENGTH_LABELS: Record<NewsStrength, string> = {
  STRONG: "强",
  MEDIUM: "中等",
  WEAK: "弱",
};

export interface NewsCatalogItem {
  id: string;
  name: string;
  category: string;
  subCategory: string | null;
  strength: NewsStrength;
  description: string | null;
  entryConditions: string[]; // 入场基本条件（已从 JSON 解析为数组）
  riskFactors: string[]; // 风险因素（已从 JSON 解析为数组）
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── 截图上传结果 ─────────────────────────────────────────────────────

export interface UploadedScreenshot {
  id: string;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

// ─── MNQ 情景相关 ─────────────────────────────────────────────────────

export type MnqScenario =
  | "RANGE_SWEEP"
  | "TREND_REGULAR"
  | "TREND_GAP_FADE"
  | "TREND_GAP_HOLD";

export const MNQ_SCENARIO_LABELS: Record<MnqScenario, string> = {
  RANGE_SWEEP: "震荡日 Sweep 反转",
  TREND_REGULAR: "常规趋势日 (A)",
  TREND_GAP_FADE: "Gap & Fade (B)",
  TREND_GAP_HOLD: "Gap & Hold (C)",
};

// 关键价位标签（仅文字引用，无数值）
export type MnqKeyLevel = "PDH" | "PDL" | "PDC" | "PMH" | "PML" | "ONH" | "ONL";

export const MNQ_KEY_LEVEL_LABELS: Record<MnqKeyLevel, string> = {
  PDH: "PDH (前日高)",
  PDL: "PDL (前日低)",
  PDC: "PDC (前日收)",
  PMH: "PMH (盘前高)",
  PML: "PML (盘前低)",
  ONH: "ONH (隔夜高)",
  ONL: "ONL (隔夜低)",
};

// 震荡日 band 选项
export const MNQ_UPBAND_OPTIONS: MnqKeyLevel[] = [
  "PDH",
  "PMH",
  "ONH",
  "ONL",
  "PDC",
  "PDL",
];
export const MNQ_DOWNBAND_OPTIONS: MnqKeyLevel[] = [
  "PDL",
  "ONL",
  "PML",
  "ONH",
  "PMH",
  "PDH",
  "PDC",
];
