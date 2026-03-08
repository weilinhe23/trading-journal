import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'

type Params = Promise<{ id: string; typeId: string }>

// DELETE /api/strategies/[id]/trade-types/[typeId]
export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    const { typeId } = await params
    await prisma.tradeType.delete({ where: { id: typeId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE trade-type error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete trade type' }, { status: 500 })
  }
}
