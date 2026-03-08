# 工作流分析与架构重构方案

## 一、你的工作流诊断

让我先把你描述的工作流拆解成精确的信息流：

```
盘前
 └─ 选标的
 └─ 记录催化剂新闻（是否有重大消息支持）
 └─ 选定今日策略
 └─ 记录进入机会（entry criteria）
 └─ 记录退出机会（exit criteria：目标价 + 止损）

盘中
 └─ 执行 → 记录实际成交
 └─ 错过 → 记录为什么没进

盘后
 └─ 复盘总结（执行情况 + 策略有效性）
```

**核心发现：你的系统里实际上有两类"交易"，而不是一类：**

| 类型 | 原方案处理方式 | 问题 |
|------|--------------|------|
| 已执行的交易 | 作为核心实体 ✅ | 没问题 |
| **错过的交易机会** | 完全缺失 ❌ | 这是你工作流的关键组成部分 |

更深的问题：原方案的逻辑是"**先有交易，再有日志**"，而你的实际逻辑是"**先有机会，再决定是否交易**"。这是一个根本性的视角差异。

---

## 二、核心概念重构：引入「交易机会」实体

### 原方案的实体关系
```
DailyJournal (日志) ←→ Trade (交易)
                              ↓
                         Screenshot (截图)
```

### 重构后的实体关系
```
DailySession（交易日）
    │
    ├── NewsEvent（今日催化剂新闻）
    │       └── 可关联到具体标的或全市场
    │
    ├── TradeSetup（交易机会）← 新核心实体
    │       ├── 策略类型
    │       ├── 计划入场条件
    │       ├── 计划目标价 / 止损
    │       ├── 关联新闻催化剂
    │       ├── Status: WATCHING / EXECUTED / MISSED / CANCELLED
    │       ├── 错过原因（如果 MISSED）
    │       ├── Screenshot（盘前机会图）
    │       │
    │       └── Execution（实际执行）← 原来的 Trade
    │               ├── 实际成交价 / 数量 / 时间
    │               ├── 执行质量评分（与计划的偏差）
    │               └── Screenshot（入场/出场确认图）
    │
    └── PostReview（盘后复盘）
            ├── 富文本总结
            └── Screenshot（大盘图、复盘标注图）
```

**关键变化：`TradeSetup` 成为新的核心实体。** 它代表"一个交易想法从发现到结束"的完整生命周期，而 `Execution` 只是 Setup 生命周期中的一个可选阶段。

---

## 三、新数据模型设计

### 3.1 DailySession（交易日）

```prisma
model DailySession {
  date              DateTime  @unique  // 美东时间日期，主键意义
  
  // 盘前部分
  marketContext     String?   // 大盘环境（富文本）：指数走势、VIX、宏观背景
  preMarketPlan     String?   // 今日整体计划（富文本）
  selectedStrategy  String[]  // 今日主打策略，如 ["VWAP Bounce", "ORB"]
  
  // 关联数据
  newsEvents        NewsEvent[]
  setups            TradeSetup[]
  
  // 盘后部分
  postReview        String?   // 复盘总结（富文本）
  lessonsLearned    String?   // 今日教训
  whatWentWell      String?   // 做对了什么（正向强化）
  
  // 评分
  planFollowed      Int?      // 是否遵守计划 1-5
  emotionRating     Int?      // 情绪评分 1-5
  focusRating       Int?      // 专注度 1-5
  
  screenshots       Screenshot[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### 3.2 NewsEvent（新闻催化剂）

```prisma
model NewsEvent {
  id            String    @id @default(cuid())
  sessionDate   DateTime
  session       DailySession @relation(...)
  
  symbol        String?   // null = 全市场事件（如 FOMC）
  headline      String    // 新闻标题
  source        String?   // 来源：Bloomberg, Reuters, 公司公告
  eventType     NewsType  // EARNINGS | FED | MACRO | SECTOR | COMPANY
  impact        Impact    // BULLISH | BEARISH | NEUTRAL | UNCERTAIN
  notes         String?   // 你对这条新闻的判断
  
  setups        TradeSetup[] // 哪些机会是因为这条新闻
  createdAt     DateTime  @default(now())
}

enum NewsType {
  EARNINGS        // 财报
  FED             // 美联储
  MACRO           // 宏观数据（CPI, NFP等）
  SECTOR          // 行业新闻
  COMPANY         // 公司公告
  TECHNICAL       // 纯技术面机会（无新闻）
}

