"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Archive,
  BookOpen,
  CalendarDays,
  DatabaseZap,
  ExternalLink,
  FileStack,
  Inbox,
  Layers3,
  Loader2,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { InsightDetailPanel } from "~/components/insights/InsightDetailPanel";
import { InsightEditorDialog } from "~/components/insights/InsightEditorDialog";
import { InsightListItem } from "~/components/insights/InsightListItem";
import { InsightOrganizerDialog } from "~/components/insights/InsightOrganizerDialog";
import { MergeInsightDialog } from "~/components/insights/MergeInsightDialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type {
  InsightDto,
  InsightLibraryDto,
  InsightSortValue,
  InsightSourceDto,
  OrganizableInsightSourceDto,
} from "~/types/insights";
import { formatInsightWeek } from "./insight-colors";

type LibraryTab = "active" | "pending" | "archived" | "ignored";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const LIBRARY_TABS = new Set<LibraryTab>([
  "active",
  "pending",
  "archived",
  "ignored",
]);
const INSIGHT_SORTS = new Set<InsightSortValue>([
  "recent",
  "frequent",
  "updated",
]);

function isLibraryTab(value: string | null): value is LibraryTab {
  return value !== null && LIBRARY_TABS.has(value as LibraryTab);
}

function isInsightSort(value: string | null): value is InsightSortValue {
  return value !== null && INSIGHT_SORTS.has(value as InsightSortValue);
}

function replaceUrlState(patch: Record<string, string | null>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(patch)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, "", url);
}

