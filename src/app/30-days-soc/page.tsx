import Link from "next/link";
import { SOC_FLASHCARD_DOMAINS, SOC_TOTAL_FLASHCARDS, SOC_TOTAL_TOPICS } from "@/lib/soc-flashcard-data";

export default function SocHome() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Hero */}
      <section className="rounded-2xl border border-violet-900/40 bg-gradient-to-br from-violet-950/50 via-[#10091a] to-[#080b10] p-5 sm:rounded-xl sm:p-6">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">30-Day SOC Analyst</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Spaced-repetition flashcards from the 35-day SOC Analyst learning program.
          Cards are added day by day as the program progresses — your Anki replacement.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[#170d24]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{SOC_TOTAL_TOPICS}</p>
            <p className="text-[10px] text-zinc-500">Days</p>
          </div>
          <div className="rounded-lg bg-[#170d24]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{SOC_TOTAL_FLASHCARDS}</p>
            <p className="text-[10px] text-zinc-500">Flashcards</p>
          </div>
          <div className="rounded-lg bg-[#170d24]/70 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-zinc-200">{SOC_FLASHCARD_DOMAINS.length}</p>
            <p className="text-[10px] text-zinc-500">Weeks</p>
          </div>
        </div>
      </section>

      {/* Single CTA — flashcards only */}
      <Link
        href="/30-days-soc/flashcards"
        className="group block rounded-2xl border border-[#1c2438]/70 bg-gradient-to-br from-[#0e1220]/90 to-[#0b0d16] p-5 transition-all active:from-[#131a2e]/90 sm:rounded-xl sm:hover:from-[#111827]/90 sm:hover:border-[#253050]/60"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Flashcards</h3>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {SOC_TOTAL_FLASHCARDS} cards across {SOC_TOTAL_TOPICS} days. Pick a day or
              study all at once.
            </p>
          </div>
          <span className="flex-shrink-0 text-lg text-violet-500/60 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </main>
  );
}
