"use client";

import { motion } from "framer-motion";
import { SectionTag } from "./ui/SectionTag";
import { techStackItems } from "@/lib/data";

export function TechStack() {
  return (
    <section className="relative bg-surface-dark px-4 py-24 text-white md:px-10 lg:px-16">
      <div className="dot-grid absolute inset-0" />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="border-white/20 bg-white/5 text-white/80">
            Under The Hood
          </SectionTag>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Built With
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techStackItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group rounded-card border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-cyan-glow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl grayscale transition-all duration-300 group-hover:grayscale-0">
                {item.logo}
              </div>
              <h3 className="font-display text-lg">{item.name}</h3>
              <p className="mt-1 text-sm text-white/60">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
