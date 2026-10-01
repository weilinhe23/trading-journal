import type {
  TradingGrowthCompletion,
  TradingGrowthPlan,
} from "../../generated/prisma";
import { getEtDateString } from "~/lib/kpi";
import { prisma } from "~/lib/prisma";
import {
  TRADING_GROWTH_STEPS,
  type TradingGrowthAction,
  type TradingGrowthProgress,
} from "~/lib/trading-growth";

const PLAN_ID = "primary";
const includeCompletions = {
  completions: { orderBy: { stepIndex: "asc" as const } },
};

function serializeProgress(
  plan: TradingGrowthPlan & { completions: TradingGrowthCompletion[] },
): TradingGrowthProgress {
  const startedDate = getEtDateString(plan.createdAt);
  const currentStartedDate =
    plan.completedCount === TRADING_GROWTH_STEPS.length
      ? null
      : getEtDateString(plan.completions.at(-1)?.completedAt ?? plan.createdAt);

  return {
    completedCount: plan.completedCount,
    revision: plan.revision,
    startedDate,
    currentStartedDate,
    currentDayCount: currentStartedDate
      ? Math.max(
          1,
          Math.round(
            (Date.parse(getEtDateString()) - Date.parse(currentStartedDate)) /
              86_400_000,
          ) + 1,
        )
      : null,
    completions: plan.completions.map((completion) => ({
      stepIndex: completion.stepIndex,
      completedAt: completion.completedAt.toISOString(),
      completedDate: getEtDateString(completion.completedAt),
    })),
  };
}

export async function getTradingGrowthProgress(): Promise<TradingGrowthProgress> {
  const plan = await prisma.tradingGrowthPlan.upsert({
    where: { id: PLAN_ID },
    create: { id: PLAN_ID },
    update: {},
    include: includeCompletions,
  });
  return serializeProgress(plan);
}

export class TradingGrowthConflictError extends Error {
  constructor() {
    super("计划进度已变化，已同步最新状态，请检查当前目标后重试。");
  }
}

export async function updateTradingGrowthProgress(
  action: TradingGrowthAction,
  expectedRevision: number,
): Promise<TradingGrowthProgress> {
  return prisma.$transaction(async (tx) => {
    // Compare-and-swap first: a stale tab or repeated request cannot advance twice.
    const changed = await tx.tradingGrowthPlan.updateMany({
      where: {
        id: PLAN_ID,
        revision: expectedRevision,
        completedCount:
          action === "complete"
            ? { lt: TRADING_GROWTH_STEPS.length }
            : { gt: 0 },
      },
      data: {
        completedCount: { increment: action === "complete" ? 1 : -1 },
        revision: { increment: 1 },
      },
    });
    if (changed.count !== 1) throw new TradingGrowthConflictError();

    const plan = await tx.tradingGrowthPlan.findUniqueOrThrow({
      where: { id: PLAN_ID },
    });
    if (action === "complete") {
      await tx.tradingGrowthCompletion.create({
        data: {
          planId: PLAN_ID,
          stepIndex: plan.completedCount - 1,
          completedAt: new Date(),
        },
      });
    } else {
      await tx.tradingGrowthCompletion.delete({
        where: {
          planId_stepIndex: { planId: PLAN_ID, stepIndex: plan.completedCount },
        },
      });
    }

    return serializeProgress(
      await tx.tradingGrowthPlan.findUniqueOrThrow({
        where: { id: PLAN_ID },
        include: includeCompletions,
      }),
    );
  });
}
