"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  MousePointer2,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  KpiDailyResult,
  getKpiDailyState,
  KPI_DAILY_STATUS_LABELS,
} from "./KpiDailyResult";
import type { KpiCalendarMonth } from "~/lib/kpi-year-view";
import type { KpiBreakdownItem } from "~/lib/kpi";
import styles from "./KpiYearView.module.css";
import dailyStyles from "./KpiDashboardCard.module.css";

const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const signed = (value: number) =>
  `${value > 0 ? "+" : ""}${format.format(value)}`;
const WEEKDAYS = ["一", "二", "三", "四", "五"];
const LEGEND = [
  ["optimistic", "乐观达标"],
  ["achieved", "基准达标"],
  ["below", "未达基准"],
  ["negative", "负收益"],
  ["unrecorded", "未填写"],
] as const;

function DayDetail({ day, today }: { day: KpiBreakdownItem; today: string }) {
  return (
    <>
      <ol className={`${dailyStyles.board} ${styles.detailCard}`}>
        <KpiDailyResult day={day} today={today} />
      </ol>
      <Link className={styles.journalLink} href={`/journal/${day.startDate}`}>
        查看当日日志 <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
      <p className={styles.detailNote}>目标按该交易日生效的设置判定。</p>
    </>
  );
}

export function KpiYearCalendar({
  months,
  today,
  initialSelectedDate,
}: {
  months: KpiCalendarMonth[];
  today: string;
  initialSelectedDate: string | null;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const selectionTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = months
    .flatMap((month) => month.cells)
    .find((cell) => cell?.date === selectedDate)?.result;

  return (
    <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
      <div className={styles.calendarLayout}>
        <section
          className={styles.calendarArea}
          aria-labelledby="calendar-heading"
        >
          <div className={styles.calendarHeading}>
            <div>
              <h2 id="calendar-heading">每日成绩日历</h2>
              <p>美东交易日 · 点击日期进入日志，点击成绩查看详情</p>
            </div>
            <div className={styles.legend} aria-label="成绩颜色图例">
              {LEGEND.map(([state, label]) => (
                <span key={state}>
                  <i data-state={state} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.monthGrid}>
            {months.map((month) => (
              <section
                key={month.month}
                className={styles.month}
                aria-labelledby={`month-${month.month}`}
              >
                <header className={styles.monthHeading}>
                  <h3 id={`month-${month.month}`}>
                    <span>{String(month.month).padStart(2, "0")}</span> 月
                  </h3>
                  <p
                    data-negative={
                      month.actualPcts !== null && month.actualPcts < 0
                    }
                  >
                    {month.actualPcts === null ? "—" : signed(month.actualPcts)}{" "}
                    <small>pts</small>
                  </p>
                </header>
                <div className={styles.weekdays} aria-hidden="true">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className={styles.calendarCells}>
                  {month.cells.map((cell, index) => {
                    if (!cell)
                      return <span key={`blank-${index}`} aria-hidden="true" />;
                    const day = cell.result;
                    if (!day)
                      return (
                        <span
                          key={cell.date}
                          className={styles.holiday}
                          aria-label={`${cell.date} 休市`}
                          title="休市"
                        >
                          {cell.dayNumber}
                        </span>
                      );
                    const state = getKpiDailyState(day, today);
                    const label = `${cell.date}，${day.actualPcts === null ? KPI_DAILY_STATUS_LABELS[state] : `${signed(day.actualPcts)} pts，${KPI_DAILY_STATUS_LABELS[state]}`}`;
                    return (
                      <div
                        key={cell.date}
                        className={styles.day}
                        data-state={state}
                        data-today={cell.date === today}
                        data-selected={cell.date === selectedDate}
                      >
                        <Link
                          className={styles.dayNumber}
                          href={`/journal/${cell.date}`}
                          prefetch={false}
                          aria-label={`查看 ${cell.date} 的日志`}
                          aria-current={
                            cell.date === today ? "date" : undefined
                          }
                          title={`进入 ${cell.date} 的日志`}
                        >
                          {cell.dayNumber}
                          {state === "optimistic" ? (
                            <Star size={9} aria-hidden="true" />
                          ) : state === "achieved" ? (
                            <Check size={10} aria-hidden="true" />
                          ) : null}
                        </Link>
                        <button
                          type="button"
                          className={styles.dayValue}
                          aria-label={`${label}，查看 KPI 详情`}
                          aria-pressed={cell.date === selectedDate}
                          title="查看 KPI 详情"
                          onClick={(event) => {
                            setSelectedDate(cell.date);
                            selectionTrigger.current = event.currentTarget;
                            if (
                              window.matchMedia("(max-width: 1023px)").matches
                            )
                              setDetailOpen(true);
                          }}
                        >
                          {day.actualPcts === null
                            ? "·"
                            : signed(day.actualPcts)}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <footer className={styles.monthFooter}>
                  <span>已记录</span>
                  <span>
                    {month.recordedDays} <span>/ {month.tradingDays} 天</span>
                  </span>
                </footer>
              </section>
            ))}
          </div>
          <p className={styles.calendarFootnote}>
            空位为休市日 · 淡色虚线为未填写 · 更暗的日期为未来交易日
          </p>
        </section>

        <aside className={styles.sidebar} aria-label="选中日详情">
          <div className={styles.detailHeading}>
            <span>DAILY SPOTLIGHT</span>
            <MousePointer2 size={14} aria-hidden="true" />
          </div>
          <h2>这一天的成绩</h2>
          {selected ? (
            <>
              <p className={styles.selectedDate} aria-live="polite">
                {selected.startDate.replaceAll("-", " / ")}
              </p>
              <DayDetail day={selected} today={today} />
            </>
          ) : (
            <p className={styles.detailNote}>
              选择一个交易日，查看目标完成情况。
            </p>
          )}
        </aside>
      </div>

      {selected && (
        <>
          <DialogTrigger asChild>
            <button
              className={styles.mobilePeek}
              type="button"
              onClick={(event) => {
                selectionTrigger.current = event.currentTarget;
              }}
            >
              <span>
                <small>{selected.startDate} · 每日成绩</small>
                <strong>
                  {selected.actualPcts === null
                    ? "未填写"
                    : `${signed(selected.actualPcts)} pts`}
                </strong>
              </span>
              <span>
                查看详情 <ChevronRight size={16} aria-hidden="true" />
              </span>
            </button>
          </DialogTrigger>
          <DialogContent
            className={`${styles.sheet} max-lg:translate-x-0 max-lg:translate-y-0`}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              selectionTrigger.current?.focus();
            }}
          >
            <DialogTitle>{selected.startDate} · 每日成绩</DialogTitle>
            <DialogDescription>实际 pts 与当日基准、乐观目标</DialogDescription>
            <DayDetail day={selected} today={today} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
