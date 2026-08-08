"use client";

import type {
  TradeRecord,
  MissedRecord,
  MnqMissedRecord,
  MnqTimeframeStat,
  SegmentAccuracyRecord,
} from "./WeeklyReportClient";
import {
  MNQ_DECISION_TIMEFRAME_LABELS,
  MNQ_DECISION_TIMEFRAME_OPTIONS,
  type MnqDecisionTimeframe,
} from "~/types";

// ── Design tokens (mirrors WeeklyReportClient) ────────────────────────────────
const C = {
  bg: "oklch(0.10 0.015 240)",
  surface: "oklch(0.145 0.018 240)",
  surface2: "oklch(0.175 0.02 240)",
  border: "oklch(0.22 0.022 240)",
  borderHi: "oklch(0.32 0.035 240)",
  amber: "oklch(0.78 0.15 72)",
  green: "oklch(0.72 0.18 145)",
  red: "oklch(0.65 0.18 15)",
  blue: "oklch(0.72 0.15 240)",
  text: "oklch(0.88 0.008 240)",
  textMid: "oklch(0.62 0.012 240)",
  textDim: "oklch(0.42 0.015 240)",
} as const;

// ── Shared primitives ─────────────────────────────────────────────────────────

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "20px 22px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Sec({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 3,
          height: 14,
          background: C.amber,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: C.textMid,
          letterSpacing: "0.07em",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        color: C.textDim,
        letterSpacing: "0.05em",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div
      style={{
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 90,
      }}
    >
      <span style={{ fontSize: 10, color: C.textDim }}>{label}</span>
      <span
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: color ?? C.text,
          fontFamily: "DM Mono, monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// Horizontal bar: value / max, with label and count
function HBar({
  label,
  count,
  total,
  color,
  sublabel,
}: {
  label: string;
  count: number;
  total: number;
  color?: string;
  sublabel?: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const fill = color ?? C.amber;
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 24 }}
    >
      <span
        style={{
          fontSize: 11.5,
          color: C.textMid,
          width: 130,
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: C.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 3,
            background: fill,
            width: `${pct}%`,
            transition: "width 0.6s cubic-bezier(0.2,1,0.3,1)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: C.text,
          fontFamily: "DM Mono, monospace",
          width: 20,
          textAlign: "right",
        }}
      >
        {count}
      </span>
      {sublabel && (
        <span
          style={{
            fontSize: 10,
            color: C.textDim,
            width: 60,
            textAlign: "right",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

// R value bar (positive = green, negative = red), centered at 0
function RBar({ id, r, maxAbs }: { id: string; r: number; maxAbs: number }) {
  const pct = maxAbs > 0 ? Math.min(Math.abs(r) / maxAbs, 1) * 48 : 0;
  const color = r >= 0 ? C.green : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 22 }}>
      <span
        style={{
          fontSize: 10.5,
          color: C.textDim,
          width: 36,
          fontFamily: "DM Mono, monospace",
          flexShrink: 0,
        }}
      >
        {id}
      </span>
      {/* left side (negative) */}
      <div style={{ width: 80, display: "flex", justifyContent: "flex-end" }}>
        {r < 0 && (
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: color,
              width: `${pct * (80 / 48)}%`,
              maxWidth: 80,
              transition: "width 0.5s",
            }}
          />
        )}
      </div>
      {/* center line */}
      <div
        style={{ width: 1, height: 14, background: C.border, flexShrink: 0 }}
      />
      {/* right side (positive) */}
      <div style={{ width: 80 }}>
        {r >= 0 && (
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: color,
              width: `${pct * (80 / 48)}%`,
              maxWidth: 80,
              transition: "width 0.5s",
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: 10.5,
          color,
          fontFamily: "DM Mono, monospace",
          width: 48,
          textAlign: "right",
          fontWeight: 500,
        }}
      >
        {r >= 0 ? "+" : ""}
        {r.toFixed(2)}R
      </span>
    </div>
  );
}

// ── Aggregation helpers ───────────────────────────────────────────────────────

function calcR(t: TradeRecord): number | null {
  if (!t.plannedRiskPts || t.plannedRiskPts <= 0 || t.exitPrice === null)
    return null;
  const pts =
    t.direction === "LONG"
      ? t.exitPrice - t.entryPrice
      : t.entryPrice - t.exitPrice;
  return pts / t.plannedRiskPts;
}

type TimeframeKey = MnqDecisionTimeframe | "UNSPECIFIED";

interface TimeframeRow {
  key: TimeframeKey;
  captured: number;
  missed: number;
  pnl: number;
}

