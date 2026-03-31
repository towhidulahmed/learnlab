import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",          href: "/",               color: "hover:text-zinc-200" },
  { label: "Security+",     href: "/security-plus",  color: "hover:text-cyan-400" },
  { label: "Linux Admin",   href: "/linux",           color: "hover:text-emerald-400" },
  { label: "Nmap",          href: "/nmap",            color: "hover:text-orange-400" },
  { label: "Unix Security", href: "/unix-security",  color: "hover:text-blue-400" },
];

export function PageFooter() {
  return (
    <footer className="mt-10 border-t border-zinc-800/60 pb-24 pt-6 sm:pb-8">
      {/* Nav links */}
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm text-zinc-500 transition-colors ${link.color}`}
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
