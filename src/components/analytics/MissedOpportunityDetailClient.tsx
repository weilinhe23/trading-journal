"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import {
  MissedOpportunityFilters,
  type MissedFilterState,
} from "~/components/analytics/MissedOpportunityFilters";
import { MissedOpportunityTable } from "~/components/analytics/MissedOpportunityTable";
import { MissedReasonChart } from "~/components/analytics/MissedReasonChart";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type {
  DatedMnqOpportunity,
  MnqMissedAnalytics,
} from "~/lib/mnq-analytics";
import type { MissedOpportunityFilterOptions } from "~/lib/missed-opportunity-aggregator";

interface ApiData extends MnqMissedAnalytics {
  rows: DatedMnqOpportunity[];
  filterOptions: MissedOpportunityFilterOptions;
}

const EMPTY_FILTERS: MissedFilterState = {
  dateFrom: "",
  dateTo: "",
  strategy: "",
  tradeType: "",
  reason: "",
};

const EMPTY_DATA: ApiData = {
  rows: [],
  totalMissed: 0,
  categorizedCount: 0,
  evaluatedCount: 0,
  totalHypotheticalR: 0,
  breakdown: [],
  filterOptions: { strategies: [], tradeTypes: [], reasons: [] },
};

function filtersToParams(filters: MissedFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.strategy) params.set("strategy", filters.strategy);
  if (filters.tradeType) params.set("tradeType", filters.tradeType);
  if (filters.reason) params.set("reason", filters.reason);
  return params;
}

export function MissedOpportunityDetailClient() {
  const [filters, setFilters] = useState<MissedFilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<MissedFilterState>(EMPTY_FILTERS);
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchData = useCallback(async (nextFilters: MissedFilterState) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/analytics/missed?${filtersToParams(nextFilters).toString()}`,
      );
      const json = (await response.json()) as {
        success: boolean;
        data?: ApiData;
      };
      if (!response.ok || !json.success || !json.data) {
        throw new Error("查询失败");
      }
      if (currentRequest === requestId.current) {
        setData(json.data);
        setAppliedFilters(nextFilters);
      }
    } catch {
      if (currentRequest === requestId.current) {
        setError("查询失败，请重试。当前仍显示上次查询结果。");
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(EMPTY_FILTERS);
  }, [fetchData]);

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    void fetchData(EMPTY_FILTERS);
  }

  function handleExport() {
    window.open(
      `/api/analytics/missed/export?${filtersToParams(appliedFilters).toString()}`,
      "_blank",
    );
  }

  const current = data ?? EMPTY_DATA;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          数据来自 MNQ 四个行情时段中标记为“错过”的机会，机会成本统一使用 R
          衡量。
        </p>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
          onClick={handleExport}
          disabled={loading || !data}
        >
          <Download className="h-3.5 w-3.5" />
          导出 CSV
        </Button>
      </div>

      <MissedOpportunityFilters
        filters={filters}
        options={current.filterOptions}
        loading={loading}
        onChange={(patch) =>
          setFilters((previous) => ({ ...previous, ...patch }))
        }
        onSearch={() => void fetchData(filters)}
        onReset={handleReset}
      />

      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">错过次数</p>
            <p className="text-2xl font-bold text-orange-400">
              {current.totalMissed}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">已填写原因</p>
            <p className="text-2xl font-bold">{current.categorizedCount}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {current.totalMissed - current.categorizedCount} 个未分类
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">已评估机会成本</p>
            <p className="text-2xl font-bold">{current.evaluatedCount}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              已填写风险与回报
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-muted-foreground mb-1 text-xs">假设回报合计</p>
            <p className="text-2xl font-bold text-cyan-400">
              {current.evaluatedCount > 0
                ? `${current.totalHypotheticalR >= 0 ? "+" : ""}${current.totalHypotheticalR.toFixed(2)}R`
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">错过机会明细</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
              加载中...
            </div>
          ) : (
            <MissedOpportunityTable data={current.rows} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">错过原因分布</CardTitle>
        </CardHeader>
        <CardContent>
          <MissedReasonChart data={current.breakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
