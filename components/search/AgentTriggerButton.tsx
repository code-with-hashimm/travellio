import { Robot } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface Props {
  isActive: boolean;
  onClick: () => void;
}

export function AgentTriggerButton({ isActive, onClick }: Props) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`fixed bottom-[80px] md:bottom-[32px] right-4 md:right-[32px] z-[60] flex items-center justify-center gap-2 rounded-pill border border-accent-cyan/30 bg-[#033d4a] p-3 md:px-5 md:py-3 shadow-[0_4px_24px_rgba(0,212,255,0.15)] transition-colors hover:bg-[#055468] hover:shadow-[0_6px_30px_rgba(0,212,255,0.25)]`}
    >
      <div className="relative flex items-center justify-center">
        <Robot size={24} weight="duotone" className="text-white" />
        {isActive && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-accent-green shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
        )}
      </div>
      <span className="hidden whitespace-nowrap font-sans text-sm font-semibold text-white md:inline-block">
        AI Agent
      </span>
    </motion.button>
  );
}
