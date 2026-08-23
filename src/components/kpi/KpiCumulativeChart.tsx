"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface KpiCumulativePoint {
  date: string;
  label: string;
  daily: number | null;
  cumulative: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: KpiCumulativePoint }>;
}

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 1,
});

function formatPcts(value: number): string {
  return `${numberFormatter.format(value)} PTS`;
}

function CumulativeTooltip({ active, payload }: ChartTooltipProps) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;

  return (
    <div className="border-border bg-popover min-w-48 rounded-lg border p-3 text-xs shadow-xl">
      <p className="font-semibold">{item.date}</p>
      <div className="mt-2 space-y-1.5">
        <p className="text-muted-foreground flex justify-between gap-5">
          <span>当日实现</span>
          <span className="tabular-nums">
            {item.daily === null ? "未记录" : formatPcts(item.daily)}
          </span>
        </p>
        <p className="flex justify-between gap-5 text-violet-400">
          <span>累计实现</span>
          <span className="font-medium tabular-nums">
            {formatPcts(item.cumulative)}
          </span>
        </p>
      </div>
    </div>
  );
}

export function KpiCumulativeChart({ data }: { data: KpiCumulativePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart
        data={data}
        margin={{ top: 12, right: 20, left: 4, bottom: 8 }}
      >
        <CartesianGrid
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          interval="preserveStartEnd"
          minTickGap={28}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tickFormatter={(value: number) => numberFormatter.format(value)}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          width={54}
        />
        <Tooltip
          content={<CumulativeTooltip />}
          cursor={{ stroke: "#64748b", strokeDasharray: "4 4" }}
        />
        <ReferenceLine y={0} stroke="#64748b" />
        <Line
          type="linear"
          dataKey="cumulative"
          name="累计实现 PTS"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
