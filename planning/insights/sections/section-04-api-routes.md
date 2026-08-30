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
