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

const DOMAIN_WEIGHTS: Record<number, number> = { 1: 12, 2: 22, 3: 18, 4: 28, 5: 20 };

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

  const [expandedDomains, setExpandedDomains] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    domains.forEach((d) => { init[d.id] = false; });
    return init;
  });

  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = loadStudyProgress();
    setState((prev) => ({ ...prev, ...stored }));
  }, []);

  useEffect(() => {
    saveStudyProgress(state);
  }, [state]);

  const totalTopics = domains.reduce((sum, d) => sum + d.topics.length, 0);
  const studiedTopics = Object.values(state).filter(Boolean).length;
  const progressPct = useMemo(() => {
    if (!totalTopics) return 0;
    return Math.round((studiedTopics / totalTopics) * 100);
  }, [state, totalTopics, studiedTopics]);

  const domainProgress = useMemo(() => {
    const map: Record<number, { studied: number; total: number }> = {};
    domains.forEach((domain) => {
      const total = domain.topics.length;
      const studied = domain.topics.filter((t) => state[t.id]).length;
      map[domain.id] = { studied, total };
    });
    return map;
  }, [state, domains]);

  const setStudied = (topicId: number, studied: boolean) => {
    setState((prev) => ({ ...prev, [topicId]: studied }));
  };

  const toggleDomain = (domainId: number) => {
    setExpandedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  const toggleTopic = (topicId: number) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  return (
    <div className="space-y-4 px-3 pt-4 sm:space-y-5 sm:px-0 sm:pt-0">
      {/* Overall progress card */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Study Progress</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {studiedTopics} of {totalTopics} topics reviewed
            </p>
          </div>
          <span className="rounded-full bg-cyan-900/40 px-3 py-1 text-sm font-bold text-cyan-300">
            {progressPct}%
          </span>
        </div>
        <div className="mt-4 h-2.5 w-full rounded-full bg-zinc-800">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Domain quick-stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {domains.map((domain) => {
            const dp = domainProgress[domain.id];
            const dpPct = dp.total > 0 ? Math.round((dp.studied / dp.total) * 100) : 0;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => {
                  setExpandedDomains((prev) => {
                    const next: Record<number, boolean> = {};
                    domains.forEach((d) => { next[d.id] = d.id === domain.id; });
                    return next;
                  });
                  document.getElementById(`domain-${domain.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-lg bg-zinc-800/80 p-2.5 text-left transition-colors active:bg-zinc-700"
              >
                <p className="text-xs font-medium leading-4 text-zinc-300">{domain.name.replace("General Security Concepts", "Gen. Security").replace("Threats, Vulnerabilities & Mitigations", "Threats & Vuln.").replace("Security Architecture", "Architecture").replace("Security Operations", "Operations").replace("Security Program Management & Oversight", "Mgmt & Oversight")}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-zinc-700">
                    <div
                      className={`h-1 rounded-full transition-all ${dpPct === 100 ? "bg-emerald-500" : "bg-cyan-500"}`}
                      style={{ width: `${dpPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold tabular-nums text-zinc-500">{dpPct}%</span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500">{DOMAIN_WEIGHTS[domain.id] || 0}% of exam</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Domain accordion sections */}
      {domains.map((domain) => {
        const isExpanded = expandedDomains[domain.id];
        const dp = domainProgress[domain.id];
        const dpPct = dp.total > 0 ? Math.round((dp.studied / dp.total) * 100) : 0;

        return (
          <section
            key={domain.id}
            id={`domain-${domain.id}`}
            className="scroll-mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 sm:rounded-xl"
          >
            {/* Domain header — always visible, acts as accordion toggle */}
            <button
              type="button"
              onClick={() => toggleDomain(domain.id)}
              className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
            >
              <span className={`text-base transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>▸</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold sm:text-lg">{domain.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {dp.studied}/{dp.total} topics • {DOMAIN_WEIGHTS[domain.id] || 0}% of exam
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden h-1.5 w-16 rounded-full bg-zinc-700 sm:block">
                  <div
                    className={`h-1.5 rounded-full ${dpPct === 100 ? "bg-emerald-500" : "bg-cyan-500"}`}
                    style={{ width: `${dpPct}%` }}
                  />
                </div>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${dpPct === 100 ? "bg-emerald-900/50 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                  {dpPct}%
                </span>
              </div>
            </button>

            {/* Topics list — collapsible */}
            {isExpanded ? (
              <div className="space-y-2.5 px-4 pb-4 sm:px-5 sm:pb-5">
                {domain.topics.map((topic) => {
                  const keyTerms = JSON.parse(topic.keyTerms) as string[];
                  const examples = JSON.parse(topic.examples) as string[];
                  const tips = JSON.parse(topic.tips) as string[];
                  const isTopicExpanded = expandedTopics[topic.id];

                  return (
                    <article
                      key={topic.id}
                      id={topic.slug}
                      className="scroll-mt-20 rounded-xl border border-zinc-700/60 bg-zinc-800/40"
                    >
                      {/* Topic header row */}
                      <div className="flex items-center gap-3 p-3.5 sm:p-4">
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className="flex flex-1 items-center gap-2.5 text-left"
                        >
                          <span className={`text-sm text-zinc-500 transition-transform duration-200 ${isTopicExpanded ? "rotate-90" : ""}`}>▸</span>
                          <div className="flex-1">
                            <h4 className="text-[14px] font-semibold leading-5 sm:text-base">{topic.title}</h4>
                            <p className="mt-0.5 text-[11px] text-zinc-500">{keyTerms.length} terms • {examples.length} examples</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudied(topic.id, !state[topic.id]);
                          }}
                          className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                            state[topic.id]
                              ? "bg-emerald-700/80 text-emerald-100"
                              : "bg-zinc-700 text-zinc-300 active:bg-zinc-600"
                          }`}
                        >
                          {state[topic.id] ? "✓ Done" : "Study"}
                        </button>
                      </div>

                      {/* Topic content — collapsible */}
                      {isTopicExpanded ? (
                        <div className="border-t border-zinc-700/40 px-3.5 pb-4 pt-3 sm:px-4">
                          <p className="whitespace-pre-line break-words text-[13px] leading-6 text-zinc-300 sm:text-sm sm:leading-7">
                            {topic.content.replace(/^##.*\n/, "")}
                          </p>

                          {/* Key Terms */}
                          <div className="mt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Key Terms</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {keyTerms.map((term) => (
                                <span
                                  key={term}
                                  className="rounded-full border border-zinc-700/60 bg-zinc-800 px-2.5 py-1 text-xs text-cyan-300/80"
                                >
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Examples */}
                          <div className="mt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Real-World Scenarios</p>
                            <ul className="mt-1.5 space-y-1.5 text-[13px] leading-6 text-zinc-300 sm:text-sm">
                              {examples.map((example) => (
                                <li key={example} className="flex gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-500/60" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tips */}
                          <div className="mt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Exam Tips</p>
                            <ul className="mt-1.5 space-y-1.5 text-[13px] leading-6 text-zinc-300 sm:text-sm">
                              {tips.map((tip) => (
                                <li key={tip} className="flex gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500/60" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
