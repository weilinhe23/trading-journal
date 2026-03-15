import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"
import type { Prisma } from "../../../../../generated/prisma"

// GET /api/setups/search
// 查询参数:
//   strategy       - 策略名称（模糊匹配）
//   newsType       - 新闻类型（精确）
//   missedReason   - 错过原因（精确）
//   status         - 状态，逗号分隔，如 MISSED,EXECUTED
//   priority       - 优先级，逗号分隔，如 HIGH,MEDIUM
//   symbol         - 标的代码（模糊匹配）
//   dateFrom       - 起始日期 YYYY-MM-DD
//   dateTo         - 结束日期 YYYY-MM-DD
export async function GET(req: Request) {
  const url = new URL(req.url)

  const strategy     = url.searchParams.get("strategy") ?? undefined
  const newsType     = url.searchParams.get("newsType") ?? undefined
  const missedReason = url.searchParams.get("missedReason") ?? undefined
  const statusRaw    = url.searchParams.get("status") ?? undefined
  const priorityRaw  = url.searchParams.get("priority") ?? undefined
  const symbol       = url.searchParams.get("symbol") ?? undefined
  const dateFrom     = url.searchParams.get("dateFrom") ?? undefined
  const dateTo       = url.searchParams.get("dateTo") ?? undefined

  const statusList   = statusRaw?.split(",").filter(Boolean)
  const priorityList = priorityRaw?.split(",").filter(Boolean)

  // 构建 Prisma where 条件
  const where: Prisma.TradeSetupWhereInput = {}

  if (symbol?.trim()) {
    where.symbol = { contains: symbol.trim().toUpperCase() }
  }
  if (strategy?.trim()) {
    where.strategy = { contains: strategy.trim() }
  }
  if (newsType) {
    where.newsType = newsType as Prisma.EnumNewsTypeFilter["equals"]
  }
  if (missedReason) {
    where.missedReason = missedReason
  }
  if (statusList && statusList.length > 0) {
    where.status = { in: statusList as Prisma.EnumSetupStatusFilter["in"] }
  }
  if (priorityList && priorityList.length > 0) {
    where.priority = { in: priorityList as Prisma.EnumSetupPriorityFilter["in"] }
  }
  if (dateFrom || dateTo) {
    where.sessionDate = {}
    if (dateFrom) {
      (where.sessionDate as Prisma.DateTimeFilter).gte = new Date(`${dateFrom}T00:00:00.000Z`)
    }
    if (dateTo) {
      (where.sessionDate as Prisma.DateTimeFilter).lte = new Date(`${dateTo}T23:59:59.999Z`)
    }
  }

  try {
    const setups = await prisma.tradeSetup.findMany({
      where,
      orderBy: { sessionDate: "desc" },
      include: {
        executions: true,
        screenshots: { select: { id: true, filePath: true, chartTag: true, caption: true, timeframe: true } },
      },
    })

    return NextResponse.json({ success: true, data: setups, total: setups.length })
  } catch (error) {
    console.error("[GET /api/setups/search]", error)
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 })
  }
}
