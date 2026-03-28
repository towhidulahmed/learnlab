import Link from "next/link";
import { NMAP_TOTAL_FLASHCARDS, NMAP_TOTAL_TOPICS } from "@/lib/nmap-study-data";
import { NMAP_QUESTIONS } from "@/lib/nmap-questions";

export default function NmapHome() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero */}
      <section className="rounded-2xl border border-[#2e1f0e]/70 bg-gradient-to-br from-orange-950/50 via-[#120c06] to-[#080b10] p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Nmap — Network Scanning</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Master Nmap for host discovery, port scanning, service detection, OS fingerprinting, and evasion techniques.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[#1e1006]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{NMAP_QUESTIONS.length}</p>
            <p className="text-[10px] text-zinc-500">Questions</p>
          </div>
          <div className="rounded-lg bg-[#1e1006]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{NMAP_TOTAL_FLASHCARDS}</p>
            <p className="text-[10px] text-zinc-500">Flashcards</p>
          </div>
          <div className="rounded-lg bg-[#1e1006]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{NMAP_TOTAL_TOPICS}</p>
            <p className="text-[10px] text-zinc-500">Topics</p>
          </div>
        </div>
      </section>

      {/* Feature CTAs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/nmap/study"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Study Guide</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {NMAP_TOTAL_TOPICS} topics — commands, techniques, and exam tips.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-orange-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/nmap/flashcards"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Flashcards</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {NMAP_TOTAL_FLASHCARDS} cards — flip to test recall on key concepts.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-orange-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/nmap/practice"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Practice by Topic</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {NMAP_QUESTIONS.length} questions with instant feedback.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-violet-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/nmap/syllabus"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Syllabus</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                All domains and topics organized by difficulty.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-zinc-600 transition-transform group-hover:translate-x-1">→</span>
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
