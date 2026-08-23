"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
} from "recharts";
import type { KpiPeriod } from "~/lib/kpi";

export interface KpiChartPoint {
  period: KpiPeriod;
  label: string;
  actual: number;
  baselineTarget: number;
  optimisticTarget: number;
  baselineProgress: number;
  optimisticProgress: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: KpiChartPoint }>;
}

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 2,
});

function formatPcts(value: number): string {
  return `${numberFormatter.format(value)} PTS`;
}

function formatPercent(value: number): string {
  return `${numberFormatter.format(value)}%`;
}

function KpiChartTooltip({ active, payload }: ChartTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="border-border bg-popover min-w-52 rounded-lg border p-3 text-xs shadow-xl">
      <p className="mb-2 font-semibold">{item.label}</p>
      <p
        className={
          item.actual < 0 ? "mb-2 text-rose-400" : "text-muted-foreground mb-2"
        }
      >
        实际累计：{formatPcts(item.actual)}
      </p>
      <div className="space-y-1.5">
        <p
          className={
            item.baselineProgress < 0
              ? "flex justify-between gap-5 text-rose-400"
              : "flex justify-between gap-5 text-blue-400"
          }
        >
          <span>基准完成率</span>
          <span className="tabular-nums">
            {formatPercent(item.baselineProgress)}
          </span>
        </p>
        <p
          className={
            item.optimisticProgress < 0
              ? "flex justify-between gap-5 text-rose-400"
              : "flex justify-between gap-5 text-emerald-400"
          }
        >
          <span>乐观完成率</span>
          <span className="tabular-nums">
            {formatPercent(item.optimisticProgress)}
          </span>
        </p>
      </div>
    </div>
  );
}

function ProgressValueLabel({ viewBox, value }: LabelProps) {
  if (
    !viewBox ||
    !("x" in viewBox) ||
    !("y" in viewBox) ||
    !("width" in viewBox) ||
    !("height" in viewBox)
  )
    return null;

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;

  const x = Number(viewBox.x ?? 0);
  const y = Number(viewBox.y ?? 0);
  const width = Number(viewBox.width ?? 0);
  const height = Number(viewBox.height ?? 0);
  const negative = numericValue < 0;

  return (
    <text
      x={negative ? x - 7 : x + width + 7}
      y={y + height / 2}
      dy="0.35em"
      textAnchor={negative ? "end" : "start"}
      fill={negative ? "#f87171" : "#cbd5e1"}
      fontSize={11}
      fontWeight={600}
    >
      {formatPercent(numericValue)}
    </text>
  );
}

export function KpiProgressChart({ data }: { data: KpiChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 68, left: 28, bottom: 8 }}
      >
        <CartesianGrid
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 3"
          horizontal={false}
        />
        <XAxis
          type="number"
          tickFormatter={(value: number) => `${value}%`}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          domain={[
            (dataMin: number) =>
              dataMin < 0 ? Math.floor(dataMin / 25) * 25 : 0,
            (dataMax: number) => Math.max(100, Math.ceil(dataMax / 25) * 25),
          ]}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={68}
          tick={{ fontSize: 12, fill: "#cbd5e1" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<KpiChartTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.035)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.25} />
        <ReferenceLine x={100} stroke="#64748b" strokeDasharray="4 4" />
        <Bar
          name="基准完成率"
          dataKey="baselineProgress"
          fill="#3b82f6"
          radius={4}
          maxBarSize={14}
          minPointSize={4}
        >
          {data.map((item) => (
            <Cell
              key={`baseline-${item.period}`}
              fill={item.baselineProgress < 0 ? "#ef4444" : "#3b82f6"}
            />
          ))}
          <LabelList dataKey="baselineProgress" content={ProgressValueLabel} />
        </Bar>
        <Bar
          name="乐观完成率"
          dataKey="optimisticProgress"
          fill="#10b981"
          radius={4}
          maxBarSize={14}
          minPointSize={4}
        >
          {data.map((item) => (
            <Cell
              key={`optimistic-${item.period}`}
              fill={item.optimisticProgress < 0 ? "#ef4444" : "#10b981"}
            />
          ))}
          <LabelList
            dataKey="optimisticProgress"
            content={ProgressValueLabel}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
