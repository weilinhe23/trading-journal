export const MNQ_LEVEL_OPTIONS = [
  { value: "PDH", label: "PDH（前日高）" },
  { value: "PDL", label: "PDL（前日低）" },
  { value: "PDC", label: "PDC（前日收盘）" },
  { value: "PMH", label: "PMH（盘前高）" },
  { value: "PML", label: "PML（盘前低）" },
  { value: "ONH", label: "ONH（隔夜高）" },
  { value: "ONL", label: "ONL（隔夜低）" },
  { value: "VWAP", label: "VWAP" },
  { value: "DL_15M", label: "DL（15M）" },
  { value: "DH_15M", label: "DH（15M）" },
  { value: "PREMARKET_FGV", label: "盘前 FGV" },
  { value: "DAY_LEVEL", label: "Day Level" },
  { value: "CUSTOM", label: "自定义 Level" },
] as const;

export type MnqLevelCode = (typeof MNQ_LEVEL_OPTIONS)[number]["value"];
export type MnqLevelChainSide = "upper" | "lower";

export const MNQ_LEVEL_TIMEFRAME_OPTIONS = [
  { value: "M1", label: "1M" },
  { value: "M5", label: "5M" },
  { value: "M15", label: "15M" },
  { value: "M30", label: "30M" },
] as const;

export type MnqLevelTimeframe =
  (typeof MNQ_LEVEL_TIMEFRAME_OPTIONS)[number]["value"];

export const MNQ_LEVEL_EXPECTED_REACTIONS = [
  { value: "REJECT", label: "测试后拒绝" },
  { value: "BREAK_ACCEPT_ABOVE", label: "突破并接受" },
  { value: "BREAK_ACCEPT_BELOW", label: "跌破并接受" },
  { value: "SWEEP_RECLAIM", label: "Sweep 后收回" },
  { value: "UNCERTAIN", label: "不确定" },
] as const;

export type MnqLevelExpectedReaction =
  (typeof MNQ_LEVEL_EXPECTED_REACTIONS)[number]["value"];

export const MNQ_LEVEL_ACTUAL_REACTIONS = [
  { value: "TESTING", label: "仍在测试" },
  { value: "REJECTED", label: "测试后拒绝" },
  { value: "BREAK_ACCEPT_ABOVE", label: "突破并接受" },
  { value: "BREAK_ACCEPT_BELOW", label: "跌破并接受" },
  { value: "SWEPT_RECLAIMED", label: "Sweep 后收回" },
  { value: "NOT_TESTED", label: "未触及" },
] as const;

export type MnqLevelActualReaction =
  (typeof MNQ_LEVEL_ACTUAL_REACTIONS)[number]["value"];

export const MNQ_LEVEL_ACCURACY_OPTIONS = [
  { value: "CORRECT", label: "正确" },
  { value: "PARTIAL", label: "部分正确" },
  { value: "WRONG", label: "错误" },
] as const;

export type MnqLevelAccuracy =
  | (typeof MNQ_LEVEL_ACCURACY_OPTIONS)[number]["value"]
  | "NOT_TRIGGERED";

export type MnqLevelNodeStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED"
  | "PAUSED"
  | "INVALIDATED";

export interface MnqLevelForecastNode {
  id: string;
  sequence: number;
  levelCode: MnqLevelCode;
  customLevelName: string;
  referencePrice: string;
  decisionTimeframe: MnqLevelTimeframe | null;
  expectedReaction: MnqLevelExpectedReaction | null;
  confirmationCondition: string;
  expectedNote: string;
  status: MnqLevelNodeStatus;
  plannedAt: string;
  activatedAt: string | null;
  completedAt: string | null;
  actualReaction: MnqLevelActualReaction | null;
  actualLevelCode: MnqLevelCode | null;
  actualLevelName: string;
  actualLevelTimeframe: MnqLevelTimeframe | null;
  actualNote: string;
  accuracy: MnqLevelAccuracy | null;
  revisionReason: string;
  invalidationReason: string;
}

export interface MnqLevelForecasts {
  version: 1;
  upper: MnqLevelForecastNode[];
  lower: MnqLevelForecastNode[];
}

export interface MnqLevelForecastSummary {
  planned: number;
  evaluated: number;
  correct: number;
  partial: number;
  wrong: number;
  notTested: number;
  paused: number;
  deepestCompletedSequence: number;
}

