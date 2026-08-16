"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { WeeklyTradeAnalysis } from "./WeeklyTradeAnalysis";
import type {
  WeeklyMnqCompleteness,
  WeeklyMnqCountSummary,
  WeeklyMnqDayRecord,
  WeeklyMnqMissedReasonSummary,
  WeeklyMnqMissedRecord,
  WeeklyMnqSegmentAccuracyRecord,
  WeeklyMnqStats,
  WeeklyMnqTimeframeStat,
  WeeklyMnqTradeRecord,
} from "~/lib/weekly-mnq-analysis";
import { MNQ_DECISION_TIMEFRAME_LABELS } from "~/types";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "oklch(0.10 0.015 240)",
  surface: "oklch(0.145 0.018 240)",
  surface2: "oklch(0.175 0.02 240)",
  border: "oklch(0.22 0.022 240)",
  borderHi: "oklch(0.32 0.035 240)",
  amber: "oklch(0.78 0.15 72)",
  green: "oklch(0.72 0.18 145)",
  red: "oklch(0.65 0.18 15)",
  text: "oklch(0.88 0.008 240)",
  textMid: "oklch(0.62 0.012 240)",
  textDim: "oklch(0.42 0.015 240)",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export type DayRecord = WeeklyMnqDayRecord;
export type TradeRecord = WeeklyMnqTradeRecord;
export type SegmentAccuracyRecord = WeeklyMnqSegmentAccuracyRecord;

export type MnqMissedRecord = WeeklyMnqMissedRecord;
export type MnqTimeframeStat = WeeklyMnqTimeframeStat;
export type WeeklyStats = WeeklyMnqStats;

export interface WeeklyReportData {
  summary: string | null;
  strengths: string | null;
  weaknesses: string | null;
  keyLessons: string | null;
  nextWeekPlan: string | null;
  overallRating: number | null;
}

