"use client";

import { motion } from "framer-motion";
import { SectionTag } from "./ui/SectionTag";
import { roadmapPhases } from "@/lib/data";

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  shipped: {
    bg: "bg-accent-green/15",
    text: "text-accent-green",
    border: "border-accent-green/30"
  },
  "in-progress": {
    bg: "bg-accent-amber/15",
    text: "text-accent-amber",
    border: "border-accent-amber/30"
  },
  planned: {
    bg: "bg-teal/15",
    text: "text-teal",
    border: "border-teal/30"
  },
  vision: {
    bg: "bg-white/10",
    text: "text-white/60",
    border: "border-white/20"
  }
};

export function Stories() {
  return (
    <section className="bg-surface-dark px-4 py-20 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div>
            <SectionTag className="border-white/20 bg-white/5 text-white/80">
              What&apos;s Next
            </SectionTag>
            <h2 className="mt-3 font-display text-2xl md:text-3xl">
              The Road Ahead
            </h2>
          </div>
          <p className="text-xs text-white/40">
            Scroll horizontally to see all phases →
          </p>
        </div>

        <div className="relative overflow-x-auto rounded-[28px] bg-code-bg p-4 md:p-6">
          <div
            className="flex w-max gap-5 snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {roadmapPhases.map((phase, index) => {
              const colors = statusColors[phase.status] || statusColors.vision;
              return (
                <motion.article
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.12, 0.23, 0.5, 1]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`flex h-[340px] w-[260px] shrink-0 snap-center flex-col justify-between rounded-card border p-5 ${colors.border} bg-white/[0.03]`}
                >
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}
                    >
                      {phase.title}
                    </span>
                    <h3 className="mt-4 font-display text-lg">{phase.phase}</h3>
                    <ul className="mt-4 space-y-2">
                      {phase.items.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className={item.done ? "text-accent-green" : "text-white/30"}>
                            {item.done ? "✓" : "○"}
                          </span>
                          <span className={item.done ? "text-white/90" : "text-white/50"}>
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
