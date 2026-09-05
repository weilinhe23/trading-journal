"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KpiTrendExplorer } from "~/components/kpi/KpiTrendExplorer";
import { shiftKpiAnchor, type KpiPeriodSummary } from "~/lib/kpi";
import {
  isComparisonPeriod,
  normalizeAnchor,
  recentPeriodRange as preset,
  validAnalysisDate,
  type AnalysisDay,
  type AnalysisPeriod,
  type ComparisonMode,
  type ComparisonPeriod,
  type ComparisonResponse,
  type PeriodOverview,
  type TrendMetric,
  type TrendsResponse,
} from "~/lib/kpi-comparison";

const loadingChart = () => (
  <div className="text-muted-foreground p-8 text-sm">加载图表…</div>
);
const RangeChart = dynamic(
  () => import("./KpiAnalysisCharts").then((m) => m.KpiPeriodTrendChart),
  { ssr: false, loading: loadingChart },
);
const ComparisonChart = dynamic(
  () => import("./KpiAnalysisCharts").then((m) => m.KpiComparisonChart),
  { ssr: false, loading: loadingChart },
);
const fmt = (v: number | null | undefined) =>
  v == null
    ? "—"
    : new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(v);
const selectClass =
  "border-input bg-background h-9 rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";
const labels = { week: "周", month: "月", quarter: "季度" };

