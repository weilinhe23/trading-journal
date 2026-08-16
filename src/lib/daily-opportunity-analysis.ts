import {
  MNQ_MARKET_ACCURACY_LABELS,
  MNQ_MARKET_DEVIATION_REASON_LABELS,
  MNQ_MARKET_DIRECTION_LABELS,
  MNQ_MARKET_IMPACT_TYPE_LABELS,
  MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS,
  MNQ_MARKET_TYPE_LABELS,
  MNQ_MISSED_REASON_LABELS,
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

const MNQ_POINT_VALUE = 2;

export const MNQ_MARKET_SEGMENTS = [
  { key: "marketPreJson", label: "盘前", time: "盘前" },
  { key: "marketOpenJson", label: "开盘", time: "09:30–10:00" },
  { key: "marketMidJson", label: "盘中", time: "10:00–13:00" },
  { key: "marketAfternoonJson", label: "午盘", time: "13:00–收盘" },
] as const;

export interface MnqPlanOpportunitySource {
  marketPreJson: string | null;
  marketOpenJson: string | null;
  marketMidJson: string | null;
  marketAfternoonJson: string | null;
}

interface RawOpportunity {
  id?: string;
  description?: string;
  captured?: boolean | null;
  decisionTimeframe?: MnqDecisionTimeframe | null;
  entryApproach?: "DIRECT" | "PULLBACK" | null;
  missedReasonCategory?: MnqMissedReasonCategory | null;
  missedProcess?: string | null;
  missedRiskPts?: string | null;
  missedReturnPts?: string | null;
  tradeResult?: string | null;
  tradeResultNote?: string | null;
  tradeDirection?: "LONG" | "SHORT" | null;
  entryPrice?: string | null;
  exitPrice?: string | null;
  contracts?: string | null;
  entryTime?: string | null;
  exitTime?: string | null;
  stopPrice?: string | null;
  targetPrice?: string | null;
  plannedRiskPts?: string | null;
  plannedReturnPts?: string | null;
  maxDrawdownPts?: string | null;
  maxFavorablePts?: string | null;
  heldOvernight?: boolean | null;
  overnightReason?: string | null;
  strategyName?: string | null;
  tradeTypeName?: string | null;
  entryAccuracy?: "CORRECT" | "WRONG" | null;
  entryAccuracyNote?: string | null;
  exitAccuracy?: "CORRECT" | "WRONG" | null;
  exitAccuracyNote?: string | null;
  missedPlannedRiskPts?: string | null;
  missedPlannedReturnPts?: string | null;
}

interface RawSegment {
  type?: MnqMarketType | null;
  note?: string | null;
  expectedType?: MnqMarketType | null;
  expectedDirection?: MnqMarketDirection | null;
  expectedNote?: string | null;
  actualType?: MnqMarketType | null;
  actualDirection?: MnqMarketDirection | null;
  actualNote?: string | null;
  accuracy?: MnqMarketAccuracy | null;
  deviationReason?: MnqMarketDeviationReason | null;
  secondaryDeviationReasons?: MnqMarketDeviationReason[];
  deviationNote?: string | null;
  opportunityImpact?: MnqMarketOpportunityImpact | null;
  impactTypes?: MnqMarketImpactType[];
  impactOpportunityIds?: string[];
  impactNote?: string | null;
  premarketPhases?: {
    overnight?: RawPremarketPhase;
    usPremarket?: RawPremarketPhase;
  };
  opportunities?: RawOpportunity[];
  opportunity?: string;
}

interface RawPremarketPhase {
  type?: MnqMarketType | null;
  direction?: MnqMarketDirection | null;
  note?: string | null;
}

export interface MnqOpportunityRow {
  id: string;
  segment: string;
  segmentTime: string;
  description: string;
  status: "CAPTURED" | "MISSED" | "PENDING";
  direction: "LONG" | "SHORT" | null;
  strategy: string | null;
  tradeType: string | null;
  decisionTimeframe: MnqDecisionTimeframe | null;
  entryApproach: "DIRECT" | "PULLBACK" | null;
  entryPrice: number | null;
  exitPrice: number | null;
  contracts: number | null;
  entryTime: string;
  exitTime: string;
  stopPrice: number | null;
  targetPrice: number | null;
  tradeResult: string | null;
  plannedRiskPts: number | null;
  maxDrawdownPts: number | null;
  maxFavorablePts: number | null;
  missedRiskPts: number | null;
  missedReturnPts: number | null;
  heldOvernight: boolean;
  overnightReason: string;
  pnl: number | null;
  realizedR: number | null;
  plannedTargetR: number | null;
  maxDrawdownR: number | null;
  maxFavorableR: number | null;
  hypotheticalR: number | null;
  missedReasonCategory: MnqMissedReasonCategory | null;
  missedProcess: string;
  resultNote: string;
  entryAccuracy: "CORRECT" | "WRONG" | null;
  entryAccuracyNote: string;
  exitAccuracy: "CORRECT" | "WRONG" | null;
  exitAccuracyNote: string;
}

export interface MnqSegmentSummary {
  key: string;
  label: string;
  captured: number;
  missed: number;
  pending: number;
  pnl: number;
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
  affectedOpportunities: string[];
  impactNote: string;
  premarketPhases: MnqPremarketPhaseSummary[];
}

export interface MnqPremarketPhaseSummary {
  key: "overnight" | "usPremarket";
  label: string;
  time: string;
  type: MnqMarketType | null;
  direction: MnqMarketDirection | null;
  note: string;
}

export interface MnqMarketDayPoint {
  key: string;
  label: string;
  time: string;
  type: MnqMarketType | null;
  direction: MnqMarketDirection | null;
  note: string;
  recorded: boolean;
}

export interface MnqMarketDayAnalysis {
  points: MnqMarketDayPoint[];
  recordedCount: number;
  transitionCount: number;
  headline: string;
  insights: string[];
}

export interface MnqStrategySummary {
  name: string;
  tradeTypes: string[];
  totalCount: number;
  capturedCount: number;
  missedCount: number;
  pendingCount: number;
  captureRate: number | null;
  actualPnL: number;
  settledCount: number;
  wins: number;
  losses: number;
  winRate: number | null;
  realizedR: number;
  realizedRCount: number;
  missedPotentialR: number;
  missedEvaluatedCount: number;
  entryAccuracyRate: number | null;
  exitAccuracyRate: number | null;
  topMissedReason: string | null;
  assessment: string;
}

export interface MnqMissedReasonSummary {
  category: MnqMissedReasonCategory | "UNCLASSIFIED";
  label: string;
  count: number;
  share: number;
  hypotheticalR: number;
  details: MnqMissedReasonDetail[];
}

export interface MnqMissedReasonDetail {
  id: string;
  description: string;
  process: string;
  segment: string;
  strategy: string;
  hypotheticalR: number | null;
}

export type MnqProfitBandKey =
  | "LOSS"
  | "BREAKEVEN"
  | "PARTIAL"
  | "EXPECTED"
  | "EXCEEDED";

export interface MnqProfitBandSummary {
  key: MnqProfitBandKey;
  label: string;
  count: number;
  totalR: number;
}

export interface MnqProfitSourceSummary {
  description: string;
  strategy: string;
  segment: string;
  realizedR: number;
  pnl: number | null;
}

export interface MnqStrategyProfitSummary {
  name: string;
  tradeCount: number;
  evaluatedCount: number;
  totalR: number;
  averageR: number;
  winRate: number | null;
  averageWinR: number | null;
  averageLossR: number | null;
  expectancyR: number;
}

export interface MnqDailyProfitAnalysis {
  evaluatedCount: number;
  missingRCount: number;
  totalRealizedR: number;
  averageRealizedR: number | null;
  distribution: MnqProfitBandSummary[];
  largestWinner: MnqProfitSourceSummary | null;
  largestLoser: MnqProfitSourceSummary | null;
  missedPotentialR: number;
  missedEvaluatedCount: number;
  planComparedCount: number;
  planGapR: number | null;
  disciplineWarnings: MnqProfitSourceSummary[];
  strategies: MnqStrategyProfitSummary[];
  tradeQuality: MnqTradeQualitySummary[];
  completeQualityCount: number;
  averagePlanAttainmentRate: number | null;
  averageProfitCaptureRate: number | null;
  averageMaxDrawdownR: number | null;
  averageUnrealizedPotentialR: number | null;
}

export type MnqTradeQualityLevel =
  | "STRONG"
  | "ACCEPTABLE"
  | "NEEDS_IMPROVEMENT"
  | "INCOMPLETE";

export interface MnqTradeQualitySummary {
  id: string;
  description: string;
  strategy: string;
  segment: string;
  plannedTargetR: number | null;
  realizedR: number | null;
  maxFavorableR: number | null;
  maxDrawdownR: number | null;
  planAttainmentRate: number | null;
  profitCaptureRate: number | null;
  opportunityVsPlanRate: number | null;
  unrealizedPotentialR: number | null;
  qualityLevel: MnqTradeQualityLevel;
  diagnosis: string;
}

export interface MnqMissedProfitSourceSummary {
  description: string;
  strategy: string;
  segment: string;
  plannedTargetR: number | null;
  hypotheticalR: number | null;
  missedReason: string;
}

export interface MnqMissedStrategyProfitSummary {
  name: string;
  missedCount: number;
  plannedCount: number;
  averagePlannedR: number | null;
  evaluatedCount: number;
  totalHypotheticalR: number;
  averageHypotheticalR: number | null;
  comparableCount: number;
  hindsightGapR: number | null;
}

export interface MnqMissedReasonProfitSummary {
  label: string;
  count: number;
  plannedCount: number;
  totalPlannedR: number;
  evaluatedCount: number;
  totalHypotheticalR: number;
  averageHypotheticalR: number | null;
}

export interface MnqDailyMissedProfitAnalysis {
  missedCount: number;
  plannedCount: number;
  totalPlannedR: number;
  averagePlannedR: number | null;
  evaluatedCount: number;
  totalHypotheticalR: number;
  averageHypotheticalR: number | null;
  comparableCount: number;
  hindsightGapR: number | null;
  highValueCount: number;
  distribution: MnqProfitBandSummary[];
  largestPlannedOpportunity: MnqMissedProfitSourceSummary | null;
  largestHypotheticalOpportunity: MnqMissedProfitSourceSummary | null;
  strategies: MnqMissedStrategyProfitSummary[];
  reasons: MnqMissedReasonProfitSummary[];
}

export interface DailyOpportunityAnalysis {
  rows: MnqOpportunityRow[];
  segments: MnqSegmentSummary[];
  strategies: MnqStrategySummary[];
  missedReasons: MnqMissedReasonSummary[];
  profitAnalysis: MnqDailyProfitAnalysis;
  missedProfitAnalysis: MnqDailyMissedProfitAnalysis;
  marketDayAnalysis: MnqMarketDayAnalysis;
  totalCount: number;
  completedCount: number;
  capturedCount: number;
  missedCount: number;
  pendingCount: number;
  captureRate: number | null;
  actualPnL: number;
  settledCount: number;
  wins: number;
  losses: number;
  winRate: number | null;
  missedPotentialR: number;
  missedEvaluatedCount: number;
  segmentAccuracyRate: number | null;
  segmentAccuracyCounts: {
    correct: number;
    partial: number;
    wrong: number;
  };
  entryAccuracyRate: number | null;
  exitAccuracyRate: number | null;
  insights: string[];
  strategyInsights: string[];
}

function parseNumber(value: string | null | undefined): number | null {
  if (!value?.trim()) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSegment(raw: string | null): RawSegment {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RawSegment;
  } catch {
    return {};
  }
}

function summarizePremarketPhases(
  segment: RawSegment,
): MnqPremarketPhaseSummary[] {
  const definitions = [
    { key: "overnight" as const, label: "隔夜行情", time: "19:00 之前" },
    {
      key: "usPremarket" as const,
      label: "美国盘前行情",
      time: "19:00–21:30",
    },
  ];
  const hasStructuredPhases = Boolean(segment.premarketPhases);

  const phases = definitions.map((definition) => {
    const rawPhase = segment.premarketPhases?.[definition.key];
    const fallbackToLegacy =
      definition.key === "usPremarket" && !hasStructuredPhases;
    const type = isMnqMarketType(rawPhase?.type)
      ? rawPhase.type
      : fallbackToLegacy && isMnqMarketType(segment.type)
        ? segment.type
        : null;
    const direction = isMnqMarketDirection(rawPhase?.direction)
      ? rawPhase.direction
      : null;
    const note = rawPhase?.note?.trim().length
      ? rawPhase.note.trim()
      : fallbackToLegacy
        ? (segment.note?.trim() ?? "")
        : "";

    return { ...definition, type, direction, note };
  });
  return phases.some((phase) =>
    [phase.type, phase.direction, phase.note].some(Boolean),
  )
    ? phases
    : [];
}

export function buildMnqMarketDayAnalysis(
  segments: MnqSegmentSummary[],
): MnqMarketDayAnalysis {
  const premarket = segments.find((segment) => segment.key === "marketPreJson");
  const getSegmentPoint = (
    key: string,
    label: string,
    time: string,
  ): MnqMarketDayPoint => {
    const segment = segments.find((item) => item.key === key);
    const type = segment?.actualType ?? null;
    const direction = segment?.actualDirection ?? null;
    const note = segment?.actualNote ?? "";
    return {
      key,
      label,
      time,
      type,
      direction,
      note,
      recorded: [type, direction, note].some(Boolean),
    };
  };
  const getPremarketPoint = (
    key: "overnight" | "usPremarket",
    label: string,
    time: string,
  ): MnqMarketDayPoint => {
    const phase = premarket?.premarketPhases.find((item) => item.key === key);
    const type = phase?.type ?? null;
    const direction = phase?.direction ?? null;
    const note = phase?.note ?? "";
    return {
      key,
      label,
      time,
      type,
      direction,
      note,
      recorded: [type, direction, note].some(Boolean),
    };
  };

  const points: MnqMarketDayPoint[] = [
    getPremarketPoint("overnight", "隔夜", "19:00 之前"),
    getPremarketPoint("usPremarket", "美国盘前", "19:00–21:30"),
    getSegmentPoint("marketOpenJson", "开盘", "09:30–10:00"),
    getSegmentPoint("marketMidJson", "盘中", "10:00–13:00"),
    getSegmentPoint("marketAfternoonJson", "午盘", "13:00–收盘"),
  ];
  const recordedPoints = points.filter((point) => point.recorded);
  const transitionInsights: string[] = [];
  let transitionCount = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (!previous?.recorded || !current?.recorded) continue;

    const typeChanged = Boolean(
      previous.type && current.type && previous.type !== current.type,
    );
    const directionChanged = Boolean(
      previous.direction &&
      current.direction &&
      previous.direction !== current.direction,
    );
    if (typeChanged || directionChanged) transitionCount += 1;

    if (typeChanged && directionChanged && previous.type && current.type) {
      transitionInsights.push(
        `${previous.label}至${current.label}：结构由${MNQ_MARKET_TYPE_LABELS[previous.type]}转为${MNQ_MARKET_TYPE_LABELS[current.type]}，方向同步改变。`,
      );
    } else if (typeChanged && previous.type && current.type) {
      transitionInsights.push(
        `${previous.label}至${current.label}：行情由${MNQ_MARKET_TYPE_LABELS[previous.type]}转为${MNQ_MARKET_TYPE_LABELS[current.type]}。`,
      );
    } else if (directionChanged && previous.direction && current.direction) {
      transitionInsights.push(
        `${previous.label}至${current.label}：方向由${MNQ_MARKET_DIRECTION_LABELS[previous.direction]}转为${MNQ_MARKET_DIRECTION_LABELS[current.direction]}。`,
      );
    } else {
      const continued = [
        previous.type && current.type && previous.type === current.type
          ? MNQ_MARKET_TYPE_LABELS[current.type]
          : null,
        previous.direction &&
        current.direction &&
        previous.direction === current.direction
          ? MNQ_MARKET_DIRECTION_LABELS[current.direction]
          : null,
      ].filter((value): value is string => Boolean(value));
      if (continued.length > 0) {
        transitionInsights.push(
          `${previous.label}至${current.label}：${continued.join("、")}延续。`,
        );
      }
    }
  }

  const typeCounts = recordedPoints.reduce<
    Partial<Record<MnqMarketType, number>>
  >((counts, point) => {
    if (point.type) counts[point.type] = (counts[point.type] ?? 0) + 1;
    return counts;
  }, {});
  const dominantType = Object.entries(typeCounts).sort(
    ([, left], [, right]) => (right ?? 0) - (left ?? 0),
  )[0]?.[0] as MnqMarketType | undefined;
  const headline =
    recordedPoints.length === 0
      ? "五个时段尚未形成可分析的行情路径"
      : !dominantType
        ? `已记录 ${recordedPoints.length} 个时段，行情类型仍需补充`
        : transitionCount === 0
          ? `${MNQ_MARKET_TYPE_LABELS[dominantType]}主导，已记录时段结构较连贯`
          : `${MNQ_MARKET_TYPE_LABELS[dominantType]}主导，期间发生 ${transitionCount} 次结构或方向切换`;

  const insights = transitionInsights.slice(0, 4);
  const missingPoints = points.filter((point) => !point.recorded);
  if (missingPoints.length > 0) {
    insights.push(
      `已记录 ${recordedPoints.length}/5 个时段；待补充${missingPoints.map((point) => point.label).join("、")}。`,
    );
  }

  const evaluatedCoreSegments = segments.filter(
    (segment) =>
      (segment.key === "marketOpenJson" || segment.key === "marketMidJson") &&
      segment.accuracy,
  );
  if (evaluatedCoreSegments.length > 0) {
    insights.push(
      `核心判断：${evaluatedCoreSegments.map((segment) => `${segment.label}${segment.accuracy ? MNQ_MARKET_ACCURACY_LABELS[segment.accuracy] : "未评估"}`).join("，")}。`,
    );
  }

  const impactedSegments = segments.filter(
    (segment) =>
      segment.opportunityImpact === "POSITIVE" ||
      segment.opportunityImpact === "NEGATIVE",
  );
  if (impactedSegments.length > 0) {
    insights.push(
      `交易影响：${impactedSegments.map((segment) => `${segment.label}${segment.opportunityImpact ? MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS[segment.opportunityImpact] : ""}`).join("，")}。`,
    );
  }

  return {
    points,
    recordedCount: recordedPoints.length,
    transitionCount,
    headline,
    insights,
  };
}

