"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Undo2,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { formatPnL } from "~/lib/pnl";
import { formatLevelName, parseLevelForecasts } from "~/lib/mnq-level-forecast";
import {
  MISSED_REASON_LABELS,
  NEWS_TYPE_LABELS,
  NEWS_IMPACT_LABELS,
  MNQ_MARKET_ACCURACY_LABELS,
  MNQ_MARKET_DEVIATION_REASON_LABELS,
  MNQ_MARKET_DIRECTION_LABELS,
  MNQ_MARKET_TYPE_LABELS,
  MNQ_MARKET_IMPACT_TYPE_LABELS,
  MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS,
  MNQ_MISSED_REASON_LABELS,
  PRICE_TIER_LABELS,
  MARKET_CAP_TIER_LABELS,
  SETUP_PRIORITY_LABELS,
  CHART_TIMEFRAME_LABELS,
  type MissedReason,
  type SetupStatus,
  type NewsType,
  type NewsImpact,
  type PriceTier,
  type MarketCapTier,
  type SetupPriority,
  type ChartTimeframe,
  type MnqMarketAccuracy,
  type MnqMarketDeviationReason,
  type MnqMarketDirection,
  type MnqMarketType,
  type MnqMarketImpactType,
  type MnqMarketOpportunityImpact,
  type MnqMissedReasonCategory,
} from "~/types";
import { MissedReasonPanel } from "./MissedReasonPanel";
import { AddExecutionDialog } from "./AddExecutionDialog";
import { ExecutionRecord } from "./ExecutionRecord";
import { IntraStrategySelector } from "./IntraStrategySelector";
import { MnqConditionsBlock } from "./MnqConditionsBlock";
import { MnqActTracker } from "./MnqActTracker";
import { MnqMarketNotes } from "./MnqMarketNotes";
import { ScreenshotGrid } from "~/components/screenshot/ScreenshotGrid";
import type {
  Execution,
  MnqDailyPlan,
  Screenshot,
  TradeSetup,
} from "../../../generated/prisma";

interface Props {
  setup: TradeSetup & { executions: Execution[] };
  intraMode?: boolean;
  /** 只读汇总模式：今日汇总 tab 使用，显示评估结果但不可编辑 */
  summaryMode?: boolean;
  screenshots?: Screenshot[];
  mnqPlan?: MnqDailyPlan | null;
  onDeleted?: (id: string) => void;
  onStatusChanged?: (id: string, status: SetupStatus) => void;
}

const STATUS_CONFIG: Record<
  SetupStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  WATCHING: { label: "观察中", variant: "secondary" },
  EXECUTED: { label: "已执行", variant: "default" },
  MISSED: { label: "已错过", variant: "outline" },
  INVALIDATED: { label: "已失效", variant: "destructive" },
  CANCELLED: { label: "已取消", variant: "outline" },
};

const DIRECTION_CONFIG: Record<string, { label: string; className: string }> = {
  LONG: { label: "做多", className: "bg-green-600 text-white" },
  SHORT: { label: "做空", className: "bg-red-600 text-white" },
  TBD: { label: "待定", className: "bg-gray-600 text-white" },
};

const PRIORITY_BADGE_CONFIG: Record<
  SetupPriority,
  { label: string; className: string }
> = {
  HIGH: { label: "高优先", className: "border-red-700 text-red-400" },
  MEDIUM: { label: "中", className: "border-yellow-700/60 text-yellow-400/60" },
  LOW: {
    label: "低/观察",
    className: "border-muted-foreground/30 text-muted-foreground/50",
  },
};

const CHART_TIMEFRAME_OPTIONS: ChartTimeframe[] = [
  "M1",
  "M5",
  "M15",
  "M30",
  "H1",
  "H4",
  "D1",
];

