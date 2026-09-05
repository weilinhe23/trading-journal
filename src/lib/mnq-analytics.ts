import {
  analyzeDailyOpportunities,
  type MnqOpportunityRow,
  type MnqPlanOpportunitySource,
} from "~/lib/daily-opportunity-analysis";
import { MNQ_MISSED_REASON_LABELS } from "~/types";

export interface DatedMnqOpportunity extends MnqOpportunityRow {
  date: string;
  opportunityId: string;
}

export interface MnqAnalyticsSource {
  sessionDate: Date;
  marketPreJson: string | null;
  marketOpenJson: string | null;
  marketMidJson: string | null;
  marketAfternoonJson: string | null;
}

export interface MnqAnalyticsSummary {
  totalPnL: number;
  winRate: number | null;
  avgPnL: number | null;
  totalOpportunities: number;
  capturedCount: number;
  missedCount: number;
  pendingCount: number;
  settledCount: number;
  winsCount: number;
  lossesCount: number;
  breakevenCount: number;
  dailyPnL: Array<{ date: string; pnl: number; cumPnL: number }>;
}

export interface MnqMissedBreakdown {
  reason: string;
  label: string;
  count: number;
  share: number;
  hypotheticalR: number;
  evaluatedCount: number;
}

export interface MnqMissedAnalytics {
  rows: DatedMnqOpportunity[];
  totalMissed: number;
  categorizedCount: number;
  evaluatedCount: number;
  totalHypotheticalR: number;
  breakdown: MnqMissedBreakdown[];
}

export interface MnqExecutionQualityAnalytics {
  totalCaptured: number;
  entryEvaluatedCount: number;
  entryCorrectCount: number;
  entryAccuracyRate: number | null;
  exitEvaluatedCount: number;
  exitCorrectCount: number;
  exitAccuracyRate: number | null;
  avgPnLEntryCorrect: number | null;
  avgPnLEntryWrong: number | null;
  avgPnLExitCorrect: number | null;
  avgPnLExitWrong: number | null;
}

export interface MnqStrategyAnalytics {
  name: string;
  tradeTypes: string[];
  total: number;
  captured: number;
  missed: number;
  pending: number;
  settled: number;
  wins: number;
  losses: number;
  winRate: number | null;
  captureRate: number | null;
  missRate: number;
  totalPnL: number;
  avgPnL: number | null;
  missedPotentialR: number;
  missedEvaluatedCount: number;
}

