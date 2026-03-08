import { prisma } from "~/lib/prisma"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { CreateNewsCatalogDialog } from "~/components/news/CreateNewsCatalogDialog"
import { newsStrengthBadgeClass } from "~/lib/news-catalog"
import { NEWS_STRENGTH_LABELS } from "~/types"
import { NewsCatalogActions } from "~/components/news/NewsCatalogActions"
import { type NewsCatalogItem, type NewsStrength } from "~/types"
import { CheckCircle2, AlertTriangle } from "lucide-react"

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try { return JSON.parse(raw) as string[] } catch { return [] }
}

export default async function NewsCatalogPage() {
  const rows = await prisma.newsCatalog.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { subCategory: "asc" }, { name: "asc" }],
  })

  const items: NewsCatalogItem[] = rows.map((r) => ({
    ...r,
    strength: r.strength as NewsStrength,
    subCategory: r.subCategory ?? null,
    description: r.description ?? null,
    entryConditions: parseJsonArray(r.entryConditions),
    riskFactors: parseJsonArray(r.riskFactors),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  // Group by category
  const grouped = items.reduce<Record<string, NewsCatalogItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category]!.push(item)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">新闻催化剂库</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理你关注的新闻类型，创建 Setup 时可快速引用
          </p>
        </div>
        <CreateNewsCatalogDialog existingCategories={categories} />
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <p className="text-lg mb-2">暂无催化剂</p>
            <p className="text-sm">点击右上角「新建催化剂」开始维护</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catItems = grouped[cat]!
            const subGroups = catItems.reduce<Record<string, NewsCatalogItem[]>>((acc, item) => {
              const sub = item.subCategory ?? "__none__"
              if (!acc[sub]) acc[sub] = []
              acc[sub]!.push(item)
              return acc
            }, {})
            const subKeys = Object.keys(subGroups).sort((a, b) => {
              if (a === "__none__") return -1
              if (b === "__none__") return 1
              return a.localeCompare(b)
            })

            return (
              <Card key={cat}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{cat}</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {catItems.length} 条
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {subKeys.map((sub) => (
                    <div key={sub}>
                      {sub !== "__none__" && (
                        <p className="text-xs text-muted-foreground font-medium mb-2 pl-1 border-l-2 border-muted-foreground/30">
                          {sub}
                        </p>
                      )}
                      <div className="space-y-2">
                        {subGroups[sub]!.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-md border border-muted/50 bg-muted/20 px-3 py-2.5 space-y-2"
                          >
                            {/* Header row */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs shrink-0 ${newsStrengthBadgeClass(item.strength)}`}
                                >
                                  {NEWS_STRENGTH_LABELS[item.strength]}
                                </Badge>
                                <span className="text-sm font-medium truncate">{item.name}</span>
                              </div>
                              <NewsCatalogActions item={item} />
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className="text-xs text-muted-foreground pl-1">{item.description}</p>
                            )}

                            {/* Entry Conditions + Risk Factors */}
                            {(item.entryConditions.length > 0 || item.riskFactors.length > 0) && (
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-0.5">
                                {item.entryConditions.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                    {item.entryConditions.map((c, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5"
                                      >
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {item.riskFactors.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                                    {item.riskFactors.map((r, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5"
                                      >
                                        {r}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
