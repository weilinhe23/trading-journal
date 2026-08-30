# 核心经验库代码库研究

## 研究范围

本研究围绕 `planning/insights/spec.md`，检查现有周报保存链路、Prisma/SQLite 约定、月报与季报的教训聚合、可复用 UI、API 校验模式、测试基础设施和历史数据特点。功能没有外部集成，因此未进行网页研究。

## 1. 项目架构

- 项目实际使用 Next.js 15.2.3、React 19、TypeScript、Prisma 和 SQLite；实施以 `package.json` 为准。
- 页面采用 App Router，Route Handler 位于 `src/app/api/**/route.ts`。
- 服务端页面直接查询 Prisma，把序列化 DTO 传给客户端组件。
- Prisma Client 由 `src/server/db.ts` 创建，`src/lib/prisma.ts` 只负责重新导出单例。
- 当前没有 `prisma/migrations`，Schema 变更通过 `pnpm db:push` 应用。
- 项目没有测试框架或现有测试文件。
- 页面同时使用 Tailwind/shadcn 和局部 inline OKLCH 样式；经验库列表更适合沿用 Tailwind/shadcn。

## 2. 周报保存链路

`WeeklyReport` 位于 `prisma/schema.prisma`，以唯一的 `weekStart` 标识周报，核心教训保存在 `keyLessons: String?`。

`src/app/api/weekly-reports/[weekStart]/route.ts`：

- 使用 `YYYY-MM-DDT00:00:00.000Z` 解析路径日期；
- PUT 使用 Zod `safeParse` 校验；
- 通过 Prisma `upsert` 保存周报；
- 返回 `{ success: true, data: report }`；
- 400 表示日期或输入错误，500 表示保存失败。

`src/components/weekly/WeeklyReportClient.tsx`：

- `handleSave` 只调用一次周报 PUT；
- 保存成功后显示短暂状态并执行 `router.refresh()`；
- API 或网络错误通过 Sonner toast 展示；
- 核心经验输入区已经提示“一行一条”。

推荐让周报 PUT 在保存成功后调用独立同步服务，并在原响应中增加：

```ts
insightSync: {
  success: boolean
  createdCount?: number
  pendingCount?: number
  removedPendingCount?: number
  historicalCount?: number
  error?: string
}
```

如果周报保存成功、经验同步失败，接口仍返回 HTTP 200 和 `success: true`。客户端显示警告并提供重试入口，不能把已保存的周报显示成“保存失败”。

## 3. 历史数据特点

- 数据库当前有 24 份周报，24 份 `keyLessons` 都非空。
- 按“换行拆分 + 去掉行首编号”预计生成 86 条来源，每周 1–10 条。
- 同一周内没有完全重复的规范化文本。
- 历史中存在 `2026-03-08` 这样的周日 `weekStart`。经验库必须沿用既有日期值，只校验 `YYYY-MM-DD`，不能强制周一。

## 4. 月报和季报

月报和季报目前都按以下方式识别重复经验：

1. 按换行拆分 `keyLessons`；
2. trim 后转为小写；
3. 只有整行完全相同时才合并。

相关位置：

- 月报：`src/app/monthly/[yearMonth]/page.tsx`；
- 月报展示：`src/components/monthly/MonthlyReportClient.tsx`；
- 季报：`src/app/quarterly/[yearQuarter]/page.tsx`；
- 季报展示：`src/components/quarterly/QuarterlyReportClient.tsx`。

MVP 不应同时重构这四个大型文件。首版允许两套口径暂时并存：

- 经验库使用人工确认后的语义归并；
- 月报和季报继续使用旧的整行匹配。

第二阶段再把月报和季报切换到 `InsightSource.insightId` 聚合，并显示未整理数量。

## 5. 推荐数据模型

### Insight

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

### InsightSource

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

`isCurrent` 是研究后建议增加的字段，用于区分仍存在于当前周报文本的来源和因周报编辑而保留的历史来源。

