# 核心经验库实施方案

## 1. 方案摘要

本方案为本地 Trading Journal 增加 `/insights` 经验库。系统继续使用 `WeeklyReport.keyLessons` 作为周报编辑入口，在周报保存成功后把每行经验同步为不可变来源快照。用户随后把来源归入已有经验、创建新经验或忽略。经验库负责搜索、标签筛选、来源回溯、编辑、置顶、归档和合并。

MVP 不验证经验是否执行，不使用 AI，不修改策略，不重构月报和季报。

实施分为七个阶段：

1. 数据备份和 Schema；
2. 纯文本与候选匹配逻辑；
3. 服务层和事务；
4. API；
5. 经验库页面；
6. 周报集成和历史回填；
7. 测试、验收和回滚验证。

## 2. 当前系统上下文

### 技术栈

- Next.js 15.2.3 App Router；
- React 19 + TypeScript strict；
- Prisma + SQLite；
- shadcn/ui + Tailwind CSS；
- pnpm；
- Sonner toast。

### 现有周报

`WeeklyReport` 使用唯一 `weekStart: DateTime`，核心经验保存在自由文本 `keyLessons`。API 为 `GET/PUT /api/weekly-reports/[weekStart]`，PUT 使用 Zod 校验和 Prisma upsert。

客户端 `WeeklyReportClient.tsx` 在 `handleSave` 中保存周报，成功后刷新页面。核心经验输入框已经提示“一行一条”。

数据库当前约有 24 份非空周报。按拟定拆分规则预计生成约 86 条来源。历史存在周日 `weekStart`，新功能不得强制周一。

### 当前重复经验算法

月报和季报只按换行后的完整小写文本匹配。MVP 暂时保留这一逻辑，第二阶段再切换到 Insight 归并结果。

## 3. 关键设计决策

### 3.1 两个数据概念

- `Insight`：用户维护的规范化经验；
- `InsightSource`：从周报同步的原始文字快照。

不把来源周 ID 存进 JSON 数组。关系表负责回溯、统计、合并和状态管理。

### 3.2 来源快照不可编辑

MVP 不在整理 Dialog 中直接编辑、拆分或合并来源。用户若发现拆分错误，回到周报调整换行后重新保存。

原因：来源身份由规范化文本 hash 决定。直接修改来源会与下次周报同步冲突，需要额外 origin 映射，超出轻量 MVP。

### 3.3 自动收集，人工归并

系统自动同步来源并推荐候选，但用户确认 LINK、CREATE 或 IGNORE。任何关键词相似都不得自动修改 `insightId`。

### 3.4 保存与同步解耦

周报保存成功后才同步经验。同步失败时接口仍报告周报保存成功，并返回可重试的同步错误。

### 3.5 派生统计

出现周数、来源数和最近出现都从来源计算，不写缓存列。数据量小，优先保证一致性。

### 3.6 客户端全量筛选

当前预计几十条 Insight 和约 86 个来源。服务端一次加载后在客户端搜索、筛选和排序，不引入分页、FTS 或外部搜索。

## 4. Phase 0：安全准备

### 4.1 检查工作区

实施前执行：

```text
git status --short
```

识别用户已有修改，避免覆盖无关文件。特别注意 `prisma/schema.prisma`、周报 API 和 `WeeklyReportClient.tsx` 是否已有未提交编辑。

### 4.2 备份数据库

在运行 `pnpm db:push` 前，把 `prisma/db.sqlite` 复制到明确的时间戳备份文件，例如：

```text
prisma/backups/db-before-insights-YYYYMMDD-HHmmss.sqlite
```

复制前确认源文件存在，目标位于 `prisma/backups`。如果开发服务器正在运行，应先停止写入或使用 SQLite 安全备份方式，避免仅复制主文件而遗漏 WAL 中尚未 checkpoint 的数据。

更安全的本项目流程：

1. 停止本地 Next.js 开发服务器；
2. 确认没有 Prisma Studio 写入；
3. 复制数据库文件；
4. 记录文件大小和时间；
5. 再执行 Schema push。

如果无法停止进程，必须同时考虑 `db.sqlite-wal`/`db.sqlite-shm`，不能把普通文件复制当作可靠在线备份。

### 4.3 基线数据

记录：

- WeeklyReport 总数；
- 非空 keyLessons 数；
- keyLessons 内容校验摘要；
- 数据库文件大小。

