import Link from "next/link";
import { LINUX_STUDY } from "@/lib/linux-study-data";

export default function LinuxHome() {
  const totalTopics = LINUX_STUDY.reduce((sum, d) => sum + d.topics.length, 0);
  const totalFlashcards = LINUX_STUDY.reduce(
    (sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0),
    0
  );

  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero */}
      <section className="rounded-2xl border border-[#1a3028]/70 bg-gradient-to-br from-emerald-950/50 via-[#091510] to-[#080b10] p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Linux Administration</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Master Linux from the command line up. Comprehensive study guides, interactive flashcards, and practice exams for system administration.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[#0a1f16]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{totalTopics}</p>
            <p className="text-[10px] text-zinc-500">Topics</p>
          </div>
          <div className="rounded-lg bg-[#0a1f16]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{totalFlashcards}</p>
            <p className="text-[10px] text-zinc-500">Flashcards</p>
          </div>
          <div className="rounded-lg bg-[#0a1f16]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{LINUX_STUDY.length}</p>
            <p className="text-[10px] text-zinc-500">Domains</p>
          </div>
        </div>
      </section>

      {/* Feature CTAs — 2-column on desktop */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/linux/flashcards"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Flashcards</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {totalFlashcards} cards — flip to test your recall.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-emerald-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/linux/practice"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Practice Exams</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Test your Linux knowledge with instant feedback.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-emerald-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/linux/study"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Study Guide</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Commands, examples, and tips for all topics.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-emerald-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/linux/syllabus"
          className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Topics Covered</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Full syllabus organized by difficulty level.
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
