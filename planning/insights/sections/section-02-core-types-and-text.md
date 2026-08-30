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
