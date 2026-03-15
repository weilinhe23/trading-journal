import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

// DELETE /api/missed-reasons/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    await prisma.missedReasonOption.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/missed-reasons/[id]]", error)
    return NextResponse.json({ success: false, error: "删除失败" }, { status: 500 })
  }
}
