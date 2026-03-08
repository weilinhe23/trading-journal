import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/prisma'

const UpdateStrategySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  mindmapData: z.string().optional(),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      include: { _count: { select: { setups: true } } },
    })
    if (!strategy) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: strategy })
  } catch (error) {
    console.error('GET /api/strategies/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch strategy' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: unknown = await req.json()
    const parsed = UpdateStrategySchema.parse(body)

    const strategy = await prisma.strategy.update({
      where: { id },
      data: {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.description !== undefined && { description: parsed.description }),
        ...(parsed.isActive !== undefined && { isActive: parsed.isActive }),
        ...(parsed.mindmapData !== undefined && { mindmapData: parsed.mindmapData }),
      },
    })
    return NextResponse.json({ success: true, data: strategy })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('PUT /api/strategies/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update strategy' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.strategy.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/strategies/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete strategy' }, { status: 500 })
  }
}
