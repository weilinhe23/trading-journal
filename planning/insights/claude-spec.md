# 核心经验库综合规格

## 1. 产品目标

为交易日志增加一个本地“经验库”，集中展示和整理每周周报中的核心经验。系统在周报保存后自动收集原始经验，通过确定性关键词规则推荐相似的规范化经验，由用户确认归并。

功能解决两个问题：

1. 用户可以快速搜索“这类情况以前总结过什么”；
2. 新周报经验不会持续变成孤立文本。

本功能是归档和检索工具，不是交易规则验证系统。

## 2. 明确不做

- 每日经验执行记录；
- 遵守率、行为实验和经验有效性评分；
- 经验与 PnL、R、MAE、MFE 的验证关联；
- 盘中提醒；
- AI、向量搜索和自动语义合并；
- 自动修改策略；
- 强制用户保存周报后立即整理；
- MVP 内改造月报和季报聚合口径；
- MVP 内直接编辑、拆分或合并原始来源快照。

## 3. 用户体验

### 3.1 周报保存

1. 用户照常在 `WeeklyReport.keyLessons` 中按“一行一条”填写核心经验；
2. 用户点击保存；
3. 系统先保存周报；
4. 系统再同步原始经验来源；
5. 同步成功时，页面显示新增和待整理数量；
6. 同步失败时，周报仍显示保存成功，同时显示“经验同步失败，可重试”；
7. 页面提供“整理本周经验”入口，但不强制打开。

### 3.2 整理来源

待整理来源显示原始文字、提取标签和最多 5 条候选。用户可以：

- 归入已有经验；
- 创建新经验并自动关联；
- 明确忽略；
- 关闭界面，稍后继续。

如果拆分结果不正确，用户回到周报调整换行后重新保存。来源快照本身不可编辑。

### 3.3 查看经验

`/insights` 页面提供：

- 全部经验；
- 待整理来源；
- 已归档经验；
- 次级的已忽略来源入口；
- 搜索；
- 标签筛选；
- 按最近出现、出现最多、最近编辑排序；
- 手工新建经验。

每张经验卡显示标题、说明摘要、标签、不同来源周数、最近出现、置顶状态。展开后显示来源周和原文，并能跳回 `/weekly/[weekStart]`。

用户可以编辑、置顶、归档、恢复和合并经验。

## 4. 数据模型

### 4.1 枚举

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

### 4.2 Insight

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
```

### 4.3 InsightSource

```prisma
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

`WeeklyReport` 增加 `insightSources InsightSource[]`。

### 4.4 数据不变量

- LINKED 必须有 `insightId`；
- PENDING 和 IGNORED 必须没有 `insightId`；
- 普通用户操作不硬删除 Insight，只归档；
- 删除关系使用 Restrict；
- 合并事务迁移全部来源后才删除空的旧 Insight；
- 出现次数按不同 `weekStart` 计算；
- `occurrenceCount`、`sourceCount`、`lastSeen` 不存列；
- 标签写入前规范化为去重、trim 后的 JSON 字符串数组；
- 标签 JSON 解析失败时读取为空数组，但不得覆盖损坏原值，除非用户明确保存编辑。

## 5. 日期规则

- `weekStart` 仍表示 UTC 00:00 的业务日期；
- API 路径格式保持 `YYYY-MM-DD`；
- 复用 `parseUtcTradingDate` 和 `toDateString`，或提取等价通用 helper；
- 不使用浏览器本地时区推导来源周；
- 不强制 `weekStart` 为周一，因为历史数据中存在周日值。

## 6. 文本处理

`src/lib/insights.ts` 提供纯函数：

- `splitWeeklyLessons`；
- `normalizeInsightText`；
- `hashInsightText`；
- `extractInsightTags`；
- `rankInsightCandidates`；
- `parseTagsJson`；
- `normalizeTags`；
- 经验列表搜索、筛选和排序所需的纯函数。

### 6.1 拆分

1. 统一换行；
2. 按非空行拆分；
3. 去掉行首数字编号、破折号、星号或项目符号；
4. trim；
5. 不按句号拆分；
6. 同一周相同规范化文本只保留第一次，并保留顺序。

### 6.2 规范化和哈希

