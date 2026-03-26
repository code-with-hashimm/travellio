"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { statsBarData } from "@/lib/data";

function CountUpStat({
  value,
  suffix,
  label,
  inView
}: {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const isDecimal = value % 1 !== 0;
    const startTime = Date.now();
    const duration = 2000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div className="text-center">
      <p className="font-mono text-4xl font-bold text-white md:text-5xl">
        {count}
        <span className="text-accent-cyan">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-white/70">{label}</p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="bg-teal px-4 py-16 text-white md:px-10 lg:px-16">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4"
      >
        {statsBarData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: [0.12, 0.23, 0.5, 1]
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <CountUpStat
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              inView={inView}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
