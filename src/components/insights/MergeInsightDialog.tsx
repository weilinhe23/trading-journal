"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { InsightDto } from "~/types/insights";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: InsightDto | null;
  insights: InsightDto[];
  onMerged: () => Promise<void>;
}

export function MergeInsightDialog({
  open,
  onOpenChange,
  source,
  insights,
  onMerged,
}: Props) {
  const targets = useMemo(
    () =>
      insights.filter(
        (insight) => insight.status === "ACTIVE" && insight.id !== source?.id,
      ),
    [insights, source?.id],
  );
  const [targetId, setTargetId] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (open) setTargetId(targets[0]?.id ?? "");
  }, [open, targets]);

  async function handleMerge() {
    if (!source || !targetId) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/insights/${source.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId }),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "合并失败");
      toast.success("经验已合并，所有来源已转移");
      onOpenChange(false);
      await onMerged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "合并失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>合并经验</DialogTitle>
          <DialogDescription>
            “{source?.title}
            ”会被删除，它的全部周报来源会转移到目标经验。此操作不可直接撤销。
          </DialogDescription>
        </DialogHeader>
        <Select value={targetId} onValueChange={setTargetId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择保留的目标经验" />
          </SelectTrigger>
          <SelectContent>
            {targets.map((target) => (
              <SelectItem key={target.id} value={target.id}>
                {target.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            disabled={!targetId || saving}
            onClick={() => void handleMerge()}
          >
            {saving && <Loader2 className="animate-spin" />}确认合并
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
