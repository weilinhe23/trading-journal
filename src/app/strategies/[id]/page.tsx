import { notFound } from 'next/navigation'
import { prisma } from '~/lib/prisma'
import { StrategyDetailClient } from '~/components/strategy/StrategyDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StrategyDetailPage({ params }: Props) {
  const { id } = await params
  const strategy = await prisma.strategy.findUnique({
    where: { id },
    include: { _count: { select: { setups: true } } },
  })

  if (!strategy) notFound()

  // Parse history to count entries
  let historyCount = 0
  try {
    const hist = JSON.parse(strategy.ruleHistory) as unknown[]
    historyCount = Array.isArray(hist) ? hist.length : 0
  } catch {
    historyCount = 0
  }

  return (
    <StrategyDetailClient
      strategy={{
        id: strategy.id,
        name: strategy.name,
        description: strategy.description ?? '',
        isActive: strategy.isActive,
        mindmapData: strategy.mindmapData,
        ruleHistory: strategy.ruleHistory,
        setupCount: strategy._count.setups,
        historyCount,
        updatedAt: strategy.updatedAt.toISOString(),
      }}
    />
  )
}