- Unicode NFKC；
- 英文小写；
- 折叠连续空白；
- 去掉列表前缀；
- 保留内部标点和否定词；
- 使用 SHA-256 计算 `sourceHash`。

### 6.3 标签和候选

初始词典覆盖 Level、K 线周期、VWAP、Gap、PMH/PML、PDH/PDL、入场、退出、趋势、震荡、新闻、耐心和纪律等领域词。

候选分数规则集中在纯函数：

1. 完全规范化相同最高；
2. 标签交集和标题命中权重较高；
3. 说明命中权重较低；
4. 置顶、最近出现只用于平分；
5. 无有效交集时返回空候选；
6. 最多返回 5 条；
7. 不自动执行归并。

## 7. 幂等同步

`src/lib/insights-server.ts` 实现 `syncWeeklyLessons(weekStart, keyLessons)`。周报 PUT、重试接口和回填接口必须共用该函数。

事务算法：

1. 拆分当前文本，规范化、去重并计算 hash；
2. 查询该周全部来源；
3. 当前 hash 已存在：
   - 设置 `isCurrent=true`；
   - PENDING 更新原文、规范化文本和顺序；
   - LINKED/IGNORED 不覆盖原始快照；
4. 当前 hash 不存在：创建 PENDING；
5. 旧 hash 本次不存在：
   - PENDING 删除；
   - LINKED/IGNORED 设为 `isCurrent=false`；
6. 返回同步统计。

重复保存必须保持记录数不变。重新出现的历史 hash 恢复为 `isCurrent=true`。

## 8. 服务操作

### 8.1 创建经验

- 手工创建可以没有来源；
- 从来源创建必须在一个事务中创建 Insight，并把来源改为 LINKED；
- 来源状态守卫失败返回 409。

### 8.2 关联已有经验

- 只允许 PENDING 或由 RESTORE 变回 PENDING 的来源关联；
- 目标 Insight 必须存在且为 ACTIVE；
- 使用带当前状态条件的 `updateMany`；
- 更新数不是 1 时返回 409。

### 8.3 忽略与恢复

- IGNORE：PENDING → IGNORED，`insightId=null`；
- RESTORE：IGNORED → PENDING；
- LINKED 来源若要改归属，使用明确的 relink 操作或先解除关联，不复用 RESTORE；
- MVP 可以只支持从经验详情把单个 LINKED 来源移回 PENDING。

### 8.4 编辑和归档

- 编辑 title、content、tags、isPinned、status；
- title trim 后不能为空；
- 归档不影响来源；
- 已归档经验不进入候选推荐；
- 恢复后重新进入候选推荐。

### 8.5 合并

`POST /api/insights/[sourceId]/merge`：

1. sourceId 与 targetInsightId 必须不同；
2. 两条 Insight 必须存在；
3. 用户确认目标标题、说明和标签；
4. 事务内更新目标；
5. 迁移源 Insight 的全部来源；
6. 确认源 Insight 已无来源；
7. 删除源 Insight；
8. 返回完整目标 DTO；
9. 任一步失败整体回滚。

## 9. API

### 9.1 Insight

- `GET /api/insights?status=&q=&tag=&sort=`
- `POST /api/insights`
- `GET /api/insights/[id]`
- `PUT /api/insights/[id]`
- `POST /api/insights/[id]/merge`

### 9.2 来源

- `GET /api/insight-sources?state=&weekStart=&includeHistorical=`
- `PATCH /api/insight-sources/[id]`

PATCH body 使用 discriminated union：

```ts
{ action: "LINK", insightId: string }
{ action: "IGNORE" }
{ action: "RESTORE" }
{ action: "UNLINK" }
```

### 9.3 同步和回填

- `POST /api/weekly-reports/[weekStart]/insights`：重试单周同步；
- `POST /api/insights/backfill`：历史 dry-run 或正式回填。

回填 body：

```ts
{ dryRun: boolean }
```

回填响应至少包含扫描周报数、非空周报数、预计或新增来源数、已存在数、跳过数和失败数。

### 9.4 响应和错误

- 成功：`{ success: true, data, ...metadata }`；
- 校验错误：400；
- 不存在：404；
- 状态冲突或并发覆盖：409；
- 未知错误：500；
- 所有写接口使用 Zod `safeParse`；
- JSON 解析错误返回 400；
- 日志包含具体 route 前缀，但响应不泄露堆栈。

