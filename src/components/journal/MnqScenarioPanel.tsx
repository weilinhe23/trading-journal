"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, X, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import type { MnqDailyPlan } from "../../../generated/prisma"
import {
  MNQ_SCENARIO_LABELS,
  MNQ_KEY_LEVEL_LABELS,
  MNQ_UPBAND_OPTIONS,
  MNQ_DOWNBAND_OPTIONS,
  type MnqScenario,
  type MnqKeyLevel,
} from "~/types"
import { getScenarioTemplate } from "~/lib/mnq-templates"
import {
  RANGE_COND_DEFS,
  TREND_A_COND_DEFS,
  TREND_B_COND_DEFS,
  TREND_C_COND_DEFS,
  type CustomCondition,
  type CustomBands,
  type ScenarioKey,
  parseCustomConditions,
  parseCustomBands,
} from "~/lib/mnq-conditions"

interface Props {
  plan: MnqDailyPlan
  date: string
  mnqSetupId: string | null
}

// ─── 本地 state 类型 ─────────────────────────────────────────────────

interface CondState {
  condRangeMovingOver1h: boolean
  condRangeVwapFlat: boolean
  condRangeNoMajorNews: boolean
  condRangePrevTrend: boolean
  condTrendSingleDir: boolean
  condTrendVwapTilted: boolean
  condFadeNewsWeak: boolean
  condHoldNewsReal: boolean
}

interface PanelCondDef {
  key: keyof CondState
  label: string
}

const RANGE_CONDITIONS: PanelCondDef[]   = RANGE_COND_DEFS.map((d) => ({ key: d.condKey as keyof CondState, label: d.label }))
const TREND_A_CONDITIONS: PanelCondDef[] = TREND_A_COND_DEFS.map((d) => ({ key: d.condKey as keyof CondState, label: d.label }))
const TREND_B_CONDITIONS: PanelCondDef[] = TREND_B_COND_DEFS.map((d) => ({ key: d.condKey as keyof CondState, label: d.label }))
const TREND_C_CONDITIONS: PanelCondDef[] = TREND_C_COND_DEFS.map((d) => ({ key: d.condKey as keyof CondState, label: d.label }))

type MarketMode = "RANGE" | "TREND" | null

function deriveMode(scenario: MnqScenario | null): MarketMode {
  if (!scenario) return null
  return scenario === "RANGE_SWEEP" ? "RANGE" : "TREND"
}

function deriveTrendScenario(hasNewsGap: boolean, gapCanHold: boolean): MnqScenario {
  if (!hasNewsGap) return "TREND_REGULAR"
  return gapCanHold ? "TREND_GAP_HOLD" : "TREND_GAP_FADE"
}

// 从 plan 中读取自定义数据（新字段，类型断言兼容旧数据）
function getPlanCustomConditions(plan: MnqDailyPlan): CustomCondition[] {
  return parseCustomConditions((plan as unknown as { customConditionsJson?: string }).customConditionsJson)
}
function getPlanCustomBands(plan: MnqDailyPlan): CustomBands {
  return parseCustomBands((plan as unknown as { customBandsJson?: string }).customBandsJson)
}

