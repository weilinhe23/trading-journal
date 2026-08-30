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
