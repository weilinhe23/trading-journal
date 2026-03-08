# Trading Journal — Codex 项目指南

## 项目概述

这是一个面向美股日内交易者的**个人复盘日志管理系统**，本地运行（localhost:3000），数据完全存储在本地，无需云端。

核心功能：
- 每日三段式交易日志（盘前计划 → 盘中记录 → 盘后复盘）
- 交易机会管理（含已执行和错过的机会）
- TradingView 截图管理（盘后统一上传）
- 统计分析（胜率、盈亏、错过机会成本）

---

## 技术栈

- **框架**：Next.js 14（App Router）+ TypeScript
- **数据库**：SQLite，通过 Prisma ORM 操作
- **UI**：shadcn/ui + Tailwind CSS
- **富文本**：Tiptap
- **图表**：Recharts
- **包管理**：pnpm

---

## 核心设计原则（开发时必须遵守）

### 1. 以「交易机会（TradeSetup）」为核心，而非以「交易」为核心

系统的核心实体是 TradeSetup，代表"一个交易想法从识别到结束"的完整生命周期。
Execution（实际成交）只是 TradeSetup 生命周期中的一个可选阶段。

```
DailySession（交易日）
    └── TradeSetup（交易机会）← 核心
            └── Execution（实际执行）← 可选，可以为零
```

"错过的交易"和"已执行的交易"都是 TradeSetup 的一等公民，通过 status 字段区分。

### 2. 定性描述优先，数字价格可选

用户的工作流是条件驱动的，不是价格驱动的。
例如：用户会说"回调至 VWAP 站稳后进入"，而不是"在 $487 买入"。

- 入场/止损/目标的定性描述字段（entryCondition, stopCondition, target1Condition）是盘前必填的核心
- 精确价格字段（entryPriceExact, stopPriceExact, target1PriceExact）全部是可选的，可以盘后补填
- 绝对不能在 UI 上把数字价格设为必填项

### 3. 截图盘后统一上传，不强制盘中操作

用户盘中需要保持专注，不应被截图上传打断。
- 系统支持盘中不上传截图
- 盘后提供批量拖拽上传区，一次性上传所有截图并分配到对应的 Setup 或 Execution
- 截图上传区设计在每日复盘页的盘后阶段

### 4. 执行纪律用布尔值衡量，不用价格偏差

由于计划本身是定性的，执行质量的度量方式是：
- entryConditionMet: Boolean — 入场时，计划条件是否真的满足了？
- exitConditionMet: Boolean — 出场是否符合原定条件？

不要用"计划价格 vs 实际价格"的数字差来衡量执行质量。

---

## 数据模型概览

完整 Schema 在 prisma/schema.prisma，以下是核心关系：

```
DailySession (每交易日)
  ├── newsEvents: NewsEvent[]      新闻催化剂
  ├── setups: TradeSetup[]         交易机会（核心）
  └── screenshots: Screenshot[]    日志级别截图（大盘图等）

TradeSetup (交易机会)
  ├── status: SetupStatus          WATCHING/EXECUTED/MISSED/INVALIDATED/CANCELLED
  ├── executions: Execution[]      实际执行（0到多个，支持分批建仓）
  └── screenshots: Screenshot[]    Setup 级别截图

Execution (实际成交)
  └── screenshots: Screenshot[]    执行级别截图（入场/出场确认图）
```

### SetupStatus 状态含义
- WATCHING：盘中持续观察，尚未有结果（默认状态）
- EXECUTED：已执行，关联至少一个 Execution
- MISSED：机会出现了但没有入场，需要填写 missedReason
- INVALIDATED：机会条件自动失效（如股价跳空导致 Setup 消失）
- CANCELLED：主动取消观察

---

## 页面结构

```
/                          首页 Dashboard（今日概览 + 近期盈亏曲线）
/journal                   日历视图（月/周，每日显示盈亏颜色）
/journal/[date]            每日交易日主页（三段式核心页面）
/analytics                 统计总览
/analytics/missed          错过机会分析
/analytics/execution       执行纪律分析
/analytics/strategies      策略效果分析
```

### 每日交易日页（/journal/[date]）的三段式结构

这是系统最重要的页面，分三个区域：

盘前区域：
- 今日催化剂新闻列表（NewsEvent）
- 大盘环境描述（富文本）
- 今日交易机会列表（TradeSetup Cards）
- 每个 Setup Card 显示：标的、方向、策略、入场/止损/目标描述

盘中区域：
- 同一组 Setup Cards，但增加操作按钮
- 可将 Setup 标记为：已执行 / 错过 / 失效 / 取消
- 标记"已执行"→ 弹出填写实际成交价格和数量的面板
- 标记"错过"→ 弹出选择错过原因的快捷面板（单选 + 可选文字补充）

盘后区域：
- 截图批量上传区（拖拽上传，支持多选）
- 截图分配面板（将截图关联到具体 Setup 或 Execution）
- 复盘总结富文本编辑器
- 今日教训、做对了什么
- 评分：遵守计划 / 情绪 / 专注度（1-5 星）

---

## API 路由规范

