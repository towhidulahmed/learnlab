import Link from "next/link";

const COURSES = [
  {
    href: "/security-plus",
    title: "CompTIA Security+",
    subtitle: "SY0-701 Exam Prep",
    description: "Mock exams, practice questions, and a full study guide.",
    accent: "cyan",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    tags: ["410 Questions", "Mock Exams", "Study Guide"],
    accentClasses: {
      card: "sm:hover:border-cyan-800/40",
      iconBg: "bg-cyan-950/40 text-cyan-400",
      tag: "bg-cyan-950/40 text-cyan-400",
      arrow: "text-cyan-500/40",
    },
  },
  {
    href: "/linux",
    title: "Linux Administration",
    subtitle: "System Admin Essentials",
    description: "Study guides, flashcards, and practice exams.",
    accent: "emerald",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25z" />
      </svg>
    ),
    tags: ["16 Topics", "Flashcards", "Practice"],
    accentClasses: {
      card: "sm:hover:border-emerald-800/40",
      iconBg: "bg-emerald-950/40 text-emerald-400",
      tag: "bg-emerald-950/40 text-emerald-400",
      arrow: "text-emerald-500/40",
    },
  },
];

export default function Home() {
  return (
    <main className="px-3 pt-4 sm:px-0 sm:pt-0">
      {/* Hero — full-width centered */}
      <section className="flex flex-col items-center justify-center pt-12 pb-8 text-center sm:py-20">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl sm:font-extrabold lg:text-6xl">
          Stuick
        </h2>
        <p className="mt-3 text-base font-semibold text-zinc-300 sm:mt-4 sm:text-lg sm:font-normal sm:text-zinc-400">
          Why Study Long When You Can Study Quick
        </p>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-500 sm:max-w-md sm:mt-4 sm:text-base">
          Pick a course and start learning with flashcards, practice questions, and mock exams — all in one place.
        </p>
      </section>

      {/* Course cards */}
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
        {COURSES.map((course) => (
          <Link
            key={course.href}
            href={course.href}
            className={`group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all active:bg-zinc-800/80 sm:rounded-xl sm:p-6 sm:hover:bg-zinc-800/40 ${course.accentClasses.card}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${course.accentClasses.iconBg}`}>
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold sm:text-lg">{course.title}</h3>
                <p className="text-xs text-zinc-500">{course.subtitle}</p>
              </div>
              <span className={`flex-shrink-0 text-lg transition-transform group-hover:translate-x-1 ${course.accentClasses.arrow}`}>
                →
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {course.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-10 pb-2 text-center sm:mt-14">
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Stuick</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
          <span className="font-mono text-zinc-600">&lt;/&gt;</span>
          <a
            href="https://www.towhid.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 transition-colors hover:text-zinc-400"
          >
            towhid.info
          </a>
        </p>
      </footer>
    </main>
  );
}
