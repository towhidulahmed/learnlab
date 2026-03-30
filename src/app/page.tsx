import Link from "next/link";
import { Logo } from "@/components/logo";
import { DOMAIN_KEYS } from "@/lib/constants";
import { LINUX_STUDY } from "@/lib/linux-study-data";
import { NMAP_TOTAL_TOPICS } from "@/lib/nmap-study-data";
import { UNIX_SECURITY_TOTAL_TOPICS } from "@/lib/unix-security-study-data";

const COURSES = [
  {
    href: "/security-plus",
    title: "CompTIA Security+",
    subtitle: "SY0-701 Exam Prep",
    description: "Mock exams, practice questions, and a full study guide.",
    accent: "cyan",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    tags: [`${DOMAIN_KEYS.length} Domains`, "Mock Exams", "Study Guide"],
    accentClasses: {
      card: "sm:hover:border-cyan-800/40",
      iconBg: "bg-cyan-950/40 text-cyan-400",
      tag: "bg-cyan-950/40 text-cyan-400",
      arrow: "text-cyan-500/40",
    },
  },
  {
    href: "/linux",
    title: "Linux Administration",
    subtitle: "System Admin Essentials",
    description: "Study guides, flashcards, and practice exams.",
    accent: "emerald",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25z" />
      </svg>
    ),
    tags: [`${LINUX_STUDY.reduce((s, d) => s + d.topics.length, 0)} Topics`, "Flashcards", "Practice"],
    accentClasses: {
      card: "sm:hover:border-emerald-800/40",
      iconBg: "bg-emerald-950/40 text-emerald-400",
      tag: "bg-emerald-950/40 text-emerald-400",
      arrow: "text-emerald-500/40",
    },
  },
  {
    href: "/nmap",
    title: "Nmap, Network Scanning",
    subtitle: "Network Recon & Pen Testing",
    description: "Master port scanning, service detection, NSE scripting, and evasion techniques.",
    accent: "orange",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
    tags: [`${NMAP_TOTAL_TOPICS} Topics`, "Flashcards", "Practice"],
    accentClasses: {
      card: "sm:hover:border-orange-800/40",
      iconBg: "bg-orange-950/40 text-orange-400",
      tag: "bg-orange-950/40 text-orange-400",
      arrow: "text-orange-500/40",
    },
  },
  {
    href: "/unix-security",
    title: "Unix Security Monitoring",
    subtitle: "Defense & Threat Detection",
    description: "Learn to read what your system is really doing and spot what should not be there.",
    accent: "blue",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
      </svg>
    ),
    tags: [`${UNIX_SECURITY_TOTAL_TOPICS} Modules`, "Flashcards", "Practice"],
    accentClasses: {
      card: "sm:hover:border-blue-800/40",
      iconBg: "bg-blue-950/40 text-blue-400",
      tag: "bg-blue-950/40 text-blue-400",
      arrow: "text-blue-500/40",
    },
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-950/50 text-emerald-400 border-emerald-900/40",
  blue: "bg-blue-950/50 text-blue-400 border-blue-900/40",
  orange: "bg-orange-950/50 text-orange-400 border-orange-900/40",
  cyan: "bg-cyan-950/50 text-cyan-400 border-cyan-900/40",
};

function PathStep({ num, label, href, color }: { num: number; label: string; href: string; color: string }) {
  return (
    <a href={href} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${colorMap[color]}`}>
      <span className="opacity-60">{num}.</span>
      {label}
    </a>
  );
}

function Arrow() {
  return <span className="text-zinc-700 text-xs">→</span>;
}

export default function Home() {
  return (
    <main className="px-3 pt-4 sm:px-0 sm:pt-0">
      {/* Hero, full-width centered */}
      <section className="flex flex-col items-center justify-center pt-12 pb-8 text-center sm:py-20">
        <h2 className="leading-none">
          <Logo large />
        </h2>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-600/60 to-transparent" />
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase text-zinc-500">
            why study long when you can study quick
          </p>
        </div>
      </section>

      {/* Course cards */}
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
        {COURSES.map((course) => (
          <Link
            key={course.href}
            href={course.href}
            className={`group flex flex-col rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:p-6 sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60 ${course.accentClasses.card}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${course.accentClasses.iconBg}`}>
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold sm:text-lg">{course.title}</h3>
                <p className="text-xs text-zinc-500">{course.subtitle}</p>
              </div>
              <span className={`flex-shrink-0 text-lg transition-transform group-hover:translate-x-1 ${course.accentClasses.arrow}`}>
                →
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {course.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#151c2e]/80 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Recommended Learning Path */}
      <section className="mx-auto mt-8 max-w-3xl sm:mt-10">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">Recommended Learning Path</h3>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#1c2438]/50 bg-[#0a0c14]/60 px-4 py-3 sm:rounded-xl">
          <PathStep num={1} label="Linux Admin" href="/linux" color="emerald" />
          <Arrow />
          <PathStep num={2} label="Unix Security" href="/unix-security" color="blue" />
          <Arrow />
          <PathStep num={3} label="Nmap" href="/nmap" color="orange" />
          <Arrow />
          <PathStep num={4} label="Security+" href="/security-plus" color="cyan" />
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          Linux Admin builds the foundation. Unix Security adds threat detection. Nmap adds offensive recon. Security+ ties it all together for the cert.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-10 pb-2 text-center sm:mt-14">
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Stuick</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
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
      </footer>
    </main>
  );
}
