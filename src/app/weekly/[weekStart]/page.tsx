import { notFound } from "next/navigation";
import { format, getISOWeek, getISOWeekYear } from "date-fns";
import { zhCN } from "date-fns/locale";
import { prisma } from "~/lib/prisma";
import { aggregateWeeklyMnq } from "~/lib/weekly-mnq-analysis";
import { WeeklyReportClient } from "~/components/weekly/WeeklyReportClient";

function parseWeekStart(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getMondayOf(date: Date): Date {
  const monday = new Date(date);
  const day = monday.getUTCDay();
  monday.setUTCDate(monday.getUTCDate() + (day === 0 ? -6 : 1 - day));
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

interface PageProps {
  params: Promise<{ weekStart: string }>;
}

export default async function WeeklyDetailPage({ params }: PageProps) {
  const { weekStart: weekStartValue } = await params;
  const weekStart = parseWeekStart(weekStartValue);
  if (!weekStart) notFound();

  const friday = new Date(weekStart);
  friday.setUTCDate(friday.getUTCDate() + 4);
  const weekEnd = new Date(friday);
  weekEnd.setUTCHours(23, 59, 59, 999);

  const [report, sessions, allSessions] = await Promise.all([
    prisma.weeklyReport.findUnique({ where: { weekStart } }),
    prisma.dailySession.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "asc" },
      select: {
        date: true,
        lessonsLearned: true,
        whatWentWell: true,
        planFollowed: true,
        emotionRating: true,
        focusRating: true,
        mnqPlan: true,
      },
    }),
    prisma.dailySession.findMany({
      select: { date: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const analysis = aggregateWeeklyMnq(sessions);

  const ratingDimensions = [
    {
      label: "遵守计划",
      values: sessions.map((session) => session.planFollowed),
    },
    {
      label: "情绪管理",
      values: sessions.map((session) => session.emotionRating),
    },
    {
      label: "专注度",
      values: sessions.map((session) => session.focusRating),
    },
  ]
    .map(({ label, values }) => {
      const completed = values.filter(
        (value): value is number => value !== null,
      );
      return completed.length > 0
        ? {
            label,
            score: Math.round(
              (completed.reduce((sum, value) => sum + value, 0) /
                completed.length) *
                20,
            ),
          }
        : null;
    })
    .filter(
      (dimension): dimension is { label: string; score: number } =>
        dimension !== null,
    );
  const systemScore =
    ratingDimensions.length > 0
      ? {
          total: Math.round(
            ratingDimensions.reduce(
              (sum, dimension) => sum + dimension.score,
              0,
            ) / ratingDimensions.length,
          ),
          dims: ratingDimensions,
        }
      : null;

  const uniqueMondays = [
    ...new Set(
      allSessions.map(
        ({ date }) => getMondayOf(date).toISOString().split("T")[0]!,
      ),
    ),
  ].sort();
  const currentIndex = uniqueMondays.indexOf(weekStartValue);
  const prevWeek =
    currentIndex > 0 ? (uniqueMondays[currentIndex - 1] ?? null) : null;
  const nextWeek =
    currentIndex >= 0 && currentIndex < uniqueMondays.length - 1
      ? (uniqueMondays[currentIndex + 1] ?? null)
      : null;

  const weekNum = getISOWeek(weekStart);
  const year = getISOWeekYear(weekStart);
  const dateRange = `${format(weekStart, "MM/dd", { locale: zhCN })} – ${format(friday, "MM/dd", { locale: zhCN })}`;

  return (
    <WeeklyReportClient
      weekStart={weekStartValue}
      prevWeek={prevWeek}
      nextWeek={nextWeek}
      weekNum={weekNum}
      year={year}
      dateRange={dateRange}
      initialReport={
        report
          ? {
              summary: report.summary,
              strengths: report.strengths,
              weaknesses: report.weaknesses,
              keyLessons: report.keyLessons,
              nextWeekPlan: report.nextWeekPlan,
              overallRating: report.overallRating,
            }
          : null
      }
      stats={analysis.stats}
      days={analysis.days}
      trades={analysis.trades}
      mnqMissed={analysis.missed}
      timeframeStats={analysis.timeframeStats}
      equity={analysis.equity}
      completeness={analysis.completeness}
      deviationReasons={analysis.deviationReasons}
      opportunityImpacts={analysis.opportunityImpacts}
      impactTypes={analysis.impactTypes}
      missedReasons={analysis.missedReasons}
      systemScore={systemScore}
      segmentAccuracy={analysis.segmentAccuracy}
    />
  );
}
