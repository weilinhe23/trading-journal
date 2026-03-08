"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronDown, ChevronUp, Save, Check } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/components/ui/select"
import { cn } from "~/lib/utils"

interface TradeTypeOption { id: string; name: string }
interface StrategyOption { id: string; name: string; isActive: boolean; tradeTypes: TradeTypeOption[] }

const UNDECIDED = "__UNDECIDED__"

interface Props {
  setupId: string
  dateStr: string
  currentStrategyId: string | null
  currentStrategy: string | null
  currentSelectedTradeTypes: string[]
}

export function IntraStrategySelector({
  setupId, dateStr, currentStrategyId, currentStrategy, currentSelectedTradeTypes,
}: Props) {
  const router = useRouter()
  // 没有策略时自动展开
  const [open, setOpen] = useState(!currentStrategyId)
  const [strategies, setStrategies] = useState<StrategyOption[]>([])
  const [selectedId, setSelectedId] = useState(currentStrategyId ?? UNDECIDED)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentSelectedTradeTypes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!open || strategies.length > 0) return
    fetch("/api/strategies")
      .then(r => r.json() as Promise<{ success: boolean; data?: StrategyOption[] }>)
      .then(d => {
        if (d.success && d.data) setStrategies(d.data.filter(s => s.isActive))
      })
      .catch(() => {})
  }, [open, strategies.length])

  const selectedStrategy = strategies.find(s => s.id === selectedId)

  function handleStrategyChange(id: string) {
    setSelectedId(id)
    setSelectedTypes([])
    setSaved(false)
  }

  function toggleType(name: string) {
    setSelectedTypes(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name],
    )
    setSaved(false)
  }

  const isDirty =
    selectedId !== (currentStrategyId ?? UNDECIDED) ||
    JSON.stringify([...selectedTypes].sort()) !== JSON.stringify([...currentSelectedTradeTypes].sort())

  async function handleSave() {
    setSaving(true)
    try {
      const strategyName = selectedId === UNDECIDED ? null : (selectedStrategy?.name ?? null)
      const strategyId = selectedId === UNDECIDED ? null : selectedId
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: strategyName,
          strategyId,
          selectedTradeTypes: JSON.stringify(selectedTypes),
        }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success("策略已更新")
        setSaved(true)
        router.refresh()
      } else {
        toast.error("保存失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="font-medium flex items-center gap-1.5">
          盘中策略
          {!open && currentStrategy && (
            <span className="text-violet-400">{currentStrategy}</span>
          )}
          {!currentStrategy && (
            <span className="text-yellow-500 text-[10px]">● 待定</span>
          )}
        </span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="space-y-2 pt-0.5">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-8 shrink-0">策略</Label>
            <Select value={selectedId} onValueChange={handleStrategyChange}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="选择策略..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNDECIDED} className="text-xs">待定</SelectItem>
                {strategies.map(s => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStrategy && selectedStrategy.tradeTypes.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">交易类型</Label>
              <div className="flex flex-wrap gap-1.5">
                {selectedStrategy.tradeTypes.map(tt => (
                  <button
                    key={tt.id}
                    onClick={() => toggleType(tt.name)}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded border transition-colors",
                      selectedTypes.includes(tt.name)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {tt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            <Button
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={handleSave}
              disabled={saving || !isDirty}
            >
              <Save className="h-3 w-3" />
              {saving ? "保存中..." : "保存策略"}
            </Button>
            {saved && !isDirty && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Check className="h-3 w-3" />已保存
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
