"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"
import type { MissedReasonOption } from "~/types"

interface Props {
  open: boolean
  setupId: string
  setupSymbol: string
  dateStr: string
  onClose: () => void
  onSuccess: () => void
}

export function MissedReasonPanel({ open, setupId, setupSymbol, dateStr, onClose, onSuccess }: Props) {
  const [options, setOptions] = useState<MissedReasonOption[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)

  // 新增原因的输入状态
  const [showAddInput, setShowAddInput] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [addingOption, setAddingOption] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoadingOptions(true)
    fetch("/api/missed-reasons")
      .then((r) => r.json() as Promise<{ success: boolean; data: MissedReasonOption[] }>)
      .then((json) => { if (json.success) setOptions(json.data) })
      .catch(() => toast.error("加载原因选项失败"))
      .finally(() => setLoadingOptions(false))
  }, [open])

  async function handleSubmit() {
    if (!selected) {
      toast.error("请选择一个错过原因")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/sessions/${dateStr}/setups/${setupId}/miss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missedReason: selected, missedNotes: notes || undefined }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success(`${setupSymbol} 已标记为错过`)
        handleClose()
        onSuccess()
      } else {
        toast.error(json.error ?? "操作失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  async function handleAddOption() {
    if (!newLabel.trim()) return
    setAddingOption(true)
    try {
      const res = await fetch("/api/missed-reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() }),
      })
      const json = (await res.json()) as { success: boolean; data?: MissedReasonOption; error?: string }
      if (json.success && json.data) {
        setOptions((prev) => [...prev, json.data!])
        setNewLabel("")
        setShowAddInput(false)
        toast.success("已添加新原因")
      } else {
        toast.error(json.error ?? "添加失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setAddingOption(false)
    }
  }

  async function handleDeleteOption(id: string, label: string) {
    try {
      const res = await fetch(`/api/missed-reasons/${id}`, { method: "DELETE" })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        setOptions((prev) => prev.filter((o) => o.id !== id))
        if (selected === label) setSelected(null)
        toast.success("已删除")
      } else {
        toast.error("删除失败")
      }
    } catch {
      toast.error("网络错误")
    }
  }

  function handleClose() {
    setSelected(null)
    setNotes("")
    setShowAddInput(false)
    setNewLabel("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>标记为错过 — {setupSymbol}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">错过原因（必选）</Label>
              <button
                type="button"
                onClick={() => setShowAddInput((v) => !v)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Plus className="h-3 w-3" />
                添加原因
              </button>
            </div>

            {/* 添加新原因的输入框 */}
            {showAddInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="输入新的错过原因..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void handleAddOption() }}
                  className="text-sm h-8 flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => void handleAddOption()}
                  disabled={addingOption || !newLabel.trim()}
                >
                  {addingOption ? "添加中..." : "确认"}
                </Button>
              </div>
            )}

            {/* 原因选项列表 */}
            {loadingOptions ? (
              <p className="text-xs text-muted-foreground">加载中...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => (
                  <div key={opt.id} className="group relative">
                    <button
                      onClick={() => setSelected(opt.label)}
                      className={cn(
                        "w-full text-left text-xs px-3 py-2 rounded-md border transition-colors pr-7",
                        selected === opt.label
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-muted-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                    {/* 删除按钮（hover 时显示） */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        void handleDeleteOption(opt.id, opt.label)
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">补充说明（可选）</Label>
            <Textarea
              placeholder="详细描述错过的经过..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>取消</Button>
          <Button onClick={() => void handleSubmit()} disabled={saving || !selected}>
            {saving ? "保存中..." : "确认"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