function TimeframeOpportunityAnalysis({
  timeframeStats,
}: {
  timeframeStats: MnqTimeframeStat[];
}) {
  const orderedKeys: TimeframeKey[] = [
    ...MNQ_DECISION_TIMEFRAME_OPTIONS,
    "UNSPECIFIED",
  ];
  const data = orderedKeys
    .map((key): TimeframeRow | null => {
      const timeframe = key === "UNSPECIFIED" ? null : key;
      const stat = timeframeStats.find((item) => item.timeframe === timeframe);
      return stat
        ? { key, captured: stat.captured, missed: stat.missed, pnl: stat.pnl }
        : null;
    })
    .filter((row): row is TimeframeRow => row !== null);

  if (data.length === 0) {
    return (
      <div style={{ color: C.textDim, fontSize: 12 }}>
        本周暂无 MNQ 交易机会记录
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {["决策周期", "总机会", "把握", "错失", "把握率", "已把握盈亏"].map(
              (label) => (
                <th
                  key={label}
                  style={{
                    padding: "7px 10px",
                    textAlign: "left",
                    color: C.textDim,
                    fontWeight: 500,
                    fontSize: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const total = row.captured + row.missed;
            const captureRate =
              total > 0 ? Math.round((row.captured / total) * 100) : 0;
            const timeframeLabel =
              row.key === "UNSPECIFIED"
                ? "未选择"
                : MNQ_DECISION_TIMEFRAME_LABELS[row.key];
            return (
              <tr
                key={row.key}
                style={{ borderBottom: `1px solid ${C.border}30` }}
              >
                <td
                  style={{
                    padding: "9px 10px",
                    color: row.key === "UNSPECIFIED" ? C.textDim : C.amber,
                    fontFamily: "DM Mono, monospace",
                    fontWeight: 500,
                  }}
                >
                  {timeframeLabel}
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    color: C.text,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {total}
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    color: C.green,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {row.captured}
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    color: row.missed > 0 ? C.red : C.textDim,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {row.missed}
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    color:
                      captureRate >= 60
                        ? C.green
                        : captureRate >= 40
                          ? C.amber
                          : C.red,
                    fontFamily: "DM Mono, monospace",
                    fontWeight: 500,
                  }}
                >
                  {captureRate}%
                </td>
                <td
                  style={{
                    padding: "9px 10px",
                    color:
                      row.pnl > 0 ? C.green : row.pnl < 0 ? C.red : C.textDim,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {row.pnl >= 0 ? "+" : "-"}${Math.abs(row.pnl).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Unified strategy tree (executed + missed combined) ─────────────────────

interface UnifiedSubNode {
  name: string;
  exCount: number;
  exWins: number;
  exTotalR: number;
  exRCount: number;
  exTotalPnl: number;
  misCount: number;
  misTotalR: number;
}

interface UnifiedStratNode {
  name: string;
  exCount: number;
  exWins: number;
  exTotalR: number;
  exRCount: number;
  exTotalPnl: number;
  misCount: number;
  misTotalR: number;
  subs: UnifiedSubNode[];
}

function emptyNode(name: string): UnifiedStratNode {
  return {
    name,
    exCount: 0,
    exWins: 0,
    exTotalR: 0,
    exRCount: 0,
    exTotalPnl: 0,
    misCount: 0,
    misTotalR: 0,
    subs: [],
  };
}
function emptySubNode(name: string): UnifiedSubNode {
  return {
    name,
    exCount: 0,
    exWins: 0,
    exTotalR: 0,
    exRCount: 0,
    exTotalPnl: 0,
    misCount: 0,
    misTotalR: 0,
  };
}
function getOrCreateSub(
  node: UnifiedStratNode,
  subKey: string,
): UnifiedSubNode {
  let sub = node.subs.find((s) => s.name === subKey);
  if (!sub) {
    sub = emptySubNode(subKey);
    node.subs.push(sub);
  }
  return sub;
}

function buildUnifiedStrategyTree(
  trades: TradeRecord[],
  missed: MissedRecord[],
  mnqMissed: MnqMissedRecord[],
): UnifiedStratNode[] {
  const map = new Map<string, UnifiedStratNode>();
  const get = (key: string) => {
    if (!map.has(key)) map.set(key, emptyNode(key));
    return map.get(key)!;
  };

  // ── executed trades ──
  for (const t of trades) {
    const sk = t.strategy ?? "未分类";
    const sub = t.tradeTypeName ?? "未标注子策略";
    const r = calcR(t);
    const node = get(sk);
    const subNode = getOrCreateSub(node, sub);
    for (const n of [node, subNode]) {
      n.exCount++;
      if (t.pnl !== null && t.pnl > 0) n.exWins++;
      if (t.pnl !== null) n.exTotalPnl += t.pnl;
      if (r !== null) {
        n.exTotalR += r;
        n.exRCount++;
      }
    }
  }

  // ── Setup-level missed ──
  for (const m of missed) {
    const sk = m.strategy ?? "未分类";
    const sub = m.tradeTypeName ?? "未标注子策略";
    const node = get(sk);
    const subNode = getOrCreateSub(node, sub);
    node.misCount++;
    subNode.misCount++;
    // Setup-level missed has no R info, skip misTotalR
  }

  // ── MNQ missed ──
  for (const m of mnqMissed) {
    const sk = m.strategyName ?? "未分类";
    const sub = m.tradeTypeName ?? "未标注子策略";
    const r =
      m.riskPts && m.returnPts && m.riskPts > 0 ? m.returnPts / m.riskPts : 0;
    const node = get(sk);
    const subNode = getOrCreateSub(node, sub);
    node.misCount++;
    node.misTotalR += r;
    subNode.misCount++;
    subNode.misTotalR += r;
  }

  const tree = [...map.values()].sort(
    (a, b) => b.exCount + b.misCount - (a.exCount + a.misCount),
  );
  for (const n of tree)
    n.subs.sort((a, b) => b.exCount + b.misCount - (a.exCount + a.misCount));
  return tree;
}

// ── Unified strategy table component ─────────────────────────────────────────

function UnifiedStrategyTable({
  trades,
  missed,
  mnqMissed,
}: {
  trades: TradeRecord[];
  missed: MissedRecord[];
  mnqMissed: MnqMissedRecord[];
}) {
  const tree = buildUnifiedStrategyTree(trades, missed, mnqMissed);
  if (tree.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "12px 0",
        }}
      >
        暂无数据
      </div>
    );

  function fmtPnl(v: number) {
    return `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(0)}`;
  }

  const COL_STYLE: React.CSSProperties = {
    padding: "4px 7px",
    textAlign: "left",
    color: C.textDim,
    fontWeight: 500,
    fontSize: 10,
    whiteSpace: "nowrap",
  };
  const COLS = [
    "策略 / 子策略",
    "总机会",
    "抓住率",
    "胜率",
    "均R",
    "盈亏",
    "错过",
    "错过R",
  ];

  function renderNode(
    node: UnifiedStratNode | UnifiedSubNode,
    isParent: boolean,
  ) {
    const total = node.exCount + node.misCount;
    const captureRate =
      total > 0 ? Math.round((node.exCount / total) * 100) : null;
    const winRate =
      node.exCount > 0 ? Math.round((node.exWins / node.exCount) * 100) : null;
    const avgR = node.exRCount > 0 ? node.exTotalR / node.exRCount : null;
    const captureColor =
      captureRate !== null
        ? captureRate >= 70
          ? C.green
          : captureRate >= 50
            ? C.amber
            : C.red
        : C.textDim;
    const winColor =
      winRate !== null
        ? winRate >= 60
          ? C.green
          : winRate >= 40
            ? C.amber
            : C.red
        : C.textDim;

    if (isParent) {
      const pNode = node as UnifiedStratNode;
      return (
        <>
          <tr
            key={pNode.name}
            style={{
              background: C.surface2 + "80",
              borderBottom: `1px solid ${C.border}40`,
            }}
          >
            <td
              style={{
                padding: "7px 7px",
                color: C.blue,
                fontWeight: 600,
                maxWidth: 160,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {pNode.name}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: C.text,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {total}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: captureColor,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {captureRate !== null ? `${captureRate}%` : "—"}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: winColor,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {winRate !== null ? `${winRate}%` : "—"}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color:
                  avgR !== null ? (avgR >= 0 ? C.green : C.red) : C.textDim,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {avgR !== null
                ? `${avgR >= 0 ? "+" : ""}${avgR.toFixed(2)}R`
                : "—"}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: pNode.exTotalPnl >= 0 ? C.green : C.red,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {pNode.exCount > 0 ? fmtPnl(pNode.exTotalPnl) : "—"}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: pNode.misCount > 0 ? C.red : C.textDim,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {pNode.misCount > 0 ? pNode.misCount : "—"}
            </td>
            <td
              style={{
                padding: "7px 7px",
                color: pNode.misTotalR > 0 ? C.amber : C.textDim,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
              }}
            >
              {pNode.misTotalR > 0 ? `+${pNode.misTotalR.toFixed(2)}R` : "—"}
            </td>
          </tr>
          {/* subs: show if >1 sub, or single sub name isn't the default placeholder */}
          {(pNode.subs.length > 1 ||
            (pNode.subs.length === 1 &&
              pNode.subs[0]!.name !== "未标注子策略")) &&
            pNode.subs.map((sub) => renderSubRow(sub, pNode.name))}
        </>
      );
    }
    return null;
  }

  function renderSubRow(sub: UnifiedSubNode, parentName: string) {
    const total = sub.exCount + sub.misCount;
    const captureRate =
      total > 0 ? Math.round((sub.exCount / total) * 100) : null;
    const winRate =
      sub.exCount > 0 ? Math.round((sub.exWins / sub.exCount) * 100) : null;
    const avgR = sub.exRCount > 0 ? sub.exTotalR / sub.exRCount : null;
    const captureColor =
      captureRate !== null
        ? captureRate >= 70
          ? C.green
          : captureRate >= 50
            ? C.amber
            : C.red
        : C.textDim;
    const winColor =
      winRate !== null
        ? winRate >= 60
          ? C.green
          : winRate >= 40
            ? C.amber
            : C.red
        : C.textDim;

    return (
      <tr
        key={`${parentName}::${sub.name}`}
        style={{ borderBottom: `1px solid ${C.border}20` }}
      >
        <td
          style={{
            padding: "5px 7px 5px 20px",
            color: C.textMid,
            fontSize: 11,
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: C.textDim, marginRight: 5 }}>└</span>
          {sub.name}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: C.textMid,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {total}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: captureColor,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {captureRate !== null ? `${captureRate}%` : "—"}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: winColor,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {winRate !== null ? `${winRate}%` : "—"}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: avgR !== null ? (avgR >= 0 ? C.green : C.red) : C.textDim,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {avgR !== null ? `${avgR >= 0 ? "+" : ""}${avgR.toFixed(2)}R` : "—"}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: sub.exTotalPnl >= 0 ? C.green : C.red,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {sub.exCount > 0 ? fmtPnl(sub.exTotalPnl) : "—"}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: sub.misCount > 0 ? C.red : C.textDim,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {sub.misCount > 0 ? sub.misCount : "—"}
        </td>
        <td
          style={{
            padding: "5px 7px",
            color: sub.misTotalR > 0 ? C.amber : C.textDim,
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
          }}
        >
          {sub.misTotalR > 0 ? `+${sub.misTotalR.toFixed(2)}R` : "—"}
        </td>
      </tr>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {COLS.map((h) => (
              <th key={h} style={COL_STYLE}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{tree.map((node) => renderNode(node, true))}</tbody>
      </table>
      {/* legend */}
      <div
        style={{ marginTop: 10, display: "flex", gap: 20, flexWrap: "wrap" }}
      >
        {[
          { dot: C.text, label: "总机会 = 成交 + 错过" },
          { dot: C.amber, label: "抓住率 = 成交 / 总机会" },
          { dot: C.green, label: "均R / 盈亏 仅计入已成交" },
          { dot: C.red, label: "错过R 仅 MNQ 有假设值" },
        ].map(({ dot, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: dot,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 9.5, color: C.textDim }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DirectionRow {
  label: string;
  count: number;
  wins: number;
  totalPnl: number;
}

function buildDirectionRows(trades: TradeRecord[]): DirectionRow[] {
  const long: DirectionRow = {
    label: "多 LONG",
    count: 0,
    wins: 0,
    totalPnl: 0,
  };
  const short: DirectionRow = {
    label: "空 SHORT",
    count: 0,
    wins: 0,
    totalPnl: 0,
  };
  for (const t of trades) {
    const row = t.direction === "LONG" ? long : short;
    row.count++;
    if (t.pnl !== null && t.pnl > 0) row.wins++;
    if (t.pnl !== null) row.totalPnl += t.pnl;
  }
  return [long, short];
}

interface ApproachRow {
  label: string;
  count: number;
  wins: number;
}

function buildApproachRows(trades: TradeRecord[]): ApproachRow[] {
  const direct: ApproachRow = { label: "直接进入 Direct", count: 0, wins: 0 };
  const pullback: ApproachRow = {
    label: "回调进入 Pullback",
    count: 0,
    wins: 0,
  };
  const none: ApproachRow = { label: "未标注", count: 0, wins: 0 };
  for (const t of trades) {
    const row =
      t.entryApproach === "DIRECT"
        ? direct
        : t.entryApproach === "PULLBACK"
          ? pullback
          : none;
    row.count++;
    if (t.pnl !== null && t.pnl > 0) row.wins++;
  }
  return [direct, pullback, none].filter((r) => r.count > 0);
}

type ResultKey = "PROFIT_MET" | "PROFIT_PARTIAL" | "BREAKEVEN" | "LOSS";
const RESULT_META: Record<ResultKey, { label: string; color: string }> = {
  PROFIT_MET: { label: "达目标", color: "oklch(0.72 0.18 145)" },
  PROFIT_PARTIAL: { label: "部分盈", color: "oklch(0.72 0.15 145)" },
  BREAKEVEN: { label: "保本", color: "oklch(0.62 0.012 240)" },
  LOSS: { label: "亏损", color: "oklch(0.65 0.18 15)" },
};

function buildResultDist(
  trades: TradeRecord[],
): { key: ResultKey; count: number }[] {
  const counts: Record<string, number> = {};
  for (const t of trades) {
    if (!t.tradeResult) continue;
    counts[t.tradeResult] = (counts[t.tradeResult] ?? 0) + 1;
  }
  return (Object.keys(RESULT_META) as ResultKey[])
    .map((k) => ({ key: k, count: counts[k] ?? 0 }))
    .filter((r) => r.count > 0);
}

// ── Section A: Executed trades analysis ──────────────────────────────────────

function ExecutedAnalysis({ trades }: { trades: TradeRecord[] }) {
  if (trades.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "20px 0",
        }}
      >
        本周暂无成交记录
      </div>
    );
  }

  const totalPnl = trades.reduce((s, t) => s + (t.pnl ?? 0), 0);
  const wins = trades.filter((t) => (t.pnl ?? 0) > 0).length;
  const winRate = Math.round((wins / trades.length) * 100);
  const avgPnl = totalPnl / trades.length;

  const rValues = trades
    .filter(
      (t) => t.plannedRiskPts && t.plannedRiskPts > 0 && t.exitPrice !== null,
    )
    .map((t) => {
      const pts =
        t.direction === "LONG"
          ? t.exitPrice! - t.entryPrice
          : t.entryPrice - t.exitPrice!;
      return pts / t.plannedRiskPts!;
    });
  const avgR =
    rValues.length > 0
      ? rValues.reduce((a, b) => a + b, 0) / rValues.length
      : null;

  const best = trades.reduce<TradeRecord | null>(
    (b, t) => ((t.pnl ?? -Infinity) > (b?.pnl ?? -Infinity) ? t : b),
    null,
  );
  const worst = trades.reduce<TradeRecord | null>(
    (b, t) => ((t.pnl ?? Infinity) < (b?.pnl ?? Infinity) ? t : b),
    null,
  );

  const directionRows = buildDirectionRows(trades);
  const approachRows = buildApproachRows(trades);
  const resultDist = buildResultDist(trades);
  const resultTotal = resultDist.reduce((s, r) => s + r.count, 0);

  const rChartData = trades
    .map((t) => {
      if (!t.plannedRiskPts || t.plannedRiskPts <= 0 || t.exitPrice === null)
        return null;
      const pts =
        t.direction === "LONG"
          ? t.exitPrice - t.entryPrice
          : t.entryPrice - t.exitPrice;
      return { id: t.id, r: pts / t.plannedRiskPts };
    })
    .filter((x): x is { id: string; r: number } => x !== null)
    .sort((a, b) => b.r - a.r);
  const maxAbsR =
    rChartData.length > 0
      ? Math.max(...rChartData.map((x) => Math.abs(x.r)))
      : 1;

  function fmtPnl(v: number) {
    return `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(0)}`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Overview pills */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatPill label="笔数" value={trades.length} />
        <StatPill
          label="胜率"
          value={`${winRate}%`}
          color={winRate >= 60 ? C.green : winRate >= 40 ? C.amber : C.red}
        />
        <StatPill
          label="平均盈亏"
          value={fmtPnl(avgPnl)}
          color={avgPnl >= 0 ? C.green : C.red}
        />
        {avgR !== null && (
          <StatPill
            label="平均 R"
            value={`${avgR >= 0 ? "+" : ""}${avgR.toFixed(2)}R`}
            color={avgR >= 0 ? C.green : C.red}
          />
        )}
        {best?.pnl != null && (
          <StatPill label="最佳" value={fmtPnl(best.pnl)} color={C.green} />
        )}
        {worst?.pnl != null && (
          <StatPill label="最差" value={fmtPnl(worst.pnl)} color={C.red} />
        )}
      </div>

      {/* Direction + approach + result */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Direction */}
        <div
          style={{
            background: C.surface2,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SubLabel>多 / 空方向对比</SubLabel>
          <div style={{ display: "flex", gap: 12 }}>
            {directionRows.map((row) => {
              const wr =
                row.count > 0 ? Math.round((row.wins / row.count) * 100) : 0;
              const accent = row.label.startsWith("多") ? C.green : C.red;
              return (
                <div
                  key={row.label}
                  style={{
                    flex: 1,
                    background: accent + "10",
                    border: `1px solid ${accent}33`,
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: accent,
                      fontWeight: 500,
                      marginBottom: 6,
                    }}
                  >
                    {row.label}
                  </div>
                  {[
                    { label: "笔数", val: String(row.count), color: C.text },
                    {
                      label: "胜率",
                      val: row.count > 0 ? `${wr}%` : "—",
                      color: wr >= 60 ? C.green : wr >= 40 ? C.amber : C.red,
                    },
                    {
                      label: "盈亏",
                      val: fmtPnl(row.totalPnl),
                      color: row.totalPnl >= 0 ? C.green : C.red,
                    },
                  ].map(({ label, val, color }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ color: C.textDim }}>{label}</span>
                      <span style={{ color, fontFamily: "DM Mono, monospace" }}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Approach + result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {approachRows.length > 0 && (
            <div
              style={{
                background: C.surface2,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <SubLabel>进入方式对比</SubLabel>
              {approachRows.map((row) => {
                const wr =
                  row.count > 0 ? Math.round((row.wins / row.count) * 100) : 0;
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 11.5,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: C.textMid }}>{row.label}</span>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        color: C.text,
                      }}
                    >
                      {row.count} 笔
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        color: wr >= 60 ? C.green : wr >= 40 ? C.amber : C.red,
                      }}
                    >
                      {wr}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {resultDist.length > 0 && (
            <div
              style={{
                background: C.surface2,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <SubLabel>交易结果分布</SubLabel>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {resultDist.map((r) => {
                  const meta = RESULT_META[r.key];
                  const pct = Math.round((r.count / resultTotal) * 100);
                  return (
                    <div
                      key={r.key}
                      style={{
                        flex: 1,
                        minWidth: 60,
                        background: meta.color + "15",
                        border: `1px solid ${meta.color}40`,
                        borderRadius: 7,
                        padding: "8px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: meta.color,
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {r.count}
                      </div>
                      <div
                        style={{
                          fontSize: 9.5,
                          color: meta.color,
                          marginTop: 2,
                        }}
                      >
                        {meta.label}
                      </div>
                      <div
                        style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}
                      >
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* R distribution */}
      {rChartData.length > 0 && (
        <div
          style={{
            background: C.surface2,
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <SubLabel>R 值分布（已有风险计划的交易）</SubLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {rChartData.map((x) => (
              <RBar key={x.id} id={x.id} r={x.r} maxAbs={maxAbsR} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section B: Missed opportunities analysis ──────────────────────────────────

function MissedAnalysis({
  missed,
  mnqMissed,
}: {
  missed: MissedRecord[];
  mnqMissed: MnqMissedRecord[];
}) {
  const totalMissed = missed.length + mnqMissed.length;
  if (totalMissed === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "20px 0",
        }}
      >
        本周无错过记录
      </div>
    );
  }

  // Setup-level hypo pnl
  const setupHypoPnl = missed.reduce((s, m) => s + (m.hypoPnl ?? 0), 0);

  // MNQ aggregates
  const mnqHypoRTotal = mnqMissed.reduce((s, m) => {
    if (m.riskPts && m.returnPts && m.riskPts > 0)
      return s + m.returnPts / m.riskPts;
    return s;
  }, 0);
  const mnqHypoReturnPts = mnqMissed.reduce(
    (s, m) => s + (m.returnPts ?? 0),
    0,
  );

  // Miss reason (Setup level)
  const reasonMap = new Map<string, number>();
  for (const m of missed) {
    const key = m.reason ?? "未填写";
    reasonMap.set(key, (reasonMap.get(key) ?? 0) + 1);
  }
  const reasonRows = [...reasonMap.entries()].sort((a, b) => b[1] - a[1]);
  const maxReasonCount = Math.max(...reasonRows.map((r) => r[1]), 1);

  // MNQ miss by segment
  const segMap = new Map<string, number>();
  for (const m of mnqMissed)
    segMap.set(m.segment, (segMap.get(m.segment) ?? 0) + 1);
  const segRows = [...segMap.entries()].sort((a, b) => b[1] - a[1]);
  const maxSegCount = Math.max(...segRows.map((r) => r[1]), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── Cost summary ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatPill label="错过总数" value={totalMissed} color={C.red} />
        {setupHypoPnl !== 0 && (
          <StatPill
            label="Setup 假设盈亏"
            value={`${setupHypoPnl >= 0 ? "+" : ""}$${Math.abs(setupHypoPnl).toFixed(0)}`}
            color={C.textDim}
          />
        )}
        {mnqMissed.length > 0 && (
          <>
            <StatPill
              label="MNQ 错过笔数"
              value={mnqMissed.length}
              color={C.red}
            />
            {mnqHypoReturnPts > 0 && (
              <StatPill
                label="MNQ 假设回报 pts"
                value={`+${mnqHypoReturnPts.toFixed(1)}`}
                color={C.textDim}
              />
            )}
            {mnqHypoRTotal > 0 && (
              <StatPill
                label="MNQ 假设 R 合计"
                value={`+${mnqHypoRTotal.toFixed(2)}R`}
                color={C.textDim}
              />
            )}
          </>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: missed.length > 0 ? "1fr 1fr" : "1fr",
          gap: 14,
        }}
      >
        {/* ── Setup miss reason distribution ── */}
        {missed.length > 0 && (
          <div
            style={{
              background: C.surface2,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <SubLabel>Setup 错过原因分布</SubLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reasonRows.map(([reason, count]) => (
                <HBar
                  key={reason}
                  label={reason}
                  count={count}
                  total={maxReasonCount}
                  color={C.red}
                />
              ))}
            </div>
          </div>
        )}

        {/* MNQ miss: segment only */}
        {mnqMissed.length > 0 && (
          <div
            style={{
              background: C.surface2,
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <SubLabel>MNQ 错过 — 时段分布</SubLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {segRows.map(([seg, count]) => (
                <HBar
                  key={seg}
                  label={seg}
                  count={count}
                  total={maxSegCount}
                  color={C.amber}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section C: Execution quality analysis ────────────────────────────────────

function AccuracyBar({
  label,
  correct,
  total,
  color,
}: {
  label: string;
  correct: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const barColor = pct >= 70 ? C.green : pct >= 50 ? C.amber : C.red;
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 28 }}
    >
      <span
        style={{ fontSize: 11.5, color: C.textMid, width: 64, flexShrink: 0 }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: C.border,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 3,
            background: barColor,
            width: `${pct}%`,
            transition: "width 0.6s cubic-bezier(0.2,1,0.3,1)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: barColor,
          fontFamily: "DM Mono, monospace",
          width: 36,
          textAlign: "right",
          fontWeight: 600,
        }}
      >
        {pct}%
      </span>
      <span
        style={{
          fontSize: 10,
          color: C.textDim,
          fontFamily: "DM Mono, monospace",
          width: 44,
          textAlign: "right",
        }}
      >
        {correct}/{total}
      </span>
    </div>
  );
}

function ExecutionQualityAnalysis({ trades }: { trades: TradeRecord[] }) {
  const mnqTrades = trades.filter((t) => t.id.startsWith("M"));
  const withEntry = mnqTrades.filter((t) => t.entryAccuracy !== null);
  const withExit = mnqTrades.filter((t) => t.exitAccuracy !== null);
  const entryCorrect = withEntry.filter(
    (t) => t.entryAccuracy === "CORRECT",
  ).length;
  const exitCorrect = withExit.filter(
    (t) => t.exitAccuracy === "CORRECT",
  ).length;
  const bothCorrect = mnqTrades.filter(
    (t) => t.entryAccuracy === "CORRECT" && t.exitAccuracy === "CORRECT",
  ).length;
  const bothWrong = mnqTrades.filter(
    (t) => t.entryAccuracy === "WRONG" && t.exitAccuracy === "WRONG",
  ).length;
  const assessed = mnqTrades.filter(
    (t) => t.entryAccuracy !== null || t.exitAccuracy !== null,
  ).length;

  if (assessed === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "12px 0",
        }}
      >
        本周暂无执行评估数据（在 MNQ 行情记录中标记进入/退出准确性后可见）
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* overview pills */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatPill label="已评估笔数" value={assessed} />
        {bothCorrect > 0 && (
          <StatPill label="进出双优" value={bothCorrect} color={C.green} />
        )}
        {bothWrong > 0 && (
          <StatPill label="进出双失" value={bothWrong} color={C.red} />
        )}
      </div>

      {/* accuracy bars */}
      <div
        style={{
          background: C.surface2,
          borderRadius: 10,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <SubLabel>准确率对比（MNQ 已评估交易）</SubLabel>
        {withEntry.length > 0 && (
          <AccuracyBar
            label="进入准确率"
            correct={entryCorrect}
            total={withEntry.length}
            color={C.green}
          />
        )}
        {withExit.length > 0 && (
          <AccuracyBar
            label="退出准确率"
            correct={exitCorrect}
            total={withExit.length}
            color={C.blue}
          />
        )}
      </div>

      {/* entry / exit notes list (only if any notes exist) */}
      {(() => {
        const entryNotes = trades.filter((t) => t.entryAccuracyNote);
        const exitNotes = trades.filter((t) => t.exitAccuracyNote);
        if (entryNotes.length === 0 && exitNotes.length === 0) return null;
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                entryNotes.length > 0 && exitNotes.length > 0
                  ? "1fr 1fr"
                  : "1fr",
              gap: 12,
            }}
          >
            {entryNotes.length > 0 && (
              <div
                style={{
                  background: C.surface2,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <SubLabel>进入备注</SubLabel>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {entryNotes.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9.5,
                          padding: "1px 5px",
                          borderRadius: 3,
                          flexShrink: 0,
                          marginTop: 1,
                          background:
                            t.entryAccuracy === "CORRECT"
                              ? "oklch(0.72 0.18 145 / 0.18)"
                              : "oklch(0.65 0.18 15 / 0.18)",
                          color:
                            t.entryAccuracy === "CORRECT" ? C.green : C.red,
                          fontWeight: 600,
                        }}
                      >
                        {t.id}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: C.textMid,
                          lineHeight: 1.5,
                        }}
                      >
                        {t.entryAccuracyNote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {exitNotes.length > 0 && (
              <div
                style={{
                  background: C.surface2,
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <SubLabel>退出备注</SubLabel>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {exitNotes.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9.5,
                          padding: "1px 5px",
                          borderRadius: 3,
                          flexShrink: 0,
                          marginTop: 1,
                          background:
                            t.exitAccuracy === "CORRECT"
                              ? "oklch(0.72 0.18 145 / 0.18)"
                              : "oklch(0.65 0.18 15 / 0.18)",
                          color: t.exitAccuracy === "CORRECT" ? C.green : C.red,
                          fontWeight: 600,
                        }}
                      >
                        {t.id}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: C.textMid,
                          lineHeight: 1.5,
                        }}
                      >
                        {t.exitAccuracyNote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ── Section D: Session (time-of-day) performance analysis ─────────────────────

const SEGMENT_ORDER = ["MNQ盘前", "MNQ开盘", "MNQ盘中", "MNQ午盘"];

function SessionPerformanceAnalysis({
  trades,
  segmentAccuracy,
}: {
  trades: TradeRecord[];
  segmentAccuracy: SegmentAccuracyRecord[];
}) {
  const mnqTrades = trades.filter((t) => t.segment !== null);
  if (
    mnqTrades.length === 0 &&
    segmentAccuracy.every((s) => s.totalDays === 0)
  ) {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "12px 0",
        }}
      >
        本周暂无时段数据
      </div>
    );
  }

  const accMap = new Map(segmentAccuracy.map((s) => [s.segment, s]));

  const rows = SEGMENT_ORDER.map((seg) => {
    const segTrades = mnqTrades.filter((t) => t.segment === seg);
    const wins = segTrades.filter((t) => (t.pnl ?? 0) > 0).length;
    const totalPnl = segTrades.reduce((s, t) => s + (t.pnl ?? 0), 0);
    const acc = accMap.get(seg);
    return { seg, count: segTrades.length, wins, totalPnl, acc };
  });

  const hasAnyTrades = rows.some((r) => r.count > 0);
  const hasAnyAccuracy = rows.some((r) => (r.acc?.totalDays ?? 0) > 0);
  if (!hasAnyTrades && !hasAnyAccuracy) {
    return (
      <div
        style={{
          textAlign: "center",
          color: C.textDim,
          fontSize: 12,
          padding: "12px 0",
        }}
      >
        本周暂无时段数据
      </div>
    );
  }

  const COL: React.CSSProperties = {
    padding: "6px 10px",
    fontSize: 11,
    color: C.textDim,
    fontWeight: 500,
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {[
              "时段",
              "交易笔数",
              "胜率",
              "总 PnL",
              "均 PnL",
              "行情判断准确率",
            ].map((h) => (
              <th key={h} style={COL}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ seg, count, wins, totalPnl, acc }) => {
            const winRate = count > 0 ? Math.round((wins / count) * 100) : null;
            const avgPnl = count > 0 ? totalPnl / count : null;
            const pnlColor =
              totalPnl > 0 ? C.green : totalPnl < 0 ? C.red : C.textDim;
            const accPct =
              acc && acc.totalDays > 0
                ? Math.round(
                    ((acc.correctDays + acc.partialDays * 0.5) /
                      acc.totalDays) *
                      100,
                  )
                : null;
            const accColor =
              accPct !== null
                ? accPct >= 70
                  ? C.green
                  : accPct >= 50
                    ? C.amber
                    : C.red
                : C.textDim;
            const segShort = seg.replace("MNQ", "");
            return (
              <tr
                key={seg}
                style={{ borderBottom: `1px solid ${C.border}20` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.surface2;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td
                  style={{
                    padding: "8px 10px",
                    color: C.blue,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {segShort}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "DM Mono, monospace",
                    color: count > 0 ? C.text : C.textDim,
                  }}
                >
                  {count > 0 ? count : "—"}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "DM Mono, monospace",
                    color:
                      winRate !== null
                        ? winRate >= 60
                          ? C.green
                          : winRate >= 40
                            ? C.amber
                            : C.red
                        : C.textDim,
                  }}
                >
                  {winRate !== null ? `${winRate}%` : "—"}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "DM Mono, monospace",
                    color: pnlColor,
                    fontWeight: count > 0 ? 600 : 400,
                  }}
                >
                  {count > 0
                    ? `${totalPnl >= 0 ? "+" : ""}$${Math.abs(totalPnl).toFixed(0)}`
                    : "—"}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    fontFamily: "DM Mono, monospace",
                    color:
                      avgPnl !== null
                        ? avgPnl >= 0
                          ? C.green
                          : C.red
                        : C.textDim,
                  }}
                >
                  {avgPnl !== null
                    ? `${avgPnl >= 0 ? "+" : ""}$${Math.abs(avgPnl).toFixed(0)}`
                    : "—"}
                </td>
                <td style={{ padding: "8px 10px" }}>
                  {accPct !== null ? (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 5,
                          background: C.border,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 3,
                            background: accColor,
                            width: `${accPct}%`,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: accColor,
                          fontFamily: "DM Mono, monospace",
                          fontWeight: 600,
                        }}
                      >
                        {accPct}%
                      </span>
                      <span style={{ fontSize: 10, color: C.textDim }}>
                        ({acc!.correctDays}准/{acc!.partialDays}部分/
                        {acc!.wrongDays}错)
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: C.textDim }}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  trades: TradeRecord[];
  missed: MissedRecord[];
  mnqMissed: MnqMissedRecord[];
  timeframeStats: MnqTimeframeStat[];
  segmentAccuracy: SegmentAccuracyRecord[];
}

export function WeeklyTradeAnalysis({
  trades,
  missed,
  mnqMissed,
  timeframeStats,
  segmentAccuracy,
}: Props) {
  const hasMissed = missed.length > 0 || mnqMissed.length > 0;

  return (
    <Card style={{ marginBottom: 16 }}>
      {/* ── 综合策略分析（成交 + 错过合并） ── */}
      <Sec>综合策略分析</Sec>
      <UnifiedStrategyTable
        trades={trades}
        missed={missed}
        mnqMissed={mnqMissed}
      />

      {/* ── MNQ 决策周期汇总 ── */}
      <div
        style={{ borderTop: `1px dashed ${C.border}`, margin: "22px 0 18px" }}
      />
      <Sec>MNQ 决策周期汇总</Sec>
      <TimeframeOpportunityAnalysis timeframeStats={timeframeStats} />

      {/* ── 成交交易分析 ── */}
      <div
        style={{ borderTop: `1px dashed ${C.border}`, margin: "22px 0 18px" }}
      />
      <Sec>成交交易分析</Sec>
      <ExecutedAnalysis trades={trades} />

      {/* ── 执行质量分析 ── */}
      <div
        style={{ borderTop: `1px dashed ${C.border}`, margin: "22px 0 18px" }}
      />
      <Sec>执行质量分析</Sec>
      <ExecutionQualityAnalysis trades={trades} />

      {/* ── 时段性能分析 ── */}
      <div
        style={{ borderTop: `1px dashed ${C.border}`, margin: "22px 0 18px" }}
      />
      <Sec>时段性能分析</Sec>
      <SessionPerformanceAnalysis
        trades={trades}
        segmentAccuracy={segmentAccuracy}
      />

      {/* ── 错过机会分析 ── */}
      {hasMissed && (
        <>
          <div
            style={{
              borderTop: `1px dashed ${C.border}`,
              margin: "22px 0 18px",
            }}
          />
          <Sec>错过机会分析</Sec>
          <MissedAnalysis missed={missed} mnqMissed={mnqMissed} />
        </>
      )}
    </Card>
  );
}