删除关系使用 `Restrict`，避免出现 `state=LINKED` 但 `insightId=null`。普通用户操作只归档 Insight；只有合并事务在迁移全部来源后删除空记录。

`tagsJson` 延续项目现有 JSON 字符串模式。出现周数、最近出现和来源数全部派生，不存数据库列。

## 6. 文本处理模块

建议新增：

- `src/lib/insights.ts`：纯函数；
- `src/lib/insights-server.ts`：Prisma 查询、同步、回填和事务；
- `src/types/insights.ts`：API 和 UI DTO。

纯函数包括：

- `splitWeeklyLessons`；
- `normalizeInsightText`；
- `hashInsightText`；
- `extractInsightTags`；
- `rankInsightCandidates`；
- `parseTagsJson`；
- `normalizeTags`。

拆分规则：

1. 把 `\r\n` 和 `\r` 统一为 `\n`；
2. 按非空换行拆分；
3. 去掉行首 `1.`、`1、`、`1．`、`1)`、`1）`、`-`、`*`、`•`；
4. trim；
5. 不按句号拆分；
6. 同周相同规范化文本只保留第一条并保留顺序。

规范化使用 Unicode NFKC、英文小写、首尾 trim 和连续空白折叠。哈希使用 Node `crypto` 的 SHA-256。

候选推荐只读取 ACTIVE Insight：

- 完全规范化相同的候选最高；
- 标签交集和标题关键词命中作为主要分数；
- 说明文字命中权重较低；
- 置顶和最近出现只作为平分条件；
- 无关键词交集时不强推；
- 最多返回 5 条；
- 推荐永远不自动提交归并。

## 7. 幂等同步

`syncWeeklyLessons(weekStart, keyLessons)` 应由周报 PUT、手动重试和历史回填共同调用。

事务内执行：

1. 拆分文本，规范化并计算 hash；
2. 查询该周全部来源；
3. 当前 hash 已存在时：
   - 恢复 `isCurrent=true`；
   - PENDING 可以更新原文和顺序；
   - LINKED/IGNORED 保留原始快照；
4. 当前 hash 不存在时，创建 PENDING 来源；
5. 数据库中本次不存在的 hash：
   - PENDING 直接删除；
   - LINKED/IGNORED 保留并设置 `isCurrent=false`；
6. 返回 created、pending、deletedPending、historical 等计数。

该算法保证重复保存不新增、未整理修改可替换、已整理历史不丢失、原句重新出现时可恢复当前状态。

## 8. 规格冲突与取舍

规格同时要求“来源是周报原文快照”和“可在整理面板编辑、拆分、合并来源”。两者在单一来源表下存在身份冲突：如果用户直接修改来源文字或 hash，下次按周报同步会重新创建原文来源。

MVP 建议：

- InsightSource 保持不可编辑的原文快照；
- 拆分有误时，用户回到周报 textarea 调整换行并重新保存；
- 用户可以自由编辑规范化 Insight 的标题、说明和标签；
- 来源级编辑、拆分和合并延后。

如果首版必须直接编辑来源，则需要增加 origin 身份映射，甚至第三张表，超出当前轻量范围。

## 9. 应用层不变量与并发

SQLite/Prisma Schema 不会自动表达全部状态约束，服务层必须保证：

- `LINKED` 必须有 `insightId`；
- `PENDING` 和 `IGNORED` 必须没有 `insightId`；
- link、ignore、restore 使用带当前状态条件的 `updateMany`；
- 更新数量不是 1 时返回 409；
- 创建并关联、合并、多记录迁移使用 `$transaction`；
- 合并禁止源 ID 与目标 ID 相同；
- 合并先迁移来源，再删除空的旧 Insight；
- 双击和并发请求不得覆盖已变化的状态。

## 10. API 建议

- `GET/POST /api/insights`
- `GET/PUT /api/insights/[id]`
- `POST /api/insights/[id]/merge`
- `GET /api/insight-sources`
- `PATCH /api/insight-sources/[id]`
- `POST /api/weekly-reports/[weekStart]/insights`
- `POST /api/insights/backfill`

