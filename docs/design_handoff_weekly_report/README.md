# Handoff: 交易系统周报页面

## Overview

这是一个为交易系统设计的**周报视图**，帮助交易者在每周结束后系统性地回顾执行表现、分析得失、提炼经验、制定下周计划。

核心设计理念：**周报是一面镜子**，让交易者量化地看清自己与"理想系统执行"之间的差距。

---

## About the Design Files

`周报 v2.html` 是用 HTML + React（CDN Babel 模式）编写的**高保真设计原型**，仅用于展示视觉和交互意图，**不是可以直接复制到生产环境的代码**。

开发任务是：**在你们现有的技术栈（React / Vue / Next.js 等）中，参照此原型重新实现该页面**，使用项目已有的组件库、路由、状态管理和数据层。

---

## Fidelity

**高保真（High-Fidelity）**：颜色、字体、间距、交互均已精确定义，开发者应尽量像素级还原。

---

## Screens / Views

### 1. 周报主页面（单页滚动布局）

最大宽度 `1100px`，水平居中，左右内边距 `32px`，底部内边距 `80px`。

---

#### 1.1 顶部导航栏（Sticky Top Bar）

- **高度**：52px，`position: sticky; top: 0; z-index: 10`
- **背景**：`oklch(0.10 0.015 240 / 0.9)` + `backdrop-filter: blur(12px)`
- **下边框**：`1px solid oklch(0.22 0.022 240)`
- 左侧：`WEEKLY REPORT` 标签（等宽字体，11px，琥珀色，字间距 0.1em）+ 分隔线 + 年份/周数/日期范围
- 右侧：盈亏数字（带绿色光点指示） + 上下周切换按钮（28×28px，圆角 6px）

---

#### 1.2 英雄区（Hero Row）

**双列网格** `grid-template-columns: 1fr 260px`，间距 16px。

**左列：权益曲线卡片**
- 卡片：`background: oklch(0.145 0.018 240)`，`border: 1px solid oklch(0.22 0.022 240)`，`border-radius: 12px`，`padding: 20px 22px`
- 卡片内顶部：左侧显示本周总盈亏（32px DM Mono 字体，绿/红色），右侧显示总R值和最大回撤
- **SVG 权益曲线**：平滑贝塞尔曲线，带渐变填充区域，每个数据点显示圆点，底部有X轴日期标签，左侧有Y轴价格刻度（网格虚线）
  - 曲线颜色：琥珀 `oklch(0.78 0.15 72)` 或绿色 `oklch(0.72 0.18 145)`
  - 渐变：曲线色 18% 透明度 → 0%
  - 高度：140px

**右列：5个关键指标小卡片**（纵向堆叠，flex: 1 each）
- 执行次数 / 胜率 / 盈利笔数 / 错过机会 / 系统评分
- 每张：`padding: 12px 16px`，圆角 10px，左侧文字标签 + 右侧等宽数字
- 正面值用绿色，负面/警示用红色，中性用默认文字色

---

#### 1.3 每日卡片条（Day Strip）

5张横向排列的等宽卡片（`flex: 1`），间距 10px。

每张卡片内容：
- 顶行：星期缩写（`MON`/`TUE` 等，DM Mono 11px）+ 市场环境标签（右对齐）
- 中间：当日盈亏（22px DM Mono，正绿/负红/零横杠）
- 底部：当日简短备注（11px，暗色）+ 交易笔数

**市场环境标签样式**：
| 类型 | 背景 | 文字颜色 |
|------|------|----------|
| 趋势日 TREND | `oklch(0.72 0.18 145 / 12%)` | `oklch(0.72 0.18 145)` |
| 震荡日 CHOP  | `oklch(0.65 0.18 15 / 12%)`  | `oklch(0.65 0.18 15)` |
| 区间日 RANGE | `oklch(0.72 0.14 72 / 12%)`  | `oklch(0.78 0.15 72)` |

---

#### 1.4 逐笔交易记录表

标准 HTML table，列定义：

| 列名 | 内容 | 样式 |
|------|------|------|
| 编号 | T01, T02… | DM Mono，暗色 |
| 时间 | MON 09:45 | DM Mono |
| 品种 | NQ / ES | 粗体 |
| 方向 | ↑ 做多 / ↓ 做空 | 绿/红色 |
| 进入 | 价格 | DM Mono |
| 出场 | 价格 | DM Mono |
| 盈亏 | +2.3R / -0.7R | 大字（15px），正绿负红，>1.5R 发光效果 |
| 执行 | A/B/C/D 徽章 | 小方块，对应颜色 |
| 备注 | 可选显示 | 11.5px，暗色 |

执行评分色：A=绿，B=绿偏暗，C=琥珀，D=红

行 hover：背景变浅 `oklch(0.175 0.02 240)`

**错过机会**用虚线分隔，列：时间 / 品种 / 方向 / 预计R值 / 原因

---

#### 1.5 系统遵守度 + 亮点/不足（双列）

**左：系统遵守度卡片**
- 顶部居中圆环图（96px）：SVG circle，stroke-dasharray 动画（页面加载后 0.8s 动画）
  - 背景圆：`stroke: oklch(0.22 0.022 240)`，`stroke-width: 8`
  - 前景弧：accent 色，`stroke-linecap: round`
  - 圆心文字：总分数字（22px）+ /100（9px）
- 5个维度横向评分条（label 宽72px，右对齐）：
  - 轨道：`oklch(0.22 0.022 240)`，高6px，圆角3px
  - 填充：>80分绿色，60-80琥珀，<60红色，带 box-shadow glow
  - 宽度动画：200ms 延迟后用 `cubic-bezier(0.2,1,0.3,1)` 展开

