"use client";

import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export interface KpiMnqTradeDetail {
  id: string;
  date: string;
  journalHref: string;
  segment: string | null;
  direction: "LONG" | "SHORT";
  strategy: string | null;
  tradeTypeName: string | null;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  actualPcts: number | null;
  settled: boolean;
}

interface KpiTradeDetailsTableProps {
  trades: KpiMnqTradeDetail[];
}

const priceFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

const pctsFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
  signDisplay: "exceptZero",
});

export function KpiTradeDetailsTable({ trades }: KpiTradeDetailsTableProps) {
  const router = useRouter();
  const settledTrades = trades.filter((trade) => trade.settled);
  const totalPcts = settledTrades.reduce(
    (total, trade) => total + (trade.actualPcts ?? 0),
    0,
  );

  if (trades.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-36 items-center justify-center px-6 text-sm">
        暂无 MNQ 交易明细
      </div>
    );
  }

  return (
    <>
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 text-xs sm:px-6">
        <span>
          共 {trades.length} 笔 · {settledTrades.length} 笔已平仓
        </span>
        <span className="tabular-nums">
          已平仓合计
          <strong
            className={cn(
              "ml-1 font-semibold",
              totalPcts > 0 && "text-emerald-400",
              totalPcts < 0 && "text-rose-400",
              totalPcts === 0 && "text-foreground",
            )}
          >
            {pctsFormatter.format(totalPcts)} PTS
          </strong>
        </span>
      </div>

      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead className="bg-card sticky top-0 z-10 shadow-[0_1px_0_0_var(--border)]">
            <tr className="text-muted-foreground text-left text-xs">
              <th scope="col" className="px-5 py-3 font-medium sm:pl-6">
                交易日
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                时段
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                方向
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                策略 / 类型
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                入场
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                出场
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                合约
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                PTS
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right font-medium sm:pr-6"
              >
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                role="link"
                tabIndex={0}
                aria-label={`查看 ${trade.date} 的 MNQ 原始交易日志`}
                title="点击查看原始日志"
                onClick={() => router.push(trade.journalHref)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") router.push(trade.journalHref);
                }}
                className="border-border/70 hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-ring cursor-pointer border-b transition-colors outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset"
              >
                <td className="px-5 py-3 font-medium whitespace-nowrap tabular-nums sm:pl-6">
                  {trade.date}
                </td>
                <td className="text-muted-foreground px-3 py-3 whitespace-nowrap">
                  {trade.segment?.replace("MNQ", "") ?? "—"}
                </td>
                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      trade.direction === "LONG"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-400",
                    )}
                  >
                    {trade.direction === "LONG" ? "多" : "空"}
                  </Badge>
                </td>
                <td className="max-w-52 px-3 py-3">
                  <p className="truncate font-medium">
                    {trade.strategy ?? "未分类"}
                  </p>
                  {trade.tradeTypeName ? (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {trade.tradeTypeName}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {priceFormatter.format(trade.entryPrice)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {trade.exitPrice === null
                    ? "—"
                    : priceFormatter.format(trade.exitPrice)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {priceFormatter.format(trade.quantity)}
                </td>
                <td
                  className={cn(
                    "px-3 py-3 text-right font-semibold tabular-nums",
                    trade.actualPcts !== null &&
                      trade.actualPcts > 0 &&
                      "text-emerald-400",
                    trade.actualPcts !== null &&
                      trade.actualPcts < 0 &&
                      "text-rose-400",
                    trade.actualPcts === 0 && "text-foreground",
                    trade.actualPcts === null && "text-muted-foreground",
                  )}
                >
                  {trade.actualPcts === null
                    ? "—"
                    : pctsFormatter.format(trade.actualPcts)}
                </td>
                <td className="px-5 py-3 text-right sm:pr-6">
                  <Badge
                    variant="outline"
                    className={cn(
                      trade.settled
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400",
                    )}
                  >
                    {trade.settled ? "已平仓" : "未平仓"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
