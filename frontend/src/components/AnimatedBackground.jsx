const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Main gradient */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Glowing orbs */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />

      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" />

      <div className="absolute bottom-[-250px] left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.35) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.35) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "55px 55px",
        }}
      />

      {/* Neural nodes */}
      <div className="absolute left-[12%] top-[20%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.25)] animate-pulse" />

      <div className="absolute left-[25%] top-[45%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_25px_8px_rgba(139,92,246,0.25)] animate-pulse" />

      <div className="absolute right-[18%] top-[25%] h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_25px_8px_rgba(217,70,239,0.25)] animate-pulse" />

      <div className="absolute right-[30%] bottom-[25%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_25px_8px_rgba(34,211,238,0.25)] animate-pulse" />

      {/* Connecting lines */}
      <div className="absolute left-[12.5%] top-[20.5%] h-px w-[14%] rotate-[20deg] bg-gradient-to-r from-cyan-400/30 to-violet-400/10" />

      <div className="absolute left-[25.5%] top-[45%] h-px w-[20%] rotate-[-18deg] bg-gradient-to-r from-violet-400/20 to-fuchsia-400/10" />

      <div className="absolute right-[19%] top-[25%] h-px w-[18%] rotate-[30deg] bg-gradient-to-r from-fuchsia-400/20 to-cyan-400/10" />
    </div>
  );
};

export default AnimatedBackground;