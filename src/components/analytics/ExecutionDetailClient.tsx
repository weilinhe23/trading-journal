"use client"

import { useState, useEffect, useCallback } from "react"
import { Download } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ExecutionFilters, type FilterState } from "./ExecutionFilters"
import { ExecutionSummaryPanel } from "./ExecutionSummaryPanel"
import { ExecutionTable } from "./ExecutionTable"
import { SymbolPnLChart } from "./SymbolPnLChart"
import { StrategyPnLChart } from "./StrategyPnLChart"
import { DailyPnLHeatmap } from "./DailyPnLHeatmap"
import { PnLCurveChart } from "./PnLCurveChart"
import type { TradeRow } from "~/lib/execution-aggregator"

interface ExecutionSummary {
  totalCount: number
  settledCount: number
  totalPnL: number
  winRate: number
  avgPnL: number
  maxWin: number
  maxLoss: number
  profitFactor: number | null
  winsCount: number
  lossesCount: number
}

interface ChartData {
  cumulative: Array<{ date: string; pnl: number; cumPnL: number }>
  bySymbol: Array<{ symbol: string; pnl: number; count: number }>
  byStrategy: Array<{ strategy: string; pnl: number; count: number; winRate: number }>
  dailyHeatmap: Array<{ date: string; pnl: number; count: number }>
}

interface ApiData {
  executions: TradeRow[]
  summary: ExecutionSummary
  charts: ChartData
}

const EMPTY_FILTERS: FilterState = {
  symbol: "", dateFrom: "", dateTo: "", direction: "", result: "", strategy: "", source: "",
}

const EMPTY_SUMMARY: ExecutionSummary = {
  totalCount: 0, settledCount: 0, totalPnL: 0, winRate: 0, avgPnL: 0,
  maxWin: 0, maxLoss: 0, profitFactor: null, winsCount: 0, lossesCount: 0,
}

function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams()
  if (f.symbol)    p.set("symbol",    f.symbol)
  if (f.dateFrom)  p.set("dateFrom",  f.dateFrom)
  if (f.dateTo)    p.set("dateTo",    f.dateTo)
  if (f.direction) p.set("direction", f.direction)
  if (f.result)    p.set("result",    f.result)
  if (f.strategy)  p.set("strategy",  f.strategy)
  if (f.source)    p.set("source",    f.source)
  return p
}

export function ExecutionDetailClient() {
  const [filters,    setFilters]    = useState<FilterState>(EMPTY_FILTERS)
  const [data,       setData]       = useState<ApiData | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [strategies, setStrategies] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/strategies")
      .then((r) => r.json() as Promise<{ success: boolean; data: Array<{ name: string; isActive: boolean }> }>)
      .then((j) => {
        if (j.success) setStrategies(j.data.filter((s) => s.isActive).map((s) => s.name))
      })
      .catch(() => undefined)
  }, [])

  const fetchData = useCallback(async (f: FilterState) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/analytics/executions?${filtersToParams(f).toString()}`)
      const json = (await res.json()) as { success: boolean; data: ApiData }
      if (json.success) setData(json.data)
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData(EMPTY_FILTERS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch() { void fetchData(filters) }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    void fetchData(EMPTY_FILTERS)
  }

  function handleExport() {
    const params = filtersToParams(filters)
    window.open(`/api/analytics/executions/export?${params.toString()}`, "_blank")
  }

  const summary    = data?.summary    ?? EMPTY_SUMMARY
  const executions = data?.executions ?? []
  const charts     = data?.charts     ?? { cumulative: [], bySymbol: [], byStrategy: [], dailyHeatmap: [] }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">汇总股票和 MNQ 期货所有已成交记录（数据来源：每日/每周周报）</p>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          导出 CSV
        </Button>
      </div>

      {/* Filters */}
      <ExecutionFilters
        filters={filters}
        strategies={strategies}
        loading={loading}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Summary cards */}
      <ExecutionSummaryPanel summary={summary} />

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">成交明细</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              加载中...
            </div>
          ) : (
            <ExecutionTable data={executions} />
          )}
        </CardContent>
      </Card>

      {/* Charts (only when settled data exists) */}
      {summary.settledCount > 0 && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">累计盈亏曲线</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <PnLCurveChart data={charts.cumulative} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">各标的盈亏</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <SymbolPnLChart data={charts.bySymbol} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">各策略盈亏</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <StrategyPnLChart data={charts.byStrategy} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">每日盈亏热力图</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DailyPnLHeatmap data={charts.dailyHeatmap} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
