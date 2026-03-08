"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { X, Upload, ImageIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import type { Screenshot, TradeSetup, Execution } from "../../../generated/prisma"

// ── Types ────────────────────────────────────────────────────────────────────

type SetupWithExecutions = TradeSetup & { executions: Execution[] }

interface Props {
  date: string                          // YYYY-MM-DD
  initialScreenshots: Screenshot[]
  setups: SetupWithExecutions[]
}

// Value encoding for the assignment select
// "unassigned"        → no specific assignment (stays session-level)
// "setup:{id}"        → assigned to a TradeSetup
// "exec:{id}"         → assigned to an Execution
function encodeAssignment(s: Screenshot): string {
  if (s.executionId) return `exec:${s.executionId}`
  if (s.setupId) return `setup:${s.setupId}`
  return "unassigned"
}

const CHART_TAG_LABELS: Record<string, string> = {
  PRE_MARKET_PLAN: "盘前计划图",
  ENTRY_SIGNAL: "入场信号",
  EXIT_SIGNAL: "出场信号",
  MISSED_SIGNAL: "错过信号",
  POST_REVIEW: "复盘标注",
  MARKET_OVERVIEW: "大盘/指数图",
}

// ── Component ────────────────────────────────────────────────────────────────

export function ScreenshotUploader({ date, initialScreenshots, setups }: Props) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>(initialScreenshots)
  const [uploading, setUploading] = useState(false)

  // ── Upload handler ────────────────────────────────────────────────────────

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      setUploading(true)
      let successCount = 0

      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("date", date)

        try {
          const res = await fetch("/api/screenshots", { method: "POST", body: formData })
          const json = (await res.json()) as { success: boolean; data?: Screenshot; error?: string }
          if (json.success && json.data) {
            setScreenshots((prev) => [...prev, json.data!])
            successCount++
          } else {
            toast.error(`${file.name}：${json.error ?? "上传失败"}`)
          }
        } catch {
          toast.error(`${file.name}：网络错误`)
        }
      }

      setUploading(false)
      if (successCount > 0) {
        toast.success(`${successCount} 张截图上传成功`)
      }
    },
    [date],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: true,
  })

  // ── Assignment change ─────────────────────────────────────────────────────

  async function handleAssign(screenshotId: string, value: string) {
    let setupId: string | null = null
    let executionId: string | null = null

    if (value.startsWith("setup:")) {
      setupId = value.slice(6)
    } else if (value.startsWith("exec:")) {
      executionId = value.slice(5)
    }

    try {
      const res = await fetch(`/api/screenshots/${screenshotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupId, executionId }),
      })
      const json = (await res.json()) as { success: boolean; data?: Screenshot; error?: string }
      if (json.success && json.data) {
        setScreenshots((prev) => prev.map((s) => (s.id === screenshotId ? json.data! : s)))
      } else {
        toast.error(json.error ?? "分配失败")
      }
    } catch {
      toast.error("网络错误")
    }
  }

  // ── ChartTag change ───────────────────────────────────────────────────────

  async function handleTagChange(screenshotId: string, value: string) {
    const chartTag = value === "none" ? null : value
    try {
      const res = await fetch(`/api/screenshots/${screenshotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartTag }),
      })
      const json = (await res.json()) as { success: boolean; data?: Screenshot; error?: string }
      if (json.success && json.data) {
        setScreenshots((prev) => prev.map((s) => (s.id === screenshotId ? json.data! : s)))
      } else {
        toast.error(json.error ?? "更新标签失败")
      }
    } catch {
      toast.error("网络错误")
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(screenshotId: string) {
    try {
      const res = await fetch(`/api/screenshots/${screenshotId}`, { method: "DELETE" })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        setScreenshots((prev) => prev.filter((s) => s.id !== screenshotId))
        toast.success("截图已删除")
      } else {
        toast.error(json.error ?? "删除失败")
      }
    } catch {
      toast.error("网络错误")
    }
  }

  // ── Assignment option helpers ─────────────────────────────────────────────

  const hasSetups = setups.length > 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/60",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {uploading ? (
            <span className="text-sm animate-pulse">上传中，请稍候...</span>
          ) : isDragActive ? (
            <>
              <Upload className="h-8 w-8 text-primary" />
              <span className="text-sm text-primary font-medium">松开即可上传</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">拖拽截图到此处，或点击选择文件</span>
              <span className="text-xs">支持 PNG / JPG / GIF / WebP，可批量拖入</span>
            </>
          )}
        </div>
      </div>

      {/* Screenshot grid */}
      {screenshots.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-2">
          暂无截图，上传后在此显示
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {screenshots.map((sc) => (
            <ScreenshotCard
              key={sc.id}
              screenshot={sc}
              setups={setups}
              hasSetups={hasSetups}
              onAssign={handleAssign}
              onTagChange={handleTagChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Screenshot Card ───────────────────────────────────────────────────────────

interface CardProps {
  screenshot: Screenshot
  setups: SetupWithExecutions[]
  hasSetups: boolean
  onAssign: (id: string, value: string) => Promise<void>
  onTagChange: (id: string, value: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function ScreenshotCard({ screenshot, setups, hasSetups, onAssign, onTagChange, onDelete }: CardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden bg-card flex flex-col">
      {/* Thumbnail */}
      <div className="relative group aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {imgError ? (
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        ) : (
          <img
            src={screenshot.filePath}
            alt={screenshot.originalName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {/* Delete button */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(screenshot.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Controls */}
      <div className="p-2 space-y-1.5 flex-1">
        <p className="text-xs text-muted-foreground truncate" title={screenshot.originalName}>
          {screenshot.originalName}
        </p>

        {/* Assignment */}
        {hasSetups && (
          <Select
            value={encodeAssignment(screenshot)}
            onValueChange={(v) => onAssign(screenshot.id, v)}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="分配到..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">会话级别</SelectItem>
              {setups.map((setup) => (
                <SelectItem key={`setup:${setup.id}`} value={`setup:${setup.id}`}>
                  {setup.symbol} · {setup.strategy}
                </SelectItem>
              ))}
              {setups.flatMap((setup) =>
                setup.executions.map((exec) => (
                  <SelectItem key={`exec:${exec.id}`} value={`exec:${exec.id}`}>
                    {setup.symbol} 执行 · ${exec.entryPrice.toFixed(2)}
                  </SelectItem>
                )),
              )}
            </SelectContent>
          </Select>
        )}

        {/* ChartTag */}
        <Select
          value={screenshot.chartTag ?? "none"}
          onValueChange={(v) => onTagChange(screenshot.id, v)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="图表类型..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">未标注</SelectItem>
            {Object.entries(CHART_TAG_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
