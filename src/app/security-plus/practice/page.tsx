import Link from "next/link";
import { STATIC_SYLLABUS } from "@/lib/static-syllabus";
import { getQuestionsByTopicSlug } from "@/lib/exam";
import { PageFooter } from "@/components/page-footer";

export const dynamic = "force-static";

export default function PracticePage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-cyan-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Practice by Topic</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Select a topic to practice questions with instant feedback. Answer each question and immediately see if you got it right or wrong.
        </p>
      </section>

      {/* Domain sections */}
      {STATIC_SYLLABUS.map((domain) => (
        <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
          <div className="mb-3">
            <h3 className="text-base font-semibold sm:text-lg">{domain.name}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">{domain.weightPct}% of exam</p>
          </div>

          <div className="space-y-1.5">
            {domain.topics.map((topic) => {
              const questionCount = getQuestionsByTopicSlug(topic.slug).length;
              return (
                <Link
                  key={topic.slug}
                  href={`/security-plus/practice/${topic.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/40 px-4 py-3 transition-all active:bg-zinc-700/60 sm:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-700/50 text-xs font-bold text-zinc-400">
                      {questionCount}
                    </span>
                    <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
                  </div>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
      <PageFooter />
    </main>
  );
}
