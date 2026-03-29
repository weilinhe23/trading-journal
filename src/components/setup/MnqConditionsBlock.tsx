"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ThumbsUp, ThumbsDown, Save, Check } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import type { MnqDailyPlan } from "../../../generated/prisma"
import {
  MNQ_SCENARIO_LABELS,
  MNQ_KEY_LEVEL_LABELS,
  type MnqScenario,
  type MnqKeyLevel,
} from "~/types"
import {
  getCheckedCondDefs,
  mnqScenarioToKey,
  parseCustomConditions,
  type MnqEvalKey,
  type CustomCondition,
} from "~/lib/mnq-conditions"

interface Props {
  plan: MnqDailyPlan
  date: string
  intraMode?: boolean
}

type EvalState = Record<MnqEvalKey, boolean | null>
type EvalNotes = Partial<Record<MnqEvalKey, string>>

function initEvalState(plan: MnqDailyPlan): EvalState {
  return {
    evalRangeMovingOver1h: plan.evalRangeMovingOver1h ?? null,
    evalRangeVwapFlat:     plan.evalRangeVwapFlat     ?? null,
    evalRangeNoMajorNews:  plan.evalRangeNoMajorNews  ?? null,
    evalRangePrevTrend:    plan.evalRangePrevTrend     ?? null,
    evalTrendSingleDir:    plan.evalTrendSingleDir     ?? null,
    evalTrendVwapTilted:   plan.evalTrendVwapTilted    ?? null,
    evalFadeNewsWeak:      plan.evalFadeNewsWeak        ?? null,
    evalHoldNewsReal:      plan.evalHoldNewsReal        ?? null,
    evalUpBand:            plan.evalUpBand              ?? null,
    evalDownBand:          plan.evalDownBand            ?? null,
  }
}

function initEvalNotes(plan: MnqDailyPlan): EvalNotes {
  try {
    const raw = (plan as unknown as { evalNotesJson?: string | null }).evalNotesJson
    return raw ? (JSON.parse(raw) as EvalNotes) : {}
  } catch { return {} }
}

