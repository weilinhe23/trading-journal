import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { KpiDashboardCard } from "~/components/kpi/KpiDashboardCard";
import { formatEtDisplayDate, getEtDateString } from "~/lib/kpi";
import { getKpiPeriodSummary } from "~/lib/kpi-server";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const today = getEtDateString(now);
  const weeklyKpi = await getKpiPeriodSummary("week", today);

  return (
    <div className="space-y-6">
      <section className={styles.hero} aria-labelledby="home-motto">
        <div className={styles.masthead}>
          <p className={styles.wordmark} lang="en">
            <span className={styles.mark} aria-hidden="true" />
            MNQ Trading Journal
          </p>
          <p className={styles.date}>美东时间 {formatEtDisplayDate(now)}</p>
        </div>

        <div className={styles.composition}>
          <h1 id="home-motto" className={styles.motto} lang="en">
            <span className={styles.line}>
              Make complexity <em>simple.</em>
            </span>{" "}
            <span className={styles.line}>
              Make simplicity <em>repeatable.</em>
            </span>
          </h1>

          <svg
            className={styles.artwork}
            viewBox="0 0 240 160"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <g stroke="currentColor" strokeWidth="1">
              <path
                opacity=".25"
                d="M0 20C75 145 30 0 100 80S155 48 178 48H240"
              />
              <path
                opacity=".4"
                d="M0 140C65 0 50 150 100 80S155 64 178 64H240"
              />
              <path
                opacity=".7"
                d="M0 55C30 0 70 150 100 80S155 80 178 80H240"
              />
              <path
                opacity=".4"
                d="M0 110C80 160 25 20 100 80S155 96 178 96H240"
              />
              <path
                opacity=".25"
                d="M0 80C35 160 70 0 100 80S155 112 178 112H240"
              />
              <path opacity=".2" strokeDasharray="2 6" d="M178 20V140" />
            </g>
            <circle cx="178" cy="80" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className={styles.signature} aria-hidden="true">
          <span className={styles.signatureRule} />
          <span className={styles.rhythm}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>
      </section>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">今日交易日志</CardTitle>
            <CardDescription>打开今天的盘前/盘中/盘后记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/journal/${today}`}>打开今日日志</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">日历视图</CardTitle>
            <CardDescription>查看历史记录，按日期导航</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/journal">查看日历</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">统计分析</CardTitle>
            <CardDescription>胜率、盈亏曲线、错过机会分析</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/analytics">查看统计</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <KpiDashboardCard summary={weeklyKpi} />

      {/* 开发阶段提示 */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">开发中</Badge>
            <div className="text-muted-foreground text-sm">
              <p>系统正在开发中。当前已完成 Phase 1 基础骨架。</p>
              <p className="mt-1">
                后续将完成：日历页面 → TradeSetup → 执行记录 → 截图 → 统计分析
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
