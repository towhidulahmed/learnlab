import Link from "next/link";
import { STATIC_SYLLABUS } from "@/lib/static-syllabus";

export default function SyllabusPage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-cyan-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">SY0-701 Exam Syllabus</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              5 domains, 37 topics. Domain weights determine the number of exam questions from each area.
            </p>
          </div>
          <Link
            href="/security-plus"
            className="flex-shrink-0 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
          >
            ← Back
          </Link>
        </div>
      </section>

      {/* Domains */}
      {STATIC_SYLLABUS.map((domain) => (
        <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold sm:text-lg">{domain.name}</h3>
            <span className="rounded-md bg-cyan-950/40 px-2 py-0.5 text-xs font-bold text-cyan-400">
              {domain.weightPct}%
            </span>
          </div>
          <div className="space-y-1.5">
            {domain.topics.map((topic) => (
              <div
                key={topic.slug}
                className="flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/40 px-4 py-3"
              >
                <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
                <span className="text-xs text-zinc-500">{topic.keyTerms.length} terms</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
