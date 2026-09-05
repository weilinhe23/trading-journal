import type { DatedMnqOpportunity } from "~/lib/mnq-analytics";
import {
  buildMnqMissedAnalytics,
  missedReasonLabel,
} from "~/lib/mnq-analytics";
import { getMnqAnalyticsSnapshot } from "~/lib/mnq-analytics-server";

export interface MissedOpportunityFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  strategy?: string | null;
  tradeType?: string | null;
  reason?: string | null;
}

export interface MissedOpportunityFilterOptions {
  strategies: Array<{ name: string; tradeTypes: string[] }>;
  tradeTypes: string[];
  reasons: Array<{ value: string; label: string }>;
}

function normalizeCategory(value: string | null): string | null {
  const name = value?.trim();
  return name?.length ? name : null;
}

function categoryName(value: string | null): string {
  return normalizeCategory(value) ?? "未分类";
}

export function filterMissedOpportunityRows(
  rows: DatedMnqOpportunity[],
  filters: MissedOpportunityFilters = {},
): DatedMnqOpportunity[] {
  const strategy = filters.strategy?.trim().toLocaleLowerCase("zh-CN");
  const tradeType = filters.tradeType?.trim().toLocaleLowerCase("zh-CN");
  const reason = filters.reason?.trim().toUpperCase();

  return rows.filter(
    (row) =>
      row.status === "MISSED" &&
      (!filters.dateFrom || row.date >= filters.dateFrom) &&
      (!filters.dateTo || row.date <= filters.dateTo) &&
      (!strategy ||
        categoryName(row.strategy).toLocaleLowerCase("zh-CN") === strategy) &&
      (!tradeType ||
        categoryName(row.tradeType).toLocaleLowerCase("zh-CN") === tradeType) &&
      (!reason || (row.missedReasonCategory ?? "UNCLASSIFIED") === reason),
  );
}

// Use recorded values so historical classifications remain selectable.
export function buildMissedOpportunityFilterOptions(
  rows: DatedMnqOpportunity[],
): MissedOpportunityFilterOptions {
  const missedRows = rows.filter((row) => row.status === "MISSED");
  const strategies = new Map<string, Set<string>>();
  const tradeTypes = new Set<string>();
  const reasons = new Set<string>();

  for (const row of missedRows) {
    const strategy = categoryName(row.strategy);
    const tradeType = categoryName(row.tradeType);
    const types = strategies.get(strategy) ?? new Set<string>();
    types.add(tradeType);
    strategies.set(strategy, types);
    tradeTypes.add(tradeType);
    reasons.add(row.missedReasonCategory ?? "UNCLASSIFIED");
  }

  const sorted = (values: Iterable<string>) =>
    Array.from(values).sort((a, b) => a.localeCompare(b, "zh-CN"));

  return {
    strategies: sorted(strategies.keys()).map((name) => ({
      name,
      tradeTypes: sorted(strategies.get(name)!),
    })),
    tradeTypes: sorted(tradeTypes),
    reasons: sorted(reasons)
      .map((value) => ({ value, label: missedReasonLabel(value) }))
      .sort((a, b) => a.label.localeCompare(b.label, "zh-CN")),
  };
}

export async function fetchMissedOpportunityRows(
  filters: MissedOpportunityFilters = {},
): Promise<DatedMnqOpportunity[]> {
  const { rows } = await getMnqAnalyticsSnapshot();
  return filterMissedOpportunityRows(rows, filters);
}

export function buildMissedOpportunityResponse(
  allRows: DatedMnqOpportunity[],
  filters: MissedOpportunityFilters = {},
) {
  const rows = filterMissedOpportunityRows(allRows, filters);
  return {
    ...buildMnqMissedAnalytics(rows),
    filterOptions: buildMissedOpportunityFilterOptions(allRows),
  };
}
