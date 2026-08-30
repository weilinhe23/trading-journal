You are implementing the Trading Journal core insights library based on a Gepetto plan.

## Your Mission

Read the planning documents embedded below and implement ALL sections in dependency order. Preserve unrelated user changes and follow the repository AGENTS.md instructions.

## Planning Documents

### Section Index (dependencies and order)

<!-- SECTION_MANIFEST
section-01-database-foundation
section-02-core-types-and-text
section-03-server-services
section-04-api-routes
section-05-insights-interface
section-06-weekly-integration-and-backfill
section-07-verification-and-release
END_MANIFEST -->

# 核心经验库实施章节索引

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
| --- | --- | --- | --- |
| section-01-database-foundation | - | 03, 04, 06, 07 | 可与 02 并行，但应用 Schema 前必须独占数据库写入 |
| section-02-core-types-and-text | - | 03, 04, 05, 07 | 可与 01 并行 |
| section-03-server-services | 01, 02 | 04, 05, 06, 07 | 否 |
| section-04-api-routes | 01, 02, 03 | 05, 06, 07 | 可与 05 的静态骨架并行 |
| section-05-insights-interface | 02, 03, 04 | 06, 07 | 否 |
| section-06-weekly-integration-and-backfill | 01, 02, 03, 04, 05 | 07 | 否 |
| section-07-verification-and-release | 01–06 | - | 否 |

## Execution Order

1. `section-01-database-foundation` 与 `section-02-core-types-and-text` 可以并行开始。
2. 两者完成后执行 `section-03-server-services`。
3. 服务层完成后执行 `section-04-api-routes`；`section-05-insights-interface` 可先建立静态骨架，但完整联调等待 API。
4. API 和经验库页面稳定后执行 `section-06-weekly-integration-and-backfill`。
5. 最后执行 `section-07-verification-and-release`。

## Section Summaries

### section-01-database-foundation

检查工作区、建立 SQLite 安全备份和旧数据基线，新增 Insight/InsightSource Schema、关系与索引，运行 `pnpm db:push` 并验证回滚路径。

### section-02-core-types-and-text

新增经验库 DTO、拆分、规范化、hash、标签提取、候选排序、JSON 标签解析和客户端筛选纯函数，并配置 Vitest 单元测试。

### section-03-server-services

实现幂等周报同步、DTO 聚合、来源状态守卫、经验 CRUD、合并事务和历史回填服务，处理历史来源和非周一日期。

### section-04-api-routes

建立 Insight、InsightSource、单周重试和历史回填 Route Handler，统一 Zod 校验、400/404/409/500 响应，并把非阻塞同步接入周报 PUT。

### section-05-insights-interface

建立 `/insights` 服务端页面和客户端组件，实现查看、搜索、标签、排序、来源回溯、待整理、创建、编辑、置顶、归档、恢复和合并交互。

### section-06-weekly-integration-and-backfill

在顶栏、周报列表和周报详情中接入经验库入口、待整理数量、同步提示和重试；实现历史 dry-run、正式回填及幂等核对。

### section-07-verification-and-release

执行单元/服务测试、类型检查、lint、build 和完整手工验收；核对旧周报不变、数据库备份有效、回填幂等，并整理上线与回滚记录。


### Section Files

---
## section-01-database-foundation.md
---

# Section 01: Database Foundation

## Background

Trading Journal 是本地 Next.js 15 + Prisma + SQLite 应用。每周周报目前用唯一的 `WeeklyReport.weekStart` 标识，核心经验存于 `keyLessons: String?`。经验库需要两个新实体：用户维护的规范化经验 `Insight`，以及从每周周报拆出的原文快照 `InsightSource`。

本节只建立安全基线和数据库结构，不实现业务 API 或 UI。数据库包含真实个人交易记录，Schema 变更前必须建立可恢复备份。项目当前通过 `pnpm db:push` 管理 Schema，没有 Prisma migrations 目录。

## Requirements

- 保留所有现有 WeeklyReport 和 `keyLessons`；
- 新增 Insight/InsightSource 枚举、模型、关系和索引；
- 来源关系使用 Restrict，防止静默丢失历史；
- 同一周相同 hash 只能有一条来源；
- 支持已处理来源在周报编辑后保留为历史快照；
- 备份流程考虑 SQLite WAL；
- Schema 应用后应用可以生成 Prisma Client 并启动；
- 建立明确回滚方法。

## Dependencies

- Requires: 无
- Blocks: section-03-server-services、section-04-api-routes、section-06-weekly-integration-and-backfill、section-07-verification-and-release
- Parallel work: 可与 section-02-core-types-and-text 并行；执行数据库写操作时不得有其他任务修改 SQLite。

## Implementation Details

### 1. 检查工作区

执行 `git status --short`，记录与以下文件重叠的用户修改：

- `prisma/schema.prisma`
- `src/app/api/weekly-reports/[weekStart]/route.ts`
- `src/components/weekly/WeeklyReportClient.tsx`

保留所有无关修改。不得使用 `git reset --hard`、`git checkout --` 或删除工作区来清理状态。

### 2. 建立 SQLite 安全备份

数据库路径为 `prisma/db.sqlite`。在复制前：

1. 停止 `pnpm dev`；
2. 关闭 Prisma Studio；
3. 确认没有进程继续写入数据库；
4. 创建 `prisma/backups`；
5. 将数据库复制为 `db-before-insights-YYYYMMDD-HHmmss.sqlite`；
6. 记录备份绝对路径、文件大小和时间。

项目可能存在 `db.sqlite-wal` 和 `db.sqlite-shm`。优先停止写入，让 SQLite 完成 checkpoint 后再复制主数据库。若不能停止写入，不得只复制主文件并声称备份有效；应使用 SQLite 在线备份能力或保存主文件、WAL 和 SHM 的一致快照。

删除或覆盖现有备份不属于本任务范围。

### 3. 记录旧数据基线

通过 Prisma 只读查询记录：

- WeeklyReport 总数；
- `keyLessons` 非空周报数；
- 按 weekStart 排序后的 `weekStart + keyLessons` 稳定摘要；
- 最早和最晚 weekStart；
- 数据库文件大小。

摘要可用 SHA-256，但不要把敏感全文写进日志。预期约 24 份非空周报；实施时以实际值为准。

### 4. 修改 Prisma Schema

在 `prisma/schema.prisma` 增加：

```prisma
enum InsightStatus {
  ACTIVE
  ARCHIVED
}

enum InsightSourceState {
  PENDING
  LINKED
  IGNORED
}

model Insight {
  id        String        @id @default(cuid())
  title     String
  content   String?
  tagsJson  String        @default("[]")
  status    InsightStatus @default(ACTIVE)
  isPinned  Boolean       @default(false)
  sources   InsightSource[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([status, isPinned])
  @@index([updatedAt])
}

model InsightSource {
  id             String             @id @default(cuid())
  weekStart      DateTime
  weeklyReport   WeeklyReport       @relation(fields: [weekStart], references: [weekStart], onDelete: Restrict)
  sourceText     String
  normalizedText String
  sourceHash     String
  sortOrder      Int
  state          InsightSourceState @default(PENDING)
  insightId      String?
  insight        Insight?           @relation(fields: [insightId], references: [id], onDelete: Restrict)
  isCurrent      Boolean            @default(true)
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  @@unique([weekStart, sourceHash])
  @@index([state, isCurrent, weekStart])
  @@index([insightId, weekStart])
}
```

在现有 `WeeklyReport` 增加：

```prisma
insightSources InsightSource[]
```

### 5. 模型语义

- `Insight` 是规范化经验，可以没有来源，支持手工创建。
- `InsightSource` 是周报原文快照。
- `sourceHash` 由规范化原文 SHA-256 生成。
- `[weekStart, sourceHash]` 防止重复保存产生重复来源。
- `isCurrent=false` 表示原文不再出现在当前周报，但历史来源仍保留。
- `LINKED` 必须有 insightId；PENDING/IGNORED 必须没有 insightId。SQLite/Prisma 无法完整表达这一 CHECK，后续服务层负责保证。
- 普通 UI 不硬删除 Insight，只归档。
- 合并事务迁移来源后可以删除空的旧 Insight。

### 6. 日期兼容

不要增加“weekStart 必须是周一”的数据库或应用校验。历史中存在周日 `2026-03-08`。所有关系必须直接引用实际 `WeeklyReport.weekStart`。

### 7. 应用 Schema

在数据库无写入时运行：

```text
pnpm db:push
```

检查：

- 命令成功；
- `generated/prisma` 已更新；
- 新表和索引存在；
- WeeklyReport 基线计数和摘要不变；
- `pnpm typecheck` 至少不会因 Prisma Client 失配失败。

### 8. 回滚流程

若 Schema 应用失败或旧数据异常：

