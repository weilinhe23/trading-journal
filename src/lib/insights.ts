import { INSIGHT_TAGS } from "~/types/insights";

const LIST_PREFIX =
  /^\s*(?:(?:[-*•·–—]+)|(?:\d+[.)、．])|(?:[（(]?\d+[）)]))\s*/u;

export interface ParsedInsightLine {
  sourceText: string;
  normalizedText: string;
  sortOrder: number;
}

export function cleanInsightLine(value: string): string {
  return value.normalize("NFKC").replace(LIST_PREFIX, "").trim();
}

export function normalizeInsightText(value: string): string {
  return cleanInsightLine(value).replace(/\s+/gu, " ").toLocaleLowerCase();
}

export function splitInsightLines(
  value: string | null | undefined,
): ParsedInsightLine[] {
  if (!value) return [];

  const seen = new Set<string>();
  const lines: ParsedInsightLine[] = [];
  for (const rawLine of value.replace(/\r\n?/gu, "\n").split("\n")) {
    const sourceText = cleanInsightLine(rawLine);
    const normalizedText = normalizeInsightText(sourceText);
    if (!normalizedText || seen.has(normalizedText)) continue;
    seen.add(normalizedText);
    lines.push({ sourceText, normalizedText, sortOrder: lines.length });
  }
  return lines;
}

export function parseInsightTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [
      ...new Set(
        parsed
          .filter(
            (tag): tag is string =>
              typeof tag === "string" && tag.trim().length > 0,
          )
          .map((tag) => tag.trim()),
      ),
    ];
  } catch {
    return [];
  }
}

export function serializeInsightTags(tags: readonly string[]): string {
  return JSON.stringify([
    ...new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
  ]);
}

export function inferInsightTags(value: string): string[] {
  const normalized = value.normalize("NFKC").toLocaleLowerCase();
  return INSIGHT_TAGS.filter((tag) => {
    if (tag === "K线") return /k线|k-line|candlestick|candle/u.test(normalized);
    if (tag === "15M") return /(?<![a-z0-9])15m(?![a-z0-9])/u.test(normalized);
    if (tag === "5M") return /(?<![a-z0-9])5m(?![a-z0-9])/u.test(normalized);
    if (tag === "1M") return /(?<![a-z0-9])1m(?![a-z0-9])/u.test(normalized);
    return normalized.includes(tag.toLocaleLowerCase());
  });
}

export function tokenizeInsightText(value: string): string[] {
  const normalized = normalizeInsightText(value);
  return [
    ...new Set(
      normalized.split(/[^\p{L}\p{N}]+/u).filter((token) => token.length >= 2),
    ),
  ];
}
