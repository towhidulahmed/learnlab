import Link from "next/link";
import { Suspense } from "react";
import { UNIX_SECURITY_STUDY } from "@/lib/unix-security-study-data";
import { FlashcardRunner } from "@/components/flashcard-runner";
import { PageFooter } from "@/components/page-footer";

export const dynamic = "force-static";

export default function UnixSecurityFlashcardsPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="px-3 pt-4 sm:px-0">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="text-zinc-400">Loading flashcards...</p>
            </div>
          </div>
        }
      >
        <FlashcardsContent />
      </Suspense>
    </main>
  );
}

function FlashcardsContent() {
  return (
    <div className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-blue-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Unix Security Flashcards</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Select a topic below or study all flashcards at once.
        </p>
      </section>

      {/* All flashcards CTA */}
      <Link
        href="/unix-security/flashcards/study"
        className="group flex items-center justify-between rounded-2xl border border-blue-800/30 bg-blue-950/20 p-4 transition-all active:bg-blue-900/30 sm:rounded-xl sm:hover:bg-blue-950/30"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-900/40 text-sm font-bold text-blue-400">
            {UNIX_SECURITY_STUDY.reduce((sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0), 0)}
          </span>
          <div>
            <span className="text-sm font-semibold text-zinc-200">Study All Flashcards</span>
            <p className="text-xs text-zinc-500">All modules combined</p>
          </div>
        </div>
        <svg className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Link>

      {/* Topics by domain */}
      {UNIX_SECURITY_STUDY.map((domain) => (
        <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
          <h3 className="mb-3 text-base font-semibold sm:text-lg">{domain.name}</h3>
          <div className="space-y-1.5">
            {domain.topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/unix-security/flashcards/study?topic=${topic.slug}`}
                className="group flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/40 px-4 py-3 transition-all active:bg-zinc-700/60 sm:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-700/50 text-xs font-bold text-zinc-400">
                    {topic.flashcards.length}
                  </span>
                  <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
                </div>
                <svg className="h-4 w-4 flex-shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <PageFooter />
    </div>
  );
}
