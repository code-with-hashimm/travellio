"use client";

import { motion } from "framer-motion";
import { CircleNotch } from "@phosphor-icons/react";

export function PartialLoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-teal/10 bg-teal/[0.02] py-8 text-center"
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-12 w-12 rounded-full bg-teal/10"
        />
        <CircleNotch size={24} weight="bold" className="animate-spin text-teal" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-teal-deep">Still hunting for more deals...</h4>
        <p className="mt-1 text-xs text-[#6b7280]">
          Our other agents are scanning more sites to find even better prices.
        </p>
      </div>
      
      {/* Subtle progress bar */}
      <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-teal/10">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-full w-24 bg-teal shadow-[0_0_8px_rgba(20,184,166,0.5)]"
        />
      </div>
    </motion.div>
  );
}
