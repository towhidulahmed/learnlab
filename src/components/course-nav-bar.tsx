"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Accent = "cyan" | "emerald" | "orange" | "blue" | "violet";

const PILL_ACTIVE: Record<Accent, string> = {
  cyan:    "bg-zinc-700/70 text-cyan-400 border border-cyan-400/30",
  emerald: "bg-zinc-700/70 text-emerald-400 border border-emerald-400/30",
  orange:  "bg-zinc-700/70 text-orange-400 border border-orange-400/30",
  blue:    "bg-zinc-700/70 text-blue-400 border border-blue-400/30",
  violet:  "bg-zinc-700/70 text-violet-400 border border-violet-400/30",
};

const COURSE_LABEL_COLOR: Record<Accent, string> = {
  cyan:    "text-cyan-400",
  emerald: "text-emerald-400",
  orange:  "text-orange-400",
  blue:    "text-blue-400",
  violet:  "text-violet-400",
};

interface CourseConfig {
  label: string;
  accent: Accent;
  home: string;
  tabs: { label: string; href: string; segment: string }[];
}

const COURSES: Record<string, CourseConfig> = {
  "security-plus": {
    label: "Sec+",
    accent: "cyan",
    home: "/security-plus",
    tabs: [
      { label: "Study",      href: "/security-plus/study",      segment: "study"      },
      { label: "Flashcards", href: "/security-plus/flashcards", segment: "flashcards" },
      { label: "Practice",   href: "/security-plus/practice",   segment: "practice"   },
      { label: "Mock Tests", href: "/security-plus/mock-tests", segment: "mock-tests" },
    ],
  },
  linux: {
    label: "Linux Admin",
    accent: "emerald",
    home: "/linux",
    tabs: [
      { label: "Study",      href: "/linux/study",      segment: "study"      },
      { label: "Flashcards", href: "/linux/flashcards", segment: "flashcards" },
      { label: "Practice",   href: "/linux/practice",   segment: "practice"   },
    ],
  },
  nmap: {
    label: "Nmap",
    accent: "orange",
    home: "/nmap",
    tabs: [
      { label: "Study",      href: "/nmap/study",      segment: "study"      },
      { label: "Flashcards", href: "/nmap/flashcards", segment: "flashcards" },
      { label: "Practice",   href: "/nmap/practice",   segment: "practice"   },
    ],
  },
  "unix-security": {
    label: "Unix Security",
    accent: "blue",
    home: "/unix-security",
    tabs: [
      { label: "Study",      href: "/unix-security/study",      segment: "study"      },
      { label: "Flashcards", href: "/unix-security/flashcards", segment: "flashcards" },
      { label: "Practice",   href: "/unix-security/practice",   segment: "practice"   },
    ],
  },
  "30-days-soc": {
    label: "30-Day SOC",
    accent: "violet",
    home: "/30-days-soc",
    tabs: [
      { label: "Flashcards", href: "/30-days-soc/flashcards", segment: "flashcards" },
    ],
  },
};

function getActiveSegment(pathname: string): string {
  if (pathname.includes("/flashcards")) return "flashcards";
  if (pathname.includes("/mock-tests"))  return "mock-tests";
  if (pathname.includes("/practice"))    return "practice";
  if (pathname.includes("/study"))       return "study";
  return "";
}

export function CourseNavBar() {
  const pathname = usePathname();

  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  const courseKey = Object.keys(COURSES).find((key) => pathname.startsWith(`/${key}`));
  if (!courseKey) return null;

  const course = COURSES[courseKey];
  const activeSegment = getActiveSegment(pathname);
  const isHome = activeSegment === "";
  const { accent } = course;

  return (
    <nav className="mb-6 hidden sm:flex items-center gap-1 sticky top-0 z-20 rounded-xl border border-[#1c2640]/60 bg-[#090d18]/90 px-3 py-2 backdrop-blur-md">
      {/* Course home link */}
      <Link
        href={course.home}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
          isHome
            ? `${PILL_ACTIVE[accent]}`
            : `text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60`
        }`}
      >
        <span className={isHome ? "" : COURSE_LABEL_COLOR[accent]}>{course.label}</span>
      </Link>

      {/* Divider */}
      <div className="mx-1 h-4 w-px bg-zinc-700/60" />

      {/* Section tabs */}
      {course.tabs.map((tab) => {
        const active = activeSegment === tab.segment;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              active
                ? `${PILL_ACTIVE[accent]}`
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
