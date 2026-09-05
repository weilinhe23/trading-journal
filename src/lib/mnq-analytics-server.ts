import { buildMnqAnalyticsSnapshot } from "~/lib/mnq-analytics";
import { prisma } from "~/lib/prisma";

export async function getMnqAnalyticsSnapshot() {
  const sources = await prisma.mnqDailyPlan.findMany({
    select: {
      sessionDate: true,
      marketPreJson: true,
      marketOpenJson: true,
      marketMidJson: true,
      marketAfternoonJson: true,
    },
    orderBy: { sessionDate: "asc" },
  });

  return buildMnqAnalyticsSnapshot(sources);
}
