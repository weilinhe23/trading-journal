"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import {
  MISSED_REASON_LABELS,
  PRICE_TIER_LABELS,
  MARKET_CAP_TIER_LABELS,
  NEWS_TYPE_LABELS,
  NEWS_IMPACT_LABELS,
  type MissedReason,
  type PriceTier,
  type MarketCapTier,
  type NewsType,
  type NewsImpact,
} from "~/types"
import type { DailySession, Screenshot, TradeSetup, Execution } from "../../../generated/prisma"

type SetupFull = TradeSetup & {
  executions: Execution[]
  screenshots: Screenshot[]
}

type SessionFull = DailySession & {
  screenshots: Screenshot[]
  setups: SetupFull[]
}

interface Props {
  session: SessionFull
}

const DIR_CFG: Record<string, { label: string; className: string }> = {
  LONG:  { label: "做多", className: "bg-green-600 text-white" },
  SHORT: { label: "做空", className: "bg-red-600 text-white" },
  TBD:   { label: "待定", className: "bg-gray-600 text-white" },
}

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  WATCHING:    { label: "观察中",  variant: "secondary" },
  EXECUTED:    { label: "已执行",  variant: "default" },
  MISSED:      { label: "已错过",  variant: "outline" },
  INVALIDATED: { label: "已失效",  variant: "destructive" },
  CANCELLED:   { label: "已取消",  variant: "outline" },
}

