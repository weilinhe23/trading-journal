"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  LocateFixed,
  Undo2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  TRADING_GROWTH_STEPS,
  type TradingGrowthAction,
  type TradingGrowthProgress,
} from "~/lib/trading-growth";
import styles from "./TradingGrowthPlan.module.css";

const ROW_HEIGHT = 140;
const DOT_Y = 28;

function GrowthRoute({ progress }: { progress: TradingGrowthProgress }) {
  const routeRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = routeRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const columns =
    width > 0 && width < 420
      ? 2
      : width > 0 && width < 650
        ? 3
        : width > 0 && width < 850
          ? 4
          : 6;
  const inset = width < 650 ? 18 : 32;
  const height = Math.ceil(TRADING_GROWTH_STEPS.length / columns) * ROW_HEIGHT;
  const positions = TRADING_GROWTH_STEPS.map((_, index) => {
    const row = Math.floor(index / columns);
    const column =
      row % 2 === 0 ? index % columns : columns - 1 - (index % columns);
    return {
      row,
      column,
      x: inset + ((width - inset * 2) / columns) * (column + 0.5),
      y: DOT_Y + row * ROW_HEIGHT,
    };
  });
  let fullPath = "";
  let completedPath = "";
  positions.forEach((point, index) => {
    const previous = positions[index - 1];
    let segment = `M ${point.x} ${point.y}`;
    if (previous) {
      if (previous.row === point.row) {
        segment = ` L ${point.x} ${point.y}`;
      } else {
        const right = previous.row % 2 === 0;
        const edge = right ? width - 3 : 3;
        const bend = right ? edge - 16 : edge + 16;
        segment = ` L ${bend} ${previous.y} Q ${edge} ${previous.y} ${edge} ${previous.y + 16} L ${edge} ${point.y - 16} Q ${edge} ${point.y} ${bend} ${point.y} L ${point.x} ${point.y}`;
      }
    }
    fullPath += segment;
    if (index <= progress.completedCount) completedPath += segment;
  });
  const completions = new Map(
    progress.completions.map((item) => [item.stepIndex, item]),
  );

  return (
    <div ref={routeRef} className={styles.route}>
      {width > 0 && (
        <svg
          className={styles.paths}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
        >
          <path className={styles.trackPath} d={fullPath} />
          <path className={styles.completedPath} d={completedPath} />
        </svg>
      )}
      <ol
        className={styles.nodes}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          paddingInline: inset,
        }}
        aria-label="按编号顺序前进的 23 个交易目标"
      >
        {TRADING_GROWTH_STEPS.map((step, index) => {
          const position = positions[index]!;
          const completion = completions.get(index);
          const state =
            index < progress.completedCount
              ? "done"
              : index === progress.completedCount
                ? "current"
                : "pending";
          return (
            <li
              key={`${step.symbol}-${step.quantity}`}
              id={`growth-step-${index}`}
              className={styles.node}
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              style={{
                gridRow: position.row + 1,
                gridColumn: position.column + 1,
              }}
            >
              <span className={styles.dot} aria-hidden="true">
                {state === "done" ? (
                  <Check size={17} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <span className="sr-only">目标 {index + 1}：</span>
              <strong className={styles.nodeLabel}>{step.label}</strong>
              <span className={styles.nodeStatus}>
                {state === "done"
                  ? "已完成"
                  : state === "current"
                    ? "正在进行"
                    : "待开始"}
              </span>
              {completion ? (
                <time
                  className={styles.nodeDate}
                  dateTime={completion.completedAt}
                  aria-label={`美东完成日期 ${completion.completedDate}`}
                >
                  {completion.completedDate}
                </time>
              ) : index === 13 || index === 22 ? (
                <span className={styles.milestone}>
                  <Flag size={11} aria-hidden="true" />
                  {index === 13 ? "首次进入 NQ" : "最终目标"}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TradingGrowthPlan({
  initialProgress,
}: {
  initialProgress: TradingGrowthProgress;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(initialProgress);
  const [pending, setPending] = useState<TradingGrowthAction | null>(null);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    error: boolean;
  } | null>(null);
  const current = TRADING_GROWTH_STEPS[progress.completedCount];
  const next = TRADING_GROWTH_STEPS[progress.completedCount + 1];
  const lastCompletion = progress.completions.at(-1);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  async function updateProgress(action: TradingGrowthAction) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(action);
    setFeedback(null);
    try {
      const response = await fetch("/api/kpi/growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, revision: progress.revision }),
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: TradingGrowthProgress;
        error?: string;
      };
      if (!response.ok || !result.success || !result.data) {
        if (response.status === 409 && result.data) setProgress(result.data);
        setFeedback({
          text: result.error ?? "保存失败，请重试。",
          error: true,
        });
        return;
      }
      setProgress(result.data);
      const target = TRADING_GROWTH_STEPS[result.data.completedCount];
      setFeedback({
        text:
          action === "undo"
            ? `已撤销上次完成，当前目标恢复为 ${target?.label ?? ""}，对应完成日期已移除。`
            : target
              ? `${current?.label ?? "当前目标"} 已完成，日期已记录。下一目标：${target.label}。`
              : "全部 23 个目标已完成，最后的完成日期已记录。",
        error: false,
      });
      router.refresh();
    } catch {
      setFeedback({
        text: "连接失败，尚未确认保存结果。请重试或刷新查看最新进度。",
        error: true,
      });
    } finally {
      inFlight.current = false;
      setPending(null);
    }
  }

  function locateCurrent() {
    document
      .getElementById(
        `growth-step-${Math.min(progress.completedCount, TRADING_GROWTH_STEPS.length - 1)}`,
      )
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="KPI 模块导航">
        <Link href="/kpi">
          <ArrowLeft size={14} aria-hidden="true" /> KPI
        </Link>
        <span aria-hidden="true">/</span>
        <span>交易成长计划</span>
      </nav>
      <section className={styles.board} aria-labelledby="growth-title">
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>ONE CONTINUOUS JOURNEY</p>
            <h1 id="growth-title">一步一步，走向 NQ</h1>
            <p className={styles.subtitle}>
              从 4 股 QQQ 起步，记录每一次仓位适应与目标推进。
            </p>
          </div>
          <div className={styles.total}>
            <strong>{progress.completedCount}</strong>
            <span>/ 23 个目标已完成</span>
          </div>
        </header>
        <div
          className={styles.meter}
          role="progressbar"
          aria-label="已完成交易目标"
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuenow={progress.completedCount}
        >
          <div
            style={{
              width: `${(progress.completedCount / TRADING_GROWTH_STEPS.length) * 100}%`,
            }}
          />
        </div>
        <section
          className={styles.currentPanel}
          aria-label="当前交易目标"
          aria-busy={pending !== null}
        >
          <div>
            <p className={styles.currentCaption}>
              {current
                ? `当前目标 · ${String(progress.completedCount + 1).padStart(2, "0")} / 23`
                : "全部目标已完成"}
            </p>
            <h2>{current?.label ?? "10 手 NQ"}</h2>
            <p className={styles.next}>
              {current
                ? next
                  ? `下一目标：${next.label}`
                  : "这是成长路线的最后一个目标"
                : "23 个目标，已全部完成"}
            </p>
            <p className={styles.startDate}>
              {progress.currentStartedDate ? (
                <>
                  开始于{" "}
                  <time dateTime={progress.currentStartedDate}>
                    {progress.currentStartedDate}
                  </time>{" "}
                  · 第 {progress.currentDayCount} 天
                </>
              ) : lastCompletion ? (
                <>
                  完成于{" "}
                  <time dateTime={lastCompletion.completedAt}>
                    {lastCompletion.completedDate}
                  </time>
                </>
              ) : null}
              <span>（美东时间）</span>
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              className={styles.completeButton}
              disabled={pending !== null || !current}
              onClick={() => updateProgress("complete")}
            >
              {pending === "complete"
                ? "正在保存…"
                : !current
                  ? "计划已完成"
                  : next
                    ? `完成当前目标，进入 ${next.label}`
                    : "完成整个计划"}
              {current ? (
                <ArrowRight size={16} aria-hidden="true" />
              ) : (
                <Check size={16} aria-hidden="true" />
              )}
            </Button>
            <Button
              variant="ghost"
              disabled={pending !== null || progress.completedCount === 0}
              onClick={() => updateProgress("undo")}
            >
              <Undo2 size={14} aria-hidden="true" />
              {pending === "undo" ? "正在撤销…" : "撤销上次完成"}
            </Button>
          </div>
        </section>
        <div
          className={styles.feedback}
          aria-live="polite"
          role={feedback?.error ? "alert" : "status"}
          data-error={feedback?.error ? true : undefined}
        >
          {feedback?.text ?? "完成日期自动记录在下方路线中，统一使用美东时间。"}
        </div>
        <div className={styles.routeHeader}>
          <div>
            <h2>完整成长路线</h2>
            <p>顺着连线，按编号依次前进。</p>
          </div>
          <div className={styles.routeTools}>
            <div className={styles.legend}>
              <span>✓ 已完成</span>
              <span>● 当前目标</span>
              <span>○ 待开始</span>
            </div>
            <Button variant="ghost" size="sm" onClick={locateCurrent}>
              <LocateFixed size={14} aria-hidden="true" />
              {current ? "定位当前目标" : "定位最终目标"}
            </Button>
          </div>
        </div>
        <GrowthRoute progress={progress} />
        <footer className={styles.footer}>
          <span>
            起点：4 股 QQQ ·{" "}
            <time dateTime={progress.startedDate}>{progress.startedDate}</time>{" "}
            开始
          </span>
          <span>终点：10 手 NQ</span>
        </footer>
      </section>
    </div>
  );
}
