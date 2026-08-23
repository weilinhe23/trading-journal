"use client";

import { Textarea } from "~/components/ui/textarea";
import {
  MNQ_LEVEL_ACCURACY_OPTIONS,
  MNQ_LEVEL_ACTUAL_REACTIONS,
  MNQ_LEVEL_OPTIONS,
  MNQ_LEVEL_TIMEFRAME_OPTIONS,
  formatActualLevelName,
  formatActualLevelTimeframe,
  formatLevelName,
  matchesExpectedAcceptance,
  type MnqLevelChainSide,
  type MnqLevelForecastNode,
  type MnqLevelForecasts,
} from "~/lib/mnq-level-forecast";
import { cn } from "~/lib/utils";

interface Props {
  value: MnqLevelForecasts;
  onChange: (value: MnqLevelForecasts) => void;
}

const SIDE_LABELS: Record<MnqLevelChainSide, string> = {
  upper: "上端 Level 判断",
  lower: "下端 Level 判断",
};

function expectedReactionLabel(node: MnqLevelForecastNode): string {
  if (node.expectedReaction === "BREAK_ACCEPT_ABOVE") return "突破并接受";
  if (node.expectedReaction === "BREAK_ACCEPT_BELOW") return "跌破并接受";
  if (node.expectedReaction === "REJECT") return "测试后拒绝";
  if (node.expectedReaction === "SWEEP_RECLAIM") return "Sweep 后收回";
  return "不确定";
}

function canRecordNode(chain: MnqLevelForecastNode[], index: number): boolean {
  const node = chain[index];
  if (!node || node.status === "COMPLETED" || node.status === "PAUSED") {
    return false;
  }
  if (node.status === "ACTIVE") return true;
  return chain.slice(0, index).every(matchesExpectedAcceptance);
}

function resultLabel(node: MnqLevelForecastNode): string {
  if (node.accuracy === "CORRECT") return "正确";
  if (node.accuracy === "PARTIAL") return "部分正确";
  if (node.accuracy === "WRONG") return "错误";
  if (node.accuracy === "NOT_TRIGGERED") return "未触及";
  return "已记录";
}

