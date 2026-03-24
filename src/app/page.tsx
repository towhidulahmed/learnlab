import Link from "next/link";
import { MAX_MOCK_TESTS } from "@/lib/constants";

const tests = Array.from({ length: MAX_MOCK_TESTS }, (_, index) => index + 1);

export default function Home() {
  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Mock Test Module</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Choose from 35 realistic 90-question exams aligned with CompTIA Security+ SY0-701 objectives.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {tests.map((testNumber) => (
            <Link
              key={testNumber}
              href={`/mock-tests/${testNumber}`}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-center text-sm hover:bg-zinc-700"
            >
              Mock Test {testNumber}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-1">
        <Link href="/study" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800/60 sm:p-5">
          <h3 className="font-semibold">Study Module</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Review all 5 official domains with concepts, key terms, examples, and memory tips.
          </p>
        </Link>
      </section>
    </main>
  );
}
