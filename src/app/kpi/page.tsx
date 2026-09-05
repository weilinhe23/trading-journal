import { KpiTrackerClient } from "~/components/kpi/KpiTrackerClient";
import {
  getEtDateString,
  isUsMarketTradingDay,
  parseUtcTradingDate,
} from "~/lib/kpi";
import {
  getActiveKpiTargets,
  getKpiDashboardSummaries,
} from "~/lib/kpi-server";
import { fetchExecutionRows } from "~/lib/execution-aggregator";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

export default async function KpiPage() {
  const today = getEtDateString();
  const todayDate = parseUtcTradingDate(today)!;

  const [summaries, activeTargets, initialRecord, executionRows] =
    await Promise.all([
      getKpiDashboardSummaries(today),
      getActiveKpiTargets(today),
      prisma.kpiDailyRecord.findUnique({
        where: { date: todayDate },
        select: { date: true, actualPcts: true, note: true },
      }),
      fetchExecutionRows({ dateTo: today }),
    ]);

  const mnqTrades = executionRows
    .map((trade) => {
      const actualPcts =
        trade.settled && trade.exitPrice !== null
          ? Math.round(
              (trade.exitPrice - trade.entryPrice) *
                (trade.direction === "SHORT" ? -1 : 1) *
                100,
            ) / 100
          : null;

      return {
        id: trade.id,
        date: trade.date,
        journalHref: trade.opportunityId
          ? `/journal/${trade.date}?tab=summary#mnq-opportunity-${trade.opportunityId}`
          : `/journal/${trade.date}?tab=summary`,
        segment: trade.segment,
        direction: trade.direction,
        strategy: trade.strategy,
        tradeTypeName: trade.tradeTypeName,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        quantity: trade.quantity,
        actualPcts,
        settled: trade.settled,
      };
    })
    .reverse();

  return (
    <KpiTrackerClient
      summaries={summaries}
      activeTargets={activeTargets}
      today={today}
      todayIsTradingDay={isUsMarketTradingDay(todayDate)}
      mnqTrades={mnqTrades}
      initialEntry={
        initialRecord
          ? {
              date: initialRecord.date.toISOString().slice(0, 10),
              actualPcts: initialRecord.actualPcts,
              note: initialRecord.note,
            }
          : null
      }
    />
  );
}
