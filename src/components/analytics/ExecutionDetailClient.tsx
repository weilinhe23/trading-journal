"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ExecutionFilters, type FilterState } from "./ExecutionFilters";
import { ExecutionSummaryPanel } from "./ExecutionSummaryPanel";
import { ExecutionTable } from "./ExecutionTable";
import { StrategyPnLChart } from "./StrategyPnLChart";
import { DailyPnLHeatmap } from "./DailyPnLHeatmap";
import { PnLCurveChart } from "./PnLCurveChart";
import type {
  TradeRow,
  ExecutionFilterOptions,
} from "~/lib/execution-aggregator";

interface ExecutionSummary {
  totalCount: number;
  settledCount: number;
  totalPnL: number;
  winRate: number;
  avgPnL: number;
  maxWin: number;
  maxLoss: number;
  profitFactor: number | null;
  winsCount: number;
  lossesCount: number;
}

interface ChartData {
  cumulative: Array<{ date: string; pnl: number; cumPnL: number }>;
  byStrategy: Array<{
    strategy: string;
    pnl: number;
    count: number;
    winRate: number;
  }>;
  dailyHeatmap: Array<{ date: string; pnl: number; count: number }>;
}

interface ApiData {
  executions: TradeRow[];
  summary: ExecutionSummary;
  charts: ChartData;
  filterOptions: ExecutionFilterOptions;
}

const EMPTY_FILTERS: FilterState = {
  dateFrom: "",
  dateTo: "",
  direction: "",
  result: "",
  strategy: "",
  tradeType: "",
};

const EMPTY_SUMMARY: ExecutionSummary = {
  totalCount: 0,
  settledCount: 0,
  totalPnL: 0,
  winRate: 0,
  avgPnL: 0,
  maxWin: 0,
  maxLoss: 0,
  profitFactor: null,
  winsCount: 0,
  lossesCount: 0,
};

function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.dateFrom) p.set("dateFrom", f.dateFrom);
  if (f.dateTo) p.set("dateTo", f.dateTo);
  if (f.direction) p.set("direction", f.direction);
  if (f.result) p.set("result", f.result);
  if (f.strategy) p.set("strategy", f.strategy);
  if (f.tradeType) p.set("tradeType", f.tradeType);
  return p;
}

export function ExecutionDetailClient() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(EMPTY_FILTERS);
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchData = useCallback(async (f: FilterState) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/analytics/executions?${filtersToParams(f).toString()}`,
      );
      const json = (await res.json()) as { success: boolean; data: ApiData };
      if (!res.ok || !json.success) throw new Error("查询失败");
      if (currentRequest === requestId.current) {
        setData(json.data);
        setAppliedFilters(f);
      }
    } catch {
      if (currentRequest === requestId.current)
        setError("查询失败，请重试。当前仍显示上次查询结果。");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(EMPTY_FILTERS);
  }, [fetchData]);

  function handleSearch() {
    void fetchData(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    void fetchData(EMPTY_FILTERS);
  }

  function handleExport() {
    const params = filtersToParams(appliedFilters);
    window.open(
      `/api/analytics/executions/export?${params.toString()}`,
      "_blank",
    );
  }

  const summary = data?.summary ?? EMPTY_SUMMARY;
  const executions = data?.executions ?? [];
  const charts = data?.charts ?? {
    cumulative: [],
    byStrategy: [],
    dailyHeatmap: [],
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          仅汇总每日 MNQ 行情记录中已把握的机会
        </p>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={handleExport}
          disabled={loading || !data}
        >
          <Download className="h-3.5 w-3.5" />
          导出 CSV
        </Button>
      </div>

      {/* Filters */}
      <ExecutionFilters
        filters={filters}
        options={data?.filterOptions ?? { strategies: [], tradeTypes: [] }}
        loading={loading}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}

      {/* Summary cards */}
      <ExecutionSummaryPanel summary={summary} />

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">成交明细</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
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
              <CardTitle className="text-sm font-medium">
                累计盈亏曲线
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <PnLCurveChart data={charts.cumulative} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  各策略盈亏
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <StrategyPnLChart data={charts.byStrategy} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                每日盈亏热力图
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DailyPnLHeatmap data={charts.dailyHeatmap} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