Schema 应用和历史回填后再次比较，确保旧周报未改变。

## 5. Phase 1：Prisma Schema

### 5.1 新增枚举

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
```

### 5.2 新增模型

```prisma
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

在 `WeeklyReport` 增加：

```prisma
insightSources InsightSource[]
```

### 5.3 删除策略

- 普通 API 不提供 DELETE Insight；
- 用户用 `status=ARCHIVED` 表达删除；
- `InsightSource.insight` 使用 `onDelete: Restrict`；
- 合并服务必须迁移来源后才能删除源 Insight；
- WeeklyReport 同样使用 Restrict，避免删除周报时静默丢失来源。项目当前没有周报删除 API，因此不会阻塞现有流程。

### 5.4 应用 Schema

运行：

```text
pnpm db:push
```

随后确认：

- Prisma Client 成功生成；
- 新表和索引存在；
- 旧 WeeklyReport 数量和内容不变；
- 应用能启动。

### 5.5 回滚

如果 db:push 或启动失败：

1. 停止应用；
2. 保存失败数据库副本用于诊断；
3. 恢复备份数据库；
4. 恢复 Schema 修改；
5. 重新生成 Prisma Client。

不要使用 `git reset --hard` 或删除整个 Prisma 目录。

## 6. Phase 2：类型与纯函数

### 6.1 新增 `src/types/insights.ts`

定义序列化 DTO，不把 Prisma Date 直接传给客户端：

```ts
type InsightStatusDto = "ACTIVE" | "ARCHIVED"
type InsightSourceStateDto = "PENDING" | "LINKED" | "IGNORED"

interface InsightSourceDto {
  id: string
  weekStart: string
  sourceText: string
  sortOrder: number
  state: InsightSourceStateDto
  isCurrent: boolean
  insightId: string | null
}

interface InsightDto {
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

- `PendingInsightSourceDto`，包含 `candidates: InsightCandidateDto[]`；
- 页面初始数据 DTO；
- API action body 类型；
- 同步和回填结果 DTO。

避免把这些类型继续加入已经较大的 `src/types/index.ts`。

### 6.2 新增 `src/lib/insights.ts`

该文件只包含无数据库依赖的函数。

#### `splitWeeklyLessons(raw)`

处理：

- CRLF/CR；
- 空行；
- 行首编号 `1.`、`1、`、`1．`、`1)`、`1）`；
- 行首 `-`、`*`、`•`；
- 首尾空白；
- 同一输入内规范化去重；
- 保留原顺序。

不要按句号或所有内嵌编号拆分。以下应保持一条：

```text
强趋势条件：1）有 Gap；2）有消息；3）开盘后持续接受。
```

#### `normalizeInsightText(text)`

顺序固定：

1. NFKC；
2. 移除行首列表标记；
3. trim；
4. 折叠空白；
5. 英文 lowercase。

内部标点和否定词保留。

#### `hashInsightText(normalized)`

使用 `node:crypto` SHA-256，输出稳定小写 hex。函数接收规范化文本，避免调用方顺序不一致。

#### 标签

建立显式词典：规范标签对应多个匹配词，例如：

- `Level`: level、pmh、pml、pdh、pdl、onh、onl；
- `K线`: k线、candle、chart；
- `15M`: 15m、15分钟；
- `VWAP`: vwap；
- `Gap`: gap、跳空；
- `入场`: 入场、进入、entry；
- `退出`: 退出、止盈、止损、exit；
- `趋势`: 趋势、trend；
- `震荡`: 震荡、range、chop；
- `新闻`: 新闻、消息、数据、财报、fomc、cpi、ppi；
- `纪律`: 纪律、手机、犹豫、果断、耐心。

匹配应避免明显的子串误报；英文使用单词或预期缩写边界，中文按词匹配。

`normalizeTags(tags)`：trim、去空、大小写/别名统一、去重并保持稳定顺序。`parseTagsJson` 捕获 JSON 错误，并过滤非字符串元素。

#### 候选排序

输入为原始来源和 ACTIVE Insight 的轻量候选数据。建议分数：

- normalized title 完全相同：100；
- 每个标签交集：20；
- 标题关键词命中：10；
- content 关键词命中：3；
- isPinned：仅同分时优先；
- lastSeen：仅同分时最近优先。

分数常量集中声明并测试。有效相似信号为零时不返回候选。最多 5 条。

#### 列表筛选

把搜索、tag 过滤和排序做成纯函数，便于单测。搜索串规范化后匹配 title、content、tags 和 sourceText。

### 6.3 测试基础设施

安装 Vitest 作为 devDependency，不引入 DOM 测试库：

```text
pnpm add -D vitest
```

在 package.json 增加：

```json
"test": "vitest run",
"test:watch": "vitest"
```

新增 `src/lib/insights.test.ts`，覆盖实际历史格式和边界情况。

## 7. Phase 3：服务层

新增 `src/lib/insights-server.ts`。该文件只在服务端导入，集中 Prisma 查询、DTO 映射和事务。

### 7.1 日期 helper

复用 `src/lib/kpi.ts` 的 `parseUtcTradingDate` 和 `toDateString`，或将通用日期函数提取到更合适文件并更新现有导入。不要复制多个略有差异的 `parseWeekStart`。

如果为了控制范围选择复用 KPI helper，应在代码注释中说明它是通用 UTC 业务日期函数，后续再重命名。

### 7.2 `syncWeeklyLessons`

签名：

```ts
async function syncWeeklyLessons(
  weekStart: Date,
  keyLessons: string | null | undefined,
): Promise<InsightSyncResult>
```

事务内先拆分当前条目并建立 `Map<sourceHash, parsedItem>`，再查询该周来源。

伪代码：

```text
current = split + normalize + hash + dedupe
existing = findMany({ weekStart })