export function MnqConditionsBlock({ plan, date, intraMode = false }: Props) {
  const router = useRouter()
  const scenario = plan.scenario as MnqScenario | null
  const checkedDefs = getCheckedCondDefs(plan, scenario)

  const hasUpBand   = !!plan.sweepUpBand
  const hasDownBand = !!plan.sweepDownBand
  const isRange     = scenario === "RANGE_SWEEP"

  // 自定义条件：只显示当前情景下已勾选的
  const allCustomConds = parseCustomConditions(
    (plan as unknown as { customConditionsJson?: string }).customConditionsJson
  )
  const checkedCustomConds = scenario
    ? allCustomConds.filter(
        (c) => c.checked && c.scenario === mnqScenarioToKey(scenario)
      )
    : []

  // 如果没有任何已选条件，也没有 band，则不渲染
  const hasAnything =
    checkedDefs.length > 0 ||
    checkedCustomConds.length > 0 ||
    (isRange && (hasUpBand || hasDownBand))
  if (!scenario && !hasAnything) return null

  const [evals, setEvals] = useState<EvalState>(() => initEvalState(plan))
  const [evalNotes, setEvalNotes] = useState<EvalNotes>(() => initEvalNotes(plan))
  // 自定义条件的评估状态（id → { evalValue, evalNote }）
  const [customEvals, setCustomEvals] = useState<Record<string, { evalValue: boolean | null; evalNote: string }>>(
    () => Object.fromEntries(
      allCustomConds.map((c) => [c.id, { evalValue: c.evalValue, evalNote: c.evalNote }])
    )
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleEval(key: MnqEvalKey, value: boolean) {
    setEvals((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }))
    setSaved(false)
  }

  function setNote(key: MnqEvalKey, text: string) {
    setEvalNotes((prev) => ({ ...prev, [key]: text }))
    setSaved(false)
  }

  function toggleCustomEval(id: string, value: boolean) {
    setCustomEvals((prev) => {
      const cur = prev[id] ?? { evalValue: null, evalNote: "" }
      return { ...prev, [id]: { evalValue: cur.evalValue === value ? null : value, evalNote: cur.evalNote } }
    })
    setSaved(false)
  }

  function setCustomNote(id: string, text: string) {
    setCustomEvals((prev) => {
      const cur = prev[id] ?? { evalValue: null, evalNote: "" }
      return { ...prev, [id]: { evalValue: cur.evalValue, evalNote: text } }
    })
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    // 将自定义评估结果写回 customConditionsJson
    const updatedCustomConds: CustomCondition[] = allCustomConds.map((c) => ({
      ...c,
      evalValue: customEvals[c.id]?.evalValue ?? c.evalValue,
      evalNote:  customEvals[c.id]?.evalNote  ?? c.evalNote,
    }))
    try {
      const res = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...evals,
          evalNotesJson: JSON.stringify(evalNotes),
          customConditionsJson: JSON.stringify(updatedCustomConds),
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

  return (
    <div className="space-y-2">
      <Separator className="my-1" />

      {/* 情景标签 + 标题 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-amber-500/90">MNQ 情景</span>
        {scenario && (
          <Badge variant="outline" className="text-xs py-0 border-amber-600/50 text-amber-400">
            {MNQ_SCENARIO_LABELS[scenario]}
          </Badge>
        )}
      </div>

      {/* 已勾选的识别条件（默认 + 自定义） */}
      {(checkedDefs.length > 0 || checkedCustomConds.length > 0) && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            {intraMode ? "盘前识别条件 — 盘中评估" : "盘前识别条件"}
          </Label>
          <div className="space-y-1.5">
            {/* 默认条件 */}
            {checkedDefs.map(({ condKey, evalKey, label }) => (
              <ConditionRow
                key={condKey}
                label={label}
                evalKey={evalKey}
                evalValue={evals[evalKey]}
                noteValue={evalNotes[evalKey] ?? ""}
                intraMode={intraMode}
                onToggle={toggleEval}
                onNoteChange={setNote}
              />
            ))}
            {/* 自定义条件 */}
            {checkedCustomConds.map((item) => (
              <CustomConditionRow
                key={item.id}
                label={item.label}
                evalValue={customEvals[item.id]?.evalValue ?? null}
                noteValue={customEvals[item.id]?.evalNote ?? ""}
                intraMode={intraMode}
                onToggle={(val) => toggleCustomEval(item.id, val)}
                onNoteChange={(text) => setCustomNote(item.id, text)}
              />
            ))}
          </div>
        </div>
      )}

      {/* upband / downband（仅震荡日且已选时显示）*/}
      {isRange && (hasUpBand || hasDownBand) && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            {intraMode ? "区间边界 — 盘中评估" : "区间边界"}
          </Label>
          <div className="space-y-1.5">
            {hasUpBand && (
              <ConditionRow
                label={`上边界: ${MNQ_KEY_LEVEL_LABELS[plan.sweepUpBand as MnqKeyLevel] ?? plan.sweepUpBand}`}
                evalKey="evalUpBand"
                evalValue={evals.evalUpBand}
                noteValue={evalNotes.evalUpBand ?? ""}
                intraMode={intraMode}
                onToggle={toggleEval}
                onNoteChange={setNote}
              />
            )}
            {hasDownBand && (
              <ConditionRow
                label={`下边界: ${MNQ_KEY_LEVEL_LABELS[plan.sweepDownBand as MnqKeyLevel] ?? plan.sweepDownBand}`}
                evalKey="evalDownBand"
                evalValue={evals.evalDownBand}
                noteValue={evalNotes.evalDownBand ?? ""}
                intraMode={intraMode}
                onToggle={toggleEval}
                onNoteChange={setNote}
              />
            )}
          </div>
        </div>
      )}

      {/* 保存按钮（只在盘中模式显示）*/}
      {intraMode && (
        <div className="flex items-center gap-2 pt-0.5">
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs gap-1"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-3 w-3" />
            {saving ? "保存中..." : "保存情景评估"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Check className="h-3 w-3" />已保存
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 单行条件（静态显示 or 盘中评估）────────────────────────────────

function ConditionRow({
  label,
  evalKey,
  evalValue,
  noteValue,
  intraMode,
  onToggle,
  onNoteChange,
}: {
  label: string
  evalKey: MnqEvalKey
  evalValue: boolean | null
  noteValue: string
  intraMode: boolean
  onToggle: (key: MnqEvalKey, value: boolean) => void
  onNoteChange: (key: MnqEvalKey, text: string) => void
}) {
  // 静态模式：只显示文字
  if (!intraMode) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60 shrink-0 mt-0.5" />
        <span className="text-xs text-foreground/80">{label}</span>
      </div>
    )
  }

  // 盘中评估模式：文字 + 准确/失误按钮 + 失误时显示备注框
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-foreground/80 flex-1 min-w-0">{label}</span>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggle(evalKey, true)}
            className={cn(
              "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded border transition-colors",
              evalValue === true
                ? "bg-green-700 border-green-700 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-green-700 hover:text-green-400",
            )}
          >
            <ThumbsUp className="h-2.5 w-2.5" />准
          </button>
          <button
            type="button"
            onClick={() => onToggle(evalKey, false)}
            className={cn(
              "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded border transition-colors",
              evalValue === false
                ? "bg-red-700 border-red-700 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
            )}
          >
            <ThumbsDown className="h-2.5 w-2.5" />误
          </button>
        </div>
      </div>
      {evalValue === false && (
        <Textarea
          placeholder="实际情况说明..."
          value={noteValue}
          onChange={(e) => onNoteChange(evalKey, e.target.value)}
          rows={2}
          className="text-xs resize-none"
        />
      )}
    </div>
  )
}

// ─── 自定义条件行（id-based，不依赖 MnqEvalKey）──────────────────────

function CustomConditionRow({
  label,
  evalValue,
  noteValue,
  intraMode,
  onToggle,
  onNoteChange,
}: {
  label: string
  evalValue: boolean | null
  noteValue: string
  intraMode: boolean
  onToggle: (value: boolean) => void
  onNoteChange: (text: string) => void
}) {
  if (!intraMode) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600/60 shrink-0 mt-0.5" />
        <span className="text-xs text-foreground/80">{label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-amber-400/90 flex-1 min-w-0">{label}</span>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onToggle(true)}
            className={cn(
              "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded border transition-colors",
              evalValue === true
                ? "bg-green-700 border-green-700 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-green-700 hover:text-green-400",
            )}
          >
            <ThumbsUp className="h-2.5 w-2.5" />准
          </button>
          <button
            type="button"
            onClick={() => onToggle(false)}
            className={cn(
              "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded border transition-colors",
              evalValue === false
                ? "bg-red-700 border-red-700 text-white"
                : "border-muted-foreground/30 text-muted-foreground hover:border-red-700 hover:text-red-400",
            )}
          >
            <ThumbsDown className="h-2.5 w-2.5" />误
          </button>
        </div>
      </div>
      {evalValue === false && (
        <Textarea
          placeholder="实际情况说明..."
          value={noteValue}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
          className="text-xs resize-none"
        />
      )}
    </div>
  )
}