1. 停止应用和数据库写入；
2. 保留失败数据库副本用于分析；
3. 从明确备份恢复 `prisma/db.sqlite`；
4. 恢复本节 Schema 编辑；
5. 运行 Prisma generate/postinstall 对应命令；
6. 再次核对 WeeklyReport 基线。

不要直接手工删除 SQLite 表，也不要删除整个数据库目录。

## Acceptance Criteria

- [ ] 已记录初始 git 状态并保留用户修改。
- [ ] 已建立可恢复的 SQLite 备份，且处理了 WAL 风险。
- [ ] 已记录 WeeklyReport/keyLessons 基线摘要。
- [ ] Schema 包含两个枚举、两个模型和 WeeklyReport 反向关系。
- [ ] `[weekStart, sourceHash]` 唯一约束和查询索引存在。
- [ ] 两个关系都使用 `onDelete: Restrict`。
- [ ] `pnpm db:push` 成功并更新 Prisma Client。
- [ ] 旧周报数量和 keyLessons 摘要保持不变。
- [ ] 非周一 weekStart 没有被拒绝。
- [ ] 回滚步骤已记录并可执行。

## Files to Create/Modify

- `prisma/schema.prisma` — 新增枚举、模型、关系和索引。
- `prisma/backups/db-before-insights-*.sqlite` — 本地安全备份；不要提交版本控制，是否已被 `.gitignore` 忽略需确认。

## Verification Commands

```text
pnpm db:push
pnpm typecheck
```

如果 `pnpm typecheck` 因后续尚未实现的引用失败，本节不应提前加入那些引用；Schema 阶段应保持现有代码可编译。


---
## section-02-core-types-and-text.md
---

# Section 02: Core Types and Text Processing

## Background

经验库必须把 `WeeklyReport.keyLessons` 的自由文本稳定拆成来源，并用确定性规则规范化、生成 hash、提取标签和推荐已有经验。所有规则都应位于纯函数模块中，避免散落在 React 组件或 Route Handler。

当前历史周报常见格式包括每行一条、`1.`、`1、`、空行和单段无编号文字。一条经验可能包含多个句子或内部 `1）2）3）` 条件，因此不能按句号或所有数字编号拆分。

项目没有测试框架。本节新增 Vitest，但不引入 DOM 或 E2E 工具。

## Requirements

- 新增独立经验库 DTO；
- 拆分规则对当前历史格式稳定；
- 规范化和 hash 幂等；
- 标签使用明确词典，不调用 AI；
- 候选排序可解释、可测试且永不自动归并；
- 搜索、筛选和排序逻辑可单测；
- tagsJson 损坏不会让页面崩溃；
- 新增 Vitest 和核心测试。

## Dependencies

- Requires: 无
- Blocks: section-03-server-services、section-04-api-routes、section-05-insights-interface、section-07-verification-and-release
- Parallel work: 可与 section-01-database-foundation 并行。

## Implementation Details

### 1. 创建 `src/types/insights.ts`

定义客户端安全 DTO，所有日期用字符串：

```ts
export type InsightStatusDto = "ACTIVE" | "ARCHIVED"
export type InsightSourceStateDto = "PENDING" | "LINKED" | "IGNORED"

export interface InsightSourceDto {
  id: string
  weekStart: string
  sourceText: string
  sortOrder: number
  state: InsightSourceStateDto
  isCurrent: boolean
  insightId: string | null
}

export interface InsightCandidateDto {
  id: string
  title: string
  tags: string[]
  occurrenceCount: number
  lastSeen: string | null
  score: number
}

export interface PendingInsightSourceDto extends InsightSourceDto {
  state: "PENDING"
  suggestedTags: string[]
  candidates: InsightCandidateDto[]
}

export interface InsightDto {
  id: string
  title: string
  content: string | null
  tags: string[]
  status: InsightStatusDto
  isPinned: boolean
  occurrenceCount: number
  sourceCount: number
  lastSeen: string | null
  updatedAt: string
  sources: InsightSourceDto[]
}
```

再定义：

- `InsightsLibraryData`；
- `InsightSyncResult` 和同步失败 DTO；
- `InsightBackfillResult`；
- create/update/merge 输入类型；
- `InsightSourceAction` discriminated union。

不要把 Prisma 类型暴露给客户端，也不要继续扩展已很大的 `src/types/index.ts`。

### 2. 创建 `src/lib/insights.ts`

该文件不得导入 Prisma、Next.js 或浏览器 API。可导入 `node:crypto`，但如果同一文件会被客户端导入，需把 hash 单独放入服务端安全文件。推荐选择之一：

- `insights.ts` 只放同构纯函数，hash 放 `insight-hash.ts` 并标记 server-only；或
- 客户端不直接导入整个模块，通过明确子模块避免 node:crypto 进入 bundle。

实施者必须验证 Next.js 客户端 bundle 不包含 Node-only 模块。

### 3. `splitWeeklyLessons`

输入 `string | null | undefined`，输出：

```ts
interface ParsedWeeklyLesson {
  sourceText: string
  normalizedText: string
  sortOrder: number
}
```

步骤：

1. null/undefined/全空白返回空数组；
2. `\r\n` 和 `\r` 转为 `\n`；
3. 按换行拆分；
4. 丢弃空行；
5. 移除行首列表前缀：数字 + `.、．)）`，或 `- * •`；
6. trim；
7. 规范化；
8. 以 normalizedText 在本次输入内去重；
9. 按首次出现顺序重新生成连续 sortOrder。

以下保持一条：

```text
强趋势条件：1）有 Gap；2）有消息；3）开盘后持续接受。
```

以下拆成两条：

```text
1、Level 与 K 线结合
2、15M 用于确认方向
```

不要按中文/英文句号拆分。

### 4. `normalizeInsightText`

固定顺序：

1. Unicode NFKC；
2. 移除开头列表标记；
3. trim；
4. 连续空白折叠为一个空格；
5. 英文 lowercase。

保留内部标点、数字、方向词和否定词。“可以进入”和“不能进入”不得因过度清理变成相同文本。

### 5. `hashInsightText`

接收已经规范化的非空文本，使用 SHA-256，返回小写 hex。调用方不得传原始文本。对空字符串应抛出或明确拒绝。

如果 hash 函数位于 server-only 模块，`splitWeeklyLessons` 不直接生成 hash；服务层组合两者。

### 6. 标签词典

集中定义规范标签及别名：

```ts
const INSIGHT_TAG_RULES = [
  { tag: "Level", terms: ["level", "pmh", "pml", "pdh", "pdl", "onh", "onl"] },
  { tag: "K线", terms: ["k线", "candle", "chart"] },
  { tag: "15M", terms: ["15m", "15分钟"] },
  { tag: "5M", terms: ["5m", "5分钟"] },
  { tag: "1M", terms: ["1m", "1分钟"] },
  { tag: "VWAP", terms: ["vwap"] },
  { tag: "Gap", terms: ["gap", "跳空"] },
  { tag: "入场", terms: ["入场", "进入", "entry"] },
  { tag: "退出", terms: ["退出", "止盈", "止损", "exit"] },
  { tag: "趋势", terms: ["趋势", "trend"] },
  { tag: "震荡", terms: ["震荡", "range", "chop"] },
  { tag: "新闻", terms: ["新闻", "消息", "数据", "财报", "fomc", "cpi", "ppi"] },
  { tag: "纪律", terms: ["纪律", "手机", "犹豫", "果断", "耐心"] },
]
```

英文缩写需使用合适边界，避免 `gap` 命中无关长词。中文按词包含即可。输出按词典稳定顺序去重。

### 7. JSON 标签函数

`normalizeTags(tags)`：

- trim；
- 过滤空值；
- 别名映射到规范显示名；
- 限制每个 tag 1–50 字符、最多 20 个；
- 去重；
- 保持稳定顺序。

`parseTagsJson(raw)`：

- try/catch JSON.parse；
- 非数组返回 `[]`；
- 过滤非字符串；
- 调 normalizeTags；
- 解析失败返回 `[]`，可让服务层记录诊断，但函数不抛出导致页面崩溃。

### 8. 候选排序

定义显式权重常量。基础建议：

- 规范化标题完全相同：100；
- 每个标签交集：20；
- 来源关键词在标题命中：10；
- 来源关键词在 content 命中：3。

规则：

- 只接收 ACTIVE 候选；
- score 为 0 不返回；
- score 降序；
- 同分时 isPinned 优先；
- 再按 lastSeen 倒序；
- 最后按 title/id 稳定排序；
- 最多 5 条；
- 函数只返回建议，不修改任何数据。

### 9. 列表工具

实现客户端可复用纯函数：

- 搜索 title/content/tags/sourceText；
- tag 精确筛选；
- recent/frequent/updated 排序；
- 置顶始终优先；
- 空 query 返回全部。

确保搜索规范化与来源规范化相容，但不要把中文文本全部去标点后造成误匹配。

