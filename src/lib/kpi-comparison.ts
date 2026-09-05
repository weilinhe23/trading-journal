import {
  buildKpiPeriodSummary,
  getKpiPeriodRange,
  shiftKpiAnchor,
  type KpiRecordValue,
  type KpiTargetValue,
} from "~/lib/kpi";

export type ComparisonPeriod = "week" | "month" | "quarter";
export type ComparisonMode = "aligned" | "full";
export type TrendMetric = "actual" | "completion" | "average";
export const MAX_COMPARISON_PERIODS = 6;

export function validAnalysisDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value >= "1900-01-01" &&
    value <= "2200-12-31"
  );
}

export function isComparisonPeriod(value: string): value is ComparisonPeriod {
  return value === "week" || value === "month" || value === "quarter";
}

export function normalizeAnchor(
  period: ComparisonPeriod,
  date: string,
): string {
  if (!validAnalysisDate(date))
    throw new Error("请输入 1900–2200 年内有效的日期");
  return getKpiPeriodRange(period, date).startDate;
}

export function recentPeriodRange(
  period: ComparisonPeriod,
  today: string,
  count = period === "week" ? 4 : period === "quarter" ? 8 : 12,
) {
  let from = normalizeAnchor(period, today);
  for (let i = 1; i < count; i++) from = shiftKpiAnchor(period, from, -1);
  return { from, to: today };
}

export function periodAnchors(
  period: ComparisonPeriod,
  from: string,
  to: string,
): string[] {
  if (!validAnalysisDate(from) || !validAnalysisDate(to) || from > to)
    throw new Error("起止日期无效，开始日期不能晚于结束日期");
  const end = normalizeAnchor(period, to);
  const result: string[] = [];
  let anchor = normalizeAnchor(period, from);
  while (anchor <= end) {
    result.push(anchor);
    anchor = shiftKpiAnchor(period, anchor, 1);
  }
  return result;
}

export function normalizeSelection(
  period: ComparisonPeriod,
  anchors: string[],
  baseline: string,
  today: string,
) {
  const selected = [
    ...new Set(anchors.map((a) => normalizeAnchor(period, a))),
  ].sort();
  if (selected.length < 2 || selected.length > MAX_COMPARISON_PERIODS)
    throw new Error("请选择 2–6 个不同周期");
  if (selected.some((a) => a > today))
    throw new Error("尚未开始的周期不能加入对比");
  const base = normalizeAnchor(period, baseline);
  if (!selected.includes(base)) throw new Error("基准必须是已选周期");
  return { anchors: selected, baseline: base };
}

export interface AnalysisDay {
  date: string;
  note: string | null;
  actual: number | null;
  cumulative: number | null;
  baseline: number;
  optimistic: number;
  cumulativeBaseline: number;
  completion: number | null;
  average: number | null;
}
export interface AnalysisMetrics {
  actual: number | null;
  recorded: number;
  expected: number;
  complete: boolean;
  baseline: number;
  optimistic: number;
  gap: number | null;
  completion: number | null;
  average: number | null;
  hitRate: number | null;
}
export interface AnalysisPeriod extends AnalysisMetrics {
  anchor: string;
  label: string;
  endDate: string;
  unfinished: boolean;
  future: boolean;
  fullBaseline: number;
  fullOptimistic: number;
  fullCompletion: number | null;
  days: AnalysisDay[];
}
export interface Change {
  delta: number | null;
  percent: number | null;
  reason: string | null;
}
export type PeriodOverview = Omit<AnalysisPeriod, "days">;
export interface TrendItem extends PeriodOverview {
  change: Change;
  movingActual: number | null;
  movingCompletion: number | null;
  movingAverage: number | null;
}
export interface TrendsResponse {
  from: string;
  to: string;
  today: string;
  items: TrendItem[];
  current: PeriodOverview;
  detail: AnalysisPeriod | null;
}
export interface ComparisonSeries {
  period: PeriodOverview;
  metrics: AnalysisMetrics;
  change: Change;
  adjacent: boolean;
  days: Array<AnalysisDay & { delta: number | null }>;
}
export interface ComparisonResponse {
  today: string;
  baseline: string;
  mode: ComparisonMode;
  alignedDays: number;
  series: ComparisonSeries[];
  points: Array<{ index: number; [key: string]: number | null }>;
}
export interface AnalysisSource {
  records: readonly KpiRecordValue[];
  targets: readonly KpiTargetValue[];
  today: string;
}

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
function ratio(actual: number | null, denominator: number) {
  return actual !== null && denominator > 0
    ? round((actual / denominator) * 100)
    : null;
}

export function summarizeAnalysisDays(
  days: readonly AnalysisDay[],
): AnalysisMetrics {
  let total = 0,
    recorded = 0,
    baseline = 0,
    optimistic = 0,
    hits = 0;
  for (const day of days) {
    baseline += day.baseline;
    optimistic += day.optimistic;
    if (day.actual !== null) {
      total += day.actual;
      recorded++;
      if (day.actual >= day.baseline) hits++;
    }
  }
  const actual = recorded ? round(total) : null;
  return {
    actual,
    recorded,
    expected: days.length,
    complete: days.length > 0 && recorded === days.length,
    baseline: round(baseline),
    optimistic: round(optimistic),
    gap: actual === null ? null : round(actual - baseline),
    completion: ratio(actual, baseline),
    average: actual === null ? null : round(actual / recorded),
    hitRate: recorded ? round((hits / recorded) * 100) : null,
  };
}

