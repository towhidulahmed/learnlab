import Link from "next/link";
import { Suspense } from "react";
import { SOC_FLASHCARD_DOMAINS, SOC_TOTAL_FLASHCARDS } from "@/lib/soc-flashcard-data";

export const dynamic = "force-static";

export default function FlashcardsPage() {
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
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-violet-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">30-Day SOC Flashcards</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Pick a day below or study all flashcards at once. Days with 0 cards are
          program stubs — cards land here as you complete each day.
        </p>
      </section>

      {/* All flashcards CTA */}
      <Link
        href="/30-days-soc/flashcards/study"
        className="group flex items-center justify-between rounded-2xl border border-violet-800/30 bg-violet-950/20 p-4 transition-all active:bg-violet-900/30 sm:rounded-xl sm:hover:bg-violet-950/30"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-900/40 text-sm font-bold text-violet-400">
            {SOC_TOTAL_FLASHCARDS}
          </span>
          <div>
            <span className="text-sm font-semibold text-zinc-200">Study All Flashcards</span>
            <p className="text-xs text-zinc-500">All days combined</p>
          </div>
        </div>
        <svg className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </Link>

      {/* Per-day topics, grouped by week */}
      {SOC_FLASHCARD_DOMAINS.map((domain) => {
        const weekTotal = domain.topics.reduce((s, t) => s + t.flashcards.length, 0);
        return (
          <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold sm:text-lg">{domain.name}</h3>
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                {weekTotal} cards
              </span>
            </div>
            <div className="space-y-1.5">
              {domain.topics.map((topic) => {
                const isEmpty = topic.flashcards.length === 0;
                const className = `group flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                  isEmpty
                    ? "border-zinc-800/40 bg-zinc-900/40 cursor-not-allowed opacity-50"
                    : "border-zinc-700/40 bg-zinc-800/40 active:bg-zinc-700/60 sm:hover:bg-zinc-800"
                }`;
                const inner = (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isEmpty
                          ? "bg-zinc-800/40 text-zinc-600"
                          : "bg-zinc-700/50 text-zinc-400"
                      }`}>
                        {topic.flashcards.length}
                      </span>
                      <span className={`text-sm font-medium ${isEmpty ? "text-zinc-500" : "text-zinc-200"}`}>
                        {topic.title}
                      </span>
                    </div>
                    {!isEmpty && (
                      <svg className="h-4 w-4 flex-shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </>
                );
                return isEmpty ? (
                  <div key={topic.slug} className={className}>{inner}</div>
                ) : (
                  <Link
                    key={topic.slug}
                    href={`/30-days-soc/flashcards/study?topic=${topic.slug}`}
                    className={className}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
