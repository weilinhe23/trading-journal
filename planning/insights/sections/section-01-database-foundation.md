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
