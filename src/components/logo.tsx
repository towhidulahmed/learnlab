type LogoProps = {
  large?: boolean;
  className?: string;
};

export function Logo({ large = false, className = "" }: LogoProps) {
  const boltSize = large ? "0.6em" : "0.7em";

  return (
    <span
      className={`inline-flex items-baseline gap-[0.12em] font-black tracking-tight select-none ${
        large
          ? "text-4xl sm:text-5xl lg:text-6xl"
          : "text-lg sm:text-xl"
      } ${className}`}
      aria-label="SecLab 30"
      role="img"
    >
      {/* Lightning bolt — old Stuick accent, carried over */}
      <svg
        aria-hidden="true"
        viewBox="0 0 7 10"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: "#facc15",
          width: boltSize,
          height: boltSize,
          alignSelf: "center",
          flexShrink: 0,
        }}
      >
        <polygon points="5,0 0,6 3.5,6 2,10 7,4 3.5,4" />
      </svg>

      {/* "Sec" — heavy white */}
      <span className="text-zinc-100">Sec</span>

      {/* "Lab" — yellow accent */}
      <span className="text-yellow-400">Lab</span>

      {/* "30" — version tag superscript */}
      <span
        className="font-bold text-yellow-400"
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
