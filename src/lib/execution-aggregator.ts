import { prisma } from "~/lib/prisma"

const MNQ_TICK = 2

const MNQ_SEG_KEYS = [
  { key: "marketPreJson",       label: "MNQ盘前" },
  { key: "marketOpenJson",      label: "MNQ开盘" },
  { key: "marketMidJson",       label: "MNQ盘中" },
  { key: "marketAfternoonJson", label: "MNQ午盘" },
] as const

interface MnqOpportunity {
  captured: boolean | null
  tradeDirection: "LONG" | "SHORT" | null
  entryPrice: string
  exitPrice: string
  contracts: string
  strategyName?: string | null
  tradeTypeName?: string | null
  entryAccuracy?: "CORRECT" | "WRONG" | null
  entryAccuracyNote?: string | null
  exitAccuracy?: "CORRECT" | "WRONG" | null
  exitAccuracyNote?: string | null
}

function parseMnqOpps(raw: string | null | undefined): MnqOpportunity[] {
  if (!raw) return []
  try {
    const seg = JSON.parse(raw) as { opportunities?: MnqOpportunity[] }
    return seg.opportunities ?? []
  } catch { return [] }
}

function parseFirstTradeType(json: string): string | null {
  try {
    const arr = JSON.parse(json) as string[]
    return arr.length > 0 ? (arr[0] ?? null) : null
  } catch { return null }
}

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export interface TradeRow {
  id: string
  date: string
  weekStart: string
  symbol: string
  direction: "LONG" | "SHORT"
  strategy: string | null
  tradeTypeName: string | null
  segment: string | null
  entryPrice: number
  exitPrice: number | null
  quantity: number
  pnl: number | null
  settled: boolean
  entryConditionMet: boolean | null
  exitConditionMet: boolean | null
  executionGrade: string | null
  entryAccuracy: "CORRECT" | "WRONG" | null
  exitAccuracy: "CORRECT" | "WRONG" | null
  source: "STOCK" | "MNQ"
}

export interface ExecutionFilters {
  dateFrom?: string | null
  dateTo?: string | null
  symbol?: string | null
  strategy?: string | null
  direction?: string | null
  result?: string | null
  source?: string | null
}

export async function fetchExecutionRows(filters: ExecutionFilters = {}): Promise<TradeRow[]> {
  const { dateFrom, dateTo, symbol, strategy, direction, source } = filters

  const sessionWhere: Record<string, unknown> = {}
  if (dateFrom || dateTo) {
    sessionWhere.date = {
      ...(dateFrom ? { gte: new Date(`${dateFrom}T00:00:00.000Z`) } : {}),
      ...(dateTo   ? { lte: new Date(`${dateTo}T00:00:00.000Z`)   } : {}),
    }
  }

  const sessions = await prisma.dailySession.findMany({
    where: sessionWhere,
    include: {
      setups: {
        where: { status: "EXECUTED" },
        include: { executions: true },
      },
      mnqPlan: true,
    },
    orderBy: { date: "asc" },
  })

  const rows: TradeRow[] = []
  let stockIdx = 1
  let mnqIdx   = 1

  const symUpper = symbol?.toUpperCase() ?? ""
  const showStock = !source || source === "STOCK"
  const showMnq   = !source || source === "MNQ"

  for (const session of sessions) {
    const dateStr   = session.date.toISOString().split("T")[0]!
    const weekStart = getMondayOf(session.date).toISOString().split("T")[0]!

    // ── Stock trades ──────────────────────────────────────────────────────
    if (showStock) {
      for (const setup of session.setups) {
        if (symUpper && !setup.symbol.includes(symUpper)) continue
        if (direction === "LONG"  && setup.direction !== "LONG")  continue
        if (direction === "SHORT" && setup.direction !== "SHORT") continue
        if (strategy  && !setup.strategy?.includes(strategy))    continue

        for (const ex of setup.executions) {
          rows.push({
            id:                `T${String(stockIdx++).padStart(2, "0")}`,
            date:              dateStr,
            weekStart,
            symbol:            setup.symbol,
            direction:         setup.direction as "LONG" | "SHORT",
            strategy:          setup.strategy ?? null,
            tradeTypeName:     parseFirstTradeType(setup.selectedTradeTypes),
            segment:           null,
            entryPrice:        ex.entryPrice,
            exitPrice:         ex.exitPrice ?? null,
            quantity:          ex.quantity,
            pnl:               ex.pnl ?? null,
            settled:           ex.pnl !== null,
            entryConditionMet: ex.entryConditionMet ?? null,
            exitConditionMet:  ex.exitConditionMet  ?? null,
            executionGrade:    ex.executionGrade     ?? null,
            entryAccuracy:     null,
            exitAccuracy:      null,
            source:            "STOCK",
          })
        }
      }
    }

    // ── MNQ trades ────────────────────────────────────────────────────────
    if (showMnq && session.mnqPlan) {
      if (!symUpper || "MNQ".includes(symUpper)) {
        const plan = session.mnqPlan
        for (const { key, label } of MNQ_SEG_KEYS) {
          const raw  = plan[key]
          const opps = parseMnqOpps(raw)
          for (const opp of opps) {
            if (opp.captured !== true)      continue
            if (!opp.tradeDirection)         continue
            if (direction && opp.tradeDirection !== direction) continue
            if (strategy  && !opp.strategyName?.includes(strategy)) continue

            const entry = parseFloat(opp.entryPrice)
            const exit  = parseFloat(opp.exitPrice)
            const qty   = parseFloat(opp.contracts || "1")

            let pnl: number | null = null
            if (!isNaN(entry) && !isNaN(exit) && entry > 0 && exit > 0) {
              const dir = opp.tradeDirection === "SHORT" ? -1 : 1
              pnl = Math.round((exit - entry) * dir * (isNaN(qty) ? 1 : qty) * MNQ_TICK * 100) / 100
            }

            rows.push({
              id:                `M${String(mnqIdx++).padStart(2, "0")}`,
              date:              dateStr,
              weekStart,
              symbol:            "MNQ",
              direction:         opp.tradeDirection,
              strategy:          opp.strategyName ?? null,
              tradeTypeName:     opp.tradeTypeName ?? null,
              segment:           label,
              entryPrice:        !isNaN(entry) && entry > 0 ? entry : 0,
              exitPrice:         !isNaN(exit)  && exit  > 0 ? exit  : null,
              quantity:          !isNaN(qty)   && qty   > 0 ? qty   : 1,
              pnl,
              settled:           pnl !== null,
              entryConditionMet: null,
              exitConditionMet:  null,
              executionGrade:    null,
              entryAccuracy:     opp.entryAccuracy  ?? null,
              exitAccuracy:      opp.exitAccuracy   ?? null,
              source:            "MNQ",
            })
          }
        }
      }
    }
  }

  // Apply result filter after computing pnl
  const result = filters.result
  if (result === "WIN")       return rows.filter((r) => r.pnl !== null && r.pnl > 0)
  if (result === "LOSS")      return rows.filter((r) => r.pnl !== null && r.pnl < 0)
  if (result === "BREAKEVEN") return rows.filter((r) => r.pnl !== null && r.pnl === 0)
  return rows
}

