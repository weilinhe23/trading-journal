"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import type { Execution } from "../../../generated/prisma"

interface Props {
  execution: Execution
  direction: "LONG" | "SHORT"
  index: number
}

export function ExecutionRecord({ execution, direction, index }: Props) {
  const router = useRouter()
  const [editingExit, setEditingExit] = useState(false)
  const [exitPrice, setExitPrice] = useState(execution.exitPrice?.toString() ?? "")
  const [exitTime, setExitTime] = useState(
    execution.exitTime ? format(new Date(execution.exitTime), "HH:mm") : "",
  )
  const [saving, setSaving] = useState(false)

  // 实时估算（编辑状态下）
  const estPnL = (() => {
    const xp = parseFloat(exitPrice)
    if (!xp) return null
    const mult = direction === "LONG" ? 1 : -1
    return (xp - execution.entryPrice) * execution.quantity * mult - execution.commission
  })()

  async function handleSaveExit() {
    if (!exitPrice || parseFloat(exitPrice) <= 0) { toast.error("请填写出场价"); return }
    setSaving(true)
    try {
      const today = format(new Date(execution.entryTime), "yyyy-MM-dd")
      const body: Record<string, unknown> = {
        exitPrice: parseFloat(exitPrice),
      }
      if (exitTime) body.exitTime = `${today}T${exitTime}:00.000Z`

      const res = await fetch(`/api/executions/${execution.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success("出场价已更新")
        setEditingExit(false)
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

  async function handleDelete() {
    if (!confirm("确定删除此执行记录？")) return
    try {
      const res = await fetch(`/api/executions/${execution.id}`, { method: "DELETE" })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success("执行记录已删除")
        router.refresh()
      } else {
        toast.error("删除失败")
      }
    } catch {
      toast.error("网络错误")
    }
  }

  const entryTimeStr = format(new Date(execution.entryTime), "HH:mm")
  const exitTimeStr = execution.exitTime ? format(new Date(execution.exitTime), "HH:mm") : null
  const isOpen = !execution.exitPrice

  return (
    <div className="text-xs space-y-2 p-2 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground">第 {index + 1} 笔</span>
        <div className="flex items-center gap-1">
          {isOpen && (
            <span className="text-orange-400 text-xs">持仓中</span>
          )}
          {!isOpen && execution.pnl !== null && (
            <span className={cn(
              "font-medium",
              execution.pnl >= 0 ? "text-green-400" : "text-red-400",
            )}>
              {formatPnL(execution.pnl)}
            </span>
          )}
          {isOpen && !editingExit && (
            <Button
              variant="ghost" size="icon"
              className="h-5 w-5 text-muted-foreground"
              onClick={() => setEditingExit(true)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost" size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* 入场/出场数据 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">入场价</span>
          <span className="font-medium">${execution.entryPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">入场时间</span>
          <span>{entryTimeStr}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">出场价</span>
          <span className={isOpen ? "text-muted-foreground" : "font-medium"}>
            {execution.exitPrice ? `$${execution.exitPrice.toFixed(2)}` : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">出场时间</span>
          <span>{exitTimeStr ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">数量</span>
          <span>{execution.quantity} 股</span>
        </div>
        {execution.commission > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">手续费</span>
            <span>${execution.commission.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* 补录出场价 */}
      {editingExit && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">补录出场价</Label>
            <div className="flex gap-2">
              <Input
                type="number" step="0.01" placeholder="出场价"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                className="text-xs h-7"
              />
              <Input
                type="time" value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                className="text-xs h-7 w-28"
              />
            </div>
            {estPnL !== null && (
              <div className={cn(
                "text-xs font-medium px-2 py-1 rounded text-center",
                estPnL >= 0 ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400",
              )}>
                预估盈亏：{estPnL >= 0 ? "+" : ""}${estPnL.toFixed(2)}
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs flex-1" onClick={handleSaveExit} disabled={saving}>
                {saving ? "保存中..." : "保存"}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingExit(false)}>
                取消
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 执行纪律 */}
      {(execution.entryConditionMet !== null || execution.exitConditionMet !== null) && (
        <>
          <Separator />
          <div className="space-y-1">
            {execution.entryConditionMet !== null && (
              <div className="flex items-center gap-1.5">
                {execution.entryConditionMet
                  ? <CheckCircle className="h-3 w-3 text-green-400" />
                  : <XCircle className="h-3 w-3 text-red-400" />}
                <span className="text-muted-foreground">
                  入场条件{execution.entryConditionMet ? "已满足" : "未满足"}
                </span>
                {execution.entryConditionNotes && (
                  <span className="text-muted-foreground/70">— {execution.entryConditionNotes}</span>
                )}
              </div>
            )}
            {execution.exitConditionMet !== null && (
              <div className="flex items-center gap-1.5">
                {execution.exitConditionMet
                  ? <CheckCircle className="h-3 w-3 text-green-400" />
                  : <XCircle className="h-3 w-3 text-red-400" />}
                <span className="text-muted-foreground">
                  出场条件{execution.exitConditionMet ? "已满足" : "未满足"}
                </span>
                {execution.exitConditionNotes && (
                  <span className="text-muted-foreground/70">— {execution.exitConditionNotes}</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
