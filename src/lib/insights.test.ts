import { describe, expect, it } from "vitest";
import {
  cleanInsightLine,
  inferInsightTags,
  normalizeInsightText,
  parseInsightTags,
  serializeInsightTags,
  splitInsightLines,
} from "~/lib/insights";

describe("insight text parsing", () => {
  it("splits only on line breaks and removes common list prefixes", () => {
    expect(
      splitInsightLines(
        "1. 不在行情中间进入\n- Level 与 K线冲突时提高 Level 权重\n• 等待 VWAP 站稳。不要追价。",
      ),
    ).toEqual([
      {
        sourceText: "不在行情中间进入",
        normalizedText: "不在行情中间进入",
        sortOrder: 0,
      },
      {
        sourceText: "Level 与 K线冲突时提高 Level 权重",
        normalizedText: "level 与 k线冲突时提高 level 权重",
        sortOrder: 1,
      },
      {
        sourceText: "等待 VWAP 站稳。不要追价。",
        normalizedText: "等待 vwap 站稳。不要追价。",
        sortOrder: 2,
      },
    ]);
  });

  it("normalizes full-width text and whitespace", () => {
    expect(cleanInsightLine("（１）  ＶＷＡＰ   站稳 ")).toBe("VWAP   站稳");
    expect(normalizeInsightText(" Ｌｅｖｅｌ   优先 ")).toBe("level 优先");
  });

  it("deduplicates equivalent lines within one week", () => {
    expect(splitInsightLines("- 等待确认\n2、等待确认\n等待确认")).toHaveLength(
      1,
    );
  });
});

describe("insight tags", () => {
  it("infers deterministic trading tags", () => {
    expect(inferInsightTags("15M K线回踩 VWAP 后再入场")).toEqual([
      "K线",
      "15M",
      "VWAP",
      "入场",
    ]);
  });

  it("round-trips and sanitizes stored tags", () => {
    expect(
      parseInsightTags(serializeInsightTags(["Level", " Level ", "入场"])),
    ).toEqual(["Level", "入场"]);
    expect(parseInsightTags("not-json")).toEqual([]);
  });
});
