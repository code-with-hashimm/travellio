"use client";

import { motion } from "framer-motion";
import { SectionTag } from "./ui/SectionTag";
import { productFeatures } from "@/lib/data";

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <SectionTag className="bg-cream/80">
            Why Travel Deal Hunter
          </SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            Built Different. Searches Smarter.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-muted">
            Everything you need to find the perfect deal, powered by AI.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-card border border-gray-border/40 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-2xl">
                {feature.icon}
              </div>
              <h3 className="font-display text-base text-teal-deep">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-muted">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
