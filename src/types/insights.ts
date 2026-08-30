export const INSIGHT_TAGS = [
  "Level",
  "K线",
  "15M",
  "5M",
  "1M",
  "VWAP",
  "Gap",
  "入场",
  "退出",
  "趋势",
  "震荡",
  "新闻",
  "纪律",
] as const;

export type InsightStatusValue = "ACTIVE" | "ARCHIVED";
export type InsightSourceStateValue = "PENDING" | "LINKED" | "IGNORED";
export type InsightSortValue = "recent" | "frequent" | "updated";

export interface InsightSourceDto {
  id: string;
  weekStart: string;
  sourceText: string;
  state: InsightSourceStateValue;
  insightId: string | null;
  isCurrent: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface InsightDto {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  status: InsightStatusValue;
  isPinned: boolean;
  occurrenceCount: number;
  sourceCount: number;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
  sources: InsightSourceDto[];
}

export interface InsightCandidateDto {
  insight: InsightDto;
  score: number;
  reasons: string[];
}

export interface OrganizableInsightSourceDto extends InsightSourceDto {
  candidates: InsightCandidateDto[];
}

export interface InsightLibraryDto {
  insights: InsightDto[];
  pendingSources: OrganizableInsightSourceDto[];
  ignoredSources: InsightSourceDto[];
  counts: {
    active: number;
    pending: number;
    archived: number;
    ignored: number;
  };
  availableTags: string[];
}
