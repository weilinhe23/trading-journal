"use client";

import { Button } from "~/components/ui/button";

export default function InsightsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border p-8 text-center">
      <h1 className="text-xl font-semibold">经验库暂时无法加载</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        数据库可能正在迁移或被占用，请稍后重试。
      </p>
      <Button className="mt-5" onClick={reset}>
        重新加载
      </Button>
    </div>
  );
}
