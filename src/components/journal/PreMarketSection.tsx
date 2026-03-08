"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { SetupCard } from "~/components/setup/SetupCard"
import { CreateSetupDialog } from "~/components/setup/CreateSetupDialog"
import type { DailySession, Execution, TradeSetup } from "../../../generated/prisma"

type SetupWithExecutions = TradeSetup & { executions: Execution[] }

interface Props {
  session: DailySession & {
    newsEvents: unknown[]
    setups: SetupWithExecutions[]
  }
  date: string
}

export function PreMarketSection({ session, date }: Props) {
  const [marketContext, setMarketContext] = useState(session.marketContext ?? "")
  const [preMarketPlan, setPreMarketPlan] = useState(session.preMarketPlan ?? "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sessions/${date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketContext, preMarketPlan }),
      })
      const json = (await res.json()) as { success: boolean; error?: string }
      if (json.success) {
        toast.success("盘前计划已保存")
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
      {/* 大盘环境 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">大盘环境</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            今日市场背景、指数状态、宏观情绪
          </Label>
          <Textarea
            placeholder="例：大盘处于上升趋势，昨日 SPY 收阳，今日开盘前期货略微下跌。FOMC 会议纪要今日下午公布，需注意 2pm 后波动..."
            value={marketContext}
            onChange={(e) => setMarketContext(e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />
        </CardContent>
      </Card>

      {/* 今日整体计划 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">今日整体计划</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            今日交易目标、注意事项、风险控制要点
          </Label>
          <Textarea
            placeholder="例：今日最多交易 2 个 Setup，单笔风险不超过 $200。重点关注 NVDA 的 VWAP 回踩机会，若大盘走弱则以观察为主不轻易出手..."
            value={preMarketPlan}
            onChange={(e) => setPreMarketPlan(e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存盘前记录"}
        </Button>
      </div>

      {/* 今日 Setup 列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            今日 Setup
            {session.setups.length > 0 && (
              <span className="ml-2 text-muted-foreground font-normal">
                ({session.setups.length} 个)
              </span>
            )}
          </h3>
          <CreateSetupDialog date={date} />
        </div>

        {session.setups.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">还没有 Setup，点击「添加 Setup」开始规划</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {session.setups.map((setup) => (
              <SetupCard key={setup.id} setup={setup} intraMode={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
