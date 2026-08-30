export interface InsightAccent {
  rail: string;
  selected: string;
  badge: string;
  dot: string;
  progress: string;
  glow: string;
}

const ACCENTS = {
  amber: {
    rail: "bg-amber-400",
    selected: "border-amber-400/50 bg-amber-400/[0.07]",
    badge: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
    progress: "bg-amber-400/80",
    glow: "from-amber-400/15",
  },
  emerald: {
    rail: "bg-emerald-400",
    selected: "border-emerald-400/50 bg-emerald-400/[0.07]",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
    progress: "bg-emerald-400/80",
    glow: "from-emerald-400/15",
  },
  sky: {
    rail: "bg-sky-400",
    selected: "border-sky-400/50 bg-sky-400/[0.07]",
    badge: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    dot: "bg-sky-400",
    progress: "bg-sky-400/80",
    glow: "from-sky-400/15",
  },
  violet: {
    rail: "bg-violet-400",
    selected: "border-violet-400/50 bg-violet-400/[0.07]",
    badge: "border-violet-400/25 bg-violet-400/10 text-violet-300",
    dot: "bg-violet-400",
    progress: "bg-violet-400/80",
    glow: "from-violet-400/15",
  },
  orange: {
    rail: "bg-orange-400",
    selected: "border-orange-400/50 bg-orange-400/[0.07]",
    badge: "border-orange-400/25 bg-orange-400/10 text-orange-300",
    dot: "bg-orange-400",
    progress: "bg-orange-400/80",
    glow: "from-orange-400/15",
  },
  rose: {
    rail: "bg-rose-400",
    selected: "border-rose-400/50 bg-rose-400/[0.07]",
    badge: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    dot: "bg-rose-400",
    progress: "bg-rose-400/80",
    glow: "from-rose-400/15",
  },
  cyan: {
    rail: "bg-cyan-400",
    selected: "border-cyan-400/50 bg-cyan-400/[0.07]",
    badge: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400",
    progress: "bg-cyan-400/80",
    glow: "from-cyan-400/15",
  },
  slate: {
    rail: "bg-slate-400",
    selected: "border-slate-400/50 bg-slate-400/[0.07]",
    badge: "border-slate-400/25 bg-slate-400/10 text-slate-300",
    dot: "bg-slate-400",
    progress: "bg-slate-400/80",
    glow: "from-slate-400/15",
  },
} as const satisfies Record<string, InsightAccent>;

export function getInsightAccent(tags: string[], title: string): InsightAccent {
  const text = `${tags.join(" ")} ${title}`.toLocaleLowerCase();
  if (text.includes("level")) return ACCENTS.amber;
  if (text.includes("entry") || text.includes("入场") || text.includes("进入"))
    return ACCENTS.emerald;
  if (text.includes("趋势") || text.includes("trend")) return ACCENTS.sky;
  if (text.includes("k线") || text.includes("candle")) return ACCENTS.violet;
  if (text.includes("news") || text.includes("新闻") || text.includes("gap"))
    return ACCENTS.orange;
  if (text.includes("心理") || text.includes("情绪") || text.includes("纪律"))
    return ACCENTS.rose;
  if (text.includes("退出") || text.includes("exit")) return ACCENTS.cyan;
  return ACCENTS.slate;
}

const WEEK_DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

export function formatInsightWeek(value: string | null): string {
  if (!value) return "—";
  return WEEK_DATE_FORMATTER.format(new Date(`${value}T00:00:00.000Z`));
}
