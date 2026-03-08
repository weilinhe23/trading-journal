# 策略思维导图集成任务说明

## 任务目标

在 `/strategies/[id]` 页面集成可编辑的思维导图，使用 `mind-elixir` 库实现。
用户目前在 WiseMapping 上管理策略，现在迁移到本系统统一管理。

---

## 第一步：安装依赖

```bash
pnpm add mind-elixir
```

---

## 第二步：更新 Prisma Schema

在 `prisma/schema.prisma` 的 `Strategy` 模型中，`mindmapData` 字段存储 Mind Elixir 的 JSON 字符串：

```prisma
model Strategy {
  id           String   @id @default(cuid())
  name         String   @unique
  description  String?
  isActive     Boolean  @default(true)
  mindmapData  String   @default("{}") // Mind Elixir JSON 字符串
  ruleHistory  String   @default("[]") // 历史快照 JSON
  setups       TradeSetup[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

更新后运行 `pnpm db:push`。

---

## 第三步：创建思维导图组件

创建 `src/components/strategy/MindMapEditor.tsx`：

- 使用 `mind-elixir` 渲染可编辑思维导图
- 组件接收 `initialData`（JSON 对象）和 `onChange`（回调）两个 props
- 每次节点变更自动调用 `onChange`，外层页面负责防抖保存（500ms debounce）
- 注意：mind-elixir 是纯客户端库，组件顶部加 `'use client'`
- 容器高度设为 `calc(100vh - 200px)`，撑满页面

```tsx
'use client'
import { useEffect, useRef } from 'react'
import MindElixir, { type MindElixirData } from 'mind-elixir'

interface MindMapEditorProps {
  initialData: MindElixirData
  onChange: (data: MindElixirData) => void
  readonly?: boolean
}
```

---

## 第四步：创建策略页面

### `/strategies` — 策略列表页
- 展示所有策略卡片（名称、最后更新时间、关联 Setup 数量）
- 右上角「+ 新建策略」按钮

### `/strategies/[id]` — 策略详情页，布局分两栏：

```
左栏（40%）：策略信息
  - 策略名称（可编辑）
  - 策略描述（可编辑，纯文本或简单富文本）
  - 关联统计（只读）：使用次数 / 执行次数 / 胜率
  - 历史版本列表（时间 + 备注，可点击查看快照）

右栏（60%）：思维导图编辑区
  - MindMapEditor 组件
  - 右上角显示「已自动保存」状态
  - 「保存版本快照」按钮（手动触发，填写修改备注）
```

---

## 第五步：API 路由

```
GET  /api/strategies              获取所有策略列表
POST /api/strategies              创建新策略

GET  /api/strategies/[id]         获取策略详情（含 mindmapData）
PUT  /api/strategies/[id]         更新策略（mindmapData 自动保存）
DELETE /api/strategies/[id]       软删除（isActive = false）

POST /api/strategies/[id]/snapshot  手动保存版本快照
                                    body: { note: "修改说明" }
                                    逻辑：将当前 mindmapData 追加到 ruleHistory
