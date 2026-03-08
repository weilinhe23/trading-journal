/**
 * 计算单笔执行的盈亏
 * @param direction - LONG 做多 / SHORT 做空
 * @param entryPrice - 实际入场价
 * @param exitPrice - 实际出场价
 * @param quantity - 股数
 * @param commission - 手续费（默认 0）
 * @returns 净盈亏（已扣除手续费）
 */
export function calculatePnL(
  direction: "LONG" | "SHORT",
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  commission = 0,
): number {
  const multiplier = direction === "LONG" ? 1 : -1
  const gross = (exitPrice - entryPrice) * quantity * multiplier
  return gross - commission
}

/**
 * 格式化盈亏金额显示
 * @param pnl - 盈亏金额
 * @returns 带颜色信息的字符串，如 "+$123.45" 或 "-$45.00"
 */
export function formatPnL(pnl: number): string {
  const sign = pnl >= 0 ? "+" : ""
  return `${sign}$${pnl.toFixed(2)}`
}

/**
 * 判断盈亏正负
 */
export function isProfitable(pnl: number): boolean {
  return pnl > 0
}