interface Props {
  weekStart: string;
  prevWeek: string | null;
  nextWeek: string | null;
  weekNum: number;
  year: number;
  dateRange: string;
  initialReport: WeeklyReportData | null;
  stats: WeeklyStats;
  days: DayRecord[];
  trades: TradeRecord[];
  mnqMissed: MnqMissedRecord[];
  timeframeStats: MnqTimeframeStat[];
  equity: number[];
  completeness: WeeklyMnqCompleteness;
  deviationReasons: WeeklyMnqCountSummary[];
  opportunityImpacts: WeeklyMnqCountSummary[];
  impactTypes: WeeklyMnqCountSummary[];
  missedReasons: WeeklyMnqMissedReasonSummary[];
  systemScore: {
    total: number;
    dims: { label: string; score: number }[];
  } | null;
  segmentAccuracy: SegmentAccuracyRecord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPnl(v: number, compact = false): string {
  if (v === 0) return "—";
  const sign = v > 0 ? "+" : "";
  return compact
    ? `${sign}$${Math.abs(v).toFixed(0)}`
    : `${sign}$${Math.abs(v).toLocaleString()}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

// Equity curve SVG
function EquityCurve({ equity }: { equity: number[] }) {
  const W = 900,
    H = 140;
  const PAD = { t: 16, r: 24, b: 28, l: 64 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  if (equity.length < 2) {
    return (
      <div
        style={{
          height: H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.textDim,
          fontSize: 12,
        }}
      >
        暂无数据
      </div>
    );
  }

  const min = Math.min(...equity);
  const max = Math.max(...equity);
  const range = max - min || 1;
  const xScale = (i: number) => PAD.l + (i / (equity.length - 1)) * iW;
  const yScale = (v: number) => PAD.t + iH - ((v - min) / range) * iH;

  const pts = equity.map((v, i) => [xScale(i), yScale(v)] as [number, number]);
  const pathD = pts
    .map((p, i) => {
      if (i === 0) return `M${p[0]},${p[1]}`;
      const prev = pts[i - 1]!;
      const cpx = (prev[0] + p[0]) / 2;
      return `C${cpx},${prev[1]} ${cpx},${p[1]} ${p[0]},${p[1]}`;
    })
    .join(" ");
  const areaD =
    pathD +
    ` L${pts[pts.length - 1]![0]},${PAD.t + iH} L${pts[0]![0]},${PAD.t + iH} Z`;

  const baselineY = yScale(0);
  const gridVals = [
    min + range * 0.25,
    min + range * 0.5,
    min + range * 0.75,
    max,
  ].map(Math.round);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: H, display: "block" }}
    >
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridVals.map((v, i) => {
        const y = yScale(v);
        return (
          <g key={i}>
            <line
              x1={PAD.l}
              y1={y}
              x2={W - PAD.r}
              y2={y}
              stroke={C.border}
              strokeWidth="0.75"
              strokeDasharray="3 4"
            />
            <text
              x={PAD.l - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="9.5"
              fill={C.textDim}
              fontFamily="DM Mono, monospace"
            >
              {v > 0 ? "+" : ""}
              {v}
            </text>
          </g>
        );
      })}

      {baselineY >= PAD.t && baselineY <= PAD.t + iH && (
        <line
          x1={PAD.l}
          y1={baselineY}
          x2={W - PAD.r}
          y2={baselineY}
          stroke={C.textDim}
          strokeWidth="0.5"
          strokeDasharray="1 3"
        />
      )}

      <path d={areaD} fill="url(#eqGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke={C.amber}
        strokeWidth="1.75"
        filter="url(#glow)"
      />

      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={3}
          fill={C.amber}
          stroke={C.surface}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

// Day card
const REGIME_STYLES = {
  TREND: {
    bg: "oklch(0.72 0.18 145 / 0.12)",
    color: "oklch(0.72 0.18 145)",
    label: "趋势",
  },
  CHOP: {
    bg: "oklch(0.65 0.18 15 / 0.12)",
    color: "oklch(0.65 0.18 15)",
    label: "震荡",
  },
};

function DayCard({ d }: { d: DayRecord }) {
  const [hovered, setHovered] = useState(false);
  const rs = d.regime ? REGIME_STYLES[d.regime] : null;
  const pnlColor = d.pnl > 0 ? C.green : d.pnl < 0 ? C.red : C.textDim;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: C.surface,
        border: `1px solid ${hovered ? C.borderHi : C.border}`,
        borderRadius: 10,
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "border-color 0.18s",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: C.textMid,
            letterSpacing: "0.06em",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {d.dayLabel}
        </span>
        {rs ? (
          <span
            style={{
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 4,
              background: rs.bg,
              color: rs.color,
              fontWeight: 500,
            }}
          >
            {rs.label}
          </span>
        ) : (
          <span style={{ fontSize: 10, color: C.textDim }}>—</span>
        )}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: pnlColor,
          fontFamily: "DM Mono, monospace",
        }}
      >
        {fmtPnl(d.pnl)}
      </div>
      <div
        style={{
          fontSize: 11,
          color: C.amber,
          fontFamily: "DM Mono, monospace",
        }}
      >
        {d.realizedR === 0
          ? "— R"
          : `${d.realizedR > 0 ? "+" : ""}${d.realizedR.toFixed(2)}R`}
      </div>
      {(d.whatWentWell ?? d.lessonsLearned) && (
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {d.whatWentWell && (
            <div style={{ color: C.green }}>✓ {d.whatWentWell}</div>
          )}
          {d.lessonsLearned && (
            <div style={{ color: C.textDim }}>△ {d.lessonsLearned}</div>
          )}
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          color: C.textDim,
          marginTop: "auto",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {d.tradeCount === 0 ? "无交易" : `${d.tradeCount} 笔`}
        {d.missedCount > 0 && ` · 错过 ${d.missedCount}`}
        {d.pendingCount > 0 && ` · 待定 ${d.pendingCount}`}
      </div>
    </div>
  );
}

// Score ring
function ScoreRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      <svg
        viewBox="0 0 96 96"
        style={{ width: 96, height: 96, transform: "rotate(-90deg)" }}
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={C.border}
          strokeWidth="8"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={C.amber}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.8s cubic-bezier(0.2,1,0.3,1)",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: C.amber,
            lineHeight: 1,
            fontFamily: "DM Mono, monospace",
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: 9, color: C.textDim }}>/ 100</span>
      </div>
    </div>
  );
}

// Score bar
function ScoreBar({ label, score }: { label: string; score: number }) {
  const [animated, setAnimated] = useState(false);
  const color = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 12,
          color: C.textMid,
          width: 72,
          flexShrink: 0,
          textAlign: "right",
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
            background: color,
            width: animated ? `${score}%` : "0%",
            transition: "width 0.8s cubic-bezier(0.2,1,0.3,1)",
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color,
          width: 28,
          textAlign: "right",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {score}
      </span>
    </div>
  );
}

// Rating stars (1-5)
function RatingStars({ v }: { v: number | null }) {
  if (v === null)
    return <span style={{ color: C.textDim, fontSize: 10 }}>—</span>;
  const filled = Math.max(0, Math.min(5, v));
  return (
    <span style={{ color: C.amber, fontSize: 10, letterSpacing: 0.5 }}>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}

// Inline editable textarea (used directly in content cards)
function InlineField({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        color: C.text,
        fontSize: 12.5,
        lineHeight: 1.7,
        resize: "vertical",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.borderHi;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border;
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function WeeklyReportClient({
  weekStart,
  prevWeek,
  nextWeek,
  weekNum,
  year,
  dateRange,
  initialReport,
  stats,
  days,
  trades,
  mnqMissed,
  timeframeStats,
  equity,
  completeness,
  deviationReasons,
  opportunityImpacts,
  impactTypes,
  missedReasons,
  systemScore,
  segmentAccuracy,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);
  const [form, setForm] = useState({
    summary: initialReport?.summary ?? "",
    strengths: initialReport?.strengths ?? "",
    weaknesses: initialReport?.weaknesses ?? "",
    keyLessons: initialReport?.keyLessons ?? "",
    nextWeekPlan: initialReport?.nextWeekPlan ?? "",
  });

  const set = useCallback(<K extends keyof typeof form>(k: K, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/weekly-reports/${weekStart}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: form.summary || undefined,
          strengths: form.strengths || undefined,
          weaknesses: form.weaknesses || undefined,
          keyLessons: form.keyLessons || undefined,
          nextWeekPlan: form.nextWeekPlan || undefined,
        }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } else {
        toast.error(json.error ?? "保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setSaving(false);
    }
  }

  const winRate = stats.winRate === null ? null : Math.round(stats.winRate);

  const TD: React.CSSProperties = {
    padding: "11px 10px",
    borderBottom: `1px solid ${C.border}`,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, margin: "0 -16px" }}>
      {/* ── sticky top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 56,
          zIndex: 40,
          background: "oklch(0.10 0.015 240 / 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                fontSize: 11,
                color: C.amber,
                letterSpacing: "0.1em",
                fontWeight: 500,
                fontFamily: "DM Mono, monospace",
              }}
            >
              MNQ WEEKLY REPORT
            </span>
            <span
              style={{
                width: 1,
                height: 14,
                background: C.border,
                display: "block",
              }}
            />
            <span style={{ fontSize: 13, color: C.textMid }}>
              {year} · W{weekNum}
              <span
                style={{
                  color: C.textDim,
                  marginLeft: 10,
                  fontSize: 11,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {dateRange}
              </span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: stats.totalPnL >= 0 ? C.green : C.red,
                  boxShadow: `0 0 6px ${stats.totalPnL >= 0 ? C.green : C.red}`,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: stats.totalPnL >= 0 ? C.green : C.red,
                  fontWeight: 500,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {fmtPnl(stats.totalPnL)}
              </span>
            </div>
            <span
              style={{
                width: 1,
                height: 14,
                background: C.border,
                display: "block",
              }}
            />
            {/* save button */}
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "0 12px",
                height: 28,
                borderRadius: 6,
                border: `1px solid ${saved ? C.green : C.border}`,
                background: saved ? `${C.green}18` : "none",
                color: saved ? C.green : C.textMid,
                fontSize: 12,
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={13} />
              {saving ? "保存中..." : saved ? "已保存" : "保存周报"}
            </button>
            {/* nav */}
            <div style={{ display: "flex", gap: 6 }}>
              <NavBtn
                onClick={() => prevWeek && router.push(`/weekly/${prevWeek}`)}
                disabled={!prevWeek}
              >
                ‹
              </NavBtn>
              <NavBtn
                onClick={() => nextWeek && router.push(`/weekly/${nextWeek}`)}
                disabled={!nextWeek}
              >
                ›
              </NavBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── body ── */}
      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px 80px" }}
      >
        {/* hero: equity + metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* equity curve card */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <Sec>权益曲线</Sec>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: stats.totalPnL >= 0 ? C.green : C.red,
                    lineHeight: 1,
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {fmtPnl(stats.totalPnL)}
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>
                  本周累计 · {dateRange}
                </div>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color:
                        winRate !== null && winRate >= 50 ? C.green : C.textMid,
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {winRate !== null ? `${winRate}%` : "—"}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
                    胜率
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: stats.missedCount > 0 ? C.red : C.textDim,
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {stats.missedCount}
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
                    错过机会
                  </div>
                </div>
              </div>
            </div>
            <EquityCurve equity={equity} />
          </Card>

          {/* key metric cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "把握机会",
                value: stats.executedCount,
              },
              {
                label: "胜率",
                value: winRate !== null ? `${winRate}%` : "—",
                color: winRate !== null && winRate >= 60 ? C.green : C.textMid,
              },
              {
                label: "盈 / 亏 / 平",
                value: `${stats.winCount} / ${stats.lossCount} / ${stats.breakevenCount}`,
              },
              {
                label: "错过机会",
                value: stats.missedCount,
                color: stats.missedCount > 0 ? C.red : C.textDim,
              },
              ...(systemScore
                ? [
                    {
                      label: "系统评分",
                      value: `${systemScore.total}`,
                      color:
                        systemScore.total >= 80
                          ? C.green
                          : systemScore.total >= 60
                            ? C.amber
                            : C.red,
                    },
                  ]
                : []),
            ].map((m) => {
              const inner = (
                <div
                  key={m.label}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                    transition: "border-color 0.18s",
                  }}
                >
                  <span style={{ fontSize: 11.5, color: C.textDim }}>
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: m.color ?? C.text,
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {String(m.value)}
                  </span>
                </div>
              );
              return inner;
            })}
          </div>
        </div>

        {/* MNQ opportunity and data quality summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Card>
            <Sec>MNQ 机会质量</Sec>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              {[
                {
                  label: "实际总 R",
                  value:
                    stats.realizedRCount > 0
                      ? `${stats.totalRealizedR >= 0 ? "+" : ""}${stats.totalRealizedR.toFixed(2)}R`
                      : "—",
                  color: stats.totalRealizedR >= 0 ? C.green : C.red,
                },
                {
                  label: "平均 R",
                  value:
                    stats.averageRealizedR === null
                      ? "—"
                      : `${stats.averageRealizedR >= 0 ? "+" : ""}${stats.averageRealizedR.toFixed(2)}R`,
                  color:
                    stats.averageRealizedR !== null &&
                    stats.averageRealizedR >= 0
                      ? C.green
                      : C.red,
                },
                {
                  label: "机会把握率",
                  value:
                    stats.captureRate === null
                      ? "—"
                      : `${Math.round(stats.captureRate)}%`,
                  color:
                    stats.captureRate !== null && stats.captureRate >= 60
                      ? C.green
                      : C.amber,
                },
                {
                  label: "错失潜在 R",
                  value:
                    stats.missedEvaluatedCount > 0
                      ? `+${stats.missedPotentialR.toFixed(2)}R`
                      : "—",
                  color: C.amber,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    background: C.surface2,
                    borderRadius: 8,
                    padding: "11px 12px",
                  }}
                >
                  <div style={{ fontSize: 10, color: C.textDim }}>
                    {metric.label}
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 17,
                      fontWeight: 600,
                      color: metric.color,
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Sec>数据完整度</Sec>
              <span
                style={{
                  fontSize: 18,
                  color:
                    completeness.score === null
                      ? C.textDim
                      : completeness.score >= 80
                        ? C.green
                        : completeness.score >= 60
                          ? C.amber
                          : C.red,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {completeness.score === null ? "—" : `${completeness.score}%`}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                [
                  "已记录交易日",
                  completeness.recordedDays,
                  completeness.availableDays,
                ],
                [
                  "机会状态",
                  completeness.decidedOpportunities,
                  completeness.totalOpportunities,
                ],
                [
                  "成交实际 R",
                  completeness.realizedRTrades,
                  completeness.capturedTrades,
                ],
                [
                  "错失假设 R",
                  completeness.missedREvaluated,
                  completeness.missedTrades,
                ],
                [
                  "行情判断评估",
                  completeness.evaluatedMarketSegments,
                  completeness.recordedMarketSegments,
                ],
              ].map(([label, value, total]) => (
                <div
                  key={String(label)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: C.textDim }}>{label}</span>
                  <span
                    style={{ color: C.text, fontFamily: "DM Mono, monospace" }}
                  >
                    {String(value)} / {String(total)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* day strip */}
        {days.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {days.map((d) => (
              <DayCard key={d.date} d={d} />
            ))}
          </div>
        )}

        {/* trade log */}
        {(trades.length > 0 || mnqMissed.length > 0) && (
          <Card style={{ marginBottom: 16 }}>
            <Sec>逐笔交易记录</Sec>
            {trades.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {[
                        "编号",
                        "时间",
                        "方向",
                        "入场 / 出场",
                        "止损 / 目标",
                        "盈亏 / 点数",
                        "风险 / R",
                        "MAE / MFE",
                        "结果",
                        "策略",
                        "子策略",
                        "进入方式",
                        "决策周期",
                        "执行评估",
                        "备注",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 10px",
                            textAlign: "left",
                            color: C.textDim,
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            fontSize: 10,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t, i) => {
                      const isExpanded = expandedTradeId === t.id;
                      const hasAccuracyNote = !!(
                        t.entryAccuracyNote ??
                        t.exitAccuracyNote ??
                        t.tradeResultNote
                      );
                      const pnlColor =
                        t.pnl !== null
                          ? t.pnl > 0
                            ? C.green
                            : t.pnl < 0
                              ? C.red
                              : C.textDim
                          : C.textDim;
                      const isLast = i === trades.length - 1;
                      const tdStyle: React.CSSProperties = {
                        ...TD,
                        borderBottomColor:
                          isLast && !isExpanded ? "transparent" : C.border,
                        verticalAlign: "top",
                      };
                      const entryN = t.entryPrice;
                      const exitN = t.exitPrice;
                      let pnlPts: number | null = null;
                      let rMultiple: number | null = null;
                      if (exitN !== null && entryN > 0) {
                        pnlPts =
                          t.direction === "LONG"
                            ? exitN - entryN
                            : entryN - exitN;
                        if (t.plannedRiskPts && t.plannedRiskPts > 0) {
                          rMultiple = pnlPts / t.plannedRiskPts;
                        }
                      }
                      const resultLabel: Record<
                        string,
                        { text: string; color: string }
                      > = {
                        PROFIT_MET: { text: "达目标", color: C.green },
                        PROFIT_PARTIAL: {
                          text: "部分盈",
                          color: "oklch(0.68 0.15 145)",
                        },
                        BREAKEVEN: { text: "保本", color: C.textDim },
                        LOSS: { text: "亏损", color: C.red },
                      };
                      const result = t.tradeResult
                        ? (resultLabel[t.tradeResult] ?? null)
                        : null;
                      // 执行评估徽章
                      function AccBadge({
                        acc,
                      }: {
                        acc: "CORRECT" | "WRONG" | null;
                      }) {
                        if (acc === null)
                          return (
                            <span style={{ color: C.textDim, fontSize: 10 }}>
                              —
                            </span>
                          );
                        return (
                          <span
                            style={{
                              fontSize: 9.5,
                              padding: "1px 5px",
                              borderRadius: 3,
                              fontWeight: 600,
                              background:
                                acc === "CORRECT"
                                  ? "oklch(0.72 0.18 145 / 0.18)"
                                  : "oklch(0.65 0.18 15 / 0.18)",
                              color: acc === "CORRECT" ? C.green : C.red,
                            }}
                          >
                            {acc === "CORRECT" ? "✓" : "✗"}
                          </span>
                        );
                      }
                      const hasAnyAccuracy =
                        t.entryAccuracy !== null || t.exitAccuracy !== null;
                      return (
                        <React.Fragment key={t.id}>
                          <tr
                            style={{
                              transition: "background 0.15s",
                              cursor:
                                hasAccuracyNote || hasAnyAccuracy
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() => {
                              if (hasAccuracyNote || hasAnyAccuracy) {
                                setExpandedTradeId(isExpanded ? null : t.id);
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = C.surface2;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {/* 编号 */}
                            <td
                              style={{
                                ...tdStyle,
                                color: C.textDim,
                                fontSize: 10.5,
                                fontFamily: "DM Mono, monospace",
                              }}
                            >
                              <span>{t.id}</span>
                              {(hasAccuracyNote || hasAnyAccuracy) && (
                                <span
                                  style={{
                                    marginLeft: 3,
                                    fontSize: 9,
                                    color: isExpanded ? C.amber : C.textDim,
                                  }}
                                >
                                  {isExpanded ? "▲" : "▼"}
                                </span>
                              )}
                            </td>
                            {/* 时间 */}
                            <td
                              style={{
                                ...tdStyle,
                                color: C.textMid,
                                fontFamily: "DM Mono, monospace",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <div>{t.day}</div>
                              <div style={{ fontSize: 10, color: C.textDim }}>
                                {t.time}
                              </div>
                            </td>
                            {/* 方向 */}
                            <td
                              style={{
                                ...tdStyle,
                                color: t.direction === "LONG" ? C.green : C.red,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.direction === "LONG" ? "↑ 多" : "↓ 空"}
                              {t.heldOvernight && (
                                <span
                                  title={t.overnightReason ?? "持仓过夜"}
                                  style={{
                                    marginLeft: 4,
                                    fontSize: 10,
                                    color: "oklch(0.72 0.15 280)",
                                    cursor: "default",
                                  }}
                                >
                                  🌙
                                </span>
                              )}
                            </td>
                            {/* 入场 / 出场 */}
                            <td
                              style={{
                                ...tdStyle,
                                fontFamily: "DM Mono, monospace",
                                fontSize: 11,
                              }}
                            >
                              <div style={{ color: C.green }}>
                                ↗ {entryN.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  color: exitN !== null ? C.red : C.textDim,
                                }}
                              >
                                {exitN !== null
                                  ? `↙ ${exitN.toLocaleString()}`
                                  : "—"}
                              </div>
                            </td>
                            {/* 止损 / 目标 */}
                            <td
                              style={{
                                ...tdStyle,
                                fontFamily: "DM Mono, monospace",
                                fontSize: 11,
                              }}
                            >
                              <div style={{ color: C.red }}>
                                {t.stopPrice != null
                                  ? `✕ ${t.stopPrice.toLocaleString()}`
                                  : "—"}
                              </div>
                              <div style={{ color: C.green }}>
                                {t.targetPrice != null
                                  ? `✓ ${t.targetPrice.toLocaleString()}`
                                  : "—"}
                              </div>
                            </td>
                            {/* 盈亏 / 点数 */}
                            <td style={{ ...tdStyle }}>
                              <div
                                style={{
                                  color: pnlColor,
                                  fontWeight: 600,
                                  fontSize: 13,
                                  fontFamily: "DM Mono, monospace",
                                  textShadow:
                                    t.pnl !== null && Math.abs(t.pnl) > 500
                                      ? `0 0 10px ${pnlColor}88`
                                      : "none",
                                }}
                              >
                                {t.pnl !== null ? fmtPnl(t.pnl, true) : "—"}
                              </div>
                              {pnlPts !== null && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: pnlColor,
                                    fontFamily: "DM Mono, monospace",
                                  }}
                                >
                                  {pnlPts >= 0 ? "+" : ""}
                                  {pnlPts.toFixed(2)} pts
                                </div>
                              )}
                            </td>
                            {/* 风险 / R */}
                            <td
                              style={{
                                ...tdStyle,
                                fontFamily: "DM Mono, monospace",
                                fontSize: 11,
                              }}
                            >
                              <div style={{ color: C.textMid }}>
                                {t.plannedRiskPts != null
                                  ? `${t.plannedRiskPts} pts`
                                  : "—"}
                              </div>
                              {rMultiple !== null && (
                                <div
                                  style={{
                                    color: rMultiple >= 0 ? C.green : C.red,
                                    fontWeight: 500,
                                  }}
                                >
                                  {rMultiple >= 0 ? "+" : ""}
                                  {rMultiple.toFixed(2)}R
                                </div>
                              )}
                            </td>
                            {/* MAE / MFE */}
                            <td
                              style={{
                                ...tdStyle,
                                fontFamily: "DM Mono, monospace",
                                fontSize: 11,
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    t.maxDrawdownPts != null
                                      ? C.red
                                      : C.textDim,
                                }}
                              >
                                {t.maxDrawdownPts != null
                                  ? `-${t.maxDrawdownPts} pts`
                                  : "—"}
                              </div>
                              <div
                                style={{
                                  color:
                                    t.maxFavorablePts != null
                                      ? C.green
                                      : C.textDim,
                                }}
                              >
                                {t.maxFavorablePts != null
                                  ? `+${t.maxFavorablePts} pts`
                                  : "—"}
                              </div>
                            </td>
                            {/* 结果 */}
                            <td style={{ ...tdStyle }}>
                              {result ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    background: result.color + "22",
                                    color: result.color,
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {result.text}
                                </span>
                              ) : (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            {/* 策略 */}
                            <td
                              style={{
                                ...tdStyle,
                                fontSize: 11,
                                color: "oklch(0.72 0.15 240)",
                                maxWidth: 140,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.strategy ?? (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            {/* 子策略 */}
                            <td
                              style={{
                                ...tdStyle,
                                fontSize: 11,
                                color: C.textDim,
                                maxWidth: 140,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.tradeTypeName ?? "—"}
                            </td>
                            {/* 进入方式 */}
                            <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                              {t.entryApproach ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    background:
                                      t.entryApproach === "DIRECT"
                                        ? "oklch(0.72 0.18 145 / 0.15)"
                                        : "oklch(0.78 0.15 72 / 0.15)",
                                    color:
                                      t.entryApproach === "DIRECT"
                                        ? C.green
                                        : C.amber,
                                    fontWeight: 500,
                                  }}
                                >
                                  {t.entryApproach === "DIRECT"
                                    ? "直接"
                                    : "回调"}
                                </span>
                              ) : (
                                <span
                                  style={{ color: C.textDim, fontSize: 11 }}
                                >
                                  —
                                </span>
                              )}
                            </td>
                            {/* 决策周期 */}
                            <td
                              style={{
                                ...tdStyle,
                                color: C.textMid,
                                fontFamily: "DM Mono, monospace",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.decisionTimeframe
                                ? MNQ_DECISION_TIMEFRAME_LABELS[
                                    t.decisionTimeframe
                                  ]
                                : "—"}
                            </td>
                            {/* 执行评估 */}
                            <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 9.5,
                                      color: C.textDim,
                                      width: 14,
                                    }}
                                  >
                                    进
                                  </span>
                                  <AccBadge acc={t.entryAccuracy} />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 9.5,
                                      color: C.textDim,
                                      width: 14,
                                    }}
                                  >
                                    出
                                  </span>
                                  <AccBadge acc={t.exitAccuracy} />
                                </div>
                              </div>
                            </td>
                            {/* 备注 */}
                            <td
                              style={{
                                ...tdStyle,
                                fontSize: 11,
                                color: C.textDim,
                                maxWidth: 180,
                              }}
                            >
                              {[
                                t.notes,
                                t.heldOvernight
                                  ? "📌" +
                                    (t.overnightReason
                                      ? `：${t.overnightReason}`
                                      : "持仓过夜")
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(" · ") || ""}
                            </td>
                          </tr>
                          {/* 展开详情行 */}
                          {isExpanded && (
                            <tr
                              key={`${t.id}-detail`}
                              style={{ background: C.surface2 + "60" }}
                            >
                              <td
                                colSpan={14}
                                style={{
                                  padding: "10px 14px 12px 32px",
                                  borderBottom: `1px solid ${C.border}`,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 7,
                                  }}
                                >
                                  {t.entryAccuracy !== null && (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: C.textDim,
                                          minWidth: 56,
                                          paddingTop: 1,
                                        }}
                                      >
                                        进入评估
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 9.5,
                                          padding: "1px 6px",
                                          borderRadius: 3,
                                          fontWeight: 600,
                                          flexShrink: 0,
                                          background:
                                            t.entryAccuracy === "CORRECT"
                                              ? "oklch(0.72 0.18 145 / 0.18)"
                                              : "oklch(0.65 0.18 15 / 0.18)",
                                          color:
                                            t.entryAccuracy === "CORRECT"
                                              ? C.green
                                              : C.red,
                                        }}
                                      >
                                        {t.entryAccuracy === "CORRECT"
                                          ? "准确"
                                          : "有误"}
                                      </span>
                                      {t.entryAccuracyNote && (
                                        <span
                                          style={{
                                            fontSize: 11,
                                            color: C.textMid,
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {t.entryAccuracyNote}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {t.exitAccuracy !== null && (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: C.textDim,
                                          minWidth: 56,
                                          paddingTop: 1,
                                        }}
                                      >
                                        退出评估
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 9.5,
                                          padding: "1px 6px",
                                          borderRadius: 3,
                                          fontWeight: 600,
                                          flexShrink: 0,
                                          background:
                                            t.exitAccuracy === "CORRECT"
                                              ? "oklch(0.72 0.18 145 / 0.18)"
                                              : "oklch(0.65 0.18 15 / 0.18)",
                                          color:
                                            t.exitAccuracy === "CORRECT"
                                              ? C.green
                                              : C.red,
                                        }}
                                      >
                                        {t.exitAccuracy === "CORRECT"
                                          ? "准确"
                                          : "有误"}
                                      </span>
                                      {t.exitAccuracyNote && (
                                        <span
                                          style={{
                                            fontSize: 11,
                                            color: C.textMid,
                                            lineHeight: 1.5,
                                          }}
                                        >
                                          {t.exitAccuracyNote}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {t.tradeResultNote && (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: C.textDim,
                                          minWidth: 56,
                                          paddingTop: 1,
                                        }}
                                      >
                                        交易说明
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 11,
                                          color: C.textMid,
                                          lineHeight: 1.5,
                                        }}
                                      >
                                        {t.tradeResultNote}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* MNQ missed opportunities table */}
            {mnqMissed.length > 0 && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px dashed ${C.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    color: C.textDim,
                    letterSpacing: "0.05em",
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  错过的 MNQ 机会（{mnqMissed.length} 笔）
                </span>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 11.5,
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {[
                          "编号",
                          "时间 / 时段",
                          "方向",
                          "策略",
                          "子策略",
                          "进入方式",
                          "决策周期",
                          "机会描述",
                          "错过原因",
                          "错过经过",
                          "假设风险",
                          "假设回报",
                          "假设R",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "7px 10px",
                              textAlign: "left",
                              color: C.textDim,
                              fontWeight: 500,
                              fontSize: 10,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mnqMissed.map((m) => {
                        const r =
                          m.riskPts !== null &&
                          m.returnPts !== null &&
                          m.riskPts > 0
                            ? m.returnPts / m.riskPts
                            : null;
                        return (
                          <tr
                            key={m.id}
                            style={{
                              borderBottom: `1px solid ${C.border}30`,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = C.surface2;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <td
                              style={{
                                padding: "9px 10px",
                                color: C.textDim,
                                fontSize: 10.5,
                                fontFamily: "DM Mono, monospace",
                                verticalAlign: "top",
                              }}
                            >
                              {m.id}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                verticalAlign: "top",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <div
                                style={{
                                  color: C.textMid,
                                  fontFamily: "DM Mono, monospace",
                                }}
                              >
                                {m.day}
                              </div>
                              <div style={{ fontSize: 10, color: C.textDim }}>
                                {m.segment}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                verticalAlign: "top",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.tradeDirection ? (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color:
                                      m.tradeDirection === "LONG"
                                        ? C.green
                                        : C.red,
                                  }}
                                >
                                  {m.tradeDirection === "LONG"
                                    ? "↑ 多"
                                    : "↓ 空"}
                                </span>
                              ) : (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                verticalAlign: "top",
                                maxWidth: 140,
                              }}
                            >
                              {m.strategyName ? (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "oklch(0.72 0.15 240)",
                                  }}
                                >
                                  {m.strategyName}
                                </span>
                              ) : (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                verticalAlign: "top",
                                maxWidth: 140,
                              }}
                            >
                              {m.tradeTypeName ? (
                                <span
                                  style={{ fontSize: 11, color: C.textDim }}
                                >
                                  {m.tradeTypeName}
                                </span>
                              ) : (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                verticalAlign: "top",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.entryApproach ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    background:
                                      m.entryApproach === "DIRECT"
                                        ? "oklch(0.72 0.18 145 / 0.15)"
                                        : "oklch(0.78 0.15 72 / 0.15)",
                                    color:
                                      m.entryApproach === "DIRECT"
                                        ? C.green
                                        : C.amber,
                                    fontWeight: 500,
                                  }}
                                >
                                  {m.entryApproach === "DIRECT"
                                    ? "直接"
                                    : "回调"}
                                </span>
                              ) : (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color: C.textMid,
                                fontFamily: "DM Mono, monospace",
                                verticalAlign: "top",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {m.decisionTimeframe
                                ? MNQ_DECISION_TIMEFRAME_LABELS[
                                    m.decisionTimeframe
                                  ]
                                : "—"}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color: C.text,
                                maxWidth: 220,
                                verticalAlign: "top",
                              }}
                            >
                              {m.description || (
                                <span style={{ color: C.textDim }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color: C.amber,
                                maxWidth: 140,
                                verticalAlign: "top",
                              }}
                            >
                              {m.reason}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color: C.textDim,
                                maxWidth: 200,
                                verticalAlign: "top",
                                lineHeight: 1.5,
                              }}
                            >
                              {m.missedProcess || "—"}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color: m.riskPts !== null ? C.red : C.textDim,
                                fontFamily: "DM Mono, monospace",
                                verticalAlign: "top",
                              }}
                            >
                              {m.riskPts !== null ? `${m.riskPts} pts` : "—"}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                color:
                                  m.returnPts !== null ? C.green : C.textDim,
                                fontFamily: "DM Mono, monospace",
                                verticalAlign: "top",
                              }}
                            >
                              {m.returnPts !== null
                                ? `${m.returnPts} pts`
                                : "—"}
                            </td>
                            <td
                              style={{
                                padding: "9px 10px",
                                fontFamily: "DM Mono, monospace",
                                fontWeight: 600,
                                verticalAlign: "top",
                                color: r !== null ? C.amber : C.textDim,
                              }}
                            >
                              {r !== null ? `${r.toFixed(2)} R` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* trade analysis module */}
        {(trades.length > 0 || mnqMissed.length > 0) && (
          <WeeklyTradeAnalysis
            trades={trades}
            mnqMissed={mnqMissed}
            timeframeStats={timeframeStats}
            segmentAccuracy={segmentAccuracy}
          />
        )}

        {(deviationReasons.length > 0 ||
          opportunityImpacts.length > 0 ||
          impactTypes.length > 0 ||
          missedReasons.length > 0) && (
          <Card style={{ marginBottom: 16 }}>
            <Sec>MNQ 行情判断与错失诊断</Sec>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  title: "判断偏差原因",
                  rows: deviationReasons.map((item) => ({
                    label: item.label,
                    value: `${item.count} 次`,
                  })),
                },
                {
                  title: "机会影响方向",
                  rows: opportunityImpacts.map((item) => ({
                    label: item.label,
                    value: `${item.count} 次`,
                  })),
                },
                {
                  title: "具体机会影响",
                  rows: impactTypes.map((item) => ({
                    label: item.label,
                    value: `${item.count} 次`,
                  })),
                },
                {
                  title: "错过原因与机会成本",
                  rows: missedReasons.map((item) => ({
                    label: item.label,
                    value: `${item.count} 次 · ${item.hypotheticalR > 0 ? "+" : ""}${item.hypotheticalR.toFixed(2)}R`,
                  })),
                },
              ].map((group) => (
                <div
                  key={group.title}
                  style={{
                    minHeight: 110,
                    padding: "12px 14px",
                    borderRadius: 9,
                    background: C.surface2,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: C.textMid,
                    }}
                  >
                    {group.title}
                  </div>
                  {group.rows.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {group.rows.slice(0, 6).map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            fontSize: 11,
                          }}
                        >
                          <span style={{ color: C.textDim }}>{row.label}</span>
                          <span
                            style={{
                              color: C.text,
                              whiteSpace: "nowrap",
                              fontFamily: "DM Mono, monospace",
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: C.textDim }}>
                      暂无记录
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* system score + highlights/weaknesses */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* system score */}
          <Card>
            <Sec>系统遵守度</Sec>
            {systemScore ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 16,
                  }}
                >
                  <ScoreRing score={systemScore.total} />
                  <div
                    style={{
                      fontSize: 10.5,
                      color: C.textDim,
                      lineHeight: 1.6,
                    }}
                  >
                    来源：每日盘后复盘「今日评分」
                    <br />
                    遵守计划 · 情绪管理 · 专注度
                  </div>
                </div>
                {/* per-day rating table */}
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 11,
                    marginBottom: 14,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      <th
                        style={{
                          textAlign: "left",
                          color: C.textDim,
                          fontWeight: 500,
                          padding: "3px 10px 6px 0",
                          fontSize: 10,
                        }}
                      >
                        日
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          color: C.textDim,
                          fontWeight: 500,
                          padding: "3px 4px 6px",
                          fontSize: 10,
                        }}
                      >
                        遵守计划
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          color: C.textDim,
                          fontWeight: 500,
                          padding: "3px 4px 6px",
                          fontSize: 10,
                        }}
                      >
                        情绪
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          color: C.textDim,
                          fontWeight: 500,
                          padding: "3px 4px 6px",
                          fontSize: 10,
                        }}
                      >
                        专注度
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((d) => (
                      <tr
                        key={d.date}
                        style={{ borderBottom: `1px solid ${C.border}30` }}
                      >
                        <td
                          style={{
                            color: C.textMid,
                            padding: "5px 10px 5px 0",
                            fontFamily: "DM Mono, monospace",
                          }}
                        >
                          {d.dayLabel}
                        </td>
                        <td style={{ textAlign: "center", padding: "5px 4px" }}>
                          <RatingStars v={d.planFollowed} />
                        </td>
                        <td style={{ textAlign: "center", padding: "5px 4px" }}>
                          <RatingStars v={d.emotionRating} />
                        </td>
                        <td style={{ textAlign: "center", padding: "5px 4px" }}>
                          <RatingStars v={d.focusRating} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* weekly averages */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {systemScore.dims.map((d) => (
                    <ScoreBar key={d.label} label={d.label} score={d.score} />
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: C.textDim,
                  fontSize: 12,
                  padding: "20px 0",
                }}
              >
                填写每日评分后自动计算
              </div>
            )}
          </Card>

          {/* highlights + weaknesses */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Card style={{ flex: 1 }}>
              <Sec>本周亮点</Sec>
              <InlineField
                value={form.strengths}
                onChange={(v) => set("strengths", v)}
                placeholder={"准确识别趋势日\n出场纪律严格\n（每行一条）"}
                rows={5}
              />
            </Card>
            <Card style={{ flex: 1 }}>
              <Sec>本周不足</Sec>
              <InlineField
                value={form.weaknesses}
                onChange={(v) => set("weaknesses", v)}
                placeholder={"行情中间违规进入\n持仓时间过短\n（每行一条）"}
                rows={5}
              />
            </Card>
          </div>
        </div>

        {/* 本周总结 + 核心经验教训 */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 20 }}>
            <Sec>本周总结</Sec>
            <InlineField
              value={form.summary}
              onChange={(v) => set("summary", v)}
              placeholder="本周整体行情环境、状态、重要事项..."
              rows={3}
            />
          </div>
          <Sec>核心经验教训</Sec>
          <InlineField
            value={form.keyLessons}
            onChange={(v) => set("keyLessons", v)}
            placeholder={
              "开盘阶段禁止行情中间进入\nBig engulfing candle 后的再次进入规则\n（每行一条）"
            }
            rows={5}
          />
        </Card>

        {/* next week plan */}
        <Card style={{ marginBottom: 16 }}>
          <Sec>下周计划</Sec>
          <InlineField
            value={form.nextWeekPlan}
            onChange={(v) => set("nextWeekPlan", v)}
            placeholder={
              "周三 FOMC 会议纪要\n强化不在行情中间进入的执行\n（每行一条）"
            }
            rows={4}
          />
        </Card>

        {/* footer */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: C.textDim,
              fontFamily: "DM Mono, monospace",
            }}
          >
            W{weekNum} · {year} · MNQ 系统周报
          </span>
          <span
            style={{
              fontSize: 10,
              color: C.textDim,
              fontFamily: "DM Mono, monospace",
            }}
          >
            {dateRange}
          </span>
        </div>
      </div>
    </div>
  );
}

// small nav button
function NavBtn({
  children,
  onClick,
  disabled = false,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: `1px solid ${hovered && !disabled ? "oklch(0.32 0.035 240)" : "oklch(0.22 0.022 240)"}`,
        background: "none",
        color:
          hovered && !disabled
            ? "oklch(0.88 0.008 240)"
            : "oklch(0.42 0.015 240)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14,
        transition: "all 0.15s",
        opacity: disabled ? 0.35 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
