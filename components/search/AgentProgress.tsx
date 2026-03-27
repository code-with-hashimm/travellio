import { motion, AnimatePresence } from "framer-motion";

interface Props {
  progressPct: number;
  statusMsg: string;
  elapsedMs: number;
  sourcesCount: number;
  dealsFound: number;
  status?: string;
}

export function AgentProgress({
  progressPct,
  statusMsg,
  elapsedMs,
  sourcesCount,
  dealsFound,
  status = "streaming"
}: Props) {
  const pct = Math.min(Math.max(progressPct, 0), 100);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-[45vh] md:h-[40%] w-full flex-col justify-center bg-[#161b22] px-6 py-4">
      {/* Progress Bar */}
      <div className="relative mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal to-accent-cyan shadow-[0_0_8px_rgba(0,212,255,0.4)]"
        />
      </div>

      {/* Status Message */}
      <div className="mb-8 min-h-[40px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusMsg}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="font-mono text-[13px] tracking-wide text-accent-cyan"
          >
            {statusMsg}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Urgency Warning */}
      <AnimatePresence>
        {elapsedMs > 15000 && status === "streaming" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <p className="text-[11px] font-medium text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg inline-block">
              ⚠️ This site is taking longer than usual. Hang tight or try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.05] rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Sources
          </span>
          <span className="font-mono text-[15px] font-semibold text-white">
            {sourcesCount}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Time
          </span>
          <span className="font-mono text-[15px] font-semibold text-white">
            {formatTime(elapsedMs)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            Deals
          </span>
          <span className="font-mono text-[15px] font-semibold text-white">
            {dealsFound}
          </span>
        </div>
      </div>
    </div>
  );
}
