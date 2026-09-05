"use client";

import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ComparisonResponse,
  TrendItem,
  TrendMetric,
} from "~/lib/kpi-comparison";

const colors = [
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#10b981",
  "#6366f1",
];
const fmt = (value: number | null | undefined) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(
        value,
      );
const tick = { fontSize: 11, fill: "#94a3b8" };
const unit = (metric: TrendMetric) => (metric === "completion" ? "%" : " PTS");

function TrendTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload?: TrendItem }[];
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  return (
    <div className="bg-popover border-border max-w-80 space-y-1 rounded-lg border p-3 text-xs shadow-xl">
      <p className="font-semibold">{item.label}</p>
      <p>
        {item.anchor} – {item.endDate}
      </p>
      <p>
        累计 {fmt(item.actual)} PTS · 全期完成率 {fmt(item.fullCompletion)}%
      </p>
      <p>
        基准 {fmt(item.fullBaseline)} / 乐观 {fmt(item.fullOptimistic)} PTS
      </p>
      <p>
        日均 {fmt(item.average)} PTS · 每日达标率 {fmt(item.hitRate)}%
      </p>
      <p>
        已录入 {item.recorded}/{item.expected} 个已到达交易日
      </p>
      <p>
        较上一期 {fmt(item.change.delta)} PTS / {fmt(item.change.percent)}%
      </p>
      {item.change.reason ? (
        <p className="text-amber-500">{item.change.reason}</p>
      ) : null}
      {item.unfinished ? (
        <p className="text-amber-500">本期未结束；上一期为整期</p>
      ) : null}
    </div>
  );
}