export function SetupCard({
  setup,
  intraMode = false,
  summaryMode = false,
  screenshots,
  mnqPlan,
  onDeleted,
  onStatusChanged,
}: Props) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showMissPanel, setShowMissPanel] = useState(false);
  const [showExecDialog, setShowExecDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showIntraEval, setShowIntraEval] = useState(false);
  const [intraSaving, setIntraSaving] = useState(false);
  const [intraSaved, setIntraSaved] = useState(false);

  // 盘中评估状态（批量保存，不再 onBlur）
  const [stockSelectionAccurate, setStockSelectionAccurate] = useState<
    boolean | null
  >(setup.stockSelectionAccurate ?? null);
  const [stockSelectionNote, setStockSelectionNote] = useState(
    setup.stockSelectionNote ?? "",
  );
  // 判断准确性（细分四项）
  const s = setup as unknown as Record<string, unknown>;
  const [marketJudgmentAccurate, setMarketJudgmentAccurate] = useState<
    boolean | null
  >((s.marketJudgmentAccurate as boolean | null | undefined) ?? null);
  const [marketJudgmentNote, setMarketJudgmentNote] = useState(
    (s.marketJudgmentNote as string | undefined) ?? "",
  );
  const [strategySelectionAccurate, setStrategySelectionAccurate] = useState<
    boolean | null
  >((s.strategySelectionAccurate as boolean | null | undefined) ?? null);
  const [strategySelectionNote, setStrategySelectionNote] = useState(
    (s.strategySelectionNote as string | undefined) ?? "",
  );
  const [entryOpportunityAccurate, setEntryOpportunityAccurate] = useState<
    boolean | null
  >((s.entryOpportunityAccurate as boolean | null | undefined) ?? null);
  const [entryOpportunityNote, setEntryOpportunityNote] = useState(
    (s.entryOpportunityNote as string | undefined) ?? "",
  );
  const [exitOpportunityAccurate, setExitOpportunityAccurate] = useState<
    boolean | null
  >((s.exitOpportunityAccurate as boolean | null | undefined) ?? null);
  const [exitOpportunityNote, setExitOpportunityNote] = useState(
    (s.exitOpportunityNote as string | undefined) ?? "",
  );
  const [actualEntryOpportunity, setActualEntryOpportunity] = useState(
    setup.actualEntryOpportunity ?? "",
  );
  const [actualExitOpportunity, setActualExitOpportunity] = useState(
    setup.actualExitOpportunity ?? "",
  );
  const [dailySummary, setDailySummary] = useState(setup.dailySummary ?? "");
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe | null>(
    (s.chartTimeframe as ChartTimeframe | null | undefined) ?? null,
  );

  // ── 可编辑条件 ──
  const [editingConds, setEditingConds] = useState(false);
  const [editSetupLogic, setEditSetupLogic] = useState(setup.setupLogic ?? "");
  const [editEntry, setEditEntry] = useState(setup.entryCondition ?? "");
  const [editStop, setEditStop] = useState(setup.stopCondition ?? "");
  const [editTarget1, setEditTarget1] = useState(setup.target1Condition ?? "");
  const [condsSaving, setCondsSaving] = useState(false);

  const statusCfg = STATUS_CONFIG[setup.status as SetupStatus];
  const dirCfg = DIRECTION_CONFIG[setup.direction] ?? DIRECTION_CONFIG.TBD!;

  const dateStr =
    (setup.sessionDate instanceof Date
      ? setup.sessionDate.toISOString().split("T")[0]
      : String(setup.sessionDate).split("T")[0]) ?? "";

  const totalPnL = setup.executions.reduce<number | null>((acc, ex) => {
    if (ex.pnl === null) return acc;
    return (acc ?? 0) + ex.pnl;
  }, null);

  // 盘中评估是否已有内容
  const hasMnqMarketNotes = !!(
    mnqPlan?.marketPreJson ??
    mnqPlan?.marketOpenJson ??
    mnqPlan?.marketMidJson ??
    mnqPlan?.marketAfternoonJson
  );
  const hasIntraData =
    stockSelectionAccurate !== null ||
    marketJudgmentAccurate !== null ||
    strategySelectionAccurate !== null ||
    entryOpportunityAccurate !== null ||
    exitOpportunityAccurate !== null ||
    chartTimeframe !== null ||
    actualEntryOpportunity.trim() ||
    actualExitOpportunity.trim() ||
    dailySummary.trim() ||
    hasMnqMarketNotes;

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        toast.success(`已删除 ${setup.symbol}`);
        onDeleted?.(setup.id);
        router.refresh();
      } else {
        toast.error("删除失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  async function handleSaveConditions() {
    setCondsSaving(true);
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setupLogic: editSetupLogic || null,
          entryCondition: editEntry || null,
          stopCondition: editStop || null,
          target1Condition: editTarget1 || null,
        }),
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        toast.success("条件已保存");
        setEditingConds(false);
        router.refresh();
      } else {
        toast.error("保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setCondsSaving(false);
    }
  }

  async function handleQuickStatus(
    status: "INVALIDATED" | "CANCELLED" | "WATCHING",
  ) {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        const labels = {
          INVALIDATED: "已失效",
          CANCELLED: "已取消",
          WATCHING: "观察中",
        };
        toast.success(`${setup.symbol} → ${labels[status]}`);
        onStatusChanged?.(setup.id, status);
        router.refresh();
      } else {
        toast.error("操作失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setStatusUpdating(false);
    }
  }

  /** 批量保存盘中评估所有字段 */
  async function handleSaveIntraEval() {
    setIntraSaving(true);
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stockSelectionAccurate,
          stockSelectionNote,
          marketJudgmentAccurate,
          marketJudgmentNote,
          strategySelectionAccurate,
          strategySelectionNote,
          entryOpportunityAccurate,
          entryOpportunityNote,
          exitOpportunityAccurate,
          exitOpportunityNote,
          actualEntryOpportunity,
          actualExitOpportunity,
          dailySummary,
          chartTimeframe,
        }),
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) {
        toast.success("盘中评估已保存");
        setIntraSaved(true);
        router.refresh();
      } else {
        toast.error("保存失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setIntraSaving(false);
    }
  }

  function toggleBoolField(
    setter: (v: boolean | null) => void,
    value: boolean,
    current: boolean | null,
  ) {
    const next = current === value ? null : value;
    setter(next);
    setIntraSaved(false); // mark as unsaved when user modifies
  }

  function renderSummaryEvalSection() {
    if (!hasIntraData) return null;
    const analysisItems = [
      {
        label: "行情判断",
        val: marketJudgmentAccurate,
        note: marketJudgmentNote,
      },
      {
        label: "策略选择",
        val: strategySelectionAccurate,
        note: strategySelectionNote,
      },
      {
        label: "入场机会",
        val: entryOpportunityAccurate,
        note: entryOpportunityNote,
      },
      {
        label: "出场机会",
        val: exitOpportunityAccurate,
        note: exitOpportunityNote,
      },
    ];
    const hasAnalysis = analysisItems.some((i) => i.val !== null);
    return (
      <div className="border-border/40 mt-1 space-y-2 border-t pt-2">
        <p className="text-muted-foreground text-xs font-medium">盘中评估</p>
        <div className="space-y-1.5">
          {chartTimeframe && (
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-14 shrink-0">
                K线维度
              </span>
              <span className="text-foreground/80">
                {CHART_TIMEFRAME_LABELS[chartTimeframe]}
              </span>
            </div>
          )}
          {stockSelectionAccurate !== null && (
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-14 shrink-0">
                盘前选股
              </span>
              <span
                className={
                  stockSelectionAccurate ? "text-green-400" : "text-red-400"
                }
              >
                {stockSelectionAccurate ? "✓ 选对了" : "✗ 选错了"}
              </span>
              {stockSelectionNote && (
                <span className="text-muted-foreground">
                  — {stockSelectionNote}
                </span>
              )}
            </div>
          )}
          {hasAnalysis && (
            <div className="space-y-0.5">
              {analysisItems
                .filter((i) => i.val !== null)
                .map(({ label, val, note }) => (
                  <div key={label} className="flex gap-2 text-xs">
                    <span className="text-muted-foreground w-14 shrink-0">
                      {label}
                    </span>
                    <span className={val ? "text-green-400" : "text-red-400"}>
                      {val ? "✓ 准确" : "✗ 失误"}
                    </span>
                    {note && (
                      <span className="text-muted-foreground">— {note}</span>
                    )}
                  </div>
                ))}
            </div>
          )}
          {actualEntryOpportunity && (
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-14 shrink-0">
                实际入场
              </span>
              <span className="text-foreground/80 leading-relaxed">
                {actualEntryOpportunity}
              </span>
            </div>
          )}
          {actualExitOpportunity && (
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-14 shrink-0">
                实际出场
              </span>
              <span className="text-foreground/80 leading-relaxed">
                {actualExitOpportunity}
              </span>
            </div>
          )}
          {dailySummary && (
            <div className="flex gap-2 text-xs">
              <span className="text-muted-foreground w-14 shrink-0">
                标的总结
              </span>
              <span className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {dailySummary}
              </span>
            </div>
          )}
          {/* MNQ 行情记录汇总 */}
          {hasMnqMarketNotes &&
            mnqPlan &&
            (() => {
              const TRADE_RESULT_LABELS = {
                PROFIT_MET: "符合盈利预期",
                PROFIT_PARTIAL: "部分盈利",
                BREAKEVEN: "保本",
                LOSS: "亏损",
              };
              interface ParsedOpp {
                id: string;
                description: string;
                captured: boolean | null;
                missedProcess: string;
                missedReasonCategory?: MnqMissedReasonCategory | null;
                entryApproach?: "DIRECT" | "PULLBACK" | null;
                tradeResult?: string | null;
                tradeResultNote?: string;
                tradeDirection?: "LONG" | "SHORT" | null;
                entryTime?: string;
                exitTime?: string;
                entryPrice?: string;
                exitPrice?: string;
                contracts?: string;
                stopPrice?: string;
                targetPrice?: string;
                strategyId?: string | null;
                strategyName?: string | null;
                tradeTypeId?: string | null;
                tradeTypeName?: string | null;
                plannedRiskPts?: string;
                plannedReturnPts?: string;
                missedPlannedRiskPts?: string;
                missedPlannedReturnPts?: string;
                missedRiskPts?: string;
                missedReturnPts?: string;
              }
              const ENTRY_APPROACH_SUMMARY: Record<string, string> = {
                DIRECT: "直接进入",
                PULLBACK: "等回调进入",
              };
              interface ParsedSeg {
                type?: string | null;
                note?: string;
                expectedType?: MnqMarketType | null;
                expectedDirection?: MnqMarketDirection | null;
                expectedNote?: string;
                actualType?: MnqMarketType | null;
                actualDirection?: MnqMarketDirection | null;
                actualNote?: string;
                accuracy?: MnqMarketAccuracy | null;
                deviationReason?: MnqMarketDeviationReason | null;
                secondaryDeviationReasons?: MnqMarketDeviationReason[];
                deviationNote?: string;
                opportunityImpact?: MnqMarketOpportunityImpact | null;
                impactTypes?: MnqMarketImpactType[];
                impactOpportunityIds?: string[];
                impactNote?: string;
                levelForecasts?: unknown;
                premarketPhases?: {
                  overnight?: ParsedPremarketPhase;
                  usPremarket?: ParsedPremarketPhase;
                };
                opportunities?: ParsedOpp[];
                opportunity?: string;
              }
              interface ParsedPremarketPhase {
                type?: MnqMarketType | null;
                direction?: MnqMarketDirection | null;
                note?: string;
              }
              function parseSeg(
                raw: string | null | undefined,
              ): ParsedSeg | null {
                if (!raw) return null;
                try {
                  return JSON.parse(raw) as ParsedSeg;
                } catch {
                  return null;
                }
              }
              function getOpportunities(seg: ParsedSeg): ParsedOpp[] {
                if (
                  Array.isArray(seg.opportunities) &&
                  seg.opportunities.length > 0
                )
                  return seg.opportunities;
                if (seg.opportunity?.trim())
                  return [
                    {
                      id: "legacy",
                      description: seg.opportunity,
                      captured: null,
                      missedProcess: "",
                    },
                  ];
                return [];
              }
              const MARKET_TYPE_CLASS: Record<string, string> = {
                RANGE: "text-yellow-400",
                TREND: "text-blue-400",
              };
              const segments = [
                {
                  label: "盘前行情",
                  time: undefined,
                  raw: mnqPlan.marketPreJson,
                },
                {
                  label: "开盘行情",
                  time: "09:30–10:00",
                  raw: mnqPlan.marketOpenJson,
                },
                {
                  label: "盘中行情",
                  time: "10:00–13:00",
                  raw: mnqPlan.marketMidJson,
                },
                {
                  label: "午盘行情",
                  time: "13:00–收盘",
                  raw: mnqPlan.marketAfternoonJson,
                },
              ]
                .map(({ label, time, raw }) => ({
                  label,
                  time,
                  seg: parseSeg(raw),
                }))
                .filter(({ seg }) => {
                  if (!seg) return false;
                  return Boolean(
                    seg.type ??
                    seg.note?.trim() ??
                    seg.expectedType ??
                    seg.expectedDirection ??
                    seg.expectedNote?.trim() ??
                    seg.actualType ??
                    seg.actualDirection ??
                    seg.actualNote?.trim() ??
                    (seg.premarketPhases &&
                    Object.values(seg.premarketPhases).some(
                      (phase) =>
                        phase?.type ?? phase?.direction ?? phase?.note?.trim(),
                    )
                      ? "premarketPhases"
                      : undefined) ??
                    seg.opportunityImpact ??
                    seg.impactNote?.trim() ??
                    (seg.levelForecasts ? "levelForecasts" : undefined) ??
                    ((seg.opportunities?.length ?? 0) > 0
                      ? "opportunities"
                      : undefined) ??
                    seg.opportunity?.trim(),
                  );
                });
              if (segments.length === 0) return null;
              return (
                <div className="border-border/30 space-y-2.5 border-t pt-1.5">
                  <p className="text-xs font-medium text-cyan-400">
                    MNQ 行情记录
                  </p>
                  {segments.map(({ label, time, seg }) => {
                    const opps = seg ? getOpportunities(seg) : [];
                    const isPremarket = label === "盘前行情";
                    const hasStructuredPremarket = Boolean(
                      seg?.premarketPhases,
                    );
                    const premarketPhases = isPremarket
                      ? [
                          {
                            key: "overnight",
                            label: "隔夜行情",
                            time: "19:00 之前",
                            data: seg?.premarketPhases?.overnight,
                          },
                          {
                            key: "usPremarket",
                            label: "美国盘前行情",
                            time: "19:00–21:30",
                            data: hasStructuredPremarket
                              ? seg?.premarketPhases?.usPremarket
                              : {
                                  type: seg?.type as MnqMarketType | null,
                                  note: seg?.note,
                                },
                          },
                        ].filter(({ data }) =>
                          Boolean(
                            data?.type ?? data?.direction ?? data?.note?.trim(),
                          ),
                        )
                      : [];
                    const expectedNote = seg?.expectedNote?.trim() ?? "";
                    const actualNote = isPremarket
                      ? ""
                      : seg?.actualNote?.trim().length
                        ? seg.actualNote.trim()
                        : (seg?.note?.trim() ?? "");
                    const levelForecasts = parseLevelForecasts(
                      seg?.levelForecasts,
                    );
                    const hasExpectedSummary = [
                      seg?.expectedType,
                      seg?.expectedDirection,
                      expectedNote,
                    ].some(Boolean);
                    const hasActualSummary = [
                      seg?.actualType,
                      seg?.actualDirection,
                      actualNote,
                    ].some(Boolean);
                    const affectedOpportunityLabels = opps.flatMap(
                      (opportunity, index) =>
                        seg?.impactOpportunityIds?.includes(opportunity.id)
                          ? [`机会${index + 1}`]
                          : [],
                    );
                    return (
                      <div key={label} className="space-y-1">
                        {/* 时段标题 + 行情类型 */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground/80 text-[10px] font-medium">
                            {label}
                          </span>
                          {time && (
                            <span className="text-muted-foreground/50 text-[10px]">
                              {time}
                            </span>
                          )}
                          {!isPremarket && (seg?.actualType ?? seg?.type) && (
                            <span
                              className={cn(
                                "text-[10px] font-medium",
                                MARKET_TYPE_CLASS[
                                  seg.actualType ?? seg.type ?? ""
                                ] ?? "text-muted-foreground",
                              )}
                            >
                              [
                              {MNQ_MARKET_TYPE_LABELS[
                                (seg.actualType ?? seg.type) as MnqMarketType
                              ] ??
                                seg.actualType ??
                                seg.type}
                              ]
                            </span>
                          )}
                          {seg?.accuracy && (
                            <span
                              className={cn(
                                "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                                seg.accuracy === "CORRECT" &&
                                  "border-green-700 text-green-400",
                                seg.accuracy === "PARTIAL" &&
                                  "border-amber-700 text-amber-400",
                                seg.accuracy === "WRONG" &&
                                  "border-red-700 text-red-400",
                              )}
                            >
                              判断{MNQ_MARKET_ACCURACY_LABELS[seg.accuracy]}
                            </span>
                          )}
                        </div>
                        {premarketPhases.length > 0 && (
                          <div className="grid gap-1.5 sm:grid-cols-2">
                            {premarketPhases.map((phase) => (
                              <div
                                key={phase.key}
                                className="space-y-1 rounded border border-cyan-900/30 bg-cyan-950/10 p-2"
                              >
                                <div className="flex items-center justify-between gap-2 text-[10px]">
                                  <span className="font-medium text-cyan-300">
                                    {phase.label}
                                  </span>
                                  <span className="text-muted-foreground/60">
                                    {phase.time}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 text-[10px]">
                                  {phase.data?.type && (
                                    <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-cyan-200">
                                      {MNQ_MARKET_TYPE_LABELS[phase.data.type]}
                                    </span>
                                  )}
                                  {phase.data?.direction && (
                                    <span className="rounded bg-violet-500/15 px-1.5 py-0.5 text-violet-200">
                                      {
                                        MNQ_MARKET_DIRECTION_LABELS[
                                          phase.data.direction
                                        ]
                                      }
                                    </span>
                                  )}
                                </div>
                                {phase.data?.note?.trim() && (
                                  <p className="text-foreground/65 text-[11px] leading-relaxed whitespace-pre-wrap">
                                    {phase.data.note.trim()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {hasExpectedSummary && (
                          <div className="flex gap-1.5 text-xs">
                            <span className="shrink-0 text-cyan-400/80">
                              预计
                            </span>
                            <span className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                              {[
                                seg?.expectedType
                                  ? MNQ_MARKET_TYPE_LABELS[seg.expectedType]
                                  : null,
                                seg?.expectedDirection
                                  ? MNQ_MARKET_DIRECTION_LABELS[
                                      seg.expectedDirection
                                    ]
                                  : null,
                                expectedNote.length > 0 ? expectedNote : null,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        )}
                        {hasActualSummary && (
                          <div className="flex gap-1.5 text-xs">
                            <span className="shrink-0 text-violet-400/80">
                              实际
                            </span>
                            <span className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                              {[
                                seg?.actualType
                                  ? MNQ_MARKET_TYPE_LABELS[seg.actualType]
                                  : null,
                                seg?.actualDirection
                                  ? MNQ_MARKET_DIRECTION_LABELS[
                                      seg.actualDirection
                                    ]
                                  : null,
                                actualNote.length > 0 ? actualNote : null,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        )}
                        {levelForecasts.upper.length > 0 ||
                        levelForecasts.lower.length > 0 ? (
                          <div className="grid gap-1.5 sm:grid-cols-2">
                            {(["upper", "lower"] as const).map((side) => (
                              <div
                                key={side}
                                className="border-border/40 rounded border p-1.5"
                              >
                                <p className="text-muted-foreground mb-1 text-[9px] font-medium">
                                  {side === "upper" ? "上端链" : "下端链"}
                                </p>
                                {levelForecasts[side].length > 0 ? (
                                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                    {levelForecasts[side].map((node, index) => (
                                      <span
                                        key={node.id}
                                        className={cn(
                                          "rounded border px-1.5 py-0.5",
                                          node.status === "ACTIVE" &&
                                            "border-cyan-700 text-cyan-300",
                                          node.status === "COMPLETED" &&
                                            "border-green-800 text-green-400",
                                          node.status === "PAUSED" &&
                                            "border-red-800 text-red-400",
                                          (node.status === "PLANNED" ||
                                            node.status === "INVALIDATED") &&
                                            "border-muted-foreground/20 text-muted-foreground",
                                        )}
                                      >
                                        {index + 1}. {formatLevelName(node)}
                                        {node.accuracy === "CORRECT"
                                          ? " ✓"
                                          : node.accuracy === "PARTIAL"
                                            ? " ◐"
                                            : node.accuracy === "WRONG"
                                              ? " ×"
                                              : node.accuracy ===
                                                  "NOT_TRIGGERED"
                                                ? " 未触及"
                                                : node.status === "ACTIVE"
                                                  ? " 当前"
                                                  : ""}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/50 text-[9px]">
                                    未规划
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {seg?.deviationReason && (
                          <div className="flex gap-1.5 text-[11px]">
                            <span className="shrink-0 text-orange-400/80">
                              主要偏差
                            </span>
                            <span className="text-foreground/70 leading-relaxed">
                              {
                                MNQ_MARKET_DEVIATION_REASON_LABELS[
                                  seg.deviationReason
                                ]
                              }
                              {seg.deviationNote?.trim()
                                ? ` · ${seg.deviationNote.trim()}`
                                : ""}
                            </span>
                          </div>
                        )}
                        {seg?.opportunityImpact && (
                          <div className="flex gap-1.5 text-[11px]">
                            <span
                              className={cn(
                                "shrink-0",
                                seg.opportunityImpact === "POSITIVE" &&
                                  "text-green-400",
                                seg.opportunityImpact === "NEGATIVE" &&
                                  "text-red-400",
                                seg.opportunityImpact === "NONE" &&
                                  "text-muted-foreground",
                              )}
                            >
                              机会影响
                            </span>
                            <span className="text-foreground/70 leading-relaxed">
                              {
                                MNQ_MARKET_OPPORTUNITY_IMPACT_LABELS[
                                  seg.opportunityImpact
                                ]
                              }
                              {(seg.impactTypes?.length ?? 0) > 0
                                ? ` · ${seg.impactTypes?.map((type) => MNQ_MARKET_IMPACT_TYPE_LABELS[type]).join("、")}`
                                : ""}
                              {affectedOpportunityLabels.length > 0
                                ? ` · ${affectedOpportunityLabels.join("、")}`
                                : ""}
                              {seg.impactNote?.trim()
                                ? ` · ${seg.impactNote.trim()}`
                                : ""}
                            </span>
                          </div>
                        )}
                        {opps.length > 0 && (
                          <div className="space-y-1 pl-1">
                            {opps.map((opp, idx) => (
                              <div
                                key={opp.id}
                                id={`mnq-opportunity-${opp.id}`}
                                className="scroll-mt-24 space-y-0.5 rounded border border-transparent px-1 py-0.5 target:border-cyan-500 target:bg-cyan-950/30 target:ring-2 target:ring-cyan-500/30"
                              >
                                <div className="flex items-start gap-1.5 text-xs">
                                  <span className="text-muted-foreground/50 mt-px shrink-0">
                                    机会{idx + 1}
                                  </span>
                                  <span className="text-foreground/75 flex-1 leading-relaxed whitespace-pre-wrap">
                                    {opp.description}
                                  </span>
                                  {opp.entryApproach && (
                                    <span
                                      className={cn(
                                        "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                                        opp.entryApproach === "DIRECT"
                                          ? "border-orange-700 text-orange-400"
                                          : "border-sky-700 text-sky-400",
                                      )}
                                    >
                                      {
                                        ENTRY_APPROACH_SUMMARY[
                                          opp.entryApproach
                                        ]
                                      }
                                    </span>
                                  )}
                                  {opp.captured === true && (
                                    <span className="shrink-0 text-[10px] font-medium text-green-400">
                                      ✓ 把握住
                                      {opp.tradeResult && (
                                        <span
                                          className={cn("ml-1", {
                                            "text-green-300":
                                              opp.tradeResult === "PROFIT_MET",
                                            "text-emerald-300":
                                              opp.tradeResult ===
                                              "PROFIT_PARTIAL",
                                            "text-gray-400":
                                              opp.tradeResult === "BREAKEVEN",
                                            "text-red-400":
                                              opp.tradeResult === "LOSS",
                                          })}
                                        >
                                          ·{" "}
                                          {TRADE_RESULT_LABELS[
                                            opp.tradeResult as keyof typeof TRADE_RESULT_LABELS
                                          ] ?? opp.tradeResult}
                                        </span>
                                      )}
                                    </span>
                                  )}
                                  {opp.captured === false && (
                                    <span className="shrink-0 text-[10px] font-medium text-red-400">
                                      ✗ 错过
                                    </span>
                                  )}
                                </div>
                                {opp.captured === true &&
                                  (() => {
                                    const entry = parseFloat(
                                      opp.entryPrice ?? "",
                                    );
                                    const exit = parseFloat(
                                      opp.exitPrice ?? "",
                                    );
                                    const qty = parseFloat(
                                      opp.contracts ?? "1",
                                    );
                                    const hasPrices =
                                      !isNaN(entry) &&
                                      !isNaN(exit) &&
                                      entry > 0 &&
                                      exit > 0;
                                    const dir =
                                      opp.tradeDirection === "SHORT" ? -1 : 1;
                                    const points = hasPrices
                                      ? (exit - entry) * dir
                                      : null;
                                    const pnl = hasPrices
                                      ? (exit - entry) * dir * qty * 2
                                      : null;
                                    const plannedRisk = parseFloat(
                                      opp.plannedRiskPts ?? "",
                                    );
                                    const plannedReturn = parseFloat(
                                      opp.plannedReturnPts ?? "",
                                    );
                                    const plannedTargetR =
                                      plannedRisk > 0 && plannedReturn >= 0
                                        ? plannedReturn / plannedRisk
                                        : null;
                                    return (
                                      <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 pl-8 text-xs">
                                        {opp.tradeDirection && (
                                          <span
                                            className={cn(
                                              "rounded px-1 text-[10px] font-medium",
                                              opp.tradeDirection === "LONG"
                                                ? "bg-green-900/50 text-green-400"
                                                : "bg-red-900/50 text-red-400",
                                            )}
                                          >
                                            {opp.tradeDirection === "LONG"
                                              ? "做多"
                                              : "做空"}
                                          </span>
                                        )}
                                        {opp.strategyName && (
                                          <span className="text-muted-foreground/60">
                                            策略{" "}
                                            <span className="font-medium text-blue-400/80">
                                              {opp.strategyName}
                                            </span>
                                            {opp.tradeTypeName && (
                                              <span className="text-blue-400/60">
                                                {" "}
                                                · {opp.tradeTypeName}
                                              </span>
                                            )}
                                          </span>
                                        )}
                                        {opp.entryTime && (
                                          <span className="text-muted-foreground/60">
                                            入场{" "}
                                            <span className="text-foreground/70">
                                              {opp.entryTime}
                                            </span>
                                          </span>
                                        )}
                                        {opp.exitTime && (
                                          <span className="text-muted-foreground/60">
                                            出场{" "}
                                            <span className="text-foreground/70">
                                              {opp.exitTime}
                                            </span>
                                          </span>
                                        )}
                                        {opp.entryPrice && (
                                          <span className="text-muted-foreground/60">
                                            入价{" "}
                                            <span className="text-green-400/80">
                                              {opp.entryPrice}
                                            </span>
                                          </span>
                                        )}
                                        {opp.exitPrice && (
                                          <span className="text-muted-foreground/60">
                                            出价{" "}
                                            <span className="text-foreground/70">
                                              {opp.exitPrice}
                                            </span>
                                          </span>
                                        )}
                                        {opp.contracts && (
                                          <span className="text-muted-foreground/60">
                                            合约{" "}
                                            <span className="text-foreground/70">
                                              {opp.contracts}
                                            </span>
                                          </span>
                                        )}
                                        {opp.stopPrice && (
                                          <span className="text-muted-foreground/60">
                                            止损{" "}
                                            <span className="text-red-400/70">
                                              {opp.stopPrice}
                                            </span>
                                          </span>
                                        )}
                                        {opp.targetPrice && (
                                          <span className="text-muted-foreground/60">
                                            目标{" "}
                                            <span className="text-blue-400/70">
                                              {opp.targetPrice}
                                            </span>
                                          </span>
                                        )}
                                        {plannedTargetR !== null && (
                                          <span className="text-cyan-400/80">
                                            计划 {plannedTargetR.toFixed(2)}R
                                          </span>
                                        )}
                                        {pnl !== null && points !== null && (
                                          <span
                                            className={cn(
                                              "font-medium",
                                              pnl >= 0
                                                ? "text-green-400"
                                                : "text-red-400",
                                            )}
                                          >
                                            {points >= 0 ? "+" : ""}
                                            {points.toFixed(2)}pts /{" "}
                                            {pnl >= 0 ? "+" : ""}$
                                            {pnl.toFixed(0)}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                {opp.captured === true &&
                                  opp.tradeResultNote?.trim() && (
                                    <div className="flex gap-1.5 pl-8 text-xs">
                                      <span className="shrink-0 text-green-400/60">
                                        →
                                      </span>
                                      <span className="text-muted-foreground/70 leading-relaxed whitespace-pre-wrap">
                                        {opp.tradeResultNote}
                                      </span>
                                    </div>
                                  )}
                                {opp.captured === false &&
                                  (opp.tradeDirection ?? opp.strategyName) && (
                                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 pl-8 text-xs">
                                      {opp.tradeDirection && (
                                        <span
                                          className={cn(
                                            "rounded px-1 text-[10px] font-medium",
                                            opp.tradeDirection === "LONG"
                                              ? "bg-green-900/50 text-green-400"
                                              : "bg-red-900/50 text-red-400",
                                          )}
                                        >
                                          {opp.tradeDirection === "LONG"
                                            ? "做多"
                                            : "做空"}
                                        </span>
                                      )}
                                      {opp.strategyName && (
                                        <span className="text-muted-foreground/60">
                                          策略{" "}
                                          <span className="font-medium text-blue-400/80">
                                            {opp.strategyName}
                                          </span>
                                          {opp.tradeTypeName && (
                                            <span className="text-blue-400/60">
                                              {" "}
                                              · {opp.tradeTypeName}
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                {opp.captured === false &&
                                  opp.missedReasonCategory && (
                                    <div className="pl-8">
                                      <span className="rounded border border-orange-800/50 bg-orange-950/30 px-1.5 py-0.5 text-[10px] font-medium text-orange-300">
                                        {
                                          MNQ_MISSED_REASON_LABELS[
                                            opp.missedReasonCategory
                                          ]
                                        }
                                      </span>
                                    </div>
                                  )}
                                {opp.captured === false &&
                                  opp.missedProcess.trim() && (
                                    <div className="flex gap-1.5 pl-8 text-xs">
                                      <span className="shrink-0 text-red-400/60">
                                        →
                                      </span>
                                      <span className="text-muted-foreground/70 leading-relaxed whitespace-pre-wrap">
                                        {opp.missedProcess}
                                      </span>
                                    </div>
                                  )}
                                {opp.captured === false &&
                                  [
                                    opp.missedPlannedRiskPts,
                                    opp.missedPlannedReturnPts,
                                    opp.missedRiskPts,
                                    opp.missedReturnPts,
                                  ].some(Boolean) &&
                                  (() => {
                                    const plannedRisk = parseFloat(
                                      opp.missedPlannedRiskPts ?? "",
                                    );
                                    const plannedReturn = parseFloat(
                                      opp.missedPlannedReturnPts ?? "",
                                    );
                                    const risk = parseFloat(
                                      opp.missedRiskPts ?? "",
                                    );
                                    const ret = parseFloat(
                                      opp.missedReturnPts ?? "",
                                    );
                                    const plannedR =
                                      plannedRisk > 0 && plannedReturn >= 0
                                        ? plannedReturn / plannedRisk
                                        : null;
                                    const hypotheticalR =
                                      risk > 0 && ret > 0 ? ret / risk : null;
                                    return (
                                      <div className="flex flex-wrap items-center gap-2 pl-8 text-xs">
                                        {plannedR !== null && (
                                          <span className="font-medium text-cyan-400">
                                            计划 {plannedR.toFixed(2)}R
                                          </span>
                                        )}
                                        {hypotheticalR !== null && (
                                          <span className="font-medium text-amber-400">
                                            事后潜力 {hypotheticalR.toFixed(2)}R
                                          </span>
                                        )}
                                        {plannedR !== null &&
                                          hypotheticalR !== null && (
                                            <span
                                              className={cn(
                                                "text-[10px] font-medium",
                                                hypotheticalR >= plannedR
                                                  ? "text-green-400/80"
                                                  : "text-red-400/80",
                                              )}
                                            >
                                              潜力差{" "}
                                              {hypotheticalR - plannedR >= 0
                                                ? "+"
                                                : ""}
                                              {(
                                                hypotheticalR - plannedR
                                              ).toFixed(2)}
                                              R
                                            </span>
                                          )}
                                      </div>
                                    );
                                  })()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
        </div>
      </div>
    );
  }

  function renderIntraEvalSection() {
    return (
      <div className="mt-2 space-y-2.5">
        {/* K 线维度 */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">
            实际交易 K 线维度
          </Label>
          <div className="flex flex-wrap gap-1">
            {CHART_TIMEFRAME_OPTIONS.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setChartTimeframe((prev) => (prev === tf ? null : tf));
                  setIntraSaved(false);
                }}
                className={cn(
                  "rounded border px-2 py-0.5 text-xs transition-colors",
                  chartTimeframe === tf
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                {CHART_TIMEFRAME_LABELS[tf]}
              </button>
            ))}
          </div>
        </div>

        {/* 盘前选股准确性 */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">盘前选股</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={stockSelectionAccurate === true ? "default" : "outline"}
              className={cn(
                "h-6 gap-1 text-xs",
                stockSelectionAccurate === true &&
                  "bg-green-700 hover:bg-green-800",
              )}
              onClick={() => {
                toggleBoolField(
                  setStockSelectionAccurate,
                  true,
                  stockSelectionAccurate,
                );
              }}
            >
              <ThumbsUp className="h-3 w-3" />
              选对了
            </Button>
            <Button
              size="sm"
              variant={
                stockSelectionAccurate === false ? "destructive" : "outline"
              }
              className="h-6 gap-1 text-xs"
              onClick={() => {
                toggleBoolField(
                  setStockSelectionAccurate,
                  false,
                  stockSelectionAccurate,
                );
              }}
            >
              <ThumbsDown className="h-3 w-3" />
              选错了
            </Button>
          </div>
          {stockSelectionAccurate === false && (
            <Textarea
              placeholder="选股失误原因..."
              value={stockSelectionNote}
              onChange={(e) => {
                setStockSelectionNote(e.target.value);
                setIntraSaved(false);
              }}
              rows={2}
              className="mt-1 resize-none text-xs"
            />
          )}
        </div>

        {/* 判断准确性（细分四项） */}
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">判断准确性</Label>
          {(
            [
              {
                label: "行情判断",
                val: marketJudgmentAccurate,
                set: setMarketJudgmentAccurate,
                note: marketJudgmentNote,
                setNote: setMarketJudgmentNote,
                placeholder: "行情判断失误原因...",
              },
              {
                label: "策略选择",
                val: strategySelectionAccurate,
                set: setStrategySelectionAccurate,
                note: strategySelectionNote,
                setNote: setStrategySelectionNote,
                placeholder: "策略选择失误原因...",
              },
              {
                label: "入场机会",
                val: entryOpportunityAccurate,
                set: setEntryOpportunityAccurate,
                note: entryOpportunityNote,
                setNote: setEntryOpportunityNote,
                placeholder: "入场机会判断失误原因...",
              },
              {
                label: "出场机会",
                val: exitOpportunityAccurate,
                set: setExitOpportunityAccurate,
                note: exitOpportunityNote,
                setNote: setExitOpportunityNote,
                placeholder: "出场机会判断失误原因...",
              },
            ] as Array<{
              label: string;
              val: boolean | null;
              set: (v: boolean | null) => void;
              note: string;
              setNote: (v: string) => void;
              placeholder: string;
            }>
          ).map(({ label, val, set, note, setNote, placeholder }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-14 shrink-0 text-xs">
                  {label}
                </span>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={val === true ? "default" : "outline"}
                    className={cn(
                      "h-6 gap-1 text-xs",
                      val === true && "bg-green-700 hover:bg-green-800",
                    )}
                    onClick={() => {
                      toggleBoolField(set, true, val);
                      setIntraSaved(false);
                    }}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    准确
                  </Button>
                  <Button
                    size="sm"
                    variant={val === false ? "destructive" : "outline"}
                    className="h-6 gap-1 text-xs"
                    onClick={() => {
                      toggleBoolField(set, false, val);
                      setIntraSaved(false);
                    }}
                  >
                    <ThumbsDown className="h-3 w-3" />
                    失误
                  </Button>
                </div>
              </div>
              {val === false && (
                <Textarea
                  placeholder={placeholder}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setIntraSaved(false);
                  }}
                  rows={2}
                  className="ml-16 resize-none text-xs"
                />
              )}
            </div>
          ))}
        </div>

        {/* 实际入场机会 */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">实际入场机会</Label>
          <Textarea
            placeholder="开盘后实际出现的进入机会..."
            value={actualEntryOpportunity}
            onChange={(e) => {
              setActualEntryOpportunity(e.target.value);
              setIntraSaved(false);
            }}
            rows={2}
            className="resize-none text-xs"
          />
        </div>

        {/* 实际出场机会 */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">实际出场机会</Label>
          <Textarea
            placeholder="实际有的退出机会..."
            value={actualExitOpportunity}
            onChange={(e) => {
              setActualExitOpportunity(e.target.value);
              setIntraSaved(false);
            }}
            rows={2}
            className="resize-none text-xs"
          />
        </div>

        {/* 单日标的总结 */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">单日标的总结</Label>
          <Textarea
            placeholder={`${setup.symbol} 今日整体情况总结...`}
            value={dailySummary}
            onChange={(e) => {
              setDailySummary(e.target.value);
              setIntraSaved(false);
            }}
            rows={2}
            className="resize-none text-xs"
          />
        </div>

        {/* MNQ 行情记录（仅 MNQ setup 显示） */}
        {mnqPlan && <MnqMarketNotes plan={mnqPlan} date={dateStr} />}

        {/* 保存按钮 */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleSaveIntraEval}
            disabled={intraSaving}
          >
            <Save className="h-3 w-3" />
            {intraSaving ? "保存中..." : "保存盘中评估"}
          </Button>
          {intraSaved && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Check className="h-3 w-3" />
              已保存
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Card
        className={cn(
          "transition-opacity",
          (setup.status === "INVALIDATED" || setup.status === "CANCELLED") &&
            "opacity-50",
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2 px-3 pt-3 pb-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold">{setup.symbol}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-medium",
                dirCfg.className,
              )}
            >
              {dirCfg.label}
            </span>
            {/* 优先级别 */}
            {(() => {
              const priority = (
                setup as unknown as { priority?: SetupPriority }
              ).priority;
              if (!priority || priority === "MEDIUM") return null;
              const cfg = PRIORITY_BADGE_CONFIG[priority];
              return (
                <Badge
                  variant="outline"
                  className={cn("py-0 text-xs", cfg.className)}
                >
                  {cfg.label}
                </Badge>
              );
            })()}
            {setup.strategy && (
              <Badge variant="secondary" className="py-0 text-xs">
                {setup.strategy}
              </Badge>
            )}
            {/* 交易类型 badges */}
            {(() => {
              try {
                const types = JSON.parse(
                  (setup as unknown as { selectedTradeTypes?: string })
                    .selectedTradeTypes ?? "[]",
                ) as string[];
                return types.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="border-primary/40 text-primary/80 py-0 text-xs"
                  >
                    {t}
                  </Badge>
                ));
              } catch {
                return null;
              }
            })()}
            <Badge variant={statusCfg.variant} className="py-0 text-xs">
              {statusCfg.label}
            </Badge>

            {/* 价格层级 */}
            {setup.priceTier && (
              <Badge
                variant="outline"
                className="text-muted-foreground py-0 text-xs"
              >
                {PRICE_TIER_LABELS[setup.priceTier as PriceTier]}
              </Badge>
            )}
            {/* 市值层级 */}
            {setup.marketCapTier && (
              <Badge
                variant="outline"
                className="text-muted-foreground py-0 text-xs"
              >
                {MARKET_CAP_TIER_LABELS[setup.marketCapTier as MarketCapTier]}
              </Badge>
            )}
            {/* 新闻催化剂 */}
            {setup.newsType && (
              <Badge
                variant="outline"
                className={cn(
                  "py-0 text-xs",
                  setup.newsImpact === "BULLISH" &&
                    "border-green-700 text-green-400",
                  setup.newsImpact === "BEARISH" &&
                    "border-red-700 text-red-400",
                  setup.newsImpact === "NEUTRAL" &&
                    "border-muted-foreground text-muted-foreground",
                  setup.newsImpact === "UNCERTAIN" &&
                    "border-yellow-700 text-yellow-400",
                  !setup.newsImpact &&
                    "border-muted-foreground text-muted-foreground",
                )}
              >
                {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
                {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                  <span className="ml-1 opacity-70">
                    ·{NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}
                  </span>
                )}
              </Badge>
            )}
            {/* 汇总盈亏 */}
            {totalPnL !== null && (
              <span
                className={cn(
                  "text-xs font-medium",
                  totalPnL >= 0 ? "text-green-400" : "text-red-400",
                )}
              >
                {formatPnL(totalPnL)}
              </span>
            )}
            {/* 盘中评估徽章 */}
            {(intraMode || summaryMode) && stockSelectionAccurate !== null && (
              <Badge
                variant="outline"
                className={cn(
                  "py-0 text-xs",
                  stockSelectionAccurate
                    ? "border-green-700 text-green-400"
                    : "border-red-700 text-red-400",
                )}
              >
                选股{stockSelectionAccurate ? "✓" : "✗"}
              </Badge>
            )}
            {(intraMode || summaryMode) &&
              (marketJudgmentAccurate !== null ||
                strategySelectionAccurate !== null ||
                entryOpportunityAccurate !== null ||
                exitOpportunityAccurate !== null) &&
              (() => {
                const vals = [
                  marketJudgmentAccurate,
                  strategySelectionAccurate,
                  entryOpportunityAccurate,
                  exitOpportunityAccurate,
                ].filter((v) => v !== null);
                const allOk = vals.every((v) => v === true);
                return (
                  <Badge
                    variant="outline"
                    className={cn(
                      "py-0 text-xs",
                      allOk
                        ? "border-green-700 text-green-400"
                        : "border-orange-700 text-orange-400",
                    )}
                  >
                    判断{allOk ? "✓" : "✗"}
                  </Badge>
                );
              })()}
            {/* K 线维度标签 */}
            {(intraMode || summaryMode) && chartTimeframe && (
              <Badge
                variant="outline"
                className="border-primary/50 text-primary/80 py-0 text-xs"
              >
                {CHART_TIMEFRAME_LABELS[chartTimeframe]}
              </Badge>
            )}
            {/* 盘中评估已保存指示器 */}
            {intraMode && hasIntraData && intraSaved && (
              <Badge
                variant="outline"
                className="border-green-800 py-0 text-xs text-green-400"
              >
                <Check className="mr-0.5 h-2.5 w-2.5" />
                评估已存
              </Badge>
            )}
          </div>
          {!summaryMode && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground h-6 w-6 shrink-0"
              onClick={() => setShowDelete(true)}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-1.5 px-3 pb-3 text-sm">
          {/* 策略 + 交易类型 */}
          {(() => {
            try {
              const types = JSON.parse(
                (setup as unknown as { selectedTradeTypes?: string })
                  .selectedTradeTypes ?? "[]",
              ) as string[];
              if (!setup.strategy && types.length === 0) return null;
              const label = [
                setup.strategy,
                types.length > 0 ? types.join(" / ") : null,
              ]
                .filter(Boolean)
                .join("  ·  ");
              return (
                <div className="flex gap-1.5">
                  <span className="w-8 shrink-0 text-xs font-medium text-violet-400">
                    策略
                  </span>
                  <span className="text-foreground/80 text-xs leading-tight">
                    {label}
                  </span>
                </div>
              );
            } catch {
              return null;
            }
          })()}
          {/* 催化剂 — 始终显示 */}
          <div className="flex gap-1.5">
            <span className="w-12 shrink-0 text-xs font-medium text-yellow-500/80">
              催化剂
            </span>
            {setup.newsType ? (
              <span
                className={cn(
                  "text-xs leading-tight",
                  setup.newsImpact === "BULLISH" && "text-green-400",
                  setup.newsImpact === "BEARISH" && "text-red-400",
                  setup.newsImpact === "NEUTRAL" && "text-muted-foreground",
                  setup.newsImpact === "UNCERTAIN" && "text-yellow-400",
                  !setup.newsImpact && "text-foreground/80",
                )}
              >
                {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
                {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                  <span className="ml-1 opacity-90">
                    · {NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}
                  </span>
                )}
                {setup.newsHeadline && (
                  <span className="ml-1 text-yellow-500/60">
                    — {setup.newsHeadline}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">无</span>
            )}
          </div>
          {/* MNQ 情景条件块（仅 MNQ setup 显示，替代 setupLogic） */}
          {mnqPlan ? (
            <>
              <MnqConditionsBlock
                plan={mnqPlan}
                date={dateStr}
                intraMode={intraMode}
              />
              {/* 四幕剧决策记录（仅常规趋势日 + 盘中模式） */}
              {intraMode &&
                !summaryMode &&
                mnqPlan.scenario === "TREND_REGULAR" && (
                  <MnqActTracker plan={mnqPlan} date={dateStr} />
                )}
            </>
          ) : (
            !editingConds &&
            editSetupLogic && (
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {editSetupLogic}
              </p>
            )
          )}

          {/* 三行条件 — 查看 or 编辑 */}
          <div className="space-y-1">
            {editingConds ? (
              /* 编辑模式 */
              <div className="space-y-1.5">
                <div className="mb-1 flex items-center gap-1">
                  <span className="text-muted-foreground text-xs font-medium">
                    编辑条件
                  </span>
                </div>
                {!mnqPlan && (
                  <div className="space-y-0.5">
                    <Label className="text-muted-foreground text-[10px]">
                      逻辑说明
                    </Label>
                    <Textarea
                      value={editSetupLogic}
                      onChange={(e) => setEditSetupLogic(e.target.value)}
                      placeholder="Setup 逻辑说明..."
                      rows={2}
                      className="resize-none text-xs"
                    />
                  </div>
                )}
                <div className="space-y-0.5">
                  <Label className="text-[10px] text-green-500">入场条件</Label>
                  <Textarea
                    value={editEntry}
                    onChange={(e) => setEditEntry(e.target.value)}
                    placeholder="入场条件..."
                    rows={2}
                    className="resize-none text-xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px] text-red-500">止损条件</Label>
                  <Textarea
                    value={editStop}
                    onChange={(e) => setEditStop(e.target.value)}
                    placeholder="止损条件..."
                    rows={2}
                    className="resize-none text-xs"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[10px] text-blue-400">目标条件</Label>
                  <Textarea
                    value={editTarget1}
                    onChange={(e) => setEditTarget1(e.target.value)}
                    placeholder="目标条件..."
                    rows={2}
                    className="resize-none text-xs"
                  />
                </div>
                <div className="flex gap-1.5 pt-0.5">
                  <Button
                    size="sm"
                    className="h-6 gap-1 text-xs"
                    onClick={handleSaveConditions}
                    disabled={condsSaving}
                  >
                    <Save className="h-3 w-3" />
                    {condsSaving ? "保存中..." : "保存"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground h-6 gap-1 text-xs"
                    onClick={() => setEditingConds(false)}
                    disabled={condsSaving}
                  >
                    <X className="h-3 w-3" />
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              /* 查看模式 */
              <>
                {editEntry && (
                  <div className="flex gap-1.5">
                    <span className="w-8 shrink-0 text-xs font-medium text-green-500">
                      入场
                    </span>
                    <span className="text-foreground/80 text-xs leading-tight">
                      {editEntry}
                      {setup.entryPriceNote && (
                        <span className="text-muted-foreground ml-1">
                          ({setup.entryPriceNote})
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {(editStop || setup.stopPriceNote) && (
                  <div className="flex gap-1.5">
                    <span className="w-8 shrink-0 text-xs font-medium text-red-500">
                      止损
                    </span>
                    <span className="text-foreground/80 text-xs leading-tight">
                      {editStop}
                      {setup.stopPriceNote && (
                        <span className="text-muted-foreground ml-1">
                          ({setup.stopPriceNote})
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {(editTarget1 || setup.target1PriceNote) && (
                  <div className="flex gap-1.5">
                    <span className="w-8 shrink-0 text-xs font-medium text-blue-400">
                      目标1
                    </span>
                    <span className="text-foreground/80 text-xs leading-tight">
                      {editTarget1}
                      {setup.target1PriceNote && (
                        <span className="text-muted-foreground ml-1">
                          ({setup.target1PriceNote})
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {(setup.target2Condition ??
                  (setup as unknown as { target2PriceNote?: string })
                    .target2PriceNote) && (
                  <div className="flex gap-1.5">
                    <span className="w-8 shrink-0 text-xs font-medium text-blue-400/70">
                      目标2
                    </span>
                    <span className="text-foreground/70 text-xs leading-tight">
                      {setup.target2Condition ?? ""}
                      {(setup as unknown as { target2PriceNote?: string })
                        .target2PriceNote && (
                        <span className="text-muted-foreground ml-1">
                          (
                          {
                            (setup as unknown as { target2PriceNote?: string })
                              .target2PriceNote
                          }
                          )
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {/* 编辑条件按钮 */}
                <button
                  type="button"
                  onClick={() => setEditingConds(true)}
                  className="text-muted-foreground/50 hover:text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px] transition-colors"
                >
                  <Pencil className="h-2.5 w-2.5" />
                  编辑条件
                </button>
              </>
            )}
          </div>

          {/* 错过原因 */}
          {setup.status === "MISSED" && setup.missedReason && (
            <>
              <Separator className="my-1" />
              <div className="text-muted-foreground text-xs">
                <span className="font-medium">错过：</span>
                {/* 兼容旧存量枚举 key，新数据直接存中文标签 */}
                {MISSED_REASON_LABELS[setup.missedReason as MissedReason] ??
                  setup.missedReason}
                {setup.missedNotes && (
                  <span className="ml-1">— {setup.missedNotes}</span>
                )}
              </div>
            </>
          )}

          {/* 计划 R/仓位 */}
          {(setup.plannedRiskReward ?? setup.plannedSize) && (
            <div className="text-muted-foreground flex gap-3 text-xs">
              {setup.plannedRiskReward && (
                <span>计划R: {setup.plannedRiskReward}R</span>
              )}
              {setup.plannedSize && <span>仓位: {setup.plannedSize}股</span>}
            </div>
          )}

          {/* 执行记录 */}
          {setup.executions.length > 0 && (
            <>
              <Separator className="my-1.5" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">
                    执行记录（{setup.executions.length}笔）
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-5 gap-1 text-xs"
                    onClick={() => setShowExecDialog(true)}
                  >
                    <Plus className="h-3 w-3" />
                    加仓
                  </Button>
                </div>
                {setup.executions.map((ex, i) => (
                  <ExecutionRecord
                    key={ex.id}
                    execution={ex}
                    direction={setup.direction as "LONG" | "SHORT"}
                    index={i}
                  />
                ))}
              </div>
            </>
          )}

          {/* 盘中评估区域（只读汇总） */}
          {summaryMode && renderSummaryEvalSection()}

          {/* 盘中评估区域（可折叠） */}
          {intraMode && !summaryMode && (
            <>
              <Separator className="my-1.5" />
              <button
                onClick={() => setShowIntraEval((v) => !v)}
                className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-xs transition-colors"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  盘中评估
                  {hasIntraData && !intraSaved && (
                    <span className="text-[10px] text-yellow-500">
                      ● 未保存
                    </span>
                  )}
                </span>
                {showIntraEval ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {showIntraEval && renderIntraEvalSection()}
            </>
          )}

          {/* 盘中操作按钮 */}
          {intraMode && !summaryMode && setup.status === "WATCHING" && (
            <>
              <Separator className="my-1.5" />
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-green-800 text-xs text-green-400 hover:bg-green-950"
                  disabled={statusUpdating}
                  onClick={() => setShowExecDialog(true)}
                >
                  <CheckCircle className="h-3 w-3" />
                  已执行
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-orange-800 text-xs text-orange-400 hover:bg-orange-950"
                  disabled={statusUpdating}
                  onClick={() => setShowMissPanel(true)}
                >
                  <Eye className="h-3 w-3" />
                  已错过
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground h-7 gap-1 text-xs"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatus("INVALIDATED")}
                >
                  <XCircle className="h-3 w-3" />
                  失效
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-muted-foreground h-7 gap-1 text-xs"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatus("CANCELLED")}
                >
                  <Ban className="h-3 w-3" />
                  取消
                </Button>
              </div>
            </>
          )}

          {/* 撤销按钮 */}
          {intraMode &&
            !summaryMode &&
            (setup.status === "INVALIDATED" ||
              setup.status === "CANCELLED") && (
              <>
                <Separator className="my-1.5" />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 border-blue-800 text-xs text-blue-400 hover:bg-blue-950"
                  disabled={statusUpdating}
                  onClick={() => handleQuickStatus("WATCHING")}
                >
                  <Undo2 className="h-3 w-3" />
                  撤销，恢复观察中
                </Button>
              </>
            )}

          {/* 盘中策略选择 */}
          {intraMode && !summaryMode && (
            <>
              <Separator className="my-1.5" />
              <IntraStrategySelector
                setupId={setup.id}
                dateStr={dateStr}
                currentStrategyId={
                  (setup as unknown as { strategyId?: string | null })
                    .strategyId ?? null
                }
                currentStrategy={setup.strategy ?? null}
                currentSelectedTradeTypes={(() => {
                  try {
                    return JSON.parse(
                      (setup as unknown as { selectedTradeTypes?: string })
                        .selectedTradeTypes ?? "[]",
                    ) as string[];
                  } catch {
                    return [];
                  }
                })()}
              />
            </>
          )}

          {/* Setup 截图（汇总模式内嵌显示） */}
          {screenshots && screenshots.length > 0 && (
            <>
              <Separator className="my-1.5" />
              <ScreenshotGrid screenshots={screenshots} title="Setup 截图" />
            </>
          )}
        </CardContent>
      </Card>

      {/* 确认删除 */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>删除 Setup</DialogTitle>
            <DialogDescription>
              确定删除 {setup.symbol} ({setup.strategy}) 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 错过原因面板 */}
      <MissedReasonPanel
        open={showMissPanel}
        setupId={setup.id}
        setupSymbol={setup.symbol}
        dateStr={dateStr}
        onClose={() => setShowMissPanel(false)}
        onSuccess={() => {
          setShowMissPanel(false);
          onStatusChanged?.(setup.id, "MISSED");
          router.refresh();
        }}
      />

      {/* 添加执行记录弹窗 */}
      <AddExecutionDialog
        open={showExecDialog}
        setupId={setup.id}
        setupSymbol={setup.symbol}
        direction={setup.direction as "LONG" | "SHORT" | "TBD"}
        onClose={() => setShowExecDialog(false)}
        onSuccess={() => {
          setShowExecDialog(false);
          onStatusChanged?.(setup.id, "EXECUTED");
        }}
      />
    </>
  );
}
