import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security+ SY0-701 Prep",
  description: "Static CompTIA Security+ exam practice and study platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-3 sm:mb-8 sm:px-4">
            <div>
              <h1 className="text-lg font-semibold sm:text-xl">Security+ SY0-701 Prep</h1>
              <p className="text-xs text-zinc-400 sm:text-sm">Mock tests and study guide</p>
            </div>
            <nav className="grid w-full grid-cols-2 gap-2 text-center text-sm sm:flex sm:w-auto sm:text-left">
              <Link className="rounded-md bg-zinc-800 px-2 py-2 hover:bg-zinc-700 sm:px-3" href="/">
                Home
              </Link>
              <Link className="rounded-md bg-zinc-800 px-2 py-2 hover:bg-zinc-700 sm:px-3" href="/study">
                Study
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
