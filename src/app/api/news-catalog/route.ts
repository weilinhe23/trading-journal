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

export async function GET() {
  try {
    const rows = await prisma.newsCatalog.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { subCategory: "asc" }, { name: "asc" }],
    })
    const data = rows.map((r) => ({
      ...r,
      entryConditions: parseJsonArray(r.entryConditions),
      riskFactors: parseJsonArray(r.riskFactors),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("GET /api/news-catalog error:", error)
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string
      category?: string
      subCategory?: string
      strength?: string
      description?: string
      entryConditions?: string[]
      riskFactors?: string[]
    }

    const { name, category, subCategory, strength, description, entryConditions, riskFactors } = body

    if (!name?.trim() || !category?.trim() || !strength) {
      return NextResponse.json(
        { success: false, error: "缺少必填字段：name、category、strength" },
        { status: 400 },
      )
    }

    const validStrengths = ["STRONG", "MEDIUM", "WEAK"]
    if (!validStrengths.includes(strength)) {
      return NextResponse.json({ success: false, error: "strength 值无效" }, { status: 400 })
    }

    const row = await prisma.newsCatalog.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        subCategory: subCategory?.trim() || null,
        strength: strength as "STRONG" | "MEDIUM" | "WEAK",
        description: description?.trim() || null,
        entryConditions: serializeArray(entryConditions),
        riskFactors: serializeArray(riskFactors),
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
    console.error("POST /api/news-catalog error:", error)
    return NextResponse.json({ success: false, error: "创建失败" }, { status: 500 })
  }
}