**右：亮点卡片 + 不足卡片**（纵向各占一半）
- 亮点：每条前缀 `↑`（绿色），不足：`↓`（红色）
- 字号 12.5px，行高 1.6

---

#### 1.6 核心经验教训（2列网格）

`grid-template-columns: 1fr 1fr`，间距12px。

每条：
- 左侧序号徽章（24×24px，圆角6px，accent色背景18%透明，accent色文字）
- 右侧：标题（13px，500weight）+ 正文（12px，暗色，行高1.7）

---

#### 1.7 下周计划（3列网格）

`grid-template-columns: 1fr 1fr 1fr`，间距16px。

三列：宏观关注 / 重点练习 / 特别注意

每列：小图标 + 标题 + 列表项（`—` 前缀，DM Mono，暗色）

---

## Design Tokens

### 颜色

```
背景色       oklch(0.10 0.015 240)       ~#0f1117
卡片背景     oklch(0.145 0.018 240)      ~#181d25
卡片背景深   oklch(0.175 0.02 240)       ~#1e2530
边框         oklch(0.22 0.022 240)       ~#282f3d
边框高亮     oklch(0.32 0.035 240)       ~#3a4458
主文字       oklch(0.88 0.008 240)       ~#d8dce6
中文字       oklch(0.62 0.012 240)       ~#8a919e
暗文字       oklch(0.42 0.015 240)       ~#555d6a
琥珀强调     oklch(0.78 0.15 72)         ~#d4933a
绿色正向     oklch(0.72 0.18 145)        ~#34c26a
红色负向     oklch(0.65 0.18 15)         ~#e0543a
```

### 字体

```
衬线/正文：   'Noto Sans SC', 'PingFang SC', sans-serif
数字/代码：   'DM Mono', monospace
```

### 字号

```
顶部导航标签   11px，字间距 0.1em
盈亏大字       32px，DM Mono，letter-spacing -0.03em
段落正文       12.5–13.5px，行高 1.6–1.8
表格数字       12–15px，DM Mono
辅助标注       10–11px
```

### 间距

```
卡片内边距      20px 22px
卡片间距        16px（主网格）/ 10px（day strip）/ 12px（lessons）
section 间距    16px（marginBottom）
section 标题    marginBottom 14px
```

### 圆角

```
大卡片    12px
小卡片    10px
徽章      5–6px
按钮      6px
评分条    3px
```

---

## Interactions & Behavior

| 元素 | 交互 | 变化 |
|------|------|------|
| 导航切换按钮 | hover | 边框变亮，文字变亮 |
| 统计小卡片 | hover | 边框颜色加深 |
| 每日卡片 | hover | 边框颜色加深 |
| 交易行 | hover | 背景变浅 |
| 经验教训卡 | hover | 背景+边框变亮 |
| 评分条 | 页面载入 | 200ms延迟后从0宽展开，0.8s ease |
| 圆环图 | 页面载入 | stroke-dasharray 从0动画至目标值 |

---

## State Management

需要的数据结构（可对接后端接口）：

```typescript
interface WeeklyReport {
  week: number
  year: number
  dateRange: string
  accountBase: number
  equityHistory: number[]           // 每个数据点的账户净值

  days: DayRecord[]
  trades: TradeRecord[]
  missedOpportunities: MissedTrade[]

  systemScore: {
    total: number                   // 0-100
    dimensions: { label: string; score: number }[]
  }

  summary: string
  highlights: string[]
  weaknesses: string[]
  lessons: { title: string; body: string }[]

  nextWeekPlan: {
    macro: string[]
    practice: string[]
    watch: string[]
  }
}

interface DayRecord {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'
  date: string                      // '04/20'
  regime: 'TREND' | 'CHOP' | 'RANGE'
  pnl: number
  trades: number
  note: string
}

interface TradeRecord {
  id: string                        // 'T01'
  day: string
  time: string                      // 'HH:MM'
  instrument: string                // 'NQ' | 'ES'
  direction: 'Long' | 'Short'
  entryPrice: number
  exitPrice: number
  positionSize: number
  rMultiple: number                 // 正数=盈，负数=亏
  executionScore: 'A' | 'B' | 'C' | 'D'
  setup: string
  note: string
}

interface MissedTrade {
  day: string
  time: string
  instrument: string
  direction: 'Long' | 'Short'
  reason: string
  estimatedR: number
}
```

---

## Files

| 文件 | 说明 |
|------|------|
| `周报 v2.html` | **主设计原型**，完整实现了所有视觉和交互，是实现的主要参考 |
| `周报.html` | 早期版本，较简单，仅供对比参考 |
| `tweaks-panel.jsx` | 原型内部使用的 Tweaks 控件，**生产实现中不需要** |

---

## Implementation Notes

1. **SVG 权益曲线**建议用 `recharts` 或 `visx` 实现，曲线类型选 `monotone`，加渐变 fill
2. **圆环评分**可用 SVG circle + stroke-dasharray，或 `react-circular-progressbar`
3. **DM Mono 字体**从 Google Fonts 引入，或用系统等宽字体 fallback
4. **oklch 颜色**现代浏览器均支持；如需兼容旧版，转换为对应 hex 值（见 Design Tokens 表）
5. **交易表格**如数据量大，考虑虚拟滚动
6. **Sticky header** 注意与页面其余 `position: sticky` 元素的 z-index 层级管理
