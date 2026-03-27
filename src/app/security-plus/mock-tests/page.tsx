import Link from "next/link";
import { MAX_MOCK_TESTS } from "@/lib/constants";
import { HomeClient } from "@/components/home-client";

const tests = Array.from({ length: MAX_MOCK_TESTS }, (_, i) => i + 1);

export default function MockTestsPage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-cyan-950/30 to-zinc-900 p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Mock Tests</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {MAX_MOCK_TESTS} full-length SY0-701 exams — 90 minutes, 90 questions each.
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

      {/* Mock test grid with completion indicators */}
      <HomeClient tests={tests} />
    </main>
  );
}