function accuracyRate(
  values: Array<"CORRECT" | "WRONG" | null>,
): number | null {
  const evaluated = values.filter(
    (value): value is "CORRECT" | "WRONG" => value !== null,
  );
  return evaluated.length > 0
    ? (evaluated.filter((value) => value === "CORRECT").length /
        evaluated.length) *
        100
    : null;
}

function marketAccuracyRate(
  values: Array<MnqMarketAccuracy | null>,
): number | null {
  const evaluated = values.filter(
    (value): value is MnqMarketAccuracy => value !== null,
  );
  if (evaluated.length === 0) return null;
  const score = evaluated.reduce((sum, value) => {
    if (value === "CORRECT") return sum + 1;
    if (value === "PARTIAL") return sum + 0.5;
    return sum;
  }, 0);
  return (score / evaluated.length) * 100;
}

function calculatePnl(opportunity: RawOpportunity): number | null {
  const entry = parseNumber(opportunity.entryPrice);
  const exit = parseNumber(opportunity.exitPrice);
  const contracts = parseNumber(opportunity.contracts) ?? 1;
  if (
    entry === null ||
    exit === null ||
    entry <= 0 ||
    exit <= 0 ||
    opportunity.tradeDirection == null
  ) {
    return null;
  }
  const multiplier = opportunity.tradeDirection === "LONG" ? 1 : -1;
  return (exit - entry) * multiplier * contracts * MNQ_POINT_VALUE;
}

