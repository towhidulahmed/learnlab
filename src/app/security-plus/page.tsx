import Link from "next/link";
import { MAX_MOCK_TESTS } from "@/lib/constants";
import { SECPLUS_TOTAL_FLASHCARDS } from "@/lib/secplus-flashcard-data";

export default function SecurityPlusHome() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-cyan-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Security+ SY0-701</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Mock exams, flashcards, practice questions, and study guides aligned with all 5 CompTIA domains.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">410</p>
            <p className="text-[10px] text-zinc-500">Questions</p>
          </div>
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">90 min</p>
            <p className="text-[10px] text-zinc-500">Per Exam</p>
          </div>
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">750</p>
            <p className="text-[10px] text-zinc-500">Pass Score</p>
          </div>
        </div>
      </section>

      {/* Feature CTAs — 2-column on desktop */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/security-plus/mock-tests"
          className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:hover:bg-zinc-800/60 sm:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Mock Tests</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {MAX_MOCK_TESTS} full-length SY0-701 exams — 90 minutes, 90 questions each.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-cyan-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
        <Link
          href="/security-plus/flashcards"
          className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:hover:bg-zinc-800/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Flashcards</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {SECPLUS_TOTAL_FLASHCARDS} cards — flip to test your recall on key concepts.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-cyan-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/security-plus/practice"
          className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:hover:bg-zinc-800/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Practice by Topic</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Pick a topic and practice with instant feedback.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-violet-500/60 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/security-plus/study"
          className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:hover:bg-zinc-800/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Study Guide</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                All 5 domains — key terms, scenarios, and exam tips.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-zinc-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <Link
          href="/security-plus/syllabus"
          className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:hover:bg-zinc-800/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Exam Syllabus</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Domain weights and topic breakdown.
              </p>
            </div>
            <span className="flex-shrink-0 text-lg text-zinc-600 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
