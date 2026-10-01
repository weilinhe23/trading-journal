import { ScreenshotGrid } from "~/components/screenshot/ScreenshotGrid";
import type { AnalyticsScreenshot } from "~/lib/analytics-screenshots";

export function DailyScreenshotReview({
  screenshots,
}: {
  screenshots: AnalyticsScreenshot[];
}) {
  return (
    <section className="mt-5 border-t pt-4">
      <h4 className="mb-2 text-sm font-medium">当日交易截图</h4>
      {screenshots.length > 0 ? (
        <div className="max-w-3xl">
          <ScreenshotGrid screenshots={screenshots} />
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">当日日志暂无交易截图</p>
      )}
    </section>
  );
}
