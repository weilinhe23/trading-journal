"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "~/components/ui/dialog"
import { CreateNewsCatalogDialog } from "~/components/news/CreateNewsCatalogDialog"
import { type NewsCatalogItem } from "~/types"

interface Props {
  item: NewsCatalogItem
}

export function NewsCatalogActions({ item }: Props) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/news-catalog/${item.id}`, { method: "DELETE" })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success("已删除")
        setConfirmOpen(false)
        router.refresh()
      } else {
        toast.error(json.error ?? "删除失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      <CreateNewsCatalogDialog mode="edit" item={item} />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            确定要删除「{item.name}」吗？已关联的 Setup 不会受影响。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
