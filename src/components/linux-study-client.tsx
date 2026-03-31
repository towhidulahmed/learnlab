"use client";

import Link from "next/link";
import { useState } from "react";
import type { LinuxDomain, LinuxTopic } from "@/lib/linux-study-data";

function TopicCard({ topic, flashcardsBasePath, accent }: { topic: LinuxTopic; flashcardsBasePath: string; accent: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-700/40 bg-zinc-800/40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-zinc-200">{topic.title}</span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-zinc-700/40 px-4 py-4 space-y-5">
          {/* Content */}
          <div className="prose-sm text-sm leading-7 text-zinc-300 whitespace-pre-line">
            {topic.content.split("\\n\\n").map((para, i) => (
              <p key={i} className="mb-3" dangerouslySetInnerHTML={{
                __html: para
                  .replace(/\\n/g, "\n")
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100">$1</strong>')
                  .replace(/`([^`]+)`/g, `<code class="rounded bg-zinc-700/60 px-1.5 py-0.5 text-xs ${ACCENT_CODE[accent] ?? ACCENT_CODE.emerald} font-mono">$1</code>`)
              }} />
            ))}
          </div>

          {/* Commands reference */}
          {topic.commands.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Key Commands</h4>
              <div className="space-y-1.5">
                {topic.commands.map((cmd, i) => (
                  <div key={i} className="rounded-lg bg-zinc-900/60 px-3 py-2.5">
                    <code className="block break-words text-xs font-mono text-emerald-400">
                      {cmd.cmd}
                    </code>
                    <span className="mt-1 block text-xs leading-5 text-zinc-400">{cmd.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {topic.tips.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tips</h4>
              <ul className="space-y-1.5">
                {topic.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className={`mt-0.5 ${ACCENT_BULLET[accent] ?? ACCENT_BULLET.emerald}`}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flashcard count link */}
          <Link
            href={`${flashcardsBasePath}?topic=${topic.slug}`}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${ACCENT_CARD_LINK[accent] ?? ACCENT_CARD_LINK.emerald}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-1.007.661-1.862 1.572-2.14z" />
            </svg>
            {topic.flashcards.length} Flashcards
          </Link>
        </div>
      )}
    </div>
  );
}

const ACCENT_GRADIENT: Record<string, string> = {
  emerald: "from-emerald-950/30",
  orange:  "from-orange-950/30",
  blue:    "from-blue-950/30",
  cyan:    "from-cyan-950/30",
};

const ACCENT_CODE: Record<string, string> = {
  emerald: "text-emerald-400",
  orange:  "text-orange-400",
  blue:    "text-blue-400",
  cyan:    "text-cyan-400",
};

const ACCENT_BULLET: Record<string, string> = {
  emerald: "text-emerald-500",
  orange:  "text-orange-500",
  blue:    "text-blue-500",
  cyan:    "text-cyan-500",
};

const ACCENT_CARD_LINK: Record<string, string> = {
  emerald: "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60",
  orange:  "bg-orange-950/40 text-orange-400 hover:bg-orange-950/60",
  blue:    "bg-blue-950/40 text-blue-400 hover:bg-blue-950/60",
  cyan:    "bg-cyan-950/40 text-cyan-400 hover:bg-cyan-950/60",
};

export function LinuxStudyClient({ domains, title = "Linux Study Guide", backHref = "/linux", flashcardsBasePath = "/linux/flashcards", accent = "emerald" }: { domains: LinuxDomain[]; title?: string; backHref?: string; flashcardsBasePath?: string; accent?: string }) {
  const gradient = ACCENT_GRADIENT[accent] ?? ACCENT_GRADIENT.emerald;
  return (
    <div className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className={`rounded-2xl border border-zinc-800 bg-gradient-to-br ${gradient} to-zinc-900 p-5 sm:rounded-xl sm:p-6`}>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Expand each topic to read the guide, view key commands, and access flashcards.
        </p>
      </section>

      {/* Domain sections grouped by level */}
      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const levelDomains = domains.filter((d) => d.level === level);
        if (levelDomains.length === 0) return null;
        const labelColor = level === "beginner" ? "text-emerald-400 bg-emerald-950/50 border-emerald-800/40" : level === "intermediate" ? "text-amber-400 bg-amber-950/50 border-amber-800/40" : "text-rose-400 bg-rose-950/50 border-rose-800/40";
        return (
          <div key={level} className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3 px-1">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${labelColor}`}>
                {level}
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            {levelDomains.map((domain) => (
              <section key={domain.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
                <h3 className="mb-3 text-base font-semibold sm:text-lg">{domain.name}</h3>
                <div className="space-y-2">
                  {domain.topics.map((topic) => (
                    <TopicCard key={topic.slug} topic={topic} flashcardsBasePath={flashcardsBasePath} accent={accent} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        );
      })}
    </div>
  );
}
