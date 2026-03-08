"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, BookOpen, X, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"
import { cn } from "~/lib/utils"
import { type NewsCatalogItem, type NewsStrength, NEWS_STRENGTH_LABELS } from "~/types"

const STRENGTH_BADGE_CLASS: Record<NewsStrength, string> = {
  STRONG: "bg-red-500/20 text-red-400 border-red-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  WEAK: "bg-muted/60 text-muted-foreground border-muted-foreground/20",
}

interface Props {
  date: string
}

interface TradeTypeOption {
  id: string
  name: string
}

interface StrategyOption {
  id: string
  name: string
  isActive: boolean
  tradeTypes: TradeTypeOption[]
}

const NEWS_TYPE_OPTIONS = [
  { value: "EARNINGS", label: "财报" },
  { value: "FED", label: "美联储" },
  { value: "MACRO", label: "宏观数据（CPI/NFP等）" },
  { value: "SECTOR", label: "行业新闻" },
  { value: "COMPANY", label: "公司公告" },
  { value: "TECHNICAL", label: "纯技术面（无新闻）" },
]

const NEWS_IMPACT_OPTIONS = [
  { value: "BULLISH", label: "利多" },
  { value: "BEARISH", label: "利空" },
  { value: "NEUTRAL", label: "中性" },
  { value: "UNCERTAIN", label: "不确定" },
]

const PRICE_TIER_OPTIONS = [
  { value: "BELOW_2", label: "< $2" },
  { value: "BETWEEN_2_20", label: "$2–$20" },
  { value: "ABOVE_20", label: "> $20" },
]

const MARKET_CAP_OPTIONS = [
  { value: "BELOW_300M", label: "< 300M" },
  { value: "BETWEEN_300M_2B", label: "300M–2B" },
  { value: "BETWEEN_2B_10B", label: "2B–10B" },
  { value: "ABOVE_10B", label: "> 10B" },
]

const STOP_QUICK = [
  { label: "5%止损", value: "5%止损" },
  { label: "10%止损", value: "10%止损" },
]

const TARGET1_QUICK = [
  { label: "+10%", value: "目标一 +10%" },
  { label: "+15%", value: "目标一 +15%" },
  { label: "+20%", value: "目标一 +20%" },
]

const TARGET2_QUICK = [
  { label: "+5%", value: "目标二 +5%" },
  { label: "+10%", value: "目标二 +10%" },
]

const UNDECIDED = "__UNDECIDED__"

const defaultForm = {
  symbol: "",
  direction: "" as "LONG" | "SHORT" | "TBD" | "",
  priceTier: "" as string,
  marketCapTier: "" as string,
  // strategy: UNDECIDED means 未定, a real ID means a library strategy
  strategyId: UNDECIDED,
  setupLogic: "",
  entryCondition: "",
  entryPriceNote: "",
  stopCondition: "",
  stopPriceNote: "",
  target1Condition: "",
  target1PriceNote: "",
  target2Condition: "",
  target2PriceNote: "",
  plannedRiskReward: "",
  plannedSize: "",
  newsType: "" as string,
  newsImpact: "" as string,
  newsHeadline: "",
}