## 10. 页面和组件

### 10.1 服务端页面

`src/app/insights/page.tsx`：

- 强制动态数据；
- 查询 ACTIVE、ARCHIVED、PENDING 和可选 IGNORED 数据；
- Date 序列化为字符串 DTO；
- 把小规模全量数据传给客户端组件。

### 10.2 客户端组件

- `InsightsLibraryClient.tsx`：视图、搜索、标签、排序和刷新；
- `InsightCard.tsx`：卡片与来源展开；
- `InsightEditorDialog.tsx`：创建和编辑；
- `InsightOrganizerDialog.tsx`：处理待整理来源；
- `MergeInsightDialog.tsx`：合并预览和确认。

MVP 复用现有 Card、Button、Badge、Input、Textarea、Label、Select、Tabs、Dialog、ScrollArea、Separator 和 toast。整理界面使用宽 Dialog，来源展开使用 `<details>`；不新增 UI 库，不修改 `src/components/ui`。

### 10.3 客户端数据策略

当前数据规模适合全量加载后在浏览器搜索、筛选和排序。搜索覆盖标题、说明、标签和来源原文。无需分页或 FTS。

默认排序：

1. 置顶；
2. lastSeen 倒序；
3. updatedAt 倒序。

## 11. 导航和周报集成

- 顶栏在“周报”后增加“经验库”；
- 周报列表页头增加经验库入口和待整理数量；
- 周报详情向客户端传递该周 PENDING 数量和最近同步状态；
- 核心经验区增加“整理本周经验”和“查看经验库”；
- 同步失败时增加“重试同步”；
- 保存成功后通过 toast 报告新增待整理数量，不强制打开 Dialog。

最近 8–12 周高频主题提示属于第二阶段，不进入首版验收。

## 12. 历史回填

1. 先备份 `prisma/db.sqlite`；
2. dry-run 扫描全部非空周报并返回预计数量；
3. 用户确认后正式回填；
4. 全部新来源设为 PENDING、`isCurrent=true`；
5. 回填不修改 `keyLessons`；
6. 回填使用生产同步函数；
7. 重复执行新增数必须为 0；
8. 预期基线约为 24 份非空周报和 86 条来源，实施时以实际 dry-run 为准。

## 13. 测试和验证

新增 Vitest，不引入 E2E 工具。

### 单元测试

- 换行和编号拆分；
- 不拆内部多句或子条件；
- NFKC、大小写、空白规范化；
- hash 稳定；
- 标签提取；
- 候选排序；
- distinct week 和 lastSeen；
- 客户端搜索、筛选和排序纯函数。

### 服务和 API 测试

- 同步幂等；
- PENDING 删除与 LINKED/IGNORED 历史化；
- link/create/ignore/restore/unlink 状态守卫；
- 合并事务顺序；
- 400/404/409/500；
- 回填重复运行。

### 手工验收

- 保存周报后新增待整理来源；
- 同步失败不影响周报保存；
- 搜索、标签、排序；
- 来源展开和跳转；
- 创建、编辑、置顶、归档、恢复、合并；
- 历史回填和重复执行；
- 深色主题和窄屏导航。

验证命令：

```text
pnpm db:push
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## 14. MVP 验收标准

1. `/insights` 可以查看、搜索、筛选和排序经验；
2. 卡片显示不同来源周数、最近出现和来源原文；
3. 来源可跳回周报；
4. 新周报保存后自动同步；
5. 重复保存不产生重复来源；
6. 同步失败不把已保存周报显示成失败；
7. 用户可 LINK、CREATE、IGNORE，并稍后处理 PENDING；
8. 用户可编辑、置顶、归档、恢复和合并；
9. 合并保留全部来源且统计正确；
10. 历史回填安全、可预览、幂等；
11. 旧 `keyLessons` 不被改写；
12. 历史非周一 `weekStart` 可以正常回填和跳转；
13. 自动化检查和手工验收通过。

## 15. 第二阶段

- 月报、季报改用 Insight 归并结果；
- 显示未整理条数；
- 最近 8–12 周高频主题；
- 根据实际使用决定是否支持来源级编辑映射；
- 根据数据增长决定是否需要服务端分页或全文搜索。
