"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"

function getMondayOf(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split("T")[0]!
}

export function CreateWeeklyReportButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]!
  })

  function handleGo() {
    const monday = getMondayOf(new Date(selectedDate + "T00:00:00"))
    setOpen(false)
    router.push(`/weekly/${monday}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          新建周报
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>新建周报</DialogTitle>
          <DialogDescription>选择一个日期，系统会自动定位到该日期所在周的周报</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label className="text-sm">选择日期</Label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            将跳转到 {getMondayOf(new Date(selectedDate + "T00:00:00"))} 开始的周报
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleGo}>前往周报</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
