import { createHash } from "node:crypto";
import type { Prisma } from "../../generated/prisma";
import { prisma } from "~/lib/prisma";
import {
  inferInsightTags,
  normalizeInsightText,
  parseInsightTags,
  serializeInsightTags,
  splitInsightLines,
  tokenizeInsightText,
} from "~/lib/insights";
import type {
  InsightCandidateDto,
  InsightDto,
  InsightLibraryDto,
  InsightSourceDto,
  OrganizableInsightSourceDto,
} from "~/types/insights";

export class InsightNotFoundError extends Error {}
export class InsightConflictError extends Error {}

const insightInclude = {
  sources: {
    where: { state: "LINKED" as const },
    orderBy: [{ weekStart: "desc" as const }, { sortOrder: "asc" as const }],
  },
} satisfies Prisma.InsightInclude;

type InsightWithSources = Prisma.InsightGetPayload<{
  include: typeof insightInclude;
}>;
type SourceRecord = Prisma.InsightSourceGetPayload<object>;

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function hashInsightText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function sourceToDto(source: SourceRecord): InsightSourceDto {
  return {
    id: source.id,
    weekStart: dateString(source.weekStart),
    sourceText: source.sourceText,
    state: source.state,
    insightId: source.insightId,
    isCurrent: source.isCurrent,
    sortOrder: source.sortOrder,
    createdAt: source.createdAt.toISOString(),
    updatedAt: source.updatedAt.toISOString(),
  };
}

function insightToDto(insight: InsightWithSources): InsightDto {
  const weeks = [
    ...new Set(insight.sources.map((source) => dateString(source.weekStart))),
  ];
  return {
    id: insight.id,
    title: insight.title,
    content: insight.content,
    tags: parseInsightTags(insight.tagsJson),
    status: insight.status,
    isPinned: insight.isPinned,
    occurrenceCount: weeks.length,
    sourceCount: insight.sources.length,
    lastSeen: weeks[0] ?? null,
    createdAt: insight.createdAt.toISOString(),
    updatedAt: insight.updatedAt.toISOString(),
    sources: insight.sources.map(sourceToDto),
  };
}

function scoreCandidate(
  sourceText: string,
  insight: InsightDto,
): InsightCandidateDto | null {
  const sourceNormalized = normalizeInsightText(sourceText);
  const titleNormalized = normalizeInsightText(insight.title);
  const sourceTags = inferInsightTags(sourceText);
  const titleTokens = tokenizeInsightText(insight.title);
  const contentTokens = tokenizeInsightText(insight.content ?? "");
  const sourceTokens = new Set(tokenizeInsightText(sourceText));
  const reasons: string[] = [];
  let score = 0;

  if (sourceNormalized === titleNormalized) {
    score += 100;
    reasons.push("标题完全一致");
  } else if (
    sourceNormalized.includes(titleNormalized) ||
    titleNormalized.includes(sourceNormalized)
  ) {
    score += 35;
    reasons.push("标题高度相似");
  }

  const sharedTags = insight.tags.filter((tag) => sourceTags.includes(tag));
  if (sharedTags.length > 0) {
    score += sharedTags.length * 18;
    reasons.push(`共同标签：${sharedTags.join("、")}`);
  }

  const sharedTitleTokens = titleTokens.filter((token) =>
    sourceTokens.has(token),
  );
  if (sharedTitleTokens.length > 0) {
    score += Math.min(sharedTitleTokens.length * 10, 30);
    reasons.push("标题关键词重合");
  }

  if (contentTokens.some((token) => sourceTokens.has(token))) {
    score += 5;
    reasons.push("说明关键词重合");
  }

  if (insight.isPinned) score += 1;
  return score > 0 ? { insight, score, reasons } : null;
}

function rankCandidates(
  sourceText: string,
  insights: InsightDto[],
): InsightCandidateDto[] {
  return insights
    .map((insight) => scoreCandidate(sourceText, insight))
    .filter((candidate): candidate is InsightCandidateDto => candidate !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.insight.isPinned) - Number(a.insight.isPinned) ||
        (b.insight.lastSeen ?? "").localeCompare(a.insight.lastSeen ?? ""),
    )
    .slice(0, 5);
}

