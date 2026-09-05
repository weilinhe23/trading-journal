import { prisma } from "~/lib/prisma";
import { getEtDateString, getKpiPeriodRange, shiftKpiAnchor } from "~/lib/kpi";
import {
  buildComparison,
  buildTrends,
  isComparisonPeriod,
  normalizeAnchor,
  normalizeSelection,
  periodAnchors,
  recentPeriodRange,
  type ComparisonPeriod,
} from "~/lib/kpi-comparison";

export class KpiQueryError extends Error {}

export function parseAnalysisQuery(
  params: URLSearchParams,
  kind: "trends" | "comparison",
  today = getEtDateString(),
) {
  try {
    const period =
      params.get("period") ?? (kind === "trends" ? "week" : "month");
    if (!isComparisonPeriod(period)) throw new Error("周期必须为周、月或季度");
    if (kind === "comparison") {
      const mode = params.get("mode") ?? "aligned";
      if (mode !== "aligned" && mode !== "full")
        throw new Error("比较口径无效");
      const selected = (params.get("anchors") ?? "").split(",");
      const { anchors, baseline } = normalizeSelection(
        period,
        selected,
        params.get("baseline") ?? selected[0]!,
        today,
      );
      return { kind, period, anchors, baseline, mode, today } as const;
    }
    const from = params.get("from") ?? recentPeriodRange(period, today).from;
    const to = params.get("to") ?? today;
    const anchors = periodAnchors(period, from, to);
    const detailValue = params.get("detail");
    const detail = detailValue
      ? normalizeAnchor(period, detailValue)
      : undefined;
    return { kind, period, anchors, detail, today } as const;
  } catch (error) {
    throw new KpiQueryError(
      error instanceof Error ? error.message : "查询参数无效",
    );
  }
}

async function readSource(
  period: ComparisonPeriod,
  anchors: string[],
  today: string,
) {
  const ranges = [...new Set(anchors)].map((a) => getKpiPeriodRange(period, a));
  const last = ranges.reduce(
    (end, r) => (r.end > end ? r.end : end),
    ranges[0]!.end,
  );
  const [records, targets] = await Promise.all([
    prisma.kpiDailyRecord.findMany({
      where: {
        OR: ranges.map((range) => ({
          date: { gte: range.start, lte: range.end },
        })),
      },
      select: { date: true, actualPcts: true, note: true },
      orderBy: { date: "asc" },
    }),
    prisma.kpiTargetSetting.findMany({
      where: { effectiveFrom: { lte: last } },
      select: {
        effectiveFrom: true,
        dailyBaseline: true,
        dailyOptimistic: true,
      },
      orderBy: { effectiveFrom: "asc" },
    }),
  ]);
  return { records, targets, today };
}

export async function queryKpiAnalysis(
  query: ReturnType<typeof parseAnalysisQuery>,
) {
  if (query.kind === "comparison") {
    const source = await readSource(query.period, query.anchors, query.today);
    return buildComparison(
      query.period,
      query.anchors,
      query.baseline,
      query.mode,
      source,
    );
  }
  // Use a contiguous window for history to avoid SQLite's OR expression depth limit.
  const first = shiftKpiAnchor(query.period, query.anchors[0]!, -1);
  const last = query.anchors[query.anchors.length - 1]!;
  const range = {
    start: getKpiPeriodRange(query.period, first).start,
    end: getKpiPeriodRange(query.period, last).end,
  };
  const extras = [query.today, ...(query.detail ? [query.detail] : [])].map(
    (a) => getKpiPeriodRange(query.period, a),
  );
  const end = extras.reduce(
    (date, r) => (r.end > date ? r.end : date),
    range.end,
  );
  const [records, targets] = await Promise.all([
    prisma.kpiDailyRecord.findMany({
      where: {
        OR: [range, ...extras].map((r) => ({
          date: { gte: r.start, lte: r.end },
        })),
      },
      select: { date: true, actualPcts: true, note: true },
      orderBy: { date: "asc" },
    }),
    prisma.kpiTargetSetting.findMany({
      where: { effectiveFrom: { lte: end } },
      orderBy: { effectiveFrom: "asc" },
      select: {
        effectiveFrom: true,
        dailyBaseline: true,
        dailyOptimistic: true,
      },
    }),
  ]);
  return buildTrends(
    query.period,
    query.anchors,
    { records, targets, today: query.today },
    query.detail,
  );
}
