'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import type { MindElixirData } from 'mind-elixir'
import { X, Plus, Power, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'
import { ScrollArea } from '~/components/ui/scroll-area'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface TradeTypeItem {
  id: string
  name: string
}

// Dynamically import to avoid SSR issues with mind-elixir
const MindMapEditor = dynamic(
  () => import('./MindMapEditor').then((m) => ({ default: m.MindMapEditor })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">加载思维导图...</div> },
)

interface HistoryEntry {
  date: string
  note: string
  snapshot: string
}

interface StrategyData {
  id: string
  name: string
  description: string
  isActive: boolean
  mindmapData: string
  ruleHistory: string
  setupCount: number
  historyCount: number
  updatedAt: string
}

interface Props {
  strategy: StrategyData
}

export function StrategyDetailClient({ strategy }: Props) {
  const router = useRouter()
  const [name, setName] = useState(strategy.name)
  const [description, setDescription] = useState(strategy.description)
  const [isActive, setIsActive] = useState(strategy.isActive)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [snapshotOpen, setSnapshotOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionBusy, setActionBusy] = useState(false)
  const [snapshotNote, setSnapshotNote] = useState('')
  const [savingSnapshot, setSavingSnapshot] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [viewingSnapshot, setViewingSnapshot] = useState<MindElixirData | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tradeTypes, setTradeTypes] = useState<TradeTypeItem[]>([])
  const [newTradeTypeName, setNewTradeTypeName] = useState('')
  const [addingTradeType, setAddingTradeType] = useState(false)

  // Parse initial mindmap data
  const initialData: MindElixirData = (() => {
    try {
      return JSON.parse(strategy.mindmapData) as MindElixirData
    } catch {
      return { nodeData: { id: 'root', topic: strategy.name, root: true, children: [] } }
    }
  })()

  // Parse history
  const history: HistoryEntry[] = (() => {
    try {
      return JSON.parse(strategy.ruleHistory) as HistoryEntry[]
    } catch {
      return []
    }
  })()

  const saveMindmap = useCallback(async (data: MindElixirData) => {
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mindmapData: JSON.stringify(data) }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
    } catch {
      setSaveStatus('unsaved')
    }
  }, [strategy.id])

  const handleMindmapChange = useCallback((data: MindElixirData) => {
    setSaveStatus('unsaved')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => void saveMindmap(data), 500)
  }, [saveMindmap])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Load trade types on mount
  useEffect(() => {
    fetch(`/api/strategies/${strategy.id}/trade-types`)
      .then((r) => r.json() as Promise<{ success: boolean; data: TradeTypeItem[] }>)
      .then((json) => { if (json.success) setTradeTypes(json.data) })
      .catch(() => undefined)
  }, [strategy.id])

  async function addTradeType() {
    const name = newTradeTypeName.trim()
    if (!name) return
    setAddingTradeType(true)
    try {
      const res = await fetch(`/api/strategies/${strategy.id}/trade-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = (await res.json()) as { success: boolean; data: TradeTypeItem }
      if (json.success) {
        setTradeTypes((prev) => [...prev, json.data])
        setNewTradeTypeName('')
      } else {
        toast.error('添加失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setAddingTradeType(false)
    }
  }

  async function deleteTradeType(id: string) {
    try {
      const res = await fetch(`/api/strategies/${strategy.id}/trade-types/${id}`, { method: 'DELETE' })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        setTradeTypes((prev) => prev.filter((t) => t.id !== id))
      } else {
        toast.error('删除失败')
      }
    } catch {
      toast.error('网络错误')
    }
  }

  async function toggleActive() {
    setActionBusy(true)
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        setIsActive((v) => !v)
        toast.success(isActive ? '策略已停用' : '策略已启用')
      } else {
        toast.error('操作失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setActionBusy(false)
    }
  }

  async function deleteStrategy() {
    setActionBusy(true)
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, { method: 'DELETE' })
      const json = (await res.json()) as { success: boolean }
      if (json.success) {
        toast.success('策略已删除')
        router.push('/strategies')
      } else {
        toast.error('删除失败')
      }
    } catch {
      toast.error('网络错误')
    } finally {
      setActionBusy(false)
      setDeleteOpen(false)
    }
  }

  async function saveInfo() {
    try {
      const res = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('策略信息已保存')
      router.refresh()
    } catch {
      toast.error('保存失败')
    }
  }

  async function saveSnapshot() {
    if (!snapshotNote.trim()) return
    setSavingSnapshot(true)
    try {
      const res = await fetch(`/api/strategies/${strategy.id}/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: snapshotNote.trim() }),
      })
      if (!res.ok) throw new Error('Snapshot failed')
      toast.success('版本快照已保存')
      setSnapshotOpen(false)
      setSnapshotNote('')
      router.refresh()
    } catch {
      toast.error('保存快照失败')
    } finally {
      setSavingSnapshot(false)
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      {/* Left panel — strategy info */}
      <div className="w-[38%] flex flex-col gap-4 overflow-y-auto">
        <Card className="flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">策略信息</CardTitle>
              <div className="flex items-center gap-1.5">
                <Badge variant={isActive ? 'default' : 'secondary'}>
                  {isActive ? '启用' : '停用'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title={isActive ? '停用策略' : '启用策略'}
                  disabled={actionBusy}
                  onClick={() => void toggleActive()}
                >
                  <Power className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="删除策略"
                  disabled={actionBusy}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="strat-name">名称</Label>
              <Input
                id="strat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="strat-desc">描述</Label>
              <Textarea
                id="strat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="策略核心逻辑..."
              />
            </div>
            <Button size="sm" onClick={() => void saveInfo()} className="w-full">
              保存信息
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="flex-shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">关联统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded border">
                <p className="text-xl font-bold">{strategy.setupCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">使用次数</p>
              </div>
              <div className="p-2 rounded border">
                <p className="text-xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground mt-0.5">执行次数</p>
              </div>
              <div className="p-2 rounded border">
                <p className="text-xl font-bold text-muted-foreground">—</p>
                <p className="text-xs text-muted-foreground mt-0.5">胜率</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade types */}
        <Card className="flex-shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">交易类型</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tradeTypes.length === 0 ? (
              <p className="text-xs text-muted-foreground">暂无交易类型，在下方添加</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tradeTypes.map((tt) => (
                  <Badge
                    key={tt.id}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs"
                  >
                    {tt.name}
                    <button
                      type="button"
                      onClick={() => void deleteTradeType(tt.id)}
                      className="ml-0.5 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="新交易类型名称"
                value={newTradeTypeName}
                onChange={(e) => setNewTradeTypeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void addTradeType()}
                className="text-sm h-7 flex-1"
              />
              <Button
                size="sm"
                className="h-7 gap-1 text-xs"
                disabled={!newTradeTypeName.trim() || addingTradeType}
                onClick={() => void addTradeType()}
              >
                <Plus className="h-3 w-3" />添加
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Version history */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">历史版本</CardTitle>
              <span className="text-xs text-muted-foreground">{history.length} 个快照</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <p className="px-6 pb-4 text-sm text-muted-foreground">暂无快照，点击右栏「保存版本快照」</p>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="px-6 pb-4 space-y-2">
                  {[...history].reverse().map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 py-2 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.note}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(entry.date), 'MM/dd HH:mm', { locale: zhCN })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs shrink-0"
                        onClick={() => {
                          try {
                            setViewingSnapshot(JSON.parse(entry.snapshot) as MindElixirData)
                            setHistoryOpen(true)
                          } catch {
                            toast.error('快照数据损坏')
                          }
                        }}
                      >
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator orientation="vertical" />

      {/* Right panel — mindmap editor */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            {saveStatus === 'saving' && <span className="text-yellow-400">保存中...</span>}
            {saveStatus === 'saved' && <span className="text-green-400">已自动保存</span>}
            {saveStatus === 'unsaved' && <span className="text-red-400">未保存</span>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSnapshotOpen(true)}
          >
            保存版本快照
          </Button>
        </div>

        <div className="flex-1">
          <MindMapEditor
            initialData={initialData}
            onChange={handleMindmapChange}
          />
        </div>
      </div>

      {/* Snapshot dialog */}
      <Dialog open={snapshotOpen} onOpenChange={setSnapshotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存版本快照</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="snapshot-note">修改说明</Label>
            <Input
              id="snapshot-note"
              className="mt-1.5"
              placeholder="如：新增大盘过滤条件..."
              value={snapshotNote}
              onChange={(e) => setSnapshotNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void saveSnapshot()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSnapshotOpen(false)}>取消</Button>
            <Button onClick={() => void saveSnapshot()} disabled={!snapshotNote.trim() || savingSnapshot}>
              {savingSnapshot ? '保存中...' : '保存快照'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History viewer dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>历史快照（只读）</DialogTitle>
          </DialogHeader>
          <div style={{ height: '60vh' }}>
            {viewingSnapshot && (
              <MindMapEditor
                initialData={viewingSnapshot}
                onChange={() => undefined}
                readonly
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setHistoryOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除策略</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            删除「{strategy.name}」后，所有关联 Setup 将解除策略绑定，且操作不可撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button
              variant="destructive"
              disabled={actionBusy}
              onClick={() => void deleteStrategy()}
            >
              {actionBusy ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
