"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getAttemptById, getLatestAttemptForTest } from "@/lib/client-storage";

export function ResultView({ testId }: { testId: number }) {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt") || undefined;
  const autoSubmit = searchParams.get("auto") === "1";

  const result = useMemo(() => {
    if (attemptId) {
      return getAttemptById(attemptId);
    }
    return getLatestAttemptForTest(testId);
  }, [attemptId, testId]);

  if (!result) {
    return (
      <main className="px-4 pt-8 sm:px-0">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-lg font-medium text-zinc-300">No result found</p>
          <p className="mt-2 text-sm text-zinc-500">Please take the mock test first.</p>
          <Link
            href={`/mock-tests/${testId}`}
            className="mt-4 inline-block rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-cyan-600"
          >
            Start Mock Test {testId}
          </Link>
        </div>
      </main>
    );
  }

  const totalQuestions = result.domainScores.reduce((sum, d) => sum + d.total, 0);
  const totalCorrect = result.domainScores.reduce((sum, d) => sum + d.correct, 0);
  const elapsedMin = Math.floor(result.elapsedSeconds / 60);
  const elapsedSec = result.elapsedSeconds % 60;

  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Score hero card */}
      <section className={`overflow-hidden rounded-2xl border sm:rounded-xl ${result.pass ? "border-emerald-700/40" : "border-rose-700/40"}`}>
        <div className={`px-5 py-6 sm:px-6 sm:py-8 ${result.pass ? "bg-gradient-to-br from-emerald-950/60 to-zinc-900" : "bg-gradient-to-br from-rose-950/60 to-zinc-900"}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Mock Test {testId}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{result.score900}<span className="text-xl text-zinc-500 sm:text-2xl">/900</span></p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${result.pass ? "bg-emerald-800/60 text-emerald-300" : "bg-rose-800/60 text-rose-300"}`}>
              {result.pass ? "PASS" : "FAIL"}
            </span>
          </div>

          {autoSubmit ? (
            <p className="mt-2 text-sm text-amber-300/80">Auto-submitted — time expired</p>
          ) : null}

          <p className="mt-1 text-sm text-zinc-500">Passing score: 750</p>

          {/* Quick stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-zinc-200">{totalCorrect}/{totalQuestions}</p>
              <p className="text-[11px] text-zinc-500">Correct</p>
            </div>
            <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-zinc-200">{result.wrongAnswers.length}</p>
              <p className="text-[11px] text-zinc-500">Wrong</p>
            </div>
            <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-zinc-200">{elapsedMin}:{elapsedSec.toString().padStart(2, "0")}</p>
              <p className="text-[11px] text-zinc-500">Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Domain breakdown */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <h3 className="text-base font-semibold">Domain Breakdown</h3>
        <div className="mt-3 space-y-2.5">
          {result.domainScores.map((score) => {
            const pctWidth = score.total > 0 ? (score.correct / score.total) * 100 : 0;
            const isWeak = pctWidth < 70;
            return (
              <div key={`${score.domainName}-${score.domainId}`} className="rounded-lg bg-zinc-800/80 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-5">{score.domainName}</p>
                  <span className={`flex-shrink-0 text-sm font-semibold tabular-nums ${isWeak ? "text-amber-400" : "text-emerald-400"}`}>
                    {score.pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-700">
                  <div
                    className={`h-1.5 rounded-full transition-all ${isWeak ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${pctWidth}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">{score.correct}/{score.total} correct</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wrong answers */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <h3 className="text-base font-semibold">
          {result.wrongAnswers.length === 0 ? "All Correct!" : `Review Wrong Answers (${result.wrongAnswers.length})`}
        </h3>
        {result.wrongAnswers.length === 0 ? (
          <p className="mt-2 text-sm text-emerald-400">Perfect score — no incorrect answers.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {result.wrongAnswers.map((wrong, idx) => (
              <article
                key={`${wrong.questionId}-${wrong.topicId}`}
                className="rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-3.5 sm:p-4"
              >
                <p className="text-xs font-medium text-zinc-500">Question {idx + 1} • {wrong.domainName}</p>
                <p className="mt-1.5 text-sm font-medium leading-6 text-zinc-200">
                  {wrong.questionPrompt}
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="rounded-lg border border-rose-800/40 bg-rose-950/20 px-3 py-2">
                    <p className="text-xs font-medium text-rose-400">Your Answer</p>
                    <p className="mt-0.5 break-words text-sm leading-5 text-rose-200/80">{wrong.selectedAnswer}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 px-3 py-2">
                    <p className="text-xs font-medium text-emerald-400">Correct Answer</p>
                    <p className="mt-0.5 break-words text-sm leading-5 text-emerald-200/80">{wrong.correctAnswer}</p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-zinc-400">{wrong.explanation}</p>
                <Link
                  href={wrong.recommendedTopic}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition-colors active:text-cyan-300"
                >
                  Review Topic →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 pb-4 sm:flex sm:pb-0">
        <Link
          href={`/mock-tests/${testId}`}
          className="rounded-xl border border-zinc-700 bg-zinc-800 py-3 text-center text-sm font-medium transition-colors active:bg-zinc-700 sm:px-5 sm:hover:bg-zinc-700"
        >
          Retake Test
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-cyan-700 py-3 text-center text-sm font-semibold text-white transition-colors active:bg-cyan-600 sm:px-5 sm:hover:bg-cyan-600"
        >
          All Tests
        </Link>
      </div>
    </main>
  );
}
