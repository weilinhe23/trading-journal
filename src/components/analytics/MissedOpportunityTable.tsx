"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  missedReasonLabel,
  type DatedMnqOpportunity,
} from "~/lib/mnq-analytics";
import { MNQ_DECISION_TIMEFRAME_LABELS } from "~/types";

type SortKey = "date" | "plannedTargetR" | "hypotheticalR";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  align = "left",
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  align?: "left" | "right";
  onClick: (key: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      className={cn(
        "text-muted-foreground hover:text-foreground cursor-pointer px-3 py-2 text-xs font-medium whitespace-nowrap select-none",
        align === "right" ? "text-right" : "text-left",
      )}
      onClick={() => onClick(sortKey)}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "justify-end",
        )}
      >
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

function formatR(value: number | null): string {
  if (value === null) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}R`;
}

function formatPoints(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(2)} 点`;
}

function displayCategory(value: string | null): string {
  const normalized = value?.trim();
  return normalized?.length ? normalized : "未分类";
}

export function MissedOpportunityTable({
  data,
}: {
  data: DatedMnqOpportunity[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPage(0);
  }, [data]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((current) => (current === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  function toggleDetails(id: string) {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      if (sortKey === "date") comparison = a.date.localeCompare(b.date);
      if (sortKey === "plannedTargetR") {
        comparison =
          (a.plannedTargetR ?? Number.NEGATIVE_INFINITY) -
          (b.plannedTargetR ?? Number.NEGATIVE_INFINITY);
      }
      if (sortKey === "hypotheticalR") {
        comparison =
          (a.hypotheticalR ?? Number.NEGATIVE_INFINITY) -
          (b.hypotheticalR ?? Number.NEGATIVE_INFINITY);
      }
      return sortDir === "desc" ? -comparison : comparison;
    });
  }, [data, sortDir, sortKey]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        暂无符合条件的 MNQ 错过记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground text-xs">
        共 <span className="text-foreground font-medium">{data.length}</span>{" "}
        个机会
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
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium whitespace-nowrap">
                时段
              </th>
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium whitespace-nowrap">
                错过原因
              </th>
              <SortHeader
                label="计划目标"
                sortKey="plannedTargetR"
                current={sortKey}
                dir={sortDir}
                align="right"
                onClick={handleSort}
              />
              <SortHeader
                label="事后回报"
                sortKey="hypotheticalR"
                current={sortKey}
                dir={sortDir}
                align="right"
                onClick={handleSort}
              />
              <th className="text-muted-foreground px-3 py-2 text-left text-xs font-medium whitespace-nowrap">
                复盘描述
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {pageData.map((row) => {
              const reason = row.missedReasonCategory ?? "UNCLASSIFIED";
              const isExpanded = expandedRows.has(row.id);
              return (
                <Fragment key={row.id}>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="text-muted-foreground px-3 py-2 text-xs whitespace-nowrap">
                      <Link
                        href={`/journal/${row.date}?tab=intra#mnq-opportunity-${encodeURIComponent(row.opportunityId)}`}
                        title="打开这个错过机会对应的交易日志"
                        className="hover:text-foreground underline underline-offset-4"
                      >
                        {row.date}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      {row.direction ? (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-xs font-medium",
                            row.direction === "LONG"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400",
                          )}
                        >
                          {row.direction === "LONG" ? "多" : "空"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="text-muted-foreground max-w-44 min-w-28 px-3 py-2 text-xs break-words">
                      {displayCategory(row.strategy)}
                    </td>
                    <td className="text-muted-foreground max-w-44 min-w-28 px-3 py-2 text-xs break-words">
                      {displayCategory(row.tradeType)}
                    </td>
                    <td className="text-muted-foreground px-3 py-2 text-xs whitespace-nowrap">
                      {row.segment}
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {missedReasonLabel(reason)}
                    </td>
                    <td className="px-3 py-2 text-right text-xs tabular-nums">
                      {formatR(row.plannedTargetR)}
                    </td>
                    <td className="px-3 py-2 text-right text-xs font-medium tabular-nums">
                      <span
                        className={cn(
                          row.hypotheticalR !== null &&
                            row.hypotheticalR >= 0 &&
                            "text-cyan-400",
                          row.hypotheticalR !== null &&
                            row.hypotheticalR < 0 &&
                            "text-red-400",
                          row.hypotheticalR === null && "text-muted-foreground",
                        )}
                      >
                        {formatR(row.hypotheticalR)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      <button
                        type="button"
                        className="text-primary inline-flex items-center gap-1 rounded py-1 hover:underline"
                        aria-expanded={isExpanded}
                        aria-controls={`missed-review-${row.id}`}
                        onClick={() => toggleDetails(row.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {isExpanded ? "收起复盘" : "查看复盘"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr id={`missed-review-${row.id}`} className="bg-muted/20">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="grid gap-5 text-sm lg:grid-cols-3">
                          <section className="min-w-0 space-y-2">
                            <h4 className="font-medium">交易机会</h4>
                            <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                              {row.description || "未填写机会描述"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              决策周期：
                              {row.decisionTimeframe
                                ? MNQ_DECISION_TIMEFRAME_LABELS[
                                    row.decisionTimeframe
                                  ]
                                : "未填写"}
                              {" · 进入方式："}
                              {row.entryApproach === "DIRECT"
                                ? "直接进入"
                                : row.entryApproach === "PULLBACK"
                                  ? "等待回调"
                                  : "未填写"}
                            </p>
                          </section>
                          <section className="min-w-0 space-y-2">
                            <h4 className="font-medium">错过经过</h4>
                            <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                              {row.missedProcess || "未填写错过经过"}
                            </p>
                          </section>
                          <section className="min-w-0 space-y-2">
                            <h4 className="font-medium">计划与事后评估</h4>
                            <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                              <dt>计划风险</dt>
                              <dd className="text-right tabular-nums">
                                {formatPoints(row.plannedRiskPts)}
                              </dd>
                              <dt>计划目标</dt>
                              <dd className="text-right tabular-nums">
                                {formatR(row.plannedTargetR)}
                              </dd>
                              <dt>事后风险</dt>
                              <dd className="text-right tabular-nums">
                                {formatPoints(row.missedRiskPts)}
                              </dd>
                              <dt>事后回报</dt>
                              <dd className="text-right tabular-nums">
                                {formatPoints(row.missedReturnPts)}
                              </dd>
                              <dt>事后 R</dt>
                              <dd className="text-right font-medium tabular-nums">
                                {formatR(row.hypotheticalR)}
                              </dd>
                            </dl>
                          </section>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
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
            onClick={() =>
              setPage((current) => Math.min(totalPages - 1, current + 1))
            }
            disabled={page >= totalPages - 1}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
