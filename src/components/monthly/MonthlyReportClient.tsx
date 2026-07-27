"use client"

import { useState, useCallback, Fragment } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save } from "lucide-react"

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       "oklch(0.10 0.015 240)",
  surface:  "oklch(0.145 0.018 240)",
  surface2: "oklch(0.175 0.02 240)",
  border:   "oklch(0.22 0.022 240)",
  borderHi: "oklch(0.32 0.035 240)",
  amber:    "oklch(0.78 0.15 72)",
  green:    "oklch(0.72 0.18 145)",
  red:      "oklch(0.65 0.18 15)",
  text:     "oklch(0.88 0.008 240)",
  textMid:  "oklch(0.62 0.012 240)",
  textDim:  "oklch(0.42 0.015 240)",
} as const

// ── Exported types ────────────────────────────────────────────────────────────

export interface WeekSummary {
  weekStart: string
  weekNum: number
  range: string
  pnl: number
  trades: number
  wins: number
  winRate: number
  score: number | null
  summary: string | null
  highlight: string | null
  weakness: string | null
  lesson: string | null
  regimes: { TREND: number; CHOP: number; RANGE: number }
  equity: number[]
}

export interface RecurringLesson {
  text: string
  occurredIn: number[]
  severity: "high" | "medium" | "low"
}

export interface PersistentIssue {
  issue: string
  weeksAffected: number[]
  allWeekNums: number[]
}

export interface MonthlyTradeRecord {
  id: string
  weekNum: number
  weekStart: string
  day: string
  time: string
  symbol: string
  direction: "LONG" | "SHORT"
  entryPrice: number | null
  exitPrice: number | null
  pnl: number | null
  executionGrade: "A" | "B" | "C" | "D" | null
  strategy: string | null
  notes: string | null
  stopPrice: number | null
  targetPrice: number | null
  tradeResult: string | null
  tradeResultNote: string | null
  plannedRiskPts: number | null
  maxDrawdownPts: number | null
  maxFavorablePts: number | null
  heldOvernight: boolean
  overnightReason: string | null
  tradeTypeName: string | null
  entryApproach: "DIRECT" | "PULLBACK" | null
}

export interface TradeMini {
  weekNum: number
  day: string
  symbol: string
  direction: "LONG" | "SHORT"
  pnl: number
}

export interface MonthlyMnqMissedRecord {
  id: string
  weekNum: number
  weekStart: string
  day: string
  segment: string
  description: string
  missedProcess: string
  riskPts: number | null
  returnPts: number | null
  tradeDirection: "LONG" | "SHORT" | null
  strategyName: string | null
  tradeTypeName: string | null
  entryApproach: "DIRECT" | "PULLBACK" | null
}

interface Props {
  yearMonth: string
  monthLabel: string
  range: string
  prevMonth: string | null
  nextMonth: string | null
  totalPnL: number
  totalTrades: number
  winCount: number
  profitableWeeks: number
  avgScore: number | null
  monthEquity: number[]
  weekBoundaryIndices: number[]
  weeks: WeekSummary[]
  recurringLessons: RecurringLesson[]
  persistentIssues: PersistentIssue[]
  allTrades: MonthlyTradeRecord[]
  mnqMissed: MonthlyMnqMissedRecord[]
  bestTrade: TradeMini | null
  worstTrade: TradeMini | null
  initialInsight: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  const sign = n >= 0 ? "+" : "-"
  return `${sign}$${Math.abs(n).toLocaleString()}`
}

function fmtCompact(n: number): string {
  const sign = n >= 0 ? "+" : "-"
  return `${sign}$${Math.abs(n).toFixed(0)}`
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Sec({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 14, background: C.amber, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: C.textMid, letterSpacing: "0.07em" }}>
        {children}
      </span>
      {sub && <span style={{ fontSize: 11, color: C.textDim, marginLeft: 6 }}>{sub}</span>}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px", ...style }}>
      {children}
    </div>
  )
}

function NavBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, borderRadius: 6,
        border: `1px solid ${hov && !disabled ? C.borderHi : C.border}`,
        background: "none", color: hov && !disabled ? C.text : C.textDim,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14, transition: "all 0.15s", opacity: disabled ? 0.35 : 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  )
}

// ── Month equity curve ────────────────────────────────────────────────────────

