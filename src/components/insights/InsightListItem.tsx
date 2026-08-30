"use client";

import { Pin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import type { InsightDto } from "~/types/insights";
import { formatInsightWeek, getInsightAccent } from "./insight-colors";

interface Props {
  insight: InsightDto;
  selected: boolean;
  maxOccurrenceCount: number;
  onSelect: (insight: InsightDto) => void;
}

export function InsightListItem({
  insight,
  selected,
  maxOccurrenceCount,
  onSelect,
}: Props) {
  const accent = getInsightAccent(insight.tags, insight.title);
  const latestSource =
    insight.sources.find((source) => source.isCurrent) ?? insight.sources[0];
  const frequency = Math.max(
    8,
    Math.round(
      (insight.occurrenceCount / Math.max(maxOccurrenceCount, 1)) * 100,
    ),
  );

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`查看经验：${insight.title}`}
      onClick={() => onSelect(insight)}
      className={cn(
        "group bg-card/55 relative w-full overflow-hidden rounded-xl border p-4 text-left shadow-sm",
        "transition-[border-color,background-color,box-shadow,transform] duration-150",
        "hover:border-foreground/20 hover:bg-card hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "[contain-intrinsic-size:0_126px] [content-visibility:auto]",
        selected && accent.selected,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-3 left-0 w-0.5 rounded-r-full opacity-60",
          accent.rail,
          selected && "w-1 opacity-100",
        )}
      />

      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-[15px] leading-6 font-semibold">
              {insight.title}
            </h3>
            {insight.isPinned ? (
              <Pin
                aria-label="已置顶"
                className="size-3.5 shrink-0 text-amber-300"
              />
            ) : null}
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            {insight.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn("h-5 px-1.5 text-[10px]", accent.badge)}
              >
                {tag}
              </Badge>
            ))}
            <span className="text-muted-foreground truncate text-[11px] tabular-nums">
              最近 {formatInsightWeek(insight.lastSeen)}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold tabular-nums">
            {insight.occurrenceCount}
            <span className="text-muted-foreground ml-0.5 text-[10px] font-normal">
              周
            </span>
          </div>
          <p className="text-muted-foreground text-[10px] tabular-nums">
            {insight.sourceCount} 条来源
          </p>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 line-clamp-2 min-h-10 text-xs leading-5 break-words">
        {latestSource?.sourceText ?? insight.content ?? "尚未添加来源说明"}
      </p>

      <div className="bg-muted mt-3 h-1 overflow-hidden rounded-full">
        <div
          aria-hidden="true"
          className={cn("h-full rounded-full", accent.progress)}
          style={{ width: `${frequency}%` }}
        />
      </div>
    </button>
  );
}
