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
