"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface BreakdownItem {
  reason: string
  label: string
  count: number
  hypoPnL: number | null
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number; payload?: BreakdownItem }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  if (!item) return null
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs shadow-md space-y-1">
      <p className="font-medium">{item.label}</p>
      <p className="text-muted-foreground">{item.count} 次</p>
      {item.hypoPnL !== null && item.hypoPnL !== undefined && (
        <p className={item.hypoPnL >= 0 ? "text-green-400" : "text-red-400"}>
          {`假设盈亏：${item.hypoPnL >= 0 ? "+" : ""}$${item.hypoPnL.toFixed(2)}`}
        </p>
      )}
    </div>
  )
}

const COLORS = [
  "#f97316", "#fb923c", "#fdba74", "#fed7aa",
  "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b",
  "#d97706", "#b45309",
]

interface Props {
  data: BreakdownItem[]
}

export function MissedReasonChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        暂无错过记录
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
