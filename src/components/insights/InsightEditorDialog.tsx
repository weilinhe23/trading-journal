"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { InsightDto, InsightSourceDto } from "~/types/insights";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight?: InsightDto | null;
  source?: InsightSourceDto | null;
  onSaved: () => Promise<void>;
}

export function InsightEditorDialog({
  open,
  onOpenChange,
  insight,
  source,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(insight?.title ?? source?.sourceText ?? "");
    setContent(insight?.content ?? "");
    setTags(insight?.tags.join("，") ?? "");
  }, [insight, open, source]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(
        insight ? `/api/insights/${insight.id}` : "/api/insights",
        {
          method: insight ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content: content || null,
            tags: tags
              .split(/[，,]/u)
              .map((tag) => tag.trim())
              .filter(Boolean),
            ...(source && !insight ? { sourceId: source.id } : {}),
          }),
        },
      );
      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "保存经验失败");
      toast.success(insight ? "经验已更新" : "经验已创建");
      onOpenChange(false);
      await onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存经验失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {insight ? "编辑经验" : source ? "从周报创建经验" : "新建经验"}
          </DialogTitle>
          <DialogDescription>
            标题写成以后看到情境时能直接理解的一句话规则；标签用逗号分隔。
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="insight-title">一句话经验</Label>
            <Input
              id="insight-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insight-content">补充说明（可选）</Label>
            <Textarea
              id="insight-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              maxLength={5000}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insight-tags">标签</Label>
            <Input
              id="insight-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Level，K线，入场"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving && <Loader2 className="animate-spin" />}保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
