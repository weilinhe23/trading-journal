import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/prisma'

const SnapshotSchema = z.object({
  note: z.string().min(1),
})

interface HistoryEntry {
  date: string
  note: string
  snapshot: string
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: unknown = await req.json()
    const { note } = SnapshotSchema.parse(body)

    const strategy = await prisma.strategy.findUnique({ where: { id } })
    if (!strategy) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    let history: HistoryEntry[] = []
    try {
      history = JSON.parse(strategy.ruleHistory) as HistoryEntry[]
    } catch {
      history = []
    }

    const newEntry: HistoryEntry = {
      date: new Date().toISOString(),
      note,
      snapshot: strategy.mindmapData,
    }

    const updated = await prisma.strategy.update({
      where: { id },
      data: { ruleHistory: JSON.stringify([...history, newEntry]) },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('POST /api/strategies/[id]/snapshot error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save snapshot' }, { status: 500 })
  }
}
