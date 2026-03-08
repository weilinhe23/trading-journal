import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export default function HomePage() {
  const today = format(new Date(), "yyyy-MM-dd")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {format(new Date(), "yyyy年MM月dd日")} · 今日概览
        </p>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">今日交易日志</CardTitle>
            <CardDescription>打开今天的盘前/盘中/盘后记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/journal/${today}`}>打开今日日志</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">日历视图</CardTitle>
            <CardDescription>查看历史记录，按日期导航</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/journal">查看日历</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">统计分析</CardTitle>
            <CardDescription>胜率、盈亏曲线、错过机会分析</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/analytics">查看统计</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 开发阶段提示 */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">开发中</Badge>
            <div className="text-sm text-muted-foreground">
              <p>系统正在开发中。当前已完成 Phase 1 基础骨架。</p>
              <p className="mt-1">后续将完成：日历页面 → TradeSetup → 执行记录 → 截图 → 统计分析</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
