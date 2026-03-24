import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Security+ SY0-701 Prep",
  description: "Static CompTIA Security+ exam practice and study platform",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sec+ Prep",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <div className="mx-auto min-h-dvh max-w-5xl px-0 pb-20 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Desktop header */}
          <header className="mb-8 hidden items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-4 sm:flex">
            <div>
              <Link href="/">
                <h1 className="text-xl font-bold tracking-tight">Security+ SY0-701 Prep</h1>
              </Link>
              <p className="mt-0.5 text-sm text-zinc-400">CompTIA exam practice & study guide</p>
            </div>
            <nav className="flex gap-2 text-sm">
              <Link
                className="rounded-lg bg-zinc-800 px-4 py-2.5 font-medium transition-colors hover:bg-zinc-700"
                href="/"
              >
                Home
              </Link>
              <Link
                className="rounded-lg bg-zinc-800 px-4 py-2.5 font-medium transition-colors hover:bg-zinc-700"
                href="/study"
              >
                Study Guide
              </Link>
            </nav>
          </header>
          {children}
        </div>
        {/* Mobile bottom tab bar — hidden during exam */}
        <MobileNav />
      </body>
    </html>
  );
}
