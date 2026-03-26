"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionTag } from "./ui/SectionTag";

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

const painPoints = [
  {
    icon: "🔍",
    title: "12+ Tabs Open",
    description: "Hours wasted comparing prices across platforms."
  },
  {
    icon: "⏰",
    title: "Deals Expire Fast",
    description: "Flash sales disappear before you find them."
  },
  {
    icon: "📉",
    title: "No Price History",
    description: "You never know if today's price is actually good."
  }
];

export function ProblemStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const count = useCountUp(23000, inView);

  return (
    <section className="relative bg-surface-dark px-4 py-24 text-white md:px-10 lg:px-16">
      <div className="dot-grid absolute inset-0" />
      <div ref={ref} className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SectionTag className="border-white/20 bg-white/5 text-white/80">
            The Problem
          </SectionTag>
          <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl">
            Travelers Are Paying Way More Than They Should
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12"
        >
          <p className="font-mono text-5xl font-bold text-accent-cyan md:text-7xl">
            ₹{new Intl.NumberFormat("en-IN").format(count)}
          </p>
          <p className="mt-3 text-sm text-white/60 md:text-base">
            average overspend per international trip
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group rounded-card border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-cyan-glow"
            >
              <div className="mb-4 text-3xl">{point.icon}</div>
              <h3 className="font-display text-lg">{point.title}</h3>
              <p className="mt-2 text-sm text-white/60">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