const LEVEL_CODES = new Set<string>(
  MNQ_LEVEL_OPTIONS.map((option) => option.value),
);
const EXPECTED_REACTIONS = new Set<string>(
  MNQ_LEVEL_EXPECTED_REACTIONS.map((option) => option.value),
);
const TIMEFRAMES = new Set<string>(
  MNQ_LEVEL_TIMEFRAME_OPTIONS.map((option) => option.value),
);
const ACTUAL_REACTIONS = new Set<string>(
  MNQ_LEVEL_ACTUAL_REACTIONS.map((option) => option.value),
);
const ACCURACIES = new Set<string>([
  ...MNQ_LEVEL_ACCURACY_OPTIONS.map((option) => option.value),
  "NOT_TRIGGERED",
]);
const STATUSES = new Set<string>([
  "PLANNED",
  "ACTIVE",
  "COMPLETED",
  "PAUSED",
  "INVALIDATED",
]);

function createId(): string {
  return `level_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function createEmptyLevelForecasts(): MnqLevelForecasts {
  return { version: 1, upper: [], lower: [] };
}

export function isAcceptanceReaction(
  reaction: MnqLevelExpectedReaction | null,
): reaction is "BREAK_ACCEPT_ABOVE" | "BREAK_ACCEPT_BELOW" {
  return reaction === "BREAK_ACCEPT_ABOVE" || reaction === "BREAK_ACCEPT_BELOW";
}

export function createLevelForecastNode(
  sequence: number,
  isFirst: boolean,
  now = new Date().toISOString(),
): MnqLevelForecastNode {
  return {
    id: createId(),
    sequence,
    levelCode: "PDH",
    customLevelName: "",
    referencePrice: "",
    decisionTimeframe: null,
    expectedReaction: null,
    confirmationCondition: "",
    expectedNote: "",
    status: isFirst ? "ACTIVE" : "PLANNED",
    plannedAt: now,
    activatedAt: isFirst ? now : null,
    completedAt: null,
    actualReaction: null,
    actualLevelCode: null,
    actualLevelName: "",
    actualLevelTimeframe: null,
    actualNote: "",
    accuracy: null,
    revisionReason: "",
    invalidationReason: "",
  };
}

function parseNode(
  value: unknown,
  sequence: number,
): MnqLevelForecastNode | null {
  if (!isRecord(value)) return null;

  const levelCode = LEVEL_CODES.has(String(value.levelCode))
    ? (value.levelCode as MnqLevelCode)
    : "CUSTOM";
  const expectedReaction = EXPECTED_REACTIONS.has(
    String(value.expectedReaction),
  )
    ? (value.expectedReaction as MnqLevelExpectedReaction)
    : null;
  const actualReaction = ACTUAL_REACTIONS.has(String(value.actualReaction))
    ? (value.actualReaction as MnqLevelActualReaction)
    : null;
  const accuracy = ACCURACIES.has(String(value.accuracy))
    ? (value.accuracy as MnqLevelAccuracy)
    : null;
  const status = STATUSES.has(String(value.status))
    ? (value.status as MnqLevelNodeStatus)
    : sequence === 1
      ? "ACTIVE"
      : "PLANNED";
  const legacyActualLevelName = stringValue(value.actualLevelName);
  const actualLevelCode = LEVEL_CODES.has(String(value.actualLevelCode))
    ? (value.actualLevelCode as MnqLevelCode)
    : legacyActualLevelName
      ? "CUSTOM"
      : null;

  return {
    id: stringValue(value.id) || createId(),
    sequence,
    levelCode,
    customLevelName: stringValue(value.customLevelName),
    referencePrice: stringValue(value.referencePrice),
    decisionTimeframe: TIMEFRAMES.has(String(value.decisionTimeframe))
      ? (value.decisionTimeframe as MnqLevelTimeframe)
      : null,
    expectedReaction,
    confirmationCondition: stringValue(value.confirmationCondition),
    expectedNote: stringValue(value.expectedNote),
    status,
    plannedAt: stringValue(value.plannedAt) || new Date().toISOString(),
    activatedAt: nullableString(value.activatedAt),
    completedAt: nullableString(value.completedAt),
    actualReaction,
    actualLevelCode,
    actualLevelName: legacyActualLevelName,
    actualLevelTimeframe: TIMEFRAMES.has(String(value.actualLevelTimeframe))
      ? (value.actualLevelTimeframe as MnqLevelTimeframe)
      : null,
    actualNote: stringValue(value.actualNote),
    accuracy,
    revisionReason: stringValue(value.revisionReason),
    invalidationReason: stringValue(value.invalidationReason),
  };
}

function parseChain(value: unknown): MnqLevelForecastNode[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((node, index) => parseNode(node, index + 1))
    .filter((node): node is MnqLevelForecastNode => node !== null);
}

export function parseLevelForecasts(value: unknown): MnqLevelForecasts {
  if (!isRecord(value)) return createEmptyLevelForecasts();
  return {
    version: 1,
    upper: parseChain(value.upper),
    lower: parseChain(value.lower),
  };
}

export function formatLevelName(node: MnqLevelForecastNode): string {
  if (node.levelCode === "CUSTOM") {
    return node.customLevelName.trim() || "自定义 Level";
  }
  return (
    MNQ_LEVEL_OPTIONS.find((option) => option.value === node.levelCode)
      ?.label ?? node.levelCode
  );
}

export function formatActualLevelName(node: MnqLevelForecastNode): string {
  if (node.accuracy === "CORRECT") return formatLevelName(node);
  if (node.actualLevelCode === "CUSTOM") {
    return node.actualLevelName.trim() || "自定义 Level";
  }
  if (node.actualLevelCode) {
    return (
      MNQ_LEVEL_OPTIONS.find((option) => option.value === node.actualLevelCode)
        ?.label ?? node.actualLevelCode
    );
  }
  return "尚未选择";
}

export function formatActualLevelTimeframe(node: MnqLevelForecastNode): string {
  const timeframe =
    node.accuracy === "CORRECT"
      ? node.decisionTimeframe
      : node.actualLevelTimeframe;
  return (
    MNQ_LEVEL_TIMEFRAME_OPTIONS.find((option) => option.value === timeframe)
      ?.label ?? "未选择"
  );
}

export function validateLevelForecasts(forecasts: MnqLevelForecasts): string[] {
  const errors: string[] = [];

  for (const side of ["upper", "lower"] as const) {
    const chain = forecasts[side];
    const sideLabel = side === "upper" ? "上端链" : "下端链";
    if (chain.filter((node) => node.status === "ACTIVE").length > 1) {
      errors.push(`${sideLabel}只能有一个当前 Level`);
    }

    chain.forEach((node, index) => {
      const label = `${sideLabel}第 ${index + 1} 个 Level`;
      if (node.sequence !== index + 1) errors.push(`${label}顺序无效`);
      if (node.levelCode === "CUSTOM" && !node.customLevelName.trim()) {
        errors.push(`${label}需要填写自定义名称`);
      }
      if (!node.expectedReaction) errors.push(`${label}需要选择预期反应`);
      if (!node.decisionTimeframe) errors.push(`${label}需要选择判断周期`);
      if (
        isAcceptanceReaction(node.expectedReaction) &&
        !node.confirmationCondition.trim()
      ) {
        errors.push(`${label}需要填写接受确认条件`);
      }
      if (node.referencePrice.trim()) {
        const price = Number(node.referencePrice);
        if (!Number.isFinite(price) || price <= 0) {
          errors.push(`${label}的参考价格无效`);
        }
      }
      if (
        index > 0 &&
        !isAcceptanceReaction(chain[index - 1]?.expectedReaction ?? null)
      ) {
        errors.push(`${label}的前一个 Level 必须预期突破或跌破并接受`);
      }
      if (
        index > 0 &&
        node.levelCode === chain[index - 1]?.levelCode &&
        node.customLevelName.trim() ===
          (chain[index - 1]?.customLevelName.trim() ?? "")
      ) {
        errors.push(`${label}不能与前一个 Level 相同`);
      }
      if (node.actualReaction) {
        if (
          node.actualReaction !== "TESTING" &&
          node.actualReaction !== "NOT_TESTED" &&
          !node.accuracy
        ) {
          errors.push(`${label}需要选择判断结果`);
        }
        if (
          (node.accuracy === "PARTIAL" || node.accuracy === "WRONG") &&
          !node.actualNote.trim()
        ) {
          errors.push(`${label}部分正确或错误时需要填写实际说明`);
        }
        if (
          (node.accuracy === "PARTIAL" || node.accuracy === "WRONG") &&
          !node.actualLevelCode
        ) {
          errors.push(`${label}部分正确或错误时需要选择实际 Level`);
        }
        if (
          (node.accuracy === "PARTIAL" || node.accuracy === "WRONG") &&
          node.actualLevelCode === "CUSTOM" &&
          !node.actualLevelName.trim()
        ) {
          errors.push(`${label}需要填写自定义实际 Level`);
        }
        if (
          (node.accuracy === "PARTIAL" || node.accuracy === "WRONG") &&
          !node.actualLevelTimeframe
        ) {
          errors.push(`${label}部分正确或错误时需要选择实际 Level 周期`);
        }
      }
    });
  }

  return errors;
}

export function matchesExpectedAcceptance(node: MnqLevelForecastNode): boolean {
  return (
    isAcceptanceReaction(node.expectedReaction) &&
    node.actualReaction === node.expectedReaction
  );
}

function finalizeChain(
  chain: MnqLevelForecastNode[],
  now: string,
): MnqLevelForecastNode[] {
  const finalized = chain.map((node) => ({ ...node }));

  for (let index = 0; index < finalized.length; index += 1) {
    let node = finalized[index];
    if (!node) continue;

    const previous = finalized[index - 1];
    const reachable =
      index === 0 || Boolean(previous && matchesExpectedAcceptance(previous));
    if (!reachable) break;

    if (node.status === "PLANNED") {
      node = {
        ...node,
        status: "ACTIVE",
        activatedAt: node.activatedAt ?? now,
      };
      finalized[index] = node;
    }

    if (node.status === "COMPLETED") continue;
    if (node.status !== "ACTIVE") break;
    if (!node.actualReaction || node.actualReaction === "TESTING") break;

    if (node.actualReaction === "NOT_TESTED") {
      finalized[index] = {
        ...node,
        status: "COMPLETED",
        accuracy: "NOT_TRIGGERED",
        completedAt: now,
      };
      break;
    }

    if (matchesExpectedAcceptance(node)) {
      finalized[index] = { ...node, status: "COMPLETED", completedAt: now };
      continue;
    }

    const expectedMatchesActual =
      (node.expectedReaction === "REJECT" &&
        node.actualReaction === "REJECTED") ||
      (node.expectedReaction === "SWEEP_RECLAIM" &&
        node.actualReaction === "SWEPT_RECLAIMED");
    const successful =
      expectedMatchesActual &&
      (node.accuracy === "CORRECT" || node.accuracy === "PARTIAL");

    finalized[index] = {
      ...node,
      status: successful ? "COMPLETED" : "PAUSED",
      completedAt: now,
    };
    break;
  }

  return finalized;
}

export function finalizePendingLevelOutcomes(
  forecasts: MnqLevelForecasts,
  now = new Date().toISOString(),
): MnqLevelForecasts {
  return {
    version: 1,
    upper: finalizeChain(forecasts.upper, now),
    lower: finalizeChain(forecasts.lower, now),
  };
}

export function summarizeLevelForecasts(
  forecasts: MnqLevelForecasts,
): MnqLevelForecastSummary {
  const nodes = [...forecasts.upper, ...forecasts.lower];
  const evaluated = nodes.filter(
    (node) =>
      node.accuracy === "CORRECT" ||
      node.accuracy === "PARTIAL" ||
      node.accuracy === "WRONG",
  );
  return {
    planned: nodes.length,
    evaluated: evaluated.length,
    correct: evaluated.filter((node) => node.accuracy === "CORRECT").length,
    partial: evaluated.filter((node) => node.accuracy === "PARTIAL").length,
    wrong: evaluated.filter((node) => node.accuracy === "WRONG").length,
    notTested: nodes.filter((node) => node.accuracy === "NOT_TRIGGERED").length,
    paused: nodes.filter((node) => node.status === "PAUSED").length,
    deepestCompletedSequence: nodes.reduce(
      (deepest, node) =>
        node.status === "COMPLETED"
          ? Math.max(deepest, node.sequence)
          : deepest,
      0,
    ),
  };
}
