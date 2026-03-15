# Trading Journal — 美股日内交易复盘日志

面向美股日内交易者的**个人复盘日志管理系统**，完全本地运行，数据存储在本地 SQLite 数据库中，无需云端。

---

## 功能

- **每日三段式交易日志** — 盘前计划 → 盘中记录 → 盘后复盘
- **交易机会管理（TradeSetup）** — 支持已执行、错过、失效、取消状态流转
- **每周周报** — 本周盈亏统计、亮点/不足、核心教训、下周展望
- **日志批量查询** — 按状态、策略、错过原因、日期范围跨日搜索
- **策略思维导图** — 用 Mind Elixir 管理和维护交易策略体系
- **错过机会分析** — 统计错过原因分布与假设盈亏
- **执行纪律分析** — 入场/出场条件满足率统计
- **TradingView 截图管理** — 盘后批量上传并关联到具体 Setup 或执行记录

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) + TypeScript |
| 数据库 | SQLite，通过 Prisma ORM 操作 |
| UI | shadcn/ui + Tailwind CSS v4 |
| 富文本 | Tiptap |
| 图表 | Recharts |
| 思维导图 | mind-elixir |
| 包管理 | pnpm |

---

## 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装

```bash
# 克隆项目
git clone <repo-url>
cd trading_journal

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm db:push      # 同步 Schema 到数据库（Schema 变更后运行）
pnpm db:studio    # 打开 Prisma Studio 可视化查看数据库
pnpm lint         # 代码检查
```

---

## 项目结构

```
src/
├── app/
│   ├── journal/            # 日历视图 + 每日交易日页
│   ├── weekly/             # 每周周报列表 + 详情
│   ├── analytics/          # 统计分析页面
│   ├── strategies/         # 策略思维导图
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── setup/              # TradeSetup 相关组件
│   ├── journal/            # 日志查询组件
│   ├── weekly/             # 周报组件
│   └── analytics/          # 统计分析组件
├── lib/
│   ├── prisma.ts           # Prisma 单例
│   ├── pnl.ts              # 盈亏计算
│   └── utils.ts            # 通用工具
└── types/
    └── index.ts            # 全局 TypeScript 类型
prisma/
└── schema.prisma           # 数据库 Schema
```

---

## 数据存储说明

所有数据存储在本地：

- **结构化数据**：`prisma/db.sqlite`（日志、Setup、执行记录、周报等）
- **截图文件**：`public/uploads/YYYY/MM/DD/`

两者均已加入 `.gitignore`，不会上传到版本控制。

**建议定期备份**这两个位置，或将项目文件夹放入 OneDrive / iCloud 等同步目录。

---

## 核心数据模型

```
DailySession（交易日）
    └── TradeSetup（交易机会）← 核心实体
            ├── status: WATCHING / EXECUTED / MISSED / INVALIDATED / CANCELLED
            └── Execution（实际执行）← 可选，支持分批建仓
```

交易机会的入场/止损/目标以**定性条件描述为主**，精确价格为可选，符合日内交易条件驱动的实际工作流。