enum Impact {
  BULLISH
  BEARISH
  NEUTRAL
  UNCERTAIN
}
```

### 3.3 TradeSetup（交易机会）— 核心实体

**设计原则：定性描述是主干，定量价格是可选补充。**
盘前你只需要写清楚"在哪个位置、满足什么条件进入/退出"，数字价格在盘后复盘时填写即可，系统不做强制要求。

```prisma
model TradeSetup {
  id              String    @id @default(cuid())
  sessionDate     DateTime
  session         DailySession @relation(...)
  
  // 标的信息
  symbol          String
  direction       Direction   // LONG | SHORT
  
  // 策略与逻辑
  strategy        String      // "VWAP Bounce" / "ORB" / "News Catalyst" 等
  setupLogic      String?     // 为什么选这个机会（富文本）
  newsEvents      NewsEvent[] // 支撑这个机会的新闻催化剂

  // ── 入场计划 ──────────────────────────────────────────
  // 定性描述（盘前必填核心，描述触发条件和价格区域）
  // 示例："回调至 VWAP 站稳，且成交量萎缩后放量反弹"
  //       "突破前高 $182 后回踩不破，形成平台"
  entryCondition  String?     // 入场触发条件（定性，盘前填）
  entryPriceNote  String?     // 价格区域备注，如 "VWAP 附近 $185-186"（定性）
  
  // 定量（可选，盘后补填或有明确价位时填写）
  entryPriceExact Float?      // 精确入场价（可留空）

  // ── 止损计划 ──────────────────────────────────────────
  // 示例："跌破 VWAP 且收盘一分钟 K 线止损"
  //       "低于前低 $181.50 止损"
  stopCondition   String?     // 止损条件（定性，盘前填）
  stopPriceNote   String?     // 止损价格区域，如 "前低下方约 $181"
  stopPriceExact  Float?      // 精确止损价（可留空）

  // ── 目标计划 ──────────────────────────────────────────
  // 示例："第一目标前高 $190，第二目标日内高点区域"
  //       "1:2 盈亏比保本后移止损"
  target1Condition  String?   // 第一目标（定性）
  target1PriceNote  String?   // 第一目标价格区域
  target1PriceExact Float?    // 精确第一目标价（可留空）
  target2Condition  String?   // 第二目标（定性，可选）
  target2PriceExact Float?    // 精确第二目标价（可留空）

  // ── 盈亏比 ──────────────────────────────────────────
  // 当三个精确价格都填写后可自动计算，否则手动估填
  plannedRiskReward Float?    // 计划盈亏比（R值）
  plannedSize       Int?      // 计划股数（可选）
  
  // 机会状态（关键字段）
  status          SetupStatus
  
  // 错过交易的专属字段
  missedReason    MissedReason?
  missedNotes     String?       // 详细说明为什么错过
  missedHypoPnL   Float?        // 假设按计划执行的假设盈亏（事后计算）
  
  // 实际执行（0个=完全错过，1个=普通执行，多个=分批建仓/加仓）
  executions      Execution[]
  
  // 截图（盘中截图保存本地，盘后统一上传，见截图设计章节）
  screenshots     Screenshot[]
  
  // 复盘评分
  setupGrade      Grade?      // 这个机会本身的质量评分
  setupNotes      String?     // 对这个机会的复盘分析
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum SetupStatus {
  WATCHING    // 盘中持续观察，尚未有结果
  EXECUTED    // 已执行
  MISSED      // 错过（机会来了，没进）
  INVALIDATED // 机会自动失效（如跳空高开导致机会消失）
  CANCELLED   // 主动取消（因为更好的机会或风险管理）
}

enum MissedReason {
  HESITATION          // 犹豫，不确定，没敢按
  NO_CLEAR_SIGNAL     // 等待的信号没出现
  DISTRACTED          // 走神/错过时间窗口
  ALREADY_IN_TRADE    // 当时已有其他持仓，资金/精力不够
  RISK_LIMIT_HIT      // 当日亏损已到上限，不再交易
  SPREAD_TOO_WIDE     // 价差不合适
  NEWS_RISK           // 有未知新闻风险，主动放弃
  CHANGED_ANALYSIS    // 重新分析后觉得机会不够好
  FEAR_OF_LOSS        // 对近期亏损的恐惧影响判断
  OTHER
}
```

### 3.4 Execution（实际执行记录）

```prisma
model Execution {
  id              String    @id @default(cuid())
  setup           TradeSetup @relation(...)
  setupId         String
  
  // 实际成交数据
  entryPrice      Float
  exitPrice       Float?
  quantity        Int
  entryTime       DateTime
  exitTime        DateTime?
  commission      Float     @default(0)
  pnl             Float?    // 自动计算
  
  // 执行质量评估
  // 核心问题一：入场时，计划的定性条件是否真的满足了？
  entryConditionMet   Boolean?  // 入场时条件是否已满足（true=按计划/false=冲动入场）
  entryConditionNotes String?   // 说明，如"VWAP还没站稳就进了，追了0.30"
  
  // 核心问题二：出场时，是按计划条件出的还是情绪出的？
  exitConditionMet    Boolean?  // 出场是否符合原定条件
  exitConditionNotes  String?   // 说明，如"在目标1提前跑了，没等目标2"
  
  executionGrade  Grade?    // 执行质量评分（区别于机会质量评分）
  executionNotes  String?   // 综合执行备注
  
  // 截图在此处挂钩（盘后统一上传，见截图设计章节）
  screenshots     Screenshot[]
  createdAt       DateTime  @default(now())
}
```

```

### 3.6 截图的延迟上传设计

**核心原则：盘中只截图，盘后再上传，系统不施加盘中压力。**

```
盘中工作流：
  截图 → 保存到本地固定文件夹（如桌面/trading-screenshots/）
         命名规范：NVDA_entry_0932.png  （可选，不强制）
  
盘后工作流：
  打开系统 → 进入今日复盘页 → 截图上传区
  → 把本地文件夹里所有截图一次性拖入上传区
  → 系统展示缩略图列表，逐一指定关联到哪个 Setup 或哪个 Execution
  → 可选填写 caption + 时间框架标注
```

**Screenshot 模型补充字段：**

```prisma
model Screenshot {
  id            String    @id @default(cuid())
  filename      String
  filePath      String
  fileSize      Int
  mimeType      String
  
  // 截图语义标注
  caption       String?   // 图表说明，如 "入场前 5min 图"
  timeframe     String?   // 时间框架：1min / 5min / 15min / 1H / Daily
  chartType     ChartTag? // 截图用途标签
  
  // 关联（可关联到 Setup 或具体某次 Execution，二选一或都不选）
  setup         TradeSetup?  @relation(...)
  setupId       String?
  execution     Execution?   @relation(...)
  executionId   String?
  session       DailySession? @relation(...)  // 关联到日志（大盘图等）
  sessionId     String?
  
  // 截图时间（从文件名或手动填写推断，非强制）
  takenAt       DateTime?
  createdAt     DateTime  @default(now())
}

enum ChartTag {
  PRE_MARKET_PLAN   // 盘前计划图
  ENTRY_SIGNAL      // 入场信号图
  EXIT_SIGNAL       // 出场信号图
  MISSED_SIGNAL     // 错过时的信号图
  POST_REVIEW       // 复盘标注图
  MARKET_OVERVIEW   // 大盘/指数图
}
```

**UI 设计：批量上传 + 快速分配面板**

```
盘后截图上传区
┌──────────────────────────────────────────────────────┐
│  拖拽截图到此处，或点击选择文件（支持多选）            │
│                                                       │
│  待分配截图（8张）                                    │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│  │ NVDA  │ │ NVDA  │ │ TSLA  │ │ SPY   │  ...        │
│  │盘前图 │ │入场图 │ │机会图 │ │大盘图 │             │
│  │ 分配▼ │ │ 分配▼ │ │ 分配▼ │ │ 分配▼ │            │
│  └───────┘ └───────┘ └───────┘ └───────┘            │
│                                                       │
│  [全部分配完成 → 保存]                                │
└──────────────────────────────────────────────────────┘
```

"分配"下拉菜单展示今日所有 Setup 和 Execution 供选择，点一下即完成关联。

---

## 四、工作流驱动的 UI 重设计

### 4.1 核心页面：每日交易日（`/journal/2024-01-15`）

这是系统的主战场，按时间轴分三个阶段：

```
┌──────────────────────────────────────────────────────┐
│  📅 2024-01-15  周一                                  │
│  [盘前] → [盘中] → [盘后]  三段式导航                 │
└──────────────────────────────────────────────────────┘

━━━ 盘前阶段 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【今日催化剂新闻】
+ 添加新闻
  ■ [公司] NVDA  强劲数据中心收入预期  📈 看多
  ■ [宏观] CPI 数据 10:00 AM 公布      ⚠️ 不确定

【今日市场环境】
  SPY 在关键支撑上方，整体偏强...（富文本）

【今日交易机会】（Setup Cards）
+ 添加机会
  ┌─────────────────────────────────────────────────┐
  │  NVDA  📈 LONG  |  策略：VWAP Bounce             │
  │  催化剂：数据中心预期 ↑                           │
  │                                                   │
  │  入场条件：回调至 VWAP 站稳，成交量萎缩后放量     │ ← 定性，必填
  │  价格区域：VWAP 附近 $485-487                     │ ← 定性，可选
  │  止损条件：跌破 VWAP 且一分钟 K 线收盘破位        │ ← 定性，可选
  │  目标一：前高 $495 附近                           │ ← 定性，可选
  │  目标二：$500 整数关口                            │ ← 定性，可选
  │                                                   │
  │  [截图待上传 - 盘后统一处理]                      │ ← 不强制盘前上传
  │                                      [状态: 等待观察]│
  └─────────────────────────────────────────────────┘

━━━ 盘中阶段 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────┐
  │  NVDA  📈 LONG  VWAP Bounce              ✅ 已执行│
  │  ─────────────────────────────────────────────  │
  │  计划条件：回调至 VWAP 站稳后进入                │
  │  实际执行：$488.20 / 09:34 / 300股               │
  │  条件满足：✅ 是（VWAP 已站稳才进）              │ ← 关键评估字段
  │  出场：$496.80 / 10:12  盈亏：+$2,580            │
  │  出场条件：✅ 按计划在目标一附近减仓              │
  │  [截图待上传 - 盘后统一处理]                      │
  └─────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────┐
  │  TSLA  📉 SHORT  ORB Breakdown           ❌ 错过 │
  │  ─────────────────────────────────────────────  │
  │  错过原因：犹豫 - 当时在看NVDA没注意到          │
  │  假设盈亏：如果按计划执行 ≈ +$1,200             │
  │  [截图待上传 - 盘后统一处理]                      │
  └─────────────────────────────────────────────────┘

━━━ 盘后复盘 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【截图统一上传区】（盘后新增区域）
  拖拽今日所有截图到这里，然后快速分配到各 Setup
  [8张截图待分配]  → 点击分配

今日总结（富文本）...
今日教训...
遵守计划：⭐⭐⭐⭐☆  情绪：⭐⭐⭐⭐⭐
```

### 4.2 关键交互设计

**Setup 状态流转**：
```
[+ 添加机会]（盘前，填写计划参数）
       ↓
  WATCHING（默认状态）
       ↓
  ┌──────────────────────────────┐
  │  ✅ 已执行   → 填写成交细节    │
  │  ❌ 错过     → 选择错过原因    │
  │  ⚠️ 机会失效 → 简要说明       │
  │  🚫 主动取消 → 说明取消原因   │
  └──────────────────────────────┘
```

**错过交易的记录流程**（这是你工作流的特色，要做得好）：

1. 点击机会卡片上的 "❌ 标记为错过"
2. 弹出快速面板：选择错过原因（单选，预设分类）+ 补充文字
3. 可选填写"假设盈亏"（方便事后统计遗憾成本）
4. 系统在盘后统计时同时展示「实际盈亏」和「机会盈亏」的差值

---

## 五、最有价值的新分析维度

引入 TradeSetup 后，你可以做原来做不了的分析：

### 5.1 机会转化率分析
```
本月共识别 68 个交易机会
  ├── 执行：32个（47%）
  ├── 错过：28个（41%）
  └── 失效/取消：8个（12%）

错过原因分布：
  犹豫不决        12次（43%）← 你最大的问题
  走神/错过时机    8次（29%）
  已有其他持仓     5次（18%）
  主动放弃（质量不够）3次（11%）
```

### 5.2 遗憾成本追踪（Missed P&L）
```
本月错过交易的假设总盈利：+$8,400
本月实际交易盈利：        +$5,200
───────────────────────────────
效率比：62%（实际/潜在）

其中：因"犹豫"错过的假设盈利：+$5,600
→ 解决犹豫问题是提升 P&L 最大的单一因素
```

### 5.3 计划执行质量分析

定性条件驱动的执行质量，比单纯的价格偏差更能反映真实问题：

```
入场纪律性分析（共 32 笔执行）：
  条件满足后入场（按纪律）：23笔（72%）  平均盈亏 +$420
  条件未满足冲动入场：        9笔（28%）  平均盈亏 +$85
  → 冲动入场盈亏比差距：5倍

出场纪律性分析：
  按计划条件出场：20笔（62%）  实际利润达成率 94%
  提前/延迟出场： 12笔（38%）  实际利润达成率 61%
  → 最常见的出场偏差：目标一到了就全跑，没等目标二（8次）

纪律执行热力图（按星期几）：
  周一 ████████ 85%
  周二 ██████   65%  ← 周二执行纪律最差，值得关注
  周三 ███████  74%
  周四 ████████ 82%
  周五 █████    58%  ← 周五情绪问题
```

### 5.4 策略有效性分析
```
策略          识别  执行  胜率   平均盈亏   遗漏率
VWAP Bounce    24   15   73%    +$380      37%
ORB            18    8   50%    +$220      56% ← 你经常错过
News Catalyst  12   7    71%    +$510      42%
```

---

## 六、调整后的目录结构变化

```
src/app/
├── journal/                    
│   ├── page.tsx                # 日历视图（月/周切换）
│   └── [date]/
│       ├── page.tsx            # 每日复盘主页（三段式）
│       ├── pre-market/         # 盘前计划子页（可选独立）
│       └── post-review/        # 盘后复盘子页
├── analytics/
│   ├── page.tsx                # 总览 Dashboard
│   ├── missed/page.tsx         # 🆕 错过机会分析
│   ├── execution/page.tsx      # 🆕 执行质量分析
│   └── strategies/page.tsx     # 策略效果分析
└── api/
    ├── sessions/               # DailySession CRUD
    ├── news/                   # NewsEvent CRUD  🆕
    ├── setups/                 # TradeSetup CRUD 🆕（核心）
    │   └── [id]/
    │       ├── execute/        # 标记为已执行
    │       └── miss/           # 标记为错过
    ├── executions/             # Execution CRUD
    ├── screenshots/            # 截图上传
    └── analytics/
        ├── missed/             # 🆕 错过交易统计
        └── execution-quality/  # 🆕 执行质量统计
```

---

## 七、Claude Code 新的开发优先级

```
第1步：基础骨架
  DailySession + 三段式日志页面框架 + 数据库Schema

第2步：新闻催化剂模块
  NewsEvent CRUD + 与标的关联

第3步：TradeSetup 核心（最重要）
  Setup 创建 + 状态流转 + 错过原因记录 + 截图关联

第4步：Execution 执行记录
  成交细节 + 盈亏计算 + 执行偏差记录

第5步：日历复盘视图
  月历展示每日盈亏颜色 + 点击进入每日页面

第6步：错过交易分析（你最独特的功能）
  错过原因统计 + 假设盈亏计算 + 可视化

第7步：整体统计仪表板
  胜率/盈亏/策略效果 + 执行质量分析
```

---

## 八、关键设计哲学转变

| 维度 | 原方案 | 重构方案 |
|------|--------|---------|
| 核心实体 | Trade（交易） | TradeSetup（机会） |
| 记录起点 | 交易发生后录入 | 盘前计划时即创建 |
| 对"没做"的态度 | 忽略 | 一等公民，独立记录 |
| 分析视角 | 已执行的历史 | 机会识别→决策→执行全链路 |
| 计划表达方式 | 数字价格为主 | **定性条件为主，数字为辅** |
| 截图录入时机 | 盘中实时上传 | **盘后统一批量分配** |
| 执行质量度量 | 价格偏差（±$X） | **条件是否满足（Yes/No）** |
| 最大价值 | 盈亏统计 | 发现决策模式和行为偏差 |

**核心洞察**：你的工作流天然是条件驱动的而非价格驱动的——你不会说"在 $487 买入"，你会说"在 VWAP 站稳后买入"。系统的语言应该和你思考的语言一致，强迫填数字反而是在用错误的框架约束正确的思维方式。
