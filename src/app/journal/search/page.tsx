import { Suspense } from "react"
import { SetupSearchClient } from "~/components/journal/SetupSearchClient"

export const metadata = { title: "Setup 批量查询 — Trading Journal" }

export default function JournalSearchPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-muted-foreground py-12">加载中...</p>}>
      <SetupSearchClient />
    </Suspense>
  )
}