export function KpiPeriodTrendChart({
  items,
  metric,
  smoothing,
  onSelect,
}: {
  items: TrendItem[];
  metric: TrendMetric;
  smoothing: boolean;
  onSelect: (anchor: string) => void;
}) {
  const dataKey =
    metric === "actual"
      ? "actual"
      : metric === "completion"
        ? "fullCompletion"
        : "average";
  const smoothKey =
    metric === "actual"
      ? "movingActual"
      : metric === "completion"
        ? "movingCompletion"
        : "movingAverage";
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <ComposedChart
        data={items}
        margin={{ top: 20, right: 15, bottom: 12, left: 5 }}
      >
        <CartesianGrid stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis
          dataKey="anchor"
          tick={tick}
          minTickGap={24}
          tickFormatter={(v: string) => v.slice(2)}
        />
        <YAxis
          tick={tick}
          width={64}
          tickFormatter={(v: number) =>
            `${fmt(v)}${metric === "completion" ? "%" : ""}`
          }
        />
        <Tooltip content={<TrendTip />} />
        <ReferenceLine y={0} stroke="#64748b" />
        <Bar
          dataKey={dataKey}
          name={`实际${unit(metric)}`}
          fill="#8b5cf6"
          maxBarSize={36}
          radius={[3, 3, 0, 0]}
          isAnimationActive={false}
          onClick={(entry: unknown) => {
            const value = entry as { payload?: TrendItem };
            if (value.payload?.anchor) onSelect(value.payload.anchor);
          }}
          cursor="pointer"
        />
        {metric === "actual" ? (
          <>
            <Line
              dataKey="fullBaseline"
              name="全期基准目标"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="fullOptimistic"
              name="全期乐观目标"
              stroke="#10b981"
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          </>
        ) : null}
        {metric === "completion" ? (
          <ReferenceLine
            y={100}
            ifOverflow="extendDomain"
            stroke="#3b82f6"
            strokeDasharray="5 4"
            label={{ value: "基准 100%", fill: "#3b82f6", fontSize: 11 }}
          />
        ) : null}
        {smoothing ? (
          <Line
            dataKey={smoothKey}
            name="4 期移动平均"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        ) : null}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function KpiComparisonChart({
  data,
  metric,
}: {
  data: ComparisonResponse;
  metric: TrendMetric;
}) {
  const [hidden, setHidden] = useState<string[]>([]);
  const prefix = metric === "actual" ? "s" : metric;
  // Dashed curves carry missing values; solid overlays stop at unrecorded dates.
  const points = data.points.map((point, i) => {
    const result = { ...point };
    data.series.forEach((s, j) => {
      result[`solid${j}`] =
        s.days[i]?.actual != null ? (point[`${prefix}${j}`] ?? null) : null;
    });
    return result;
  });
  return (
    <div>
      <div
        className="mb-3 flex flex-wrap gap-2"
        aria-label="曲线图例，点击隐藏或显示"
      >
        {data.series.map((s, index) => (
          <button
            key={s.period.anchor}
            type="button"
            aria-pressed={!hidden.includes(s.period.anchor)}
            className={`rounded-md border px-3 py-1.5 text-xs ${hidden.includes(s.period.anchor) ? "opacity-40" : ""}`}
            onClick={() =>
              setHidden((old) =>
                old.includes(s.period.anchor)
                  ? old.filter((a) => a !== s.period.anchor)
                  : [...old, s.period.anchor],
              )
            }
          >
            <span style={{ color: colors[index] }}>━━ </span>
            {s.period.label}
            {s.period.anchor === data.baseline ? " · 基准" : ""}
          </button>
        ))}
      </div>
      <div className="h-[340px]" aria-label="各周期累计曲线，横轴为交易日序号">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={points}
            margin={{ top: 22, right: 24, bottom: 16, left: 4 }}
          >
            <CartesianGrid
              stroke="currentColor"
              opacity={0.08}
              vertical={false}
            />
            <XAxis
              dataKey="index"
              tick={tick}
              minTickGap={25}
              tickFormatter={(v: number) => `第${v}日`}
            />
            <YAxis
              width={64}
              tick={tick}
              tickFormatter={(v: number) =>
                `${fmt(v)}${metric === "completion" ? "%" : ""}`
              }
            />
            <ReferenceLine y={0} stroke="#64748b" />
            {data.mode === "aligned" && data.alignedDays > 0 ? (
              <ReferenceLine
                x={data.alignedDays}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `比较截止：第 ${data.alignedDays} 日`,
                  fontSize: 11,
                  fill: "#f59e0b",
                  position: "insideTopRight",
                }}
              />
            ) : null}
            <Tooltip
              content={({ active, label }) => {
                if (!active) return null;
                const index = Number(label) - 1;
                return (
                  <div className="bg-popover border-border max-w-96 space-y-2 rounded-lg border p-3 text-xs shadow-xl">
                    <p className="font-semibold">第 {Number(label)} 个交易日</p>
                    {data.series.map((s, j) => {
                      if (hidden.includes(s.period.anchor)) return null;
                      const day = s.days[index];
                      const base = data.series.find(
                        (v) => v.period.anchor === data.baseline,
                      )?.days[index];
                      return (
                        <div key={s.period.anchor} style={{ color: colors[j] }}>
                          <p>
                            {s.period.label} ·{" "}
                            {day?.date ?? "周期结束 / 尚未到达"}
                          </p>
                          {day ? (
                            <>
                              <p>
                                当日{" "}
                                {day.actual === null
                                  ? "未录入"
                                  : `${fmt(day.actual)} PTS`}{" "}
                                · 累计 {fmt(day.cumulative)} PTS
                              </p>
                              <p>
                                目标进度 {fmt(day.completion)}% · 日均{" "}
                                {fmt(day.average)} PTS
                              </p>
                              {base ? (
                                <p>基准当日累计 {fmt(base.cumulative)} PTS</p>
                              ) : null}
                              <p>
                                同进度较基准 {fmt(day.delta)} PTS（已录入值）
                              </p>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {data.series.flatMap((s, index) =>
              hidden.includes(s.period.anchor)
                ? []
                : [
                    <Line
                      key={`missing${s.period.anchor}`}
                      dataKey={`${prefix}${index}`}
                      name={s.period.label}
                      stroke={colors[index]}
                      strokeDasharray={`${3 + index} 4`}
                      strokeWidth={1.5}
                      connectNulls={false}
                      isAnimationActive={false}
                      dot={(props) => {
                        const point = props.payload as { index: number };
                        const day = s.days[point.index - 1];
                        return (
                          <circle
                            key={point.index}
                            cx={props.cx}
                            cy={props.cy}
                            r={
                              day?.actual === null && day.cumulative !== null
                                ? 4
                                : 0
                            }
                            fill="#f59e0b"
                            stroke="var(--background)"
                          />
                        );
                      }}
                    />,
                    <Line
                      key={`solid${s.period.anchor}`}
                      dataKey={`solid${index}`}
                      stroke={colors[index]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                      tooltipType="none"
                      connectNulls={false}
                      isAnimationActive={false}
                    />,
                  ],
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-muted-foreground text-xs">
        橙点与虚线表示未录入区段；周期结束后不延长曲线。隐藏曲线不会改变比较截止日。
      </p>
    </div>
  );
}
