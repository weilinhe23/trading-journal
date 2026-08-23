import { KpiPeriodOverviewPage } from "~/components/kpi/KpiPeriodOverviewPage";

export const dynamic = "force-dynamic";

export default async function MonthlyKpiPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const { year } = await searchParams;
  return <KpiPeriodOverviewPage period="month" requestedYear={year} />;
}