export function CreateSetupDialog({ date }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [selectedTradeTypeNames, setSelectedTradeTypeNames] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [strategies, setStrategies] = useState<StrategyOption[]>([])
  const [loadingStrategies, setLoadingStrategies] = useState(false)
  // news catalog
  const [catalogItems, setCatalogItems] = useState<NewsCatalogItem[]>([])
  const [selectedCatalog, setSelectedCatalog] = useState<NewsCatalogItem | null>(null)
  const [catalogPickerOpen, setCatalogPickerOpen] = useState(false)
  const [catalogSearch, setCatalogSearch] = useState("")
  const [newsCatalogId, setNewsCatalogId] = useState<string | null>(null)

  function set(field: keyof typeof defaultForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Fetch strategies (with trade types) when dialog opens
  useEffect(() => {
    if (!open) return
    setLoadingStrategies(true)
    fetch("/api/strategies")
      .then((r) => r.json() as Promise<{ success: boolean; data: StrategyOption[] }>)
      .then((json) => { if (json.success) setStrategies(json.data.filter((s) => s.isActive)) })
      .catch(() => undefined)
      .finally(() => setLoadingStrategies(false))
    // fetch news catalog
    fetch("/api/news-catalog")
      .then((r) => r.json() as Promise<{ success: boolean; data: NewsCatalogItem[] }>)
      .then((json) => { if (json.success) setCatalogItems(json.data) })
      .catch(() => undefined)
  }, [open])

  const selectedStrategyObj = strategies.find((s) => s.id === form.strategyId)
  const tradeTypeOptions: TradeTypeOption[] = selectedStrategyObj?.tradeTypes ?? []

  function toggleTradeType(name: string) {
    setSelectedTradeTypeNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  async function handleSubmit() {
    if (!form.symbol.trim()) { toast.error("请填写标的代码"); return }
    if (!form.direction) { toast.error("请选择方向"); return }

    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        symbol: form.symbol.trim().toUpperCase(),
        direction: form.direction,
      }
      if (form.priceTier) body.priceTier = form.priceTier
      if (form.marketCapTier) body.marketCapTier = form.marketCapTier

      // Strategy: if not UNDECIDED, link to library
      if (form.strategyId !== UNDECIDED && selectedStrategyObj) {
        body.strategyId = form.strategyId
        body.strategy = selectedStrategyObj.name
      }
      // Store selected trade type names as JSON
      if (selectedTradeTypeNames.length > 0) {
        body.selectedTradeTypes = JSON.stringify(selectedTradeTypeNames)
      }

      if (form.setupLogic.trim()) body.setupLogic = form.setupLogic.trim()
      if (form.entryCondition.trim()) body.entryCondition = form.entryCondition.trim()
      if (form.entryPriceNote.trim()) body.entryPriceNote = form.entryPriceNote.trim()
      if (form.stopCondition.trim()) body.stopCondition = form.stopCondition.trim()
      if (form.stopPriceNote.trim()) body.stopPriceNote = form.stopPriceNote.trim()
      if (form.target1Condition.trim()) body.target1Condition = form.target1Condition.trim()
      if (form.target1PriceNote.trim()) body.target1PriceNote = form.target1PriceNote.trim()
      if (form.target2Condition.trim()) body.target2Condition = form.target2Condition.trim()
      if (form.target2PriceNote.trim()) body.target2PriceNote = form.target2PriceNote.trim()
      if (form.plannedRiskReward) body.plannedRiskReward = parseFloat(form.plannedRiskReward)
      if (form.plannedSize) body.plannedSize = parseInt(form.plannedSize, 10)
      if (form.newsType) body.newsType = form.newsType
      if (form.newsImpact) body.newsImpact = form.newsImpact
      if (form.newsHeadline.trim()) body.newsHeadline = form.newsHeadline.trim()
      if (newsCatalogId) body.newsCatalogId = newsCatalogId

      const res = await fetch(`/api/sessions/${date}/setups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success(`已添加 ${form.symbol.toUpperCase()} Setup`)
        setForm(defaultForm)
        setSelectedTradeTypeNames([])
        setSelectedCatalog(null)
        setNewsCatalogId(null)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(json.error ?? "创建失败")
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
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          添加 Setup
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建交易机会</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* 标的 + 方向 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">标的代码 *</Label>
              <Input
                placeholder="NVDA"
                value={form.symbol}
                onChange={(e) => set("symbol", e.target.value.toUpperCase())}
                className="text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">方向 *</Label>
              <Select value={form.direction} onValueChange={(v) => set("direction", v)}>
                <SelectTrigger className="text-sm h-8">
                  <SelectValue placeholder="选择方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LONG">做多 Long</SelectItem>
                  <SelectItem value="SHORT">做空 Short</SelectItem>
                  <SelectItem value="TBD">待定 TBD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 价格层级 + 市值层级 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">价格层级</Label>
              <div className="flex gap-1 flex-wrap">
                {PRICE_TIER_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("priceTier", form.priceTier === o.value ? "" : o.value)}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded border transition-colors",
                      form.priceTier === o.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">市值层级</Label>
              <div className="flex gap-1 flex-wrap">
                {MARKET_CAP_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("marketCapTier", form.marketCapTier === o.value ? "" : o.value)}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded border transition-colors",
                      form.marketCapTier === o.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* 策略部分 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">策略</Label>

            {/* 策略选择：未定 或 策略库 */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">交易策略</Label>
              <Select
                value={form.strategyId}
                onValueChange={(v) => {
                  setForm((prev) => ({ ...prev, strategyId: v }))
                  setSelectedTradeTypeNames([])
                }}
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue placeholder={loadingStrategies ? "加载策略库..." : "选择策略"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNDECIDED}>未定</SelectItem>
                  {strategies.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                  {!loadingStrategies && strategies.length === 0 && (
                    <div className="py-2 px-2 text-xs text-muted-foreground">
                      暂无策略，请先在策略页新建
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 交易类型（多选，仅在选了具体策略后显示）*/}
            {form.strategyId !== UNDECIDED && tradeTypeOptions.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  交易类型
                  <span className="ml-1 text-[10px] text-muted-foreground/60">（可多选）</span>
                </Label>
                <div className="flex gap-1.5 flex-wrap">
                  {tradeTypeOptions.map((tt) => (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() => toggleTradeType(tt.name)}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded border transition-colors",
                        selectedTradeTypeNames.includes(tt.name)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-foreground",
                      )}
                    >
                      {tt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {form.strategyId !== UNDECIDED && tradeTypeOptions.length === 0 && (
              <p className="text-xs text-muted-foreground/60">
                该策略暂无交易类型，可在策略库中添加
              </p>
            )}
          </div>

          {/* 机会逻辑 */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">机会逻辑（可选）</Label>
            <Textarea
              placeholder="为什么关注这个机会？背后的逻辑是什么？"
              value={form.setupLogic}
              onChange={(e) => set("setupLogic", e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          <Separator />

          {/* 入场计划 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-green-400">入场计划</Label>
            <Textarea
              placeholder="例：回调至 VWAP，成交量萎缩后出现放量阳线站稳"
              value={form.entryCondition}
              onChange={(e) => set("entryCondition", e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
            <Input
              placeholder="价格区域（可选）例：VWAP 附近 $185-186"
              value={form.entryPriceNote}
              onChange={(e) => set("entryPriceNote", e.target.value)}
              className="text-sm h-8"
            />
          </div>

          {/* 止损计划 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-red-400">止损计划</Label>
            <Textarea
              placeholder="止损条件（可选）例：跌破 VWAP 且 1 分钟 K 线收盘破位"
              value={form.stopCondition}
              onChange={(e) => set("stopCondition", e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
            <div className="flex gap-1.5 items-center flex-wrap">
              {STOP_QUICK.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => set("stopPriceNote", form.stopPriceNote === q.value ? "" : q.value)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded border transition-colors",
                    form.stopPriceNote === q.value
                      ? "bg-red-700 text-white border-red-700"
                      : "border-red-800/50 text-red-400 hover:bg-red-950",
                  )}
                >
                  {q.label}
                </button>
              ))}
              <Input
                placeholder="或输入止损区域（可选）"
                value={STOP_QUICK.some((q) => q.value === form.stopPriceNote) ? "" : form.stopPriceNote}
                onChange={(e) => set("stopPriceNote", e.target.value)}
                className="text-sm h-7 flex-1 min-w-24"
              />
            </div>
          </div>

          {/* 目标计划 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-blue-400">目标计划</Label>

            {/* 目标一 */}
            <div className="space-y-1.5 pl-2 border-l-2 border-blue-800/50">
              <Label className="text-xs text-muted-foreground">目标一</Label>
              <Textarea
                placeholder="例：前高附近阻力位，或 2R 目标"
                value={form.target1Condition}
                onChange={(e) => set("target1Condition", e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
              <div className="flex gap-1.5 items-center flex-wrap">
                {TARGET1_QUICK.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => set("target1PriceNote", form.target1PriceNote === q.value ? "" : q.value)}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded border transition-colors",
                      form.target1PriceNote === q.value
                        ? "bg-blue-700 text-white border-blue-700"
                        : "border-blue-800/50 text-blue-400 hover:bg-blue-950",
                    )}
                  >
                    {q.label}
                  </button>
                ))}
                <Input
                  placeholder="或输入目标区域"
                  value={TARGET1_QUICK.some((q) => q.value === form.target1PriceNote) ? "" : form.target1PriceNote}
                  onChange={(e) => set("target1PriceNote", e.target.value)}
                  className="text-sm h-7 flex-1 min-w-20"
                />
              </div>
            </div>

            {/* 目标二 */}
            <div className="space-y-1.5 pl-2 border-l-2 border-blue-800/30">
              <Label className="text-xs text-muted-foreground">目标二（可选）</Label>
              <Textarea
                placeholder="例：更高阻力位，或减仓后持仓目标"
                value={form.target2Condition}
                onChange={(e) => set("target2Condition", e.target.value)}
                rows={1}
                className="resize-none text-sm"
              />
              <div className="flex gap-1.5 items-center flex-wrap">
                {TARGET2_QUICK.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => set("target2PriceNote", form.target2PriceNote === q.value ? "" : q.value)}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded border transition-colors",
                      form.target2PriceNote === q.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-blue-800/30 text-blue-500/70 hover:bg-blue-950",
                    )}
                  >
                    {q.label}
                  </button>
                ))}
                <Input
                  placeholder="或输入目标二区域"
                  value={TARGET2_QUICK.some((q) => q.value === form.target2PriceNote) ? "" : form.target2PriceNote}
                  onChange={(e) => set("target2PriceNote", e.target.value)}
                  className="text-sm h-7 flex-1 min-w-20"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 新闻催化剂 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-yellow-400">新闻催化剂（可选）</Label>

            {/* 从催化剂库选择 */}
            {catalogItems.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">从催化剂库选择</Label>
                {selectedCatalog ? (
                  <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 space-y-2">
                    {/* 顶部：名称 + 强度 + 清除 */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${STRENGTH_BADGE_CLASS[selectedCatalog.strength as NewsStrength]}`}
                      >
                        {NEWS_STRENGTH_LABELS[selectedCatalog.strength as NewsStrength]}
                      </Badge>
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">{selectedCatalog.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{selectedCatalog.category}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCatalog(null)
                          setNewsCatalogId(null)
                          set("newsHeadline", "")
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {/* 入场条件 + 风险因素 */}
                    {((selectedCatalog.entryConditions?.length ?? 0) > 0 || (selectedCatalog.riskFactors?.length ?? 0) > 0) && (
                      <div className="space-y-1">
                        {(selectedCatalog.entryConditions?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                            {selectedCatalog.entryConditions!.map((c, i) => (
                              <span key={i} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-1.5 py-0.5">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        {(selectedCatalog.riskFactors?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                            {selectedCatalog.riskFactors!.map((r, i) => (
                              <span key={i} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-1.5 py-0.5">
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCatalogPickerOpen(true)}
                    className="w-full flex items-center gap-2 h-8 px-3 rounded-md border border-dashed border-muted-foreground/40 text-sm text-muted-foreground hover:border-yellow-500/50 hover:text-foreground transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    从新闻库选择...
                  </button>
                )}

                {/* Catalog Picker Dialog */}
                <Dialog open={catalogPickerOpen} onOpenChange={setCatalogPickerOpen}>
                  <DialogContent className="max-w-md max-h-[70vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>选择新闻催化剂</DialogTitle>
                    </DialogHeader>
                    <Input
                      placeholder="搜索..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="text-sm h-8 shrink-0"
                    />
                    <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                      {(() => {
                        const filtered = catalogSearch.trim()
                          ? catalogItems.filter((item) =>
                              item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                              item.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                              (item.subCategory ?? "").toLowerCase().includes(catalogSearch.toLowerCase()),
                            )
                          : catalogItems

                        const grouped = filtered.reduce<Record<string, NewsCatalogItem[]>>((acc, item) => {
                          if (!acc[item.category]) acc[item.category] = []
                          acc[item.category]!.push(item)
                          return acc
                        }, {})

                        if (filtered.length === 0) {
                          return (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              {catalogSearch ? "无匹配结果" : "暂无催化剂，请先在新闻库中添加"}
                            </p>
                          )
                        }

                        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([cat, catItems]) => (
                          <div key={cat}>
                            <p className="text-xs text-muted-foreground font-medium mb-1.5 pl-1">{cat}</p>
                            <div className="space-y-1">
                              {catItems.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCatalog(item)
                                    setNewsCatalogId(item.id)
                                    set("newsHeadline", item.name)
                                    setCatalogPickerOpen(false)
                                    setCatalogSearch("")
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/60 transition-colors text-left"
                                >
                                  <Badge
                                    variant="outline"
                                    className={`text-xs shrink-0 ${STRENGTH_BADGE_CLASS[item.strength as NewsStrength]}`}
                                  >
                                    {NEWS_STRENGTH_LABELS[item.strength as NewsStrength]}
                                  </Badge>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-sm">{item.name}</span>
                                    {item.subCategory && (
                                      <span className="text-xs text-muted-foreground ml-2">{item.subCategory}</span>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">新闻类型</Label>
                <Select value={form.newsType} onValueChange={(v) => set("newsType", v)}>
                  <SelectTrigger className="text-sm h-8">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">对标的影响</Label>
                <Select
                  value={form.newsImpact}
                  onValueChange={(v) => set("newsImpact", v)}
                  disabled={!form.newsType || form.newsType === "TECHNICAL"}
                >
                  <SelectTrigger className="text-sm h-8">
                    <SelectValue placeholder="选择影响" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_IMPACT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.newsType && form.newsType !== "TECHNICAL" && (
              <Input
                placeholder="新闻简述（可选）例：Q4 EPS 超预期 20%"
                value={form.newsHeadline}
                onChange={(e) => set("newsHeadline", e.target.value)}
                className="text-sm h-8"
              />
            )}
          </div>

          <Separator />

          {/* 盈亏比 + 仓位 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">计划盈亏比（可选）</Label>
              <Input
                type="number"
                placeholder="例：2.5"
                value={form.plannedRiskReward}
                onChange={(e) => set("plannedRiskReward", e.target.value)}
                className="text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">计划仓位（股，可选）</Label>
              <Input
                type="number"
                placeholder="例：100"
                value={form.plannedSize}
                onChange={(e) => set("plannedSize", e.target.value)}
                className="text-sm h-8"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : "添加 Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