export async function syncWeeklyInsightSources(
  weekStart: Date,
  keyLessons: string | null | undefined,
) {
  const lines = splitInsightLines(keyLessons).map((line) => ({
    ...line,
    sourceHash: hashInsightText(line.normalizedText),
  }));
  const existing = await prisma.insightSource.findMany({
    where: { weekStart },
  });
  const incomingHashes = new Set(lines.map((line) => line.sourceHash));
  let created = 0;
  let restored = 0;
  let updated = 0;
  let removed = 0;
  let historical = 0;

  await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      const current = existing.find(
        (source) => source.sourceHash === line.sourceHash,
      );
      if (!current) {
        await tx.insightSource.create({ data: { weekStart, ...line } });
        created += 1;
      } else {
        await tx.insightSource.update({
          where: { id: current.id },
          data: {
            sourceText: line.sourceText,
            normalizedText: line.normalizedText,
            sortOrder: line.sortOrder,
            isCurrent: true,
          },
        });
        if (!current.isCurrent) restored += 1;
        else updated += 1;
      }
    }

    for (const source of existing) {
      if (incomingHashes.has(source.sourceHash)) continue;
      if (source.state === "PENDING") {
        await tx.insightSource.delete({ where: { id: source.id } });
        removed += 1;
      } else if (source.isCurrent) {
        await tx.insightSource.update({
          where: { id: source.id },
          data: { isCurrent: false },
        });
        historical += 1;
      }
    }
  });

  return {
    created,
    restored,
    updated,
    removed,
    historical,
    total: lines.length,
  };
}

export async function getInsightLibrary(): Promise<InsightLibraryDto> {
  const [insightRecords, pendingRecords, ignoredRecords] = await Promise.all([
    prisma.insight.findMany({
      include: insightInclude,
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.insightSource.findMany({
      where: { state: "PENDING", isCurrent: true },
      orderBy: [{ weekStart: "desc" }, { sortOrder: "asc" }],
    }),
    prisma.insightSource.findMany({
      where: { state: "IGNORED", isCurrent: true },
      orderBy: [{ weekStart: "desc" }, { sortOrder: "asc" }],
    }),
  ]);
  const insights = insightRecords.map(insightToDto);
  const activeInsights = insights.filter(
    (insight) => insight.status === "ACTIVE",
  );
  const pendingSources: OrganizableInsightSourceDto[] = pendingRecords.map(
    (source) => ({
      ...sourceToDto(source),
      candidates: rankCandidates(source.sourceText, activeInsights),
    }),
  );
  const availableTags = [
    ...new Set(insights.flatMap((insight) => insight.tags)),
  ].sort((a, b) => a.localeCompare(b, "zh-CN"));

  return {
    insights,
    pendingSources,
    ignoredSources: ignoredRecords.map(sourceToDto),
    counts: {
      active: activeInsights.length,
      pending: pendingSources.length,
      archived: insights.length - activeInsights.length,
      ignored: ignoredRecords.length,
    },
    availableTags,
  };
}

export async function getWeeklyInsightSources(weekStart: Date) {
  const library = await getInsightLibrary();
  const activeInsights = library.insights.filter(
    (insight) => insight.status === "ACTIVE",
  );
  const records = await prisma.insightSource.findMany({
    where: { weekStart },
    orderBy: [
      { isCurrent: "desc" },
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
  });
  return records.map((source) => ({
    ...sourceToDto(source),
    candidates:
      source.state === "PENDING"
        ? rankCandidates(source.sourceText, activeInsights)
        : [],
  }));
}

interface InsightInput {
  title: string;
  content?: string | null;
  tags?: string[];
  sourceId?: string;
}

export async function createInsight(input: InsightInput): Promise<InsightDto> {
  const title = input.title.trim();
  const insight = await prisma.$transaction(async (tx) => {
    const created = await tx.insight.create({
      data: {
        title,
        content: input.content?.trim() ? input.content.trim() : null,
        tagsJson: serializeInsightTags(
          input.tags?.length
            ? input.tags
            : inferInsightTags(`${title} ${input.content ?? ""}`),
        ),
      },
    });
    if (input.sourceId) {
      const result = await tx.insightSource.updateMany({
        where: { id: input.sourceId, state: "PENDING", isCurrent: true },
        data: { state: "LINKED", insightId: created.id },
      });
      if (result.count !== 1)
        throw new InsightConflictError("来源已被整理或不再有效");
    }
    return tx.insight.findUniqueOrThrow({
      where: { id: created.id },
      include: insightInclude,
    });
  });
  return insightToDto(insight);
}

export async function updateInsight(
  id: string,
  input: Partial<InsightInput> & {
    status?: "ACTIVE" | "ARCHIVED";
    isPinned?: boolean;
  },
): Promise<InsightDto> {
  const existing = await prisma.insight.findUnique({ where: { id } });
  if (!existing) throw new InsightNotFoundError("经验不存在");
  const insight = await prisma.insight.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.content !== undefined
        ? { content: input.content?.trim() ? input.content.trim() : null }
        : {}),
      ...(input.tags !== undefined
        ? { tagsJson: serializeInsightTags(input.tags) }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.isPinned !== undefined ? { isPinned: input.isPinned } : {}),
    },
    include: insightInclude,
  });
  return insightToDto(insight);
}