function formText(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

type View = "range" | "compare" | "single";
interface Config {
  view: View;
  period: ComparisonPeriod;
  from: string;
  to: string;
  anchors: string[];
  baseline: string;
  mode: ComparisonMode;
  metric: TrendMetric;
  smooth: boolean;
  detail: string;
}

function defaultConfig(today: string): Config {
  return {
    view: "range",
    period: "week",
    ...preset("week", today, 4),
    anchors: [],
    baseline: "",
    mode: "aligned",
    metric: "actual",
    smooth: false,
    detail: "",
  };
}

function readConfig(today: string): Config {
  const params = new URLSearchParams(window.location.search);
  const defaults = defaultConfig(today);
  const p = params.get("kp");
  const period = p && isComparisonPeriod(p) ? p : defaults.period;
  const range = preset(period, today, period === "week" ? 4 : undefined);
  const from = params.get("kf") ?? range.from;
  const to = params.get("kt") ?? range.to;
  const anchors = [
    ...new Set(
      (params.get("ka") ?? "")
        .split(",")
        .filter(validAnalysisDate)
        .map((a) => normalizeAnchor(period, a)),
    ),
  ]
    .filter((a) => a <= today)
    .sort()
    .slice(0, 6);
  const base = params.get("kb") ?? "";
  const detail = params.get("kd") ?? "";
  const view = params.get("kv");
  const metric = params.get("km");
  return {
    ...defaults,
    period,
    from:
      validAnalysisDate(from) && validAnalysisDate(to) && from <= to
        ? from
        : range.from,
    to:
      validAnalysisDate(from) && validAnalysisDate(to) && from <= to
        ? to
        : range.to,
    anchors,
    baseline: anchors.includes(base) ? base : (anchors[0] ?? ""),
    detail: validAnalysisDate(detail) ? normalizeAnchor(period, detail) : "",
    view: view === "single" || view === "compare" ? view : "range",
    mode: params.get("kc") === "full" ? "full" : "aligned",
    metric: metric === "completion" || metric === "average" ? metric : "actual",
    smooth: params.get("ks") === "1",
  };
}

function useQuery<T>(url: string | null, revision: KpiPeriodSummary) {
  const [result, setResult] = useState<{
    url: string;
    data?: T;
    error?: string;
  } | null>(null);
  const [retry, setRetry] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setLoading(true);
    setResult(null);
    void (async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        const body = (await response.json()) as {
          success: boolean;
          data?: T;
          error?: string;
        };
        if (!response.ok || !body.success || !body.data)
          throw new Error(body.error ?? "查询失败");
        if (!controller.signal.aborted) setResult({ url, data: body.data });
      } catch (error) {
        if (!controller.signal.aborted)
          setResult({
            url,
            error: error instanceof Error ? error.message : "查询失败",
          });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [url, retry, revision]);
  return {
    data: result?.url === url ? result.data : undefined,
    error: result?.url === url ? result.error : undefined,
    loading: Boolean(url) && (loading || result?.url !== url),
    retry: () => setRetry((v) => v + 1),
  };
}

export function KpiAnalysisExplorer({
  initialSummary,
  today,
}: {
  initialSummary: KpiPeriodSummary;
  today: string;
}) {
  const router = useRouter();
  const [config, setConfig] = useState<Config>(() => defaultConfig(today));
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => {
    const restore = () => {
      setConfig(readConfig(today));
      setReady(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [today]);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    const entries = {
      kv: config.view,
      kp: config.period,
      kf: config.from,
      kt: config.to,
      ka: config.anchors.join(","),
      kb: config.baseline,
      kc: config.mode,
      km: config.metric,
      ks: config.smooth ? "1" : "0",
      kd: config.detail,
    };
    for (const [key, value] of Object.entries(entries)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [config, ready]);

  const rangeParams = new URLSearchParams({
    period: config.period,
    from: config.from,
    to: config.to,
  });
  if (config.detail) rangeParams.set("detail", config.detail);
  const trend = useQuery<TrendsResponse>(
    ready && config.view !== "single" ? `/api/kpi/trends?${rangeParams}` : null,
    initialSummary,
  );
  const compareParams = new URLSearchParams({
    period: config.period,
    anchors: config.anchors.join(","),
    baseline: config.baseline,
    mode: config.mode,
  });
  const comparison = useQuery<ComparisonResponse>(
    ready && config.view === "compare" && config.anchors.length >= 2
      ? `/api/kpi/comparison?${compareParams}`
      : null,
    initialSummary,
  );

  function changePeriod(period: ComparisonPeriod) {
    setConfig((old) => ({
      ...old,
      period,
      anchors: [],
      baseline: "",
      detail: "",
    }));
    setPage(0);
    setNotice(`已切换为${labels[period]}，请重新选择对比周期。`);
  }
  function toggleAnchor(date: string) {
    const anchor = normalizeAnchor(config.period, date);
    if (anchor > today) {
      setNotice("尚未开始的周期不能加入对比。");
      return;
    }
    if (!config.anchors.includes(anchor) && config.anchors.length >= 6) {
      setNotice("最多同时对比 6 个周期，请先移除一个。");
      return;
    }
    setConfig((old) => {
      const anchors = old.anchors.includes(anchor)
        ? old.anchors.filter((a) => a !== anchor)
        : [...old.anchors, anchor].sort();
      return {
        ...old,
        anchors,
        baseline: anchors.includes(old.baseline)
          ? old.baseline
          : (anchors[0] ?? ""),
      };
    });
    setNotice("");
  }
  function quickCompare() {
    const anchor = normalizeAnchor(config.period, today);
    const previous = shiftKpiAnchor(config.period, anchor, -1);
    setConfig((old) => ({
      ...old,
      view: "compare",
      anchors: [previous, anchor],
      baseline: previous,
    }));
  }
  const current = trend.data?.current;
  const pageCount = Math.max(
    1,
    Math.ceil((trend.data?.items.length ?? 0) / 24),
  );
  const displayPage = Math.min(page, pageCount - 1);

  return (
    <section
      className="bg-card border-border/70 space-y-5 rounded-xl border p-4 shadow-sm sm:p-6"
      id="kpi-trends"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">KPI 趋势与周期对比</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            基于每日录入 PTS · 美东交易日 · 点击周期查看每日贡献
          </p>
        </div>
        <div className="flex flex-wrap gap-1" aria-label="趋势视图">
          {(
            [
              ["range", "范围趋势"],
              ["compare", "周期叠加"],
              ["single", "单周期"],
            ] as const
          ).map(([view, label]) => (
            <Button
              key={view}
              size="sm"
              variant={config.view === view ? "default" : "outline"}
              aria-pressed={config.view === view}
              onClick={() => setConfig((old) => ({ ...old, view }))}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {config.view === "single" ? (
        <KpiTrendExplorer initialSummary={initialSummary} today={today} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["week", 4],
                ["week", 12],
                ["month", 12],
                ["quarter", 8],
              ] as const
            ).map(([period, count]) => {
              const range = preset(period, today, count);
              const active =
                config.view === "range" &&
                config.period === period &&
                config.from === range.from &&
                config.to === range.to;
              return (
                <Button
                  key={`${period}-${count}`}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  aria-pressed={active}
                  onClick={() => {
                    setConfig((old) => ({
                      ...old,
                      period,
                      ...range,
                      anchors: [],
                      baseline: "",
                      detail: "",
                      view: "range",
                    }));
                    setPage(0);
                  }}
                >
                  最近 {count} {labels[period]}
                </Button>
              );
            })}
            <Button size="sm" variant="outline" onClick={quickCompare}>
              本期与上期
            </Button>
          </div>
          <form
            key={`${config.from}:${config.to}`}
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const from = formText(form, "from"),
                to = formText(form, "to");
              if (
                !validAnalysisDate(from) ||
                !validAnalysisDate(to) ||
                from > to
              ) {
                setNotice("请输入有效日期，开始不能晚于结束。");
                return;
              }
              setConfig((old) => ({ ...old, from, to, detail: "" }));
              setPage(0);
              setNotice("");
            }}
          >
            <label className="grid gap-1 text-xs">
              统计粒度
              <select
                className={selectClass}
                value={config.period}
                onChange={(e) => {
                  if (isComparisonPeriod(e.target.value))
                    changePeriod(e.target.value);
                }}
              >
                <option value="week">周</option>
                <option value="month">月</option>
                <option value="quarter">季度</option>
              </select>
            </label>
            <label className="grid gap-1 text-xs">
              开始日期
              <Input
                aria-label="开始日期"
                type="date"
                name="from"
                required
                min="1900-01-01"
                max="2200-12-31"
                defaultValue={config.from}
              />
            </label>
            <label className="grid gap-1 text-xs">
              结束日期
              <Input
                aria-label="结束日期"
                type="date"
                name="to"
                required
                min="1900-01-01"
                max="2200-12-31"
                defaultValue={config.to}
              />
            </label>
            <Button type="submit" size="sm">
              查询范围
            </Button>
            <label className="grid gap-1 text-xs">
              展示指标
              <select
                className={selectClass}
                value={config.metric}
                onChange={(e) =>
                  setConfig((old) => ({
                    ...old,
                    metric: e.target.value as TrendMetric,
                  }))
                }
              >
                <option value="actual">累计 PTS</option>
                <option value="completion">目标完成率</option>
                <option value="average">日均 PTS</option>
              </select>
            </label>
          </form>
          {notice ? (
            <p role="status" className="text-sm text-amber-500">
              {notice}
            </p>
          ) : null}
          {current ? <CurrentSummary current={current} today={today} /> : null}
          <QueryStatus
            loading={trend.loading}
            error={trend.error}
            retry={trend.retry}
          />
          {config.view === "range" && trend.data ? (
            <>
              <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
                <p>
                  实际范围 {trend.data.from} – {trend.data.to}
                  （扩展到自然周期边界）
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.smooth}
                    onChange={(e) =>
                      setConfig((old) => ({ ...old, smooth: e.target.checked }))
                    }
                  />
                  4 期移动平均
                </label>
              </div>
              <div className="h-[340px]" aria-label="各期实际表现与目标趋势">
                <RangeChart
                  items={trend.data.items}
                  metric={config.metric}
                  smoothing={config.smooth}
                  onSelect={(detail) =>
                    setConfig((old) => ({ ...old, detail }))
                  }
                />
              </div>
              <p className="text-muted-foreground text-xs">
                紫柱：实际
                {config.metric === "completion"
                  ? "全期完成率"
                  : config.metric === "average"
                    ? "日均 PTS"
                    : "累计 PTS"}
                。
                {config.metric === "actual"
                  ? "蓝线：全期基准；绿虚线：全期乐观目标。"
                  : ""}
                {config.smooth
                  ? "橙线：连续 4 个完整且无漏录周期的平均值。"
                  : ""}
                无记录显示缺口；未结束周期仅累计至今天。
              </p>
              {!trend.data.items.some((item) => item.actual !== null) ? (
                <p role="status" className="rounded-lg border p-4 text-sm">
                  范围内暂无 KPI 记录，可在下方查看日期并补录。
                </p>
              ) : null}
            </>
          ) : null}
          {config.view === "compare" ? (
            <>
              <form
                className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const value = formText(
                    new FormData(event.currentTarget),
                    "anchor",
                  );
                  if (validAnalysisDate(value)) {
                    const anchor = normalizeAnchor(config.period, value);
                    if (config.anchors.includes(anchor))
                      setNotice("该周期已在对比列表中。");
                    else toggleAnchor(value);
                  }
                }}
              >
                <label className="grid gap-1 text-xs">
                  添加任意周期（选该期内任一天）
                  <Input
                    name="anchor"
                    aria-label="添加周期日期"
                    type="date"
                    required
                    min="1900-01-01"
                    max={today}
                  />
                </label>
                <Button type="submit" size="sm" variant="outline">
                  添加周期
                </Button>
                <label className="grid gap-1 text-xs">
                  比较基准
                  <select
                    className={selectClass}
                    value={config.baseline}
                    disabled={!config.anchors.length}
                    onChange={(e) =>
                      setConfig((old) => ({ ...old, baseline: e.target.value }))
                    }
                  >
                    {!config.anchors.length ? (
                      <option value="">请先选择周期</option>
                    ) : null}
                    {config.anchors.map((a) => (
                      <option key={a} value={a}>
                        {a} 起
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs">
                  比较口径
                  <select
                    className={selectClass}
                    value={config.mode}
                    onChange={(e) =>
                      setConfig((old) => ({
                        ...old,
                        mode: e.target.value as ComparisonMode,
                      }))
                    }
                  >
                    <option value="aligned">同交易日进度</option>
                    <option value="full">整期（未结束期截至今天）</option>
                  </select>
                </label>
              </form>
              <div className="flex flex-wrap gap-2">
                {config.anchors.map((a) => (
                  <Button
                    key={a}
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAnchor(a)}
                    aria-label={`移除 ${a} 周期`}
                  >
                    {a} 起 ×{a === config.baseline ? " 基准" : ""}
                  </Button>
                ))}
              </div>
              {config.anchors.length < 2 ? (
                <p className="rounded-lg border border-dashed p-6 text-sm">
                  请选择 2–6 个{labels[config.period]}
                  周期，可跨年、不连续；也可在下方列表勾选。
                </p>
              ) : (
                <QueryStatus
                  loading={comparison.loading}
                  error={comparison.error}
                  retry={comparison.retry}
                />
              )}
              {comparison.data ? (
                <>
                  <p className="text-muted-foreground text-xs">
                    {config.mode === "aligned"
                      ? `摘要比较各期前 ${comparison.data.alignedDays} 个交易日；竖线右侧保留后续走势。`
                      : "比较各期全部已到达交易日，未结束周期可能因天数较少而偏低。"}
                    完成率按对应比较窗口目标计算。
                  </p>
                  <ComparisonChart
                    data={comparison.data}
                    metric={config.metric}
                  />
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">周期</th>
                          <th>比较累计 PTS</th>
                          <th>较基准 PTS</th>
                          <th>变化率</th>
                          <th>完成率</th>
                          <th>录入情况</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.data.series.map((s) => (
                          <tr key={s.period.anchor} className="border-b">
                            <td className="p-2">
                              <button
                                type="button"
                                className="text-primary underline"
                                onClick={() =>
                                  setConfig((old) => ({
                                    ...old,
                                    detail: s.period.anchor,
                                  }))
                                }
                              >
                                {s.period.label}
                              </button>
                              {s.period.unfinished ? " · 未结束" : ""}
                            </td>
                            <td>{fmt(s.metrics.actual)}</td>
                            <td>
                              {s.period.anchor === config.baseline
                                ? "基准"
                                : fmt(s.change.delta)}
                            </td>
                            <td>
                              {s.period.anchor === config.baseline
                                ? "—"
                                : `${fmt(s.change.percent)}%`}
                              {s.period.anchor !== config.baseline ? (
                                <span className="text-muted-foreground block">
                                  {s.adjacent ? "环比" : "较基准变化"}
                                </span>
                              ) : null}
                            </td>
                            <td>{fmt(s.metrics.completion)}%</td>
                            <td className="py-2">
                              {s.metrics.recorded}/{s.metrics.expected}
                              <span className="block text-amber-500">
                                {s.change.reason}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
          {trend.data ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  周期明细与选择 · 已选 {config.anchors.length}/6
                </h3>
                <Button
                  size="sm"
                  disabled={config.anchors.length < 2}
                  onClick={() =>
                    setConfig((old) => ({ ...old, view: "compare" }))
                  }
                >
                  对比已选周期
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">选择 / 周期</th>
                      <th>累计 PTS</th>
                      <th>全期完成率</th>
                      <th>日均 PTS</th>
                      <th>每日达标率</th>
                      <th>环比 PTS / %</th>
                      <th>录入情况</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.data.items
                      .slice(displayPage * 24, (displayPage + 1) * 24)
                      .map((item) => (
                        <tr key={item.anchor} className="border-b">
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                aria-label={`选择 ${item.label}`}
                                checked={config.anchors.includes(item.anchor)}
                                disabled={item.future}
                                onChange={() => toggleAnchor(item.anchor)}
                              />
                              <button
                                type="button"
                                className="text-primary text-left underline"
                                onClick={() =>
                                  setConfig((old) => ({
                                    ...old,
                                    detail: item.anchor,
                                  }))
                                }
                              >
                                {item.label}
                              </button>
                            </div>
                            <span className="text-muted-foreground">
                              {item.future
                                ? "尚未开始"
                                : item.unfinished
                                  ? `截至 ${today} · 未结束`
                                  : "完整周期"}
                            </span>
                          </td>
                          <td>{fmt(item.actual)}</td>
                          <td>{fmt(item.fullCompletion)}%</td>
                          <td>{fmt(item.average)}</td>
                          <td>{fmt(item.hitRate)}%</td>
                          <td>
                            {fmt(item.change.delta)} /{" "}
                            {fmt(item.change.percent)}%
                            <span className="text-muted-foreground block">
                              {item.change.reason}
                            </span>
                          </td>
                          <td>
                            {item.recorded}/{item.expected}
                            {!item.complete && !item.future ? (
                              <span className="block text-amber-500">
                                {item.recorded ? "数据不完整" : "暂无记录"}
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {pageCount > 1 ? (
                <div className="flex items-center gap-3 text-xs">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={displayPage === 0}
                    onClick={() => setPage(displayPage - 1)}
                  >
                    上一页
                  </Button>
                  {displayPage + 1}/{pageCount}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={displayPage + 1 === pageCount}
                    onClick={() => setPage(displayPage + 1)}
                  >
                    下一页
                  </Button>
                </div>
              ) : null}
              <p className="text-muted-foreground text-xs">
                日均与每日达标率以已录入日为分母；有漏录时仅供参考。环比对照紧邻上一自然周期；全期完成率使用全期目标。
              </p>
              {trend.data.detail ? (
                <DailyDetail
                  key={trend.data.detail.anchor}
                  detail={trend.data.detail}
                  onSaved={() => {
                    trend.retry();
                    comparison.retry();
                    router.refresh();
                  }}
                  onClose={() => setConfig((old) => ({ ...old, detail: "" }))}
                />
              ) : null}
            </>
          ) : null}
        </>
      )}
    </section>
  );
}

function QueryStatus({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error?: string;
  retry: () => void;
}) {
  if (error)
    return (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-lg border p-3 text-sm"
      >
        {error}
        <Button size="sm" variant="outline" onClick={retry}>
          重试
        </Button>
      </div>
    );
  return loading ? (
    <p role="status" className="text-muted-foreground text-sm">
      正在查询 KPI 数据…
    </p>
  ) : null;
}

function CurrentSummary({
  current,
  today,
}: {
  current: PeriodOverview;
  today: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs">
        当前周期：{current.label} · 截至 {today}（ET）· 已录入{" "}
        {current.recorded}/{current.expected}
        {!current.complete ? " · 数据不完整" : ""}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "本期累计",
            `${fmt(current.actual)} PTS`,
            `全期完成率 ${fmt(current.fullCompletion)}%`,
          ],
          [
            "截至今日目标差额",
            `${fmt(current.gap)} PTS`,
            `进度目标 ${fmt(current.baseline)} PTS · 完成 ${fmt(current.completion)}%`,
          ],
          ["日均 PTS", fmt(current.average), "以已录入交易日为分母"],
          [
            "每日基准达标率",
            `${fmt(current.hitRate)}%`,
            "达标日数 ÷ 已录入日数",
          ],
        ].map(([label, value, note]) => (
          <div key={label} className="bg-background/40 rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="my-1 text-xl font-semibold tabular-nums">{value}</p>
            <p className="text-muted-foreground text-xs">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyDetail({
  detail,
  onClose,
  onSaved,
}: {
  detail: AnalysisPeriod;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState<AnalysisDay | null>(null);
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{detail.label} · 每日贡献</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>
          收起
        </Button>
      </div>
      {editing ? (
        <DayEditor
          key={editing.date}
          day={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onSaved();
          }}
        />
      ) : null}
      {!detail.days.length ? (
        <p className="text-sm">该周期尚无已到达交易日。</p>
      ) : (
        <div className="max-h-96 overflow-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-card sticky top-0">
              <tr>
                <th className="p-2">日期 / 复盘</th>
                <th>当日 PTS</th>
                <th>累计 PTS</th>
                <th>当日基准目标</th>
                <th>录入</th>
              </tr>
            </thead>
            <tbody>
              {detail.days.map((day) => (
                <tr key={day.date} className="border-t">
                  <td className="p-2">
                    <Link
                      className="text-primary underline"
                      href={`/journal/${day.date}`}
                    >
                      {day.date}
                    </Link>
                  </td>
                  <td>{fmt(day.actual)}</td>
                  <td>{fmt(day.cumulative)}</td>
                  <td>{fmt(day.baseline)}</td>
                  <td>
                    <button
                      type="button"
                      className={
                        day.actual === null
                          ? "text-amber-500 underline"
                          : "text-primary underline"
                      }
                      onClick={() => setEditing(day)}
                    >
                      {day.actual === null ? "未录入 · 补录" : "已录入 · 编辑"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DayEditor({
  day,
  onCancel,
  onSaved,
}: {
  day: AnalysisDay;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="bg-background/50 mb-4 space-y-3 rounded-lg border p-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const value = formText(form, "actual");
        if (!value.trim() || !Number.isFinite(Number(value))) {
          setError("请输入有效的 PTS");
          return;
        }
        setSaving(true);
        setError("");
        void (async () => {
          try {
            const response = await fetch(`/api/kpi/records/${day.date}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                actualPcts: Number(value),
                note: formText(form, "note").trim() || null,
              }),
            });
            const body = (await response.json()) as {
              success: boolean;
              error?: string;
            };
            if (!response.ok || !body.success)
              throw new Error(body.error ?? "保存失败");
            onSaved();
          } catch (err) {
            setError(err instanceof Error ? err.message : "保存失败");
          } finally {
            setSaving(false);
          }
        })();
      }}
    >
      <p className="text-sm font-medium">
        {day.date} · {day.actual === null ? "补录 KPI" : "编辑 KPI"}
      </p>
      <label className="grid gap-1 text-xs">
        实际 PTS
        <Input
          name="actual"
          type="number"
          step="any"
          required
          defaultValue={day.actual ?? ""}
          disabled={saving}
        />
      </label>
      <label className="grid gap-1 text-xs">
        备注
        <Input
          name="note"
          defaultValue={day.note ?? ""}
          maxLength={500}
          disabled={saving}
        />
      </label>
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "保存中…" : "保存并刷新趋势"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={onCancel}
        >
          取消
        </Button>
      </div>
    </form>
  );
}
