"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTag } from "./ui/SectionTag";
import { experienceCards } from "@/lib/data";

export function Experience() {
  return (
    <section
      id="experience"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="bg-cream/80">What We Hunt</SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            Every Type of Deal, Found Instantly
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experienceCards.map((card, index) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={`flex flex-col overflow-hidden rounded-card bg-teal-deep text-white shadow-lg ${
                card.alignment === "bottom" ? "md:mt-10" : ""
              }`}
            >
              <div
                className={`relative ${
                  card.alignment === "top" ? "h-64" : "h-56 md:h-64"
                }`}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={`object-cover ${
                    card.alignment === "bottom"
                      ? "translate-y-6 md:translate-y-10"
                      : ""
                  }`}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                    {card.location}
                  </p>
                  <h3 className="mt-2 font-display text-xl">{card.title}</h3>
                </div>
                <p className="mt-3 text-sm text-white/70">
                  {card.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
