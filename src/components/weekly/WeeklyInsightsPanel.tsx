"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InsightEditorDialog } from "~/components/insights/InsightEditorDialog";
import { InsightOrganizerDialog } from "~/components/insights/InsightOrganizerDialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type {
  InsightLibraryDto,
  OrganizableInsightSourceDto,
} from "~/types/insights";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Props {
  weekStart: string;
  pendingCount: number;
  syncFailed: boolean;
  onSyncRecovered: () => void;
}

export function WeeklyInsightsPanel({
  weekStart,
  pendingCount,
  syncFailed,
  onSyncRecovered,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [sources, setSources] = useState<OrganizableInsightSourceDto[]>([]);
  const [library, setLibrary] = useState<InsightLibraryDto | null>(null);
  const [organizingSource, setOrganizingSource] =
    useState<OrganizableInsightSourceDto | null>(null);
  const [creatingSource, setCreatingSource] =
    useState<OrganizableInsightSourceDto | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [sourcesResponse, libraryResponse] = await Promise.all([
        fetch(`/api/weekly-reports/${weekStart}/insights`, {
          cache: "no-store",
        }),
        fetch("/api/insights", { cache: "no-store" }),
      ]);
      const sourcesResult = (await sourcesResponse.json()) as ApiResponse<
        OrganizableInsightSourceDto[]
      >;
      const libraryResult =
        (await libraryResponse.json()) as ApiResponse<InsightLibraryDto>;
      if (!sourcesResponse.ok || !sourcesResult.success || !sourcesResult.data)
        throw new Error(sourcesResult.error ?? "读取本周经验失败");
      if (!libraryResponse.ok || !libraryResult.success || !libraryResult.data)
        throw new Error(libraryResult.error ?? "读取经验库失败");
      setSources(
        sourcesResult.data.filter((source) => source.state === "PENDING"),
      );
      setLibrary(libraryResult.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "读取本周经验失败");
    } finally {
      setLoading(false);
    }
  }

  async function openOrganizer() {
    setOpen(true);
    await load();
  }

  async function retrySync() {
    setRetrying(true);
    try {
      const response = await fetch(
        `/api/weekly-reports/${weekStart}/insights`,
        { method: "POST" },
      );
      const result = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "同步失败");
      toast.success("本周经验已重新同步");
      onSyncRecovered();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "同步失败");
    } finally {
      setRetrying(false);
    }
  }

  async function handleChanged() {
    await load();
    router.refresh();
  }

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          保存周报后，每行会自动进入经验库来源。
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {syncFailed && (
            <Button
              variant="ghost"
              size="xs"
              disabled={retrying}
              onClick={() => void retrySync()}
            >
              {retrying ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              重试同步
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => void openOrganizer()}
          >
            整理本周经验
            {pendingCount > 0 && <Badge>{pendingCount}</Badge>}
          </Button>
          <Button asChild variant="link" size="xs">
            <Link href="/insights">
              查看经验库 <ExternalLink />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>本周待整理经验</DialogTitle>
            <DialogDescription>
              逐条归入已有经验、新建经验，或忽略不需要沉淀的内容。
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : sources.length > 0 ? (
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm leading-6">{source.sourceText}</p>
                    {source.candidates.length > 0 && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {source.candidates.length} 条匹配建议
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      setOrganizingSource(source);
                    }}
                  >
                    整理
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-12 text-center text-sm">
              本周没有待整理经验
            </p>
          )}
        </DialogContent>
      </Dialog>

      <InsightOrganizerDialog
        open={organizingSource !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setOrganizingSource(null);
        }}
        source={organizingSource}
        insights={library?.insights ?? []}
        onCreate={(source) => {
          setOrganizingSource(null);
          setCreatingSource(source);
        }}
        onChanged={handleChanged}
      />
      <InsightEditorDialog
        open={creatingSource !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setCreatingSource(null);
        }}
        source={creatingSource}
        onSaved={handleChanged}
      />
    </>
  );
}
