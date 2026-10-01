export const TRADING_GROWTH_STEPS = [
  ...[4, 8, 16, 32].map((quantity) => ({
    symbol: "QQQ" as const,
    quantity,
    label: `${quantity} 股 QQQ`,
  })),
  ...Array.from({ length: 9 }, (_, index) => ({
    symbol: "MNQ" as const,
    quantity: index + 1,
    label: `${index + 1} 手 MNQ`,
  })),
  ...Array.from({ length: 10 }, (_, index) => ({
    symbol: "NQ" as const,
    quantity: index + 1,
    label: `${index + 1} 手 NQ`,
  })),
];

export interface TradingGrowthProgress {
  completedCount: number;
  revision: number;
  startedDate: string;
  currentStartedDate: string | null;
  currentDayCount: number | null;
  completions: Array<{
    stepIndex: number;
    completedAt: string;
    completedDate: string;
  }>;
}

export type TradingGrowthAction = "complete" | "undo";
