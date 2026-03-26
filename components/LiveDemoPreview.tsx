"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SectionTag } from "./ui/SectionTag";
import { useRouter } from "next/navigation";

const demoDeals = [
  {
    route: "Mumbai → Dubai",
    airline: "IndiGo",
    original: "₹21,800",
    price: "₹12,400",
    savings: "43%",
    best: true
  },
  {
    route: "Mumbai → Dubai",
    airline: "Air India",
    original: "₹24,500",
    price: "₹15,200",
    savings: "38%",
    best: false
  },
  {
    route: "Mumbai → Dubai",
    airline: "Emirates",
    original: "₹32,000",
    price: "₹22,100",
    savings: "31%",
    best: false
  }
];

const scanPlatforms = [
  "Skyscanner",
  "MakeMyTrip",
  "Google Flights",
  "Booking.com",
  "Kayak",
  "Cleartrip"
];

const searchText = "Mumbai → Dubai, 20 Mar";

export function LiveDemoPreview({ demoUrl }: { demoUrl?: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [scanIndex, setScanIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const cycleDuration = 6000;
    let timer: NodeJS.Timeout;

    const runCycle = () => {
      // Phase 0: Typing (1.5s)
      setPhase(0);
      setTypedText("");
      setScanIndex(0);
      setProgress(0);

      let charIdx = 0;
      const typeTimer = setInterval(() => {
        charIdx++;
        setTypedText(searchText.slice(0, charIdx));
        if (charIdx >= searchText.length) clearInterval(typeTimer);
      }, 65);

      // Phase 1: Scanning (1.5s)
      setTimeout(() => {
        clearInterval(typeTimer);
        setTypedText(searchText);
        setPhase(1);
        let si = 0;
        const scanTimer = setInterval(() => {
          si++;
          setScanIndex(si);
          setProgress((si / scanPlatforms.length) * 100);
          if (si >= scanPlatforms.length) clearInterval(scanTimer);
        }, 200);
      }, 1500);

      // Phase 2: Results (2.5s)
      setTimeout(() => {
        setPhase(2);
        setProgress(100);
      }, 3000);

      // Phase 3: Reset (0.5s)
      setTimeout(() => {
        setPhase(3);
      }, 5500);

      // Restart
      timer = setTimeout(runCycle, cycleDuration);
    };

    runCycle();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative bg-surface-dark px-4 py-24 text-white md:px-10 lg:px-16">
      <div className="dot-grid absolute inset-0" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SectionTag className="border-white/20 bg-white/5 text-white/80">
            Live Product
          </SectionTag>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            See It Hunt in Real Time
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.12, 0.23, 0.5, 1]
          }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-code-bg shadow-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 font-mono text-xs text-white/40">
              travel-deal-hunter — search
            </span>
          </div>

          <div className="relative h-[420px] overflow-hidden p-6">
            {/* Search bar — always visible */}
            <div className="flex items-center gap-3 rounded-xl bg-surface-dark p-3">
              <div className="flex-1 rounded-lg bg-black/50 px-4 py-2.5 text-left font-mono text-sm">
                <span className="text-white/90">{typedText}</span>
                {phase === 0 && (
                  <span className="cursor-blink text-accent-cyan">|</span>
                )}
              </div>
              <button
                onClick={() => router.push('/search')}
                className={`rounded-lg px-4 py-2.5 font-mono text-xs font-semibold transition-all ${
                  phase === 0
                    ? "animate-pulse bg-accent-cyan text-black"
                    : "bg-accent-cyan text-black"
                }`}
              >
                Hunt
              </button>
            </div>

            {/* Content area — fixed space below search bar */}
            <div className="relative mt-4 h-[320px]">
              {/* Progress bar — scanning phase */}
              <motion.div
                initial={false}
                animate={{ opacity: phase === 1 || phase === 2 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 top-0"
              >
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full bg-accent-cyan"
                  />
                </div>
                {phase === 1 && scanIndex < scanPlatforms.length && (
                  <p className="mt-2 font-mono text-xs text-accent-cyan">
                    Scanning {scanPlatforms[scanIndex]}...
                  </p>
                )}
                {phase === 1 && scanIndex >= scanPlatforms.length && (
                  <p className="mt-2 font-mono text-xs text-accent-green">
                    ✓ All sources scanned
                  </p>
                )}
              </motion.div>

              {/* Results — display phase */}
              <motion.div
                initial={false}
                animate={{ opacity: phase === 2 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 top-8 space-y-3"
              >
                {demoDeals.map((deal, i) => (
                  <motion.div
                    key={deal.airline}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: phase === 2 ? 1 : 0,
                      y: phase === 2 ? 0 : 15
                    }}
                    transition={{
                      delay: phase === 2 ? i * 0.15 : 0,
                      duration: 0.4,
                      ease: [0.12, 0.23, 0.5, 1]
                    }}
                    className={`flex items-center justify-between rounded-xl p-4 ${
                      deal.best
                        ? "border border-accent-cyan/40 bg-accent-cyan/5"
                        : "border border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {deal.best && (
                        <span className="rounded-full bg-accent-cyan/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent-cyan">
                          BEST
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {deal.route}
                        </p>
                        <p className="text-xs text-white/50">{deal.airline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-white/40 line-through">
                        {deal.original}
                      </p>
                      <p className="font-mono text-lg font-bold text-white">
                        {deal.price}
                      </p>
                      <span className="font-mono text-xs font-semibold text-accent-green">
                        Save {deal.savings}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <p className="pt-2 font-mono text-xs text-white/30">
                  Scanned 523 sources in 1.8s
                </p>
              </motion.div>

              {/* Idle / typing state */}
              <motion.div
                initial={false}
                animate={{ opacity: phase === 0 || phase === 3 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="font-mono text-sm text-white/20">
                  {phase === 3 ? "Resetting..." : "Type a destination to start hunting..."}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {demoUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              src={demoUrl}
              className="h-[600px] w-full"
              title="Live Demo"
            />
          </div>
        )}
      </div>
    </section>
  );
}
