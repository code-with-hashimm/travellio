"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionTag } from "./ui/SectionTag";

function TypewriterText({ text, inView }: { text: string; inView: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <span>
      {displayed}
      <span className="cursor-blink text-accent-cyan">|</span>
    </span>
  );
}

const platforms = [
  "Skyscanner",
  "MakeMyTrip",
  "Google Flights",
  "Booking.com",
  "Airbnb",
  "Kayak"
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white px-4 py-24 text-gray-body md:px-10 lg:px-16">
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="bg-cream/80">How It Works</SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            The Hunt in 3 Steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="group rounded-card border border-gray-border/40 bg-white p-6 shadow-sm transition-colors hover:border-teal/40"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              1
            </div>
            <h3 className="font-display text-xl text-teal-deep">
              Enter Your Trip
            </h3>
            <div className="mt-4 rounded-xl bg-surface-dark p-4">
              <div className="flex items-center gap-2 rounded-lg bg-code-bg px-3 py-2 font-mono text-sm text-white">
                <span className="text-white/40">🔍</span>
                <TypewriterText text="Mumbai → Bali, 15 Mar" inView={inView} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-muted">
              Just type your destination and dates. Our AI handles the rest.
            </p>
          </motion.div>

          {/* Connector */}
          <div className="hidden items-center md:flex">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="w-full"
            >
              {/* Step 2 */}
              <div className="group rounded-card border border-gray-border/40 bg-white p-6 shadow-sm transition-colors hover:border-teal/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                  2
                </div>
                <h3 className="font-display text-xl text-teal-deep">
                  AI Scans Everything
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {platforms.map((platform, i) => (
                    <motion.span
                      key={platform}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.5 + i * 0.15,
                        duration: 0.3,
                        ease: [0.12, 0.23, 0.5, 1]
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="rounded-full bg-surface-dark px-3 py-1 font-mono text-xs text-accent-cyan"
                    >
                      {platform}
                    </motion.span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-muted">
                  500+ sources scanned simultaneously in under 2 seconds.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Step 2 mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.12, 0.23, 0.5, 1]
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="group rounded-card border border-gray-border/40 bg-white p-6 shadow-sm transition-colors hover:border-teal/40 md:hidden"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              2
            </div>
            <h3 className="font-display text-xl text-teal-deep">
              AI Scans Everything
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {platforms.map((platform, i) => (
                <motion.span
                  key={platform}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.15,
                    duration: 0.3,
                    ease: [0.12, 0.23, 0.5, 1]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-full bg-surface-dark px-3 py-1 font-mono text-xs text-accent-cyan"
                >
                  {platform}
                </motion.span>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-muted">
              500+ sources scanned simultaneously in under 2 seconds.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.12, 0.23, 0.5, 1]
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="group rounded-card border border-gray-border/40 bg-white p-6 shadow-sm transition-colors hover:border-teal/40"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
              3
            </div>
            <h3 className="font-display text-xl text-teal-deep">
              Get the Best Deal
            </h3>
            <div className="mt-4 rounded-xl border border-accent-cyan/30 bg-surface-dark p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-accent-cyan">
                    BEST DEAL
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Mumbai → Bali
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-white/50 line-through">
                    ₹42,000
                  </p>
                  <p className="font-mono text-lg font-bold text-accent-green">
                    ₹24,800
                  </p>
                </div>
              </div>
              <div className="mt-2 inline-block rounded-full bg-accent-green/20 px-2 py-0.5 text-xs font-medium text-accent-green">
                Save 41%
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-muted">
              Get the best deal ranked by our AI with savings highlighted.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