### 10. 配置 Vitest

执行：

```text
pnpm add -D vitest
```

`package.json` 增加：

```json
"test": "vitest run",
"test:watch": "vitest"
```

不要添加 React Testing Library、jsdom 或 E2E 工具。

### 11. 单元测试

新增 `src/lib/insights.test.ts`，覆盖：

- CRLF/CR；
- 中文/英文编号；
- bullet；
- 空行；
- 单段；
- 内部子编号不误拆；
- NFKC；
- 大小写和空白；
- 否定词保留；
- 同输入去重；
- hash 稳定和不同文本不同 hash；
- tag 别名、顺序和去重；
- malformed JSON；
- 候选完全匹配、标签匹配、无匹配和稳定排序；
- 搜索来源原文；
- 三种排序和 pin 优先；
- distinct week 统计 helper（若放本模块）。

测试例应包含从实际周报格式最小化得到的中文示例，但不复制不必要的私人长文本。

## Acceptance Criteria

- [ ] `src/types/insights.ts` 包含完整序列化 DTO。
- [ ] 客户端 DTO 不含 Date 或 Prisma 模型。
- [ ] 拆分支持历史编号格式，不按句号或内部子编号误拆。
- [ ] 规范化稳定并保留否定语义。
- [ ] hash 使用 SHA-256 且不会进入客户端 bundle。
- [ ] 标签词典集中、确定性且可扩展。
- [ ] tagsJson 损坏安全回退。
- [ ] 候选排序可解释、稳定、最多 5 条且不自动归并。
- [ ] 搜索、筛选和排序为纯函数。
- [ ] Vitest 已加入 devDependency 和 scripts。
- [ ] 核心边界测试全部通过。

## Files to Create/Modify

- `src/types/insights.ts` — DTO 和输入类型。
- `src/lib/insights.ts` — 同构纯函数。
- `src/lib/insight-hash.ts`（如采用拆分方案）— server-only SHA-256。
- `src/lib/insights.test.ts` — 单元测试。
- `package.json` — test scripts 和 Vitest。
- `pnpm-lock.yaml` — 依赖锁定。

## Verification Commands

```text
pnpm test
pnpm typecheck
```


---
## section-03-server-services.md
---

# Section 03: Server Services and Transactions

## Background

经验库的核心不是页面，而是稳定的来源同步和状态事务。周报可以反复保存、修改或清空；系统必须删除消失的待整理来源，同时保留已经关联或忽略的历史快照。创建经验并关联、来源状态变化和经验合并都需要原子事务。

本节实现 `src/lib/insights-server.ts`。所有 Route Handler 和服务端页面都调用此服务，不能各自复制 Prisma 查询或聚合逻辑。

## Requirements

- 实现幂等的 `syncWeeklyLessons`；
- 保留 LINKED/IGNORED 历史，删除消失的 PENDING；
- 实现 Insight DTO 派生统计；
- 实现 LINK、CREATE、IGNORE、RESTORE、UNLINK；
- 使用状态守卫返回冲突；
- 实现编辑、归档、恢复和合并事务；
- 实现历史 dry-run 和正式回填；
- 所有日期按 UTC 业务日期，不强制周一；
- 不修改 WeeklyReport.keyLessons。

## Dependencies

- Requires: section-01-database-foundation、section-02-core-types-and-text
- Blocks: section-04-api-routes、section-05-insights-interface、section-06-weekly-integration-and-backfill、section-07-verification-and-release

## Implementation Details

### 1. Server-only 边界

创建 `src/lib/insights-server.ts`，在顶部使用 `import "server-only"`（如果项目可用）或确保它只被服务端模块导入。该文件导入：

- `prisma` from `~/lib/prisma`；
- Prisma enum/type from generated client；
- section-02 的纯函数和 DTO；
- UTC 日期 helper。

React client component 不得导入该文件。

### 2. 日期处理

复用 `src/lib/kpi.ts` 的 `parseUtcTradingDate` 和 `toDateString`，或把它们提取为通用日期 helper 后更新现有调用。所有输出 weekStart 使用 `YYYY-MM-DD`。

不要：

- 使用浏览器本地时区推导日期；
- 强制 weekStart 是周一；
- 把历史周日值改写成另一周。

### 3. 服务错误类型

定义可被 API 识别的最小错误：

- `InsightNotFoundError`；
- `InsightConflictError`；
- `InsightValidationError`（若 Zod 前还有业务验证）。

错误对外只映射安全消息。未知 Prisma/SQLite 错误保持原异常链供服务器日志使用。

### 4. `syncWeeklyLessons`

签名：

```ts
export async function syncWeeklyLessons(
  weekStart: Date,
  keyLessons: string | null | undefined,
): Promise<InsightSyncResult>
```

流程：

1. `splitWeeklyLessons(keyLessons)`；
2. 为每条规范化文本计算 hash；
3. 内存中按 hash 去重；
4. 启动 Prisma 事务；
5. 查询该周全部 InsightSource；
6. 生成 existingByHash；
7. 遍历当前来源：
   - 不存在：create PENDING、insightId null、isCurrent true；
   - 已存在且 PENDING：更新 sourceText、normalizedText、sortOrder、isCurrent true；
   - 已存在且 LINKED/IGNORED：只恢复 isCurrent true，不覆盖 sourceText 快照；
8. 遍历数据库旧来源中本次不存在的 hash：
   - PENDING：delete；
   - LINKED/IGNORED：update isCurrent false；
9. 统计当前 PENDING 数量；
10. 返回 created/existing/pending/removedPending/historical。

事务失败必须整体回滚。重复保存未修改文本后：

- createdCount=0；
- 总来源数不变；
- 状态不变。

清空 keyLessons 后：

- 当前 PENDING 全删；
- LINKED/IGNORED 全部 `isCurrent=false`；
- 旧周报来源快照仍能在 Insight 展开查看。

### 5. 同步差异纯函数

为提高可测性，建议把“当前条目 + 现有来源 → 操作计划”提取为纯函数，例如：

```ts
interface SyncPlan {
  create: ParsedSource[]
  refreshPending: ...[]
  restoreCurrent: string[]
  deletePending: string[]
  markHistorical: string[]
}
```

服务层只执行操作计划。这样不需要大规模 mock Prisma 即可覆盖复杂分支。

### 6. DTO 映射

实现单一 mapper：

- tagsJson -> string[]；
- Date -> ISO/日期字符串；
- sources -> SourceDto；
- sourceCount = LINKED 来源总数；
- occurrenceCount = LINKED 来源不同 weekStart 数；
- lastSeen = LINKED 来源最大 weekStart；
- 来源按 weekStart 倒序、sortOrder 正序。

`isCurrent=false` 的 LINKED 来源仍计入历史统计；UI 会显示历史标记。

### 7. `getInsightsLibraryData`

一次或少量 Prisma 查询取得：

- ACTIVE/ARCHIVED Insight + sources；
- current PENDING sources；
- 可选 current IGNORED sources；
- ACTIVE 候选轻量数据。

对每个 PENDING：

- 提取 suggestedTags；
- 调 `rankInsightCandidates`；
- 返回最多 5 条候选。

数据规模当前约 86 来源，无需分页。避免按每条来源单独查询候选造成 N+1；一次取得 ACTIVE Insight 后在内存计算。

### 8. 创建和更新 Insight

`createInsight(input)`：

- title trim，1–300；
- content null 或 trim 后文本，限制 10,000；
- tags normalize，最多 20；
- tagsJson 统一 JSON.stringify；
- status 默认 ACTIVE；
- isPinned 默认 false。

`updateInsight(id, input)`：

- 至少一个字段；
- 不存在抛 NotFound；
- 不允许通过该操作硬删除；
- ARCHIVED 来源保持原关联；
- 恢复 ACTIVE 后重新进入候选。

### 9. 来源状态操作

#### LINK

事务内确认目标 Insight 存在且 ACTIVE，然后：

```text
updateMany where { id: sourceId, state: PENDING, insightId: null }
data { state: LINKED, insightId }
```

count != 1 抛 Conflict。

#### CREATE + LINK

事务内：

1. 用状态守卫读取/更新 PENDING；
2. 创建 Insight；
3. 把 source 设 LINKED；
4. 任一步失败回滚。

为了避免创建孤立 Insight，推荐先验证来源状态，再创建，然后 guarded update；或者在事务内读后按 id/state 更新并确认 count。

#### IGNORE

PENDING -> IGNORED，insightId 保持 null。count != 1 为 409。

#### RESTORE

IGNORED -> PENDING，insightId null。历史 `isCurrent=false` 的 IGNORED 是否允许恢复需明确：建议允许恢复状态但不显示在 current PENDING；或拒绝并提示原文已不在当前周报。MVP 推荐拒绝恢复非当前来源，避免产生不可处理的 PENDING 历史项。

