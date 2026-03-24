import Link from "next/link";
import { MAX_MOCK_TESTS } from "@/lib/constants";
import { HomeClient } from "@/components/home-client";

const tests = Array.from({ length: MAX_MOCK_TESTS }, (_, index) => index + 1);

export default function Home() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero / welcome section — mobile only */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-cyan-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Security+ SY0-701</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          35 full-length mock exams with 90 questions each, aligned with all 5 CompTIA domains. Scenario-based questions mirror the real exam format.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">3,150</p>
            <p className="text-[10px] text-zinc-500">Questions</p>
          </div>
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">90 min</p>
            <p className="text-[10px] text-zinc-500">Per Exam</p>
          </div>
          <div className="rounded-lg bg-zinc-800/60 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">750</p>
            <p className="text-[10px] text-zinc-500">Pass Score</p>
          </div>
        </div>
      </section>

      {/* Mock test grid with completion indicators (client component) */}
      <HomeClient tests={tests} />

      {/* Study guide CTA */}
      <Link
        href="/study"
        className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors active:bg-zinc-800/80 sm:rounded-xl sm:p-6 sm:hover:bg-zinc-800/60"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold sm:text-lg">Study Guide</h3>
            <p className="mt-1.5 text-sm leading-6 text-zinc-400">
              Review all 5 domains — key terms, real-world scenarios, and exam tips.
            </p>
          </div>
          <span className="flex-shrink-0 text-lg text-zinc-600 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* Exam info */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <h3 className="text-base font-semibold">About the SY0-701 Exam</h3>
        <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
          <div className="flex justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
            <span>Domain 1: General Security Concepts</span>
            <span className="font-semibold text-zinc-300">12%</span>
          </div>
          <div className="flex justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
            <span>Domain 2: Threats, Vulnerabilities & Mitigations</span>
            <span className="font-semibold text-zinc-300">22%</span>
          </div>
          <div className="flex justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
            <span>Domain 3: Security Architecture</span>
            <span className="font-semibold text-zinc-300">18%</span>
          </div>
          <div className="flex justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
            <span>Domain 4: Security Operations</span>
            <span className="font-semibold text-zinc-300">28%</span>
          </div>
          <div className="flex justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
            <span>Domain 5: Program Management & Oversight</span>
            <span className="font-semibold text-zinc-300">20%</span>
          </div>
        </div>
      </section>
    </main>
  );
}
