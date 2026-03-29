import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ChevronLeft } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { prisma } from "~/lib/prisma"
import { PreMarketSection } from "~/components/journal/PreMarketSection"
import { IntraMarketSection } from "~/components/journal/IntraMarketSection"
import { PostMarketSection } from "~/components/journal/PostMarketSection"
import { DailySummarySection } from "~/components/journal/DailySummarySection"

function parseDateParam(dateStr: string): Date | null {
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateStr)
  if (!match) return null
  const d = new Date(`${dateStr}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

interface PageProps {
  params: Promise<{ date: string }>
}

export default async function DailyJournalPage({ params }: PageProps) {
  const { date: dateParam } = await params
  const date = parseDateParam(dateParam)
  if (!date) notFound()

  // upsert：不存在自动创建（必须先于 MnqDailyPlan 和 MNQ Setup）
  await prisma.dailySession.upsert({
    where: { date },
    create: { date },
    update: {},
  })

  // 自动创建 MnqDailyPlan（upsert，DailySession 已存在）
  await prisma.mnqDailyPlan.upsert({
    where: { sessionDate: date },
    create: { sessionDate: date },
    update: {},
  })

  // 自动创建 MNQ TradeSetup（如果当天还没有）
  const existingMnq = await prisma.tradeSetup.findFirst({
    where: { sessionDate: date, symbol: "MNQ" },
  })
  if (!existingMnq) {
    await prisma.tradeSetup.create({
      data: { sessionDate: date, symbol: "MNQ", direction: "TBD", priority: "HIGH" },
    })
  }

  // 重新查询完整数据（含关联）
  const session = await prisma.dailySession.upsert({
    where: { date },
    create: { date },
    update: {},
    include: {
      newsEvents: { orderBy: { createdAt: "asc" } },
      setups: {
        orderBy: { createdAt: "asc" },
        include: {
          executions: true,
          screenshots: true,
          newsEvents: true,
        },
      },
      screenshots: true,
      mnqPlan: true,
    },
  })

  const displayDate = format(date, "yyyy年MM月dd日 EEEE", { locale: zhCN })

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/journal">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{displayDate}</h1>
          <p className="text-xs text-muted-foreground">{dateParam}</p>
        </div>
      </div>

      {/* 四段式 Tab */}
      <Tabs defaultValue="pre" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pre">盘前计划</TabsTrigger>
          <TabsTrigger value="intra">盘中记录</TabsTrigger>
          <TabsTrigger value="post">盘后复盘</TabsTrigger>
          <TabsTrigger value="summary">今日汇总</TabsTrigger>
        </TabsList>

        <TabsContent value="pre" className="mt-4">
          <PreMarketSection session={session} date={dateParam} />
        </TabsContent>

        <TabsContent value="intra" className="mt-4">
          <IntraMarketSection session={session} date={dateParam} />
        </TabsContent>

        <TabsContent value="post" className="mt-4">
          <PostMarketSection session={session} date={dateParam} />
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <DailySummarySection session={session} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
