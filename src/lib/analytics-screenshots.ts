import { prisma } from "~/lib/prisma";
import type { Screenshot } from "../../generated/prisma";

export type AnalyticsScreenshot = Pick<
  Screenshot,
  "id" | "filePath" | "originalName" | "caption" | "timeframe"
>;

export type DailyScreenshots = Record<string, AnalyticsScreenshot[]>;

export async function fetchDailyScreenshots(
  dates: string[],
): Promise<DailyScreenshots> {
  const uniqueDates = [...new Set(dates)];
  if (uniqueDates.length === 0) return {};

  const sessionDates = uniqueDates.map(
    (date) => new Date(`${date}T00:00:00.000Z`),
  );
  const screenshots = await prisma.screenshot.findMany({
    where: {
      OR: [
        { sessionDate: { in: sessionDates } },
        { setup: { sessionDate: { in: sessionDates } } },
        { execution: { setup: { sessionDate: { in: sessionDates } } } },
      ],
    },
    select: {
      id: true,
      filePath: true,
      originalName: true,
      caption: true,
      timeframe: true,
      sessionDate: true,
      setup: { select: { sessionDate: true } },
      execution: { select: { setup: { select: { sessionDate: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const byDate: DailyScreenshots = {};
  const requestedDates = new Set(uniqueDates);
  for (const screenshot of screenshots) {
    const { sessionDate, setup, execution, ...image } = screenshot;
    const date = (
      sessionDate ??
      setup?.sessionDate ??
      execution?.setup.sessionDate
    )
      ?.toISOString()
      .slice(0, 10);
    if (date && requestedDates.has(date)) {
      (byDate[date] ??= []).push(image);
    }
  }
  return byDate;
}