export function MnqScenarioPanel({ plan, date, mnqSetupId }: Props) {
  const router = useRouter()

  // ── 模式 & 决策树 ──
  const [mode, setMode] = useState<MarketMode>(() => deriveMode(plan.scenario as MnqScenario | null))
  const [hasNewsGap, setHasNewsGap] = useState(plan.hasNewsGap)
  const [gapCanHold, setGapCanHold] = useState(plan.gapCanHold)

  // ── Band 单选（string 以兼容自定义 label）──
  const [upBand, setUpBand] = useState<string | null>((plan.sweepUpBand ?? null))
  const [downBand, setDownBand] = useState<string | null>((plan.sweepDownBand ?? null))

  // ── 识别条件复选框（默认条件）──
  const [conds, setConds] = useState<CondState>({
    condRangeMovingOver1h: plan.condRangeMovingOver1h,
    condRangeVwapFlat:     plan.condRangeVwapFlat,
    condRangeNoMajorNews:  plan.condRangeNoMajorNews,
    condRangePrevTrend:    plan.condRangePrevTrend,
    condTrendSingleDir:    plan.condTrendSingleDir,
    condTrendVwapTilted:   plan.condTrendVwapTilted,
    condFadeNewsWeak:      plan.condFadeNewsWeak,
    condHoldNewsReal:      plan.condHoldNewsReal,
  })

  // ── 自定义条件 & 边界 ──
  const [customConds, setCustomConds] = useState<CustomCondition[]>(() => getPlanCustomConditions(plan))
  const [customBands, setCustomBands] = useState<CustomBands>(() => getPlanCustomBands(plan))

  const [notes, setNotes] = useState(plan.notes ?? "")
  const [saving, setSaving] = useState(false)

  function toggleCond(key: keyof CondState) {
    setConds((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // ── 自定义条件操作 ──
  function addCustomCond(scenarioKey: ScenarioKey, label: string) {
    if (!label.trim()) return
    setCustomConds((prev) => [
      ...prev,
      { id: Date.now().toString(36) + Math.random().toString(36).slice(2), scenario: scenarioKey, label: label.trim(), checked: false, evalValue: null, evalNote: "" },
    ])
  }

  function removeCustomCond(id: string) {
    setCustomConds((prev) => prev.filter((c) => c.id !== id))
  }

  function toggleCustomCond(id: string) {
    setCustomConds((prev) => prev.map((c) => c.id === id ? { ...c, checked: !c.checked } : c))
  }

  // ── 自定义边界操作 ──
  function addCustomBand(type: "up" | "down", label: string) {
    if (!label.trim()) return
    setCustomBands((prev) => ({ ...prev, [type]: [...prev[type], label.trim()] }))
  }

  function removeCustomBand(type: "up" | "down", label: string) {
    setCustomBands((prev) => ({ ...prev, [type]: prev[type].filter((l) => l !== label) }))
  }

  // ── 推导当前情景 ──
  const currentScenario: MnqScenario | null =
    mode === "RANGE"
      ? "RANGE_SWEEP"
      : mode === "TREND"
        ? deriveTrendScenario(hasNewsGap, gapCanHold)
        : null

  async function handleSave() {
    if (!currentScenario) {
      toast.error("请先选择市场情景")
      return
    }
    if (currentScenario === "RANGE_SWEEP" && (!upBand || !downBand)) {
      toast.error("请选择震荡日的上下边界")
      return
    }

    setSaving(true)
    try {
      // 1. 保存 MNQ 计划
      const planRes = await fetch(`/api/sessions/${date}/mnq-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: currentScenario,
          sweepUpBand: currentScenario === "RANGE_SWEEP" ? upBand : null,
          sweepDownBand: currentScenario === "RANGE_SWEEP" ? downBand : null,
          hasNewsGap,
          gapCanHold,
          ...conds,
          notes: notes || null,
          customConditionsJson: JSON.stringify(customConds),
          customBandsJson: JSON.stringify(customBands),
        }),
      })
      const planJson = (await planRes.json()) as { success: boolean; error?: string }
      if (!planJson.success) {
        toast.error(planJson.error ?? "保存 MNQ 计划失败")
        return
      }

      // 2. 用模板填充 MNQ Setup
      if (mnqSetupId) {
        const upLabel = upBand ? (MNQ_KEY_LEVEL_LABELS[upBand as MnqKeyLevel] ?? upBand) : undefined
        const downLabel = downBand ? (MNQ_KEY_LEVEL_LABELS[downBand as MnqKeyLevel] ?? downBand) : undefined
        const template = getScenarioTemplate(currentScenario, upLabel as MnqKeyLevel | null | undefined, downLabel as MnqKeyLevel | null | undefined)
        const setupRes = await fetch(`/api/sessions/${date}/setups/${mnqSetupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            direction: template.direction,
            entryCondition: template.entryCondition,
            stopCondition: template.stopCondition,
            target1Condition: template.target1Condition,
            setupLogic: template.setupLogic,
            strategy: MNQ_SCENARIO_LABELS[currentScenario],
          }),
        })
        const setupJson = (await setupRes.json()) as { success: boolean; error?: string }
        if (!setupJson.success) {
          toast.error(setupJson.error ?? "填充 Setup 模板失败")
          return
        }
      }

      toast.success(`已选择: ${MNQ_SCENARIO_LABELS[currentScenario]}`)
      router.refresh()
    } catch {
      toast.error("网络错误，保存失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span>MNQ 每日情景判断</span>
          {currentScenario && (
            <Badge variant="secondary" className="text-xs">
              {MNQ_SCENARIO_LABELS[currentScenario]}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── 第一步：选择市场模式 ── */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">今日市场结构</Label>
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              active={mode === "RANGE"}
              label="震荡日 Sweep 反转"
              description="区间震荡，等 sweep 反转"
              onClick={() => setMode("RANGE")}
            />
            <ModeCard
              active={mode === "TREND"}
              label="趋势日"
              description="单边趋势或 Gap 驱动"
              onClick={() => setMode("TREND")}
            />
          </div>
        </div>

        {/* ── 震荡日参数 ── */}
        {mode === "RANGE" && (
          <div className="space-y-3 pl-3 border-l-2 border-amber-300 dark:border-amber-700">
            {/* 识别条件 */}
            <ManageableConditionList
              title="识别条件"
              conditions={RANGE_CONDITIONS}
              state={conds}
              onToggle={toggleCond}
              customItems={customConds.filter((c) => c.scenario === "RANGE")}
              onToggleCustom={toggleCustomCond}
              onDeleteCustom={removeCustomCond}
              onAddCustom={(label) => addCustomCond("RANGE", label)}
            />

            {/* 上边界选择 */}
            <BandSelector
              label="上边界 (Upband)"
              defaultOptions={MNQ_UPBAND_OPTIONS}
              customOptions={customBands.up}
              selected={upBand}
              onSelect={setUpBand}
              onAddCustom={(label) => addCustomBand("up", label)}
              onRemoveCustom={(label) => removeCustomBand("up", label)}
            />

            {/* 下边界选择 */}
            <BandSelector
              label="下边界 (Downband)"
              defaultOptions={MNQ_DOWNBAND_OPTIONS}
              customOptions={customBands.down}
              selected={downBand}
              onSelect={setDownBand}
              onAddCustom={(label) => addCustomBand("down", label)}
              onRemoveCustom={(label) => removeCustomBand("down", label)}
            />
          </div>
        )}

        {/* ── 趋势日决策树 ── */}
        {mode === "TREND" && (
          <div className="space-y-3 pl-3 border-l-2 border-blue-300 dark:border-blue-700">

            {/* 第二步：有没有 Gap */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">盘前有消息驱动 Gap？</Label>
              <div className="flex gap-2">
                <Button
                  variant={!hasNewsGap ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setHasNewsGap(false); setGapCanHold(false) }}
                >
                  否 — 无 Gap
                </Button>
                <Button
                  variant={hasNewsGap ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setHasNewsGap(true)}
                >
                  是 — 有 Gap
                </Button>
              </div>
            </div>

            {/* 无 Gap → 情景 A */}
            {!hasNewsGap && (
              <ScenarioBlock
                scenario="TREND_REGULAR"
                scenarioKey="TREND_A"
                conditions={TREND_A_CONDITIONS}
                state={conds}
                onToggle={toggleCond}
                customItems={customConds.filter((c) => c.scenario === "TREND_A")}
                onToggleCustom={toggleCustomCond}
                onDeleteCustom={removeCustomCond}
                onAddCustom={(label) => addCustomCond("TREND_A", label)}
              />
            )}

            {/* 有 Gap → 第三步 */}
            {hasNewsGap && (
              <div className="space-y-3 pl-3 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Gap 能 Hold 吗？</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={!gapCanHold ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setGapCanHold(false)}
                    >
                      否 — PDH/PDL 被拒绝
                    </Button>
                    <Button
                      variant={gapCanHold ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setGapCanHold(true)}
                    >
                      是 — 站稳关键位
                    </Button>
                  </div>
                </div>

                {!gapCanHold && (
                  <ScenarioBlock
                    scenario="TREND_GAP_FADE"
                    scenarioKey="TREND_B"
                    conditions={TREND_B_CONDITIONS}
                    state={conds}
                    onToggle={toggleCond}
                    customItems={customConds.filter((c) => c.scenario === "TREND_B")}
                    onToggleCustom={toggleCustomCond}
                    onDeleteCustom={removeCustomCond}
                    onAddCustom={(label) => addCustomCond("TREND_B", label)}
                  />
                )}
                {gapCanHold && (
                  <ScenarioBlock
                    scenario="TREND_GAP_HOLD"
                    scenarioKey="TREND_C"
                    conditions={TREND_C_CONDITIONS}
                    state={conds}
                    onToggle={toggleCond}
                    customItems={customConds.filter((c) => c.scenario === "TREND_C")}
                    onToggleCustom={toggleCustomCond}
                    onDeleteCustom={removeCustomCond}
                    onAddCustom={(label) => addCustomCond("TREND_C", label)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ── 备注 ── */}
        {mode && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">备注</Label>
            <Textarea
              placeholder="今日情景补充说明..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>
        )}

        {/* ── 保存按钮 ── */}
        {mode && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? "保存中..." : "保存并填充 Setup"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── 子组件 ───────────────────────────────────────────────────────────

function ModeCard({
  active, label, description, onClick,
}: {
  active: boolean
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-lg border-2 p-3 text-left transition-all cursor-pointer
        ${active
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-muted hover:border-muted-foreground/30"
        }
      `}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
    </button>
  )
}

// ─── 可勾选的条件清单（含自定义条件管理）────────────────────────────

function ManageableConditionList({
  title,
  conditions,
  state,
  onToggle,
  customItems,
  onToggleCustom,
  onDeleteCustom,
  onAddCustom,
}: {
  title: string
  conditions: PanelCondDef[]
  state: CondState
  onToggle: (key: keyof CondState) => void
  customItems: CustomCondition[]
  onToggleCustom: (id: string) => void
  onDeleteCustom: (id: string) => void
  onAddCustom: (label: string) => void
}) {
  const [newLabel, setNewLabel] = useState("")

  function handleAdd() {
    if (!newLabel.trim()) return
    onAddCustom(newLabel.trim())
    setNewLabel("")
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{title}</Label>
      <div className="space-y-1">
        {/* 默认条件 */}
        {conditions.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className="flex items-center gap-2 w-full text-left group"
          >
            <span
              className={`
                flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors
                ${state[key]
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 group-hover:border-muted-foreground/60"
                }
              `}
            >
              {state[key] && <Check className="h-3 w-3" />}
            </span>
            <span className={`text-xs ${state[key] ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
          </button>
        ))}

        {/* 自定义条件 */}
        {customItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1 group">
            <button
              type="button"
              onClick={() => onToggleCustom(item.id)}
              className="flex items-center gap-2 flex-1 text-left"
            >
              <span
                className={`
                  flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors
                  ${item.checked
                    ? "bg-amber-600 border-amber-600 text-white"
                    : "border-muted-foreground/30 group-hover:border-muted-foreground/60"
                  }
                `}
              >
                {item.checked && <Check className="h-3 w-3" />}
              </span>
              <span className={`text-xs ${item.checked ? "text-amber-400" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onDeleteCustom(item.id)}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground/50 hover:text-destructive transition-all shrink-0"
              title="删除此条件"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* 添加自定义条件 */}
        <div className="flex gap-1 items-center pt-0.5">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd() } }}
            placeholder="添加识别条件..."
            className="h-6 text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleAdd}
            disabled={!newLabel.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── 边界选择器（含自定义边界管理）─────────────────────────────────

function BandSelector({
  label,
  defaultOptions,
  customOptions,
  selected,
  onSelect,
  onAddCustom,
  onRemoveCustom,
}: {
  label: string
  defaultOptions: readonly MnqKeyLevel[]
  customOptions: string[]
  selected: string | null
  onSelect: (v: string | null) => void
  onAddCustom: (label: string) => void
  onRemoveCustom: (label: string) => void
}) {
  const [newBand, setNewBand] = useState("")

  function handleAdd() {
    if (!newBand.trim()) return
    onAddCustom(newBand.trim())
    setNewBand("")
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {/* 默认选项 */}
        {defaultOptions.map((level) => (
          <Button
            key={level}
            variant={selected === level ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onSelect(selected === level ? null : level)}
          >
            {MNQ_KEY_LEVEL_LABELS[level]}
          </Button>
        ))}

        {/* 自定义选项 */}
        {customOptions.map((opt) => (
          <div key={opt} className="relative group">
            <Button
              variant={selected === opt ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs pr-5"
              onClick={() => onSelect(selected === opt ? null : opt)}
            >
              {opt}
            </Button>
            <button
              type="button"
              onClick={() => {
                if (selected === opt) onSelect(null)
                onRemoveCustom(opt)
              }}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-background border rounded-full p-0 w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
              title="删除此选项"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 添加自定义边界 */}
      <div className="flex gap-1 items-center pt-0.5">
        <Input
          value={newBand}
          onChange={(e) => setNewBand(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd() } }}
          placeholder="自定义关键位..."
          className="h-6 text-xs"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleAdd}
          disabled={!newBand.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// ─── 情景结果块（带 badge + 可勾选条件含自定义）────────────────────

function ScenarioBlock({
  scenario,
  scenarioKey,
  conditions,
  state,
  onToggle,
  customItems,
  onToggleCustom,
  onDeleteCustom,
  onAddCustom,
}: {
  scenario: MnqScenario
  scenarioKey: ScenarioKey
  conditions: PanelCondDef[]
  state: CondState
  onToggle: (key: keyof CondState) => void
  customItems: CustomCondition[]
  onToggleCustom: (id: string) => void
  onDeleteCustom: (id: string) => void
  onAddCustom: (label: string) => void
}) {
  return (
    <div className="rounded-md bg-muted/50 p-2.5 space-y-2">
      <Badge variant="default" className="text-xs">
        {MNQ_SCENARIO_LABELS[scenario]}
      </Badge>
      <ManageableConditionList
        title="识别条件"
        conditions={conditions}
        state={state}
        onToggle={onToggle}
        customItems={customItems}
        onToggleCustom={onToggleCustom}
        onDeleteCustom={onDeleteCustom}
        onAddCustom={onAddCustom}
      />
    </div>
  )
}
