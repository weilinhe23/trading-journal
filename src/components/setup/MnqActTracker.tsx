"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Check, ChevronDown, ChevronRight, MessageSquarePlus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import type { MnqDailyPlan } from "../../../generated/prisma"
import {
  parseTrendRegularActs,
  type TrendRegularActs,
  type Act1State,
  type Act2State,
  type Act3State,
  type Act4State,
} from "~/lib/mnq-act-defs"

interface Props {
  plan: MnqDailyPlan
  date: string
}

// ─── 通用按钮对组件 ──────────────────────────────────────

function TogglePair({
  label,
  value,
  onLabel,
  offLabel,
  onToggle,
  disabled,
}: {
  label: string
  value: boolean | null
  onLabel: string
  offLabel: string
  onToggle: (val: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-foreground/80 flex-1 min-w-0">{label}</span>
      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggle(true)}
          className={cn(
            "text-[11px] px-1.5 py-0.5 rounded border transition-colors",
            disabled && "opacity-40 cursor-not-allowed",
            value === true
              ? "bg-green-700 border-green-700 text-white"
              : "border-muted-foreground/30 text-muted-foreground hover:border-green-700 hover:text-green-400",
          )}
        >
          {onLabel}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggle(false)}
          className={cn(
            "text-[11px] px-1.5 py-0.5 rounded border transition-colors",
            disabled && "opacity-40 cursor-not-allowed",
            value === false
              ? "bg-red-700 border-red-700 text-white"
              : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
          )}
        >
          {offLabel}
        </button>
      </div>
    </div>
  )
}

function ChoicePair({
  label,
  value,
  optionA,
  optionB,
  onSelect,
  disabled,
}: {
  label: string
  value: string | null
  optionA: { value: string; label: string; color: string; activeColor: string }
  optionB: { value: string; label: string; color: string; activeColor: string }
  onSelect: (val: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-foreground/80 flex-1 min-w-0">{label}</span>
      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(optionA.value)}
          className={cn(
            "text-[11px] px-1.5 py-0.5 rounded border transition-colors",
            disabled && "opacity-40 cursor-not-allowed",
            value === optionA.value
              ? optionA.activeColor
              : `border-muted-foreground/30 text-muted-foreground ${optionA.color}`,
          )}
        >
          {optionA.label}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(optionB.value)}
          className={cn(
            "text-[11px] px-1.5 py-0.5 rounded border transition-colors",
            disabled && "opacity-40 cursor-not-allowed",
            value === optionB.value
              ? optionB.activeColor
              : `border-muted-foreground/30 text-muted-foreground ${optionB.color}`,
          )}
        >
          {optionB.label}
        </button>
      </div>
    </div>
  )
}

// ─── 幕标题组件 ───────────────────────────────────────────

function ActHeader({
  title,
  badge,
  expanded,
  onToggle,
  skipped,
}: {
  title: string
  badge?: string
  expanded: boolean
  onToggle: () => void
  skipped?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-1.5 text-xs font-medium transition-colors",
        skipped ? "text-muted-foreground/50" : "text-foreground/90 hover:text-foreground",
      )}
    >
      {expanded
        ? <ChevronDown className="h-3 w-3 shrink-0" />
        : <ChevronRight className="h-3 w-3 shrink-0" />}
      <span>{title}</span>
      {badge && (
        <span className={cn(
          "text-[10px] px-1 py-0 rounded",
          skipped
            ? "bg-muted text-muted-foreground"
            : "bg-amber-900/50 text-amber-400",
        )}>
          {badge}
        </span>
      )}
    </button>
  )
}

// ─── 备注展开组件 ─────────────────────────────────────────

function NotesToggle({
  notes,
  onNotesChange,
  disabled,
}: {
  notes: string
  onNotesChange: (val: string) => void
  disabled?: boolean
}) {
  const [show, setShow] = useState(!!notes)

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        disabled={disabled}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquarePlus className="h-2.5 w-2.5" />
        添加备注
      </button>
    )
  }

  return (
    <Textarea
      placeholder="备注..."
      value={notes}
      onChange={(e) => onNotesChange(e.target.value)}
      rows={2}
      disabled={disabled}
      className="text-xs resize-none"
    />
  )
}

