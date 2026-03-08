import { AnalyticsNav } from "~/components/analytics/AnalyticsNav"

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold mb-3">统计分析</h1>
        <AnalyticsNav />
      </div>
      {children}
    </div>
  )
}
