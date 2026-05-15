"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const COURSE_PREFIXES = ["/security-plus", "/linux", "/nmap", "/unix-security"];

export function PageFooter() {
  const pathname = usePathname();

  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  const hasBottomNav = COURSE_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <footer
      className={`mt-10 flex items-center justify-between border-t border-zinc-800/40 px-4 pt-4 sm:px-0 sm:pb-6 ${
        hasBottomNav ? "pb-28" : "pb-5"
      }`}
    >
      <Link
        href="/"
        className="text-xs !text-zinc-600 transition-colors hover:!text-zinc-400"
      >
        Home
      </Link>

      <div className="flex items-center gap-2 text-[11px] text-zinc-600">
        <span>© {new Date().getFullYear()} SecLab</span>
        <span className="text-zinc-700">·</span>
        <span className="font-mono text-zinc-700">&lt;/&gt;</span>
        <a
          href="https://www.towhid.info"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-zinc-600 transition-colors hover:!text-zinc-400"
        >
          towhid.info
        </a>
      </div>
    </footer>
  );
}