function calculateRealizedR(opportunity: RawOpportunity): number | null {
  const entry = parseNumber(opportunity.entryPrice);
  const exit = parseNumber(opportunity.exitPrice);
  const plannedRisk = parseNumber(opportunity.plannedRiskPts);
  if (
    entry === null ||
    exit === null ||
    plannedRisk === null ||
    plannedRisk <= 0 ||
    opportunity.tradeDirection == null
  ) {
    return null;
  }
  const multiplier = opportunity.tradeDirection === "LONG" ? 1 : -1;
  return ((exit - entry) * multiplier) / plannedRisk;
}

function assessStrategy(
  summary: Omit<MnqStrategySummary, "assessment">,
): string {
  if (summary.capturedCount === 0 && summary.missedCount > 0) {
    return summary.missedPotentialR >= 2
      ? "高价值机会未执行，优先复盘触发与下单环节"
      : "有机会但未执行，检查过滤是否合理";
  }
  if (
    summary.actualPnL < 0 &&
    summary.entryAccuracyRate !== null &&
    summary.entryAccuracyRate < 50
  ) {
    return "入场准确性偏低，执行质量可能拖累策略结果";
  }
  if (
    summary.captureRate !== null &&
    summary.captureRate < 50 &&
    summary.missedPotentialR >= 2
  ) {
    return "策略机会充足，但高价值机会未充分把握";
  }
  if (summary.actualPnL > 0 && summary.settledCount > 0) {
    return "当日产生正向贡献，可复盘有效触发条件";
  }
  if (summary.actualPnL < 0 && summary.settledCount > 0) {
    return "当日结果承压，需区分策略判断与执行偏差";
  }
  if (summary.pendingCount > 0) return "仍有机会待标记，结论尚不完整";
  return "当日样本有限，保留观察，不据此判断长期有效性";
}

