"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog"
import type { DailySession, MnqDailyPlan, Screenshot, TradeSetup, Execution } from "../../../generated/prisma"
import { SetupCard } from "~/components/setup/SetupCard"

type SetupFull = TradeSetup & {
  executions: Execution[]
  screenshots: Screenshot[]
}

type SessionFull = DailySession & {
  screenshots: Screenshot[]
  setups: SetupFull[]
  mnqPlan: MnqDailyPlan | null
}

interface Props {
  session: SessionFull
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
            <div key={setup.id} className="space-y-0">
              <SetupCard
                setup={setup}
                intraMode={true}
                mnqPlan={setup.symbol === "MNQ" ? session.mnqPlan : null}
              />
              {setup.screenshots.length > 0 && (
                <div className="px-4 pb-3 -mt-1">
                  <ScreenshotGrid screenshots={setup.screenshots} title="Setup 截图" />
                </div>
              )}
            </div>
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
