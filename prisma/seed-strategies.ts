import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

const earningsStrategyMindmap = {
  nodeData: {
    id: 'root',
    topic: '财报交易',
    root: true,
    children: [
      {
        id: 'n1',
        topic: '1. 总体策略',
        direction: 1,
        children: [
          {
            id: 'n1-1',
            topic: '标的股票的选择',
            children: [
              { id: 'n1-1-1', topic: '小盘股优先（300M-10B）' },
              { id: 'n1-1-2', topic: '中盘股辅助（10B-200B）' },
              { id: 'n1-1-3', topic: '股票价格在 2-20 区间更好' },
            ],
          },
          {
            id: 'n1-2',
            topic: '交易策略',
            children: [
              {
                id: 'n1-2-1',
                topic: 'ORB Trade（主交易类型）',
                children: [
                  { id: 'n1-2-1-1', topic: '不等回调，直接进入交易，逻辑是抓住开盘 30-60min 的行情' },
                  {
                    id: 'n1-2-1-2',
                    topic: 'Reversal ORB Trade（辅助）',
                    children: [
                      { id: 'n1-2-1-2-1', topic: '在 ORB Trade 行情下，若价格在 ORB trade 后有大幅度的 pullback，可考虑反向介入' },
                    ],
                  },
                ],
              },
              {
                id: 'n1-2-2',
                topic: 'Pullback Trade（主交易类型）',
                children: [
                  { id: 'n1-2-2-1', topic: '开盘不着急进入，等待市场回调到一定水平再进入，交易方向与财报公布后方向一致' },
                ],
              },
              {
                id: 'n1-2-3',
                topic: 'Reversal Trade（辅助交易类型）',
                children: [
                  { id: 'n1-2-3-1', topic: '逆转财报的交易方向，对赌财报信息已消化，市场走势开始反转' },
                ],
              },
            ],
          },
          {
            id: 'n1-3',
            topic: '交易周期选择',
            children: [
              { id: 'n1-3-1', topic: '5min 为主，判断大趋势' },
              { id: 'n1-3-2', topic: '1min 可作为进入参考，但必须有 5min 行情支持' },
            ],
          },
        ],
      },
      {
        id: 'n2',
        topic: '2. 需要观察的指标',
        direction: 1,
        children: [
          {
            id: 'n2-1',
            topic: '1. PM（盘前）Trend',
            children: [
              { id: 'n2-1-1', topic: '是否是 strong trend？' },
              { id: 'n2-1-2', topic: '若是 → 可能满足 ORB Trade，但仍需开盘趋势确认' },
              { id: 'n2-1-3', topic: '若否 → 一般为 Pullback Trade' },
            ],
          },
          {
            id: 'n2-2',
            topic: '2. 开盘的 Trend',
            children: [
              { id: 'n2-2-1', topic: '是否与 PM Trend 一致？' },
              { id: 'n2-2-2', topic: '若是 → 可能满足 ORB Trade' },
              { id: 'n2-2-3', topic: '若否 → 一般为 Pullback Trade' },
            ],
          },
          {
            id: 'n2-3',
            topic: '3. 开盘的成交量',
            children: [
              { id: 'n2-3-1', topic: '是否明显超过 PM 的成交量？' },
              { id: 'n2-3-2', topic: '若是 → 可能满足 ORB Trade' },
              { id: 'n2-3-3', topic: '若否 → 一般为 Pullback Trade' },
            ],
          },
          {
            id: 'n2-4',
            topic: '4. 最终决策逻辑',
            children: [
              { id: 'n2-4-1', topic: 'ORB Trade 条件是否都满足？' },
              { id: 'n2-4-2', topic: '若是 → 执行 ORB Trade' },
              { id: 'n2-4-3', topic: '若否 → 执行 Pullback Trade' },
            ],
          },
        ],
      },
      {
        id: 'n3',
        topic: '3. Pullback Trade 决策流程',
        direction: 0,
        children: [
          {
            id: 'n3-1',
            topic: '判断 Pullback Level',
            children: [
              {
                id: 'n3-1-1',
                topic: 'VWAP',
                children: [
                  { id: 'n3-1-1-1', topic: '需要价格在 VWAP 呈现未突破形状' },
                ],
              },
              {
                id: 'n3-1-2',
                topic: 'Down/Upband（2 stdev）',
                children: [
                  { id: 'n3-1-2-1', topic: '在价格突破 VWAP 的情绪下使用' },
                ],
              },
              { id: 'n3-1-3', topic: '虽然价格未达到 Down/Upband 或 VWAP，但若形成明显的 Failed Lower / Failed Higher 也可考虑进入' },
            ],
          },
        ],
      },
      {
        id: 'n4',
        topic: '4. Reversal Trade',
        direction: 0,
        children: [
          {
            id: 'n4-1',
            topic: '判断是否符合趋势条件',
            children: [
              {
                id: 'n4-1-1',
                topic: '成交量上',
                children: [
                  { id: 'n4-1-1-1', topic: '开盘后出现比财报公布后更大的反方向成交量' },
                  { id: 'n4-1-1-2', topic: '说明市场在兑现消息' },
                ],
              },
              {
                id: 'n4-1-2',
                topic: '趋势上',
                children: [
                  { id: 'n4-1-2-1', topic: '经过第一轮 Pullback Trend 后虽然继续超财报方向走，但价格未能突破 PM High/Low 等重要 Level' },
                ],
              },
              {
                id: 'n4-1-3',
                topic: '时间上',
                children: [
                  { id: 'n4-1-3-1', topic: '至少需要 30-60min 仍然没有大的趋势出现' },
                ],
              },
            ],
          },
          {
            id: 'n4-2',
            topic: '进入位置',
            children: [
              { id: 'n4-2-1', topic: '需要当日最高或最低附近' },
              { id: 'n4-2-2', topic: 'Down/Upband（2 stdev）' },
              { id: 'n4-2-3', topic: 'PM High / Low' },
            ],
          },
        ],
      },
      {
        id: 'n5',
        topic: '风控模块',
        direction: 0,
        children: [
          { id: 'n5-1', topic: '单笔最高损失不超过 5%' },
          { id: 'n5-2', topic: '盈利目标 10%' },
          { id: 'n5-3', topic: '盈亏比 ≥ 2:1 才执行' },
        ],
      },
    ],
  },
}

async function main() {
  console.log('Seeding strategies...')

  const strategy = await prisma.strategy.upsert({
    where: { name: '财报交易' },
    update: {
      mindmapData: JSON.stringify(earningsStrategyMindmap),
      description: '基于财报发布后价格行为的日内交易策略，包含 ORB、Pullback 和 Reversal 三种交易类型',
    },
    create: {
      name: '财报交易',
      description: '基于财报发布后价格行为的日内交易策略，包含 ORB、Pullback 和 Reversal 三种交易类型',
      mindmapData: JSON.stringify(earningsStrategyMindmap),
      isActive: true,
    },
  })

  console.log(`✅ Strategy created/updated: ${strategy.name} (id: ${strategy.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
