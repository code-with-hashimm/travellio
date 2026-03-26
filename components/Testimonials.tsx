"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/lib/data";

const stars = "★★★★★".split("");

export function Testimonials() {
  const [activeId, setActiveId] = useState(testimonials[0]?.id);
  const active = testimonials.find((t) => t.id === activeId) ?? testimonials[0];

  return (
    <section className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative overflow-hidden rounded-[32px] bg-black text-white"
        >
          <motion.div
            key={active.id}
            initial={{ scale: 1.13 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 3, ease: [0.12, 0.23, 0.5, 1] }}
            viewport={{ once: false, margin: "-50px" }}
            className="absolute inset-0"
          >
            <Image
              src={active.image}
              alt={active.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          </motion.div>

          <div className="relative z-10 flex flex-col justify-between gap-10 px-6 pb-6 pt-10 md:px-10 md:pb-10 md:pt-16">
            <div className="space-y-4 md:max-w-xl">
              <div className="flex gap-1 text-lg text-yellow-300">
                {stars.map((s, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.08,
                      duration: 0.4,
                      ease: [0.12, 0.23, 0.5, 1]
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
              <p className="font-display text-xl md:text-2xl">
                &ldquo;{active.quote}&rdquo;
              </p>
              <p className="text-sm text-white/80">
                — {active.name}, {active.role}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {testimonials.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className="group flex items-center gap-3"
                  >
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal to-accent-cyan transition-all duration-300 ${
                        isActive
                          ? "ring-2 ring-white brightness-100"
                          : "ring-0 brightness-75 group-hover:brightness-95"
                      }`}
                    >
                      <span className="font-display text-lg text-white">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left text-xs text-white/80">
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-[11px] text-white/70">{t.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
