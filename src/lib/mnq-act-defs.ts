// MNQ 四幕剧（常规趋势日 TREND_REGULAR）决策记录类型定义

// ─── Act 1: 方向确认（不交易）──────────────────────────────

export interface Act1State {
  preMarketBias: "BEARISH" | "BULLISH" | null
  openHighBroken: boolean | null
  directionConfirmed: "BEARISH" | "BULLISH" | null
  notes: string
}

// ─── Act 2: Early Entry — Open High 做空 ──────────────────

export interface Act2State {
  rejectionCandle: boolean | null
  entered: boolean | null
  pmlReached: boolean | null
  pmlOutcome: "BROKE" | "HELD" | null   // ⭐ 趋势/震荡分水岭
  switchedToRange: boolean
  notes: string
}

// ─── Act 3: DL 逆势反弹（可选，仅 PML 跌破后）──────────────

export interface Act3State {
  skipped: boolean
  dlFormedBelowPml: boolean | null
  dlPmlDistanceSufficient: boolean | null
  dlHeld: boolean | null
  entered: boolean | null
  reachedPmlTarget: boolean | null
  notes: string
}

// ─── Act 4: PML 回踩做空（核心交易）──────────────────────────

export interface Act4State {
  skipped: boolean
  pmlPullback: boolean | null
  rejectionSignal: boolean | null
  entered: boolean | null
  closedAbovePml: boolean | null
  pullbackVolumeExceedsBreakdown: boolean | null
  dwellTooLong: boolean | null
  notes: string
}

// ─── 汇总结构 ────────────────────────────────────────────

export interface TrendRegularActs {
  act1: Act1State
  act2: Act2State
  act3: Act3State
  act4: Act4State
}

// ─── 工厂 & 解析 ─────────────────────────────────────────

export function createEmptyTrendRegularActs(): TrendRegularActs {
  return {
    act1: {
      preMarketBias: null,
      openHighBroken: null,
      directionConfirmed: null,
      notes: "",
    },
    act2: {
      rejectionCandle: null,
      entered: null,
      pmlReached: null,
      pmlOutcome: null,
      switchedToRange: false,
      notes: "",
    },
    act3: {
      skipped: false,
      dlFormedBelowPml: null,
      dlPmlDistanceSufficient: null,
      dlHeld: null,
      entered: null,
      reachedPmlTarget: null,
      notes: "",
    },
    act4: {
      skipped: false,
      pmlPullback: null,
      rejectionSignal: null,
      entered: null,
      closedAbovePml: null,
      pullbackVolumeExceedsBreakdown: null,
      dwellTooLong: null,
      notes: "",
    },
  }
}

export function parseTrendRegularActs(json?: string | null): TrendRegularActs {
  if (!json) return createEmptyTrendRegularActs()
  try {
    const parsed = JSON.parse(json) as Partial<TrendRegularActs>
    const empty = createEmptyTrendRegularActs()
    return {
      act1: { ...empty.act1, ...parsed.act1 },
      act2: { ...empty.act2, ...parsed.act2 },
      act3: { ...empty.act3, ...parsed.act3 },
      act4: { ...empty.act4, ...parsed.act4 },
    }
  } catch {
    return createEmptyTrendRegularActs()
  }
}