来源 PATCH 使用 Zod discriminated union：

- `{ action: "LINK", insightId }`
- `{ action: "IGNORE" }`
- `{ action: "RESTORE" }`

回填适合使用仅限本地应用的内部 API。项目没有 tsx/ts-node 运行器，不值得为了单次脚本新增运行依赖。回填接口必须支持 dry-run、正式执行和重复运行。

## 11. 页面与组件

建议新增：

- `src/app/insights/page.tsx`：服务端页面；
- `src/components/insights/InsightsLibraryClient.tsx`；
- `src/components/insights/InsightCard.tsx`；
- `src/components/insights/InsightEditorDialog.tsx`；
- `src/components/insights/InsightOrganizerDialog.tsx`；
- `src/components/insights/MergeInsightDialog.tsx`。

当前约 86 个来源、几十条以内的规范经验适合服务端一次加载、客户端搜索和排序。无需分页、SQLite FTS 或外部搜索。

可复用 UI：Card、Button、Badge、Input、Textarea、Label、Select、Tabs、Dialog、ScrollArea、Separator 和 Sonner toast。

`src/components/ui` 没有 Sheet、Collapsible 等组件。MVP 使用宽 Dialog 和原生 `<details>`，避免引入新组件或修改基础组件。

默认排序：置顶优先，其余按最近出现、最近编辑倒序。

## 12. 导航与周报入口

- 顶层导航虽然已有 9 项，但支持横向滚动，可以在“周报”后加入“经验库”；
- 周报列表页头增加经验库入口和待整理数量；
- 周报详情的核心经验区域增加“整理本周经验”“查看经验库”“重试同步”；
- 保存成功后不强制打开整理 Dialog，只显示新增数量和主动入口。

## 13. 日期约定

项目把 ET 业务日期表示为 UTC 00:00，并大量使用：

```ts
new Date(`${value}T00:00:00.000Z`)
date.toISOString().slice(0, 10)
```

`src/lib/kpi.ts` 已有 `parseUtcTradingDate` 和 `toDateString`。经验 API 应复用或提取通用 helper，避免使用浏览器本地时区解析。

## 14. 测试基础设施

项目当前没有 Vitest、Jest 或 E2E 工具。建议首版仅新增 Vitest：

- devDependency：`vitest`；
- `test`: `vitest run`；
- `test:watch`: `vitest`。

优先覆盖纯函数、幂等同步分支、状态守卫和合并事务。页面使用手工验收；不要为一个本地页面立即引入完整 E2E 工具链。

最终验证命令：

```text
pnpm db:push
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## 15. 文件范围

### 修改

- `prisma/schema.prisma`
- `src/app/api/weekly-reports/[weekStart]/route.ts`
- `src/components/weekly/WeeklyReportClient.tsx`
- `src/app/weekly/[weekStart]/page.tsx`
- `src/app/weekly/page.tsx`
- `src/app/layout.tsx`
- `package.json`
- `pnpm-lock.yaml`

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

### 第二阶段

- `src/app/monthly/[yearMonth]/page.tsx`
- `src/components/monthly/MonthlyReportClient.tsx`
- `src/app/quarterly/[yearQuarter]/page.tsx`
- `src/components/quarterly/QuarterlyReportClient.tsx`

## 16. 风险排序

- P0：来源级编辑、拆分、合并与同步身份冲突；MVP 保持来源快照不可变。
- P0：周报保存成功但同步失败时不能返回整体失败。
- P0：删除 Insight 后出现 LINKED/null；使用 Restrict 且不开放普通硬删除。
- P1：历史 weekStart 不全是周一；禁止强制 Monday。
- P1：回填重复；生产同步和回填共用函数，并增加数据库唯一约束。
- P1：合并或双击并发；事务、状态守卫和 409。
- P2：tagsJson 损坏；解析失败回退空数组，写入集中规范化。
- P2：经验库与月季报暂时不同口径；首版说明，第二阶段替换。