// ── 图片灯箱（支持滚轮缩放 + 拖拽平移）──────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [{ scale, tx, ty }, setView] = useState({ scale: 1, tx: 0, ty: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ mx: number; my: number; tx0: number; ty0: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const zoom = useCallback((delta: number) => {
    setView(prev => {
      const next = Math.min(Math.max(prev.scale + delta, 1), 8)
      if (next <= 1) return { scale: 1, tx: 0, ty: 0 }
      return { ...prev, scale: next }
    })
  }, [])

  const reset = useCallback(() => setView({ scale: 1, tx: 0, ty: 0 }), [])

  // 非被动滚轮事件（防止浏览器默认滚动）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      zoom(e.deltaY < 0 ? 0.3 : -0.3)
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [zoom])

  // 键盘快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "=" || e.key === "+") zoom(0.5)
      else if (e.key === "-") zoom(-0.5)
      else if (e.key === "0") reset()
      else if (e.key === "ArrowLeft") setView(v => v.scale > 1 ? { ...v, tx: v.tx - 40 } : v)
      else if (e.key === "ArrowRight") setView(v => v.scale > 1 ? { ...v, tx: v.tx + 40 } : v)
      else if (e.key === "ArrowUp") setView(v => v.scale > 1 ? { ...v, ty: v.ty - 40 } : v)
      else if (e.key === "ArrowDown") setView(v => v.scale > 1 ? { ...v, ty: v.ty + 40 } : v)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [zoom, reset])

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    dragRef.current = { mx: e.clientX, my: e.clientY, tx0: tx, ty0: ty }
    setDragging(true)
    e.preventDefault()
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return
    setView(v => ({
      ...v,
      tx: dragRef.current!.tx0 + (e.clientX - dragRef.current!.mx),
      ty: dragRef.current!.ty0 + (e.clientY - dragRef.current!.my),
    }))
  }

  const stopDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="!top-0 !left-0 !translate-x-0 !translate-y-0 !max-w-none w-screen h-screen rounded-none border-0 p-0 bg-black select-none overflow-hidden flex flex-col gap-0">
        <DialogTitle className="sr-only">截图预览</DialogTitle>

        {/* ── 缩放工具栏 ── */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg pointer-events-auto">
          <button
            onClick={() => zoom(-0.5)}
            className="text-white/80 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
            title="缩小 (−)"
          >−</button>
          <span className="text-white/60 text-xs w-12 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => zoom(0.5)}
            className="text-white/80 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
            title="放大 (+)"
          >+</button>
          {scale !== 1 && (
            <>
              <div className="w-px h-4 bg-white/20 mx-0.5" />
              <button
                onClick={reset}
                className="text-white/60 hover:text-white text-xs px-2 py-0.5 rounded-full hover:bg-white/10"
                title="重置 (0)"
              >重置</button>
            </>
          )}
        </div>

        {/* ── 图片视口（占满剩余空间）── */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden flex items-center justify-center"
          style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-w-full max-h-full object-contain pointer-events-none"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.15s ease",
            }}
          />
        </div>

        {/* ── 底部说明栏 ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-black/60">
          <p className="text-[11px] text-white/40 truncate flex-1">{alt}</p>
          <p className="text-[10px] text-white/25 shrink-0 ml-2">滚轮缩放 · 拖拽移动 · ← → ↑ ↓ 平移</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── 截图网格 ──────────────────────────────────────────────────────────
function ScreenshotGrid({ screenshots, title }: { screenshots: Screenshot[]; title?: string }) {
  const [lightbox, setLightbox] = useState<Screenshot | null>(null)
  if (screenshots.length === 0) return null
  return (
    <div className="space-y-1.5">
      {title && <p className="text-xs font-medium text-muted-foreground">{title}</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {screenshots.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setLightbox(sc)}
            className="group relative overflow-hidden rounded border border-border/50 aspect-video bg-muted hover:border-primary/50 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sc.filePath}
              alt={sc.caption ?? sc.originalName}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
            {sc.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {sc.caption}
              </div>
            )}
            {sc.timeframe && (
              <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                {sc.timeframe}
              </div>
            )}
          </button>
        ))}
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.filePath}
          alt={lightbox.caption ?? lightbox.originalName}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}

// ── 单个 Setup 汇总卡片 ────────────────────────────────────────────────
function SetupSummaryCard({ setup }: { setup: SetupFull }) {
  const dir = DIR_CFG[setup.direction] ?? DIR_CFG["TBD"]!
  const st = STATUS_LABEL[setup.status] ?? { label: setup.status, variant: "outline" as const }

  const totalPnL = setup.executions.reduce<number | null>((acc, ex) => {
    if (ex.pnl === null) return acc
    return (acc ?? 0) + ex.pnl
  }, null)

  // 收集该 setup 下所有截图（setup 本身 + 执行记录）
  const allScreenshots = setup.screenshots

  return (
    <Card>
      {/* ── 标的标题行 ── */}
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-base">{setup.symbol}</span>
          <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", dir.className)}>
            {dir.label}
          </span>
          {setup.strategy && (
            <Badge variant="secondary" className="text-xs py-0">{setup.strategy}</Badge>
          )}
          {/* 交易类型 */}
          {(() => {
            try {
              const types = JSON.parse((setup as unknown as { selectedTradeTypes?: string }).selectedTradeTypes ?? "[]") as string[]
              return types.map((t) => (
                <Badge key={t} variant="outline" className="text-xs py-0 border-primary/40 text-primary/80">{t}</Badge>
              ))
            } catch { return null }
          })()}
          <Badge variant={st.variant} className="text-xs py-0">{st.label}</Badge>
          {setup.priceTier && (
            <Badge variant="outline" className="text-xs py-0 text-muted-foreground">
              {PRICE_TIER_LABELS[setup.priceTier as PriceTier]}
            </Badge>
          )}
          {setup.marketCapTier && (
            <Badge variant="outline" className="text-xs py-0 text-muted-foreground">
              {MARKET_CAP_TIER_LABELS[setup.marketCapTier as MarketCapTier]}
            </Badge>
          )}
          {setup.newsType && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs py-0",
                setup.newsImpact === "BULLISH" && "border-green-700 text-green-400",
                setup.newsImpact === "BEARISH" && "border-red-700 text-red-400",
                setup.newsImpact === "UNCERTAIN" && "border-yellow-700 text-yellow-400",
                (!setup.newsImpact || setup.newsImpact === "NEUTRAL") && "border-muted-foreground text-muted-foreground",
              )}
            >
              {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
              {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                <span className="ml-1 opacity-70">· {NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}</span>
              )}
            </Badge>
          )}
          {totalPnL !== null && (
            <span className={cn("text-sm font-semibold ml-auto", totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
              {formatPnL(totalPnL)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">

        {/* ── 策略 & 催化剂行 ── */}
        <div className="space-y-1">
          {/* 策略 */}
          {(() => {
            try {
              const types = JSON.parse((setup as unknown as { selectedTradeTypes?: string }).selectedTradeTypes ?? "[]") as string[]
              const label = [setup.strategy, types.length > 0 ? types.join(" / ") : null].filter(Boolean).join("  ·  ")
              if (!label) return null
              return (
                <div className="flex gap-1.5">
                  <span className="text-violet-400 font-medium text-xs w-10 shrink-0">策略</span>
                  <span className="text-xs text-foreground/80 leading-tight">{label}</span>
                </div>
              )
            } catch { return null }
          })()}
          {/* 催化剂 — 始终显示 */}
          <div className="flex gap-1.5">
            <span className="text-yellow-500/80 font-medium text-xs w-10 shrink-0">催化剂</span>
            {setup.newsType ? (
              <span className={cn(
                "text-xs leading-tight",
                setup.newsImpact === "BULLISH" && "text-green-400",
                setup.newsImpact === "BEARISH" && "text-red-400",
                setup.newsImpact === "NEUTRAL" && "text-muted-foreground",
                setup.newsImpact === "UNCERTAIN" && "text-yellow-400",
                !setup.newsImpact && "text-foreground/80",
              )}>
                {NEWS_TYPE_LABELS[setup.newsType as NewsType]}
                {setup.newsImpact && setup.newsType !== "TECHNICAL" && (
                  <span className="ml-1 opacity-90">· {NEWS_IMPACT_LABELS[setup.newsImpact as NewsImpact]}</span>
                )}
                {setup.newsHeadline && (
                  <span className="text-yellow-500/60 ml-1">— {setup.newsHeadline}</span>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">无</span>
            )}
          </div>
        </div>

        {/* ── 盘前计划 ── */}
        {(setup.setupLogic ?? setup.entryCondition ?? setup.stopCondition ?? setup.target1Condition ?? setup.newsHeadline) && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">盘前计划</p>
            {setup.newsHeadline && (
              <p className="text-xs text-yellow-500/90">📰 {setup.newsHeadline}</p>
            )}
            {setup.setupLogic && (
              <p className="text-xs text-foreground/70 leading-relaxed">{setup.setupLogic}</p>
            )}
            <div className="space-y-1">
              {setup.entryCondition && (
                <div className="flex gap-2">
                  <span className="text-green-500 font-medium text-xs w-10 shrink-0">入场</span>
                  <span className="text-xs text-foreground/80">
                    {setup.entryCondition}
                    {setup.entryPriceNote && <span className="text-muted-foreground ml-1">({setup.entryPriceNote})</span>}
                  </span>
                </div>
              )}
              {(setup.stopCondition ?? setup.stopPriceNote) && (
                <div className="flex gap-2">
                  <span className="text-red-500 font-medium text-xs w-10 shrink-0">止损</span>
                  <span className="text-xs text-foreground/80">
                    {setup.stopCondition ?? ""}
                    {setup.stopPriceNote && <span className="text-muted-foreground ml-1">({setup.stopPriceNote})</span>}
                  </span>
                </div>
              )}
              {(setup.target1Condition ?? setup.target1PriceNote) && (
                <div className="flex gap-2">
                  <span className="text-blue-400 font-medium text-xs w-10 shrink-0">目标1</span>
                  <span className="text-xs text-foreground/80">
                    {setup.target1Condition ?? ""}
                    {setup.target1PriceNote && <span className="text-muted-foreground ml-1">({setup.target1PriceNote})</span>}
                  </span>
                </div>
              )}
              {(setup.target2Condition ?? (setup as unknown as { target2PriceNote?: string }).target2PriceNote) && (
                <div className="flex gap-2">
                  <span className="text-blue-400/70 font-medium text-xs w-10 shrink-0">目标2</span>
                  <span className="text-xs text-foreground/70">
                    {setup.target2Condition ?? ""}
                    {(setup as unknown as { target2PriceNote?: string }).target2PriceNote && (
                      <span className="text-muted-foreground ml-1">({(setup as unknown as { target2PriceNote?: string }).target2PriceNote})</span>
                    )}
                  </span>
                </div>
              )}
              {(setup.plannedRiskReward ?? setup.plannedSize) && (
                <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                  {setup.plannedRiskReward && <span>计划R: {setup.plannedRiskReward}R</span>}
                  {setup.plannedSize && <span>仓位: {setup.plannedSize}股</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 盘中评估 ── */}
        {(() => {
          const s = setup as unknown as Record<string, unknown>
          const mktJudge = s.marketJudgmentAccurate as boolean | null | undefined
          const mktNote = s.marketJudgmentNote as string | undefined
          const stratSel = s.strategySelectionAccurate as boolean | null | undefined
          const stratNote = s.strategySelectionNote as string | undefined
          const entryOpp = s.entryOpportunityAccurate as boolean | null | undefined
          const entryNote = s.entryOpportunityNote as string | undefined
          const exitOpp = s.exitOpportunityAccurate as boolean | null | undefined
          const exitNote = s.exitOpportunityNote as string | undefined

          const hasIntraData =
            setup.stockSelectionAccurate !== null ||
            mktJudge !== null && mktJudge !== undefined ||
            stratSel !== null && stratSel !== undefined ||
            entryOpp !== null && entryOpp !== undefined ||
            exitOpp !== null && exitOpp !== undefined ||
            setup.actualEntryOpportunity ||
            setup.actualExitOpportunity ||
            setup.dailySummary ||
            setup.status === "MISSED"

          if (!hasIntraData) return null

          const judgmentItems = [
            { label: "行情", val: mktJudge, note: mktNote },
            { label: "策略", val: stratSel, note: stratNote },
            { label: "入场", val: entryOpp, note: entryNote },
            { label: "出场", val: exitOpp, note: exitNote },
          ]

          return (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">盘中记录</p>

                {/* 评估徽章行 */}
                <div className="flex gap-1.5 flex-wrap">
                  {setup.stockSelectionAccurate !== null && (
                    <Badge
                      variant="outline"
                      className={cn("text-xs py-0", setup.stockSelectionAccurate
                        ? "border-green-700 text-green-400"
                        : "border-red-700 text-red-400")}
                    >
                      选股 {setup.stockSelectionAccurate ? "✓" : "✗"}
                    </Badge>
                  )}
                  {judgmentItems.map(({ label, val }) =>
                    val !== null && val !== undefined ? (
                      <Badge
                        key={label}
                        variant="outline"
                        className={cn("text-xs py-0", val
                          ? "border-green-700 text-green-400"
                          : "border-orange-700 text-orange-400")}
                      >
                        {label} {val ? "✓" : "✗"}
                      </Badge>
                    ) : null
                  )}
                </div>

                {/* 失误说明 */}
                {setup.stockSelectionAccurate === false && setup.stockSelectionNote && (
                  <p className="text-xs text-red-400/80">
                    <span className="font-medium">选股失误：</span>{setup.stockSelectionNote}
                  </p>
                )}
                {judgmentItems.map(({ label, val, note }) =>
                  val === false && note ? (
                    <p key={label} className="text-xs text-orange-400/80">
                      <span className="font-medium">{label}失误：</span>{note}
                    </p>
                  ) : null
                )}

                {setup.actualEntryOpportunity && (
                  <p className="text-xs text-foreground/80">
                    <span className="text-green-500 font-medium">实际入场：</span>{setup.actualEntryOpportunity}
                  </p>
                )}
                {setup.actualExitOpportunity && (
                  <p className="text-xs text-foreground/80">
                    <span className="text-blue-400 font-medium">实际出场：</span>{setup.actualExitOpportunity}
                  </p>
                )}
                {setup.dailySummary && (
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <span className="font-medium text-muted-foreground">标的总结：</span>{setup.dailySummary}
                  </p>
                )}

              </div>
            </>
          )
        })()}

        {/* ── 错过记录 ── */}
        {setup.status === "MISSED" && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">错过记录</p>
              <div className="text-xs space-y-0.5 pl-2 border-l-2 border-orange-800/50">
                {setup.missedReason && (
                  <p className="text-foreground/80">
                    <span className="text-orange-400 font-medium">原因：</span>
                    {MISSED_REASON_LABELS[setup.missedReason as MissedReason]}
                  </p>
                )}
                {setup.missedNotes && (
                  <p className="text-muted-foreground">{setup.missedNotes}</p>
                )}
                {setup.missedHypoPnL !== null && setup.missedHypoPnL !== undefined && (
                  <p className={cn("font-semibold", setup.missedHypoPnL >= 0 ? "text-green-400" : "text-red-400")}>
                    假设盈亏：{formatPnL(setup.missedHypoPnL)}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── 执行记录 ── */}
        {setup.executions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                执行记录（{setup.executions.length} 笔）
              </p>
              {setup.executions.map((ex, i) => (
                <div key={ex.id} className="text-xs space-y-0.5 pl-2 border-l-2 border-primary/30">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-foreground/80">
                    <span className="font-medium text-muted-foreground">第{i + 1}笔</span>
                    <span>入场 <strong>${ex.entryPrice}</strong> × {ex.quantity}股</span>
                    {ex.entryTime && (
                      <span className="text-muted-foreground">
                        {new Date(ex.entryTime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {ex.exitPrice && <span>出场 <strong>${ex.exitPrice}</strong></span>}
                    {ex.exitTime && (
                      <span className="text-muted-foreground">
                        {new Date(ex.exitTime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {ex.pnl !== null && (
                      <span className={cn("font-semibold", ex.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                        {formatPnL(ex.pnl)}
                      </span>
                    )}
                  </div>
                  {(ex.entryConditionMet !== null || ex.exitConditionMet !== null) && (
                    <div className="flex gap-2 flex-wrap">
                      {ex.entryConditionMet !== null && (
                        <span className={cn("text-[10px]", ex.entryConditionMet ? "text-green-400" : "text-red-400")}>
                          入场条件{ex.entryConditionMet ? "✓ 满足" : "✗ 未满足"}
                        </span>
                      )}
                      {ex.exitConditionMet !== null && (
                        <span className={cn("text-[10px]", ex.exitConditionMet ? "text-green-400" : "text-orange-400")}>
                          出场条件{ex.exitConditionMet ? "✓ 满足" : "✗ 未满足"}
                        </span>
                      )}
                    </div>
                  )}
                  {ex.entryConditionNotes && (
                    <p className="text-[10px] text-muted-foreground">
                      <span className="text-red-400/70">入场：</span>{ex.entryConditionNotes}
                    </p>
                  )}
                  {ex.exitConditionNotes && (
                    <p className="text-[10px] text-muted-foreground">
                      <span className="text-orange-400/70">出场：</span>{ex.exitConditionNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── 截图 ── */}
        {allScreenshots.length > 0 && (
          <>
            <Separator />
            <ScreenshotGrid screenshots={allScreenshots} title="截图记录" />
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────
export function DailySummarySection({ session }: Props) {
  const hasAnyData =
    session.setups.length > 0 ||
    session.marketContext ||
    session.preMarketPlan ||
    session.postReview

  if (!hasAnyData) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">今日尚无记录</p>
          <p className="text-xs text-muted-foreground mt-1">在「盘前计划」中添加 Setup 开始记录</p>
        </CardContent>
      </Card>
    )
  }

  // 大盘截图（session 级别）
  const sessionScreenshots = session.screenshots

  return (
    <div className="space-y-4">

      {/* ── 大盘环境 & 整体计划 ── */}
      {(session.marketContext ?? session.preMarketPlan) && (
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">大盘 & 整体计划</p>
            {session.marketContext && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">大盘环境</p>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{session.marketContext}</p>
              </div>
            )}
            {session.preMarketPlan && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">今日计划</p>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{session.preMarketPlan}</p>
              </div>
            )}
            {sessionScreenshots.length > 0 && (
              <>
                <Separator />
                <ScreenshotGrid screenshots={sessionScreenshots} title="大盘截图" />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── 各标的 Setup 汇总 ── */}
      {session.setups.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>标的汇总</span>
            <span className="text-xs text-muted-foreground font-normal">
              {session.setups.length} 个 Setup
              {session.setups.filter(s => s.status === "EXECUTED").length > 0 && (
                <span className="ml-1 text-green-400">
                  · {session.setups.filter(s => s.status === "EXECUTED").length} 已执行
                </span>
              )}
              {session.setups.filter(s => s.status === "MISSED").length > 0 && (
                <span className="ml-1 text-orange-400">
                  · {session.setups.filter(s => s.status === "MISSED").length} 已错过
                </span>
              )}
            </span>
          </div>
          {session.setups.map((setup) => (
            <SetupSummaryCard key={setup.id} setup={setup} />
          ))}
        </div>
      )}

      {/* ── 盘后复盘 ── */}
      {(session.postReview ?? session.whatWentWell ?? session.lessonsLearned ?? session.planFollowed) && (
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">盘后复盘</p>
            {session.postReview && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">今日复盘</p>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{session.postReview}</p>
              </div>
            )}
            {(session.whatWentWell ?? session.lessonsLearned) && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {session.whatWentWell && (
                  <div>
                    <p className="text-xs font-medium text-green-400 mb-0.5">做对了</p>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{session.whatWentWell}</p>
                  </div>
                )}
                {session.lessonsLearned && (
                  <div>
                    <p className="text-xs font-medium text-orange-400 mb-0.5">今日教训</p>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{session.lessonsLearned}</p>
                  </div>
                )}
              </div>
            )}
            {(session.planFollowed ?? session.emotionRating ?? session.focusRating) && (
              <div className="flex gap-6 text-xs">
                {session.planFollowed && (
                  <div>
                    <span className="text-muted-foreground">遵守计划 </span>
                    <span className="text-yellow-400">{"★".repeat(session.planFollowed)}{"☆".repeat(5 - session.planFollowed)}</span>
                  </div>
                )}
                {session.emotionRating && (
                  <div>
                    <span className="text-muted-foreground">情绪 </span>
                    <span className="text-yellow-400">{"★".repeat(session.emotionRating)}{"☆".repeat(5 - session.emotionRating)}</span>
                  </div>
                )}
                {session.focusRating && (
                  <div>
                    <span className="text-muted-foreground">专注度 </span>
                    <span className="text-yellow-400">{"★".repeat(session.focusRating)}{"☆".repeat(5 - session.focusRating)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
