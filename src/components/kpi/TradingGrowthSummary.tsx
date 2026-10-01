import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  TRADING_GROWTH_STEPS,
  type TradingGrowthProgress,
} from "~/lib/trading-growth";
import styles from "./TradingGrowthPlan.module.css";

export function TradingGrowthSummary({
  progress,
}: {
  progress: TradingGrowthProgress;
}) {
  const current = TRADING_GROWTH_STEPS[progress.completedCount];
  const next = TRADING_GROWTH_STEPS[progress.completedCount + 1];

  return (
    <section className={styles.summary} aria-labelledby="growth-summary-title">
      <div>
        <h2 id="growth-summary-title" className={styles.summaryLabel}>
          交易成长计划
        </h2>
        <div className={styles.summaryGoal}>
          <strong>
            {current ? `当前：${current.label}` : "全部目标已完成"}
          </strong>
          <span>
            {next
              ? `下一目标：${next.label}`
              : current
                ? "最终目标"
                : "终点：10 手 NQ"}
          </span>
        </div>
      </div>
      <div className={styles.summaryProgress}>
        <p>
          已完成 {progress.completedCount} / {TRADING_GROWTH_STEPS.length}{" "}
          个目标
        </p>
        <Button asChild variant="outline">
          <Link href="/kpi/growth">
            查看成长计划
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