#### UNLINK

LINKED -> PENDING、insightId null。若 `isCurrent=false`，同样建议拒绝或转为 IGNORED；推荐拒绝并提示该原文已从周报删除。current LINKED 才能 UNLINK。

### 10. 合并事务

`mergeInsights(sourceInsightId, targetInsightId, resolvedFields)`：

1. ID 相同 -> Conflict；
2. 事务内并行读取 source/target；
3. 任一不存在 -> NotFound；
4. 校验最终 title/content/tags；
5. 更新 target；
6. `updateMany` 把 source 的全部来源迁移到 target；
7. count source 剩余来源，必须为 0；
8. delete source；
9. 查询完整 target 并映射 DTO；
10. 返回目标。

`[weekStart, sourceHash]` 唯一约束与 insightId 无关，因此迁移不会产生重复。统计时按不同周去重。

合并允许 ACTIVE/ARCHIVED 的组合吗？MVP 推荐 target 必须 ACTIVE，source 可以 ACTIVE 或 ARCHIVED；最终目标保持 ACTIVE。这样候选和 UI 语义清晰。

### 11. 查询单条和列表

提供：

- `getInsightById`；
- `listInsights`；
- `listInsightSources`；
- `getPendingCount({ weekStart? })`。

列表查询支持 API query，但页面全量加载可在客户端继续过滤。服务端与客户端排序 helper 应共享口径。

### 12. 历史回填

`backfillWeeklyInsights({ dryRun })`：

1. 查询全部非空 keyLessons 周报；
2. 每周拆分并与现有 `[weekStart, hash]` 比较；
3. dryRun 不写数据库；
4. 正式模式逐周调用生产同步；
5. 每周事务独立；
6. 单周失败记录 weekStart 和安全错误摘要，继续其他周；
7. 返回 reportsScanned、reportsWithLessons、created、existing、skipped、failedWeeks；
8. 不修改 WeeklyReport。

正式回填重复运行必须新增 0。历史周日 weekStart 必须照常处理。

### 13. 服务测试

至少自动测试同步操作计划：

- 首次创建；
- 未修改重复保存；
- 新增行；
- 修改 PENDING；
- 删除 PENDING；
- 删除 LINKED/IGNORED 后 historical；
- 历史句重新出现；
- 清空文本；
- 同周重复文本去重。

测试状态守卫和 merge 顺序。若 Prisma mock 复杂，确保差异计算和状态决策大部分由纯函数覆盖，再进行少量事务集成/手工验证。

## Acceptance Criteria

- [ ] server-only 模块边界明确，客户端无法导入 Prisma 服务。
- [ ] 日期 helper 不强制周一且输出 YYYY-MM-DD。
- [ ] 同步首次创建、重复保存、编辑、删除和清空都符合规格。
- [ ] PENDING 消失时删除，LINKED/IGNORED 消失时历史化。
- [ ] 来源快照在 LINKED/IGNORED 状态不被静默覆盖。
- [ ] DTO 的周数、来源数和 lastSeen 正确派生。
- [ ] 候选无 N+1 查询。
- [ ] LINK/CREATE/IGNORE/RESTORE/UNLINK 有状态守卫和 Conflict。
- [ ] 普通 API 不硬删除 Insight。
- [ ] 合并事务迁移来源后删除源，失败整体回滚。
- [ ] 回填支持 dry-run、逐周事务、错误汇总和幂等。
- [ ] 旧 WeeklyReport.keyLessons 从未被修改。
- [ ] 关键同步分支有自动测试。

## Files to Create/Modify

- `src/lib/insights-server.ts` — Prisma 查询、同步、状态操作、合并和回填。
- `src/lib/insights.ts` — 可选增加同步差异纯函数和统计 helper。
- `src/lib/insights.test.ts` — 增加同步计划和统计测试。
- `src/lib/kpi.ts` 或新的通用日期 helper — 复用/提取 UTC 业务日期函数。

## Verification Commands

```text
pnpm test
pnpm typecheck
```


---
## section-04-api-routes.md
---

# Section 04: API Routes

## Background

经验库采用 Next.js App Router Route Handlers。现有项目使用 Zod `safeParse`、`NextResponse.json` 和 `{ success, data?, error? }` 响应。经验库 API 需要覆盖规范化经验、原始来源、单周同步重试和历史回填，并把经验同步接入现有周报 PUT。

最重要的产品约束是：周报保存成功后，即使经验同步失败，也不能向用户报告“周报保存失败”。因此周报 upsert 和经验同步不能放进同一事务。

## Requirements

- 所有写接口使用 Zod；
- malformed JSON 返回 400；
- 不存在返回 404；
- 状态并发冲突返回 409；
- 未知异常返回 500 且不泄露堆栈；
- 建立 Insight CRUD（不含硬删除）、merge、来源 action、单周重试和 backfill；
- 周报 PUT 返回独立同步结果；
- 明确处理 keyLessons 清空；
- 日期仅验证 YYYY-MM-DD，不强制周一；
- API 调用 section-03 服务，不复制业务逻辑。

## Dependencies

- Requires: section-01-database-foundation、section-02-core-types-and-text、section-03-server-services
- Blocks: section-05-insights-interface、section-06-weekly-integration-and-backfill、section-07-verification-and-release

## Shared Conventions

### JSON 解析

对 `await request.json()` 使用 try/catch。解析失败返回：

```json
{ "success": false, "error": "请求内容不是有效 JSON" }
```

状态 400。

### 错误映射

- Zod validation -> 400；
- `InsightNotFoundError` -> 404；
- `InsightConflictError` -> 409；
- 其他 -> 500，并 `console.error("[METHOD /api/path]", error)`。

不要把 Zod issues、Prisma query 或 stack 原样返回。需要字段级错误时，可返回安全的扁平字段映射。

### 输入上限

集中定义或共享：

- title：trim 后 1–300；
- content：null 或最多 10,000；
- tag：trim 后 1–50；
- tags：最多 20；
- q：最多 200；
- ID：非空字符串；
- weekStart：严格 `^\d{4}-\d{2}-\d{2}$` 并能构造有效 UTC 日期。

不要校验周一。

## API Implementation

### 1. `src/app/api/insights/route.ts`

#### GET

Query：

- `status=ACTIVE|ARCHIVED`，可选；
- `q`，可选；
- `tag`，可选；
- `sort=recent|frequent|updated`，默认 recent。

调用 `listInsights`。返回：

```json
{ "success": true, "data": [] }
```

即使页面主数据由 server component 加载，也保留此端点供 Dialog 或未来复用。

#### POST

Schema：

```ts
z.object({
  title: z.string().trim().min(1).max(300),
  content: z.string().max(10_000).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  isPinned: z.boolean().optional(),
  sourceId: z.string().min(1).optional(),
})
```

有 sourceId 调 `createInsightFromSource`，没有则调 `createInsight`。前者必须事务原子。

成功 201；状态冲突 409。

### 2. `src/app/api/insights/[id]/route.ts`

#### GET

- 读取异步 params；
- 空 ID -> 400；
- 不存在 -> 404；
- 成功返回完整 InsightDto。

#### PUT

Schema partial，但要求至少一个字段：

```ts
z.object({
  title: z.string().trim().min(1).max(300).optional(),
  content: z.string().max(10_000).nullable().optional(),
  tags: z.array(...).max(20).optional(),
  isPinned: z.boolean().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
}).refine((value) => Object.keys(value).length > 0)
```

归档和恢复都通过 status。不要增加 DELETE。

### 3. `src/app/api/insights/[id]/merge/route.ts`

路径 id 表示被合并源 Insight。Body：

```ts
{
  targetInsightId: string
  title: string
  content?: string | null
  tags: string[]
}
```

校验：

- source id 与 target 不同；
- title/content/tags 上限；
- target 必须 ACTIVE；
- source 可 ACTIVE/ARCHIVED。

调用 `mergeInsights`。成功 200，返回目标完整 DTO。相同 ID 或并发变化返回 409。

### 4. `src/app/api/insight-sources/route.ts`

#### GET

Query：

- `state=PENDING|LINKED|IGNORED`；
- `weekStart=YYYY-MM-DD`；
- `includeHistorical=true|false`，默认 false。

调用 `listInsightSources`。PENDING DTO 包含 suggestedTags 和最多 5 条 candidates。

非法 enum、boolean 或日期返回 400。

### 5. `src/app/api/insight-sources/[id]/route.ts`

#### PATCH

使用 Zod discriminated union：

```ts
z.discriminatedUnion("action", [
  z.object({ action: z.literal("LINK"), insightId: z.string().min(1) }),
  z.object({ action: z.literal("IGNORE") }),
  z.object({ action: z.literal("RESTORE") }),
  z.object({ action: z.literal("UNLINK") }),
])
```

映射：

