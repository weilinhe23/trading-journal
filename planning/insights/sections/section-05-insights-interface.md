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
