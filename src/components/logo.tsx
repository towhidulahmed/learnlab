type LogoProps = {
  large?: boolean;
  className?: string;
};

export function Logo({ large = false, className = "" }: LogoProps) {
  const shieldSize = large ? "0.72em" : "0.8em";

  return (
    <span
      className={`inline-flex items-center gap-[0.25em] font-black tracking-tight select-none ${
        large
          ? "text-4xl sm:text-5xl lg:text-6xl"
          : "text-lg sm:text-xl"
      } ${className}`}
      aria-label="SecLab"
      role="img"
    >
      {/* Shield icon — security mark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-400 flex-shrink-0"
        style={{ width: shieldSize, height: shieldSize }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>

      {/* "Sec" — white */}
      <span className="text-zinc-100">Sec</span>

      {/* "Lab" — emerald green, terminal feel */}
      <span className="text-emerald-400">Lab</span>
    </span>
  );
}