for item in current:
  if existing hash:
    if state == PENDING:
      update sourceText, normalizedText, sortOrder, isCurrent=true
    else:
      update isCurrent=true only
  else:
    create PENDING, isCurrent=true

for source in existing not present in current:
  if source.state == PENDING:
    delete source
  else:
    update isCurrent=false
```

注意：多个 `await` 顺序更新对 86 条数据可以接受。也可以通过 createMany/updateMany 优化，但不得牺牲清晰的状态分支。

返回：

```ts
interface InsightSyncResult {
  success: true
  createdCount: number
  existingCount: number
  pendingCount: number
  removedPendingCount: number
  historicalCount: number
}
```

同步异常由调用方转换为 `{ success: false, error }`，服务函数本身应抛出错误以保证事务回滚。

### 7.3 查询和 DTO 映射

`getInsightsLibraryData()`：

- 查询 Insight 及其来源；
- 查询 PENDING 来源；
- 可选查询 IGNORED；
- 只用 ACTIVE Insight 生成候选；
- tagsJson 安全解析；
- 只统计 LINKED 来源；
- `occurrenceCount` 用不同日期字符串 Set；
- `lastSeen` 取最大 weekStart；
- 来源按 weekStart、sortOrder 倒序/正序组合；
- Date 转成字符串 DTO。

对于 `isCurrent=false` 的历史来源：

- 仍计入历史来源与 occurrenceCount；
- UI 显示“周报已修改”标记；
- 候选和待整理列表不包含历史 PENDING，因为 PENDING 不存在时会被删除。

### 7.4 状态操作

实现：

- `linkSource(sourceId, insightId)`；
- `createInsightFromSource(sourceId, input)`；
- `ignoreSource(sourceId)`；
- `restoreSource(sourceId)`；
- `unlinkSource(sourceId)`；
- `createInsight(input)`；
- `updateInsight(id, input)`；
- `mergeInsights(sourceId, targetId, resolvedFields)`。

所有来源状态修改使用条件 `updateMany`：

```text
where: { id, state: expectedState }
```

更新数不是 1 时抛出可识别的 ConflictError，由 Route Handler 映射为 409。

LINK 目标必须 ACTIVE。UNLINK 把 LINKED 变成 PENDING 并清空 insightId。归档包含来源的 Insight 是允许的，但这些来源不进入候选；卡片仍可在归档视图查看。

### 7.5 合并事务

交互式事务步骤：

1. 拒绝相同 ID；
2. 读取 source 和 target；
3. 任一不存在抛 NotFoundError；
4. 规范化用户确认的标题、说明和标签；
5. 更新 target；
6. 把 source 的来源全部改为 target；
7. count source remaining sources；
8. 仍有来源则抛错；
9. 删除 source；
10. 查询并返回完整 target DTO。

迁移 insightId 不违反 `[weekStart, sourceHash]` 唯一约束。统计层按不同周去重。

### 7.6 回填

`backfillWeeklyInsights({ dryRun })`：

- 查询所有 `keyLessons` 非空周报；
- dry-run 只调用拆分纯函数并与现有 hash 比较，不写入；
- 正式模式逐周调用相同同步算法；
- 单周失败记录错误，其他周是否继续需要明确：建议继续扫描并返回 failedWeeks，便于重试；
- 回填结束返回汇总；
- 由于每周事务独立，失败不会破坏成功周；
- 不修改 keyLessons。

如果要求全量原子性，可以把全部回填放进一个长事务，但本地 SQLite 下没有必要；逐周事务更易恢复。

## 8. Phase 4：API

所有 Route Handler 使用 Zod `safeParse`、一致响应和 route 前缀日志。

### 8.1 `GET /api/insights`

可选 query：

- `status=ACTIVE|ARCHIVED`；
- `q`；
- `tag`；
- `sort=recent|frequent|updated`。

MVP 页面可直接使用服务端页面数据，但保留此 GET 支持 Dialog 刷新和未来复用。服务端过滤与客户端过滤应复用相同纯函数或明确口径，避免结果不一致。

### 8.2 `POST /api/insights`

Body：

```ts
{
  title: string
  content?: string | null
  tags?: string[]
  isPinned?: boolean
  sourceId?: string
}
```

有 sourceId 时事务内创建并 LINK；无 sourceId 时手工创建。

### 8.3 `GET/PUT /api/insights/[id]`

GET 返回详情 DTO。PUT body 允许：

- title；
- content；
- tags；
- isPinned；
- status。

至少一个字段存在。title 如果提供，trim 后必须非空。ID 不存在返回 404。

### 8.4 `POST /api/insights/[id]/merge`

路径 id 为 source。Body：

```ts
{
  targetInsightId: string
  title: string
  content?: string | null
  tags: string[]
}
```

返回合并后的目标 DTO。相同 ID 或状态冲突返回 409/400，缺失返回 404。

### 8.5 `GET /api/insight-sources`

Query：

- `state`；
- `weekStart`；
- `includeHistorical=false` 默认值。

PENDING DTO 携带最多 5 条候选。

### 8.6 `PATCH /api/insight-sources/[id]`

Zod discriminated union：

```ts
{ action: "LINK", insightId: string }
{ action: "IGNORE" }
{ action: "RESTORE" }
{ action: "UNLINK" }
```

成功返回更新后的 Source DTO 或受影响 Insight DTO。状态已变化返回 409，客户端刷新数据并提示“记录已更新，请重试”。

### 8.7 `POST /api/weekly-reports/[weekStart]/insights`

解析日期后查询周报；不存在返回 404。调用 `syncWeeklyLessons` 并返回同步结果，用于保存失败后的手工重试。

不强制日期是周一。

### 8.8 `POST /api/insights/backfill`

Body `{ dryRun: boolean }`。这是 localhost 个人系统内部操作，不需要新增认证。UI 只在经验库空状态或设置入口显示，避免误触。

正式执行前 Dialog 先调用 dry-run，展示预计周报数和来源数，再二次确认。

### 8.9 修改周报 PUT

周报 upsert 完成后调用同步：

```text
try save report
if save fails -> 500, no sync
try sync
if sync succeeds -> 200 success + insightSync.success=true
if sync fails -> log error; 200 success + insightSync.success=false
```

不能把 report upsert 和 sync 放进同一个事务，因为产品明确要求同步失败不回滚周报保存。

处理 `keyLessons` 未包含在 PATCH/PUT body 的情况：当前 PUT 总是提交完整 form，但 API 应区分“字段未提供”和“明确清空”。只有 UpdateSchema 中实际存在 `keyLessons` 时才触发同步；明确空字符串/undefined 的语义需统一。建议客户端提交 `keyLessons: form.keyLessons`，允许空字符串清空并同步删除 PENDING、历史化已处理来源。不要用 `form.keyLessons || undefined`，否则用户无法清空。

这项修改同样适用于其他可清空周报文本字段时需谨慎；MVP 至少修正 keyLessons。

## 9. Phase 5：经验库页面

### 9.1 `src/app/insights/page.tsx`

- `export const dynamic = "force-dynamic"`；
- 调 `getInsightsLibraryData()`；
- 渲染页面标题、说明和 `InsightsLibraryClient`；
- 服务端异常显示明确错误边界或让 Next.js error page 处理；
- 不在页面组件内复制聚合逻辑。

### 9.2 `InsightsLibraryClient.tsx`

状态：

- currentView：active/pending/archived；
- query；
- selectedTag；
- sort；
- Dialog open state；
- mutation loading state。

数据 mutation 成功后 `router.refresh()`。为避免服务器刷新前出现重复提交，按钮在请求期间 disabled。

页面结构：

1. 标题、总经验数、待整理 badge、新建按钮；
2. Tabs；
3. 搜索、标签 Select、排序 Select；
4. 经验卡片或待整理来源列表；
5. 空状态；
6. Dialog。

### 9.3 `InsightCard.tsx`

显示：

- pin 图标；
- title；
- content 摘要；
- tag Badge；
- “出现 N 周”；
- “最近 YYYY-MM-DD”；
- 编辑、合并、归档/恢复；
- `<details>` 展开来源。

来源中：

- weekStart 链接 `/weekly/${weekStart}`；
- sourceText 使用 `whitespace-pre-wrap`；
- `isCurrent=false` 显示“周报已修改，保留历史快照”；
- 可选提供“移回待整理”操作。

### 9.4 `InsightEditorDialog.tsx`

创建和编辑共用：

- title 必填；
- content 可选；
- 标签使用简单可编辑输入或固定候选按钮；
- isPinned；
- 从来源创建时显示来源原文，保存后自动关联；
- 禁止提交期间重复点击。

避免为了标签输入引入第三方组件。可以使用逗号分隔输入配合推荐 Badge。

### 9.5 `InsightOrganizerDialog.tsx`

使用现有 Dialog + ScrollArea，宽度约 `sm:max-w-3xl`，高度不超过视口。

每次聚焦一条 PENDING：

- 原文；
- 自动标签；
- 候选卡片；
- 搜索所有 ACTIVE Insight；
- LINK；
- CREATE；
- IGNORE；
- 显示剩余数量。

关闭 Dialog 不修改剩余 PENDING。

如果拆分不正确，显示固定说明：“请回到周报按一行一条调整核心经验并重新保存。”

### 9.6 `MergeInsightDialog.tsx`

- 排除当前 Insight；
- 搜索目标；
- 预览双方 title/content/tags/source count；
- 默认 target title/content；
- tags 默认并集；
- 用户确认最终字段；
- 显示不可逆提示：源经验记录会删除，但全部来源保留；
- 合并成功关闭并刷新。

虽然操作删除空源记录，但它属于明确合并语义，Dialog 必须二次确认。

### 9.7 已忽略来源

MVP 不占主 Tab。可在 PENDING 视图旁提供“查看已忽略”次级按钮或筛选，允许 RESTORE。避免误操作永久隐藏。

### 9.8 空状态与回填

如果 InsightSource 为空但存在非空 WeeklyReport，显示：

- “尚未导入历史周报经验”；
- “预览导入”按钮；
- dry-run 结果；
- 确认导入；
- 完成统计。

回填入口仅在必要时突出；完成后放到次级菜单或隐藏。

## 10. Phase 6：周报和导航集成

### 10.1 顶层导航

修改 `src/app/layout.tsx`，在周报后加入：

```text
经验库 -> /insights
```

现有导航支持横向滚动。手工验证 375px 宽度不会遮挡品牌或阻止访问。

### 10.2 周报列表

`src/app/weekly/page.tsx` 并行查询 PENDING 总数，页头增加经验库按钮和待整理 Badge。不要为每个周卡单独发查询，避免 N+1。

### 10.3 周报详情服务端

`src/app/weekly/[weekStart]/page.tsx` 查询该周 PENDING 来源数量。把数量传给 `WeeklyReportClient`。

如果要在 Dialog 中直接整理该周来源，可以同时传入轻量 PENDING DTO 或在打开时调用 API。推荐打开时请求，避免让已经很大的周报组件初始 payload 继续膨胀。

### 10.4 WeeklyReportClient

修改保存响应类型，读取 `insightSync`：

- sync 成功且 createdCount > 0：toast“周报已保存，新增 N 条待整理经验”；
- sync 成功无新增：沿用保存状态；
- sync 失败：warning toast，显示重试按钮；
- 保存失败：沿用现有 error toast。

核心经验区增加：

- 待整理数量；
- “整理本周经验”；
- “查看经验库”；
- 必要时“重试同步”。

不强制打开 Dialog。

### 10.5 清空语义

客户端必须提交 `keyLessons: form.keyLessons`，而不是 `form.keyLessons || undefined`。否则清空输入不会更新数据库，也无法同步删除 PENDING 来源。

服务端应把空字符串统一存为 `null` 或空字符串。建议规范为 `null`，但这会涉及当前 UpdateSchema transform。实施时选择一种并写测试，确保：

- 清空后数据库与 UI 一致；
- PENDING 来源删除；
- LINKED/IGNORED 来源变为 `isCurrent=false`。

## 11. Phase 7：历史回填

### 11.1 Dry-run

经验库空状态发起 `{ dryRun: true }`：

- 报告扫描周报数；
- 非空周报数；
- 预计新增来源；
- 已存在来源；
- 解析为空数量；
- 预计失败周。

基线预期约 24 份非空周报和 86 条来源，但 UI 不硬编码这个数字。

### 11.2 正式回填

用户确认后执行 `{ dryRun: false }`。页面显示进度状态，API 完成后刷新。

由于数据少，可以同步请求完成，不需要任务队列。

### 11.3 验证幂等

正式回填完成后再次 dry-run：预计新增数为 0。再次正式调用也必须新增 0。

### 11.4 核对旧数据

比较 Phase 0 基线：

- WeeklyReport 总数不变；
- keyLessons 非空数不变；
- keyLessons 校验摘要不变；
- 每个 Source 都能跳回存在的周报。

## 12. API 和安全细节

### 输入限制

这是本地个人系统，但仍限制异常输入：

- title：1–300 字符；
- content：可设合理上限，如 10,000；
- 每个 tag：1–50；
- tag 数量：最多 20；
- q：最多 200；
- ID 必须非空；
- weekStart 严格 `YYYY-MM-DD`。

具体上限写入 Zod 常量，前后端共享或至少保持一致。

### 输出

- React 默认转义文本，不使用 `dangerouslySetInnerHTML` 展示经验；
- sourceText 使用普通文本；
- API 不返回 Error stack；
- tagsJson 解析失败时记录日志或数据诊断，不让页面崩溃。

### 并发

- mutation 按钮 loading disabled；
- 服务端状态守卫；
- 合并事务；
- 409 后刷新；
- SQLite 写锁错误记录并允许重试。

## 13. 测试计划

### 13.1 纯函数测试

至少覆盖：

1. 中文和英文编号；
2. 空行与 CRLF；
3. 单段无编号；
4. 内部子编号不误拆；
5. NFKC 和大小写；
6. 多空格；
7. hash 稳定；
8. 同一输入去重；
9. tag 别名和去重；
10. malformed tagsJson；
11. 完全匹配、标签匹配和无候选；
12. 搜索 sourceText；
13. 三种排序；
14. distinct week 统计。

测试用例应从实际 24 周格式中抽取匿名或最小化示例。

### 13.2 服务测试

如果不引入真实测试数据库，可通过 mock Prisma transaction client 测试分支：

- 未修改重复保存；
- 添加行；
- 修改 PENDING；
- 删除 PENDING；
- 删除 LINKED/IGNORED 后 historical；
- 历史句重新出现；
- LINK/IGNORE/RESTORE/UNLINK 状态冲突；
- CREATE + LINK 原子性；
- merge 顺序和回滚。

实施者应评估 mock 成本。如果服务强耦合 Prisma 导致测试脆弱，可以先把同步差异计算提取为纯函数，再让服务只执行返回的操作计划。

### 13.3 Route 测试或最小手工矩阵

当前没有 Next Route 测试基础设施。至少验证：

- malformed JSON -> 400；
- invalid date -> 400；
- missing resource -> 404；
- stale state -> 409；
- unexpected -> 500；
- 周报保存成功、同步失败 -> 200 + sync warning。

若 route 自动化需要大幅增加配置，可记录为手工 API 验收，但核心服务逻辑必须自动测试。

### 13.4 页面手工验收

- ACTIVE/PENDING/ARCHIVED/IGNORED；
- title/content/sourceText 搜索；
- tag filter；
- recent/frequent/updated；
- expand sources；
- source weekly link；
- create/edit/pin/archive/restore；
- organize；
- merge；
- close dialog with remaining PENDING；
- dark theme；
- narrow screen；
- loading/disabled/error toast。

### 13.5 最终命令

```text
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm db:push` 在 Schema 阶段已经执行；最终再次确认 Schema 与数据库同步。

注意：项目的 `next lint` 脚本可能与实际 Next.js 15 工具行为不一致。如果 lint 命令本身失效，应单独记录基础设施问题，不要把它误判为经验库代码错误；仍需运行 ESLint CLI 或项目当前可用检查。

## 14. 文件清单

### 新增

- `src/types/insights.ts`
- `src/lib/insights.ts`
- `src/lib/insights-server.ts`
- `src/lib/insights.test.ts`
- `src/app/insights/page.tsx`
- `src/components/insights/InsightsLibraryClient.tsx`
- `src/components/insights/InsightCard.tsx`
- `src/components/insights/InsightEditorDialog.tsx`
- `src/components/insights/InsightOrganizerDialog.tsx`
- `src/components/insights/MergeInsightDialog.tsx`
- `src/app/api/insights/route.ts`
- `src/app/api/insights/[id]/route.ts`
- `src/app/api/insights/[id]/merge/route.ts`
- `src/app/api/insight-sources/route.ts`
- `src/app/api/insight-sources/[id]/route.ts`
- `src/app/api/weekly-reports/[weekStart]/insights/route.ts`
- `src/app/api/insights/backfill/route.ts`

### 修改

- `prisma/schema.prisma`
- `src/app/api/weekly-reports/[weekStart]/route.ts`
- `src/components/weekly/WeeklyReportClient.tsx`
- `src/app/weekly/[weekStart]/page.tsx`
- `src/app/weekly/page.tsx`
- `src/app/layout.tsx`
- `package.json`
- `pnpm-lock.yaml`

### 第二阶段

- `src/app/monthly/[yearMonth]/page.tsx`
- `src/components/monthly/MonthlyReportClient.tsx`
- `src/app/quarterly/[yearQuarter]/page.tsx`
- `src/components/quarterly/QuarterlyReportClient.tsx`

## 15. 实施顺序与依赖

1. **安全与 Schema**：所有后续工作的基础；
2. **纯函数和类型**：无数据库依赖，可独立验证；
3. **服务层**：依赖 Schema 和纯函数；
4. **API**：依赖服务层；
5. **经验库 UI**：依赖 DTO 和 API，可在 API 稳定后完成；
6. **周报集成**：依赖同步 API 和 Dialog；
7. **历史回填**：依赖同步稳定；
8. **最终验证**：依赖全部阶段。

并行建议：

- Schema 完成后，纯函数与 UI 静态骨架可并行；
- 服务层完成后，API 与基于 mock DTO 的 UI 可并行；
- 周报集成和回填 UI 在 API 稳定后进行。

## 16. 上线与回滚

### 上线顺序

1. 停止写入并备份 SQLite；
2. 应用 Schema；
3. 部署代码但暂不回填；
4. 验证新周报同步和经验库空状态；
5. 执行历史 dry-run；
6. 正式回填；
7. 验证重复运行；
8. 验证旧周报、月报、季报仍正常。

### 代码回滚

若 UI/API 有问题但 Schema 正常，可以回退代码并保留新表。旧功能不会读取新表。

### 数据回滚

如果回填结果不满意，可以删除新表中的 InsightSource/Insight 数据，因为旧 `keyLessons` 未修改。但删除前必须确认目标仅是新模型数据，并使用精确 Prisma 操作或受控脚本，不能删除数据库文件。

如果 Schema 本身需要撤销，停止应用并恢复上线前数据库备份，避免手工改 SQLite 表。

## 17. MVP 完成定义

- 新模型和索引已应用，旧周报完整；
- 文本拆分、规范化、hash、标签和候选有自动测试；
- 周报保存后自动同步且失败不回滚周报；
- 同步重复保存幂等；
- `/insights` 支持查看、搜索、标签、排序和来源回溯；
- PENDING 可以 LINK、CREATE、IGNORE 和稍后处理；
- IGNORE 可以恢复；
- Insight 可以编辑、置顶、归档、恢复和合并；
- 合并保留全部来源并正确按周去重；
- 历史回填支持 dry-run、正式执行和幂等重试；
- 非周一历史 weekStart 正常；
- 月报和季报不回归；
- 测试、类型检查、可用 lint 和 build 通过；
- 手工验收记录完成。

## 18. 后续阶段

MVP 稳定后再做：

1. 月报和季报按 Insight 聚合；
2. 最近 8–12 周高频主题；
3. 未整理数量进入月报/季报；
4. 根据真实使用决定是否建立来源 origin 映射；
5. 数据量明显增长后再评估分页或 SQLite FTS。
