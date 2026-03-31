import Link from "next/link";
import { NMAP_STUDY } from "@/lib/nmap-study-data";
import { NMAP_QUESTIONS } from "@/lib/nmap-questions";

export default function NmapPracticePage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-orange-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Nmap Practice</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {NMAP_QUESTIONS.length} multiple-choice questions across all topics. Pick a topic to begin.
        </p>
      </section>

      {/* Domain / topic list */}
      {NMAP_STUDY.map((domain) => {
        const domainQuestionCount = domain.topics.reduce(
          (sum, t) => sum + NMAP_QUESTIONS.filter((q) => q.topicSlug === t.slug).length,
          0
        );
        if (domainQuestionCount === 0) return null;

        return (
          <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold sm:text-lg">{domain.name}</h3>
              <span className="text-xs text-zinc-500">{domainQuestionCount} Qs</span>
            </div>
            <div className="space-y-1.5">
              {domain.topics.map((topic) => {
                const count = NMAP_QUESTIONS.filter((q) => q.topicSlug === topic.slug).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={topic.slug}
                    href={`/nmap/practice/${topic.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/40 px-4 py-3 transition-all active:bg-zinc-700/60 sm:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-700/50 text-xs font-bold text-zinc-400">
                        {count}
                      </span>
                      <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
                    </div>
                    <svg className="h-4 w-4 flex-shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
