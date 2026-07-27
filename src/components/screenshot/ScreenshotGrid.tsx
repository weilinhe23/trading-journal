"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog"
import type { Screenshot } from "../../../generated/prisma"

interface LightboxProps {
  src: string
  alt: string
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

// ── 图片灯箱（支持滚轮缩放 + 拖拽平移 + 键盘切换图片）──────────────
function Lightbox({ src, alt, index, total, onClose, onPrev, onNext }: LightboxProps) {
  const [{ scale, tx, ty }, setView] = useState({ scale: 1, tx: 0, ty: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ mx: number; my: number; tx0: number; ty0: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  // 切换图片时重置缩放
  useEffect(() => {
    setView({ scale: 1, tx: 0, ty: 0 })
  }, [src])

  const zoom = useCallback((delta: number) => {
    setView(prev => {
      const next = Math.min(Math.max(prev.scale + delta, 1), 8)
      if (next <= 1) return { scale: 1, tx: 0, ty: 0 }
      return { ...prev, scale: next }
    })
  }, [])

  const reset = useCallback(() => setView({ scale: 1, tx: 0, ty: 0 }), [])

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "=" || e.key === "+") zoom(0.5)
      else if (e.key === "-") zoom(-0.5)
      else if (e.key === "0") reset()
      else if (e.key === "ArrowLeft") {
        if (scaleRef.current > 1) setView(v => ({ ...v, tx: v.tx - 40 }))
        else onPrev()
      }
      else if (e.key === "ArrowRight") {
        if (scaleRef.current > 1) setView(v => ({ ...v, tx: v.tx + 40 }))
        else onNext()
      }
      else if (e.key === "ArrowUp") setView(v => v.scale > 1 ? { ...v, ty: v.ty - 40 } : v)
      else if (e.key === "ArrowDown") setView(v => v.scale > 1 ? { ...v, ty: v.ty + 40 } : v)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [zoom, reset, onPrev, onNext])

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

        {/* ── 顶部工具栏 ── */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg pointer-events-auto">
          {total > 1 && (
            <>
              <span className="text-white/50 text-xs tabular-nums">{index + 1} / {total}</span>
              <div className="w-px h-4 bg-white/20 mx-0.5" />
            </>
          )}
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

        {/* ── 上一张按钮 ── */}
        {total > 1 && index > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-colors"
            title="上一张 (←)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* ── 下一张按钮 ── */}
        {total > 1 && index < total - 1 && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white transition-colors"
            title="下一张 (→)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

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
        <div className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-black/60">
          <p className="text-[11px] text-white/40 truncate flex-1">{alt}</p>
          <p className="text-[10px] text-white/25 shrink-0 ml-2">
            {scale > 1 ? "← → ↑ ↓ 平移" : total > 1 ? "← → 切换图片" : ""}
            {total > 1 || scale > 1 ? " · " : ""}滚轮缩放 · 拖拽移动
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── 截图网格 ──────────────────────────────────────────────────────────
export function ScreenshotGrid({ screenshots, title }: { screenshots: Screenshot[]; title?: string }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  if (screenshots.length === 0) return null

  const handlePrev = () => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i))
  const handleNext = () => setLightboxIdx(i => (i !== null && i < screenshots.length - 1 ? i + 1 : i))

  return (
    <div className="space-y-1.5">
      {title && <p className="text-xs font-medium text-muted-foreground">{title}</p>}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {screenshots.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => setLightboxIdx(idx)}
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
      {lightboxIdx !== null && screenshots[lightboxIdx] != null && (
        <Lightbox
          src={screenshots[lightboxIdx]!.filePath}
          alt={screenshots[lightboxIdx]!.caption ?? screenshots[lightboxIdx]!.originalName}
          index={lightboxIdx}
          total={screenshots.length}
          onClose={() => setLightboxIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
