"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);
import { SectionTag } from "./ui/SectionTag";
import { tours } from "@/lib/data";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function Tours() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <section
      id="tours"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="bg-cream/80">AI-Curated Deals</SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            Deals Our AI Found Today
          </h2>
          <p className="mt-2 text-sm text-gray-muted">
            Updated every 15 minutes · Prices may change
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour, index) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group overflow-hidden rounded-card bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[0.76]">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex rounded-pill bg-accent-amber/90 px-4 py-1 text-xs font-medium text-black">
                  {tour.durationLabel}
                </div>
              </div>
              <div className="space-y-3 px-5 pb-5 pt-4">
                <h3 className="font-display text-lg text-teal-deep">
                  {tour.name}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-gray-muted line-through">
                      ₹{fmt(tour.originalPrice)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-gray-body">
                      ₹{fmt(tour.price)}
                    </span>
                    <span className="text-xs text-gray-muted">/ Per Person</span>
                  </div>
                  <span className="inline-block rounded-full bg-accent-green/15 px-2 py-0.5 font-mono text-xs font-semibold text-green-600">
                    Save {tour.savings}%
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <motion.button
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium tracking-tight text-gray-body hover:bg-white/10"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "🔄 Refresh Deals"}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
