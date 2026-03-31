"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { LinuxDomain } from "@/lib/linux-study-data";

type Flashcard = { front: string; back: string; topic: string };

type AccentColor = "emerald" | "cyan" | "orange" | "blue";

const ACCENT = {
  emerald: {
    text:        "text-emerald-400",
    text5:       "text-emerald-500",
    progressBar: "bg-emerald-600",
    finishIcon:  "bg-emerald-950/50",
    restartBtn:  "bg-emerald-600 hover:bg-emerald-500",
    gotItBtn:    "border-emerald-800/40 bg-emerald-950/20 text-emerald-400 active:bg-emerald-900/30",
  },
  cyan: {
    text:        "text-cyan-400",
    text5:       "text-cyan-500",
    progressBar: "bg-cyan-600",
    finishIcon:  "bg-cyan-950/50",
    restartBtn:  "bg-cyan-600 hover:bg-cyan-500",
    gotItBtn:    "border-cyan-800/40 bg-cyan-950/20 text-cyan-400 active:bg-cyan-900/30",
  },
  orange: {
    text:        "text-orange-400",
    text5:       "text-orange-500",
    progressBar: "bg-orange-600",
    finishIcon:  "bg-orange-950/50",
    restartBtn:  "bg-orange-600 hover:bg-orange-500",
    gotItBtn:    "border-orange-800/40 bg-orange-950/20 text-orange-400 active:bg-orange-900/30",
  },
  blue: {
    text:        "text-blue-400",
    text5:       "text-blue-500",
    progressBar: "bg-blue-600",
    finishIcon:  "bg-blue-950/50",
    restartBtn:  "bg-blue-600 hover:bg-blue-500",
    gotItBtn:    "border-blue-800/40 bg-blue-950/20 text-blue-400 active:bg-blue-900/30",
  },
} as const;

type FlashcardRunnerProps = {
  domains: LinuxDomain[];
  backHref?: string;
  accentColor?: AccentColor;
};

export function FlashcardRunner({ domains, backHref = "/linux/flashcards", accentColor = "emerald" }: FlashcardRunnerProps) {
  const ac = ACCENT[accentColor];
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get("topic");

  const allCards: Flashcard[] = useMemo(() => {
    const cards: Flashcard[] = [];
    for (const domain of domains) {
      for (const topic of domain.topics) {
        if (topicFilter && topic.slug !== topicFilter) continue;
        for (const fc of topic.flashcards) {
          cards.push({ ...fc, topic: topic.title });
        }
      }
    }
    return cards;
  }, [domains, topicFilter]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const currentTopicTitle = topicFilter
    ? domains.flatMap((d) => d.topics).find((t) => t.slug === topicFilter)?.title ?? "All Topics"
    : "All Topics";

  if (allCards.length === 0) {
    return (
      <div className="px-3 pt-4 sm:px-0">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-zinc-400">No flashcards available for this topic.</p>
          <Link href={backHref} className={`mt-4 inline-block text-sm ${ac.text} underline`}>
            ← All flashcards
          </Link>
        </div>
      </div>
    );
  }

  const card = allCards[currentIdx];
  const isFinished = known + unknown === allCards.length;

  const handleMark = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    else setUnknown((u) => u + 1);
    setFlipped(false);
    if (currentIdx < allCards.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setKnown(0);
    setUnknown(0);
  };

  if (isFinished) {
    return (
      <div className="flex min-h-[calc(100dvh-6rem)] items-center justify-center px-3 pt-4 sm:min-h-0 sm:px-0">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${ac.finishIcon}`}>
            <svg className={`h-10 w-10 ${ac.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-100">Session Complete!</h3>
          <p className="mt-2 text-sm text-zinc-400">
            {known} of {allCards.length} marked as known
          </p>
          <div className="mt-3 flex justify-center gap-6 text-sm">
            <span className={ac.text}>✓ {known} known</span>
            <span className="text-amber-400">✗ {unknown} review</span>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={handleRestart}
              className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors ${ac.restartBtn}`}
            >
              Study Again
            </button>
            <Link
              href={backHref}
              className="rounded-xl bg-zinc-800 px-6 py-3 text-center text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-700"
            >
              All Topics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col px-3 pt-4 sm:min-h-0 sm:px-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Link href={backHref} className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Topics
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs text-zinc-500">
            <span className={ac.text}>✓ {known}</span>
            <span className="text-amber-400">✗ {unknown}</span>
          </div>
          <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">
            {currentIdx + 1} / {allCards.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${ac.progressBar} transition-all`}
          style={{ width: `${((known + unknown) / allCards.length) * 100}%` }}
        />
      </div>

      {/* Topic label */}
      <p className={`mb-3 text-xs font-medium ${ac.text5}`}>{currentTopicTitle}, {card.topic}</p>

      {/* Flashcard, takes major space */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="flex flex-1 flex-col justify-center rounded-2xl border border-zinc-700/60 bg-zinc-900 p-6 text-left transition-all active:scale-[0.995] sm:p-10 md:p-12 min-h-[300px] sm:min-h-[400px]"
      >
        {!flipped ? (
          <div className="flex w-full flex-1 flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">Question</p>
            <p className="text-lg font-medium leading-8 text-zinc-100 sm:text-xl sm:leading-9 lg:text-2xl lg:leading-10">{card.front}</p>
            <p className="mt-6 text-xs text-zinc-600">Tap to reveal answer</p>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col justify-center">
            <p className={`text-xs font-medium uppercase tracking-wider ${ac.text5} mb-4`}>Answer</p>
            <p className="text-lg leading-8 text-zinc-200 sm:text-xl sm:leading-9 lg:text-2xl lg:leading-10">{card.back}</p>
          </div>
        )}
      </button>

      {/* Actions, show after flipping */}
      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleMark(false)}
            className="rounded-xl border border-amber-800/40 bg-amber-950/20 py-3.5 text-sm font-semibold text-amber-400 transition-colors active:bg-amber-900/30 sm:py-4"
          >
            ✗ Still Learning
          </button>
          <button
            onClick={() => handleMark(true)}
            className={`rounded-xl border py-3.5 text-sm font-semibold transition-colors sm:py-4 ${ac.gotItBtn}`}
          >
            ✓ Got It
          </button>
        </div>
      )}
    </div>
  );
}