function MonthEquityCurve({ data, boundaries }: { data: number[]; boundaries: number[] }) {
  const W = 1100, H = 160
  const PAD = { t: 16, r: 24, b: 30, l: 64 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b

  if (data.length < 2) {
    return (
      <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, fontSize: 12 }}>
        暂无数据
      </div>
    )
  }

  const min = Math.min(...data) - Math.abs(Math.min(...data)) * 0.05 - 10
  const max = Math.max(...data) + Math.abs(Math.max(...data)) * 0.05 + 10
  const range = max - min || 1

  const xScale = (i: number) => PAD.l + (i / (data.length - 1)) * iW
  const yScale = (v: number) => PAD.t + iH - ((v - min) / range) * iH

  const pts = data.map((v, i) => [xScale(i), yScale(v)] as [number, number])
  const pathD = pts.map((p, i) => {
    if (i === 0) return `M${p[0]},${p[1]}`
    const prev = pts[i - 1]!
    const cpx = (prev[0] + p[0]) / 2
    return `C${cpx},${prev[1]} ${cpx},${p[1]} ${p[0]},${p[1]}`
  }).join(" ")
  const areaD = pathD + ` L${pts[pts.length - 1]![0]},${PAD.t + iH} L${pts[0]![0]},${PAD.t + iH} Z`

  const baseY = yScale(0)
  const lastPt = pts[pts.length - 1]!
  const endColor = data[data.length - 1]! >= 0 ? C.green : C.red

  // Grid labels
  const gridVals = [
    Math.round(min + range * 0.25),
    Math.round(min + range * 0.5),
    Math.round(min + range * 0.75),
    Math.round(max - range * 0.05),
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <defs>
        <linearGradient id="moEqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={endColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={endColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* week separator lines */}
      {boundaries.slice(0, -1).map((idx, i) => {
        const x = xScale(idx)
        return (
          <line key={i} x1={x} y1={PAD.t} x2={x} y2={H - PAD.b}
            stroke={C.border} strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
        )
      })}

      {/* zero baseline */}
      {baseY >= PAD.t && baseY <= PAD.t + iH && (
        <line x1={PAD.l} y1={baseY} x2={W - PAD.r} y2={baseY}
          stroke={C.textDim} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.5" />
      )}

      {/* grid */}
      {gridVals.map((v, i) => {
        const y = yScale(v)
        if (y < PAD.t || y > PAD.t + iH) return null
        return (
          <g key={i}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
              stroke={C.border} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" fontSize="9.5" fill={C.textDim} fontFamily="DM Mono, monospace">
              {v >= 0 ? "+" : ""}{v}
            </text>
          </g>
        )
      })}

      <path d={areaD} fill="url(#moEqGrad)" />
      <path d={pathD} fill="none" stroke={endColor} strokeWidth="1.75" />

      {/* endpoint glow */}
      <circle cx={lastPt[0]} cy={lastPt[1]} r="9" fill={endColor} opacity="0.18" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="4" fill={endColor} stroke={C.bg} strokeWidth="2" />
    </svg>
  )
}

// ── Week sparkline ────────────────────────────────────────────────────────────

