"use client";

import { RotateCcw, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { MissedOpportunityFilterOptions } from "~/lib/missed-opportunity-aggregator";

export interface MissedFilterState {
  dateFrom: string;
  dateTo: string;
  strategy: string;
  tradeType: string;
  reason: string;
}

interface Props {
  filters: MissedFilterState;
  options: MissedOpportunityFilterOptions;
  loading: boolean;
  onChange: (patch: Partial<MissedFilterState>) => void;
  onSearch: () => void;
  onReset: () => void;
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function MissedOpportunityFilters({
  filters,
  options,
  loading,
  onChange,
  onSearch,
  onReset,
}: Props) {
  const hasFilter = Object.values(filters).some(Boolean);
  const tradeTypes = filters.strategy
    ? (options.strategies.find((item) => item.name === filters.strategy)
        ?.tradeTypes ?? [])
    : options.tradeTypes;

  function selectStrategy(strategy: string) {
    const nextTypes = strategy
      ? (options.strategies.find((item) => item.name === strategy)
          ?.tradeTypes ?? [])
      : options.tradeTypes;
    onChange({
      strategy,
      tradeType: nextTypes.includes(filters.tradeType) ? filters.tradeType : "",
    });
  }

  function toggleSingle(field: keyof MissedFilterState, value: string) {
    onChange({ [field]: filters[field] === value ? "" : value });
  }

  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">交易策略</legend>
        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={!filters.strategy}
            onClick={() => selectStrategy("")}
          >
            全部策略
          </ToggleButton>
          {options.strategies.map(({ name }) => (
            <ToggleButton
              key={name}
              active={filters.strategy === name}
              onClick={() =>
                selectStrategy(filters.strategy === name ? "" : name)
              }
            >
              {name}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">交易类型</legend>
        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={!filters.tradeType}
            onClick={() => onChange({ tradeType: "" })}
          >
            全部类型
          </ToggleButton>
          {tradeTypes.map((name) => (
            <ToggleButton
              key={name}
              active={filters.tradeType === name}
              onClick={() => toggleSingle("tradeType", name)}
            >
              {name}
            </ToggleButton>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          {filters.strategy
            ? "显示所选策略下已记录的交易类型。"
            : "可单独选择交易类型，也可与策略组合筛选。"}
        </p>
      </fieldset>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">错过原因</legend>
        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={!filters.reason}
            onClick={() => onChange({ reason: "" })}
          >
            全部原因
          </ToggleButton>
          {options.reasons.map((item) => (
            <ToggleButton
              key={item.value}
              active={filters.reason === item.value}
              onClick={() => toggleSingle("reason", item.value)}
            >
              {item.label}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">起始日期</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange({ dateFrom: event.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">结束日期</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange({ dateTo: event.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={onSearch}
          disabled={loading}
        >
          <Search className="h-3.5 w-3.5" />
          {loading ? "查询中..." : "查询"}
        </Button>
        {hasFilter && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>
        )}
      </div>
    </div>
  );
}
