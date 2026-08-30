"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
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
import type { InsightDto, OrganizableInsightSourceDto } from "~/types/insights";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: OrganizableInsightSourceDto | null;
  insights: InsightDto[];
  onCreate: (source: OrganizableInsightSourceDto) => void;
  onChanged: () => Promise<void>;
}

export function InsightOrganizerDialog({
  open,
  onOpenChange,
  source,
  insights,
  onCreate,
  onChanged,
}: Props) {
  const active = insights.filter((insight) => insight.status === "ACTIVE");
  const [targetId, setTargetId] = useState("");
  const [working, setWorking] = useState<"link" | "ignore" | null>(null);
  useEffect(() => {
    if (open) setTargetId(source?.candidates[0]?.insight.id ?? "");
  }, [open, source]);

  async function mutate(action: "LINK" | "IGNORE") {
    if (!source) return;
    setWorking(action === "LINK" ? "link" : "ignore");
    try {
      const response = await fetch(`/api/insight-sources/${source.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "LINK" ? { action, insightId: targetId } : { action },
        ),
      });
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "整理失败");
      toast.success(action === "LINK" ? "已归入经验" : "已忽略这条来源");
      onOpenChange(false);
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "整理失败");
    } finally {
      setWorking(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>整理周报经验</DialogTitle>
          <DialogDescription>
            系统只推荐可能相关的已有经验，最终归入哪一条由你决定。
          </DialogDescription>
        </DialogHeader>
        {source && (
          <div className="space-y-4">
            <div className="bg-muted/40 rounded-lg border p-4">
              <p className="leading-7">{source.sourceText}</p>
              <Button
                asChild
                variant="link"
                size="sm"
                className="mt-1 h-auto px-0"
              >
                <Link href={`/weekly/${source.weekStart}`}>
                  查看 {source.weekStart} 周报 <ExternalLink />
                </Link>
              </Button>
            </div>
            {source.candidates.length > 0 && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">匹配建议</p>
                {source.candidates.map((candidate) => (
                  <button
                    key={candidate.insight.id}
                    type="button"
                    onClick={() => setTargetId(candidate.insight.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${targetId === candidate.insight.id ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">
                        {candidate.insight.title}
                      </span>
                      <Badge variant="outline">{candidate.score} 分</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {candidate.reasons.join(" · ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择已有经验" />
              </SelectTrigger>
              <SelectContent>
                {active.map((insight) => (
                  <SelectItem key={insight.id} value={insight.id}>
                    {insight.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            disabled={working !== null}
            onClick={() => void mutate("IGNORE")}
          >
            {working === "ignore" && <Loader2 className="animate-spin" />}
            跳过并忽略
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!source || working !== null}
              onClick={() => {
                if (source) {
                  onOpenChange(false);
                  onCreate(source);
                }
              }}
            >
              <Plus />
              新建经验
            </Button>
            <Button
              disabled={!targetId || working !== null}
              onClick={() => void mutate("LINK")}
            >
              {working === "link" && <Loader2 className="animate-spin" />}
              归入已有经验
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