function WeekSpark({ data, color }: { data: number[]; color: string }) {
  const W = 200, H = 36
  if (data.length < 2) return <div style={{ height: H }} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const r = max - min || 1
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - 4 - ((v - min) / r) * (H - 8),
  ] as [number, number])
  const pathD = pts.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(" ")
  const areaD = pathD + ` L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block" }}>
      <path d={areaD} fill={color} opacity="0.15" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

// ── Week card ─────────────────────────────────────────────────────────────────

const REGIME_COLORS = { TREND: "oklch(0.72 0.18 145)", CHOP: "oklch(0.65 0.18 15)", RANGE: "oklch(0.78 0.15 72)" } as const
const REGIME_LABELS = { TREND: "趋势", CHOP: "震荡", RANGE: "区间" } as const

function WeekCard({ w }: { w: WeekSummary }) {
  const [hov, setHov] = useState(false)
  const pnlColor = w.pnl >= 0 ? C.green : C.red

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface, border: `1px solid ${hov ? C.borderHi : C.border}`,
        borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s",
      }}
    >
      {/* header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 10.5, color: C.textDim, letterSpacing: "0.06em", fontWeight: 500, fontFamily: "DM Mono, monospace" }}>
            WEEK {w.weekNum}
          </span>
          {w.score !== null && (
            <span style={{ fontSize: 9.5, color: C.textDim, padding: "2px 6px", background: C.surface2, borderRadius: 4 }}>
              系统分 {w.score}
            </span>
          )}
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: pnlColor, lineHeight: 1.1, fontFamily: "DM Mono, monospace" }}>
          {fmt(w.pnl)}
        </div>
        <div style={{ fontSize: 10, color: C.textDim, marginTop: 3, fontFamily: "DM Mono, monospace" }}>{w.range}</div>
      </div>

      {/* sparkline */}
      <div style={{ padding: "8px 8px 0" }}>
        <WeekSpark data={w.equity} color={pnlColor} />
      </div>

      {/* metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, padding: "4px 8px 12px", borderBottom: `1px solid ${C.border}` }}>
        {[
          { l: "交易", v: w.trades, c: C.text },
          { l: "胜率", v: w.trades > 0 ? `${w.winRate}%` : "—", c: w.winRate >= 60 ? C.green : C.text },
          { l: "盈/亏", v: w.trades > 0 ? `${w.wins}/${w.trades - w.wins}` : "—", c: C.text },
        ].map((s) => (
          <div key={s.l} style={{ textAlign: "center", padding: "4px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: s.c, lineHeight: 1.1, fontFamily: "DM Mono, monospace" }}>{s.v}</div>
            <div style={{ fontSize: 9.5, color: C.textDim, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* regimes */}
      {(w.regimes.TREND + w.regimes.CHOP + w.regimes.RANGE) > 0 && (
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9.5, color: C.textDim, letterSpacing: "0.05em", marginBottom: 6 }}>市场环境</div>
          <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: C.border }}>
            {(["TREND", "CHOP", "RANGE"] as const).map((type) =>
              w.regimes[type] > 0 ? (
                <div key={type} style={{ flex: w.regimes[type], background: REGIME_COLORS[type] }}
                  title={`${REGIME_LABELS[type]} ${w.regimes[type]}天`} />
              ) : null
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {(["TREND", "CHOP", "RANGE"] as const).map((type) =>
              w.regimes[type] > 0 ? (
                <span key={type} style={{ fontSize: 9.5, color: REGIME_COLORS[type], display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ width: 6, height: 6, background: REGIME_COLORS[type], borderRadius: 1, display: "inline-block" }} />
                  <span style={{ fontFamily: "DM Mono, monospace" }}>{w.regimes[type]}</span>
                </span>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* summary */}
      {w.summary && (
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11.5, lineHeight: 1.6, color: C.textMid }}>{w.summary}</p>
        </div>
      )}

      {/* highlight + weakness */}
      {(w.highlight ?? w.weakness) && (
        <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8, borderBottom: `1px solid ${C.border}` }}>
          {w.highlight && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: C.green, fontSize: 11, marginTop: 1, flexShrink: 0 }}>↑</span>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: C.textMid }}>{w.highlight}</span>
            </div>
          )}
          {w.weakness && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: C.red, fontSize: 11, marginTop: 1, flexShrink: 0 }}>↓</span>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: C.textMid }}>{w.weakness}</span>
            </div>
          )}
        </div>
      )}

      {/* lesson */}
      {w.lesson && (
        <div style={{ padding: "10px 16px", background: `${C.amber}0a`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 9.5, color: C.amber, letterSpacing: "0.05em", marginBottom: 4, fontWeight: 600 }}>核心教训</div>
          <p style={{ fontSize: 11.5, lineHeight: 1.5, color: C.text }}>{w.lesson}</p>
        </div>
      )}

      {/* link */}
      <a
        href={`/weekly/${w.weekStart}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "10px 16px", color: C.textDim, fontSize: 11,
          textDecoration: "none", transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.text }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim }}
      >
        查看完整周报 →
      </a>
    </div>
  )
}

// ── Grade badge ───────────────────────────────────────────────────────────────

const GRADE_COLOR = {
  A: "oklch(0.72 0.18 145)",
  B: "oklch(0.72 0.15 145)",
  C: "oklch(0.78 0.15 72)",
  D: "oklch(0.65 0.18 15)",
} as const

