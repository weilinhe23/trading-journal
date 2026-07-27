"use client"

import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Search, RotateCcw } from "lucide-react"
import { cn } from "~/lib/utils"

export interface FilterState {
  symbol: string
  dateFrom: string
  dateTo: string
  direction: string
  result: string
  strategy: string
  source: string
}

const DIRECTION_OPTIONS = [
  { value: "LONG",  label: "做多" },
  { value: "SHORT", label: "做空" },
]

const RESULT_OPTIONS = [
  { value: "WIN",       label: "盈利" },
  { value: "LOSS",      label: "亏损" },
  { value: "BREAKEVEN", label: "保本" },
]

const SOURCE_OPTIONS = [
  { value: "STOCK", label: "股票" },
  { value: "MNQ",   label: "MNQ期货" },
]

interface Props {
  filters: FilterState
  strategies: string[]
  loading: boolean
  onChange: (patch: Partial<FilterState>) => void
  onSearch: () => void
  onReset: () => void
}

function ToggleButton({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-xs px-2.5 py-1 rounded border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : cn("border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground", className),
      )}
    >
      {children}
    </button>
  )
}

export function ExecutionFilters({ filters, strategies, loading, onChange, onSearch, onReset }: Props) {
  const hasFilter =
    filters.symbol || filters.dateFrom || filters.dateTo ||
    filters.direction || filters.result || filters.strategy || filters.source

  function toggleSingle(field: keyof FilterState, value: string) {
    onChange({ [field]: filters[field] === value ? "" : value })
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* 标的 + 日期范围 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">标的代码</Label>
          <Input
            placeholder="TSLA / MNQ"
            value={filters.symbol}
            onChange={(e) => onChange({ symbol: e.target.value.toUpperCase() })}
            className="text-sm h-8"
            onKeyDown={(e) => { if (e.key === "Enter") onSearch() }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">起始日期</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="text-sm h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">结束日期</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="text-sm h-8"
          />
        </div>
      </div>

      <Separator />

      {/* 来源 + 方向 + 结果 + 策略 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">来源</Label>
          <div className="flex gap-1.5">
            {SOURCE_OPTIONS.map((o) => (
              <ToggleButton
                key={o.value}
                active={filters.source === o.value}
                onClick={() => toggleSingle("source", o.value)}
                className={o.value === "MNQ" ? "border-blue-800/50 text-blue-400/70 hover:border-blue-600" : ""}
              >
                {o.label}
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">方向</Label>
          <div className="flex gap-1.5">
            {DIRECTION_OPTIONS.map((o) => (
              <ToggleButton
                key={o.value}
                active={filters.direction === o.value}
                onClick={() => toggleSingle("direction", o.value)}
                className={o.value === "LONG" ? "border-green-800/50 text-green-400/70 hover:border-green-600" : "border-red-800/50 text-red-400/70 hover:border-red-600"}
              >
                {o.label}
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">结果</Label>
          <div className="flex gap-1.5">
            {RESULT_OPTIONS.map((o) => (
              <ToggleButton
                key={o.value}
                active={filters.result === o.value}
                onClick={() => toggleSingle("result", o.value)}
              >
                {o.label}
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">策略</Label>
          <div className="flex flex-wrap gap-1">
            {strategies.map((s) => (
              <ToggleButton
                key={s}
                active={filters.strategy === s}
                onClick={() => toggleSingle("strategy", s)}
                className="border-violet-800/50 text-violet-400/70 hover:border-violet-600"
              >
                {s}
              </ToggleButton>
            ))}
            {strategies.length === 0 && (
              <span className="text-xs text-muted-foreground">暂无策略</span>
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Button size="sm" className="gap-1.5" onClick={onSearch} disabled={loading}>
          <Search className="h-3.5 w-3.5" />
          {loading ? "查询中..." : "查询"}
        </Button>
        {hasFilter && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>
        )}
      </div>
    </div>
  )
}
