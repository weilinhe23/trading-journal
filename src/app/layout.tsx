import "~/styles/globals.css"

import { type Metadata } from "next"
import { Geist } from "next/font/google"
import Link from "next/link"
import { Toaster } from "~/components/ui/sonner"

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "美股日内交易复盘日志",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geist.variable} dark`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto flex h-14 items-center px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
                <span className="text-lg">📈</span>
                <span>Trading Journal</span>
              </Link>
              <nav className="ml-8 flex items-center gap-6 text-sm text-muted-foreground">
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
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
