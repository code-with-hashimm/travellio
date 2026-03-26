"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SectionTag } from "./ui/SectionTag";
import { destinationBackgrounds } from "@/lib/data";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Destinations() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const total = destinationBackgrounds.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const goTo = (i: number) => setCurrent(i);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const dest = destinationBackgrounds[current];

  return (
    <section id="destinations" className="bg-black py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <div className="text-center">
          <SectionTag className="bg-white/10 border-white/20 text-white">
            Destinations We Cover
          </SectionTag>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Deals for the World&apos;s Most Searched Routes
          </h2>
        </div>

        {/* Slider */}
        <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-neutral-900/60 shadow-2xl">
          {/* Background image */}
          <div className="relative h-[420px] md:h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
              </motion.div>
            </AnimatePresence>

            {/* Content overlay */}
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
                >
                  <span className="inline-block rounded-full bg-accent-amber/20 px-3 py-1 text-xs font-medium text-accent-amber">
                    {dest.badge}
                  </span>
                  <h3 className="mt-3 font-display text-3xl md:text-4xl">
                    {dest.name}
                  </h3>
                  <p className="mt-2 font-mono text-xl font-bold text-accent-cyan md:text-2xl">
                    {dest.title}
                  </p>
                  <button 
                    onClick={() => router.push(`/search?to=${encodeURIComponent(dest.name)}`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-pill bg-accent-cyan px-6 py-2.5 text-sm font-semibold text-black transition-shadow hover:shadow-cyan-glow"
                  >
                    Hunt This Deal
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {destinationBackgrounds.map((d, i) => (
              <button
                key={d.id}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-accent-cyan"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-16 border-y border-white/10 bg-black/90 py-4">
        <div className="overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex min-w-full gap-10 font-display text-3xl uppercase tracking-tight text-white"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <span key={idx} className="flex gap-8">
                <span>Mumbai</span>
                <span>•</span>
                <span>Delhi</span>
                <span>•</span>
                <span>Dubai</span>
                <span>•</span>
                <span>Bangkok</span>
                <span>•</span>
                <span>Singapore</span>
                <span>•</span>
                <span>Bali</span>
                <span>•</span>
                <span>London</span>
                <span>•</span>
                <span>Paris</span>
                <span>•</span>
                <span>New York</span>
                <span>•</span>
                <span>Tokyo</span>
                <span>•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
