import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/prisma'

type Params = Promise<{ id: string }>

// GET /api/strategies/[id]/trade-types
export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const tradeTypes = await prisma.tradeType.findMany({
      where: { strategyId: id },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ success: true, data: tradeTypes })
  } catch (error) {
    console.error('GET trade-types error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch trade types' }, { status: 500 })
  }
}

// POST /api/strategies/[id]/trade-types  { name }
export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const body: unknown = await req.json()
    const { name } = z.object({ name: z.string().min(1) }).parse(body)

    const tradeType = await prisma.tradeType.create({
      data: { name, strategyId: id },
    })
    return NextResponse.json({ success: true, data: tradeType }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('POST trade-types error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create trade type' }, { status: 500 })
  }
}
