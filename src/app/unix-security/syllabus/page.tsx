import Link from "next/link";
import { UNIX_SECURITY_STUDY } from "@/lib/unix-security-study-data";

export default function UnixSecuritySyllabusPage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-blue-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Unix Security Topics Covered</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              All domains and modules organized by difficulty. Builds from system fundamentals up to hands-on C2 beacon and process injection detection.
            </p>
          </div>
          <Link
            href="/unix-security"
            className="flex-shrink-0 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
          >
            ← Back
          </Link>
        </div>
      </section>

      {/* Topics by level */}
      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const levelDomains = UNIX_SECURITY_STUDY.filter((d) => d.level === level);
        if (levelDomains.length === 0) return null;
        const labelColor =
          level === "beginner"
            ? "text-emerald-400 bg-emerald-950/50"
            : level === "intermediate"
            ? "text-amber-400 bg-amber-950/50"
            : "text-rose-400 bg-rose-950/50";
        return (
          <section key={level} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
            <span className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${labelColor}`}>
              {level}
            </span>
            <div className="space-y-3">
              {levelDomains.map((domain) => (
                <div key={domain.key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{domain.name}</h3>
                    <span className="text-xs text-zinc-500">
                      {domain.topics.length} {domain.topics.length === 1 ? "module" : "modules"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {domain.topics.map((topic) => (
                      <div
                        key={topic.slug}
                        className="flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/40 px-4 py-2.5"
                      >
                        <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
                        <span className="text-xs text-zinc-500">{topic.flashcards.length} cards</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
