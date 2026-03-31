"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();

  // Hide header entirely during active mock exams (but show on result pages)
  const isExamActive = /^\/security-plus\/mock-tests\/\d+\/?$/.test(pathname);
  if (isExamActive) return null;

  const isHome = pathname === "/";

  // Landing page, hero Logo handles branding, no header needed
  if (isHome) return null;

  return (
    <header className="flex sticky top-0 z-30 mb-4 items-center border-b border-[#1a2438]/70 bg-[#06070d]/96 px-4 py-3 backdrop-blur-md sm:static sm:mb-8 sm:rounded-xl sm:border sm:border-[#1c2640]/60 sm:bg-[#090d18]/80 sm:px-5 sm:py-4">
      <Link href="/" className="flex items-center gap-2.5">
        <Logo />
      </Link>
    </header>
  );
}
