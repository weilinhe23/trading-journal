import { execFileSync } from "node:child_process";
import { rm, rmdir } from "node:fs/promises";
import { createRequire } from "node:module";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { prisma } from "~/lib/prisma";
import { GET, POST } from "~/app/api/kpi/growth/route";
import {
  getTradingGrowthProgress,
  TradingGrowthConflictError,
  updateTradingGrowthProgress,
} from "~/lib/trading-growth-server";
import {
  TRADING_GROWTH_STEPS,
  type TradingGrowthProgress,
} from "~/lib/trading-growth";

const fixture = await vi.hoisted(async () => {
  const { mkdtemp, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const directory = await mkdtemp(path.join(tmpdir(), "trading-growth-test-"));
  const database = path.join(directory, "growth.sqlite");
  await writeFile(database, "");
  return { directory, database, url: `file:${database.replaceAll("\\", "/")}` };
});

vi.mock("~/lib/prisma", async () => {
  const { PrismaClient } = await import("../../generated/prisma");
  return { prisma: new PrismaClient({ datasourceUrl: fixture.url }) };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

beforeAll(() => {
  // Real SQLite with the actual project schema, never the user's local database.
  execFileSync(
    process.execPath,
    [
      createRequire(import.meta.url).resolve("prisma/build/index.js"),
      "db",
      "push",
      "--skip-generate",
      "--schema",
      "prisma/schema.prisma",
    ],
    { env: { ...process.env, DATABASE_URL: fixture.url }, stdio: "pipe" },
  );
}, 30_000);

beforeEach(async () => {
  vi.useRealTimers();
  await prisma.tradingGrowthCompletion.deleteMany();
  await prisma.tradingGrowthPlan.deleteMany();
});

afterAll(async () => {
  vi.useRealTimers();
  await prisma.$disconnect();
  for (const suffix of ["", "-journal", "-wal", "-shm"]) {
    await rm(`${fixture.database}${suffix}`, { force: true });
  }
  await rmdir(fixture.directory);
});

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/kpi/growth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("persistent trading growth progress", () => {
  it("starts at 4 QQQ with no invented completion dates", async () => {
    const progress = await getTradingGrowthProgress();
    expect(progress.completedCount).toBe(0);
    expect(progress.completions).toEqual([]);
    expect(progress.currentDayCount).toBe(1);
    expect(TRADING_GROWTH_STEPS).toHaveLength(23);
    expect(TRADING_GROWTH_STEPS.map((step) => step.label)).toEqual([
      "4 股 QQQ",
      "8 股 QQQ",
      "16 股 QQQ",
      "32 股 QQQ",
      ...Array.from({ length: 9 }, (_, i) => `${i + 1} 手 MNQ`),
      ...Array.from({ length: 10 }, (_, i) => `${i + 1} 手 NQ`),
    ]);
    expect((await GET()).status).toBe(200);
  });

  it.each([
    ["2026-01-15T04:30:00.000Z", "2026-01-14"],
    ["2026-07-15T03:30:00.000Z", "2026-07-14"],
    ["2026-03-08T07:30:00.000Z", "2026-03-08"],
  ])(
    "records server time %s as Eastern date %s and survives a fresh read",
    async (instant, date) => {
      const initial = await getTradingGrowthProgress();
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date(instant));
      const response = await post({
        action: "complete",
        revision: initial.revision,
      });
      expect(response.status).toBe(200);
      const saved = await getTradingGrowthProgress();
      expect(saved.completedCount).toBe(1);
      expect(saved.completions).toEqual([
        { stepIndex: 0, completedAt: instant, completedDate: date },
      ]);
      expect(saved.currentStartedDate).toBe(date);
      expect(saved.currentDayCount).toBe(1);
      await prisma.$disconnect();
      expect((await getTradingGrowthProgress()).completions).toEqual(
        saved.completions,
      );
    },
  );

  it("rejects stale duplicate requests without changing the original date", async () => {
    const initial = await getTradingGrowthProgress();
    const saved = await updateTradingGrowthProgress(
      "complete",
      initial.revision,
    );
    const duplicate = await post({
      action: "complete",
      revision: initial.revision,
    });
    expect(duplicate.status).toBe(409);
    expect(await getTradingGrowthProgress()).toEqual(saved);
  });

  it("allows only one of two concurrent completions", async () => {
    const initial = await getTradingGrowthProgress();
    const results = await Promise.allSettled([
      updateTradingGrowthProgress("complete", initial.revision),
      updateTradingGrowthProgress("complete", initial.revision),
    ]);
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect((await getTradingGrowthProgress()).completedCount).toBe(1);
    expect(await prisma.tradingGrowthCompletion.count()).toBe(1);
  });

  it("undo removes only the last completion and redo gets a new date", async () => {
    const initial = await getTradingGrowthProgress();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-20T20:00:00Z"));
    const first = await updateTradingGrowthProgress(
      "complete",
      initial.revision,
    );
    const second = await updateTradingGrowthProgress(
      "complete",
      first.revision,
    );
    expect(second.completions).toHaveLength(2);
    const undone = await updateTradingGrowthProgress("undo", second.revision);
    expect(undone.completedCount).toBe(1);
    expect(undone.completions).toEqual(first.completions);
    await expect(
      updateTradingGrowthProgress("complete", first.revision),
    ).rejects.toBeInstanceOf(TradingGrowthConflictError);
    vi.setSystemTime(new Date("2026-09-22T20:00:00Z"));
    const redone = await updateTradingGrowthProgress(
      "complete",
      undone.revision,
    );
    expect(redone.completions[0]).toEqual(first.completions[0]);
    expect(redone.completions[1]?.completedDate).toBe("2026-09-22");
  });

  it("handles the start and final boundaries and can undo after all 23 goals", async () => {
    let progress = await getTradingGrowthProgress();
    await expect(
      updateTradingGrowthProgress("undo", progress.revision),
    ).rejects.toBeInstanceOf(TradingGrowthConflictError);
    for (let i = 0; i < 23; i++)
      progress = await updateTradingGrowthProgress(
        "complete",
        progress.revision,
      );
    expect(progress.completedCount).toBe(23);
    expect(progress.completions).toHaveLength(23);
    expect(progress.currentStartedDate).toBeNull();
    await expect(
      updateTradingGrowthProgress("complete", progress.revision),
    ).rejects.toBeInstanceOf(TradingGrowthConflictError);
    const undone = await updateTradingGrowthProgress("undo", progress.revision);
    expect(undone.completedCount).toBe(22);
    expect(undone.completions).toHaveLength(22);
  });

  it("rejects malformed actions and client-supplied completion timestamps", async () => {
    await getTradingGrowthProgress();
    for (const body of [
      { action: "skip", revision: 0 },
      { action: "complete", revision: -1 },
      { action: "complete", revision: 0, completedAt: "2020-01-01" },
      { action: "complete" },
    ])
      expect((await post(body)).status).toBe(400);
    const invalidJson = await POST(
      new Request("http://localhost/api/kpi/growth", {
        method: "POST",
        body: "{",
      }),
    );
    expect(invalidJson.status).toBe(400);
    const result = (await (await GET()).json()) as {
      data: TradingGrowthProgress;
    };
    expect(result.data.completedCount).toBe(0);
    expect(result.data.completions).toEqual([]);
  });
});