- LINK -> `linkSource`；
- IGNORE -> `ignoreSource`；
- RESTORE -> `restoreSource`；
- UNLINK -> `unlinkSource`。

状态守卫失败返回 409，并使用稳定文案：“记录状态已变化，请刷新后重试”。

### 6. `src/app/api/weekly-reports/[weekStart]/insights/route.ts`

#### POST

1. 用统一 UTC 日期 helper 解析；
2. 不检查是否周一；
3. 查询 WeeklyReport；
4. 不存在 -> 404；
5. 调 `syncWeeklyLessons(report.weekStart, report.keyLessons)`；
6. 返回同步统计。

此接口只重试同步，不修改周报。

### 7. `src/app/api/insights/backfill/route.ts`

#### POST

Body：

```ts
z.object({ dryRun: z.boolean() })
```

调用 `backfillWeeklyInsights`。返回：

```ts
{
  success: true,
  data: {
    dryRun: boolean,
    reportsScanned: number,
    reportsWithLessons: number,
    createdCount: number,
    existingCount: number,
    skippedCount: number,
    failedWeeks: Array<{ weekStart: string; error: string }>
  }
}
```

这是 localhost 个人应用内部操作，不新增认证。UI 必须先 dry-run 再正式确认。API 本身仍允许幂等重复调用。

### 8. 修改 `src/app/api/weekly-reports/[weekStart]/route.ts`

保留 GET 行为。PUT 调整：

1. 解析日期；
2. 解析 JSON 和 Zod；
3. upsert WeeklyReport；
4. 仅当请求 body 明确包含 `keyLessons` 时尝试同步；
5. 同步成功返回附加 metadata；
6. 同步失败记录错误，但仍返回 200、`success: true` 和已保存 report。

响应：

```ts
{
  success: true,
  data: report,
  insightSync?:
    | {
        success: true
        createdCount: number
        existingCount: number
        pendingCount: number
        removedPendingCount: number
        historicalCount: number
      }
    | {
        success: false
        error: "经验同步失败，可重试"
      }
}
```

周报 upsert 失败仍返回 500。不要把 upsert 和 sync 包在一个事务。

### 9. keyLessons 清空语义

当前客户端使用 `form.keyLessons || undefined`，导致空字符串不提交。后续客户端会始终提交 `keyLessons: form.keyLessons`。

服务端应明确：

- 请求未包含字段：不修改、不同步；
- 请求包含空字符串：存为 null（推荐）或空字符串，并同步空列表；
- 请求包含文字：保存并同步。

推荐在 Zod 后规范为空字符串 -> null，但 `parsed.data` 必须保留“字段是否出现”的信息。可在解析前用 `Object.prototype.hasOwnProperty.call(body, "keyLessons")` 记录 presence，或者使用解析结果的 own property。

必须测试：

- 清空会删除 current PENDING；
- LINKED/IGNORED 历史化；
- 未提交 keyLessons 不触发同步。

## Client Mutation Expectations

所有 mutation 响应可包含更新后 DTO，但客户端统一 `router.refresh()` 获取服务端真值。请求期间禁用按钮，409 时提示并刷新。

## Acceptance Criteria

- [ ] 所有写 Route 使用 Zod safeParse 和 JSON parse 错误处理。
- [ ] 400/404/409/500 语义一致。
- [ ] Insight 支持 list/create/get/update，不提供普通 DELETE。
- [ ] Merge 使用独立 POST action route。
- [ ] Source PATCH 使用 discriminated union。
- [ ] 单周同步重试不修改 WeeklyReport。
- [ ] Backfill 支持 dry-run 和正式模式。
- [ ] 周报 upsert 成功、同步失败时返回 200 + warning metadata。
- [ ] 周报 upsert 失败时不会执行同步。
- [ ] keyLessons 未提供与明确清空有不同语义。
- [ ] 日期不强制周一，历史周日可用。
- [ ] Route Handler 不复制服务层事务或聚合逻辑。
- [ ] API 不泄露 stack、Prisma 细节或未经处理的错误。

## Files to Create/Modify

- `src/app/api/insights/route.ts`
- `src/app/api/insights/[id]/route.ts`
- `src/app/api/insights/[id]/merge/route.ts`
- `src/app/api/insight-sources/route.ts`
- `src/app/api/insight-sources/[id]/route.ts`
- `src/app/api/weekly-reports/[weekStart]/insights/route.ts`
- `src/app/api/insights/backfill/route.ts`
- `src/app/api/weekly-reports/[weekStart]/route.ts`
- `src/types/insights.ts` — 如需补充响应类型。

## Verification

自动或手工验证：

```text
GET    /api/insights
POST   /api/insights
GET    /api/insights/:id
PUT    /api/insights/:id
POST   /api/insights/:id/merge
GET    /api/insight-sources
PATCH  /api/insight-sources/:id
POST   /api/weekly-reports/:weekStart/insights
POST   /api/insights/backfill
PUT    /api/weekly-reports/:weekStart
```

然后运行：

```text
pnpm test
pnpm typecheck
```


---
## section-05-insights-interface.md
---

# Section 05: Insights Library Interface

## Background

用户需要一个简单的 `/insights` 页面，用来查看、搜索和整理周报经验。该页面不是行为实验或规则验证面板，不显示遵守率、交易结果或每日执行状态。

当前数据规模约为几十条规范化经验和约 86 条来源，适合服务端一次加载、客户端搜索和排序。项目已有 Card、Button、Badge、Input、Textarea、Label、Select、Tabs、Dialog、ScrollArea、Separator 和 Sonner；没有 Sheet 或 Collapsible。MVP 不安装新 UI 库，不修改 `src/components/ui`。

## Requirements

- 新增 `/insights` 服务端页面；
- 支持 ACTIVE、PENDING、ARCHIVED 和次级 IGNORED 视图；
- 搜索标题、说明、标签和来源原文；
- 按标签筛选；
- 按最近出现、出现最多、最近编辑排序；
- 经验卡展示来源统计和原文回溯；
- 支持创建、编辑、置顶、归档、恢复和合并；
- 待整理来源支持 LINK、CREATE、IGNORE；
- 已忽略来源支持 RESTORE；
- 关闭 Dialog 不丢失 PENDING；
- 所有 mutation 防重复提交并刷新服务端真值；
- 深色主题和窄屏可用。

## Dependencies

- Requires: section-02-core-types-and-text、section-03-server-services、section-04-api-routes
- Blocks: section-06-weekly-integration-and-backfill、section-07-verification-and-release

## Implementation Details

### 1. 服务端页面

创建 `src/app/insights/page.tsx`：

```ts
export const dynamic = "force-dynamic"
```

调用 `getInsightsLibraryData()`，把纯 DTO 传给客户端。页面负责：

- 标题“经验库”；
- 一句说明：“集中整理每周周报中的核心经验”；
- 渲染 `InsightsLibraryClient`；
- 不复制 Prisma 查询和统计。

如果服务查询失败，让错误边界显示，或增加同目录 `error.tsx`。不要在页面返回静默空列表掩盖数据库错误。

### 2. `InsightsLibraryClient.tsx`

Props：`InsightsLibraryData`。

本地状态：

- `view: "ACTIVE" | "PENDING" | "ARCHIVED"`；
- `showIgnored`；
- `query`；
- `tag`；
- `sort: "recent" | "frequent" | "updated"`；
- editor/organizer/merge Dialog state；
- mutation loading id/action。

用 section-02 纯函数计算展示列表。服务端刷新后 Props 更新，本地 Dialog 根据资源是否仍存在自动关闭或清理 selection。

页面结构：

1. 标题区：规范经验总数、待整理 Badge、新建按钮；
2. Tabs：全部经验、待整理、已归档；
3. 工具栏：搜索、标签 Select、排序 Select；
4. 列表；
5. 空状态；
6. Dialog。

默认 ACTIVE，默认排序置顶优先、lastSeen 倒序、updatedAt 倒序。

### 3. 搜索和筛选

搜索覆盖：

- title；
- content；
- tags；
- 所有关联 sourceText。

输入规范化后匹配。tag 使用规范标签精确匹配。搜索和 tag 同时存在时取交集。

PENDING 视图搜索 sourceText、suggestedTags 和 candidate title。ARCHIVED 同 ACTIVE。

数据少，不使用 debounce 也可以；若实现 debounce，保持受控输入响应即时。

### 4. `InsightCard.tsx`

卡片显示：

- pin 图标/状态；
- title；
- content 摘要，空时不占位；
- tags Badge；
- `出现 N 周`；
- `最近 YYYY-MM-DD`，无来源时显示“暂无来源”；
- sourceCount 可放次级信息；
- 编辑、合并、归档/恢复操作。

使用原生 `<details>` 展开来源，不新增 Collapsible：