function ActualLevelFields({
  node,
  onChange,
}: {
  node: MnqLevelForecastNode;
  onChange: (patch: Partial<MnqLevelForecastNode>) => void;
}) {
  return (
    <div className="space-y-2 rounded border border-amber-800/40 bg-amber-950/10 p-2">
      <p className="text-[10px] font-medium text-amber-200">
        实际 Level（必填）
      </p>
      <select
        value={node.actualLevelCode ?? ""}
        onChange={(event) => {
          const actualLevelCode = event.target
            .value as MnqLevelForecastNode["actualLevelCode"];
          onChange({
            actualLevelCode,
            actualLevelName:
              actualLevelCode === "CUSTOM" ? node.actualLevelName : "",
          });
        }}
        className="border-input bg-background text-foreground w-full rounded border px-2 py-1.5 text-xs"
      >
        <option value="" disabled>
          选择实际 Level
        </option>
        {MNQ_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {node.actualLevelCode === "CUSTOM" ? (
        <input
          type="text"
          placeholder="填写自定义实际 Level（必填）"
          value={node.actualLevelName}
          onChange={(event) =>
            onChange({ actualLevelName: event.target.value })
          }
          className="border-input bg-background text-foreground w-full rounded border px-2 py-1.5 text-xs"
        />
      ) : null}

      <div className="space-y-1">
        <span className="text-muted-foreground text-[10px]">
          实际 Level 判断周期（必选）
        </span>
        <div className="flex flex-wrap gap-1">
          {MNQ_LEVEL_TIMEFRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ actualLevelTimeframe: option.value })}
              className={cn(
                "rounded border px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                node.actualLevelTimeframe === option.value
                  ? "border-amber-600 bg-amber-900/60 text-amber-100"
                  : "border-muted-foreground/25 text-muted-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MnqLevelActualRecorder({ value, onChange }: Props) {
  function updateNode(
    side: MnqLevelChainSide,
    nodeId: string,
    patch: Partial<MnqLevelForecastNode>,
  ) {
    const updatedChain = value[side].map((node) =>
      node.id === nodeId ? { ...node, ...patch } : node,
    );
    const normalizedChain = updatedChain.map((node, index) => {
      const reachable =
        index === 0 ||
        updatedChain.slice(0, index).every(matchesExpectedAcceptance);
      if (reachable || node.status !== "PLANNED") return node;
      return {
        ...node,
        actualReaction: null,
        actualLevelCode: null,
        actualLevelName: "",
        actualLevelTimeframe: null,
        actualNote: "",
        accuracy: null,
      };
    });
    onChange({
      ...value,
      [side]: normalizedChain,
    });
  }

  const hasChains = value.upper.length > 0 || value.lower.length > 0;
  if (!hasChains) return null;

  return (
    <div className="space-y-3 rounded-md border border-violet-900/30 bg-violet-950/10 p-2.5">
      <div>
        <p className="text-[11px] font-medium text-violet-200">
          Level 实际反应
        </p>
        <p className="text-muted-foreground text-[10px]">
          每层预计 Level 都要判断；上一层确认接受后可继续填写下一层
        </p>
      </div>

      <div className="grid gap-3">
        {(["upper", "lower"] as const).map((side) => {
          const chain = value[side];

          return (
            <section key={side} className="border-border/50 rounded border p-2">
              <p className="text-muted-foreground mb-2 text-[10px] font-medium">
                {SIDE_LABELS[side]}
              </p>

              {chain.length === 0 ? (
                <p className="text-muted-foreground/70 rounded border border-dashed p-3 text-center text-[10px]">
                  没有预设 Level
                </p>
              ) : (
                <div className="space-y-2">
                  {chain.map((node, index) => {
                    const recordable = canRecordNode(chain, index);
                    const finished =
                      node.status === "COMPLETED" || node.status === "PAUSED";

                    return (
                      <div
                        key={node.id}
                        className={cn(
                          "space-y-2 rounded border p-2",
                          recordable
                            ? "border-violet-800/60 bg-violet-950/10"
                            : "border-border/40 bg-black/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium">
                              第 {index + 1} 层 · {formatLevelName(node)}
                              {node.referencePrice
                                ? ` · ${node.referencePrice}`
                                : ""}
                            </p>
                            <p className="text-muted-foreground text-[10px]">
                              判断周期：
                              {MNQ_LEVEL_TIMEFRAME_OPTIONS.find(
                                (option) =>
                                  option.value === node.decisionTimeframe,
                              )?.label ?? "未选择"}
                              <span className="mx-1">·</span>
                              预期：{expectedReactionLabel(node)}
                            </p>
                          </div>
                          <span className="text-muted-foreground rounded bg-slate-900 px-1.5 py-0.5 text-[9px]">
                            {finished
                              ? resultLabel(node)
                              : recordable
                                ? "可判断"
                                : "等待上一层"}
                          </span>
                        </div>

                        {node.confirmationCondition ? (
                          <p className="text-muted-foreground text-[10px] leading-relaxed">
                            确认：{node.confirmationCondition}
                          </p>
                        ) : null}

                        {finished ? (
                          <div className="space-y-2">
                            <div className="grid gap-1 text-[10px] sm:grid-cols-2">
                              <p>
                                <span className="text-muted-foreground">
                                  实际 Level：
                                </span>
                                {formatActualLevelName(node)}
                                {" · "}
                                {formatActualLevelTimeframe(node)}
                              </p>
                              <p>
                                <span className="text-muted-foreground">
                                  实际反应：
                                </span>
                                {MNQ_LEVEL_ACTUAL_REACTIONS.find(
                                  (option) =>
                                    option.value === node.actualReaction,
                                )?.label ?? "尚未记录"}
                              </p>
                            </div>
                            {node.accuracy === "PARTIAL" ||
                            node.accuracy === "WRONG" ? (
                              <ActualLevelFields
                                node={node}
                                onChange={(patch) =>
                                  updateNode(side, node.id, patch)
                                }
                              />
                            ) : null}
                          </div>
                        ) : recordable ? (
                          <>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_LEVEL_ACTUAL_REACTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    updateNode(side, node.id, {
                                      actualReaction: option.value,
                                      actualLevelCode:
                                        option.value === "NOT_TESTED"
                                          ? null
                                          : node.actualLevelCode,
                                      actualLevelName:
                                        option.value === "NOT_TESTED"
                                          ? ""
                                          : node.actualLevelName,
                                      actualLevelTimeframe:
                                        option.value === "NOT_TESTED"
                                          ? null
                                          : node.actualLevelTimeframe,
                                      accuracy:
                                        option.value === "NOT_TESTED"
                                          ? "NOT_TRIGGERED"
                                          : option.value === "TESTING"
                                            ? null
                                            : node.accuracy === "NOT_TRIGGERED"
                                              ? null
                                              : node.accuracy,
                                    })
                                  }
                                  className={cn(
                                    "rounded border px-2 py-0.5 text-[10px] transition-colors",
                                    node.actualReaction === option.value
                                      ? "border-violet-600 bg-violet-900/70 text-violet-100"
                                      : "border-muted-foreground/25 text-muted-foreground",
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>

                            {node.actualReaction &&
                            node.actualReaction !== "TESTING" &&
                            node.actualReaction !== "NOT_TESTED" ? (
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="text-muted-foreground mr-1 text-[10px]">
                                    判断结果
                                  </span>
                                  {MNQ_LEVEL_ACCURACY_OPTIONS.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() =>
                                        updateNode(side, node.id, {
                                          accuracy: option.value,
                                          actualLevelCode:
                                            option.value === "CORRECT"
                                              ? null
                                              : node.actualLevelCode,
                                          actualLevelName:
                                            option.value === "CORRECT"
                                              ? ""
                                              : node.actualLevelName,
                                          actualLevelTimeframe:
                                            option.value === "CORRECT"
                                              ? null
                                              : node.actualLevelTimeframe,
                                        })
                                      }
                                      className={cn(
                                        "rounded border px-2 py-0.5 text-[10px]",
                                        node.accuracy === option.value
                                          ? option.value === "CORRECT"
                                            ? "border-green-600 bg-green-900/60 text-green-100"
                                            : option.value === "PARTIAL"
                                              ? "border-amber-600 bg-amber-900/60 text-amber-100"
                                              : "border-red-600 bg-red-900/60 text-red-100"
                                          : "border-muted-foreground/25 text-muted-foreground",
                                      )}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>

                                {node.accuracy === "CORRECT" ? (
                                  <p className="rounded border border-green-900/40 bg-green-950/20 px-2 py-1.5 text-[10px] text-green-200">
                                    实际 Level 自动关联：{formatLevelName(node)}
                                    {" · "}
                                    {formatActualLevelTimeframe(node)}
                                  </p>
                                ) : node.accuracy === "PARTIAL" ||
                                  node.accuracy === "WRONG" ? (
                                  <ActualLevelFields
                                    node={node}
                                    onChange={(patch) =>
                                      updateNode(side, node.id, patch)
                                    }
                                  />
                                ) : null}
                              </div>
                            ) : null}

                            {node.actualReaction ? (
                              <Textarea
                                placeholder={
                                  node.accuracy === "PARTIAL" ||
                                  node.accuracy === "WRONG"
                                    ? "说明实际反应及偏差原因（必填）"
                                    : "实际反应说明（可选）"
                                }
                                value={node.actualNote}
                                onChange={(event) =>
                                  updateNode(side, node.id, {
                                    actualNote: event.target.value,
                                  })
                                }
                                rows={2}
                                className="resize-none text-xs"
                              />
                            ) : null}
                          </>
                        ) : (
                          <p className="text-muted-foreground/70 text-[10px]">
                            上一层实际反应确认突破或跌破并接受后立即开放。
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
