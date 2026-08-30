import { InsightsLibraryClient } from "~/components/insights/InsightsLibraryClient";
import { getInsightLibrary } from "~/lib/insights-server";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  return <InsightsLibraryClient initialData={await getInsightLibrary()} />;
}
