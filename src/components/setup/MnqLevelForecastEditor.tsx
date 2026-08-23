"use client";

import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  MNQ_LEVEL_EXPECTED_REACTIONS,
  MNQ_LEVEL_OPTIONS,
  MNQ_LEVEL_TIMEFRAME_OPTIONS,
  createLevelForecastNode,
  formatLevelName,
  isAcceptanceReaction,
  type MnqLevelChainSide,
  type MnqLevelForecastNode,
  type MnqLevelForecasts,
} from "~/lib/mnq-level-forecast";
import { cn } from "~/lib/utils";

interface Props {
  value: MnqLevelForecasts;
  onChange: (value: MnqLevelForecasts) => void;
}

const CHAIN_CONFIG = {
  upper: {
    label: "上端链",
    description: "向上测试后可能到达的 Level",
    defaultLevel: "PDH" as const,
    color: "text-emerald-300",
    border: "border-emerald-900/40",
  },
  lower: {
    label: "下端链",
    description: "向下测试后可能到达的 Level",
    defaultLevel: "PDL" as const,
    color: "text-rose-300",
    border: "border-rose-900/40",
  },
};

function canEditNode(node: MnqLevelForecastNode): boolean {
  return (
    (node.status === "PLANNED" ||
      (node.status === "ACTIVE" && node.sequence === 1)) &&
    node.actualReaction === null
  );
}

