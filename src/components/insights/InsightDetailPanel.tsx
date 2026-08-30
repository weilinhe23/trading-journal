"use client";

import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  CalendarClock,
  ExternalLink,
  FileText,
  GitMerge,
  Pencil,
  Pin,
  PinOff,
  Undo2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { InsightDto, InsightSourceDto } from "~/types/insights";
import { formatInsightWeek, getInsightAccent } from "./insight-colors";

interface Props {
  insight: InsightDto | null;
  onEdit: (insight: InsightDto) => void;
  onMerge: (insight: InsightDto) => void;
  onPatch: (
    insight: InsightDto,
    patch: { isPinned?: boolean; status?: "ACTIVE" | "ARCHIVED" },
  ) => Promise<void>;
  onUnlink: (source: InsightSourceDto) => Promise<void>;
}

export function InsightDetailPanel({
  insight,
  onEdit,
  onMerge,
  onPatch,
  onUnlink,
}: Props) {
  if (!insight) {
    return (
      <section className="bg-card/45 text-muted-foreground flex h-full min-h-96 items-center justify-center rounded-2xl border border-dashed p-8 text-center">
        <div>
          <FileText className="mx-auto size-10 opacity-30" />
          <h2 className="text-foreground mt-4 font-medium">选择一条经验</h2>
          <p className="mt-1 text-sm">右侧将显示经验详情和全部周报来源。</p>
        </div>
      </section>
    );
  }

  const accent = getInsightAccent(insight.tags, insight.title);
  const firstSeen = insight.sources.reduce<string | null>(
    (earliest, source) => {
      if (!earliest || source.weekStart < earliest) return source.weekStart;
      return earliest;
    },
    null,
  );

  return (
    <section className="bg-card/70 flex h-full min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border shadow-xl shadow-black/10">
      <div
        className={cn(
          "relative border-b bg-gradient-to-r to-transparent px-6 py-5 2xl:px-7",
          accent.glow,
        )}
      >
        <div className="flex flex-col justify-between gap-4 2xl:flex-row 2xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl leading-8 font-semibold text-pretty 2xl:text-2xl">
                {insight.title}
              </h2>
              {insight.isPinned ? (
                <Badge variant="secondary" className="text-amber-300">
                  <Pin aria-hidden="true" />
                  置顶
                </Badge>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {insight.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={accent.badge}>
                  {tag}
                </Badge>
              ))}
            </div>
            {insight.content ? (
              <p className="text-muted-foreground mt-3 max-w-4xl text-sm leading-6 whitespace-pre-wrap">
                {insight.content}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(insight)}
            >
              <Pencil aria-hidden="true" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                void onPatch(insight, { isPinned: !insight.isPinned })
              }
            >
              {insight.isPinned ? (
                <PinOff aria-hidden="true" />
              ) : (
                <Pin aria-hidden="true" />
              )}
              {insight.isPinned ? "取消置顶" : "置顶"}
            </Button>
            {insight.status === "ACTIVE" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMerge(insight)}
              >
                <GitMerge aria-hidden="true" />
                合并
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                void onPatch(insight, {
                  status: insight.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
                })
              }
            >
              {insight.status === "ACTIVE" ? (
                <Archive aria-hidden="true" />
              ) : (
                <ArchiveRestore aria-hidden="true" />
              )}
              {insight.status === "ACTIVE" ? "归档" : "恢复"}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Metric label="出现周数" value={`${insight.occurrenceCount} 周`} />
          <Metric label="来源记录" value={`${insight.sourceCount} 条`} />
          <Metric label="首次出现" value={formatInsightWeek(firstSeen)} />
          <Metric
            label="最近出现"
            value={formatInsightWeek(insight.lastSeen)}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-4 2xl:px-7">
          <div>
            <h3 className="font-medium">来源时间线</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              按周报时间倒序排列，共 {insight.sources.length} 条记录
            </p>
          </div>
          <CalendarClock
            aria-hidden="true"
            className="text-muted-foreground size-5"
          />
        </div>
        <Separator />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2 2xl:px-7">
          {insight.sources.length > 0 ? (
            <ol className="relative ml-2 border-l py-2">
              {insight.sources.map((source) => (
                <li
                  key={source.id}
                  className="group relative grid min-w-0 gap-2 border-b py-4 pr-1 pl-6 [contain-intrinsic-size:0_96px] [content-visibility:auto] last:border-b-0 md:grid-cols-[112px_minmax(0,1fr)_32px] md:gap-4"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "bg-card absolute top-6 -left-1.5 size-3 rounded-full border-2",
                      accent.dot,
                    )}
                  />
                  <div className="flex items-center gap-2 md:block">
                    <time
                      dateTime={source.weekStart}
                      className="text-foreground text-xs font-medium tabular-nums"
                    >
                      {formatInsightWeek(source.weekStart)}
                    </time>
                    {!source.isCurrent ? (
                      <Badge variant="outline" className="mt-1 h-5 text-[10px]">
                        历史原文
                      </Badge>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-4xl text-sm leading-6 break-words">
                      {source.sourceText}
                    </p>
                    <Link
                      className="text-muted-foreground hover:text-primary mt-1.5 inline-flex items-center gap-1 text-xs transition-colors"
                      href={`/weekly/${source.weekStart}`}
                    >
                      查看当周周报{" "}
                      <ExternalLink aria-hidden="true" className="size-3" />
                    </Link>
                  </div>
                  <div className="flex justify-end">
                    {source.isCurrent ? (
                      <Button
                        aria-label={`取消归入：${source.sourceText}`}
                        title="取消归入"
                        variant="ghost"
                        size="icon-xs"
                        className="opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                        onClick={() => void onUnlink(source)}
                      >
                        <Undo2 aria-hidden="true" />
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-muted-foreground flex h-full min-h-48 items-center justify-center text-sm">
              这条经验还没有关联的周报来源
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/70 bg-background/35 rounded-lg border px-3 py-2.5">
      <p className="text-muted-foreground text-[10px] tracking-wide">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