function buildStrategySummaries(
  rows: MnqOpportunityRow[],
): MnqStrategySummary[] {
  const getStrategyName = (row: MnqOpportunityRow): string => {
    const name = row.strategy?.trim();
    return name && name.length > 0 ? name : "未选择策略";
  };
  const strategyNames = Array.from(new Set(rows.map(getStrategyName)));

  return strategyNames
    .map((name) => {
      const strategyRows = rows.filter((row) => getStrategyName(row) === name);
      const captured = strategyRows.filter((row) => row.status === "CAPTURED");
      const missed = strategyRows.filter((row) => row.status === "MISSED");
      const settled = captured.filter((row) => row.pnl !== null);
      const realized = captured.filter((row) => row.realizedR !== null);
      const missedEvaluated = missed.filter(
        (row) => row.hypotheticalR !== null,
      );
      const wins = settled.filter((row) => (row.pnl ?? 0) > 0).length;
      const losses = settled.filter((row) => (row.pnl ?? 0) < 0).length;
      const decidedResults = wins + losses;
      const completedCount = captured.length + missed.length;
      const reasonCounts = new Map<string, number>();
      for (const row of missed) {
        const reason = row.missedReasonCategory
          ? MNQ_MISSED_REASON_LABELS[row.missedReasonCategory]
          : "未分类";
        reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
      }
      const topMissedReason =
        [...reasonCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
      const base = {
        name,
        tradeTypes: Array.from(
          new Set(
            strategyRows
              .map((row) => row.tradeType?.trim())
              .filter((tradeType): tradeType is string => Boolean(tradeType)),
          ),
        ),
        totalCount: strategyRows.length,
        capturedCount: captured.length,
        missedCount: missed.length,
        pendingCount: strategyRows.length - completedCount,
        captureRate:
          completedCount > 0 ? (captured.length / completedCount) * 100 : null,
        actualPnL: settled.reduce((sum, row) => sum + (row.pnl ?? 0), 0),
        settledCount: settled.length,
        wins,
        losses,
        winRate: decidedResults > 0 ? (wins / decidedResults) * 100 : null,
        realizedR: realized.reduce((sum, row) => sum + (row.realizedR ?? 0), 0),
        realizedRCount: realized.length,
        missedPotentialR: missedEvaluated.reduce(
          (sum, row) => sum + (row.hypotheticalR ?? 0),
          0,
        ),
        missedEvaluatedCount: missedEvaluated.length,
        entryAccuracyRate: accuracyRate(
          captured.map((row) => row.entryAccuracy),
        ),
        exitAccuracyRate: accuracyRate(captured.map((row) => row.exitAccuracy)),
        topMissedReason,
      };
      return { ...base, assessment: assessStrategy(base) };
    })
    .sort(
      (a, b) =>
        b.totalCount - a.totalCount ||
        b.actualPnL - a.actualPnL ||
        b.missedPotentialR - a.missedPotentialR,
    );
}

function buildMissedReasonSummaries(
  rows: MnqOpportunityRow[],
): MnqMissedReasonSummary[] {
  const missedRows = rows.filter((row) => row.status === "MISSED");
  const summaries = new Map<
    MnqMissedReasonCategory | "UNCLASSIFIED",
    { count: number; hypotheticalR: number }
  >();

  for (const row of missedRows) {
    const category = row.missedReasonCategory ?? "UNCLASSIFIED";
    const current = summaries.get(category) ?? { count: 0, hypotheticalR: 0 };
    summaries.set(category, {
      count: current.count + 1,
      hypotheticalR: current.hypotheticalR + (row.hypotheticalR ?? 0),
    });
  }

  return [...summaries.entries()]
    .map(([category, summary]) => ({
      category,
      label:
        category === "UNCLASSIFIED"
          ? "未分类"
          : MNQ_MISSED_REASON_LABELS[category],
      count: summary.count,
      share:
        missedRows.length > 0 ? (summary.count / missedRows.length) * 100 : 0,
      hypotheticalR: summary.hypotheticalR,
      details: missedRows
        .filter(
          (row) => (row.missedReasonCategory ?? "UNCLASSIFIED") === category,
        )
        .map((row) => ({
          id: row.id,
          description: row.description,
          process: row.missedProcess,
          segment: row.segment,
          strategy: profitStrategyName(row),
          hypotheticalR: row.hypotheticalR,
        })),
    }))
    .sort((a, b) => b.count - a.count || b.hypotheticalR - a.hypotheticalR);
}

const PROFIT_BANDS: Array<{
  key: MnqProfitBandKey;
  label: string;
  matches: (realizedR: number) => boolean;
}> = [
  { key: "LOSS", label: "亏损", matches: (realizedR) => realizedR < -0.1 },
  {
    key: "BREAKEVEN",
    label: "保本",
    matches: (realizedR) => realizedR >= -0.1 && realizedR <= 0.1,
  },
  {
    key: "PARTIAL",
    label: "部分盈利",
    matches: (realizedR) => realizedR > 0.1 && realizedR < 1,
  },
  {
    key: "EXPECTED",
    label: "符合预期",
    matches: (realizedR) => realizedR >= 1 && realizedR <= 2,
  },
  { key: "EXCEEDED", label: "超预期", matches: (realizedR) => realizedR > 2 },
];

function profitStrategyName(row: MnqOpportunityRow): string {
  const name = row.strategy?.trim();
  return name && name.length > 0 ? name : "未选择策略";
}

function toProfitSource(row: MnqOpportunityRow): MnqProfitSourceSummary {
  return {
    description: row.description,
    strategy: profitStrategyName(row),
    segment: row.segment,
    realizedR: row.realizedR ?? 0,
    pnl: row.pnl,
  };
}

function buildTradeQuality(row: MnqOpportunityRow): MnqTradeQualitySummary {
  const plannedTargetR = row.plannedTargetR;
  const realizedR = row.realizedR;
  const maxFavorableR = row.maxFavorableR;
  const maxDrawdownR = row.maxDrawdownR;
  const planAttainmentRate =
    plannedTargetR !== null && plannedTargetR > 0 && realizedR !== null
      ? (realizedR / plannedTargetR) * 100
      : null;
  const profitCaptureRate =
    maxFavorableR !== null && maxFavorableR > 0 && realizedR !== null
      ? (realizedR / maxFavorableR) * 100
      : null;
  const opportunityVsPlanRate =
    plannedTargetR !== null && plannedTargetR > 0 && maxFavorableR !== null
      ? (maxFavorableR / plannedTargetR) * 100
      : null;
  const unrealizedPotentialR =
    maxFavorableR !== null && realizedR !== null
      ? maxFavorableR - realizedR
      : null;
  const complete =
    plannedTargetR !== null &&
    realizedR !== null &&
    maxFavorableR !== null &&
    maxDrawdownR !== null;
  const inconsistentMfe =
    realizedR !== null &&
    realizedR > 0 &&
    maxFavorableR !== null &&
    realizedR > maxFavorableR + 0.05;

  const diagnoses: string[] = [];
  if (inconsistentMfe) {
    diagnoses.push("最高盈利低于实际 R，请检查 MFE 或成交价格记录");
  }
  if (row.entryAccuracy === "WRONG") {
    diagnoses.push("入场条件未满足，先修正入场纪律");
  }
  if (maxDrawdownR !== null && maxDrawdownR > 1) {
    diagnoses.push("最大回撤超过 1R，检查止损执行和入场位置");
  }
  if (row.exitAccuracy === "WRONG") {
    diagnoses.push("退出不符合计划，先修正退出纪律");
  }
  if (
    realizedR !== null &&
    realizedR < 0 &&
    maxFavorableR !== null &&
    maxFavorableR >= 1
  ) {
    diagnoses.push("曾获得至少 1R 空间却最终亏损，改进保本与盈利保护");
  } else if (realizedR !== null && realizedR < 0) {
    diagnoses.push("实际亏损，复盘入场判断与止损执行");
  }
  if (opportunityVsPlanRate !== null && opportunityVsPlanRate < 80) {
    diagnoses.push("行情未提供足够目标空间，复盘计划目标是否适配当日环境");
  }
  if (
    profitCaptureRate !== null &&
    profitCaptureRate < 40 &&
    !(realizedR !== null && realizedR < 0 && (maxFavorableR ?? 0) >= 1)
  ) {
    diagnoses.push("盈利捕获不足，复盘退出过早或利润回吐");
  }
  if (planAttainmentRate !== null && planAttainmentRate < 50) {
    diagnoses.push("计划达成不足，检查持仓和退出执行");
  }
  if (diagnoses.length === 0) {
    diagnoses.push(
      complete
        ? "计划、风险和盈利兑现协调良好"
        : "补齐计划 R、实际 R、MFE 和 MAE 后可完成诊断",
    );
  }

  let qualityLevel: MnqTradeQualityLevel = "INCOMPLETE";
  if (complete) {
    const disciplineMet =
      row.entryAccuracy !== "WRONG" && row.exitAccuracy !== "WRONG";
    if (
      !inconsistentMfe &&
      disciplineMet &&
      maxDrawdownR <= 1 &&
      ((planAttainmentRate ?? 0) >= 100 ||
        ((planAttainmentRate ?? 0) >= 80 && (profitCaptureRate ?? 0) >= 60))
    ) {
      qualityLevel = "STRONG";
    } else if (
      !inconsistentMfe &&
      disciplineMet &&
      maxDrawdownR <= 1 &&
      realizedR > 0
    ) {
      qualityLevel = "ACCEPTABLE";
    } else {
      qualityLevel = "NEEDS_IMPROVEMENT";
    }
  }

  return {
    id: row.id,
    description: row.description,
    strategy: profitStrategyName(row),
    segment: row.segment,
    plannedTargetR,
    realizedR,
    maxFavorableR,
    maxDrawdownR,
    planAttainmentRate,
    profitCaptureRate,
    opportunityVsPlanRate,
    unrealizedPotentialR,
    qualityLevel,
    diagnosis: diagnoses.slice(0, 3).join("；"),
  };
}

function buildDailyProfitAnalysis(
  rows: MnqOpportunityRow[],
): MnqDailyProfitAnalysis {
  const capturedRows = rows.filter((row) => row.status === "CAPTURED");
  const evaluatedRows = capturedRows.filter(
    (row): row is MnqOpportunityRow & { realizedR: number } =>
      row.realizedR !== null,
  );
  const totalRealizedR = evaluatedRows.reduce(
    (sum, row) => sum + row.realizedR,
    0,
  );
  const distribution = PROFIT_BANDS.map((band) => {
    const bandRows = evaluatedRows.filter((row) => band.matches(row.realizedR));
    return {
      key: band.key,
      label: band.label,
      count: bandRows.length,
      totalR: bandRows.reduce((sum, row) => sum + row.realizedR, 0),
    };
  });
  const winner = [...evaluatedRows]
    .filter((row) => row.realizedR > 0)
    .sort((a, b) => b.realizedR - a.realizedR)[0];
  const loser = [...evaluatedRows]
    .filter((row) => row.realizedR < 0)
    .sort((a, b) => a.realizedR - b.realizedR)[0];
  const missedEvaluatedRows = rows.filter(
    (row): row is MnqOpportunityRow & { hypotheticalR: number } =>
      row.status === "MISSED" && row.hypotheticalR !== null,
  );
  const planComparedRows = evaluatedRows.filter(
    (
      row,
    ): row is MnqOpportunityRow & {
      realizedR: number;
      plannedTargetR: number;
    } => row.plannedTargetR !== null,
  );
  const strategyNames = Array.from(
    new Set(capturedRows.map(profitStrategyName)),
  );
  const strategies = strategyNames
    .map<MnqStrategyProfitSummary>((name) => {
      const tradeRows = capturedRows.filter(
        (row) => profitStrategyName(row) === name,
      );
      const strategyRows = evaluatedRows.filter(
        (row) => profitStrategyName(row) === name,
      );
      const wins = strategyRows.filter((row) => row.realizedR > 0);
      const losses = strategyRows.filter((row) => row.realizedR < 0);
      const totalR = strategyRows.reduce((sum, row) => sum + row.realizedR, 0);
      return {
        name,
        tradeCount: tradeRows.length,
        evaluatedCount: strategyRows.length,
        totalR,
        averageR: strategyRows.length > 0 ? totalR / strategyRows.length : 0,
        winRate:
          strategyRows.length > 0
            ? (wins.length / strategyRows.length) * 100
            : null,
        averageWinR:
          wins.length > 0
            ? wins.reduce((sum, row) => sum + row.realizedR, 0) / wins.length
            : null,
        averageLossR:
          losses.length > 0
            ? losses.reduce((sum, row) => sum + row.realizedR, 0) /
              losses.length
            : null,
        expectancyR: strategyRows.length > 0 ? totalR / strategyRows.length : 0,
      };
    })
    .sort(
      (a, b) =>
        b.evaluatedCount - a.evaluatedCount || b.expectancyR - a.expectancyR,
    );
  const tradeQuality = capturedRows.map(buildTradeQuality);
  let completeQualityCount = 0;
  let planAttainmentTotal = 0;
  let planAttainmentCount = 0;
  let profitCaptureTotal = 0;
  let profitCaptureCount = 0;
  let maxDrawdownTotal = 0;
  let maxDrawdownCount = 0;
  let unrealizedPotentialTotal = 0;
  let unrealizedPotentialCount = 0;
  for (const trade of tradeQuality) {
    if (trade.qualityLevel !== "INCOMPLETE") completeQualityCount += 1;
    if (trade.planAttainmentRate !== null) {
      planAttainmentTotal += trade.planAttainmentRate;
      planAttainmentCount += 1;
    }
    if (trade.profitCaptureRate !== null) {
      profitCaptureTotal += trade.profitCaptureRate;
      profitCaptureCount += 1;
    }
    if (trade.maxDrawdownR !== null) {
      maxDrawdownTotal += trade.maxDrawdownR;
      maxDrawdownCount += 1;
    }
    if (trade.unrealizedPotentialR !== null) {
      unrealizedPotentialTotal += trade.unrealizedPotentialR;
      unrealizedPotentialCount += 1;
    }
  }

  return {
    evaluatedCount: evaluatedRows.length,
    missingRCount: capturedRows.length - evaluatedRows.length,
    totalRealizedR,
    averageRealizedR:
      evaluatedRows.length > 0 ? totalRealizedR / evaluatedRows.length : null,
    distribution,
    largestWinner: winner ? toProfitSource(winner) : null,
    largestLoser: loser ? toProfitSource(loser) : null,
    missedPotentialR: missedEvaluatedRows.reduce(
      (sum, row) => sum + row.hypotheticalR,
      0,
    ),
    missedEvaluatedCount: missedEvaluatedRows.length,
    planComparedCount: planComparedRows.length,
    planGapR:
      planComparedRows.length > 0
        ? planComparedRows.reduce(
            (sum, row) => sum + row.realizedR - row.plannedTargetR,
            0,
          )
        : null,
    disciplineWarnings: evaluatedRows
      .filter((row) => row.realizedR > 2 && row.exitAccuracy === "WRONG")
      .map(toProfitSource),
    strategies,
    tradeQuality,
    completeQualityCount,
    averagePlanAttainmentRate:
      planAttainmentCount > 0
        ? planAttainmentTotal / planAttainmentCount
        : null,
    averageProfitCaptureRate:
      profitCaptureCount > 0 ? profitCaptureTotal / profitCaptureCount : null,
    averageMaxDrawdownR:
      maxDrawdownCount > 0 ? maxDrawdownTotal / maxDrawdownCount : null,
    averageUnrealizedPotentialR:
      unrealizedPotentialCount > 0
        ? unrealizedPotentialTotal / unrealizedPotentialCount
        : null,
  };
}

function missedReasonLabel(row: MnqOpportunityRow): string {
  return row.missedReasonCategory
    ? MNQ_MISSED_REASON_LABELS[row.missedReasonCategory]
    : "未分类";
}

function toMissedProfitSource(
  row: MnqOpportunityRow,
): MnqMissedProfitSourceSummary {
  return {
    description: row.description,
    strategy: profitStrategyName(row),
    segment: row.segment,
    plannedTargetR: row.plannedTargetR,
    hypotheticalR: row.hypotheticalR,
    missedReason: missedReasonLabel(row),
  };
}

function buildDailyMissedProfitAnalysis(
  rows: MnqOpportunityRow[],
): MnqDailyMissedProfitAnalysis {
  const missedRows = rows.filter((row) => row.status === "MISSED");
  const plannedRows = missedRows.filter(
    (row): row is MnqOpportunityRow & { plannedTargetR: number } =>
      row.plannedTargetR !== null,
  );
  const evaluatedRows = missedRows.filter(
    (row): row is MnqOpportunityRow & { hypotheticalR: number } =>
      row.hypotheticalR !== null,
  );
  const comparableRows = evaluatedRows.filter(
    (
      row,
    ): row is MnqOpportunityRow & {
      hypotheticalR: number;
      plannedTargetR: number;
    } => row.plannedTargetR !== null,
  );
  const totalPlannedR = plannedRows.reduce(
    (sum, row) => sum + row.plannedTargetR,
    0,
  );
  const totalHypotheticalR = evaluatedRows.reduce(
    (sum, row) => sum + row.hypotheticalR,
    0,
  );
  const distribution = PROFIT_BANDS.map((band) => {
    const bandRows = evaluatedRows.filter((row) =>
      band.matches(row.hypotheticalR),
    );
    return {
      key: band.key,
      label: band.label,
      count: bandRows.length,
      totalR: bandRows.reduce((sum, row) => sum + row.hypotheticalR, 0),
    };
  });
  const largestPlanned = [...plannedRows].sort(
    (a, b) => b.plannedTargetR - a.plannedTargetR,
  )[0];
  const largestHypothetical = [...evaluatedRows].sort(
    (a, b) => b.hypotheticalR - a.hypotheticalR,
  )[0];
  const strategyNames = Array.from(new Set(missedRows.map(profitStrategyName)));
  const strategies = strategyNames
    .map<MnqMissedStrategyProfitSummary>((name) => {
      const strategyRows = missedRows.filter(
        (row) => profitStrategyName(row) === name,
      );
      const strategyPlanned = strategyRows.filter(
        (row): row is MnqOpportunityRow & { plannedTargetR: number } =>
          row.plannedTargetR !== null,
      );
      const strategyEvaluated = strategyRows.filter(
        (row): row is MnqOpportunityRow & { hypotheticalR: number } =>
          row.hypotheticalR !== null,
      );
      const strategyComparable = strategyEvaluated.filter(
        (
          row,
        ): row is MnqOpportunityRow & {
          hypotheticalR: number;
          plannedTargetR: number;
        } => row.plannedTargetR !== null,
      );
      const strategyTotalHypothetical = strategyEvaluated.reduce(
        (sum, row) => sum + row.hypotheticalR,
        0,
      );
      return {
        name,
        missedCount: strategyRows.length,
        plannedCount: strategyPlanned.length,
        averagePlannedR:
          strategyPlanned.length > 0
            ? strategyPlanned.reduce(
                (sum, row) => sum + row.plannedTargetR,
                0,
              ) / strategyPlanned.length
            : null,
        evaluatedCount: strategyEvaluated.length,
        totalHypotheticalR: strategyTotalHypothetical,
        averageHypotheticalR:
          strategyEvaluated.length > 0
            ? strategyTotalHypothetical / strategyEvaluated.length
            : null,
        comparableCount: strategyComparable.length,
        hindsightGapR:
          strategyComparable.length > 0
            ? strategyComparable.reduce(
                (sum, row) => sum + row.hypotheticalR - row.plannedTargetR,
                0,
              )
            : null,
      };
    })
    .sort(
      (a, b) =>
        b.totalHypotheticalR - a.totalHypotheticalR ||
        b.missedCount - a.missedCount,
    );
  const reasonLabels = Array.from(new Set(missedRows.map(missedReasonLabel)));
  const reasons = reasonLabels
    .map<MnqMissedReasonProfitSummary>((label) => {
      const reasonRows = missedRows.filter(
        (row) => missedReasonLabel(row) === label,
      );
      const reasonPlanned = reasonRows.filter(
        (row): row is MnqOpportunityRow & { plannedTargetR: number } =>
          row.plannedTargetR !== null,
      );
      const reasonEvaluated = reasonRows.filter(
        (row): row is MnqOpportunityRow & { hypotheticalR: number } =>
          row.hypotheticalR !== null,
      );
      const reasonTotalHypothetical = reasonEvaluated.reduce(
        (sum, row) => sum + row.hypotheticalR,
        0,
      );
      return {
        label,
        count: reasonRows.length,
        plannedCount: reasonPlanned.length,
        totalPlannedR: reasonPlanned.reduce(
          (sum, row) => sum + row.plannedTargetR,
          0,
        ),
        evaluatedCount: reasonEvaluated.length,
        totalHypotheticalR: reasonTotalHypothetical,
        averageHypotheticalR:
          reasonEvaluated.length > 0
            ? reasonTotalHypothetical / reasonEvaluated.length
            : null,
      };
    })
    .sort(
      (a, b) =>
        b.totalHypotheticalR - a.totalHypotheticalR || b.count - a.count,
    );

  return {
    missedCount: missedRows.length,
    plannedCount: plannedRows.length,
    totalPlannedR,
    averagePlannedR:
      plannedRows.length > 0 ? totalPlannedR / plannedRows.length : null,
    evaluatedCount: evaluatedRows.length,
    totalHypotheticalR,
    averageHypotheticalR:
      evaluatedRows.length > 0
        ? totalHypotheticalR / evaluatedRows.length
        : null,
    comparableCount: comparableRows.length,
    hindsightGapR:
      comparableRows.length > 0
        ? comparableRows.reduce(
            (sum, row) => sum + row.hypotheticalR - row.plannedTargetR,
            0,
          )
        : null,
    highValueCount: evaluatedRows.filter((row) => row.hypotheticalR > 2).length,
    distribution,
    largestPlannedOpportunity: largestPlanned
      ? toMissedProfitSource(largestPlanned)
      : null,
    largestHypotheticalOpportunity: largestHypothetical
      ? toMissedProfitSource(largestHypothetical)
      : null,
    strategies,
    reasons,
  };
}

export function analyzeDailyOpportunities(
  plan: MnqPlanOpportunitySource | null,
): DailyOpportunityAnalysis {
  const rows: MnqOpportunityRow[] = [];
  const segments: MnqSegmentSummary[] = [];

  for (const segmentDef of MNQ_MARKET_SEGMENTS) {
    const segment = parseSegment(plan?.[segmentDef.key] ?? null);
    const opportunities = Array.isArray(segment.opportunities)
      ? segment.opportunities
      : segment.opportunity?.trim()
        ? [{ description: segment.opportunity, captured: null }]
        : [];

    const segmentRows = opportunities.map<MnqOpportunityRow>(
      (opportunity, index) => {
        const risk = parseNumber(opportunity.missedRiskPts);
        const returnPoints = parseNumber(opportunity.missedReturnPts);
        const plannedRisk = parseNumber(
          opportunity.captured === false
            ? opportunity.missedPlannedRiskPts
            : opportunity.plannedRiskPts,
        );
        const plannedReturn = parseNumber(
          opportunity.captured === false
            ? opportunity.missedPlannedReturnPts
            : opportunity.plannedReturnPts,
        );
        const maxDrawdownPoints = parseNumber(opportunity.maxDrawdownPts);
        const maxFavorablePoints = parseNumber(opportunity.maxFavorablePts);
        const entryPrice = parseNumber(opportunity.entryPrice);
        const exitPrice = parseNumber(opportunity.exitPrice);
        const description = opportunity.description?.trim();
        return {
          id: `${segmentDef.key}:${opportunity.id ?? index}`,
          segment: segmentDef.label,
          segmentTime: segmentDef.time,
          description:
            description && description.length > 0
              ? description
              : `机会 ${index + 1}`,
          status:
            opportunity.captured === true
              ? "CAPTURED"
              : opportunity.captured === false
                ? "MISSED"
                : "PENDING",
          direction: opportunity.tradeDirection ?? null,
          strategy: opportunity.strategyName ?? null,
          tradeType: opportunity.tradeTypeName ?? null,
          decisionTimeframe: opportunity.decisionTimeframe ?? null,
          entryApproach: opportunity.entryApproach ?? null,
          entryPrice,
          exitPrice,
          contracts: parseNumber(opportunity.contracts),
          entryTime: opportunity.entryTime?.trim() ?? "",
          exitTime: opportunity.exitTime?.trim() ?? "",
          stopPrice: parseNumber(opportunity.stopPrice),
          targetPrice: parseNumber(opportunity.targetPrice),
          tradeResult: opportunity.tradeResult ?? null,
          plannedRiskPts: plannedRisk,
          maxDrawdownPts: maxDrawdownPoints,
          maxFavorablePts: maxFavorablePoints,
          missedRiskPts: risk,
          missedReturnPts: returnPoints,
          heldOvernight: opportunity.heldOvernight ?? false,
          overnightReason: opportunity.overnightReason?.trim() ?? "",
          pnl: opportunity.captured === true ? calculatePnl(opportunity) : null,
          realizedR:
            opportunity.captured === true
              ? calculateRealizedR(opportunity)
              : null,
          plannedTargetR:
            opportunity.captured !== null &&
            plannedRisk !== null &&
            plannedReturn !== null &&
            plannedRisk > 0
              ? plannedReturn / plannedRisk
              : null,
          maxDrawdownR:
            opportunity.captured === true &&
            maxDrawdownPoints !== null &&
            plannedRisk !== null &&
            plannedRisk > 0
              ? Math.abs(maxDrawdownPoints) / plannedRisk
              : null,
          maxFavorableR:
            opportunity.captured === true &&
            maxFavorablePoints !== null &&
            plannedRisk !== null &&
            plannedRisk > 0
              ? Math.abs(maxFavorablePoints) / plannedRisk
              : null,
          hypotheticalR:
            opportunity.captured === false &&
            risk !== null &&
            returnPoints !== null &&
            risk > 0
              ? returnPoints / risk
              : null,
          missedReasonCategory: isMnqMissedReasonCategory(
            opportunity.missedReasonCategory,
          )
            ? opportunity.missedReasonCategory
            : null,
          missedProcess: opportunity.missedProcess?.trim() ?? "",
          resultNote: opportunity.tradeResultNote?.trim() ?? "",
          entryAccuracy: opportunity.entryAccuracy ?? null,
          entryAccuracyNote: opportunity.entryAccuracyNote?.trim() ?? "",
          exitAccuracy: opportunity.exitAccuracy ?? null,
          exitAccuracyNote: opportunity.exitAccuracyNote?.trim() ?? "",
        };
      },
    );

    rows.push(...segmentRows);
    const impactOpportunityIds = Array.isArray(segment.impactOpportunityIds)
      ? segment.impactOpportunityIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
    const affectedOpportunities = opportunities.flatMap(
      (opportunity, index) => {
        if (!opportunity.id || !impactOpportunityIds.includes(opportunity.id)) {
          return [];
        }
        const description = opportunity.description?.trim() ?? "";
        return [description.length > 0 ? description : `机会 ${index + 1}`];
      },
    );
    segments.push({
      key: segmentDef.key,
      label: segmentDef.label,
      captured: segmentRows.filter((row) => row.status === "CAPTURED").length,
      missed: segmentRows.filter((row) => row.status === "MISSED").length,
      pending: segmentRows.filter((row) => row.status === "PENDING").length,
      pnl: segmentRows.reduce((sum, row) => sum + (row.pnl ?? 0), 0),
      expectedType: isMnqMarketType(segment.expectedType)
        ? segment.expectedType
        : null,
      expectedDirection: isMnqMarketDirection(segment.expectedDirection)
        ? segment.expectedDirection
        : null,
      expectedNote: segment.expectedNote?.trim() ?? "",
      actualType: isMnqMarketType(segment.actualType)
        ? segment.actualType
        : isMnqMarketType(segment.type)
          ? segment.type
          : null,
      actualDirection: isMnqMarketDirection(segment.actualDirection)
        ? segment.actualDirection
        : null,
      actualNote: segment.actualNote?.trim().length
        ? segment.actualNote.trim()
        : (segment.note?.trim() ?? ""),
      accuracy: isMnqMarketAccuracy(segment.accuracy) ? segment.accuracy : null,
      deviationReason: isMnqMarketDeviationReason(segment.deviationReason)
        ? segment.deviationReason
        : null,
      secondaryDeviationReasons: Array.isArray(
        segment.secondaryDeviationReasons,
      )
        ? segment.secondaryDeviationReasons.filter(isMnqMarketDeviationReason)
        : [],
      deviationNote: segment.deviationNote?.trim() ?? "",
      opportunityImpact: isMnqMarketOpportunityImpact(segment.opportunityImpact)
        ? segment.opportunityImpact
        : null,
      impactTypes: Array.isArray(segment.impactTypes)
        ? segment.impactTypes.filter(isMnqMarketImpactType)
        : [],
      affectedOpportunities,
      impactNote: segment.impactNote?.trim() ?? "",
      premarketPhases:
        segmentDef.key === "marketPreJson"
          ? summarizePremarketPhases(segment)
          : [],
    });
  }

  const capturedRows = rows.filter((row) => row.status === "CAPTURED");
  const missedRows = rows.filter((row) => row.status === "MISSED");
  const completedCount = capturedRows.length + missedRows.length;
  const settledRows = capturedRows.filter((row) => row.pnl !== null);
  const wins = settledRows.filter((row) => (row.pnl ?? 0) > 0).length;
  const losses = settledRows.filter((row) => (row.pnl ?? 0) < 0).length;
  const missedEvaluatedRows = missedRows.filter(
    (row) => row.hypotheticalR !== null,
  );
  const actualPnL = settledRows.reduce((sum, row) => sum + (row.pnl ?? 0), 0);
  const missedPotentialR = missedEvaluatedRows.reduce(
    (sum, row) => sum + (row.hypotheticalR ?? 0),
    0,
  );
  const captureRate =
    completedCount > 0 ? (capturedRows.length / completedCount) * 100 : null;
  const decidedResults = wins + losses;
  const winRate = decidedResults > 0 ? (wins / decidedResults) * 100 : null;
  const coreSegments = segments.filter(
    (segment) =>
      segment.key === "marketOpenJson" || segment.key === "marketMidJson",
  );
  const segmentAccuracyRate = marketAccuracyRate(
    coreSegments.map((segment) => segment.accuracy),
  );
  const segmentAccuracyCounts = {
    correct: coreSegments.filter((segment) => segment.accuracy === "CORRECT")
      .length,
    partial: coreSegments.filter((segment) => segment.accuracy === "PARTIAL")
      .length,
    wrong: coreSegments.filter((segment) => segment.accuracy === "WRONG")
      .length,
  };
  const entryAccuracyRate = accuracyRate(
    capturedRows.map((row) => row.entryAccuracy),
  );
  const exitAccuracyRate = accuracyRate(
    capturedRows.map((row) => row.exitAccuracy),
  );
  const insights: string[] = [];
  const strategies = buildStrategySummaries(rows);
  const missedReasons = buildMissedReasonSummaries(rows);
  const profitAnalysis = buildDailyProfitAnalysis(rows);
  const missedProfitAnalysis = buildDailyMissedProfitAnalysis(rows);
  const marketDayAnalysis = buildMnqMarketDayAnalysis(segments);
  const strategyInsights: string[] = [];

  if (completedCount > 0 && captureRate !== null) {
    insights.push(
      `今日确认 ${completedCount} 个机会，把握 ${capturedRows.length} 个，机会把握率 ${captureRate.toFixed(0)}%。`,
    );
  }
  if (settledRows.length > 0) {
    insights.push(
      `已填写完整价格的 ${settledRows.length} 笔成交合计 ${actualPnL >= 0 ? "+" : "-"}$${Math.abs(actualPnL).toFixed(2)}。`,
    );
  }
  if (missedEvaluatedRows.length > 0) {
    const mostMissedSegment = segments
      .filter((segment) => segment.missed > 0)
      .sort((a, b) => b.missed - a.missed)[0];
    insights.push(
      `${missedEvaluatedRows.length} 个错失机会已完成风险回报评估，假设回报合计 ${missedPotentialR.toFixed(2)}R${mostMissedSegment ? `；错失最多出现在${mostMissedSegment.label}时段` : ""}。`,
    );
  }
  const coreJudgmentDeviations = coreSegments.filter(
    (segment) => segment.accuracy === "PARTIAL" || segment.accuracy === "WRONG",
  );
  if (coreJudgmentDeviations.length > 0) {
    const primaryReasons = coreJudgmentDeviations
      .map((segment) =>
        segment.deviationReason
          ? MNQ_MARKET_DEVIATION_REASON_LABELS[segment.deviationReason]
          : null,
      )
      .filter((reason): reason is string => reason !== null);
    insights.push(
      `开盘/盘中有 ${coreJudgmentDeviations.length} 个行情判断存在偏差${primaryReasons.length > 0 ? `，主要涉及${Array.from(new Set(primaryReasons)).join("、")}` : "，建议补充偏差原因"}。`,
    );
  }
  const negativeMarketImpacts = coreSegments.filter(
    (segment) => segment.opportunityImpact === "NEGATIVE",
  );
  if (negativeMarketImpacts.length > 0) {
    const impactLabels = negativeMarketImpacts.flatMap((segment) =>
      segment.impactTypes.map((type) => MNQ_MARKET_IMPACT_TYPE_LABELS[type]),
    );
    insights.push(
      `行情判断对 ${negativeMarketImpacts.length} 个核心时段的交易机会产生负面影响${impactLabels.length > 0 ? `，涉及${Array.from(new Set(impactLabels)).join("、")}` : ""}。`,
    );
  }
  if (entryAccuracyRate !== null || exitAccuracyRate !== null) {
    const parts = [
      entryAccuracyRate === null
        ? null
        : `进入准确率 ${entryAccuracyRate.toFixed(0)}%`,
      exitAccuracyRate === null
        ? null
        : `退出准确率 ${exitAccuracyRate.toFixed(0)}%`,
    ].filter((part): part is string => part !== null);
    insights.push(`${parts.join("，")}。`);
  }
  if (rows.length > completedCount) {
    insights.push(
      `另有 ${rows.length - completedCount} 个机会尚未标记结果，完成后分析会自动更新。`,
    );
  }

  if (strategies.length > 0) {
    const mostUsed = strategies[0];
    if (mostUsed && strategies.length > 1) {
      strategyInsights.push(
        `${mostUsed.name} 出现 ${mostUsed.totalCount} 次，占今日全部机会的 ${((mostUsed.totalCount / rows.length) * 100).toFixed(0)}%，是今日主要策略。`,
      );
    }
    const largestMissed = [...strategies]
      .filter((strategy) => strategy.missedPotentialR > 0)
      .sort((a, b) => b.missedPotentialR - a.missedPotentialR)[0];
    if (largestMissed) {
      strategyInsights.push(
        `${largestMissed.name} 的错失机会合计 ${largestMissed.missedPotentialR.toFixed(2)}R，是今日最大的策略执行缺口。`,
      );
    }
    const bestRealized = [...strategies]
      .filter((strategy) => strategy.settledCount > 0)
      .sort((a, b) => b.actualPnL - a.actualPnL)[0];
    if (bestRealized) {
      strategyInsights.push(
        `${bestRealized.name} 已实现 ${bestRealized.actualPnL >= 0 ? "+" : "-"}$${Math.abs(bestRealized.actualPnL).toFixed(2)}；这是当日结果，不代表长期策略排名。`,
      );
    }
  }

  return {
    rows,
    segments,
    strategies,
    missedReasons,
    profitAnalysis,
    missedProfitAnalysis,
    marketDayAnalysis,
    totalCount: rows.length,
    completedCount,
    capturedCount: capturedRows.length,
    missedCount: missedRows.length,
    pendingCount: rows.length - completedCount,
    captureRate,
    actualPnL,
    settledCount: settledRows.length,
    wins,
    losses,
    winRate,
    missedPotentialR,
    missedEvaluatedCount: missedEvaluatedRows.length,
    segmentAccuracyRate,
    segmentAccuracyCounts,
    entryAccuracyRate,
    exitAccuracyRate,
    insights,
    strategyInsights,
  };
}
