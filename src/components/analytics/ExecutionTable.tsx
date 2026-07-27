"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import type { TradeRow } from "~/lib/execution-aggregator"

export type { TradeRow }

type SortKey = "date" | "symbol" | "pnl" | "quantity"
type SortDir = "asc" | "desc"

const PAGE_SIZE = 50

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onClick: (k: SortKey) => void
}) {
  const active = current === sortKey
  return (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground whitespace-nowrap"
      onClick={() => onClick(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          dir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3 opacity-30" />
        )}
      </span>
    </th>
  )
}

function ConditionCell({ row }: { row: TradeRow }) {
  if (row.source === "MNQ") {
    const acc = row.entryAccuracy
    if (acc === null) return <span className="text-muted-foreground/40">—</span>
    return (
      <span className={acc === "CORRECT" ? "text-green-400" : "text-red-400"}>
        {acc === "CORRECT" ? "✓" : "✗"}
      </span>
    )
  }
  const val = row.entryConditionMet
  if (val === null) return <span className="text-muted-foreground/40">—</span>
  return <span className={val ? "text-green-400" : "text-red-400"}>{val ? "✓" : "✗"}</span>
}

function ExitCell({ row }: { row: TradeRow }) {
  if (row.source === "MNQ") {
    const acc = row.exitAccuracy
    if (acc === null) return <span className="text-muted-foreground/40">—</span>
    return (
      <span className={acc === "CORRECT" ? "text-green-400" : "text-red-400"}>
        {acc === "CORRECT" ? "✓" : "✗"}
      </span>
    )
  }
  const val = row.exitConditionMet
  if (val === null) return <span className="text-muted-foreground/40">—</span>
  return <span className={val ? "text-green-400" : "text-red-400"}>{val ? "✓" : "✗"}</span>
}

interface Props {
  data: TradeRow[]
}

export function ExecutionTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage]       = useState(0)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
    setPage(0)
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let cmp = 0
      if (sortKey === "date")     cmp = a.date.localeCompare(b.date)
      if (sortKey === "symbol")   cmp = a.symbol.localeCompare(b.symbol)
      if (sortKey === "pnl")      cmp = (a.pnl ?? -Infinity) - (b.pnl ?? -Infinity)
      if (sortKey === "quantity") cmp = a.quantity - b.quantity
      return sortDir === "desc" ? -cmp : cmp
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData   = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        暂无成交记录
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        共 <span className="font-medium text-foreground">{data.length}</span> 笔
        {totalPages > 1 && ` · 第 ${page + 1} / ${totalPages} 页`}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">来源</th>
              <SortHeader label="日期"   sortKey="date"     current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="标的"   sortKey="symbol"   current={sortKey} dir={sortDir} onClick={handleSort} />
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">方向</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">策略</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">时段</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">入场价</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">出场价</th>
              <SortHeader label="数量"   sortKey="quantity" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortHeader label="盈亏"   sortKey="pnl"      current={sortKey} dir={sortDir} onClick={handleSort} />
              <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">入场</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">出场</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">评分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageData.map((row) => (
              <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    row.source === "MNQ"
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-muted text-muted-foreground",
                  )}>
                    {row.source === "MNQ" ? "MNQ" : "股票"}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                <td className="px-3 py-2 font-medium">{row.symbol}</td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded font-medium",
                    row.direction === "LONG"  && "bg-green-600/20 text-green-400",
                    row.direction === "SHORT" && "bg-red-600/20 text-red-400",
                  )}>
                    {row.direction === "LONG" ? "多" : "空"}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground max-w-[100px] truncate">
                  {row.strategy ?? "—"}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                  {row.segment ?? "—"}
                </td>
                <td className="px-3 py-2 text-right text-xs tabular-nums">
                  {row.entryPrice > 0 ? row.entryPrice.toFixed(2) : "—"}
                </td>
                <td className="px-3 py-2 text-right text-xs tabular-nums">
                  {row.exitPrice !== null ? row.exitPrice.toFixed(2) : (
                    <span className="text-yellow-400/70">持仓</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-xs tabular-nums">{row.quantity}</td>
                <td className="px-3 py-2 text-right text-xs font-medium tabular-nums">
                  {row.pnl !== null ? (
                    <span className={row.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                      {formatPnL(row.pnl)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center text-sm"><ConditionCell row={row} /></td>
                <td className="px-3 py-2 text-center text-sm"><ExitCell row={row} /></td>
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {row.executionGrade ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            上一页
          </Button>
          <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}
