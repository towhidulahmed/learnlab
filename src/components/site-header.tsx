"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  // Hide header entirely during active mock exams (but show on result pages)
  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  const isHome = pathname === "/";

  return (
    <header className={`${isHome ? "hidden sm:flex" : "flex"} sticky top-0 z-30 mb-4 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/95 px-4 py-3 backdrop-blur-sm sm:static sm:mb-8 sm:rounded-xl sm:border sm:border-zinc-800 sm:bg-zinc-900/70 sm:px-5 sm:py-4`}>
      <Link href="/" className="flex items-center gap-2.5">
        <span className="text-lg font-bold tracking-tight sm:text-xl">Stuick</span>
      </Link>
      {!isHome && (
        <nav>
          <Link
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-700 active:bg-zinc-600"
            href="/"
          >
            Home
          </Link>
        </nav>
      )}
    </header>
  );
}
