# Handoff: 交易系统月报（4周聚合视图）

## Overview

月报是 **4 个周报的聚合视图**，目的是让交易者在月末从更高层级回顾本月：
- 4 周累计盈亏与权益曲线
- 每周关键信息并列对比
- 跨周重复出现的教训与持续性问题
- 全月所有交易明细（按周分组）
- 月度最佳/最差交易
- 月度复盘

设计上**不是另起炉灶的独立报表**，而是直接消费 4 个周报（W14–W17）的数据并做聚合。

---

## About the Design Files

`月报 v2.html` 是用 HTML + React（CDN Babel 模式）编写的**高保真设计原型**，仅用于展示视觉和交互意图，**不是可以直接复制到生产环境的代码**。

开发任务是：在你们现有的技术栈中（React / Vue / Next.js 等）参照此原型重新实现该页面，使用项目已有的组件库、路由、状态管理和数据层。

---

## Fidelity

**高保真（High-Fidelity）**：颜色、字体、间距、交互均精确定义。开发者应尽量像素级还原。

---

## Page Sections (从上至下)

### 1. 顶部导航栏（Sticky Top Bar）
高度 52px，sticky + backdrop-filter blur(12px)。
- 左：`MONTHLY DIGEST` 标签 + 月份名 + 日期范围
- 右：累计盈亏指示灯 + 上下月切换按钮

### 2. Hero — 月度概览
- 左：`4 周累计净盈亏` 大字（48px DM Mono）+ 月度回报率
- 右：4 个统计数字（交易/胜率/盈利周/平均系统分）
- 下方：**月度权益曲线**（覆盖 4 周共 17 个数据点），用虚线分隔每周边界，曲线终点带光晕高亮

### 3. 本月四周（核心区）
4 张并列周卡（`grid-template-columns: repeat(4, 1fr)`），每张包含：
- 周编号 + 系统分徽章
- 周净盈亏（22px DM Mono）
- 日期范围
- 迷你权益走势 sparkline
- 3 项指标（交易/胜率/盈亏笔数）
- 市场环境堆叠条（趋势/震荡/区间）+ 数量
- 周总结一句话
- 亮点（绿↑）+ 不足（红↓）
- **核心教训**（accent 色背景）
- "查看完整周报 →" 入口（点击跳转到对应周报详情）

### 4. 跨周聚合区（双列）

**重复教训追踪**
- 每条教训标记出现的周编号（W14/W15...）
- 跨 ≥2 周的教训用红色左边框 + ⚠ 警示 + "已重复出现 N 次"

**持续性问题**
- 每个问题显示累计 R 损失 + 4 格小时间线，可视化哪几周受影响

### 5. 本月交易明细（新增模块）
- 顶部 6 项汇总条：累计 R / 胜负 / 平均盈利 / 平均亏损 / 盈亏比 / A级与D级数量
- 表格按周分组，每周用 accent 色行作分组头（周编号/日期/笔数/累计R/累计$）
- 列：编号、日期/时间、品种、方向、进入、出场、Setup、市场环境、R值、执行评分、备注
- 悬停高亮，>2R 交易 R 值数字带光晕

### 6. 本月之最
- 左右两张卡片：最佳交易 / 最差交易
- 每张大字号 R 值（28px，带光晕）+ 品种 + 方向 + 日期

### 7. 月度复盘
- 单段总结，基于上述 4 周观察提炼

### 8. Footer
- 月份名 · 月度汇总（聚合 W14–W17）+ 日期范围

---

## Data Schema