export interface MnqAnalyticsSnapshot {
  rows: DatedMnqOpportunity[];
  summary: MnqAnalyticsSummary;
  missed: MnqMissedAnalytics;
  executionQuality: MnqExecutionQualityAnalytics;
  strategies: MnqStrategyAnalytics[];
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function dateKey(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

export function missedReasonLabel(reason: string): string {
  if (reason === "UNCLASSIFIED") return "未分类";
  return (
    MNQ_MISSED_REASON_LABELS[reason as keyof typeof MNQ_MISSED_REASON_LABELS] ??
    reason
  );
}

export function buildMnqOpportunityRows(
  sources: MnqAnalyticsSource[],
): DatedMnqOpportunity[] {
  return sources
    .flatMap((source) => {
      const date = dateKey(source.sessionDate);
      const analysis = analyzeDailyOpportunities(
        source satisfies MnqPlanOpportunitySource,
      );

      return analysis.rows.map((row) => ({
        ...row,
        id: `${date}:${row.id}`,
        date,
        opportunityId: row.id.slice(row.id.indexOf(":") + 1),
      }));
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export function buildMnqSummary(
  rows: DatedMnqOpportunity[],
): MnqAnalyticsSummary {
  const captured = rows.filter((row) => row.status === "CAPTURED");
  const settled = captured.filter(
    (row): row is DatedMnqOpportunity & { pnl: number } => row.pnl !== null,
  );
  const wins = settled.filter((row) => row.pnl > 0);
  const losses = settled.filter((row) => row.pnl < 0);
  const breakeven = settled.filter((row) => row.pnl === 0);
  const decidedCount = wins.length + losses.length;

  const dailyMap = new Map<string, number>();
  for (const row of settled) {
    dailyMap.set(row.date, (dailyMap.get(row.date) ?? 0) + row.pnl);
  }

  let cumulative = 0;
  const dailyPnL = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => {
      const pnl = round(value);
      cumulative += pnl;
      return { date, pnl, cumPnL: round(cumulative) };
    });
  const totalPnL = round(settled.reduce((sum, row) => sum + row.pnl, 0));

  return {
    totalPnL,
    winRate:
      decidedCount > 0 ? round((wins.length / decidedCount) * 100) : null,
    avgPnL: settled.length > 0 ? round(totalPnL / settled.length) : null,
    totalOpportunities: rows.length,
    capturedCount: captured.length,
    missedCount: rows.filter((row) => row.status === "MISSED").length,
    pendingCount: rows.filter((row) => row.status === "PENDING").length,
    settledCount: settled.length,
    winsCount: wins.length,
    lossesCount: losses.length,
    breakevenCount: breakeven.length,
    dailyPnL,
  };
}

export function buildMnqMissedAnalytics(
  rows: DatedMnqOpportunity[],
): MnqMissedAnalytics {
  const missed = rows
    .filter((row) => row.status === "MISSED")
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const groups = new Map<
    string,
    { count: number; hypotheticalR: number; evaluatedCount: number }
  >();

  for (const row of missed) {
    const reason = row.missedReasonCategory ?? "UNCLASSIFIED";
    const current = groups.get(reason) ?? {
      count: 0,
      hypotheticalR: 0,
      evaluatedCount: 0,
    };
    current.count += 1;
    if (row.hypotheticalR !== null) {
      current.hypotheticalR += row.hypotheticalR;
      current.evaluatedCount += 1;
    }
    groups.set(reason, current);
  }

  const breakdown = Array.from(groups.entries())
    .map<MnqMissedBreakdown>(
      ([reason, { count, hypotheticalR, evaluatedCount }]) => ({
        reason,
        label: missedReasonLabel(reason),
        count,
        share: missed.length > 0 ? round((count / missed.length) * 100) : 0,
        hypotheticalR: round(hypotheticalR),
        evaluatedCount,
      }),
    )
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const evaluated = missed.filter((row) => row.hypotheticalR !== null);

  return {
    rows: missed,
    totalMissed: missed.length,
    categorizedCount: missed.filter((row) => row.missedReasonCategory !== null)
      .length,
    evaluatedCount: evaluated.length,
    totalHypotheticalR: round(
      evaluated.reduce((sum, row) => sum + (row.hypotheticalR ?? 0), 0),
    ),
    breakdown,
  };
}

export function buildMnqExecutionQuality(
  rows: DatedMnqOpportunity[],
): MnqExecutionQualityAnalytics {
  const captured = rows.filter((row) => row.status === "CAPTURED");
  const entryEvaluated = captured.filter((row) => row.entryAccuracy !== null);
  const exitEvaluated = captured.filter((row) => row.exitAccuracy !== null);
  const entryCorrect = entryEvaluated.filter(
    (row) => row.entryAccuracy === "CORRECT",
  );
  const exitCorrect = exitEvaluated.filter(
    (row) => row.exitAccuracy === "CORRECT",
  );
  const pnlFor = (values: DatedMnqOpportunity[]): number[] =>
    values.flatMap((row) => (row.pnl === null ? [] : [row.pnl]));

  return {
    totalCaptured: captured.length,
    entryEvaluatedCount: entryEvaluated.length,
    entryCorrectCount: entryCorrect.length,
    entryAccuracyRate:
      entryEvaluated.length > 0
        ? round((entryCorrect.length / entryEvaluated.length) * 100)
        : null,
    exitEvaluatedCount: exitEvaluated.length,
    exitCorrectCount: exitCorrect.length,
    exitAccuracyRate:
      exitEvaluated.length > 0
        ? round((exitCorrect.length / exitEvaluated.length) * 100)
        : null,
    avgPnLEntryCorrect: average(pnlFor(entryCorrect)),
    avgPnLEntryWrong: average(
      pnlFor(entryEvaluated.filter((row) => row.entryAccuracy === "WRONG")),
    ),
    avgPnLExitCorrect: average(pnlFor(exitCorrect)),
    avgPnLExitWrong: average(
      pnlFor(exitEvaluated.filter((row) => row.exitAccuracy === "WRONG")),
    ),
  };
}

export function buildMnqStrategyAnalytics(
  rows: DatedMnqOpportunity[],
): MnqStrategyAnalytics[] {
  const grouped = new Map<string, DatedMnqOpportunity[]>();
  for (const row of rows) {
    const strategyName = row.strategy?.trim();
    const name = strategyName?.length ? strategyName : "未分类";
    const current = grouped.get(name) ?? [];
    current.push(row);
    grouped.set(name, current);
  }

  return Array.from(grouped.entries())
    .map<MnqStrategyAnalytics>(([name, strategyRows]) => {
      const captured = strategyRows.filter((row) => row.status === "CAPTURED");
      const missed = strategyRows.filter((row) => row.status === "MISSED");
      const settled = captured.filter(
        (row): row is DatedMnqOpportunity & { pnl: number } => row.pnl !== null,
      );
      const wins = settled.filter((row) => row.pnl > 0);
      const losses = settled.filter((row) => row.pnl < 0);
      const decidedCount = wins.length + losses.length;
      const completedCount = captured.length + missed.length;
      const totalPnL = round(settled.reduce((sum, row) => sum + row.pnl, 0));
      const missedEvaluated = missed.filter(
        (row) => row.hypotheticalR !== null,
      );

      return {
        name,
        tradeTypes: Array.from(
          new Set(
            strategyRows.flatMap((row) =>
              row.tradeType?.trim() ? [row.tradeType.trim()] : [],
            ),
          ),
        ).sort(),
        total: strategyRows.length,
        captured: captured.length,
        missed: missed.length,
        pending: strategyRows.filter((row) => row.status === "PENDING").length,
        settled: settled.length,
        wins: wins.length,
        losses: losses.length,
        winRate:
          decidedCount > 0 ? round((wins.length / decidedCount) * 100) : null,
        captureRate:
          completedCount > 0
            ? round((captured.length / completedCount) * 100)
            : null,
        missRate:
          strategyRows.length > 0
            ? round((missed.length / strategyRows.length) * 100)
            : 0,
        totalPnL,
        avgPnL: settled.length > 0 ? round(totalPnL / settled.length) : null,
        missedPotentialR: round(
          missedEvaluated.reduce(
            (sum, row) => sum + (row.hypotheticalR ?? 0),
            0,
          ),
        ),
        missedEvaluatedCount: missedEvaluated.length,
      };
    })
    .sort(
      (a, b) =>
        b.totalPnL - a.totalPnL ||
        b.total - a.total ||
        a.name.localeCompare(b.name),
    );
}

export function buildMnqAnalyticsSnapshot(
  sources: MnqAnalyticsSource[],
): MnqAnalyticsSnapshot {
  const rows = buildMnqOpportunityRows(sources);
  return {
    rows,
    summary: buildMnqSummary(rows),
    missed: buildMnqMissedAnalytics(rows),
    executionQuality: buildMnqExecutionQuality(rows),
    strategies: buildMnqStrategyAnalytics(rows),
  };
}
