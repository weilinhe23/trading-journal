'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Power, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'

interface Props {
  id: string
  name: string
  isActive: boolean
}

export function StrategyCardActions({ id, name, isActive }: Props) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  async function toggleActive(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setBusy(true)
    try {
      const res = await fetch(`/api/strategies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success(isActive ? '策略已停用' : '策略已启用')
        router.refresh()
      } else {
        toast.error('操作失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setBusy(false)
    }
  }

  function openDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeleteOpen(true)
  }

  async function handleDelete() {
    setBusy(true)
    try {
      const res = await fetch(`/api/strategies/${id}`, { method: 'DELETE' })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success(`策略「${name}」已删除`)
        setDeleteOpen(false)
        router.refresh()
      } else {
        toast.error('删除失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        title={isActive ? '停用策略' : '启用策略'}
        disabled={busy}
        onClick={(e) => void toggleActive(e)}
      >
        <Power className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
        title="删除策略"
        disabled={busy}
        onClick={openDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除策略</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            删除「{name}」后，所有关联 Setup 将解除策略绑定，且操作不可撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => void handleDelete()}
            >
              {busy ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
