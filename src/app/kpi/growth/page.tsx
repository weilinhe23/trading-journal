import type { Metadata } from "next";
import { TradingGrowthPlan } from "~/components/kpi/TradingGrowthPlan";
import { getTradingGrowthProgress } from "~/lib/trading-growth-server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "交易成长计划 | Trading Journal" };

export default async function TradingGrowthPage() {
  return (
    <TradingGrowthPlan initialProgress={await getTradingGrowthProgress()} />
  );
}
