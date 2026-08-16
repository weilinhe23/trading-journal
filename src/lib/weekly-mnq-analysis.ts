import {
  analyzeDailyOpportunities,
  type MnqPlanOpportunitySource,
} from "~/lib/daily-opportunity-analysis";
import {
  MNQ_MARKET_DEVIATION_REASON_LABELS,
  MNQ_MARKET_IMPACT_TYPE_LABELS,
  MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS,
  MNQ_MISSED_REASON_LABELS,
  type MnqDecisionTimeframe,
} from "~/types";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export interface WeeklyMnqSession {
  date: Date;
  lessonsLearned: string | null;
  whatWentWell: string | null;
  planFollowed: number | null;
  emotionRating: number | null;
  focusRating: number | null;
  mnqPlan: (MnqPlanOpportunitySource & { scenario?: string | null }) | null;
}

export interface WeeklyMnqDayRecord {
  date: string;
  dayLabel: string;
  regime: "TREND" | "CHOP" | null;
  pnl: number;
  realizedR: number;
  tradeCount: number;
  missedCount: number;
  pendingCount: number;
  whatWentWell: string | null;
  lessonsLearned: string | null;
  planFollowed: number | null;
  emotionRating: number | null;
  focusRating: number | null;
}

export interface WeeklyMnqTradeRecord {
  id: string;
  day: string;
  time: string;
  symbol: "MNQ";
  direction: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  executionGrade: null;
  strategy: string | null;
  notes: string | null;
  stopPrice: number | null;
  targetPrice: number | null;
  tradeResult: string | null;
  tradeResultNote: string | null;
  plannedRiskPts: number | null;
  maxDrawdownPts: number | null;
  maxFavorablePts: number | null;
  heldOvernight: boolean;
  overnightReason: string | null;
  tradeTypeName: string | null;
  entryApproach: "DIRECT" | "PULLBACK" | null;
  decisionTimeframe: MnqDecisionTimeframe | null;
  entryAccuracy: "CORRECT" | "WRONG" | null;
  entryAccuracyNote: string | null;
  exitAccuracy: "CORRECT" | "WRONG" | null;
  exitAccuracyNote: string | null;
  segment: string;
}

export interface WeeklyMnqMissedRecord {
  id: string;
  day: string;
  segment: string;
  description: string;
  missedProcess: string;
  reason: string;
  riskPts: number | null;
  returnPts: number | null;
  hypotheticalR: number | null;
  tradeDirection: "LONG" | "SHORT" | null;
  strategyName: string | null;
  tradeTypeName: string | null;
  entryApproach: "DIRECT" | "PULLBACK" | null;
  decisionTimeframe: MnqDecisionTimeframe | null;
}

export interface WeeklyMnqTimeframeStat {
  timeframe: MnqDecisionTimeframe | null;
  captured: number;
  missed: number;
  pnl: number;
}

export interface WeeklyMnqSegmentAccuracyRecord {
  segment: string;
  totalDays: number;
  correctDays: number;
  partialDays: number;
  wrongDays: number;
}

export interface WeeklyMnqCountSummary {
  label: string;
  count: number;
}

export interface WeeklyMnqMissedReasonSummary extends WeeklyMnqCountSummary {
  hypotheticalR: number;
}

export interface WeeklyMnqCompleteness {
  recordedDays: number;
  availableDays: number;
  decidedOpportunities: number;
  totalOpportunities: number;
  settledTrades: number;
  capturedTrades: number;
  realizedRTrades: number;
  missedREvaluated: number;
  missedTrades: number;
  evaluatedMarketSegments: number;
  recordedMarketSegments: number;
  score: number | null;
}

export interface WeeklyMnqStats {
  totalPnL: number;
  executedCount: number;
  settledCount: number;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  missedCount: number;
  pendingCount: number;
  totalOpportunities: number;
  captureRate: number | null;
  winRate: number | null;
  totalRealizedR: number;
  realizedRCount: number;
  averageRealizedR: number | null;
  missedPotentialR: number;
  missedEvaluatedCount: number;
}

