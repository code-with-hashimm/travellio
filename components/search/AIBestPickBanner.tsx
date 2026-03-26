"use client";

import { motion } from "framer-motion";
import { Robot } from "@phosphor-icons/react";

export function AIBestPickBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.12, 0.23, 0.5, 1] }}
      className="mb-3 flex items-center justify-between rounded-xl border border-teal/[0.18] bg-teal/[0.07] px-4 py-3 border-l-[3px] border-l-teal"
    >
      <div className="flex items-center gap-3">
        <Robot size={20} weight="duotone" className="text-teal" />
        <span className="text-sm font-semibold text-teal-deep">AI Best Pick</span>
        <span className="hidden text-sm text-gray-muted md:inline">
          Best balance of price, speed and airline rating
        </span>
      </div>
      <button className="text-xs font-medium text-accent-cyan hover:underline">
        Why this?
      </button>
    </motion.div>
  );
}