// ─── 主组件 ───────────────────────────────────────────────

export function MnqActTracker({ plan, date }: Props) {
  const router = useRouter()
  const [acts, setActs] = useState<TrendRegularActs>(() =>
    parseTrendRegularActs(
      (plan as unknown as { actCheckpointsJson?: string | null }).actCheckpointsJson,
    ),
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // 展开状态：默认展开第一个未完成的幕
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>(() => ({
    act1: true,
    act2: false,
    act3: false,
    act4: false,
  }))

  function toggleExpand(act: string) {
    setExpandedActs((prev) => ({ ...prev, [act]: !prev[act] }))
  }

  // Act 3 & 4 是否被 PML 守住而跳过
  const pmlHeld = acts.act2.pmlOutcome === "HELD"

  // ─── 更新函数 ──────────────────────────────────────────

  function updateAct1(patch: Partial<Act1State>) {
    setActs((prev) => {
      const newAct1 = { ...prev.act1, ...patch }
      // 自动推导方向确认
      if (newAct1.openHighBroken === false && newAct1.preMarketBias) {
        newAct1.directionConfirmed = newAct1.preMarketBias
      } else if (newAct1.openHighBroken === true) {
        newAct1.directionConfirmed = null // 需重新评估
      }
      return { ...prev, act1: newAct1 }
    })
    setSaved(false)
  }

  function updateAct2(patch: Partial<Act2State>) {
    setActs((prev) => {
      const newAct2 = { ...prev.act2, ...patch }
      // PML 守住 → 自动标记 Act 3 & 4 为 skipped
      const held = newAct2.pmlOutcome === "HELD"
      const broke = newAct2.pmlOutcome === "BROKE"
      return {
        ...prev,
        act2: { ...newAct2, switchedToRange: held ? true : newAct2.switchedToRange },
        act3: { ...prev.act3, skipped: held },
        act4: { ...prev.act4, skipped: held },
        // PML 跌破 → 解锁 Act 3 & 4
        ...(broke ? {
          act3: { ...prev.act3, skipped: false },
          act4: { ...prev.act4, skipped: false },
        } : {}),
      }
    })
    setSaved(false)
  }

  function updateAct3(patch: Partial<Act3State>) {
    setActs((prev) => ({ ...prev, act3: { ...prev.act3, ...patch } }))
    setSaved(false)
  }

  function updateAct4(patch: Partial<Act4State>) {
    setActs((prev) => ({ ...prev, act4: { ...prev.act4, ...patch } }))
    setSaved(false)
  }

  // ─── 保存 ──────────────────────────────────────────────

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actCheckpointsJson: JSON.stringify(acts),
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        setSaved(true)
        router.refresh()
      } else {
        toast.error(json.error ?? "保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  // ─── 渲染 ──────────────────────────────────────────────

  return (
    <div className="space-y-2">
      <Separator className="my-1" />
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-blue-400/90">盘中决策记录</span>
        <span className="text-[10px] px-1 rounded bg-blue-900/40 text-blue-300">四幕剧</span>
      </div>

      <div className="space-y-2 pl-0.5">
        {/* ── 第一幕：方向确认 ── */}
        <div className="space-y-1.5">
          <ActHeader
            title="第一幕：方向确认"
            badge="不交易"
            expanded={!!expandedActs.act1}
            onToggle={() => toggleExpand("act1")}
          />
          {expandedActs.act1 && (
            <div className="pl-4 space-y-1.5">
              <ChoicePair
                label="盘前偏向"
                value={acts.act1.preMarketBias}
                optionA={{
                  value: "BEARISH",
                  label: "Bearish",
                  color: "hover:border-red-700 hover:text-red-400",
                  activeColor: "bg-red-700 border-red-700 text-white",
                }}
                optionB={{
                  value: "BULLISH",
                  label: "Bullish",
                  color: "hover:border-green-700 hover:text-green-400",
                  activeColor: "bg-green-700 border-green-700 text-white",
                }}
                onSelect={(v) => updateAct1({ preMarketBias: acts.act1.preMarketBias === v ? null : v as "BEARISH" | "BULLISH" })}
              />
              <TogglePair
                label="Open High 被突破？"
                value={acts.act1.openHighBroken}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct1({ openHighBroken: acts.act1.openHighBroken === v ? null : v })}
              />
              {acts.act1.directionConfirmed && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">方向确认:</span>
                  <span className={cn(
                    "text-xs font-medium",
                    acts.act1.directionConfirmed === "BEARISH" ? "text-red-400" : "text-green-400",
                  )}>
                    {acts.act1.directionConfirmed === "BEARISH" ? "Bearish" : "Bullish"} ✓
                  </span>
                </div>
              )}
              <NotesToggle
                notes={acts.act1.notes}
                onNotesChange={(v) => updateAct1({ notes: v })}
              />
            </div>
          )}
        </div>

        {/* ── 第二幕：Early Entry ── */}
        <div className="space-y-1.5">
          <ActHeader
            title="第二幕：Early Entry — OH 做空"
            expanded={!!expandedActs.act2}
            onToggle={() => toggleExpand("act2")}
          />
          {expandedActs.act2 && (
            <div className="pl-4 space-y-1.5">
              <TogglePair
                label="OH 拒绝 K 线？"
                value={acts.act2.rejectionCandle}
                onLabel="出现"
                offLabel="未出现"
                onToggle={(v) => updateAct2({ rejectionCandle: acts.act2.rejectionCandle === v ? null : v })}
              />
              <TogglePair
                label="已入场做空？"
                value={acts.act2.entered}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct2({ entered: acts.act2.entered === v ? null : v })}
              />
              <TogglePair
                label="PML 到达？"
                value={acts.act2.pmlReached}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct2({ pmlReached: acts.act2.pmlReached === v ? null : v })}
              />
              <ChoicePair
                label="⭐ PML 结果"
                value={acts.act2.pmlOutcome}
                optionA={{
                  value: "BROKE",
                  label: "跌破→趋势确认",
                  color: "hover:border-red-700 hover:text-red-400",
                  activeColor: "bg-red-700 border-red-700 text-white",
                }}
                optionB={{
                  value: "HELD",
                  label: "守住→切换震荡",
                  color: "hover:border-amber-600 hover:text-amber-400",
                  activeColor: "bg-amber-700 border-amber-700 text-white",
                }}
                onSelect={(v) => updateAct2({ pmlOutcome: acts.act2.pmlOutcome === v ? null : v as "BROKE" | "HELD" })}
              />
              {pmlHeld && (
                <div className="text-[10px] text-amber-400/80 bg-amber-900/20 px-2 py-1 rounded">
                  PML 守住 → 已切换震荡日模式，第三幕/第四幕跳过
                </div>
              )}
              <NotesToggle
                notes={acts.act2.notes}
                onNotesChange={(v) => updateAct2({ notes: v })}
              />
            </div>
          )}
        </div>

        {/* ── 第三幕：DL 逆势反弹 ── */}
        <div className="space-y-1.5">
          <ActHeader
            title="第三幕：DL 逆势反弹"
            badge="可选"
            expanded={!!expandedActs.act3}
            onToggle={() => toggleExpand("act3")}
            skipped={pmlHeld}
          />
          {expandedActs.act3 && !pmlHeld && (
            <div className="pl-4 space-y-1.5">
              <TogglePair
                label="DL 在 PML 下方形成？"
                value={acts.act3.dlFormedBelowPml}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct3({ dlFormedBelowPml: acts.act3.dlFormedBelowPml === v ? null : v })}
              />
              <TogglePair
                label="DL-PML 间距 ≥ 100 点？"
                value={acts.act3.dlPmlDistanceSufficient}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct3({ dlPmlDistanceSufficient: acts.act3.dlPmlDistanceSufficient === v ? null : v })}
              />
              <TogglePair
                label="DL 守住 2-3 根 15min K？"
                value={acts.act3.dlHeld}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct3({ dlHeld: acts.act3.dlHeld === v ? null : v })}
              />
              <TogglePair
                label="已入场做多（50%仓）？"
                value={acts.act3.entered}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct3({ entered: acts.act3.entered === v ? null : v })}
              />
              <TogglePair
                label="到达 PML 目标？"
                value={acts.act3.reachedPmlTarget}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct3({ reachedPmlTarget: acts.act3.reachedPmlTarget === v ? null : v })}
              />
              <NotesToggle
                notes={acts.act3.notes}
                onNotesChange={(v) => updateAct3({ notes: v })}
              />
            </div>
          )}
          {expandedActs.act3 && pmlHeld && (
            <div className="pl-4 text-[10px] text-muted-foreground/60">
              PML 守住，此幕已跳过
            </div>
          )}
        </div>

        {/* ── 第四幕：PML 回踩做空 ── */}
        <div className="space-y-1.5">
          <ActHeader
            title="第四幕：PML 回踩做空"
            badge="⭐ 核心"
            expanded={!!expandedActs.act4}
            onToggle={() => toggleExpand("act4")}
            skipped={pmlHeld}
          />
          {expandedActs.act4 && !pmlHeld && (
            <div className="pl-4 space-y-1.5">
              <TogglePair
                label="价格回踩 PML？"
                value={acts.act4.pmlPullback}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct4({ pmlPullback: acts.act4.pmlPullback === v ? null : v })}
              />
              <TogglePair
                label="出现拒绝信号？"
                value={acts.act4.rejectionSignal}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct4({ rejectionSignal: acts.act4.rejectionSignal === v ? null : v })}
              />
              <TogglePair
                label="已入场做空？"
                value={acts.act4.entered}
                onLabel="是"
                offLabel="否"
                onToggle={(v) => updateAct4({ entered: acts.act4.entered === v ? null : v })}
              />

              {/* 无效条件 */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground">无效条件检查:</span>
                <TogglePair
                  label="收盘站回 PML 上方？"
                  value={acts.act4.closedAbovePml}
                  onLabel="是"
                  offLabel="否"
                  onToggle={(v) => updateAct4({ closedAbovePml: acts.act4.closedAbovePml === v ? null : v })}
                />
                <TogglePair
                  label="回踩量 > 跌破量？"
                  value={acts.act4.pullbackVolumeExceedsBreakdown}
                  onLabel="是"
                  offLabel="否"
                  onToggle={(v) => updateAct4({ pullbackVolumeExceedsBreakdown: acts.act4.pullbackVolumeExceedsBreakdown === v ? null : v })}
                />
                <TogglePair
                  label="PML 停留 > 3 根 5min K？"
                  value={acts.act4.dwellTooLong}
                  onLabel="是"
                  offLabel="否"
                  onToggle={(v) => updateAct4({ dwellTooLong: acts.act4.dwellTooLong === v ? null : v })}
                />
              </div>

              <NotesToggle
                notes={acts.act4.notes}
                onNotesChange={(v) => updateAct4({ notes: v })}
              />
            </div>
          )}
          {expandedActs.act4 && pmlHeld && (
            <div className="pl-4 text-[10px] text-muted-foreground/60">
              PML 守住，此幕已跳过
            </div>
          )}
        </div>
      </div>

      {/* ── 保存按钮 ── */}
      <div className="flex items-center gap-2 pt-0.5">
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-xs gap-1"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-3 w-3" />
          {saving ? "保存中..." : "保存决策记录"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" />已保存
          </span>
        )}
      </div>
    </div>
  )
}
