"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"
import { MISSED_REASON_LABELS, type MissedReason } from "~/types"

interface Props {
  open: boolean
  setupId: string
  setupSymbol: string
  dateStr: string
  onClose: () => void
  onSuccess: () => void
}

const REASON_KEYS = Object.keys(MISSED_REASON_LABELS) as MissedReason[]

export function MissedReasonPanel({ open, setupId, setupSymbol, dateStr, onClose, onSuccess }: Props) {
  const [selected, setSelected] = useState<MissedReason | null>(null)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

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
        setSelected(null)
        setNotes("")
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

  function handleClose() {
    setSelected(null)
    setNotes("")
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
            <Label className="text-xs text-muted-foreground">错过原因（必选）</Label>
            <div className="grid grid-cols-2 gap-2">
              {REASON_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={cn(
                    "text-left text-xs px-3 py-2 rounded-md border transition-colors",
                    selected === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground",
                  )}
                >
                  {MISSED_REASON_LABELS[key]}
                </button>
              ))}
            </div>
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
          <Button onClick={handleSubmit} disabled={saving || !selected}>
            {saving ? "保存中..." : "确认"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
