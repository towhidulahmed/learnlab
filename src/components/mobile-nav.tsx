"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Accent = "cyan" | "emerald" | "orange" | "blue";

const PILL: Record<Accent, string> = {
  cyan:    "bg-zinc-700/55 border border-cyan-400/30 shadow-lg shadow-black/50",
  emerald: "bg-zinc-700/55 border border-emerald-400/30 shadow-lg shadow-black/50",
  orange:  "bg-zinc-700/55 border border-orange-400/30 shadow-lg shadow-black/50",
  blue:    "bg-zinc-700/55 border border-blue-400/30 shadow-lg shadow-black/50",
};

const ACTIVE_TEXT: Record<Accent, string> = {
  cyan:    "text-cyan-400",
  emerald: "text-emerald-400",
  orange:  "text-orange-400",
  blue:    "text-blue-400",
};

function NavItem({
  href,
  label,
  icon,
  isActive,
  accent,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  accent: Accent;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      {isActive && (
        <span
          className={`animate-liquid-in pointer-events-none absolute inset-x-1 inset-y-0.5 rounded-xl ${PILL[accent]}`}
        />
      )}
      <Link
        href={href}
        className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
          isActive ? ACTIVE_TEXT[accent] : "text-zinc-500 active:text-zinc-300"
        }`}
      >
        {icon}
        {label}
      </Link>
    </div>
  );
}

const StudyIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const FlashcardsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-1.007.661-1.862 1.572-2.14z" />
  </svg>
);

const PracticeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

export function MobileNav() {
  const pathname = usePathname();

  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  const inSecPlus     = pathname.startsWith("/security-plus");
  const inLinux       = pathname.startsWith("/linux");
  const inNmap        = pathname.startsWith("/nmap");
  const inUnixSec     = pathname.startsWith("/unix-security");

  if (!inSecPlus && !inLinux && !inNmap && !inUnixSec) return null;

  const isFlashcards  = pathname.includes("/flashcards");
  const isPractice    = pathname.includes("/practice");
  const isSyllabus    = pathname.includes("/syllabus");
  const isStudy       = !isFlashcards && (pathname.includes("/study") || isSyllabus);

  if (inSecPlus) {
    const isHome = pathname === "/security-plus" || pathname === "/security-plus/" || pathname.includes("/mock-tests");
    return (
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1a2438]/70 bg-[#05060c]/97 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-lg items-stretch">
          <NavItem href="/security-plus" label="Sec+" accent="cyan" isActive={isHome}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
          />
          <NavItem href="/security-plus/study" label="Study" accent="cyan" isActive={isStudy && !isHome} icon={<StudyIcon />} />
          <NavItem href="/security-plus/flashcards" label="Flashcards" accent="cyan" isActive={isFlashcards} icon={<FlashcardsIcon />} />
          <NavItem href="/security-plus/practice" label="Practice" accent="cyan" isActive={isPractice} icon={<PracticeIcon />} />
        </div>
      </nav>
    );
  }

  if (inNmap) {
    const isHome = pathname === "/nmap" || pathname === "/nmap/";
    return (
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1a2438]/70 bg-[#05060c]/97 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-lg items-stretch">
          <NavItem href="/nmap" label="Nmap" accent="orange" isActive={isHome}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" /></svg>}
          />
          <NavItem href="/nmap/study" label="Study" accent="orange" isActive={isStudy && !isHome} icon={<StudyIcon />} />
          <NavItem href="/nmap/flashcards" label="Flashcards" accent="orange" isActive={isFlashcards} icon={<FlashcardsIcon />} />
          <NavItem href="/nmap/practice" label="Practice" accent="orange" isActive={isPractice} icon={<PracticeIcon />} />
        </div>
      </nav>
    );
  }

  if (inUnixSec) {
    const isHome = pathname === "/unix-security" || pathname === "/unix-security/";
    return (
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1a2438]/70 bg-[#05060c]/97 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-lg items-stretch">
          <NavItem href="/unix-security" label="Unix Sec" accent="blue" isActive={isHome}
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /></svg>}
          />
          <NavItem href="/unix-security/study" label="Study" accent="blue" isActive={isStudy && !isHome} icon={<StudyIcon />} />
          <NavItem href="/unix-security/flashcards" label="Flashcards" accent="blue" isActive={isFlashcards} icon={<FlashcardsIcon />} />
          <NavItem href="/unix-security/practice" label="Practice" accent="blue" isActive={isPractice} icon={<PracticeIcon />} />
        </div>
      </nav>
    );
  }

  // Linux
  const isHome = pathname === "/linux" || pathname === "/linux/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1a2438]/70 bg-[#05060c]/97 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-lg items-stretch">
        <NavItem href="/linux" label="Linux" accent="emerald" isActive={isHome}
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25z" /></svg>}
        />
        <NavItem href="/linux/study" label="Study" accent="emerald" isActive={isStudy && !isHome} icon={<StudyIcon />} />
        <NavItem href="/linux/flashcards" label="Flashcards" accent="emerald" isActive={isFlashcards} icon={<FlashcardsIcon />} />
        <NavItem href="/linux/practice" label="Practice" accent="emerald" isActive={isPractice} icon={<PracticeIcon />} />
      </div>
    </nav>
  );
}
