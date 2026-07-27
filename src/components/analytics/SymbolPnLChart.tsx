"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"

interface SymbolItem {
  symbol: string
  pnl: number
  count: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number; payload?: SymbolItem }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs shadow-md space-y-0.5">
      <p className="font-medium">{item.symbol}</p>
      <p className="text-muted-foreground">{item.count} 笔</p>
      <p className={item.pnl >= 0 ? "text-green-400" : "text-red-400"}>
        {`${item.pnl >= 0 ? "+" : ""}$${item.pnl.toFixed(2)}`}
      </p>
    </div>
  )
}

interface Props {
  data: SymbolItem[]
}

export function SymbolPnLChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        暂无数据
      </div>
    )
  }

  const chartData = [...data].sort((a, b) => b.pnl - a.pnl)

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 36)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
        <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v >= 0 ? "" : "-"}${Math.abs(v).toFixed(0)}`}
        />
        <YAxis
          type="category"
          dataKey="symbol"
          tick={{ fontSize: 11, fill: "hsl(var(--foreground))", fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
          {chartData.map((item, i) => (
            <Cell key={i} fill={item.pnl >= 0 ? "#22c55e" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
