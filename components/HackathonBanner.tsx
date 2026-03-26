"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export function HackathonBanner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.12, 0.23, 0.5, 1] }}
          className="relative z-[60] flex h-10 items-center justify-center overflow-hidden border-b border-accent-cyan/30 bg-gradient-to-r from-teal-deep via-teal to-teal-deep text-xs text-white"
        >
          <div className="shimmer-sweep absolute inset-0" />
          <div className="relative z-10 flex items-center gap-3">
            <span>
              🐟 Built at TinyFish Hackathon 2025 · Next.js + AI
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan underline-offset-2 hover:underline"
            >
              GitHub →
            </a>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
