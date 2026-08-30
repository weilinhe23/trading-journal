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
