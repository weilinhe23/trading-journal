import Link from "next/link";
import { format, getISOWeek, getISOWeekYear } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Badge } from "~/components/ui/badge";
import { prisma } from "~/lib/prisma";
import { cn } from "~/lib/utils";
import { formatPnL } from "~/lib/pnl";
import { CreateWeeklyReportButton } from "~/components/weekly/CreateWeeklyReportButton";
import { aggregateWeeklyMnq } from "~/lib/weekly-mnq-analysis";

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export default async function WeeklyListPage() {
  const sessions = await prisma.dailySession.findMany({
    orderBy: { date: "asc" },
    include: { mnqPlan: true },
  });

  // Group sessions by ISO week Monday
  const weekMap = new Map<
    string,
    { monday: Date; sessions: typeof sessions }
  >();
  for (const session of sessions) {
    const monday = getMondayOf(session.date);
    const key = monday.toISOString().split("T")[0]!;
    if (!weekMap.has(key)) weekMap.set(key, { monday, sessions: [] });
    weekMap.get(key)!.sessions.push(session);
  }

  // Fetch reports for weeks that have sessions
  const weekStarts = Array.from(weekMap.values()).map((w) => w.monday);
  const reports = await prisma.weeklyReport.findMany({
    where: { weekStart: { in: weekStarts } },
  });
  const reportMap = new Map(
    reports.map((r) => [r.weekStart.toISOString().split("T")[0]!, r]),
  );

  // Sort desc
  const weeks = Array.from(weekMap.entries()).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MNQ 每周周报</h1>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">
            共 {weeks.length} 周交易记录
          </p>
          <CreateWeeklyReportButton />
        </div>
      </div>

      {weeks.length === 0 && (
        <p className="text-muted-foreground py-16 text-center text-sm">
          暂无交易记录
        </p>
      )}

      <div className="space-y-3">
        {weeks.map(([key, { monday, sessions: weekSessions }]) => {
          const friday = new Date(monday);
          friday.setUTCDate(friday.getUTCDate() + 4);
          const weekNum = getISOWeek(monday);
          const year = getISOWeekYear(monday);
          const { stats, completeness } = aggregateWeeklyMnq(weekSessions);

          const report = reportMap.get(key);
          const winRate =
            stats.winRate === null ? null : Math.round(stats.winRate);

          return (
            <Link key={key} href={`/weekly/${key}`} className="group block">
              <div className="bg-card hover:border-primary/50 rounded-lg border p-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {year}年 第{weekNum}周
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {format(monday, "MM/dd", { locale: zhCN })} –{" "}
                        {format(friday, "MM/dd", { locale: zhCN })}
                      </span>
                      {report ? (
                        <Badge
                          variant="outline"
                          className="border-green-700 py-0 text-[10px] text-green-400"
                        >
                          已写周报
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground/40 py-0 text-[10px]"
                        >
                          待填写
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={cn(
                          "font-medium",
                          stats.totalPnL >= 0
                            ? "text-green-400"
                            : "text-red-400",
                        )}
                      >
                        {formatPnL(stats.totalPnL)}
                      </span>
                      <span className="text-muted-foreground">
                        把握 {stats.executedCount}
                      </span>
                      {winRate !== null && (
                        <span className="text-muted-foreground">
                          胜率 {winRate}%
                          <span className="ml-1 text-xs">
                            ({stats.winCount}W / {stats.lossCount}L)
                          </span>
                        </span>
                      )}
                      {stats.missedCount > 0 && (
                        <span className="text-orange-400/70">
                          错过 {stats.missedCount}
                        </span>
                      )}
                      {stats.realizedRCount > 0 && (
                        <span
                          className={cn(
                            stats.totalRealizedR >= 0
                              ? "text-green-400/80"
                              : "text-red-400/80",
                          )}
                        >
                          {stats.totalRealizedR >= 0 ? "+" : ""}
                          {stats.totalRealizedR.toFixed(2)}R
                        </span>
                      )}
                      {completeness.score !== null && (
                        <span className="text-muted-foreground">
                          完整度 {completeness.score}%
                        </span>
                      )}
                    </div>
                  </div>

                  {report?.overallRating && (
                    <div className="shrink-0 text-sm text-yellow-400">
                      {"★".repeat(report.overallRating)}
                      <span className="text-muted-foreground/30">
                        {"★".repeat(5 - report.overallRating)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
