import Link from 'next/link'
import { prisma } from '~/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { CreateStrategyButton } from '~/components/strategy/CreateStrategyButton'
import { StrategyCardActions } from '~/components/strategy/StrategyCardActions'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function StrategiesPage() {
  const strategies = await prisma.strategy.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { setups: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">策略库</h1>
          <p className="text-sm text-muted-foreground mt-1">管理你的交易策略思维导图</p>
        </div>
        <CreateStrategyButton />
      </div>

      {strategies.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <p className="text-lg mb-2">暂无策略</p>
            <p className="text-sm">点击右上角「+ 新建策略」开始创建</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((s) => (
            <Card
              key={s.id}
              className="hover:border-primary/50 transition-colors h-full"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/strategies/${s.id}`} className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-snug hover:text-primary transition-colors">
                      {s.name}
                    </CardTitle>
                  </Link>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Badge variant={s.isActive ? 'default' : 'secondary'} className="text-xs mr-1">
                      {s.isActive ? '启用' : '停用'}
                    </Badge>
                    <StrategyCardActions id={s.id} name={s.name} isActive={s.isActive} />
                  </div>
                </div>
              </CardHeader>
              <Link href={`/strategies/${s.id}`} className="block">
                <CardContent className="pt-0 space-y-3">
                  {s.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>关联 {s._count.setups} 个 Setup</span>
                    <span>
                      {formatDistanceToNow(s.updatedAt, { addSuffix: true, locale: zhCN })}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
