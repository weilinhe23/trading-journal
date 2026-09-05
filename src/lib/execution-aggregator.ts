import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export interface TradeRow {
  id: string;
  date: string;
  weekStart: string;
  symbol: string;
  direction: "LONG" | "SHORT";
  strategy: string | null;
  tradeTypeName: string | null;
  description: string;
  segment: string | null;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  pnl: number | null;
  settled: boolean;
  entryAccuracy: "CORRECT" | "WRONG" | null;
  entryAccuracyNote: string;
  exitAccuracy: "CORRECT" | "WRONG" | null;
  exitAccuracyNote: string;
  opportunityId: string | null;
}

export interface ExecutionFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  symbol?: string | null;
  strategy?: string | null;
  tradeType?: string | null;
  direction?: string | null;
  result?: string | null;
}

export async function fetchExecutionRows(
  filters: ExecutionFilters = {},
): Promise<TradeRow[]> {
  const { rows: opportunities } = await getMnqAnalyticsSnapshot();

  const rows = opportunities
    .filter((row) => row.status === "CAPTURED" && row.direction !== null)
    .map<TradeRow>((row) => ({
      id: row.id,
      date: row.date,
      weekStart: getMondayOf(new Date(`${row.date}T00:00:00.000Z`))
        .toISOString()
        .split("T")[0]!,
      symbol: "MNQ",
      direction: row.direction!,
      strategy: normalizeCategory(row.strategy),
      tradeTypeName: normalizeCategory(row.tradeType),
      description: row.description,
      segment: row.segment,
      entryPrice: row.entryPrice ?? 0,
      exitPrice: row.exitPrice,
      quantity: row.contracts ?? 1,
      pnl: row.pnl,
      settled: row.pnl !== null,
      entryAccuracy: row.entryAccuracy,
      entryAccuracyNote: row.entryAccuracyNote,
      exitAccuracy: row.exitAccuracy,
      exitAccuracyNote: row.exitAccuracyNote,
      opportunityId: row.opportunityId,
    }));

  return filterExecutionRows(rows, filters);
}

function normalizeCategory(value: string | null): string | null {
  const name = value?.trim();
  return name?.length ? name : null;
}

function categoryName(value: string | null): string {
  return normalizeCategory(value) ?? "未分类";
}

export function filterExecutionRows(
  rows: TradeRow[],
  filters: ExecutionFilters = {},
): TradeRow[] {
  const symbol = filters.symbol?.trim().toUpperCase();
  const strategy = filters.strategy?.trim().toLowerCase();
  const tradeType = filters.tradeType?.trim().toLowerCase();

  return rows.filter(
    (row) =>
      (!filters.dateFrom || row.date >= filters.dateFrom) &&
      (!filters.dateTo || row.date <= filters.dateTo) &&
      (!symbol || row.symbol.includes(symbol)) &&
      (!filters.direction || row.direction === filters.direction) &&
      (!strategy || categoryName(row.strategy).toLowerCase() === strategy) &&
      (!tradeType ||
        categoryName(row.tradeTypeName).toLowerCase() === tradeType) &&
      (filters.result !== "WIN" || (row.pnl !== null && row.pnl > 0)) &&
      (filters.result !== "LOSS" || (row.pnl !== null && row.pnl < 0)) &&
      (filters.result !== "BREAKEVEN" || row.pnl === 0),
  );
}

export interface ExecutionFilterOptions {
  strategies: Array<{ name: string; tradeTypes: string[] }>;
  tradeTypes: string[];
}

// Use recorded names so historical classifications remain available after library edits.
export function buildExecutionFilterOptions(
  rows: TradeRow[],
): ExecutionFilterOptions {
  const strategies = new Map<string, Set<string>>();
  const tradeTypes = new Set<string>();
  for (const row of rows) {
    const strategy = categoryName(row.strategy);
    const tradeType = categoryName(row.tradeTypeName);
    const types = strategies.get(strategy) ?? new Set<string>();
    types.add(tradeType);
    strategies.set(strategy, types);
    tradeTypes.add(tradeType);
  }
  const sorted = (values: Iterable<string>) =>
    Array.from(values).sort((a, b) => a.localeCompare(b, "zh-CN"));
  return {
    strategies: sorted(strategies.keys()).map((name) => ({
      name,
      tradeTypes: sorted(strategies.get(name)!),
    })),
    tradeTypes: sorted(tradeTypes),
  };
}

