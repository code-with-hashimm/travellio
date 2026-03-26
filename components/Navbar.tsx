"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const navLinks = ["How It Works", "Live Demo", "Tech Stack", "Team"];

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.12, 0.23, 0.5, 1] }}
      className="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
    >
      <div className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-navpill border border-white/10 bg-black/40 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal text-xs font-semibold">
            TD
          </span>
          <span>Travel Deal Hunter</span>
          <span className="ml-1 inline-flex items-center rounded-md bg-accent-cyan/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-cyan">
            AI
          </span>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-6 text-xs font-medium text-white/80 md:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              className="transition-colors hover:text-white"
            >
              {link}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 0 20px rgba(0,212,255,0.4)" }}
            transition={{ type: "spring", stiffness: 400 }}
            className="inline-flex items-center justify-center rounded-pill bg-accent-cyan px-5 py-2 text-xs font-semibold text-black"
          >
            Try Demo →
          </motion.button>
        </div>

        <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white md:hidden">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </motion.nav>
  );
}
