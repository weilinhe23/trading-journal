import { KpiPeriodOverviewPage } from "~/components/kpi/KpiPeriodOverviewPage";

export const dynamic = "force-dynamic";

export default async function WeeklyKpiPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const { year } = await searchParams;
  return <KpiPeriodOverviewPage period="week" requestedYear={year} />;
}