export function analysisChange(
  value: AnalysisMetrics,
  base: AnalysisMetrics,
): Change {
  if (value.actual === null || base.actual === null)
    return { delta: null, percent: null, reason: "暂无记录" };
  const delta = round(value.actual - base.actual);
  if (!value.complete || !base.complete)
    return { delta, percent: null, reason: "数据不完整，差额基于已录入值" };
  if (base.actual <= 0)
    return { delta, percent: null, reason: "基准非正，不计算变化率" };
  return { delta, percent: round((delta / base.actual) * 100), reason: null };
}

export function buildAnalysisPeriod(
  period: ComparisonPeriod,
  anchor: string,
  source: AnalysisSource,
): AnalysisPeriod {
  const summary = buildKpiPeriodSummary({
    period,
    anchorDate: anchor,
    records: source.records,
    targets: source.targets,
  });
  const notes = new Map(summary.records.map((r) => [r.date, r.note]));
  let total = 0,
    recorded = 0,
    target = 0;
  const days = summary.dailyResults
    .filter((d) => d.startDate <= source.today)
    .map((day): AnalysisDay => {
      target += day.baselineTarget;
      if (day.actualPcts !== null) {
        total += day.actualPcts;
        recorded++;
      }
      const cumulative = recorded ? round(total) : null;
      return {
        date: day.startDate,
        note: notes.get(day.startDate) ?? null,
        actual: day.actualPcts,
        cumulative,
        baseline: day.baselineTarget,
        optimistic: day.optimisticTarget,
        cumulativeBaseline: round(target),
        completion: ratio(cumulative, target),
        average: recorded ? round(total / recorded) : null,
      };
    });
  const metrics = summarizeAnalysisDays(days);
  return {
    ...metrics,
    anchor: summary.startDate,
    label: summary.label,
    endDate: summary.endDate,
    unfinished: summary.endDate > source.today,
    future: summary.startDate > source.today,
    fullBaseline: summary.baselineTarget,
    fullOptimistic: summary.optimisticTarget,
    fullCompletion: ratio(metrics.actual, summary.baselineTarget),
    days,
  };
}

function overview(value: AnalysisPeriod): PeriodOverview {
  const { days: _days, ...result } = value;
  void _days;
  return result;
}

export function buildTrends(
  period: ComparisonPeriod,
  anchors: string[],
  source: AnalysisSource,
  detail?: string,
): TrendsResponse {
  // Only retain a four-period window of daily arrays for long history queries.
  const history: AnalysisPeriod[] = [];
  let previous = buildAnalysisPeriod(
    period,
    shiftKpiAnchor(period, anchors[0]!, -1),
    source,
  );
  const items = anchors.map((anchor): TrendItem => {
    const value = buildAnalysisPeriod(period, anchor, source);
    history.push(value);
    if (history.length > 4) history.shift();
    const smooth =
      history.length === 4 && history.every((v) => !v.unfinished && v.complete);
    const mean = (key: "actual" | "fullCompletion" | "average") =>
      smooth
        ? round(history.reduce((sum, v) => sum + (v[key] ?? 0), 0) / 4)
        : null;
    const item = {
      ...overview(value),
      change: analysisChange(value, previous),
      movingActual: mean("actual"),
      movingCompletion: mean("fullCompletion"),
      movingAverage: mean("average"),
    };
    previous = value;
    return item;
  });
  return {
    from: anchors[0]!,
    to: getKpiPeriodRange(period, anchors[anchors.length - 1]!).endDate,
    today: source.today,
    items,
    current: overview(buildAnalysisPeriod(period, source.today, source)),
    detail: detail ? buildAnalysisPeriod(period, detail, source) : null,
  };
}

export function buildComparison(
  period: ComparisonPeriod,
  anchors: string[],
  baseline: string,
  mode: ComparisonMode,
  source: AnalysisSource,
): ComparisonResponse {
  const selection = normalizeSelection(period, anchors, baseline, source.today);
  const periods = selection.anchors.map((a) =>
    buildAnalysisPeriod(period, a, source),
  );
  const alignedDays = Math.min(...periods.map((p) => p.days.length));
  const metrics = periods.map((p) =>
    summarizeAnalysisDays(
      mode === "aligned" ? p.days.slice(0, alignedDays) : p.days,
    ),
  );
  const baseIndex = selection.anchors.indexOf(selection.baseline);
  const series = periods.map(
    (p, index): ComparisonSeries => ({
      period: overview(p),
      metrics: metrics[index]!,
      change: analysisChange(metrics[index]!, metrics[baseIndex]!),
      adjacent: shiftKpiAnchor(period, p.anchor, -1) === selection.baseline,
      days: p.days.map((day, dayIndex) => {
        const base = periods[baseIndex]!.days[dayIndex]?.cumulative;
        return {
          ...day,
          delta:
            day.cumulative !== null && base != null
              ? round(day.cumulative - base)
              : null,
        };
      }),
    }),
  );
  // Keep complete curves; the reference line and summaries define the common comparison window.
  const points = Array.from(
    { length: Math.max(...periods.map((p) => p.days.length)) },
    (_, i) => {
      const point: ComparisonResponse["points"][number] = { index: i + 1 };
      series.forEach((s, index) => {
        const day = s.days[i];
        point[`s${index}`] = day?.cumulative ?? null;
        point[`completion${index}`] = day?.completion ?? null;
        point[`average${index}`] = day?.average ?? null;
      });
      return point;
    },
  );
  return {
    today: source.today,
    baseline: selection.baseline,
    mode,
    alignedDays,
    series,
    points,
  };
}
