"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface DataPoint {
  date: string
  pnl: number
  cumPnL: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const cumPnL = payload[0]?.value ?? 0
  const dailyPnL = payload[1]?.value ?? 0
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs shadow-md space-y-1">
      <p className="font-medium text-muted-foreground">{label}</p>
      <p className={cumPnL >= 0 ? "text-green-400" : "text-red-400"}>
        {`累计：${cumPnL >= 0 ? "+" : ""}$${cumPnL.toFixed(2)}`}
      </p>
      <p className={dailyPnL >= 0 ? "text-green-300" : "text-red-300"}>
        {`当日：${dailyPnL >= 0 ? "+" : ""}$${dailyPnL.toFixed(2)}`}
      </p>
    </div>
  )
}

interface Props {
  data: DataPoint[]
}

export function PnLCurveChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        暂无交易数据，执行首笔交易后显示曲线
      </div>
    )
  }

  const minPnL = Math.min(...data.map((d) => d.cumPnL))
  const maxPnL = Math.max(...data.map((d) => d.cumPnL))
  const padding = Math.max(Math.abs(maxPnL - minPnL) * 0.1, 50)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v: string) => v.slice(5)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v: number) => `$${v >= 0 ? "" : "-"}${Math.abs(v).toFixed(0)}`}
          tickLine={false}
          axisLine={false}
          domain={[minPnL - padding, maxPnL + padding]}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="pnl" stroke="transparent" dot={false} strokeWidth={0} />
        <Line
          type="monotone"
          dataKey="cumPnL"
          stroke="#22c55e"
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 4, fill: "#22c55e" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
