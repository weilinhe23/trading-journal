import Link from "next/link";
import { Button } from "~/components/ui/button";

export type KpiHistoryView = "daily" | "weekly" | "monthly" | "quarterly";

const VIEW_LINKS: Array<{
  key: KpiHistoryView;
  label: string;
  path: string;
}> = [
  { key: "daily", label: "每日", path: "/kpi/yearly" },
  { key: "weekly", label: "每周", path: "/kpi/weekly" },
  { key: "monthly", label: "每月", path: "/kpi/monthly" },
  { key: "quarterly", label: "每季度", path: "/kpi/quarterly" },
];

export function KpiHistoryViewNav({
  current,
  year,
}: {
  current: KpiHistoryView;
  year: number;
}) {
  return (
    <nav
      aria-label="KPI 历史视图"
      className="border-border/70 bg-card/50 flex w-fit flex-wrap items-center rounded-lg border p-1"
    >
      {VIEW_LINKS.map((view) => (
        <Button
          key={view.key}
          variant={current === view.key ? "secondary" : "ghost"}
          size="sm"
          asChild
        >
          <Link
            href={`${view.path}?year=${year}`}
            aria-current={current === view.key ? "page" : undefined}
          >
            {view.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
