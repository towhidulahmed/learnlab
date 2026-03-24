"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStudyProgress, saveStudyProgress } from "@/lib/client-storage";

type Topic = {
  id: number;
  slug: string;
  title: string;
  content: string;
  keyTerms: string;
  examples: string;
  tips: string;
  studyPath: string;
  progress: { studied: boolean } | null;
};

type Domain = {
  id: number;
  key: string;
  name: string;
  topics: Topic[];
};

export function StudyModule({ domains }: { domains: Domain[] }) {
  const [state, setState] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    domains.forEach((domain) => {
      domain.topics.forEach((topic) => {
        initial[topic.id] = topic.progress?.studied ?? false;
      });
    });
    return initial;
  });

  useEffect(() => {
    const stored = loadStudyProgress();
    setState((prev) => ({ ...prev, ...stored }));
  }, []);

  useEffect(() => {
    saveStudyProgress(state);
  }, [state]);

  const progressPct = useMemo(() => {
    const values = Object.values(state);
    if (!values.length) {
      return 0;
    }
    const studied = values.filter(Boolean).length;
    return Math.round((studied / values.length) * 100);
  }, [state]);

  const setStudied = (topicId: number, studied: boolean) => {
    setState((prev) => ({ ...prev, [topicId]: studied }));
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
        <h2 className="text-lg font-semibold sm:text-xl">Study Progress Tracker</h2>
        <p className="mt-2 text-sm text-zinc-400">Mark each topic when reviewed to track readiness.</p>
        <div className="mt-4 h-3 w-full rounded-full bg-zinc-800">
          <div className="h-3 rounded-full bg-cyan-500" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-2 text-sm text-zinc-300">{progressPct}% complete</p>
      </section>

      {domains.map((domain) => (
        <section key={domain.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
          <h3 className="text-lg font-semibold">{domain.name}</h3>
          <div className="mt-4 space-y-3">
            {domain.topics.map((topic) => {
              const keyTerms = JSON.parse(topic.keyTerms) as string[];
              const examples = JSON.parse(topic.examples) as string[];
              const tips = JSON.parse(topic.tips) as string[];
              return (
                <article key={topic.id} id={topic.slug} className="scroll-mt-20 rounded-lg border border-zinc-700 p-3 sm:p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-base font-semibold leading-6">{topic.title}</h4>
                    <button
                      type="button"
                      onClick={() => setStudied(topic.id, !state[topic.id])}
                      className={`w-full rounded-md px-3 py-2 text-xs font-semibold sm:w-auto sm:py-1 ${
                        state[topic.id] ? "bg-emerald-700" : "bg-zinc-700"
                      }`}
                    >
                      {state[topic.id] ? "Studied" : "Mark as Studied"}
                    </button>
                  </div>
                  <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-zinc-300">{topic.content.replace(/^##.*\n/, "")}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Key Terms</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keyTerms.map((term) => (
                      <span key={term} className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                        {term}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Real-World Examples</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-300">
                    {examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Tips & Mnemonics</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-300">
                    {tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