export function InsightsLibraryClient({
  initialData,
}: {
  initialData: InsightLibraryDto;
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const initialSort = searchParams.get("sort");
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tag, setTag] = useState(searchParams.get("tag") ?? "all");
  const [sort, setSort] = useState<InsightSortValue>(
    isInsightSort(initialSort) ? initialSort : "recent",
  );
  const [tab, setTab] = useState<LibraryTab>(
    isLibraryTab(initialTab) ? initialTab : "active",
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("insight"),
  );
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<InsightDto | null>(null);
  const [creatingSource, setCreatingSource] =
    useState<OrganizableInsightSourceDto | null>(null);
  const [organizingSource, setOrganizingSource] =
    useState<OrganizableInsightSourceDto | null>(null);
  const [mergeSource, setMergeSource] = useState<InsightDto | null>(null);
  const [backfillOpen, setBackfillOpen] = useState(false);
  const [backfill, setBackfill] = useState<{
    reportCount: number;
    sourceCount: number;
  } | null>(null);
  const [backfillWorking, setBackfillWorking] = useState(false);

  const urlState = searchParams.toString();
  useEffect(() => {
    const params = new URLSearchParams(urlState);
    const nextTab = params.get("tab");
    const nextSort = params.get("sort");
    setQuery(params.get("q") ?? "");
    setTag(params.get("tag") ?? "all");
    setSort(isInsightSort(nextSort) ? nextSort : "recent");
    setTab(isLibraryTab(nextTab) ? nextTab : "active");
    setSelectedId(params.get("insight"));
  }, [urlState]);

  async function reload() {
    const response = await fetch("/api/insights", { cache: "no-store" });
    const result = (await response.json()) as ApiResponse<InsightLibraryDto>;
    if (!response.ok || !result.success || !result.data)
      throw new Error(result.error ?? "刷新经验库失败");
    setData(result.data);
  }

  async function patchInsight(
    insight: InsightDto,
    patch: { isPinned?: boolean; status?: "ACTIVE" | "ARCHIVED" },
  ) {
    try {
      const response = await fetch(`/api/insights/${insight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const result = (await response.json()) as ApiResponse<InsightDto>;
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "更新经验失败");
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新经验失败");
    }
  }

  async function updateSource(
    source: InsightSourceDto,
    action: "RESTORE" | "UNLINK",
  ) {
    try {
      const response = await fetch(`/api/insight-sources/${source.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = (await response.json()) as ApiResponse<InsightSourceDto>;
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "更新来源失败");
      toast.success(
        action === "RESTORE" ? "已恢复到待整理" : "已取消归入，回到待整理",
      );
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新来源失败");
    }
  }

  const overview = useMemo(() => {
    let sourceCount = 0;
    let latestWeek: string | null = null;
    const weeks = new Set<string>();
    for (const insight of data.insights) {
      if (insight.status !== "ACTIVE") continue;
      sourceCount += insight.sourceCount;
      for (const source of insight.sources) weeks.add(source.weekStart);
      if (insight.lastSeen && (!latestWeek || insight.lastSeen > latestWeek))
        latestWeek = insight.lastSeen;
    }
    return { sourceCount, weekCount: weeks.size, latestWeek };
  }, [data.insights]);

  const visibleInsights = useMemo(() => {
    if (tab !== "active" && tab !== "archived") return [];
    const status = tab === "active" ? "ACTIVE" : "ARCHIVED";
    const needle = query.trim().toLocaleLowerCase();
    const matches: InsightDto[] = [];

    for (const insight of data.insights) {
      if (insight.status !== status) continue;
      if (tag !== "all" && !insight.tags.includes(tag)) continue;
      if (needle) {
        const searchable = [
          insight.title,
          insight.content ?? "",
          ...insight.tags,
          ...insight.sources.map((source) => source.sourceText),
        ]
          .join(" ")
          .toLocaleLowerCase();
        if (!searchable.includes(needle)) continue;
      }
      matches.push(insight);
    }

    return matches.sort((a, b) => {
      if (a.isPinned !== b.isPinned)
        return Number(b.isPinned) - Number(a.isPinned);
      if (sort === "frequent")
        return (
          b.occurrenceCount - a.occurrenceCount || b.sourceCount - a.sourceCount
        );
      if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
      return (
        (b.lastSeen ?? "").localeCompare(a.lastSeen ?? "") ||
        b.updatedAt.localeCompare(a.updatedAt)
      );
    });
  }, [data.insights, query, sort, tab, tag]);

  const pendingFiltered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle
      ? data.pendingSources.filter((source) =>
          source.sourceText.toLocaleLowerCase().includes(needle),
        )
      : data.pendingSources;
  }, [data.pendingSources, query]);

  const ignoredFiltered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle
      ? data.ignoredSources.filter((source) =>
          source.sourceText.toLocaleLowerCase().includes(needle),
        )
      : data.ignoredSources;
  }, [data.ignoredSources, query]);

  const selectedInsight =
    visibleInsights.find((insight) => insight.id === selectedId) ??
    visibleInsights[0] ??
    null;
  const selectedInsightId = selectedInsight?.id ?? null;
  const maxOccurrenceCount = visibleInsights.reduce(
    (maximum, insight) => Math.max(maximum, insight.occurrenceCount),
    1,
  );

  useEffect(() => {
    if (tab !== "active" && tab !== "archived") return;
    if (selectedId === selectedInsightId) return;
    setSelectedId(selectedInsightId);
    replaceUrlState({ insight: selectedInsightId });
  }, [selectedId, selectedInsightId, tab]);

  async function previewBackfill() {
    setBackfillOpen(true);
    setBackfillWorking(true);
    try {
      const response = await fetch("/api/insights/backfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: true }),
      });
      const result = (await response.json()) as ApiResponse<{
        reportCount: number;
        sourceCount: number;
      }>;
      if (!response.ok || !result.success || !result.data)
        throw new Error(result.error ?? "扫描历史周报失败");
      setBackfill(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "扫描历史周报失败");
      setBackfillOpen(false);
    } finally {
      setBackfillWorking(false);
    }
  }

  async function runBackfill() {
    setBackfillWorking(true);
    try {
      const response = await fetch("/api/insights/backfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: false }),
      });
      const result = (await response.json()) as ApiResponse<{
        failures: unknown[];
      }>;
      if (!response.ok || !result.data)
        throw new Error(result.error ?? "历史回填失败");
      if (!result.success)
        toast.warning(`回填完成，但有 ${result.data.failures.length} 周失败`);
      else toast.success("历史周报经验已回填");
      setBackfillOpen(false);
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "历史回填失败");
    } finally {
      setBackfillWorking(false);
    }
  }

  function openCreate(source: OrganizableInsightSourceDto | null = null) {
    setEditingInsight(null);
    setCreatingSource(source);
    setEditorOpen(true);
  }

  function openEdit(insight: InsightDto) {
    setEditingInsight(insight);
    setCreatingSource(null);
    setEditorOpen(true);
  }

  function selectInsight(insight: InsightDto) {
    setSelectedId(insight.id);
    replaceUrlState({ insight: insight.id });
  }

  function changeTab(value: string) {
    if (!isLibraryTab(value)) return;
    setTab(value);
    setSelectedId(null);
    replaceUrlState({
      tab: value === "active" ? null : value,
      insight: null,
    });
  }

  function changeQuery(value: string) {
    setQuery(value);
    replaceUrlState({ q: value.trim() || null });
  }

  function changeTag(value: string) {
    setTag(value);
    replaceUrlState({ tag: value === "all" ? null : value });
  }

  function changeSort(value: string) {
    if (!isInsightSort(value)) return;
    setSort(value);
    replaceUrlState({ sort: value === "recent" ? null : value });
  }

  const insightTabActive = tab === "active" || tab === "archived";

  return (
    <div className="mx-auto max-w-[1720px] space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary border-primary/15 flex size-10 items-center justify-center rounded-xl border">
            <BookOpen aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-pretty">
              经验库
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              从重复教训中提炼规则，并随时回到原周报验证上下文。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void previewBackfill()}
          >
            <DatabaseZap aria-hidden="true" />
            维护来源
          </Button>
          <Button size="sm" onClick={() => openCreate()}>
            <Plus aria-hidden="true" />
            新建经验
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <OverviewStat
          icon={Layers3}
          label="进行中经验"
          value={`${data.counts.active}`}
          suffix="条"
        />
        <OverviewStat
          icon={FileStack}
          label="已归入来源"
          value={`${overview.sourceCount}`}
          suffix="条"
        />
        <OverviewStat
          icon={CalendarDays}
          label="覆盖周数"
          value={`${overview.weekCount}`}
          suffix="周"
        />
        <OverviewStat
          icon={BookOpen}
          label="最近更新"
          value={formatInsightWeek(overview.latestWeek)}
        />
      </div>

      <Tabs value={tab} onValueChange={changeTab}>
        <div className="bg-card/35 flex flex-col gap-3 rounded-2xl border p-3 xl:flex-row xl:items-center">
          <TabsList className="shrink-0 flex-wrap">
            <TabsTrigger value="active">
              进行中 <Badge variant="secondary">{data.counts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              待整理{" "}
              <Badge variant={data.counts.pending ? "default" : "secondary"}>
                {data.counts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived">
              已归档 <Badge variant="secondary">{data.counts.archived}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ignored">
              已忽略 <Badge variant="secondary">{data.counts.ignored}</Badge>
            </TabsTrigger>
          </TabsList>

          <div
            className={
              insightTabActive
                ? "grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(260px,1fr)_160px_150px]"
                : "min-w-0 flex-1"
            }
          >
            <div className="relative min-w-0">
              <Search
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4"
              />
              <Input
                aria-label="搜索经验库"
                name="insight-search"
                autoComplete="off"
                className="bg-background/50 pl-9"
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                placeholder={
                  insightTabActive
                    ? "搜索标题、标签或来源原文…"
                    : "搜索周报来源…"
                }
              />
            </div>
            {insightTabActive ? (
              <>
                <Select value={tag} onValueChange={changeTag}>
                  <SelectTrigger
                    aria-label="按标签筛选"
                    className="bg-background/50 w-full"
                  >
                    <SelectValue placeholder="全部标签" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部标签</SelectItem>
                    {data.availableTags.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={changeSort}>
                  <SelectTrigger
                    aria-label="经验排序方式"
                    className="bg-background/50 w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">最近出现</SelectItem>
                    <SelectItem value="frequent">出现频率</SelectItem>
                    <SelectItem value="updated">最近编辑</SelectItem>
                  </SelectContent>
                </Select>
              </>
            ) : null}
          </div>
        </div>

        {insightTabActive ? (
          <TabsContent value={tab} className="mt-4">
            <div className="grid min-w-0 gap-4 xl:h-[calc(100vh-19rem)] xl:min-h-[620px] xl:grid-cols-[420px_minmax(0,1fr)] 2xl:grid-cols-[480px_minmax(0,1fr)]">
              <aside className="bg-card/35 flex min-h-0 flex-col overflow-hidden rounded-2xl border">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div>
                    <h2 className="text-sm font-medium">
                      {tab === "active" ? "经验索引" : "归档经验"}
                    </h2>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      当前显示 {visibleInsights.length} 条
                    </p>
                  </div>
                  {tag !== "all" ? (
                    <Badge variant="outline">{tag}</Badge>
                  ) : null}
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-2">
                  {visibleInsights.map((insight) => (
                    <InsightListItem
                      key={insight.id}
                      insight={insight}
                      selected={insight.id === selectedInsightId}
                      maxOccurrenceCount={maxOccurrenceCount}
                      onSelect={selectInsight}
                    />
                  ))}
                  {visibleInsights.length === 0 ? (
                    <Empty
                      icon={Archive}
                      text={
                        tab === "active"
                          ? "暂无符合条件的经验"
                          : "暂无已归档经验"
                      }
                      compact
                    />
                  ) : null}
                </div>
              </aside>

              <InsightDetailPanel
                insight={selectedInsight}
                onEdit={openEdit}
                onMerge={setMergeSource}
                onPatch={patchInsight}
                onUnlink={(source) => updateSource(source, "UNLINK")}
              />
            </div>
          </TabsContent>
        ) : null}

        <TabsContent value="pending" className="mt-4">
          {pendingFiltered.length > 0 ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {pendingFiltered.map((source) => (
                <Card
                  key={source.id}
                  className="gap-3 border-amber-400/10 py-4 [contain-intrinsic-size:0_128px] [content-visibility:auto]"
                >
                  <CardContent className="flex min-w-0 flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="text-sm leading-6 break-words">
                        {source.sourceText}
                      </p>
                      <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <Link
                          className="text-primary inline-flex items-center gap-1 hover:underline"
                          href={`/weekly/${source.weekStart}`}
                        >
                          {formatInsightWeek(source.weekStart)}
                          <ExternalLink aria-hidden="true" className="size-3" />
                        </Link>
                        {source.candidates.length > 0 ? (
                          <Badge variant="outline">
                            {source.candidates.length} 条匹配建议
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setOrganizingSource(source)}
                    >
                      整理经验
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Empty icon={Inbox} text="没有待整理的周报经验" />
          )}
        </TabsContent>

        <TabsContent value="ignored" className="mt-4">
          {ignoredFiltered.length > 0 ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {ignoredFiltered.map((source) => (
                <Card
                  key={source.id}
                  className="gap-3 py-4 opacity-75 [contain-intrinsic-size:0_120px] [content-visibility:auto]"
                >
                  <CardContent className="flex min-w-0 flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-sm leading-6 break-words">
                        {source.sourceText}
                      </p>
                      <Link
                        className="text-primary mt-2 inline-flex items-center gap-1 text-xs hover:underline"
                        href={`/weekly/${source.weekStart}`}
                      >
                        {formatInsightWeek(source.weekStart)}
                        <ExternalLink aria-hidden="true" className="size-3" />
                      </Link>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void updateSource(source, "RESTORE")}
                    >
                      <RotateCcw aria-hidden="true" />
                      恢复到待整理
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Empty icon={Inbox} text="没有已忽略的来源" />
          )}
        </TabsContent>
      </Tabs>

      <InsightEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        insight={editingInsight}
        source={creatingSource}
        onSaved={reload}
      />
      <InsightOrganizerDialog
        open={organizingSource !== null}
        onOpenChange={(open) => {
          if (!open) setOrganizingSource(null);
        }}
        source={organizingSource}
        insights={data.insights}
        onCreate={(source) => openCreate(source)}
        onChanged={reload}
      />
      <MergeInsightDialog
        open={mergeSource !== null}
        onOpenChange={(open) => {
          if (!open) setMergeSource(null);
        }}
        source={mergeSource}
        insights={data.insights}
        onMerged={reload}
      />
      <Dialog open={backfillOpen} onOpenChange={setBackfillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>维护历史来源</DialogTitle>
            <DialogDescription>
              逐周扫描已有“核心经验教训”，补齐尚未同步的来源。重复执行不会产生重复数据。
            </DialogDescription>
          </DialogHeader>
          {backfillWorking && !backfill ? (
            <div className="flex justify-center py-8">
              <Loader2 aria-label="正在扫描" className="animate-spin" />
            </div>
          ) : backfill ? (
            <div className="bg-muted/40 rounded-lg border p-4">
              <p>
                发现 <strong>{backfill.reportCount}</strong>{" "}
                份包含经验的周报，共 <strong>{backfill.sourceCount}</strong>{" "}
                条去重后的原文。
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                维护操作只补齐来源，不会自动创建或归并经验。
              </p>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBackfillOpen(false)}>
              取消
            </Button>
            <Button
              disabled={!backfill || backfillWorking}
              onClick={() => void runBackfill()}
            >
              {backfillWorking ? (
                <Loader2 aria-hidden="true" className="animate-spin" />
              ) : null}
              确认补齐来源
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OverviewStat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="bg-card/40 flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3">
      <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-[11px]">{label}</p>
        <p className="truncate text-lg font-semibold tabular-nums">
          {value}
          {suffix ? (
            <span className="text-muted-foreground ml-1 text-xs font-normal">
              {suffix}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function Empty({
  icon: Icon,
  text,
  compact = false,
}: {
  icon: typeof Inbox;
  text: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed text-sm ${compact ? "py-12" : "py-20"}`}
    >
      <Icon aria-hidden="true" className="size-8 opacity-40" />
      <p>{text}</p>
    </div>
  );
}
