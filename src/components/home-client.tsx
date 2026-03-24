"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadAttempts } from "@/lib/client-storage";

type AttemptSummary = {
  testNumber: number;
  score900: number;
  pass: boolean;
};

export function HomeClient({ tests }: { tests: number[] }) {
  const [completedTests, setCompletedTests] = useState<Record<number, AttemptSummary>>({});

  useEffect(() => {
    const attempts = loadAttempts();
    const best: Record<number, AttemptSummary> = {};
    attempts.forEach((a) => {
      if (!best[a.testNumber] || a.score900 > best[a.testNumber].score900) {
        best[a.testNumber] = {
          testNumber: a.testNumber,
          score900: a.score900,
          pass: a.pass,
        };
      }
    });
    setCompletedTests(best);
  }, []);

  const completedCount = Object.keys(completedTests).length;
  const passedCount = Object.values(completedTests).filter((t) => t.pass).length;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">Mock Exams</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {completedCount > 0
              ? `${completedCount} attempted · ${passedCount} passed`
              : "Choose an exam to begin"}
          </p>
        </div>
        {completedCount > 0 ? (
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
            {completedCount}/{tests.length}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {tests.map((testNumber) => {
          const result = completedTests[testNumber];
          let borderClass = "border-zinc-700/60";
          let bgClass = "bg-zinc-800/80 active:bg-zinc-700";
          let labelExtra = null;

          if (result) {
            if (result.pass) {
              borderClass = "border-emerald-700/40";
              bgClass = "bg-emerald-950/30 active:bg-emerald-900/40";
              labelExtra = (
                <span className="text-[10px] font-semibold text-emerald-400">{result.score900}</span>
              );
            } else {
              borderClass = "border-amber-700/40";
              bgClass = "bg-amber-950/20 active:bg-amber-900/30";
              labelExtra = (
                <span className="text-[10px] font-semibold text-amber-400">{result.score900}</span>
              );
            }
          }

          return (
            <Link
              key={testNumber}
              href={`/mock-tests/${testNumber}`}
              className={`flex flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition-all ${borderClass} ${bgClass}`}
            >
              <span className="text-sm font-semibold text-zinc-200">Test {testNumber}</span>
              {labelExtra ? (
                <span className="mt-0.5">{labelExtra}</span>
              ) : (
                <span className="mt-0.5 text-[10px] text-zinc-600">—</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      {completedCount > 0 ? (
        <div className="mt-3 flex gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-700/60" /> Passed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-amber-700/60" /> Failed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-zinc-700" /> Not attempted
          </span>
        </div>
      ) : null}
    </section>
  );
}
