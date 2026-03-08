import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/prisma'

const CreateStrategySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  mindmapData: z.string().optional(),
})

export async function GET() {
  try {
    const strategies = await prisma.strategy.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { setups: true } },
        tradeTypes: { orderBy: { createdAt: 'asc' } },
      },
    })
    return NextResponse.json({ success: true, data: strategies })
  } catch (error) {
    console.error('GET /api/strategies error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch strategies' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    const parsed = CreateStrategySchema.parse(body)

    const strategy = await prisma.strategy.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        mindmapData: parsed.mindmapData ?? '{}',
      },
    })
    return NextResponse.json({ success: true, data: strategy }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('POST /api/strategies error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create strategy' }, { status: 500 })
  }
}
