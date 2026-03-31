"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home",          href: "/"               },
  { label: "Security+",     href: "/security-plus"  },
  { label: "Linux Admin",   href: "/linux"          },
  { label: "Nmap",          href: "/nmap"           },
  { label: "Unix Security", href: "/unix-security"  },
];

export function PageFooter() {
  const pathname = usePathname();

  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  return (
    <footer className="mt-10 border-t border-zinc-800/40 px-4 pb-28 pt-6 sm:px-0 sm:pb-10">
      {/* Nav links — 3-col grid on mobile, single row on desktop */}
      <nav className="grid grid-cols-3 place-items-center gap-y-3 sm:flex sm:flex-row sm:justify-center sm:gap-x-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400 sm:text-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Branding */}
      <div className="mt-5 flex flex-col items-center gap-1">
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Stuick</p>
        <p className="flex items-center gap-1.5 text-[11px] text-zinc-700">
          <span className="font-mono text-zinc-600">&lt;/&gt;</span>
          <a
            href="https://www.towhid.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 transition-colors hover:text-zinc-400"
          >
            towhid.info
          </a>
        </p>
      </div>
    </footer>
  );
}