- 来源按 weekStart 倒序；
- 日期链接到 `/weekly/${weekStart}`；
- sourceText 普通文本 + `whitespace-pre-wrap`；
- `isCurrent=false` 显示“周报已修改，保留历史快照”；
- current LINKED 可提供“移回待整理”，历史来源不提供。

不要使用 `dangerouslySetInnerHTML`。

### 5. `InsightEditorDialog.tsx`

同时支持：

- 手工新建；
- 从 PENDING 来源创建；
- 编辑已有 Insight。

字段：

- title，必填，前端限制 300；
- content，可选，限制 10,000；
- tags；
- isPinned。

标签 MVP 用：

- 逗号分隔 Input；或
- 推荐标签 Badge + 文本输入。

不安装 tags input 库。提交前只做友好校验，服务端仍为权威。

从来源创建时显示不可编辑的原文，并用原文预填 title、suggestedTags 预填 tags。保存 body 带 sourceId。

请求期间禁用关闭以外的提交动作，或允许关闭但保持请求安全；至少禁止重复点击。

### 6. `InsightOrganizerDialog.tsx`

使用现有 Dialog + ScrollArea：

- 宽度 `sm:max-w-3xl` 左右；
- 最大高度约 `85vh`；
- 每次聚焦一条 PENDING；
- 显示剩余数量。

内容：

- 原始来源文字；
- 来源周链接；
- suggestedTags；
- 最多 5 条 candidate；
- 搜索全部 ACTIVE Insight；
- LINK；
- CREATE；
- IGNORE。

每次成功操作后从本地当前队列移除该来源并 `router.refresh()`。如果后端返回 409：

- toast“记录状态已变化，请刷新后重试”；
- refresh；
- 不假定本地操作成功。

关闭 Dialog 不处理其余 PENDING。

固定说明：

> 拆分不正确？请回到周报按“一行一条”调整核心经验并重新保存。

来源快照不可直接编辑。

### 7. `MergeInsightDialog.tsx`

从当前 Insight 打开：

1. 搜索目标 ACTIVE Insight，排除自身；
2. 展示源和目标 title/content/tags/sourceCount；
3. 默认保留目标 title/content；
4. tags 默认并集；
5. 允许用户确认最终 title/content/tags；
6. 显示确认文案：“源经验会合并并删除，所有来源周和原文都会保留”；
7. 二次确认提交；
8. 成功关闭并刷新。

不要把 archive 当 merge。合并是明确的不可逆规范记录操作。

### 8. 归档、恢复和置顶

调用 PUT `/api/insights/[id]`：

- archive -> status ARCHIVED；
- restore -> ACTIVE；
- pin/unpin -> isPinned。

请求期间按钮 disabled。归档成功后卡片从 ACTIVE 消失并在 ARCHIVED 出现。

ARCHIVED 不进入 PENDING candidate，但来源仍展示。

### 9. 已忽略来源

不占主 Tab。在 PENDING 视图提供次级“查看已忽略”按钮或筛选：

- 显示 current IGNORED；
- RESTORE 回 PENDING；
- historical ignored 显示历史标记但不允许恢复，和服务层规则一致。

### 10. 空状态

#### ACTIVE 空

- “还没有整理后的经验”；
- 如果有 PENDING，按钮“整理待处理经验”；
- 如果没有来源但有历史周报，显示回填入口占位，由 section-06 接线。

#### PENDING 空

- “没有待整理经验”；
- 链接查看全部经验或周报。

#### ARCHIVED 空

- “没有已归档经验”。

#### 搜索无结果

- 显示清除搜索/筛选按钮，不显示回填入口。

### 11. Loading 和错误

- mutation 按钮显示进行中状态；
- toast 使用具体动作：创建失败、关联失败、合并失败；
- 不使用模糊“操作失败”覆盖服务器已有安全错误；
- 网络错误显示“网络错误，请重试”；
- 409 后 refresh；
- 500 不保留乐观假数据。

### 12. 可访问性

- 所有 icon button 有 `aria-label`；
- Dialog title/description 完整；
- 表单 Label 关联 input；
- 键盘可操作 Tabs、buttons 和 `<details>`；
- Badge 不作为唯一状态信号，配文字；
- 焦点关闭 Dialog 后回到触发按钮。

### 13. 响应式

- 工具栏窄屏换行；
- 卡片操作窄屏可换行，不溢出；
- Dialog 内容 ScrollArea；
- 375px 宽度可完成搜索、整理和编辑；
- 保持现有 dark theme。

## Acceptance Criteria

- [ ] `/insights` 服务端页面从统一服务取得 DTO。
- [ ] ACTIVE/PENDING/ARCHIVED 三个主视图可用。
- [ ] IGNORED 可查看并恢复 current 来源。
- [ ] 搜索覆盖标题、说明、标签和来源原文。
- [ ] 标签筛选和三种排序正确，置顶优先。
- [ ] 卡片显示周数、lastSeen、tags 和来源。
- [ ] 来源链接能跳回周报，历史来源有清晰标记。
- [ ] 可以手工创建和从来源创建。
- [ ] 可以编辑、置顶、归档和恢复。
- [ ] PENDING 可以 LINK、CREATE、IGNORE，关闭 Dialog 不丢失。
- [ ] 合并有预览、字段确认和二次确认。
- [ ] mutation 防重复提交，409 会刷新。
- [ ] 不安装新 UI 库，不修改 `src/components/ui`。
- [ ] 不使用 `dangerouslySetInnerHTML`。
- [ ] 深色主题、键盘和 375px 窄屏可用。

## Files to Create/Modify

- `src/app/insights/page.tsx`
- `src/app/insights/error.tsx`（可选但推荐）
- `src/components/insights/InsightsLibraryClient.tsx`
- `src/components/insights/InsightCard.tsx`
- `src/components/insights/InsightEditorDialog.tsx`
- `src/components/insights/InsightOrganizerDialog.tsx`
- `src/components/insights/MergeInsightDialog.tsx`
- `src/types/insights.ts` — 如需补充 UI props。
- `src/lib/insights.ts` — 搜索/筛选/排序 helper。

## Verification

运行开发服务器，使用至少以下数据验证：

- 无来源的手工 Insight；
- 多周来源 Insight；
- 同周多个来源 Insight；
- historical source；
- PENDING、IGNORED、ARCHIVED；
- title/content/tags/sourceText 各自能被搜索；
- 375px 和桌面宽度。

然后运行：

```text
pnpm typecheck
pnpm build
```


---
## section-06-weekly-integration-and-backfill.md
---

# Section 06: Weekly Integration and Historical Backfill

## Background

经验库必须融入用户现有周报习惯，而不是成为额外维护入口。周报保存后自动同步来源，但整理保持可选。历史 24 份周报需要通过同一同步逻辑安全回填，预计产生约 86 条待整理来源。

本节连接顶层导航、周报列表、周报详情、保存响应、单周重试、整理 Dialog 和历史回填。月报和季报继续使用旧的整行匹配逻辑，不在本节修改。

## Requirements

- 顶层和周报页面能进入经验库；
- 周报详情显示本周待整理数量；
- 保存后报告同步结果但不强制整理；
- 同步失败不影响周报保存成功状态；
- 提供单周重试；
- keyLessons 可以明确清空；
- 历史回填先 dry-run，再确认执行；
- 回填重复运行不新增；
- 回填不修改原 keyLessons；
- 历史非周一 weekStart 正常；
- 月报、季报不回归。

## Dependencies

- Requires: section-01-database-foundation、section-02-core-types-and-text、section-03-server-services、section-04-api-routes、section-05-insights-interface
- Blocks: section-07-verification-and-release

## Implementation Details

### 1. 顶层导航

修改 `src/app/layout.tsx`，在“周报”后增加：

```tsx
<Link href="/insights">经验库</Link>
```

保持现有 className 和导航风格。导航容器已有横向滚动，手工验证窄屏仍可访问所有入口。

### 2. 周报列表入口

修改 `src/app/weekly/page.tsx`：

- 在现有服务器查询中增加 PENDING current 来源总数；
- 页头增加“经验库”按钮；
- pending > 0 时显示 Badge，例如“待整理 12”；
- 不为每个周卡分别查询，避免 N+1；
- 原周报列表、统计和链接保持不变。

若希望每周卡显示该周 pending 数，应一次 group/count 查询或一次加载所有 PENDING 后内存分组，不能循环发 Prisma 请求。MVP 只显示总数即可。

### 3. 周报详情服务器数据

修改 `src/app/weekly/[weekStart]/page.tsx`：

- 查询该周 `state=PENDING AND isCurrent=true` 数量；
- 把 `initialPendingInsightCount` 传给 `WeeklyReportClient`；
- 不把全部候选塞入已经很大的页面 props；
- 打开整理 Dialog 时再请求 `/api/insight-sources?state=PENDING&weekStart=...`。

查询使用实际 weekStart Date，不校验周一。

