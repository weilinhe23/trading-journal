"use client"

import { Card, CardContent } from "~/components/ui/card"
import { SetupCard } from "~/components/setup/SetupCard"
import { CreateSetupDialog } from "~/components/setup/CreateSetupDialog"
import type { DailySession, Execution, MnqDailyPlan, TradeSetup } from "../../../generated/prisma"

type SetupWithExecutions = TradeSetup & { executions: Execution[] }

interface Props {
  session: DailySession & {
    setups: SetupWithExecutions[]
    mnqPlan: MnqDailyPlan | null
  }
  date: string
}

export function IntraMarketSection({ session, date }: Props) {
  const watching = session.setups.filter((s) => s.status === "WATCHING")
  const done = session.setups.filter((s) => s.status !== "WATCHING")

  return (
    <div className="space-y-4">
      {/* 观察中 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            观察中
            {watching.length > 0 && (
              <span className="ml-2 text-muted-foreground font-normal">({watching.length})</span>
            )}
          </h3>
          <CreateSetupDialog date={date} />
        </div>

        {watching.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                {session.setups.length === 0
                  ? "请先在「盘前计划」中添加 Setup"
                  : "所有 Setup 已处理完毕"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {watching.map((setup) => (
              <SetupCard
                key={setup.id}
                setup={setup}
                intraMode={true}
                mnqPlan={setup.symbol === "MNQ" ? session.mnqPlan : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* 已处理 */}
      {done.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            已处理 ({done.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {done.map((setup) => (
              <SetupCard
                key={setup.id}
                setup={setup}
                intraMode={true}
                mnqPlan={setup.symbol === "MNQ" ? session.mnqPlan : null}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
