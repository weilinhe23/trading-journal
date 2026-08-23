import { prisma } from "~/lib/prisma";
import {
  buildKpiPeriodSummary,
  DEFAULT_KPI_TARGETS,
  KPI_DASHBOARD_PERIODS,
  getKpiPeriodRange,
  parseUtcTradingDate,
  type KpiPeriod,
  type KpiPeriodSummary,
} from "~/lib/kpi";

export interface ActiveKpiTargets {
  effectiveFrom: string | null;
  dailyBaseline: number;
  dailyOptimistic: number;
}

export async function getActiveKpiTargets(
  dateString: string,
): Promise<ActiveKpiTargets> {
  const date = parseUtcTradingDate(dateString);
  if (!date) throw new Error("日期格式错误，应为 YYYY-MM-DD");

  const target = await prisma.kpiTargetSetting.findFirst({
    where: { effectiveFrom: { lte: date } },
    orderBy: { effectiveFrom: "desc" },
  });

  return target
    ? {
        effectiveFrom: target.effectiveFrom.toISOString().slice(0, 10),
        dailyBaseline: target.dailyBaseline,
        dailyOptimistic: target.dailyOptimistic,
      }
    : {
        effectiveFrom: null,
        dailyBaseline: DEFAULT_KPI_TARGETS.baseline,
        dailyOptimistic: DEFAULT_KPI_TARGETS.optimistic,
      };
}

export async function getKpiPeriodSummary(
  period: KpiPeriod,
  anchorDate: string,
): Promise<KpiPeriodSummary> {
  const range = getKpiPeriodRange(period, anchorDate);
  const [records, targets] = await Promise.all([
    prisma.kpiDailyRecord.findMany({
      where: { date: { gte: range.start, lte: range.end } },
      orderBy: { date: "asc" },
      select: { date: true, actualPcts: true, note: true },
    }),
    prisma.kpiTargetSetting.findMany({
      where: { effectiveFrom: { lte: range.end } },
      orderBy: { effectiveFrom: "asc" },
      select: {
        effectiveFrom: true,
        dailyBaseline: true,
        dailyOptimistic: true,
      },
    }),
  ]);

  return buildKpiPeriodSummary({ period, anchorDate, records, targets });
}

export async function getKpiDashboardSummaries(
  anchorDate: string,
): Promise<KpiPeriodSummary[]> {
  const yearRange = getKpiPeriodRange("year", anchorDate);
  const [records, targets] = await Promise.all([
    prisma.kpiDailyRecord.findMany({
      where: { date: { gte: yearRange.start, lte: yearRange.end } },
      orderBy: { date: "asc" },
      select: { date: true, actualPcts: true, note: true },
    }),
    prisma.kpiTargetSetting.findMany({
      where: { effectiveFrom: { lte: yearRange.end } },
      orderBy: { effectiveFrom: "asc" },
      select: {
        effectiveFrom: true,
        dailyBaseline: true,
        dailyOptimistic: true,
      },
    }),
  ]);

  return KPI_DASHBOARD_PERIODS.map((period) =>
    buildKpiPeriodSummary({ period, anchorDate, records, targets }),
  );
}
