type LogoProps = {
  large?: boolean;
  className?: string;
};

export function Logo({ large = false, className = "" }: LogoProps) {
  const iconSize = large ? "0.68em" : "0.78em";

  return (
    <span
      className={`inline-flex items-center gap-[0.2em] font-black tracking-tight select-none ${
        large
          ? "text-4xl sm:text-5xl lg:text-6xl"
          : "text-lg sm:text-xl"
      } ${className}`}
      aria-label="SecLab 30"
      role="img"
    >
      {/*
        Hexagon — the dominant shape in cybersecurity:
        network topology diagrams, SIEM dashboards, honeypot maps,
        IEEE security research papers. A solid filled hexagon scales
        cleanly from 14px (header) to 48px+ (hero) without detail loss.
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-cyan-400 flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
      </svg>

      {/* "Sec" — white */}
      <span className="text-zinc-100">Sec</span>

      {/* "Lab" — cyan */}
      <span className="text-cyan-400">Lab</span>

      {/* "30" — version tag superscript */}
      <span
        className="font-bold text-zinc-500"
        style={{
          fontSize: large ? "0.3em" : "0.5em",
          alignSelf: "flex-start",
          marginTop: large ? "0.2em" : "0.12em",
          letterSpacing: "0",
        }}
      >
        30
      </span>
    </span>
  );
}