export function MnqLevelForecastEditor({ value, onChange }: Props) {
  function updateChain(side: MnqLevelChainSide, chain: MnqLevelForecastNode[]) {
    onChange({ ...value, [side]: chain });
  }

  function updateNode(
    side: MnqLevelChainSide,
    nodeId: string,
    patch: Partial<MnqLevelForecastNode>,
  ) {
    updateChain(
      side,
      value[side].map((node) =>
        node.id === nodeId ? { ...node, ...patch } : node,
      ),
    );
  }

  function addNode(side: MnqLevelChainSide) {
    const chain = value[side];
    const node = createLevelForecastNode(chain.length + 1, chain.length === 0);
    node.levelCode = CHAIN_CONFIG[side].defaultLevel;
    updateChain(side, [...chain, node]);
  }

  function removeLastNode(side: MnqLevelChainSide) {
    const chain = value[side];
    const last = chain.at(-1);
    if (!last || !canEditNode(last)) return;
    updateChain(side, chain.slice(0, -1));
  }

  return (
    <div className="space-y-3 rounded-md border border-cyan-900/30 bg-slate-950/20 p-2.5">
      <div>
        <p className="text-[11px] font-medium text-cyan-200">Level 反应计划</p>
        <p className="text-muted-foreground text-[10px]">
          后续 Level 必须提前写好；确认突破或跌破并接受后自动激活
        </p>
      </div>

      <div className="grid gap-3">
        {(["upper", "lower"] as const).map((side) => {
          const config = CHAIN_CONFIG[side];
          const chain = value[side];
          const last = chain.at(-1);
          const canAdd =
            chain.length === 0 ||
            (last !== undefined &&
              canEditNode(last) &&
              isAcceptanceReaction(last.expectedReaction));

          return (
            <section
              key={side}
              className={cn("space-y-2 rounded-md border p-2", config.border)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={cn("text-xs font-medium", config.color)}>
                    {config.label}
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    {config.description}
                  </p>
                </div>
                {chain.length === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[10px]"
                    onClick={() => addNode(side)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    添加
                  </Button>
                ) : null}
              </div>

              {chain.length === 0 ? (
                <p className="text-muted-foreground/70 rounded border border-dashed p-3 text-center text-[10px]">
                  本时段暂不规划{config.label}
                </p>
              ) : (
                <div className="space-y-2">
                  {chain.map((node, index) => {
                    const editable = canEditNode(node);
                    return (
                      <div key={node.id} className="space-y-2">
                        {index > 0 ? (
                          <div className="text-muted-foreground flex items-center justify-center gap-1 text-[10px]">
                            <ChevronRight className="h-3 w-3 rotate-90" />
                            上一 Level 接受后激活
                          </div>
                        ) : null}
                        <div className="border-border/60 space-y-2 rounded border bg-black/10 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-medium">
                              {index + 1}. {formatLevelName(node)}
                            </span>
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px]",
                                node.status === "ACTIVE" &&
                                  "bg-cyan-950 text-cyan-300",
                                node.status === "PLANNED" &&
                                  "bg-slate-800 text-slate-400",
                                node.status === "COMPLETED" &&
                                  "bg-green-950 text-green-300",
                                node.status === "PAUSED" &&
                                  "bg-red-950 text-red-300",
                                node.status === "INVALIDATED" &&
                                  "bg-zinc-900 text-zinc-500",
                              )}
                            >
                              {node.status === "ACTIVE"
                                ? "当前"
                                : node.status === "PLANNED"
                                  ? "待激活"
                                  : node.status === "COMPLETED"
                                    ? "已完成"
                                    : node.status === "PAUSED"
                                      ? "已暂停"
                                      : "已失效"}
                            </span>
                          </div>

                          <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-2">
                            <select
                              value={node.levelCode}
                              disabled={!editable}
                              onChange={(event) =>
                                updateNode(side, node.id, {
                                  levelCode: event.target
                                    .value as MnqLevelForecastNode["levelCode"],
                                  customLevelName:
                                    event.target.value === "CUSTOM"
                                      ? node.customLevelName
                                      : "",
                                })
                              }
                              className="border-input bg-background text-foreground min-w-0 rounded border px-2 py-1 text-xs disabled:opacity-60"
                            >
                              {MNQ_LEVEL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              placeholder="价格（可选）"
                              value={node.referencePrice}
                              disabled={!editable}
                              onChange={(event) =>
                                updateNode(side, node.id, {
                                  referencePrice: event.target.value,
                                })
                              }
                              className="border-input bg-background text-foreground min-w-0 rounded border px-2 py-1 text-xs disabled:opacity-60"
                            />
                          </div>

                          {node.levelCode === "CUSTOM" ? (
                            <input
                              type="text"
                              placeholder="自定义 Level 名称（必填）"
                              value={node.customLevelName}
                              disabled={!editable}
                              onChange={(event) =>
                                updateNode(side, node.id, {
                                  customLevelName: event.target.value,
                                })
                              }
                              className="border-input bg-background text-foreground w-full rounded border px-2 py-1 text-xs disabled:opacity-60"
                            />
                          ) : null}

                          <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px]">
                              判断周期（
                              {node.decisionTimeframe || editable
                                ? "必选"
                                : "待补录"}
                              ）
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_LEVEL_TIMEFRAME_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  disabled={
                                    !editable && node.decisionTimeframe !== null
                                  }
                                  onClick={() =>
                                    updateNode(side, node.id, {
                                      decisionTimeframe: option.value,
                                    })
                                  }
                                  className={cn(
                                    "rounded border px-2.5 py-0.5 text-[10px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                    node.decisionTimeframe === option.value
                                      ? "border-violet-600 bg-violet-900/60 text-violet-100"
                                      : "border-muted-foreground/25 text-muted-foreground",
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px]">
                              预期反应（必选）
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {MNQ_LEVEL_EXPECTED_REACTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  disabled={!editable}
                                  onClick={() =>
                                    updateNode(side, node.id, {
                                      expectedReaction: option.value,
                                    })
                                  }
                                  className={cn(
                                    "rounded border px-2 py-0.5 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                    node.expectedReaction === option.value
                                      ? "border-cyan-600 bg-cyan-900/60 text-cyan-100"
                                      : "border-muted-foreground/25 text-muted-foreground",
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {isAcceptanceReaction(node.expectedReaction) ? (
                            <Textarea
                              placeholder="接受确认条件，例如：M5 收在 Level 外侧且回踩守住（必填）"
                              value={node.confirmationCondition}
                              disabled={!editable}
                              onChange={(event) =>
                                updateNode(side, node.id, {
                                  confirmationCondition: event.target.value,
                                })
                              }
                              rows={2}
                              className="resize-none text-xs"
                            />
                          ) : null}

                          <Textarea
                            placeholder="预期反应补充说明（可选）"
                            value={node.expectedNote}
                            disabled={!editable}
                            onChange={(event) =>
                              updateNode(side, node.id, {
                                expectedNote: event.target.value,
                              })
                            }
                            rows={2}
                            className="resize-none text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-[10px]"
                      disabled={!canAdd}
                      title={
                        canAdd
                          ? undefined
                          : "只有预期为突破或跌破并接受时才能规划下一 Level"
                      }
                      onClick={() => addNode(side)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      下一 Level
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[10px] text-red-400"
                      disabled={!last || !canEditNode(last)}
                      onClick={() => removeLastNode(side)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      删除末项
                    </Button>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
