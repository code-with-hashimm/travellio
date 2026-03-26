"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { heroVideo } from "@/lib/data";
import { useRouter } from "next/navigation";

const heroWords = "Find the Best Travel Deals with AI.".split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export function Hero() {
  const router = useRouter();
  return (
    <section className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        <div className="absolute inset-0 bg-teal/10" />
      </div>

      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* LIVE badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.12, 0.23, 0.5, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-green/30 bg-accent-green/10 px-4 py-1.5 text-xs font-medium text-accent-green pulse-green"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
          </span>
          LIVE — Scanning deals right now
        </motion.div>

        <motion.h1
          className="font-display text-[40px] leading-tight tracking-[-0.02em] text-white sm:text-[48px] md:text-[64px] lg:text-[92px]"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08, delayChildren: 0.4 }}
        >
          {heroWords.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
              className={`inline-block px-[2px] ${
                word === "AI." ? "text-accent-cyan" : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: [0.12, 0.23, 0.5, 1] }}
          className="mt-6 max-w-xl text-base text-white/80 md:text-lg"
        >
          We scan 500+ platforms in real-time so you never overpay for flights,
          hotels or experiences again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.12, 0.23, 0.5, 1] }}
          className="mt-8 flex gap-4 gooey-filter"
        >
          <Button 
            onClick={() => router.push('/search')}
            className="px-8 py-3 text-sm font-semibold"
          >
            Hunt a Deal →
          </Button>
          <Button 
            onClick={() => router.push('/search')}
            variant="ghost" 
            className="px-8 py-3 text-sm font-semibold"
          >
            Watch Demo
          </Button>
        </motion.div>
      </div>

      {/* Floating data cards */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Top-left: Flight deal card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.12, 0.23, 0.5, 1] }}
          className="absolute left-10 top-24 w-52 rotate-[7deg] overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 shadow-card backdrop-blur-md"
        >
          <p className="text-[10px] uppercase tracking-wider text-white/50">Flight Deal</p>
          <p className="mt-1 font-display text-sm text-white">Mumbai → Dubai</p>
          <p className="text-xs text-white/60">IndiGo · Direct</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-white">₹4,200</span>
            <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-[10px] font-bold text-accent-green">
              -43%
            </span>
          </div>
        </motion.div>

        {/* Bottom-left: "Just found" card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: [0.12, 0.23, 0.5, 1] }}
          className="absolute bottom-16 left-24 w-48 -rotate-[7deg] overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 shadow-card backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
            </span>
            <p className="text-[10px] uppercase tracking-wider text-accent-green">
              Just Found
            </p>
          </div>
          <p className="mt-2 font-display text-sm text-white">Delhi → Bangkok</p>
          <p className="mt-1 font-mono text-base font-bold text-white">₹6,800</p>
        </motion.div>

        {/* Top-right: Savings summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: [0.12, 0.23, 0.5, 1] }}
          className="absolute right-24 top-24 w-48 -rotate-[6deg] overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 shadow-card backdrop-blur-md"
        >
          <p className="text-[10px] uppercase tracking-wider text-white/50">
            Total Saved 🎉
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-accent-cyan">
            ₹1.2L
          </p>
          <p className="mt-1 text-xs text-white/50">across 847 users</p>
        </motion.div>

        {/* Bottom-right: AI stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: [0.12, 0.23, 0.5, 1] }}
          className="absolute bottom-20 right-10 w-48 rotate-[13deg] overflow-hidden rounded-2xl border border-accent-cyan/20 bg-black/60 p-4 shadow-card backdrop-blur-md"
        >
          <p className="text-[10px] uppercase tracking-wider text-accent-cyan">
            AI Stats
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Sources</span>
              <span className="font-mono text-white">523</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Search time</span>
              <span className="font-mono text-white">1.8s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Accuracy</span>
              <span className="font-mono text-accent-green">98.2%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