```

**快照存储格式**（追加到 `ruleHistory` JSON 数组）：
```json
[
  {
    "date": "2024-01-15T10:30:00Z",
    "note": "新增大盘过滤条件",
    "snapshot": "{...mindmapData JSON...}"
  }
]
```

---

## 第六步：导入现有财报交易策略数据

创建数据库 seed 文件 `prisma/seed-strategies.ts`，将以下数据写入数据库：

**策略名称**：财报交易

**mindmapData 初始值**（直接粘贴以下 JSON）：

```json
{
  "nodeData": {
    "id": "root",
    "topic": "财报交易",
    "root": true,
    "children": [
      {
        "id": "n1",
        "topic": "1. 总体策略",
        "direction": 1,
        "children": [
          {
            "id": "n1-1",
            "topic": "标的股票的选择",
            "children": [
              { "id": "n1-1-1", "topic": "小盘股优先（300M-10B）" },
              { "id": "n1-1-2", "topic": "中盘股辅助（10B-200B）" },
              { "id": "n1-1-3", "topic": "股票价格在 2-20 区间更好" }
            ]
          },
          {
            "id": "n1-2",
            "topic": "交易策略",
            "children": [
              {
                "id": "n1-2-1",
                "topic": "ORB Trade（主交易类型）",
                "children": [
                  { "id": "n1-2-1-1", "topic": "不等回调，直接进入交易，逻辑是抓住开盘 30-60min 的行情" },
                  {
                    "id": "n1-2-1-2",
                    "topic": "Reversal ORB Trade（辅助）",
                    "children": [
                      { "id": "n1-2-1-2-1", "topic": "在 ORB Trade 行情下，若价格在 ORB trade 后有大幅度的 pullback，可考虑反向介入" }
                    ]
                  }
                ]
              },
              {
                "id": "n1-2-2",
                "topic": "Pullback Trade（主交易类型）",
                "children": [
                  { "id": "n1-2-2-1", "topic": "开盘不着急进入，等待市场回调到一定水平再进入，交易方向与财报公布后方向一致" }
                ]
              },
              {
                "id": "n1-2-3",
                "topic": "Reversal Trade（辅助交易类型）",
                "children": [
                  { "id": "n1-2-3-1", "topic": "逆转财报的交易方向，对赌财报信息已消化，市场走势开始反转" }
                ]
              }
            ]
          },
          {
            "id": "n1-3",
            "topic": "交易周期选择",
            "children": [
              { "id": "n1-3-1", "topic": "5min 为主，判断大趋势" },
              { "id": "n1-3-2", "topic": "1min 可作为进入参考，但必须有 5min 行情支持" }
            ]
          }
        ]
      },
      {
        "id": "n2",
        "topic": "2. 需要观察的指标",
        "direction": 1,
        "children": [
          {
            "id": "n2-1",
            "topic": "1. PM（盘前）Trend",
            "children": [
              { "id": "n2-1-1", "topic": "是否是 strong trend？" },
              { "id": "n2-1-2", "topic": "若是 → 可能满足 ORB Trade，但仍需开盘趋势确认" },
              { "id": "n2-1-3", "topic": "若否 → 一般为 Pullback Trade" }
            ]
          },
          {
            "id": "n2-2",
            "topic": "2. 开盘的 Trend",
            "children": [
              { "id": "n2-2-1", "topic": "是否与 PM Trend 一致？" },
              { "id": "n2-2-2", "topic": "若是 → 可能满足 ORB Trade" },
              { "id": "n2-2-3", "topic": "若否 → 一般为 Pullback Trade" }
            ]
          },
          {
            "id": "n2-3",
            "topic": "3. 开盘的成交量",
            "children": [
              { "id": "n2-3-1", "topic": "是否明显超过 PM 的成交量？" },
              { "id": "n2-3-2", "topic": "若是 → 可能满足 ORB Trade" },
              { "id": "n2-3-3", "topic": "若否 → 一般为 Pullback Trade" }
            ]
          },
          {
            "id": "n2-4",
            "topic": "4. 最终决策逻辑",
            "children": [
              { "id": "n2-4-1", "topic": "ORB Trade 条件是否都满足？" },
              { "id": "n2-4-2", "topic": "若是 → 执行 ORB Trade" },
              { "id": "n2-4-3", "topic": "若否 → 执行 Pullback Trade" }
            ]
          }
        ]
      },
      {
        "id": "n3",
        "topic": "3. Pullback Trade 决策流程",
        "direction": 0,
        "children": [
          {
            "id": "n3-1",
            "topic": "判断 Pullback Level",
            "children": [
              {
                "id": "n3-1-1",
                "topic": "VWAP",
                "children": [
                  { "id": "n3-1-1-1", "topic": "需要价格在 VWAP 呈现未突破形状" }
                ]
              },
              {
                "id": "n3-1-2",
                "topic": "Down/Upband（2 stdev）",
                "children": [
                  { "id": "n3-1-2-1", "topic": "在价格突破 VWAP 的情绪下使用" }
                ]
              },
              { "id": "n3-1-3", "topic": "虽然价格未达到 Down/Upband 或 VWAP，但若形成明显的 Failed Lower / Failed Higher 也可考虑进入" }
            ]
          }
        ]
      },
      {
        "id": "n4",
        "topic": "4. Reversal Trade",
        "direction": 0,
        "children": [
          {
            "id": "n4-1",
            "topic": "判断是否符合趋势条件",
            "children": [
              {
                "id": "n4-1-1",
                "topic": "成交量上",
                "children": [
                  { "id": "n4-1-1-1", "topic": "开盘后出现比财报公布后更大的反方向成交量" },
                  { "id": "n4-1-1-2", "topic": "说明市场在兑现消息" }
                ]
              },
              {
                "id": "n4-1-2",
                "topic": "趋势上",
                "children": [
                  { "id": "n4-1-2-1", "topic": "经过第一轮 Pullback Trend 后虽然继续超财报方向走，但价格未能突破 PM High/Low 等重要 Level" }
                ]
              },
              {
                "id": "n4-1-3",
                "topic": "时间上",
                "children": [
                  { "id": "n4-1-3-1", "topic": "至少需要 30-60min 仍然没有大的趋势出现" }
                ]
              }
            ]
          },
          {
            "id": "n4-2",
            "topic": "进入位置",
            "children": [
              { "id": "n4-2-1", "topic": "需要当日最高或最低附近" },
              { "id": "n4-2-2", "topic": "Down/Upband（2 stdev）" },
              { "id": "n4-2-3", "topic": "PM High / Low" }
            ]
          }
        ]
      },
      {
        "id": "n5",
        "topic": "风控模块",
        "direction": 0,
        "children": [
          { "id": "n5-1", "topic": "单笔最高损失不超过 5%" },
          { "id": "n5-2", "topic": "盈利目标 10%" },
          { "id": "n5-3", "topic": "盈亏比 ≥ 2:1 才执行" }
        ]
      }
    ]
  }
}
```

运行 seed：
```bash
npx ts-node prisma/seed-strategies.ts
```

---

## 注意事项

1. mind-elixir 是纯客户端库，所有使用它的组件必须加 `'use client'`
2. 自动保存用 500ms debounce，避免每次鼠标移动都触发 API
3. `ruleHistory` 只在用户手动点击「保存版本快照」时追加，不做自动快照
4. 查看历史快照时，用只读模式（`readonly: true`）渲染，不可编辑
5. TradeSetup 选择策略时，策略下拉列表只展示 `isActive = true` 的策略