```typescript
interface MonthlyReport {
  monthLabel: string                    // 'April 2026'
  range: string                         // 'Mar 31 – Apr 24'
  weeks: WeeklyReportSummary[]          // 4 个周报摘要

  // 跨周聚合数据
  recurringLessons: RecurringLesson[]   // 跨周重复出现的教训
  persistentIssues: PersistentIssue[]   // 跨周持续性问题
  allTrades: TradeRecord[]              // 4 周全部交易（按周分组）
  monthInsight: string                  // 月度复盘

  // 衍生字段（前端计算或后端聚合）
  totalPnl: number
  totalTrades: number
  monthWinRate: number
  monthScore: number
  profitableWeeks: number
  monthEquity: number[]                 // 拼接 4 周权益序列（去重接缝）
}

interface WeeklyReportSummary {
  w: number                             // 周编号 14
  range: string                         // 'Mar 31 – Apr 03'
  pnl: number
  trades: number
  wins: number
  winRate: number
  score: number                         // 系统分 0-100
  summary: string
  highlight: string
  weakness: string
  lesson: string
  bestTrade: TradeMini | null
  worstTrade: TradeMini | null
  regimes: { TREND: number; CHOP: number; RANGE: number }
  equity: number[]                      // 该周每日权益
}

interface RecurringLesson {
  text: string
  occurredIn: number[]                  // 周编号数组 [15, 16]
  severity: 'high' | 'medium' | 'low'
}

interface PersistentIssue {
  issue: string
  weeksAffected: number[]
  totalLoss: number                     // 累计 R 值（负数）
}

interface TradeRecord {
  id: string                            // 'T01'
  w: number                             // 所属周
  date: string                          // '04/02'
  time: string                          // '09:42'
  inst: string                          // 'NQ' | 'ES'
  dir: 'Long' | 'Short'
  entry: number
  exit: number
  r: number                             // R 倍数
  setup: string                         // 'PDH突破回踩'
  score: 'A' | 'B' | 'C' | 'D'          // 执行评分
  regime: 'TREND' | 'CHOP' | 'RANGE'    // 进场时市场环境
  note: string
}
```

---

## Design Tokens

### 颜色
```
背景         oklch(0.10 0.015 240)   ~#0f1117
卡片         oklch(0.145 0.018 240)  ~#181d25
卡片深       oklch(0.175 0.02 240)   ~#1e2530
边框         oklch(0.22 0.022 240)   ~#282f3d
边框高亮     oklch(0.32 0.035 240)   ~#3a4458
琥珀强调     oklch(0.78 0.15 72)     ~#d4933a
绿色正向     oklch(0.72 0.18 145)    ~#34c26a
红色负向     oklch(0.65 0.18 15)     ~#e0543a
主文字       oklch(0.88 0.008 240)
中文字       oklch(0.62 0.012 240)
暗文字       oklch(0.42 0.015 240)
```

### 字体
- 中文 / 正文：`'Noto Sans SC', 'PingFang SC', sans-serif`
- 数字 / 代码：`'DM Mono', monospace`

### 字号
- Hero 大字：48px DM Mono，letter-spacing -0.03em
- 卡片标题数字：22–24px
- 表格数字：12–14px
- 段落正文：12.5–13.5px，行高 1.6–1.8
- 辅助标注：10–11px

### 间距 / 圆角
- 卡片内边距：20px 22px
- 卡片间距：16px（主网格）/ 12px（4周卡）
- 大卡片圆角 12px / 小元素 6–10px / 徽章 4–5px

---

## Interactions

| 元素 | 行为 |
|------|------|
| 周卡 | hover 边框变亮；点击 "查看完整周报 →" 跳转该周详情 |
| 重复教训 | 跨 ≥2 周自动高亮警示 |
| 持续性问题时间线 | hover 格子 tooltip 显示对应周 |
| 交易表行 | hover 背景变浅 |
| 上下月切换 | 加载相邻月份数据 |

---

## Implementation Notes

1. 月度权益曲线数据需要拼接 4 周的 `equity` 数组（每周首尾去重），每 4 个数据点画一条虚线分隔
2. **重复教训追踪是月报关键价值** — 后端需要做跨周教训文本匹配（可用 embedding 或人工标注），前端只做展示
3. **持续性问题** 的累计 R 损失需要从交易记录中按 issue tag 聚合
4. SVG 图表建议改用 `recharts` / `visx` 实现以便复用
5. oklch 颜色可在不支持的浏览器降级为对应 hex
6. 表格数据量大时考虑分组虚拟滚动

---

## Files

| 文件 | 说明 |
|------|------|
| `月报 v2.html` | **主设计原型**，完整实现所有视觉与交互 |
| `tweaks-panel.jsx` | 原型的 Tweaks 控件，**生产环境不需要** |
