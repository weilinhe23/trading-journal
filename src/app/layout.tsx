import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "美股日内交易复盘日志",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} dark`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="bg-background sticky top-0 z-50 border-b">
            <div className="container mx-auto flex h-14 min-w-0 items-center overflow-hidden px-4">
              <Link
                href="/"
                className="text-foreground flex shrink-0 items-center gap-2 font-semibold"
              >
                <span className="text-lg">📈</span>
                <span className="hidden sm:inline">Trading Journal</span>
              </Link>
              <nav className="text-muted-foreground ml-4 flex min-w-0 flex-1 items-center gap-5 overflow-x-auto text-sm whitespace-nowrap [scrollbar-width:none] sm:ml-8 sm:gap-6 [&::-webkit-scrollbar]:hidden">
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  首页
                </Link>
                <Link
                  href="/journal"
                  className="hover:text-foreground transition-colors"
                >
                  日志
                </Link>
                <Link
                  href="/kpi"
                  className="hover:text-foreground transition-colors"
                >
                  KPI
                </Link>
                <Link
                  href="/analytics"
                  className="hover:text-foreground transition-colors"
                >
                  统计
                </Link>
                <Link
                  href="/strategies"
                  className="hover:text-foreground transition-colors"
                >
                  策略
                </Link>
                <Link
                  href="/news"
                  className="hover:text-foreground transition-colors"
                >
                  新闻
                </Link>
                <Link
                  href="/weekly"
                  className="hover:text-foreground transition-colors"
                >
                  周报
                </Link>
                <Link
                  href="/insights"
                  className="hover:text-foreground transition-colors"
                >
                  经验库
                </Link>
                <Link
                  href="/monthly"
                  className="hover:text-foreground transition-colors"
                >
                  月报
                </Link>
                <Link
                  href="/quarterly"
                  className="hover:text-foreground transition-colors"
                >
                  季报
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1800px] flex-1 px-4 py-6">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
