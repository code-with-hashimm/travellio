import { motion } from "framer-motion";
import { Robot } from "@phosphor-icons/react";

interface Props {
  elapsedMs: number;
  progressPct: number;
  onExpand: () => void;
}

export function AgentMinimized({ elapsedMs, progressPct, onExpand }: Props) {
  const s = Math.floor(elapsedMs / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const time = `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;

  return (
    <motion.button
      key="agent-minimized"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      onClick={onExpand}
      className="fixed bottom-[32px] right=[32px] md:right-[32px] right-4 left-4 md:left-auto flex h-[56px] w-auto md:w-[320px] items-center justify-between overflow-hidden rounded-xl border border-accent-cyan/20 bg-[#0d1117] px-4 shadow-[0_4px_24px_rgba(0,212,255,0.15)] z-[60]"
    >
      {/* Background Micro Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal to-accent-cyan"
        style={{ width: `${progressPct}%` }}
      />

      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-accent-cyan">
          <Robot size={20} weight="duotone" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-accent-green shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
        </div>
        <span className="text-sm font-medium text-white">
          Agent running
        </span>
      </div>

      <span className="font-mono text-sm font-semibold text-white/80">
        {time}
      </span>
    </motion.button>
  );
}
