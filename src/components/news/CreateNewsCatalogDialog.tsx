"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Pencil, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"
import { type NewsCatalogItem, type NewsStrength } from "~/types"

const STRENGTH_OPTIONS: { value: NewsStrength; label: string; color: string }[] = [
  { value: "STRONG", label: "强", color: "bg-red-700 text-white border-red-700 hover:bg-red-700" },
  { value: "MEDIUM", label: "中等", color: "bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-600" },
  { value: "WEAK", label: "弱", color: "bg-muted text-muted-foreground border-muted-foreground/40" },
]

interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
  placeholder: string
  tagColorClass: string
  icon: React.ReactNode
}

function TagInput({ tags, onAdd, onRemove, placeholder, tagColorClass, icon }: TagInputProps) {
  const [input, setInput] = useState("")

  function commit() {
    const v = input.trim()
    if (v && !tags.includes(v)) { onAdd(v) }
    setInput("")
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); commit() }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={placeholder}
          className="text-sm h-7 flex-1"
        />
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 shrink-0" onClick={commit}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border",
                tagColorClass,
              )}
            >
              {icon}
              {tag}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-0.5 opacity-60 hover:opacity-100"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  mode?: "create" | "edit"
  item?: NewsCatalogItem
  existingCategories?: string[]
}

const defaultForm = {
  name: "",
  category: "",
  subCategory: "",
  strength: "" as NewsStrength | "",
  description: "",
}

export function CreateNewsCatalogDialog({ mode = "create", item, existingCategories = [] }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [entryConditions, setEntryConditions] = useState<string[]>([])
  const [riskFactors, setRiskFactors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && mode === "edit" && item) {
      setForm({
        name: item.name,
        category: item.category,
        subCategory: item.subCategory ?? "",
        strength: item.strength,
        description: item.description ?? "",
      })
      setEntryConditions(item.entryConditions ?? [])
      setRiskFactors(item.riskFactors ?? [])
    } else if (!open) {
      setForm(defaultForm)
      setEntryConditions([])
      setRiskFactors([])
    }
  }, [open, mode, item])

  function set(field: keyof typeof defaultForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name.trim()) { toast.error("请填写新闻名称"); return }
    if (!form.category.trim()) { toast.error("请填写一级类别"); return }
    if (!form.strength) { toast.error("请选择催化剂强度"); return }

    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        category: form.category.trim(),
        subCategory: form.subCategory.trim() || null,
        strength: form.strength,
        description: form.description.trim() || null,
        entryConditions,
        riskFactors,
      }

      const url = mode === "edit" && item ? `/api/news-catalog/${item.id}` : "/api/news-catalog"
      const method = mode === "edit" ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as { success: boolean; error?: string }

      if (json.success) {
        toast.success(mode === "edit" ? "已更新" : "已添加")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(json.error ?? "操作失败")
      }
    } catch {
      toast.error("网络错误")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            新建催化剂
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新建新闻催化剂" : "编辑新闻催化剂"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 名称 */}
          <div className="space-y-1">
            <Label className="text-xs">新闻名称 / 模板 *</Label>
            <Input
              placeholder="例：Q4 EPS 超预期 20%+"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="text-sm h-8"
            />
          </div>

          {/* 一级类别 */}
          <div className="space-y-1">
            <Label className="text-xs">一级类别 *</Label>
            <Input
              list="categories-list"
              placeholder="例：财报催化剂、宏观政策、公司事件"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="text-sm h-8"
            />
            {existingCategories.length > 0 && (
              <datalist id="categories-list">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
          </div>

          {/* 二级类别 */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">二级类别（可选）</Label>
            <Input
              placeholder="例：EPS超预期、指引上调、并购消息"
              value={form.subCategory}
              onChange={(e) => set("subCategory", e.target.value)}
              className="text-sm h-8"
            />
          </div>

          {/* 强度 */}
          <div className="space-y-1.5">
            <Label className="text-xs">催化剂强度 *</Label>
            <div className="flex gap-2">
              {STRENGTH_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set("strength", form.strength === o.value ? "" : o.value)}
                  className={cn(
                    "flex-1 text-sm py-1.5 rounded border font-medium transition-colors",
                    form.strength === o.value
                      ? o.color
                      : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* 说明 */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">说明（可选）</Label>
            <Textarea
              placeholder="补充说明：这类新闻的特点、常见走势、注意事项..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {/* 入场基本条件 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              入场基本条件
              <span className="text-muted-foreground font-normal ml-1">（满足才考虑交易）</span>
            </Label>
            <TagInput
              tags={entryConditions}
              onAdd={(t) => setEntryConditions((prev) => [...prev, t])}
              onRemove={(i) => setEntryConditions((prev) => prev.filter((_, idx) => idx !== i))}
              placeholder="输入条件后按 Enter，如：盘前波动 > 10%"
              tagColorClass="bg-green-500/10 text-green-400 border-green-500/20"
              icon={<CheckCircle2 className="h-2.5 w-2.5" />}
            />
          </div>

          {/* 风险因素 */}
          <div className="space-y-1.5">
            <Label className="text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              风险因素
              <span className="text-muted-foreground font-normal ml-1">（出现时需谨慎）</span>
            </Label>
            <TagInput
              tags={riskFactors}
              onAdd={(t) => setRiskFactors((prev) => [...prev, t])}
              onRemove={(i) => setRiskFactors((prev) => prev.filter((_, idx) => idx !== i))}
              placeholder="输入风险后按 Enter，如：已连续上涨多日"
              tagColorClass="bg-red-500/10 text-red-400 border-red-500/20"
              icon={<AlertTriangle className="h-2.5 w-2.5" />}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : (mode === "create" ? "添加" : "保存")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { newsStrengthBadgeClass } from "~/lib/news-catalog"
export { NEWS_STRENGTH_LABELS } from "~/types"