### 4. 修改 WeeklyReportClient props 和状态

在 `src/components/weekly/WeeklyReportClient.tsx`：

- Props 增加 `initialPendingInsightCount: number`；
- 本地 `pendingInsightCount` 以初始值开始；
- 增加 `insightSyncFailed` 状态；
- 增加 organizer Dialog open state；
- API mutation 后 refresh，并同步本地 count 或重新请求。

### 5. 修正 keyLessons 清空

当前保存 body 使用：

```ts
keyLessons: form.keyLessons || undefined
```

改为始终提交：

```ts
keyLessons: form.keyLessons
```

这允许用户清空经验。服务端按 section-04 规范为空值并同步空来源。

不要顺手改变其他周报字段语义，除非单独验证。若统一修改 summary/strengths 等清空行为，应作为明确额外改动记录。

### 6. 保存响应

更新响应类型以读取 `insightSync`。

#### 保存和同步成功

- 保留“已保存”状态；
- 更新 pendingCount；
- createdCount > 0 时 toast：`周报已保存，新增 N 条待整理经验`；
- 不自动打开 Dialog。

#### 保存成功、同步失败

- 显示周报“已保存”；
- warning/error toast：`周报已保存，但经验同步失败，可重试`；
- 设置 `insightSyncFailed=true`；
- 核心经验区域显示“重试同步”；
- 不回滚表单或报告整体保存失败。

#### 周报保存失败

- 保留现有保存失败 toast；
- 不显示同步状态；
- 不调用单周重试。

### 7. 核心经验区域操作

在“核心经验教训”输入区附近增加：

- `查看经验库` Link；
- `整理本周经验（N）` Button；
- 同步失败时 `重试同步` Button；
- 拆分提示保持“一行一条”。

整理按钮打开 `InsightOrganizerDialog`，按 weekStart 加载 PENDING。N=0 时可 disabled 或显示“本周已整理”。

### 8. 单周重试

调用：

```text
POST /api/weekly-reports/[weekStart]/insights
```

请求期间禁用按钮。成功后：

- 清除 syncFailed；
- 更新 pendingCount；
- toast 同步结果；
- refresh。

失败保持重试入口。网络错误与服务器错误使用不同文案不是必需，但错误应明确。

### 9. 经验库回填入口

在 `/insights` 空状态或次级区域增加历史导入组件，可放入 `InsightsLibraryClient` 或独立 `InsightBackfillDialog.tsx`。

显示条件建议：

- 数据库有非空 WeeklyReport；
- InsightSource 总数为 0，或用户从次级菜单主动打开。

避免每次进入页面都突出危险操作。

### 10. Dry-run

用户点击“预览导入”：

```text
POST /api/insights/backfill
{ "dryRun": true }
```

Dialog 显示：

- 扫描周报数；
- 非空周报数；
- 预计新增来源；
- 已存在来源；
- 跳过数；
- 失败周。

预期约 24 份非空周报和 86 条来源，但 UI 不硬编码。dry-run 结果为 0 新增时，正式按钮仍可禁用或提示“无需导入”。

### 11. 正式回填

用户确认后发送 `{ dryRun: false }`。确认文案：

> 系统会把历史周报核心经验导入为“待整理”来源，不会修改原周报内容。

执行期间：

- 按钮 disabled；
- 不允许重复提交；
- 请求可同步等待完成，当前数据不需要任务队列；
- 完成后显示 created/existing/failed；
- refresh 页面。

如果部分周失败，显示失败 weekStart 和“可再次执行；成功周不会重复”。不要显示内部堆栈。

### 12. 幂等验证

首次正式回填后：

1. 再运行 dry-run，预计新增 0；
2. 再运行正式回填，createdCount 必须 0；
3. InsightSource 总数不变；
4. unique 约束无冲突日志。

### 13. 旧数据核对

与 section-01 基线比较：

- WeeklyReport 总数；
- 非空 keyLessons 数；
- `weekStart + keyLessons` 摘要；
- 最早/最晚 weekStart。

全部保持不变。回填只创建 InsightSource，不创建规范化 Insight；所有新来源初始为 PENDING、isCurrent=true。

### 14. 非周一历史值

确认 `2026-03-08` 或实际存在的非周一记录：

- 能生成来源；
- `/weekly/2026-03-08` 链接可打开；
- 不被移动到相邻周；
- occurrenceCount 使用实际保存的 weekStart。

### 15. 月报和季报兼容

不修改：

- `src/app/monthly/[yearMonth]/page.tsx`
- `src/components/monthly/MonthlyReportClient.tsx`
- `src/app/quarterly/[yearQuarter]/page.tsx`
- `src/components/quarterly/QuarterlyReportClient.tsx`

手工打开现有月报/季报，确认旧完全匹配聚合仍工作。经验库与它们暂时口径不同是已接受的 MVP 决策。

## Acceptance Criteria

- [ ] 顶栏和周报列表能进入经验库。
- [ ] 周报列表显示 PENDING 总数且没有 N+1。
- [ ] 周报详情显示本周待整理数量。
- [ ] Organizer 打开时按周请求数据，不膨胀初始页面 payload。
- [ ] keyLessons 可以明确清空。
- [ ] 保存+同步成功显示新增和 pending 数量。
- [ ] 保存成功、同步失败仍显示周报已保存并提供重试。
- [ ] 保存失败不触发同步重试。
- [ ] 保存成功后不强制打开整理 Dialog。
- [ ] 单周重试成功更新状态和数量。
- [ ] 历史回填先 dry-run，再二次确认。
- [ ] 正式回填不修改 WeeklyReport/keyLessons。
- [ ] 回填重复运行新增 0。
- [ ] 非周一 weekStart 正常导入和跳转。
- [ ] 月报和季报页面无回归。

## Files to Create/Modify

- `src/app/layout.tsx` — 顶层经验库入口。
- `src/app/weekly/page.tsx` — 经验库按钮和 PENDING 总数。
- `src/app/weekly/[weekStart]/page.tsx` — 本周 PENDING 数。
- `src/components/weekly/WeeklyReportClient.tsx` — 保存同步结果、入口、重试和 Dialog。
- `src/components/insights/InsightOrganizerDialog.tsx` — 支持 weekStart 定向加载。
- `src/components/insights/InsightBackfillDialog.tsx`（如独立）— dry-run 和正式导入。
- `src/components/insights/InsightsLibraryClient.tsx` — 回填入口和刷新。

## Verification Commands

```text
pnpm test
pnpm typecheck
pnpm build
```

并执行两轮历史回填验证与旧周报摘要核对。


---
## section-07-verification-and-release.md
---

# Section 07: Verification and Release

## Background

经验库会修改 Prisma Schema、周报保存链路和真实历史数据。最终验收必须同时验证功能、幂等、数据不变性、错误行为和回滚能力。项目当前没有 E2E 框架，因此采用 Vitest 自动测试、API/页面手工矩阵和 SQLite 基线核对。

本节不添加新产品功能。它只关闭前六节留下的验证、文档和上线风险。

## Requirements

- 自动测试覆盖文本、同步差异、状态和合并核心逻辑；
- typecheck、可用 lint 和 build 通过；
- 手工验证全部主要页面操作；
- 验证周报保存与同步失败解耦；
- 验证历史回填幂等；
- 验证旧周报内容不变；
- 验证非周一历史日期；
- 验证深色主题、窄屏和基本无障碍；
- 验证数据库备份和回滚步骤；
- 记录已知限制和第二阶段事项。

## Dependencies

- Requires: section-01 至 section-06 全部完成
- Blocks: 无

## Implementation Details

### 1. 自动测试清单

运行 `pnpm test` 前确认测试至少覆盖：

#### 文本拆分

- CRLF、CR、LF；
- `1.`、`1、`、`1．`、`1)`、`1）`；
- `-`、`*`、`•`；
- 空行；
- 单段；
- 内部子编号不误拆；
- 同输入规范化去重；
- 顺序稳定。

#### 规范化与 hash

- NFKC；
- 英文大小写；
- 多空格；
- 列表前缀；
- 否定词和内部标点保留；
- 相同规范化文本 hash 相同；
- 不同语义文本 hash 不同；
- 空文本被拒绝。

#### 标签与候选

- 领域别名；
- 英文边界；
- tag 去重和稳定顺序；
- malformed tagsJson；
- 完全标题匹配；
- 标签交集；
- 无信号返回空；
- 最多 5；
- 同分 pin、lastSeen 和稳定最终排序。

#### 同步计划

- 首次创建；
- 未修改重复保存；
- 新增行；
- 修改 PENDING；
- 删除 PENDING；
- 删除 LINKED/IGNORED 后 isCurrent=false；
- 历史来源重新出现；
- 清空 keyLessons；
- 同周重复文本。

#### 状态和合并