export function computeSummary(rows: TradeRow[]) {
  const settled = rows.filter((r) => r.pnl !== null);
  const wins = settled.filter((r) => (r.pnl ?? 0) > 0);
  const losses = settled.filter((r) => (r.pnl ?? 0) < 0);

  const totalPnL = settled.reduce((s, r) => s + (r.pnl ?? 0), 0);
  const decidedCount = wins.length + losses.length;
  const winRate = decidedCount > 0 ? (wins.length / decidedCount) * 100 : 0;
  const avgPnL = settled.length > 0 ? totalPnL / settled.length : 0;
  const maxWin = wins.length > 0 ? Math.max(...wins.map((r) => r.pnl ?? 0)) : 0;
  const maxLoss =
    losses.length > 0 ? Math.min(...losses.map((r) => r.pnl ?? 0)) : 0;
  const grossProfit = wins.reduce((s, row) => s + (row.pnl ?? 0), 0);
  const grossLoss = Math.abs(losses.reduce((s, row) => s + (row.pnl ?? 0), 0));

  const r = (n: number) => Math.round(n * 100) / 100;
  const r1 = (n: number) => Math.round(n * 10) / 10;

  return {
    totalCount: rows.length,
    settledCount: settled.length,
    totalPnL: r(totalPnL),
    winRate: r1(winRate),
    avgPnL: r(avgPnL),
    maxWin: r(maxWin),
    maxLoss: r(maxLoss),
    profitFactor: grossLoss > 0 ? r1(grossProfit / grossLoss) : null,
    winsCount: wins.length,
    lossesCount: losses.length,
  };
}

export function computeCharts(rows: TradeRow[]) {
  const settled = rows.filter((r) => r.pnl !== null);
  const r = (n: number) => Math.round(n * 100) / 100;
  const r1 = (n: number) => Math.round(n * 10) / 10;

  // Cumulative by date
  const dailyMap = new Map<string, number>();
  for (const row of settled) {
    dailyMap.set(row.date, (dailyMap.get(row.date) ?? 0) + (row.pnl ?? 0));
  }
  let running = 0;
  const cumulative = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => {
      running += pnl;
      return { date, pnl: r(pnl), cumPnL: r(running) };
    });

  // By strategy
  const stratMap = new Map<
    string,
    { pnl: number; count: number; wins: number }
  >();
  for (const row of settled) {
    const key = row.strategy ?? "未分类";
    const cur = stratMap.get(key) ?? { pnl: 0, count: 0, wins: 0 };
    stratMap.set(key, {
      pnl: cur.pnl + (row.pnl ?? 0),
      count: cur.count + 1,
      wins: cur.wins + ((row.pnl ?? 0) > 0 ? 1 : 0),
    });
  }
  const byStrategy = Array.from(stratMap.entries())
    .map(([strat, { pnl, count, wins }]) => ({
      strategy: strat,
      pnl: r(pnl),
      count,
      winRate: count > 0 ? r1((wins / count) * 100) : 0,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  // Daily heatmap
  const heatMap = new Map<string, { pnl: number; count: number }>();
  for (const row of settled) {
    const cur = heatMap.get(row.date) ?? { pnl: 0, count: 0 };
    heatMap.set(row.date, {
      pnl: cur.pnl + (row.pnl ?? 0),
      count: cur.count + 1,
    });
  }
  const dailyHeatmap = Array.from(heatMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { pnl, count }]) => ({ date, pnl: r(pnl), count }));

  return { cumulative, byStrategy, dailyHeatmap };
}