export async function updateInsightSource(
  sourceId: string,
  action: "LINK" | "IGNORE" | "RESTORE" | "UNLINK",
  insightId?: string,
) {
  if (action === "LINK") {
    if (!insightId) throw new InsightConflictError("请选择目标经验");
    const target = await prisma.insight.findFirst({
      where: { id: insightId, status: "ACTIVE" },
    });
    if (!target) throw new InsightNotFoundError("目标经验不存在或已归档");
    const result = await prisma.insightSource.updateMany({
      where: { id: sourceId, state: "PENDING", isCurrent: true },
      data: { state: "LINKED", insightId },
    });
    if (result.count !== 1)
      throw new InsightConflictError("来源已被整理或不再有效");
  } else if (action === "IGNORE") {
    const result = await prisma.insightSource.updateMany({
      where: { id: sourceId, state: "PENDING", isCurrent: true },
      data: { state: "IGNORED", insightId: null },
    });
    if (result.count !== 1)
      throw new InsightConflictError("来源已被整理或不再有效");
  } else if (action === "RESTORE") {
    const result = await prisma.insightSource.updateMany({
      where: { id: sourceId, state: "IGNORED", isCurrent: true },
      data: { state: "PENDING", insightId: null },
    });
    if (result.count !== 1)
      throw new InsightConflictError("只有当前被忽略的来源可以恢复");
  } else {
    const result = await prisma.insightSource.updateMany({
      where: { id: sourceId, state: "LINKED", isCurrent: true },
      data: { state: "PENDING", insightId: null },
    });
    if (result.count !== 1)
      throw new InsightConflictError("只有当前已归入的来源可以取消归入");
  }
  const updated = await prisma.insightSource.findUnique({
    where: { id: sourceId },
  });
  if (!updated) throw new InsightNotFoundError("来源不存在");
  return sourceToDto(updated);
}

export async function mergeInsights(
  sourceId: string,
  targetId: string,
  resolved?: Partial<InsightInput>,
) {
  if (sourceId === targetId)
    throw new InsightConflictError("不能合并同一条经验");
  return prisma.$transaction(async (tx) => {
    const [source, target] = await Promise.all([
      tx.insight.findUnique({ where: { id: sourceId } }),
      tx.insight.findFirst({ where: { id: targetId, status: "ACTIVE" } }),
    ]);
    if (!source) throw new InsightNotFoundError("待合并经验不存在");
    if (!target) throw new InsightNotFoundError("目标经验不存在或已归档");
    await tx.insightSource.updateMany({
      where: { insightId: sourceId },
      data: { insightId: targetId },
    });
    const mergedTags = resolved?.tags ?? [
      ...new Set([
        ...parseInsightTags(target.tagsJson),
        ...parseInsightTags(source.tagsJson),
      ]),
    ];
    await tx.insight.update({
      where: { id: targetId },
      data: {
        title: resolved?.title?.trim() ?? target.title,
        content:
          resolved?.content === undefined
            ? target.content
            : resolved.content?.trim()
              ? resolved.content.trim()
              : null,
        tagsJson: serializeInsightTags(mergedTags),
        isPinned: target.isPinned || source.isPinned,
      },
    });
    await tx.insight.delete({ where: { id: sourceId } });
    const merged = await tx.insight.findUniqueOrThrow({
      where: { id: targetId },
      include: insightInclude,
    });
    return insightToDto(merged);
  });
}
