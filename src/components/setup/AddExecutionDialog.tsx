"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"

interface Props {
  open: boolean
  setupId: string
  setupSymbol: string
  direction: "LONG" | "SHORT" | "TBD"
  onClose: () => void
  onSuccess: () => void
}

function BoolToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={cn(
            "flex-1 py-1.5 text-xs rounded-md border transition-colors",
            value === true
              ? "border-green-600 bg-green-950 text-green-400"
              : "border-border text-muted-foreground hover:border-muted-foreground",
          )}
        >
          ✓ 是
        </button>
        <button
          onClick={() => onChange(false)}
          className={cn(
            "flex-1 py-1.5 text-xs rounded-md border transition-colors",
            value === false
              ? "border-red-600 bg-red-950 text-red-400"
              : "border-border text-muted-foreground hover:border-muted-foreground",
          )}
        >
          ✗ 否
        </button>
      </div>
    </div>
  )
}

export function AddExecutionDialog({
  open, setupId, setupSymbol, direction, onClose, onSuccess,
}: Props) {
  const router = useRouter()
  const now = format(new Date(), "HH:mm")
  const today = format(new Date(), "yyyy-MM-dd")

  const [actualDirection, setActualDirection] = useState<"LONG" | "SHORT">(
    direction === "TBD" ? "LONG" : direction,
  )
  const [entryPrice, setEntryPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [entryTime, setEntryTime] = useState(now)
  const [exitPrice, setExitPrice] = useState("")
  const [exitTime, setExitTime] = useState("")
  const [commission, setCommission] = useState("0")
  const [entryConditionMet, setEntryConditionMet] = useState<boolean | null>(null)
  const [entryConditionNotes, setEntryConditionNotes] = useState("")
  const [exitConditionMet, setExitConditionMet] = useState<boolean | null>(null)
  const [exitConditionNotes, setExitConditionNotes] = useState("")
  const [saving, setSaving] = useState(false)

  function reset() {
    setActualDirection(direction === "TBD" ? "LONG" : direction)
    setEntryPrice(""); setQuantity(""); setEntryTime(now)
    setExitPrice(""); setExitTime(""); setCommission("0")
    setEntryConditionMet(null); setEntryConditionNotes("")
    setExitConditionMet(null); setExitConditionNotes("")
  }

  function handleClose() { reset(); onClose() }

  // 实时估算盈亏（仅显示用）
  const estPnL = (() => {
    const ep = parseFloat(entryPrice)
    const xp = parseFloat(exitPrice)
    const qty = parseInt(quantity, 10)
    if (!ep || !xp || !qty) return null
    const mult = actualDirection === "LONG" ? 1 : -1
    return (xp - ep) * qty * mult - parseFloat(commission || "0")
  })()

  async function handleSubmit() {
    if (!entryPrice || parseFloat(entryPrice) <= 0) { toast.error("请填写入场价"); return }
    if (!quantity || parseInt(quantity, 10) <= 0) { toast.error("请填写数量"); return }

    setSaving(true)
    try {
      const entryDatetime = `${today}T${entryTime.includes(":") ? entryTime : `${entryTime}:00`}:00.000Z`
      const body: Record<string, unknown> = {
        setupId,
        actualDirection,
        entryPrice: parseFloat(entryPrice),
        quantity: parseInt(quantity, 10),
        entryTime: entryDatetime,
        commission: parseFloat(commission || "0"),
      }
      if (exitPrice && parseFloat(exitPrice) > 0) {
        body.exitPrice = parseFloat(exitPrice)
        if (exitTime) body.exitTime = `${today}T${exitTime}:00.000Z`
      }
      if (entryConditionMet !== null) body.entryConditionMet = entryConditionMet
      if (entryConditionNotes.trim()) body.entryConditionNotes = entryConditionNotes.trim()
      if (exitConditionMet !== null) body.exitConditionMet = exitConditionMet
      if (exitConditionNotes.trim()) body.exitConditionNotes = exitConditionNotes.trim()

      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success(`${setupSymbol} 执行记录已保存`)
        reset()
        onSuccess()
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
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>添加执行记录 — {setupSymbol}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 实际方向选择 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              实际执行方向
              {direction !== "TBD" && actualDirection !== direction && (
                <span className="ml-1 text-yellow-500">（与计划方向不同）</span>
              )}
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActualDirection("LONG")}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md border transition-colors",
                  actualDirection === "LONG"
                    ? "border-green-600 bg-green-950 text-green-400"
                    : "border-border text-muted-foreground hover:border-muted-foreground",
                )}
              >
                做多 Long
              </button>
              <button
                type="button"
                onClick={() => setActualDirection("SHORT")}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md border transition-colors",
                  actualDirection === "SHORT"
                    ? "border-red-600 bg-red-950 text-red-400"
                    : "border-border text-muted-foreground hover:border-muted-foreground",
                )}
              >
                做空 Short
              </button>
            </div>
          </div>

          {/* 入场数据 */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-green-400">入场数据</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">入场价 *</Label>
                <Input
                  type="number" step="0.01" placeholder="185.50"
                  value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">数量（股）*</Label>
                <Input
                  type="number" placeholder="100"
                  value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">入场时间</Label>
                <Input
                  type="time" value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* 出场数据（可选，盘后填） */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-red-400">
              出场数据
              <span className="text-muted-foreground font-normal ml-1">（可选，盘后补填）</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">出场价</Label>
                <Input
                  type="number" step="0.01" placeholder="190.00"
                  value={exitPrice} onChange={(e) => setExitPrice(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">出场时间</Label>
                <Input
                  type="time" value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">手续费</Label>
                <Input
                  type="number" step="0.01" placeholder="0"
                  value={commission} onChange={(e) => setCommission(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* 实时盈亏预估 */}
            {estPnL !== null && (
              <div className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-md text-center",
                estPnL >= 0 ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400",
              )}>
                预估盈亏：{estPnL >= 0 ? "+" : ""}${estPnL.toFixed(2)}
              </div>
            )}
          </div>

          <Separator />

          {/* 执行纪律评估 */}
          <div className="space-y-3">
            <Label className="text-xs font-medium">执行纪律评估</Label>
            <BoolToggle
              label="入场时计划条件是否已满足？"
              value={entryConditionMet}
              onChange={setEntryConditionMet}
            />
            {entryConditionMet === false && (
              <Textarea
                placeholder="说明：例如追了 $0.30，VWAP 还没站稳就进了..."
                value={entryConditionNotes}
                onChange={(e) => setEntryConditionNotes(e.target.value)}
                rows={2}
                className="resize-none text-xs"
              />
            )}

            {exitPrice && (
              <>
                <BoolToggle
                  label="出场是否符合原定条件？"
                  value={exitConditionMet}
                  onChange={setExitConditionMet}
                />
                {exitConditionMet === false && (
                  <Textarea
                    placeholder="说明：例如目标一到了就全跑，没等目标二..."
                    value={exitConditionNotes}
                    onChange={(e) => setExitConditionNotes(e.target.value)}
                    rows={2}
                    className="resize-none text-xs"
                  />
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : "保存执行记录"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
