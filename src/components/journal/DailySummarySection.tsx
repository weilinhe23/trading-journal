"use client"

import { Moon, ThumbsUp, ThumbsDown } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { cn } from "~/lib/utils"
import type { DailySession, MnqDailyPlan, Screenshot, TradeSetup, Execution } from "../../../generated/prisma"
import { SetupCard } from "~/components/setup/SetupCard"
import { ScreenshotGrid } from "~/components/screenshot/ScreenshotGrid"
import { MNQ_KEY_LEVEL_LABELS, type MnqKeyLevel } from "~/types"

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

// ── 辅助函数 ──────────────────────────────────────────────────────────

function parseEvalNote(plan: MnqDailyPlan, key: string): string {
  try {
    const raw = (plan as unknown as { evalNotesJson?: string | null }).evalNotesJson
    if (!raw) return ""
    const notes = JSON.parse(raw) as Record<string, string>
    return notes[key] ?? ""
  } catch { return "" }
}

// ── 边界准确性只读行 ──────────────────────────────────────────────────

function BandAccuracyRow({
  label,
  evalValue,
  note,
}: {
  label: string
  evalValue: boolean | null | undefined
  note: string
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-foreground/80 flex-1 min-w-0">{label}</span>
        {evalValue === true && (
          <span className={cn(
            "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded",
            "bg-green-700 text-white",
          )}>
            <ThumbsUp className="h-2.5 w-2.5" />准
          </span>
        )}
        {evalValue === false && (
          <span className={cn(
            "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded",
            "bg-red-700 text-white",
          )}>
            <ThumbsDown className="h-2.5 w-2.5" />误
          </span>
        )}
        {evalValue == null && (
          <span className="text-[11px] text-muted-foreground">未评估</span>
        )}
      </div>
      {evalValue === false && note && (
        <p className="text-xs text-foreground/60 leading-relaxed pl-2 whitespace-pre-wrap">{note}</p>
      )}
    </div>
  )
}

// ── 主组件 ────────────────────────────────────────────────────────────
export function DailySummarySection({ session }: Props) {
  const hasAnyData =
    session.setups.length > 0 ||
    [session.marketContext, session.preMarketPlan, session.postReview].some(Boolean)

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
            <SetupCard
              key={setup.id}
              setup={setup}
              summaryMode={true}
              screenshots={setup.screenshots.length > 0 ? setup.screenshots : undefined}
              mnqPlan={setup.symbol === "MNQ" ? session.mnqPlan : null}
            />
          ))}
        </div>
      )}

      {/* ── MNQ 边界准确性（仅震荡日且已选边界时） ── */}
      {session.mnqPlan?.scenario === "RANGE_SWEEP" &&
        [session.mnqPlan.sweepUpBand, session.mnqPlan.sweepDownBand].some(Boolean) && (
          <Card>
            <CardContent className="pt-4 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-500/90 uppercase tracking-wide">MNQ 边界评估</span>
                <Badge variant="outline" className="text-xs py-0 border-amber-600/50 text-amber-400">
                  震荡日
                </Badge>
              </div>
              <div className="space-y-1.5">
                {session.mnqPlan.sweepUpBand && (
                  <BandAccuracyRow
                    label={`上边界: ${MNQ_KEY_LEVEL_LABELS[session.mnqPlan.sweepUpBand as MnqKeyLevel] ?? session.mnqPlan.sweepUpBand}`}
                    evalValue={session.mnqPlan.evalUpBand}
                    note={parseEvalNote(session.mnqPlan, "evalUpBand")}
                  />
                )}
                {session.mnqPlan.sweepDownBand && (
                  <BandAccuracyRow
                    label={`下边界: ${MNQ_KEY_LEVEL_LABELS[session.mnqPlan.sweepDownBand as MnqKeyLevel] ?? session.mnqPlan.sweepDownBand}`}
                    evalValue={session.mnqPlan.evalDownBand}
                    note={parseEvalNote(session.mnqPlan, "evalDownBand")}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* ── MNQ 持仓过夜 ── */}
      {session.mnqPlan?.heldOvernight !== null &&
        session.mnqPlan?.heldOvernight !== undefined && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                  MNQ 持仓过夜
                </span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    session.mnqPlan.heldOvernight
                      ? "bg-indigo-900/40 text-indigo-300"
                      : "bg-green-900/40 text-green-300",
                  )}
                >
                  {session.mnqPlan.heldOvernight ? "是" : "否 · 当日平仓"}
                </span>
              </div>
              {session.mnqPlan.heldOvernight && session.mnqPlan.overnightNote && (
                <p className="mt-2 text-xs text-foreground/75 leading-relaxed whitespace-pre-wrap pl-5">
                  {session.mnqPlan.overnightNote}
                </p>
              )}
            </CardContent>
          </Card>
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