export interface WeeklyMnqAnalysis {
  stats: WeeklyMnqStats;
  completeness: WeeklyMnqCompleteness;
  days: WeeklyMnqDayRecord[];
  trades: WeeklyMnqTradeRecord[];
  missed: WeeklyMnqMissedRecord[];
  timeframeStats: WeeklyMnqTimeframeStat[];
  segmentAccuracy: WeeklyMnqSegmentAccuracyRecord[];
  deviationReasons: WeeklyMnqCountSummary[];
  opportunityImpacts: WeeklyMnqCountSummary[];
  impactTypes: WeeklyMnqCountSummary[];
  missedReasons: WeeklyMnqMissedReasonSummary[];
  equity: number[];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentage(numerator: number, denominator: number): number | null {
  return denominator > 0 ? (numerator / denominator) * 100 : null;
}

function regimeFromScenario(scenario: string | null | undefined) {
  if (scenario?.startsWith("TREND")) return "TREND" as const;
  if (scenario === "RANGE_SWEEP") return "CHOP" as const;
  return null;
}

function increment(map: Map<string, number>, label: string) {
  map.set(label, (map.get(label) ?? 0) + 1);
}

function toCountSummaries(map: Map<string, number>): WeeklyMnqCountSummary[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function aggregateWeeklyMnq(
  sessions: WeeklyMnqSession[],
): WeeklyMnqAnalysis {
  const tradingSessions = sessions.filter((session) => {
    const day = session.date.getUTCDay();
    return day >= 1 && day <= 5;
  });
  const days: WeeklyMnqDayRecord[] = [];
  const trades: WeeklyMnqTradeRecord[] = [];
  const missed: WeeklyMnqMissedRecord[] = [];
  const timeframeMap = new Map<
    MnqDecisionTimeframe | null,
    WeeklyMnqTimeframeStat
  >();
  const segmentMap = new Map<string, WeeklyMnqSegmentAccuracyRecord>();
  const deviationMap = new Map<string, number>();
  const opportunityImpactMap = new Map<string, number>();
  const impactTypeMap = new Map<string, number>();
  const missedReasonMap = new Map<string, WeeklyMnqMissedReasonSummary>();

  let totalPnL = 0;
  let capturedCount = 0;
  let settledCount = 0;
  let winCount = 0;
  let lossCount = 0;
  let missedCount = 0;
  let pendingCount = 0;
  let totalCount = 0;
  let totalRealizedR = 0;
  let realizedRCount = 0;
  let missedPotentialR = 0;
  let missedEvaluatedCount = 0;
  let recordedDays = 0;
  let recordedMarketSegments = 0;
  let evaluatedMarketSegments = 0;
  let tradeIndex = 1;
  let missedIndex = 1;

  for (const session of [...tradingSessions].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  )) {
    const analysis = analyzeDailyOpportunities(session.mnqPlan);
    const dayLabel = DAY_LABELS[session.date.getUTCDay()] ?? "MON";
    const date = session.date.toISOString().split("T")[0]!;
    const dayRealizedR = analysis.rows.reduce(
      (sum, row) => sum + (row.realizedR ?? 0),
      0,
    );

    const hasMarketData = analysis.segments.some(
      (segment) =>
        segment.expectedType !== null ||
        segment.actualType !== null ||
        segment.accuracy !== null ||
        segment.expectedNote.length > 0 ||
        segment.actualNote.length > 0,
    );
    if (analysis.totalCount > 0 || hasMarketData) recordedDays++;

    days.push({
      date,
      dayLabel,
      regime: regimeFromScenario(session.mnqPlan?.scenario),
      pnl: round(analysis.actualPnL),
      realizedR: round(dayRealizedR),
      tradeCount: analysis.capturedCount,
      missedCount: analysis.missedCount,
      pendingCount: analysis.pendingCount,
      whatWentWell: session.whatWentWell,
      lessonsLearned: session.lessonsLearned,
      planFollowed: session.planFollowed,
      emotionRating: session.emotionRating,
      focusRating: session.focusRating,
    });

    totalPnL += analysis.actualPnL;
    capturedCount += analysis.capturedCount;
    settledCount += analysis.settledCount;
    winCount += analysis.wins;
    lossCount += analysis.losses;
    missedCount += analysis.missedCount;
    pendingCount += analysis.pendingCount;
    totalCount += analysis.totalCount;
    totalRealizedR += analysis.profitAnalysis.totalRealizedR;
    realizedRCount += analysis.profitAnalysis.evaluatedCount;
    missedPotentialR += analysis.missedPotentialR;
    missedEvaluatedCount += analysis.missedEvaluatedCount;

    for (const row of analysis.rows) {
      const timeframe = timeframeMap.get(row.decisionTimeframe) ?? {
        timeframe: row.decisionTimeframe,
        captured: 0,
        missed: 0,
        pnl: 0,
      };
      if (row.status === "CAPTURED") {
        timeframe.captured++;
        timeframe.pnl += row.pnl ?? 0;
        if (row.direction !== null) {
          trades.push({
            id: `M${String(tradeIndex++).padStart(2, "0")}`,
            day: dayLabel,
            time: row.entryTime,
            symbol: "MNQ",
            direction: row.direction,
            entryPrice: row.entryPrice ?? 0,
            exitPrice: row.exitPrice,
            pnl: row.pnl === null ? null : round(row.pnl),
            executionGrade: null,
            strategy: row.strategy,
            notes: row.description,
            stopPrice: row.stopPrice,
            targetPrice: row.targetPrice,
            tradeResult: row.tradeResult,
            tradeResultNote: row.resultNote || null,
            plannedRiskPts: row.plannedRiskPts,
            maxDrawdownPts: row.maxDrawdownPts,
            maxFavorablePts: row.maxFavorablePts,
            heldOvernight: row.heldOvernight,
            overnightReason: row.overnightReason || null,
            tradeTypeName: row.tradeType,
            entryApproach: row.entryApproach,
            decisionTimeframe: row.decisionTimeframe,
            entryAccuracy: row.entryAccuracy,
            entryAccuracyNote: row.entryAccuracyNote || null,
            exitAccuracy: row.exitAccuracy,
            exitAccuracyNote: row.exitAccuracyNote || null,
            segment: row.segment,
          });
        }
      } else if (row.status === "MISSED") {
        timeframe.missed++;
        const reason = row.missedReasonCategory
          ? MNQ_MISSED_REASON_LABELS[row.missedReasonCategory]
          : "未分类";
        missed.push({
          id: `X${String(missedIndex++).padStart(2, "0")}`,
          day: dayLabel,
          segment: row.segment,
          description: row.description,
          missedProcess: row.missedProcess,
          reason,
          riskPts: row.missedRiskPts,
          returnPts: row.missedReturnPts,
          hypotheticalR: row.hypotheticalR,
          tradeDirection: row.direction,
          strategyName: row.strategy,
          tradeTypeName: row.tradeType,
          entryApproach: row.entryApproach,
          decisionTimeframe: row.decisionTimeframe,
        });
        const reasonSummary = missedReasonMap.get(reason) ?? {
          label: reason,
          count: 0,
          hypotheticalR: 0,
        };
        reasonSummary.count++;
        reasonSummary.hypotheticalR += row.hypotheticalR ?? 0;
        missedReasonMap.set(reason, reasonSummary);
      }
      timeframeMap.set(row.decisionTimeframe, timeframe);
    }

    for (const segment of analysis.segments) {
      const segmentLabel = `MNQ${segment.label}`;
      const summary = segmentMap.get(segmentLabel) ?? {
        segment: segmentLabel,
        totalDays: 0,
        correctDays: 0,
        partialDays: 0,
        wrongDays: 0,
      };
      const isRecorded =
        segment.expectedType !== null ||
        segment.actualType !== null ||
        segment.expectedNote.length > 0 ||
        segment.actualNote.length > 0 ||
        segment.accuracy !== null;
      if (isRecorded) recordedMarketSegments++;
      if (segment.accuracy !== null) {
        evaluatedMarketSegments++;
        summary.totalDays++;
        if (segment.accuracy === "CORRECT") summary.correctDays++;
        if (segment.accuracy === "PARTIAL") summary.partialDays++;
        if (segment.accuracy === "WRONG") summary.wrongDays++;
      }
      segmentMap.set(segmentLabel, summary);

      const deviationReasons = new Set([
        ...(segment.deviationReason ? [segment.deviationReason] : []),
        ...segment.secondaryDeviationReasons,
      ]);
      for (const reason of deviationReasons) {
        increment(deviationMap, MNQ_MARKET_DEVIATION_REASON_LABELS[reason]);
      }
      if (segment.opportunityImpact !== null) {
        increment(
          opportunityImpactMap,
          MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS[segment.opportunityImpact],
        );
      }
      for (const impactType of new Set(segment.impactTypes)) {
        increment(impactTypeMap, MNQ_MARKET_IMPACT_TYPE_LABELS[impactType]);
      }
    }
  }

  const displayDays = (() => {
    const firstSession = tradingSessions[0];
    if (!firstSession) return days;
    const monday = new Date(firstSession.date);
    const day = monday.getUTCDay();
    monday.setUTCDate(monday.getUTCDate() + (day === 0 ? -6 : 1 - day));
    monday.setUTCHours(0, 0, 0, 0);
    const daysByDate = new Map(days.map((item) => [item.date, item]));
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(monday);
      date.setUTCDate(date.getUTCDate() + index);
      const dateValue = date.toISOString().split("T")[0]!;
      return (
        daysByDate.get(dateValue) ?? {
          date: dateValue,
          dayLabel: DAY_LABELS[date.getUTCDay()] ?? "MON",
          regime: null,
          pnl: 0,
          realizedR: 0,
          tradeCount: 0,
          missedCount: 0,
          pendingCount: 0,
          whatWentWell: null,
          lessonsLearned: null,
          planFollowed: null,
          emotionRating: null,
          focusRating: null,
        }
      );
    });
  })();

  const decidedOpportunities = capturedCount + missedCount;
  const completenessParts = [
    percentage(decidedOpportunities, totalCount),
    percentage(realizedRCount, capturedCount),
    percentage(missedEvaluatedCount, missedCount),
    percentage(evaluatedMarketSegments, recordedMarketSegments),
  ].filter((value): value is number => value !== null);
  const completenessScore =
    completenessParts.length > 0
      ? Math.round(
          completenessParts.reduce((sum, value) => sum + value, 0) /
            completenessParts.length,
        )
      : null;

  const equity = [0];
  let cumulativePnl = 0;
  for (const day of displayDays) {
    cumulativePnl += day.pnl;
    equity.push(round(cumulativePnl));
  }

  return {
    stats: {
      totalPnL: round(totalPnL),
      executedCount: capturedCount,
      settledCount,
      winCount,
      lossCount,
      breakevenCount: settledCount - winCount - lossCount,
      missedCount,
      pendingCount,
      totalOpportunities: totalCount,
      captureRate: percentage(capturedCount, decidedOpportunities),
      winRate: percentage(winCount, winCount + lossCount),
      totalRealizedR: round(totalRealizedR),
      realizedRCount,
      averageRealizedR:
        realizedRCount > 0 ? round(totalRealizedR / realizedRCount) : null,
      missedPotentialR: round(missedPotentialR),
      missedEvaluatedCount,
    },
    completeness: {
      recordedDays,
      availableDays: displayDays.length,
      decidedOpportunities,
      totalOpportunities: totalCount,
      settledTrades: settledCount,
      capturedTrades: capturedCount,
      realizedRTrades: realizedRCount,
      missedREvaluated: missedEvaluatedCount,
      missedTrades: missedCount,
      evaluatedMarketSegments,
      recordedMarketSegments,
      score: completenessScore,
    },
    days: displayDays,
    trades,
    missed,
    timeframeStats: [...timeframeMap.values()].map((item) => ({
      ...item,
      pnl: round(item.pnl),
    })),
    segmentAccuracy: [...segmentMap.values()],
    deviationReasons: toCountSummaries(deviationMap),
    opportunityImpacts: toCountSummaries(opportunityImpactMap),
    impactTypes: toCountSummaries(impactTypeMap),
    missedReasons: [...missedReasonMap.values()]
      .map((item) => ({ ...item, hypotheticalR: round(item.hypotheticalR) }))
      .sort((a, b) => b.count - a.count || b.hypotheticalR - a.hypotheticalR),
    equity,
  };
}
