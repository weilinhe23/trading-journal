"use client";

import { Fragment, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatPnL } from "~/lib/pnl";
import type { TradeRow } from "~/lib/execution-aggregator";

export type { TradeRow };

type SortKey = "date" | "pnl" | "quantity";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      className="text-muted-foreground hover:text-foreground cursor-pointer px-3 py-2 text-left text-xs font-medium whitespace-nowrap select-none"
      onClick={() => onClick(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          dir === "desc" ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )
        ) : (
          <ChevronDown className="h-3 w-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

function AccuracyCell({ accuracy }: { accuracy: TradeRow["entryAccuracy"] }) {
  if (accuracy === null)
    return <span className="text-muted-foreground">未评估</span>;
  return (
    <span
      className={accuracy === "CORRECT" ? "text-green-400" : "text-red-400"}
    >
      {accuracy === "CORRECT" ? "✓ 准确" : "✗ 有误"}
    </span>
  );
}

interface Props {
  data: TradeRow[];
}

export function ExecutionTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  function toggleReview(id: string) {
    setExpandedRows((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.date.localeCompare(b.date);
      if (sortKey === "pnl") cmp = (a.pnl ?? -Infinity) - (b.pnl ?? -Infinity);
      if (sortKey === "quantity") cmp = a.quantity - b.quantity;
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        暂无成交记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground text-xs">
        共 <span className="text-foreground font-medium">{data.length}</span> 笔
        {totalPages > 1 && ` · 第 ${page + 1} / ${totalPages} 页`}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b">
            <tr>
              <SortHeader
                label="日期"
                sortKey="date"
                current={sortKey}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                方向
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                策略
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                交易类型
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                时段
              </th>
              <th className="text-muted-foreground px-3 py-2 text-right text-xs font-medium">
                入场价
              </th>
              <th className="text-muted-foreground px-3 py-2 text-right text-xs font-medium">
                出场价
              </th>
              <SortHeader
                label="数量"
                sortKey="quantity"
                current={sortKey}
                dir={sortDir}
                onClick={handleSort}
              />
              <SortHeader
                label="盈亏"
                sortKey="pnl"
                current={sortKey}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="text-muted-foreground px-3 py-2 text-center text-xs font-medium">
                进入评估
              </th>
              <th className="text-muted-foreground px-3 py-2 text-center text-xs font-medium">
                退出评估
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium">
                复盘描述
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {pageData.map((row) => (
              <Fragment key={row.id}>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="text-muted-foreground px-3 py-2 text-xs whitespace-nowrap">
                    <Link
                      href={
                        row.opportunityId
                          ? `/journal/${row.date}?tab=intra#mnq-opportunity-${encodeURIComponent(row.opportunityId)}`
                          : `/journal/${row.date}?tab=intra`
                      }
                      title="打开这笔成交对应的交易日志"
                      className="hover:text-foreground underline underline-offset-4"
                    >
                      {row.date}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs font-medium",
                        row.direction === "LONG" &&
                          "bg-green-600/20 text-green-400",
                        row.direction === "SHORT" &&
                          "bg-red-600/20 text-red-400",
                      )}
                    >
                      {row.direction === "LONG" ? "多" : "空"}
                    </span>
                  </td>
                  <td className="text-muted-foreground max-w-44 min-w-28 px-3 py-2 text-xs break-words">
                    {row.strategy ?? "未分类"}
                  </td>
                  <td className="text-muted-foreground max-w-44 min-w-28 px-3 py-2 text-xs break-words">
                    {row.tradeTypeName ?? "未分类"}
                  </td>
                  <td className="text-muted-foreground px-3 py-2 text-xs whitespace-nowrap">
                    {row.segment ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {row.entryPrice > 0 ? row.entryPrice.toFixed(2) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {row.exitPrice !== null ? (
                      row.exitPrice.toFixed(2)
                    ) : (
                      <span className="text-yellow-400/70">持仓</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right text-xs tabular-nums">
                    {row.quantity}
                  </td>
                  <td className="px-3 py-2 text-right text-xs font-medium tabular-nums">
                    {row.pnl !== null ? (
                      <span
                        className={
                          row.pnl >= 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {formatPnL(row.pnl)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center text-xs whitespace-nowrap">
                    <AccuracyCell accuracy={row.entryAccuracy} />
                  </td>
                  <td className="px-3 py-2 text-center text-xs whitespace-nowrap">
                    <AccuracyCell accuracy={row.exitAccuracy} />
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    <button
                      type="button"
                      className="text-primary inline-flex items-center gap-1 rounded py-1 hover:underline"
                      aria-expanded={expandedRows.has(row.id)}
                      aria-controls={`review-${row.id}`}
                      onClick={() => toggleReview(row.id)}
                    >
                      {expandedRows.has(row.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                      {expandedRows.has(row.id) ? "收起复盘" : "查看复盘"}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(row.id) && (
                  <tr id={`review-${row.id}`} className="bg-muted/20">
                    <td colSpan={12} className="px-4 py-4">
                      <div className="grid gap-5 text-sm lg:grid-cols-3">
                        <section className="min-w-0 space-y-2">
                          <h4 className="font-medium">交易机会</h4>
                          <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                            {row.description || "未填写机会描述"}
                          </p>
                        </section>
                        <section className="min-w-0 space-y-2">
                          <h4 className="flex items-center gap-2 font-medium">
                            进入评估{" "}
                            <AccuracyCell accuracy={row.entryAccuracy} />
                          </h4>
                          <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                            {row.entryAccuracyNote || "未填写进入说明"}
                          </p>
                        </section>
                        <section className="min-w-0 space-y-2">
                          <h4 className="flex items-center gap-2 font-medium">
                            退出评估{" "}
                            <AccuracyCell accuracy={row.exitAccuracy} />
                          </h4>
                          <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                            {row.exitAccuracyNote || "未填写退出说明"}
                          </p>
                        </section>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            上一页
          </Button>
          <span className="text-muted-foreground text-xs">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
