"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"

const NAV = [
  { href: "/analytics", label: "总览" },
  { href: "/analytics/missed", label: "错过分析" },
  { href: "/analytics/execution", label: "执行纪律" },
  { href: "/analytics/strategies", label: "策略效果" },
]

export function AnalyticsNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 border-b pb-0">
      {NAV.map(({ href, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-2 text-sm rounded-t-md border-b-2 transition-colors",
              active
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
