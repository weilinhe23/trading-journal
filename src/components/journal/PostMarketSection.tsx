"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import { ScreenshotUploader } from "~/components/screenshot/ScreenshotUploader"
import { cn } from "~/lib/utils"
import { formatPnL } from "~/lib/pnl"
import { MISSED_REASON_LABELS, type MissedReason } from "~/types"
import type { DailySession, Screenshot, TradeSetup, Execution } from "../../../generated/prisma"

type SetupWithExecutions = TradeSetup & { executions: Execution[]; screenshots: Screenshot[] }

type SessionWithRelations = DailySession & {
  screenshots: Screenshot[]
  setups: SetupWithExecutions[]
}

interface Props {
  session: SessionWithRelations
  date: string
}

function StarRating({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${
            (value ?? 0) >= star ? "text-yellow-400" : "text-muted-foreground"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

const DIR_LABEL: Record<string, { label: string; className: string }> = {
  LONG:  { label: "多", className: "bg-green-600 text-white" },
  SHORT: { label: "空", className: "bg-red-600 text-white" },
  TBD:   { label: "待", className: "bg-gray-600 text-white" },
}

const STATUS_LABEL: Record<string, string> = {
  WATCHING:    "观察中",
  EXECUTED:    "已执行",
  MISSED:      "已错过",
  INVALIDATED: "已失效",
  CANCELLED:   "已取消",
}

/** 全日复盘记录：展示盘前/盘中/盘后完整数据 */
function FullReviewRecord({ session, postReview, lessonsLearned, whatWentWell, planFollowed, emotionRating, focusRating }: {
  session: SessionWithRelations
  postReview: string
  lessonsLearned: string
  whatWentWell: string
  planFollowed: number | null
  emotionRating: number | null
  focusRating: number | null
}) {
  const [expandedSetup, setExpandedSetup] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* 盘前计划 */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          ── 盘前计划 ──
        </h4>
        {session.marketContext && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">大盘环境：</span>
            <p className="text-xs text-foreground/80 leading-relaxed mt-0.5">{session.marketContext}</p>
          </div>
        )}
        {session.preMarketPlan && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">整体计划：</span>
            <p className="text-xs text-foreground/80 leading-relaxed mt-0.5">{session.preMarketPlan}</p>
          </div>
        )}
        {/* Setup 计划列表 */}
        {session.setups.length > 0 && (
          <div className="space-y-2 mt-1">
            <span className="text-xs font-medium text-muted-foreground">Setup 列表：</span>
            {session.setups.map((s) => {
              const dir = DIR_LABEL[s.direction] ?? DIR_LABEL["TBD"]!
              const isExpanded = expandedSetup === s.id
              const totalPnL = s.executions.reduce<number | null>((acc, ex) => {
                if (ex.pnl === null) return acc
                return (acc ?? 0) + ex.pnl
              }, null)
              return (
                <div key={s.id} className="border border-border/50 rounded-md p-2 space-y-1">
                  <button
                    onClick={() => setExpandedSetup(isExpanded ? null : s.id)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold">{s.symbol}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", dir.className)}>
                        {dir.label}
                      </span>
                      {s.strategy && <Badge variant="secondary" className="text-xs py-0">{s.strategy}</Badge>}
                      <Badge variant="outline" className="text-xs py-0">{STATUS_LABEL[s.status] ?? s.status}</Badge>
                      {totalPnL !== null && (
                        <span className={cn("text-xs font-medium", totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
                          {formatPnL(totalPnL)}
                        </span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-1 pt-1 border-t border-border/30 mt-1">
                      {/* 盘前条件 */}
                      {s.entryCondition && (
                        <p className="text-xs"><span className="text-green-500 font-medium">入场：</span>{s.entryCondition}{s.entryPriceNote && <span className="text-muted-foreground"> ({s.entryPriceNote})</span>}</p>
                      )}
                      {(s.stopCondition ?? s.stopPriceNote) && (
                        <p className="text-xs"><span className="text-red-500 font-medium">止损：</span>{s.stopCondition ?? ""}{s.stopPriceNote && <span className="text-muted-foreground"> ({s.stopPriceNote})</span>}</p>
                      )}
                      {(s.target1Condition ?? s.target1PriceNote) && (
                        <p className="text-xs"><span className="text-blue-400 font-medium">目标1：</span>{s.target1Condition ?? ""}{s.target1PriceNote && <span className="text-muted-foreground"> ({s.target1PriceNote})</span>}</p>
                      )}
                      {(s.target2Condition ?? (s as unknown as { target2PriceNote?: string }).target2PriceNote) && (
                        <p className="text-xs"><span className="text-blue-400/70 font-medium">目标2：</span>{s.target2Condition ?? ""}{(s as unknown as { target2PriceNote?: string }).target2PriceNote && <span className="text-muted-foreground"> ({(s as unknown as { target2PriceNote?: string }).target2PriceNote})</span>}</p>
                      )}
                      {/* 盘中评估 */}
                      {(s.stockSelectionAccurate !== null || s.analysisAccurate !== null) && (
                        <div className="flex gap-2 mt-0.5 flex-wrap">
                          {s.stockSelectionAccurate !== null && (
                            <Badge variant="outline" className={cn("text-xs py-0", s.stockSelectionAccurate ? "border-green-700 text-green-400" : "border-red-700 text-red-400")}>
                              选股{s.stockSelectionAccurate ? "✓" : "✗"}
                            </Badge>
                          )}
                          {s.analysisAccurate !== null && (
                            <Badge variant="outline" className={cn("text-xs py-0", s.analysisAccurate ? "border-green-700 text-green-400" : "border-orange-700 text-orange-400")}>
                              判断{s.analysisAccurate ? "✓" : "✗"}
                            </Badge>
                          )}
                        </div>
                      )}
                      {s.actualEntryOpportunity && (
                        <p className="text-xs text-muted-foreground"><span className="text-green-500 font-medium">实际入场：</span>{s.actualEntryOpportunity}</p>
                      )}
                      {s.actualExitOpportunity && (
                        <p className="text-xs text-muted-foreground"><span className="text-blue-400 font-medium">实际出场：</span>{s.actualExitOpportunity}</p>
                      )}
                      {s.analysisAccurateNote && (
                        <p className="text-xs text-orange-400/80"><span className="font-medium">判断失误：</span>{s.analysisAccurateNote}</p>
                      )}
                      {s.dailySummary && (
                        <p className="text-xs text-foreground/70"><span className="font-medium text-muted-foreground">标的总结：</span>{s.dailySummary}</p>
                      )}
                      {/* 错过原因 */}
                      {s.status === "MISSED" && s.missedReason && (
                        <p className="text-xs text-muted-foreground"><span className="font-medium">错过原因：</span>{MISSED_REASON_LABELS[s.missedReason as MissedReason]}{s.missedNotes && <span className="ml-1">— {s.missedNotes}</span>}</p>
                      )}
                      {/* 执行记录 */}
                      {s.executions.length > 0 && (
                        <div className="space-y-0.5 mt-1 pt-1 border-t border-border/20">
                          {s.executions.map((ex, i) => (
                            <div key={ex.id} className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                              <span className="font-medium">执行{i + 1}：</span>
                              <span>入场 ${ex.entryPrice} × {ex.quantity}股</span>
                              {ex.exitPrice && <span>出场 ${ex.exitPrice}</span>}
                              {ex.pnl !== null && (
                                <span className={cn("font-medium", ex.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                                  {formatPnL(ex.pnl)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* 盘后复盘 */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          ── 盘后复盘 ──
        </h4>
        {postReview && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">今日复盘：</span>
            <p className="text-xs text-foreground/80 leading-relaxed mt-0.5 whitespace-pre-wrap">{postReview}</p>
          </div>
        )}
        {whatWentWell && (
          <div>
            <span className="text-xs font-medium text-green-400">做对了：</span>
            <p className="text-xs text-foreground/80 leading-relaxed mt-0.5 whitespace-pre-wrap">{whatWentWell}</p>
          </div>
        )}
        {lessonsLearned && (
          <div>
            <span className="text-xs font-medium text-orange-400">今日教训：</span>
            <p className="text-xs text-foreground/80 leading-relaxed mt-0.5 whitespace-pre-wrap">{lessonsLearned}</p>
          </div>
        )}
        {(planFollowed ?? emotionRating ?? focusRating) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {planFollowed && <span>遵守计划：{"★".repeat(planFollowed)}{"☆".repeat(5 - planFollowed)}</span>}
            {emotionRating && <span>情绪：{"★".repeat(emotionRating)}{"☆".repeat(5 - emotionRating)}</span>}
            {focusRating && <span>专注度：{"★".repeat(focusRating)}{"☆".repeat(5 - focusRating)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export function PostMarketSection({ session, date }: Props) {
  const router = useRouter()
  const [postReview, setPostReview] = useState(session.postReview ?? "")
  const [lessonsLearned, setLessonsLearned] = useState(session.lessonsLearned ?? "")
  const [whatWentWell, setWhatWentWell] = useState(session.whatWentWell ?? "")
  const [planFollowed, setPlanFollowed] = useState<number | null>(session.planFollowed)
  const [emotionRating, setEmotionRating] = useState<number | null>(session.emotionRating)
  const [focusRating, setFocusRating] = useState<number | null>(session.focusRating)
  const [saving, setSaving] = useState(false)
  const [showFullReview, setShowFullReview] = useState(false)

  const setupsWithSummary = session.setups.filter((s) => s.dailySummary)

  const allScreenshots = [
    ...session.screenshots,
    ...session.setups.flatMap((s) => s.screenshots),
  ].filter((sc, idx, arr) => arr.findIndex((x) => x.id === sc.id) === idx)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sessions/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postReview,
          lessonsLearned,
          whatWentWell,
          ...(planFollowed !== null && { planFollowed }),
          ...(emotionRating !== null && { emotionRating }),
          ...(focusRating !== null && { focusRating }),
        }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success("盘后复盘已保存")
        setShowFullReview(true)
        router.refresh()
      } else {
        toast.error(json.error ?? "保存失败")
      }
    } catch {
      toast.error("网络错误，保存失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 各标的单日总结 */}
      {setupsWithSummary.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">各标的单日总结</CardTitle>
              <Button
                variant="ghost" size="sm"
                className="h-6 text-xs gap-1 text-muted-foreground"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="h-3 w-3" />刷新
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {setupsWithSummary.map((s) => (
              <div key={s.id} className="space-y-1">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-bold">{s.symbol}</span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded font-medium",
                    s.direction === "LONG" ? "bg-green-600 text-white" : s.direction === "SHORT" ? "bg-red-600 text-white" : "bg-gray-600 text-white",
                  )}>
                    {s.direction === "LONG" ? "多" : s.direction === "SHORT" ? "空" : "待"}
                  </span>
                  {s.stockSelectionAccurate !== null && (
                    <Badge variant="outline" className={cn("text-xs", s.stockSelectionAccurate ? "border-green-700 text-green-400" : "border-red-700 text-red-400")}>
                      选股{s.stockSelectionAccurate ? "✓ 准" : "✗ 误"}
                    </Badge>
                  )}
                  {s.analysisAccurate !== null && (
                    <Badge variant="outline" className={cn("text-xs", s.analysisAccurate ? "border-green-700 text-green-400" : "border-orange-700 text-orange-400")}>
                      判断{s.analysisAccurate ? "✓ 准" : "✗ 误"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{s.dailySummary}</p>
                {s.actualEntryOpportunity && (
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">实际入场：</span>{s.actualEntryOpportunity}
                  </p>
                )}
                {s.actualExitOpportunity && (
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-400 font-medium">实际出场：</span>{s.actualExitOpportunity}
                  </p>
                )}
                {s.analysisAccurateNote && (
                  <p className="text-xs text-orange-400/80">
                    <span className="font-medium">判断失误：</span>{s.analysisAccurateNote}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 截图批量上传 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">截图上传 & 分配</CardTitle>
        </CardHeader>
        <CardContent>
          <ScreenshotUploader date={date} initialScreenshots={allScreenshots} setups={session.setups} />
        </CardContent>
      </Card>

      {/* 复盘总结 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">复盘总结</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">今日整体复盘</Label>
            <Textarea
              placeholder="今日整体执行情况、市场表现、与盘前计划的偏差..."
              value={postReview}
              onChange={(e) => setPostReview(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">做对了什么</Label>
              <Textarea
                placeholder="正向强化：今日值得保留的行为..."
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">今日教训</Label>
              <Textarea
                placeholder="需要改进的地方，下次注意..."
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 每日评分 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">今日评分</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">遵守计划</Label>
              <StarRating value={planFollowed} onChange={setPlanFollowed} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">情绪控制</Label>
              <StarRating value={emotionRating} onChange={setEmotionRating} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">专注度</Label>
              <StarRating value={focusRating} onChange={setFocusRating} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存盘后复盘"}
        </Button>
      </div>

      {/* 全日复盘记录（保存后展开显示） */}
      {showFullReview && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                📋 全日复盘记录
              </CardTitle>
              <Button
                variant="ghost" size="sm"
                className="h-6 text-xs text-muted-foreground"
                onClick={() => setShowFullReview(false)}
              >
                收起
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FullReviewRecord
              session={session}
              postReview={postReview}
              lessonsLearned={lessonsLearned}
              whatWentWell={whatWentWell}
              planFollowed={planFollowed}
              emotionRating={emotionRating}
              focusRating={focusRating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