export function computeSummary(rows: TradeRow[]) {
  const settled = rows.filter((r) => r.pnl !== null)
  const wins    = settled.filter((r) => (r.pnl ?? 0) > 0)
  const losses  = settled.filter((r) => (r.pnl ?? 0) < 0)

  const totalPnL = settled.reduce((s, r) => s + (r.pnl ?? 0), 0)
  const winRate  = settled.length > 0 ? (wins.length / settled.length) * 100 : 0
  const avgPnL   = settled.length > 0 ? totalPnL / settled.length : 0
  const maxWin   = wins.length   > 0 ? Math.max(...wins.map((r)   => r.pnl ?? 0)) : 0
  const maxLoss  = losses.length > 0 ? Math.min(...losses.map((r) => r.pnl ?? 0)) : 0
  const avgWin   = wins.length   > 0 ? wins.reduce((s, r)   => s + (r.pnl ?? 0), 0) / wins.length   : 0
  const avgLoss  = losses.length > 0 ? losses.reduce((s, r) => s + (r.pnl ?? 0), 0) / losses.length : 0

  const r  = (n: number) => Math.round(n * 100) / 100
  const r1 = (n: number) => Math.round(n * 10)  / 10

  return {
    totalCount:   rows.length,
    settledCount: settled.length,
    totalPnL:     r(totalPnL),
    winRate:      r1(winRate),
    avgPnL:       r(avgPnL),
    maxWin:       r(maxWin),
    maxLoss:      r(maxLoss),
    profitFactor: avgLoss !== 0 ? r1(Math.abs(avgWin / avgLoss)) : null,
    winsCount:    wins.length,
    lossesCount:  losses.length,
  }
}

export function computeCharts(rows: TradeRow[]) {
  const settled = rows.filter((r) => r.pnl !== null)
  const r = (n: number) => Math.round(n * 100) / 100
  const r1 = (n: number) => Math.round(n * 10) / 10

  // Cumulative by date
  const dailyMap = new Map<string, number>()
  for (const row of settled) {
    dailyMap.set(row.date, (dailyMap.get(row.date) ?? 0) + (row.pnl ?? 0))
  }
  let running = 0
  const cumulative = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, pnl]) => { running += pnl; return { date, pnl: r(pnl), cumPnL: r(running) } })

  // By symbol
  const symMap = new Map<string, { pnl: number; count: number }>()
  for (const row of settled) {
    const cur = symMap.get(row.symbol) ?? { pnl: 0, count: 0 }
    symMap.set(row.symbol, { pnl: cur.pnl + (row.pnl ?? 0), count: cur.count + 1 })
  }
  const bySymbol = Array.from(symMap.entries())
    .map(([sym, { pnl, count }]) => ({ symbol: sym, pnl: r(pnl), count }))
    .sort((a, b) => b.pnl - a.pnl)

  // By strategy
  const stratMap = new Map<string, { pnl: number; count: number; wins: number }>()
  for (const row of settled) {
    const key = row.strategy ?? "未分类"
    const cur = stratMap.get(key) ?? { pnl: 0, count: 0, wins: 0 }
    stratMap.set(key, { pnl: cur.pnl + (row.pnl ?? 0), count: cur.count + 1, wins: cur.wins + ((row.pnl ?? 0) > 0 ? 1 : 0) })
  }
  const byStrategy = Array.from(stratMap.entries())
    .map(([strat, { pnl, count, wins }]) => ({
      strategy: strat, pnl: r(pnl), count,
      winRate: count > 0 ? r1((wins / count) * 100) : 0,
    }))
    .sort((a, b) => b.pnl - a.pnl)

  // Daily heatmap
  const heatMap = new Map<string, { pnl: number; count: number }>()
  for (const row of settled) {
    const cur = heatMap.get(row.date) ?? { pnl: 0, count: 0 }
    heatMap.set(row.date, { pnl: cur.pnl + (row.pnl ?? 0), count: cur.count + 1 })
  }
  const dailyHeatmap = Array.from(heatMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { pnl, count }]) => ({ date, pnl: r(pnl), count }))

  return { cumulative, bySymbol, byStrategy, dailyHeatmap }
}