function GradeBadge({ grade }: { grade: "A" | "B" | "C" | "D" }) {
  const color = GRADE_COLOR[grade]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 20, height: 20, borderRadius: 5,
      background: `${color}22`, color, fontSize: 10.5, fontWeight: 700, fontFamily: "DM Mono, monospace",
    }}>{grade}</span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function MonthlyReportClient({
  yearMonth, monthLabel, range,
  prevMonth, nextMonth,
  totalPnL, totalTrades, winCount, profitableWeeks, avgScore,
  monthEquity, weekBoundaryIndices,
  weeks, recurringLessons, persistentIssues, allTrades, mnqMissed,
  bestTrade, worstTrade, initialInsight,
}: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [insight, setInsight] = useState(initialInsight ?? "")

  const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : null

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/monthly-reports/${yearMonth}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthInsight: insight || null }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        router.refresh()
      } else {
        toast.error(json.error ?? "保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }, [yearMonth, insight, router])

  const TD: React.CSSProperties = { padding: "10px", borderBottom: `1px solid ${C.border}` }

  // Summary strip stats
  const tradesWith = allTrades.filter((t) => t.pnl !== null)
  const tradePnls = tradesWith.map((t) => t.pnl!)
  const wins = tradePnls.filter((p) => p > 0)
  const losses = tradePnls.filter((p) => p < 0)
  const totalDollar = tradePnls.reduce((s, p) => s + p, 0)
  const avgWin = wins.length ? wins.reduce((s, p) => s + p, 0) / wins.length : 0
  const avgLoss = losses.length ? Math.abs(losses.reduce((s, p) => s + p, 0) / losses.length) : 0
  const profitFactor = losses.length && avgLoss ? (avgWin * wins.length) / (avgLoss * losses.length) : 0
  const aGrade = allTrades.filter((t) => t.executionGrade === "A").length
  const dGrade = allTrades.filter((t) => t.executionGrade === "D").length

  return (
    <div style={{ minHeight: "100vh", background: C.bg, margin: "0 -16px" }}>

      {/* ── top bar ── */}
      <div style={{
        position: "sticky", top: 56, zIndex: 40,
        background: "oklch(0.10 0.015 240 / 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 32px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 11, color: C.amber, letterSpacing: "0.1em", fontWeight: 500, fontFamily: "DM Mono, monospace" }}>
              MONTHLY DIGEST
            </span>
            <span style={{ width: 1, height: 14, background: C.border, display: "block" }} />
            <span style={{ fontSize: 13, color: C.textMid }}>
              {monthLabel}
              <span style={{ fontFamily: "DM Mono, monospace", color: C.textDim, marginLeft: 10, fontSize: 11 }}>
                {range} · {weeks.length}周
              </span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: totalPnL >= 0 ? C.green : C.red,
                boxShadow: `0 0 6px ${totalPnL >= 0 ? C.green : C.red}`,
              }} />
              <span style={{ fontSize: 13, color: totalPnL >= 0 ? C.green : C.red, fontWeight: 500, fontFamily: "DM Mono, monospace" }}>
                {fmt(totalPnL)}
              </span>
            </div>
            <span style={{ width: 1, height: 14, background: C.border }} />
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "0 12px", height: 28, borderRadius: 6,
                border: `1px solid ${saved ? C.green : C.border}`,
                background: saved ? `${C.green}18` : "none",
                color: saved ? C.green : C.textMid,
                fontSize: 12, cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.2s", opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={13} />
              {saving ? "保存中..." : saved ? "已保存" : "保存月报"}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              <NavBtn onClick={() => prevMonth && router.push(`/monthly/${prevMonth}`)} disabled={!prevMonth}>‹</NavBtn>
              <NavBtn onClick={() => nextMonth && router.push(`/monthly/${nextMonth}`)} disabled={!nextMonth}>›</NavBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── body ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 80px" }}>

        {weeks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textDim, fontSize: 14 }}>
            该月暂无交易记录
          </div>
        ) : (
          <>
            {/* ── hero ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 11.5, color: C.textDim, letterSpacing: "0.08em", marginBottom: 6 }}>
                    {weeks.length} 周累计净盈亏
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span style={{
                      fontSize: 48, fontWeight: 500, letterSpacing: "-0.03em",
                      color: totalPnL >= 0 ? C.green : C.red, lineHeight: 1,
                      fontFamily: "DM Mono, monospace",
                    }}>{fmt(totalPnL)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    { l: "交易", v: totalTrades, c: C.text },
                    { l: "胜率", v: winRate !== null ? `${winRate}%` : "—", c: winRate !== null && winRate >= 60 ? C.green : C.text },
                    { l: "盈利周", v: `${profitableWeeks}/${weeks.length}`, c: profitableWeeks >= Math.ceil(weeks.length / 2) ? C.green : C.amber },
                    ...(avgScore !== null ? [{ l: "平均系统分", v: avgScore, c: C.amber }] : []),
                  ].map((s) => (
                    <div key={s.l} style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 500, color: s.c, lineHeight: 1.1, fontFamily: "DM Mono, monospace" }}>
                        {s.v}
                      </div>
                      <div style={{ fontSize: 10, color: C.textDim, marginTop: 3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Card>
                <MonthEquityCurve data={monthEquity} boundaries={weekBoundaryIndices} />
              </Card>
            </div>

            {/* ── 4-week grid ── */}
            <Sec sub="点击「查看完整周报」跳转详情">本月各周</Sec>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(weeks.length, 4)}, 1fr)`,
              gap: 12, marginBottom: 24,
            }}>
              {weeks.map((w) => <WeekCard key={w.weekStart} w={w} />)}
            </div>

            {/* ── cross-week aggregation ── */}
            {(recurringLessons.length > 0 || persistentIssues.length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* recurring lessons */}
                {recurringLessons.length > 0 && (
                  <Card>
                    <Sec sub="跨周出现的高频教训">重复教训追踪</Sec>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {recurringLessons.map((l, i) => {
                        const sevColor = l.severity === "high" ? C.red : l.severity === "medium" ? C.amber : C.textMid
                        const recurring = l.occurredIn.length > 1
                        return (
                          <div key={i} style={{
                            padding: "12px 14px", background: C.surface2, borderRadius: 10,
                            border: `1px solid ${C.border}`,
                            borderLeft: recurring ? `3px solid ${sevColor}` : `1px solid ${C.border}`,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                              <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5, flex: 1 }}>{l.text}</span>
                              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                                {l.occurredIn.map((wn) => (
                                  <span key={wn} style={{
                                    fontSize: 9.5, padding: "2px 6px",
                                    background: `${sevColor}22`, color: sevColor,
                                    borderRadius: 3, fontWeight: 600, fontFamily: "DM Mono, monospace",
                                  }}>W{wn}</span>
                                ))}
                              </div>
                            </div>
                            {recurring && (
                              <div style={{ marginTop: 6, fontSize: 10, color: sevColor, display: "flex", alignItems: "center", gap: 4 }}>
                                <span>⚠</span>
                                <span>已重复出现 {l.occurredIn.length} 次，需重点强化</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )}

                {/* persistent issues */}
                {persistentIssues.length > 0 && (
                  <Card>
                    <Sec sub="跨周持续存在的问题">持续性问题</Sec>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {persistentIssues.map((p, i) => (
                        <div key={i} style={{ padding: "12px 14px", background: C.surface2, borderRadius: 10, border: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12.5, color: C.text, fontWeight: 500 }}>{p.issue}</span>
                            <span style={{ fontSize: 10.5, color: C.red, fontFamily: "DM Mono, monospace" }}>
                              {p.weeksAffected.length}/{p.allWeekNums.length} 周受影响
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 10, color: C.textDim, width: 50 }}>影响周</span>
                            <div style={{ display: "flex", gap: 4, flex: 1 }}>
                              {p.allWeekNums.map((wn) => {
                                const affected = p.weeksAffected.includes(wn)
                                return (
                                  <div key={wn} style={{
                                    flex: 1, height: 6, borderRadius: 2,
                                    background: affected ? C.red : C.border,
                                    opacity: affected ? 1 : 0.4,
                                  }} title={`W${wn}`} />
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ── trade table ── */}
            {allTrades.length > 0 && (
              <Card style={{ marginBottom: 16 }}>
                <Sec sub={`${allTrades.length} 笔 · 按周分组`}>本月交易明细</Sec>

                {/* summary strip */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0,
                  background: C.surface2, borderRadius: 8, marginBottom: 14,
                  border: `1px solid ${C.border}`,
                }}>
                  {[
                    { l: "累计盈亏", v: fmtCompact(totalDollar), c: totalDollar >= 0 ? C.green : C.red },
                    { l: "盈/亏笔", v: `${wins.length}/${losses.length}`, c: C.text },
                    { l: "平均盈利", v: fmtCompact(avgWin), c: C.green },
                    { l: "平均亏损", v: avgLoss ? fmtCompact(-avgLoss) : "—", c: C.red },
                    { l: "盈亏比", v: profitFactor > 0 ? profitFactor.toFixed(2) : "—", c: profitFactor >= 2 ? C.green : C.amber },
                    { l: "A级/D级", v: `${aGrade}/${dGrade}`, c: aGrade > dGrade ? C.green : C.amber },
                  ].map((s, i, arr) => (
                    <div key={s.l} style={{
                      padding: "12px 14px", textAlign: "center",
                      borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 500, color: s.c, lineHeight: 1.1, fontFamily: "DM Mono, monospace" }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {["编号", "时间", "方向", "入场 / 出场", "止损 / 目标", "盈亏 / 点数", "风险 / R", "MAE / MFE", "结果", "策略", "子策略", "进入方式", "备注"].map((h) => (
                          <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.textDim, fontWeight: 500, letterSpacing: "0.04em", fontSize: 10, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map((week) => {
                        const wTrades = allTrades.filter((t) => t.weekNum === week.weekNum)
                        if (wTrades.length === 0) return null
                        const wPnl = wTrades.filter((t) => t.pnl !== null).reduce((s, t) => s + t.pnl!, 0)
                        return (
                          <Fragment key={`wk-${week.weekStart}`}>
                            {/* week group header */}
                            <tr style={{ background: `${C.amber}0d` }}>
                              <td colSpan={13} style={{ padding: "8px 10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
                                  <span style={{ color: C.amber, fontWeight: 600, letterSpacing: "0.06em", fontFamily: "DM Mono, monospace" }}>
                                    WEEK {week.weekNum}
                                  </span>
                                  <span style={{ color: C.textDim }}>{week.range}</span>
                                  <span style={{ flex: 1 }} />
                                  <span style={{ color: C.textDim, fontFamily: "DM Mono, monospace" }}>{wTrades.length} 笔</span>
                                  <span style={{ color: wPnl >= 0 ? C.green : C.red, fontWeight: 600, fontFamily: "DM Mono, monospace" }}>
                                    {fmt(Math.round(wPnl))}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {wTrades.map((t, i) => {
                              const pnlColor = t.pnl !== null ? (t.pnl > 0 ? C.green : t.pnl < 0 ? C.red : C.textDim) : C.textDim
                              const isLastInGroup = i === wTrades.length - 1
                              const tdS: React.CSSProperties = { ...TD, borderBottomColor: isLastInGroup ? C.border : C.border, verticalAlign: "top" }
                              const entryN = t.entryPrice
                              const exitN = t.exitPrice
                              let pnlPts: number | null = null
                              let rMultiple: number | null = null
                              if (exitN !== null && entryN !== null && entryN > 0) {
                                pnlPts = t.direction === "LONG" ? exitN - entryN : entryN - exitN
                                if (t.plannedRiskPts && t.plannedRiskPts > 0) {
                                  rMultiple = pnlPts / t.plannedRiskPts
                                }
                              }
                              const resultLabel: Record<string, { text: string; color: string }> = {
                                PROFIT_MET:     { text: "达目标", color: C.green },
                                PROFIT_PARTIAL: { text: "部分盈", color: "oklch(0.68 0.15 145)" },
                                BREAKEVEN:      { text: "保本",   color: C.textDim },
                                LOSS:           { text: "亏损",   color: C.red },
                              }
                              const result = t.tradeResult ? (resultLabel[t.tradeResult] ?? null) : null
                              const noteParts = [t.strategy, t.notes, t.tradeResultNote].filter(Boolean)
                              if (t.heldOvernight) noteParts.push("📌 持仓过夜" + (t.overnightReason ? `：${t.overnightReason}` : ""))
                              return (
                                <tr key={t.id}
                                  style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = C.surface2 }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                                >
                                  {/* 编号 */}
                                  <td style={{ ...tdS, color: C.textDim, fontSize: 10.5, fontFamily: "DM Mono, monospace" }}>{t.id}</td>
                                  {/* 时间 */}
                                  <td style={{ ...tdS, color: C.textMid, fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}>
                                    <div>{t.day}</div>
                                    {t.time && <div style={{ fontSize: 10, color: C.textDim }}>{t.time}</div>}
                                  </td>
                                  {/* 方向 */}
                                  <td style={{ ...tdS, color: t.direction === "LONG" ? C.green : C.red, fontWeight: 500, whiteSpace: "nowrap" }}>
                                    {t.direction === "LONG" ? "↑ 多" : "↓ 空"}
                                    {t.heldOvernight && (
                                      <span title={t.overnightReason ?? "持仓过夜"} style={{ marginLeft: 4, fontSize: 10, color: "oklch(0.72 0.15 280)", cursor: "default" }}>🌙</span>
                                    )}
                                  </td>
                                  {/* 入场 / 出场 */}
                                  <td style={{ ...tdS, fontFamily: "DM Mono, monospace", fontSize: 11 }}>
                                    <div style={{ color: C.green }}>↗ {entryN != null ? entryN.toLocaleString() : "—"}</div>
                                    <div style={{ color: exitN !== null ? C.red : C.textDim }}>
                                      {exitN !== null ? `↙ ${exitN.toLocaleString()}` : "—"}
                                    </div>
                                  </td>
                                  {/* 止损 / 目标 */}
                                  <td style={{ ...tdS, fontFamily: "DM Mono, monospace", fontSize: 11 }}>
                                    <div style={{ color: C.red }}>{t.stopPrice != null ? `✕ ${t.stopPrice.toLocaleString()}` : "—"}</div>
                                    <div style={{ color: C.green }}>{t.targetPrice != null ? `✓ ${t.targetPrice.toLocaleString()}` : "—"}</div>
                                  </td>
                                  {/* 盈亏 / 点数 */}
                                  <td style={tdS}>
                                    <div style={{ color: pnlColor, fontWeight: 600, fontSize: 13, fontFamily: "DM Mono, monospace", textShadow: t.pnl !== null && Math.abs(t.pnl) > 500 ? `0 0 10px ${pnlColor}88` : "none" }}>
                                      {t.pnl !== null ? fmtCompact(t.pnl) : "—"}
                                    </div>
                                    {pnlPts !== null && (
                                      <div style={{ fontSize: 10, color: pnlColor, fontFamily: "DM Mono, monospace" }}>
                                        {pnlPts >= 0 ? "+" : ""}{pnlPts.toFixed(2)} pts
                                      </div>
                                    )}
                                  </td>
                                  {/* 风险 / R */}
                                  <td style={{ ...tdS, fontFamily: "DM Mono, monospace", fontSize: 11 }}>
                                    <div style={{ color: C.textMid }}>{t.plannedRiskPts != null ? `${t.plannedRiskPts} pts` : "—"}</div>
                                    {rMultiple !== null && (
                                      <div style={{ color: rMultiple >= 0 ? C.green : C.red, fontWeight: 500 }}>
                                        {rMultiple >= 0 ? "+" : ""}{rMultiple.toFixed(2)}R
                                      </div>
                                    )}
                                  </td>
                                  {/* MAE / MFE */}
                                  <td style={{ ...tdS, fontFamily: "DM Mono, monospace", fontSize: 11 }}>
                                    <div style={{ color: t.maxDrawdownPts != null ? C.red : C.textDim }}>
                                      {t.maxDrawdownPts != null ? `-${t.maxDrawdownPts} pts` : "—"}
                                    </div>
                                    <div style={{ color: t.maxFavorablePts != null ? C.green : C.textDim }}>
                                      {t.maxFavorablePts != null ? `+${t.maxFavorablePts} pts` : "—"}
                                    </div>
                                  </td>
                                  {/* 结果 */}
                                  <td style={tdS}>
                                    {result ? (
                                      <span style={{ fontSize: 10.5, color: result.color, fontWeight: 500 }}>{result.text}</span>
                                    ) : (
                                      t.executionGrade ? <GradeBadge grade={t.executionGrade} /> : <span style={{ color: C.textDim }}>—</span>
                                    )}
                                  </td>
                                  {/* 策略 */}
                                  <td style={{ ...tdS, fontSize: 11, color: "oklch(0.72 0.15 240)", maxWidth: 140, whiteSpace: "nowrap" }}>
                                    {t.strategy ?? <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  {/* 子策略 */}
                                  <td style={{ ...tdS, fontSize: 11, color: C.textDim, maxWidth: 140, whiteSpace: "nowrap" }}>
                                    {t.tradeTypeName ?? "—"}
                                  </td>
                                  {/* 进入方式 */}
                                  <td style={{ ...tdS, whiteSpace: "nowrap" }}>
                                    {t.entryApproach ? (
                                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                        background: t.entryApproach === "DIRECT" ? "oklch(0.72 0.18 145 / 0.15)" : "oklch(0.78 0.15 72 / 0.15)",
                                        color: t.entryApproach === "DIRECT" ? C.green : C.amber, fontWeight: 500 }}>
                                        {t.entryApproach === "DIRECT" ? "直接" : "回调"}
                                      </span>
                                    ) : <span style={{ color: C.textDim, fontSize: 11 }}>—</span>}
                                  </td>
                                  {/* 备注 */}
                                  <td style={{ ...tdS, fontSize: 11, color: C.textDim, maxWidth: 180 }}>
                                    {[t.notes, t.tradeResultNote, t.heldOvernight ? ("📌 持仓过夜" + (t.overnightReason ? `：${t.overnightReason}` : "")) : null].filter(Boolean).join(" · ") || ""}
                                  </td>
                                </tr>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* ── MNQ missed table ── */}
            {mnqMissed.length > 0 && (
              <Card style={{ marginBottom: 16 }}>
                <Sec sub={`${mnqMissed.length} 笔 · 按周分组`}>本月错过 MNQ 机会</Sec>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {["编号", "时间 / 时段", "方向", "策略", "子策略", "进入方式", "机会描述", "错过经过", "假设风险", "假设回报", "假设R"].map((h) => (
                          <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.textDim, fontWeight: 500, fontSize: 10, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map((week) => {
                        const wMissed = mnqMissed.filter((m) => m.weekNum === week.weekNum)
                        if (wMissed.length === 0) return null
                        return (
                          <Fragment key={`wk-miss-${week.weekStart}`}>
                            <tr style={{ background: `${C.red}0a` }}>
                              <td colSpan={11} style={{ padding: "8px 10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
                                  <span style={{ color: C.red, fontWeight: 600, letterSpacing: "0.06em", fontFamily: "DM Mono, monospace" }}>
                                    WEEK {week.weekNum}
                                  </span>
                                  <span style={{ color: C.textDim }}>{week.range}</span>
                                  <span style={{ flex: 1 }} />
                                  <span style={{ color: C.textDim, fontFamily: "DM Mono, monospace" }}>{wMissed.length} 笔</span>
                                </div>
                              </td>
                            </tr>
                            {wMissed.map((m) => {
                              const r = m.riskPts !== null && m.returnPts !== null && m.riskPts > 0
                                ? m.returnPts / m.riskPts : null
                              return (
                                <tr key={m.id}
                                  style={{ borderBottom: `1px solid ${C.border}30`, transition: "background 0.15s" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = C.surface2 }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                                >
                                  <td style={{ ...TD, color: C.textDim, fontSize: 10.5, fontFamily: "DM Mono, monospace", verticalAlign: "top" }}>{m.id}</td>
                                  <td style={{ ...TD, verticalAlign: "top", whiteSpace: "nowrap" }}>
                                    <div style={{ color: C.textMid, fontFamily: "DM Mono, monospace" }}>{m.day}</div>
                                    <div style={{ fontSize: 10, color: C.textDim }}>{m.segment}</div>
                                  </td>
                                  <td style={{ ...TD, verticalAlign: "top", whiteSpace: "nowrap" }}>
                                    {m.tradeDirection ? (
                                      <span style={{ fontSize: 11, fontWeight: 500, color: m.tradeDirection === "LONG" ? C.green : C.red }}>
                                        {m.tradeDirection === "LONG" ? "↑ 多" : "↓ 空"}
                                      </span>
                                    ) : <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  <td style={{ ...TD, verticalAlign: "top", maxWidth: 140 }}>
                                    {m.strategyName
                                      ? <span style={{ fontSize: 11, color: "oklch(0.72 0.15 240)" }}>{m.strategyName}</span>
                                      : <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  <td style={{ ...TD, verticalAlign: "top", maxWidth: 140 }}>
                                    {m.tradeTypeName
                                      ? <span style={{ fontSize: 11, color: C.textDim }}>{m.tradeTypeName}</span>
                                      : <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  <td style={{ ...TD, verticalAlign: "top", whiteSpace: "nowrap" }}>
                                    {m.entryApproach ? (
                                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4,
                                        background: m.entryApproach === "DIRECT" ? "oklch(0.72 0.18 145 / 0.15)" : "oklch(0.78 0.15 72 / 0.15)",
                                        color: m.entryApproach === "DIRECT" ? C.green : C.amber,
                                        fontWeight: 500 }}>
                                        {m.entryApproach === "DIRECT" ? "直接" : "回调"}
                                      </span>
                                    ) : <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  <td style={{ ...TD, color: C.text, maxWidth: 220, verticalAlign: "top" }}>
                                    {m.description || <span style={{ color: C.textDim }}>—</span>}
                                  </td>
                                  <td style={{ ...TD, color: C.textDim, maxWidth: 200, verticalAlign: "top", lineHeight: 1.5 }}>
                                    {m.missedProcess || "—"}
                                  </td>
                                  <td style={{ ...TD, color: m.riskPts !== null ? C.red : C.textDim, fontFamily: "DM Mono, monospace", verticalAlign: "top" }}>
                                    {m.riskPts !== null ? `${m.riskPts} pts` : "—"}
                                  </td>
                                  <td style={{ ...TD, color: m.returnPts !== null ? C.green : C.textDim, fontFamily: "DM Mono, monospace", verticalAlign: "top" }}>
                                    {m.returnPts !== null ? `${m.returnPts} pts` : "—"}
                                  </td>
                                  <td style={{ ...TD, fontFamily: "DM Mono, monospace", fontWeight: 600, verticalAlign: "top",
                                    color: r !== null ? C.amber : C.textDim }}>
                                    {r !== null ? `${r.toFixed(2)} R` : "—"}
                                  </td>
                                </tr>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* ── best / worst ── */}
            {(bestTrade ?? worstTrade) && (
              <Card style={{ marginBottom: 16 }}>
                <Sec>本月之最</Sec>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { tag: "最佳交易", t: bestTrade, color: C.green },
                    { tag: "最差交易", t: worstTrade, color: C.red },
                  ].map(({ tag, t, color }) => t && (
                    <div key={tag} style={{
                      padding: "14px 18px", background: C.surface2, borderRadius: 10,
                      border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`,
                      display: "flex", alignItems: "center", gap: 18,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>{tag}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                          <span style={{ fontSize: 13, color: C.text, fontWeight: 500, fontFamily: "DM Mono, monospace" }}>{t.symbol}</span>
                          <span style={{ fontSize: 11, color: t.direction === "LONG" ? C.green : C.red }}>
                            {t.direction === "LONG" ? "↑ 做多" : "↓ 做空"}
                          </span>
                          <span style={{ fontSize: 10.5, color: C.textDim, marginLeft: "auto", fontFamily: "DM Mono, monospace" }}>
                            W{t.weekNum} · {t.day}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 28, fontWeight: 600, color, lineHeight: 1,
                        fontFamily: "DM Mono, monospace",
                        textShadow: `0 0 12px ${color}55`,
                      }}>{fmtCompact(t.pnl)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── month insight ── */}
            <Card style={{ marginBottom: 16, borderLeft: `3px solid ${C.amber}` }}>
              <Sec sub="基于各周观察提炼">月度复盘</Sec>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="本月整体交易行为总结、纪律问题、下月重点改进方向..."
                rows={5}
                style={{
                  width: "100%", background: C.surface2, border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14,
                  lineHeight: 1.85, resize: "vertical", fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.borderHi }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border }}
              />
            </Card>
          </>
        )}

        {/* footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: "DM Mono, monospace" }}>
            {monthLabel} · 月度汇总
            {weeks.length > 0 && ` (W${weeks[0]!.weekNum}–W${weeks[weeks.length - 1]!.weekNum})`}
          </span>
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: "DM Mono, monospace" }}>{range}</span>
        </div>
      </div>
    </div>
  )
}