- LINK 只接受 PENDING；
- IGNORE 只接受 PENDING；
- RESTORE 只接受 current IGNORED；
- UNLINK 只接受 current LINKED；
- stale 状态产生 Conflict；
- create+link 原子；
- merge 拒绝相同 ID；
- merge 迁移全部来源后删除源；
- merge 失败回滚；
- occurrenceCount 按不同周去重。

### 2. 静态检查

运行：

```text
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

如果 `pnpm lint` 因 Next.js 15 已不支持 `next lint` 而失败：

1. 记录这是既有脚本基础设施问题；
2. 使用项目 ESLint flat config 的可用 CLI 命令，例如 `pnpm exec eslint src`；
3. 分开记录基础设施失败和代码 lint 结果；
4. 不为了本功能大范围重构 lint 配置，除非修复很小且得到授权。

build 不得访问或修改真实数据。构建前确认没有回填 mutation 被页面预渲染触发。

### 3. API 手工矩阵

验证：

| Endpoint | Case | Expected |
| --- | --- | --- |
| POST /api/insights | malformed JSON | 400 |
| POST /api/insights | empty title | 400 |
| GET /api/insights/:id | missing | 404 |
| PUT /api/insights/:id | archive/restore | 200 |
| POST merge | same source/target | 409/400 |
| POST merge | valid | 200, source gone, target sources retained |
| PATCH source | stale state | 409 |
| PATCH source | LINK/IGNORE/RESTORE/UNLINK | correct state |
| POST weekly sync | invalid date | 400 |
| POST weekly sync | missing week | 404 |
| POST backfill | dryRun | no writes |
| POST backfill | repeat | created=0 |
| PUT weekly | save ok, sync fails | 200 + report saved + sync warning |
| PUT weekly | save fails | 500, no sync |

临时制造同步失败时不要破坏真实数据库。可以在测试环境 mock 服务抛错，或临时测试分支完成后恢复。不要手工损坏 Schema。

### 4. 页面手工矩阵

#### 经验库

- ACTIVE/PENDING/ARCHIVED；
- IGNORED 次级视图；
- 搜索 title；
- 搜索 content；
- 搜索 tag；
- 搜索 sourceText；
- tag filter；
- recent/frequent/updated；
- pin 始终优先；
- expand sources；
- historical marker；
- source 跳周报；
- 手工 create；
- 从来源 create；
- edit；
- pin/unpin；
- archive/restore；
- link；
- ignore/restore；
- unlink current；
- merge；
- 关闭 organizer 后 PENDING 保留；
- 409 后 toast + refresh；
- empty/search-empty states。

#### 周报

- 保存没有 keyLessons；
- 保存一条；
- 保存多条；
- 重复保存；
- 新增一行；
- 修改 PENDING 行；
- 删除 PENDING 行；
- 删除已 LINKED 行后 historical；
- 清空全部；
- 同步失败重试；
- 整理本周只加载本周来源；
- 不强制打开 organizer。

#### 兼容页面

- 周报列表；
- 典型周报详情；
- 历史非周一周报；
- 月报；
- 季报；
- 顶层导航。

### 5. 响应式和无障碍

至少在 375px 和桌面宽度验证：

- 顶栏可以横向访问经验库；
- 工具栏不溢出；
- 卡片操作可换行；
- Dialog 不超视口；
- 键盘可打开/关闭 Dialog；
- icon buttons 有 aria-label；
- 表单 Label 正确；
- 焦点返回触发按钮；
- 状态不仅依赖颜色；
- 深色主题对比度可读。

### 6. 历史回填验证

回填前保存 section-01 基线。执行：

1. dry-run；
2. 记录预计 reports/sources；
3. 正式回填；
4. 记录 created/existing/failed；
5. 再 dry-run；
6. 再正式回填；
7. 确认第二次 created=0；
8. 确认 InsightSource 总数稳定；
9. 确认全部新来源 PENDING、isCurrent=true；
10. 确认 WeeklyReport 数和 keyLessons 摘要未变。

实际预期约 24 份非空周报和 86 来源，但以运行结果为准。明显偏差时停止正式回填，检查拆分规则。

### 7. 数据一致性检查

使用 Prisma 只读查询验证：

- LINKED 且 insightId null = 0；
- PENDING/IGNORED 且 insightId 非 null = 0；
- 重复 `[weekStart, sourceHash]` = 0；
- dangling weeklyReport relation = 0；
- dangling insight relation = 0；
- occurrenceCount 与 distinct week 查询一致；
- ARCHIVED sources 仍可访问。

### 8. 备份恢复验证

至少确认：

- 备份文件存在且非 0；
- 备份创建时没有未处理 WAL 风险；
- 备份能在独立临时位置由 SQLite/Prisma 只读打开；
- WeeklyReport 基线在备份中可查询。

不要通过覆盖当前数据库来测试恢复。使用临时副本；验证后保留或安全移除临时测试副本，不能误删正式备份。

### 9. 上线顺序

1. 确认代码检查通过；
2. 停止本地写入；
3. 建立最终上线前备份；
4. 应用 `pnpm db:push`；
5. 启动应用；
6. 测试一份新周报同步；
7. 打开空经验库；
8. dry-run 历史回填；
9. 正式回填；
10. 重复运行验证；
11. 检查月报和季报。

### 10. 回滚

#### 代码 UI/API 问题

可回退经验库代码并保留新表；旧页面不会读取新表。禁止使用破坏性 git 命令覆盖用户修改。

#### 回填内容问题

旧 keyLessons 未修改。可以通过精确 Prisma 操作清空新模型数据，先删 InsightSource，再删 Insight。执行前必须确认只操作新表，并建立当前数据库额外备份。

#### Schema 问题

停止应用，保存失败副本，恢复上线前数据库备份，并恢复对应 Schema/Prisma Client。不要手工删除 SQLite 表。

### 11. 已知限制文档

在交付说明中记录：

- 候选是关键词推荐，不是语义判断；
- 来源快照不可直接编辑；
- 拆分错误需回周报调整换行；
- 月报/季报仍使用旧完全匹配口径；
- 没有每日执行验证；
- 当前全量客户端搜索适合小数据集；
- 最近高频主题属于第二阶段。

## Acceptance Criteria

- [ ] 自动测试覆盖核心文本、同步、状态和合并逻辑。
- [ ] `pnpm test` 通过。
- [ ] `pnpm typecheck` 通过。
- [ ] 可用 ESLint 检查通过；既有 lint 脚本问题单独记录。
- [ ] `pnpm build` 通过。
- [ ] API 状态码矩阵通过。
- [ ] 经验库和周报页面手工矩阵通过。
- [ ] 375px、桌面、键盘和深色主题通过。
- [ ] 历史回填两次执行后 created=0 且数量稳定。
- [ ] WeeklyReport/keyLessons 基线未变化。
- [ ] 非周一历史记录正常。
- [ ] 数据不变量查询全部为 0 异常。
- [ ] 备份可独立只读打开。
- [ ] 上线和回滚步骤已记录。
- [ ] 已知限制和第二阶段事项已交付。

## Files to Create/Modify

- `src/lib/insights.test.ts` — 补齐核心自动测试。
- 可选服务测试文件，例如 `src/lib/insights-server.test.ts`。
- `planning/insights/PROGRESS.md` — 实施时记录章节、命令和验收结果。
- 项目交付说明或 README（仅在用户要求时）— 已知限制和使用入口。

## Final Verification Commands

```text
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

如果 lint script 不可用，另外运行项目可用的 ESLint CLI，并在验收记录中保留两个结果。


## Execution Rules

1. Read the embedded section index and respect every dependency.
2. Before editing, inspect the current worktree and preserve unrelated changes.
3. For each section:
   - Create a TODO list.
   - Implement every requirement.
   - Run the tests and checks named in that section.
   - Verify every acceptance criterion.
   - Update `planning/insights/PROGRESS.md` with changes, commands, results, and remaining issues.
   - Continue only when the section is complete or explicitly document why it cannot be completed.
4. Treat the SQLite database as user data:
   - Verify exact paths before backup, restore, or deletion.
   - Never delete or overwrite the workspace, Prisma directory, or an unverified path.
   - Preserve `WeeklyReport.keyLessons`.
5. Do not implement second-stage features unless a section explicitly requires them.
6. Do not modify `src/components/ui`.
7. Do not add AI, vector search, or cloud services.
8. Keep weekly-report saving independent from insight-sync success.
9. Use the same production sync service for single-week sync and historical backfill.
10. Run final verification after all sections.

## On Completion

When ALL sections are implemented and verified:
- Update `planning/insights/PROGRESS.md` with final status and all verification results.
- Output `<promise>ALL-SECTIONS-COMPLETE</promise>`.

If blocked on a section after multiple attempts:
- Document the blocker and safe next action in `planning/insights/PROGRESS.md`.
- Output `<promise>BLOCKED</promise>`.
