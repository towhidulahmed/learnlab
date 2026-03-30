import Link from "next/link";
import { UNIX_SECURITY_STUDY, UNIX_SECURITY_TOTAL_TOPICS, UNIX_SECURITY_TOTAL_FLASHCARDS } from "@/lib/unix-security-study-data";

export default function UnixSecurityHome() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero */}
      <section className="rounded-2xl border border-[#1a2840]/70 bg-gradient-to-br from-blue-950/50 via-[#07090f] to-[#080b12] p-5 sm:rounded-xl sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Unix Security Monitoring</h2>
          <Link
            href="/linux"
            className="flex-shrink-0 rounded-md border border-emerald-900/50 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-400 transition-colors hover:bg-emerald-950/50"
          >
            ← Prerequisite: Linux Admin
          </Link>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Learn to detect C2 backdoors and malicious activity on Unix and macOS systems. Covers processes, network connections, persistence, log analysis, and step-by-step C2 detection techniques.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[#0a1226]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{UNIX_SECURITY_TOTAL_TOPICS}</p>
            <p className="text-[10px] text-zinc-500">Modules</p>
          </div>
          <div className="rounded-lg bg-[#0a1226]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{UNIX_SECURITY_TOTAL_FLASHCARDS}</p>
            <p className="text-[10px] text-zinc-500">Flashcards</p>
          </div>
          <div className="rounded-lg bg-[#0a1226]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{UNIX_SECURITY_STUDY.length}</p>
            <p className="text-[10px] text-zinc-500">Domains</p>
          </div>
        </div>
      </section>

      {/* Feature CTAs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/unix-security/study"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Study Guide</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {UNIX_SECURITY_TOTAL_TOPICS} modules with commands, examples, and tips.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-blue-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/unix-security/flashcards"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Flashcards</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {UNIX_SECURITY_TOTAL_FLASHCARDS} cards, flip to test your recall.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-blue-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/unix-security/practice"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Practice Questions</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Multiple-choice questions with instant feedback.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-blue-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/unix-security/syllabus"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Topics Covered</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Full module list across all 3 domains.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-blue-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
      </div>

      <footer className="mt-8 pb-2 text-center sm:mt-10">
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Stuick</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
          <span className="font-mono text-zinc-600">&lt;/&gt;</span>
          <a href="https://www.towhid.info" target="_blank" rel="noopener noreferrer" className="text-zinc-600 transition-colors hover:text-zinc-400">
            towhid.info
          </a>
        </p>
      </footer>
    </main>
  );
}
