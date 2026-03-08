import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try { return JSON.parse(raw) as string[] } catch { return [] }
}

function serializeArray(arr: unknown): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  return JSON.stringify(arr.map(String).filter(Boolean))
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = (await req.json()) as {
      name?: string
      category?: string
      subCategory?: string
      strength?: string
      description?: string
      entryConditions?: string[]
      riskFactors?: string[]
      isActive?: boolean
    }

    const validStrengths = ["STRONG", "MEDIUM", "WEAK"]
    if (body.strength && !validStrengths.includes(body.strength)) {
      return NextResponse.json({ success: false, error: "strength 值无效" }, { status: 400 })
    }

    const row = await prisma.newsCatalog.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.subCategory !== undefined && { subCategory: body.subCategory.trim() || null }),
        ...(body.strength !== undefined && { strength: body.strength as "STRONG" | "MEDIUM" | "WEAK" }),
        ...(body.description !== undefined && { description: body.description.trim() || null }),
        ...(body.entryConditions !== undefined && { entryConditions: serializeArray(body.entryConditions) }),
        ...(body.riskFactors !== undefined && { riskFactors: serializeArray(body.riskFactors) }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...row,
        entryConditions: parseJsonArray(row.entryConditions),
        riskFactors: parseJsonArray(row.riskFactors),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("PUT /api/news-catalog/[id] error:", error)
    return NextResponse.json({ success: false, error: "更新失败" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.newsCatalog.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/news-catalog/[id] error:", error)
    return NextResponse.json({ success: false, error: "删除失败" }, { status: 500 })
  }
}