```
GET/POST        /api/sessions                          DailySession 列表/创建
GET/PUT         /api/sessions/[date]                   获取/更新某天（date 格式：YYYY-MM-DD）

GET/POST        /api/sessions/[date]/news              NewsEvent 列表/创建
DELETE          /api/sessions/[date]/news/[id]         删除新闻

GET/POST        /api/sessions/[date]/setups            TradeSetup 列表/创建
GET/PUT/DELETE  /api/sessions/[date]/setups/[id]       单个 Setup 操作
POST            /api/sessions/[date]/setups/[id]/execute   标记为已执行
POST            /api/sessions/[date]/setups/[id]/miss      标记为错过

POST            /api/executions                        创建执行记录（含盈亏计算）
PUT/DELETE      /api/executions/[id]                   更新/删除执行记录

POST            /api/screenshots                       上传截图（multipart/form-data）
PUT             /api/screenshots/[id]                  更新关联/标注信息
DELETE          /api/screenshots/[id]                  删除（同步删除物理文件）

GET             /api/analytics/summary                 总览统计
GET             /api/analytics/missed                  错过机会统计
GET             /api/analytics/execution-quality       执行纪律统计
GET             /api/analytics/strategies              策略效果统计
```

所有日期参数统一使用美东时间（ET），格式 YYYY-MM-DD。

---

## 代码规范

### 文件组织

```
src/
├── app/
│   ├── (pages)/               页面路由
│   └── api/                   API Routes
├── components/
│   ├── ui/                    shadcn/ui 基础组件（不要修改）
│   ├── journal/               日志相关组件
│   ├── setup/                 TradeSetup 相关组件
│   ├── screenshot/            截图上传和展示组件
│   └── analytics/             统计分析组件
├── lib/
│   ├── prisma.ts              Prisma 单例（全局复用）
│   ├── pnl.ts                 盈亏计算函数
│   ├── upload.ts              文件上传处理
│   └── utils.ts               通用工具函数
└── types/
    └── index.ts               全局 TypeScript 类型
```

### Prisma 单例（lib/prisma.ts）

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### 盈亏计算规则（lib/pnl.ts）

```typescript
export function calculatePnL(
  direction: "LONG" | "SHORT",
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  commission: number = 0
): number {
  const multiplier = direction === "LONG" ? 1 : -1
  const gross = (exitPrice - entryPrice) * quantity * multiplier
  return gross - commission
}
```

盈亏计算完成后写入 Execution.pnl 字段存储，不在前端实时计算。

### 截图存储路径规范

```
public/uploads/YYYY/MM/DD/[cuid].ext
```

API 返回的 filePath 是相对于 public 的路径，前端直接用 `<img src={filePath}>` 即可。

### 日期处理规范

- 所有日期存入数据库时统一用 DateTime，精确到天的日期用当天 00:00:00 UTC 存储
- 前端展示统一转换为美东时间（ET）
- API 的 [date] 参数格式固定为 YYYY-MM-DD

---

## 开发优先级（按顺序实现）

阶段 1 — 基础骨架
- Prisma 单例 + lib 工具函数
- DailySession 的 GET/PUT API
- /journal 日历页（展示有记录的日期，支持点击跳转）
- /journal/[date] 页面三段式框架（空壳，三个区域占位）

阶段 2 — 新闻催化剂
- NewsEvent CRUD API
- 盘前区域的新闻录入 UI（添加/删除）

阶段 3 — TradeSetup（最核心）
- TradeSetup CRUD API
- Setup Card 组件（展示定性入场/止损/目标描述）
- Setup 状态流转（WATCHING → EXECUTED/MISSED/INVALIDATED/CANCELLED）
- 错过原因快捷选择面板（预设分类 + 补充文字）

阶段 4 — Execution 执行记录
- Execution 创建 API（含盈亏自动计算）
- 执行纪律评估字段 UI（entryConditionMet / exitConditionMet）

阶段 5 — 截图系统
- 文件上传 API（multipart/form-data）
- 批量拖拽上传组件（react-dropzone）
- 截图分配面板（关联到 Setup/Execution/Session）

阶段 6 — 盘后复盘
- Tiptap 富文本编辑器集成
- 盘后总结/教训/评分 UI

阶段 7 — 统计分析
- 错过机会分析（missedReason 分布 + 假设盈亏汇总）
- 执行纪律分析（entryConditionMet 统计）
- 策略效果分析（各策略胜率/盈亏/遗漏率）
- 累计盈亏曲线（Recharts 折线图）

---

## 常用命令

```bash
pnpm dev          # 启动开发服务器（localhost:3000）
pnpm db:push      # 同步 Schema 到数据库（Schema 变更后运行）
pnpm db:studio    # 打开 Prisma Studio 可视化查看数据库
pnpm build        # 构建生产版本
pnpm lint         # 代码检查
```

---

## 重要注意事项

1. 不要安装不必要的依赖，能用 shadcn/ui 解决的 UI 需求不要另装组件库
2. 截图文件删除时必须同步删除 public/uploads 下的物理文件，不能只删数据库记录
3. 所有盈亏统计计算在后端 API 完成，不在前端 useState 里做聚合计算
4. Setup 的 status 原则上单向流转，如需修改通过 PUT 接口直接更新字段
5. 富文本字段存储为 HTML 字符串，Tiptap 输出 HTML 直接存库，展示时用 dangerouslySetInnerHTML（内容来自用户本人，无 XSS 风险）
6. 每次修改 prisma/schema.prisma 后必须运行 pnpm db:push 才能生效
