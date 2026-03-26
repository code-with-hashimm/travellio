"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Compass } from "lucide-react";
import { SectionTag } from "./ui/SectionTag";
import { Button } from "./ui/Button";
import { aboutImage } from "@/lib/data";

export function About() {
  return (
    <section
      id="about"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:items-stretch">
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex-1 space-y-6"
        >
          <SectionTag
            icon={<Compass className="h-3 w-3" />}
            className="bg-cream/80"
          >
            Our Story
          </SectionTag>
          <h2 className="font-display text-3xl text-teal-deep md:text-[36px]">
            We Built the Tool We Always Needed
          </h2>
          <p className="text-base leading-relaxed text-gray-muted">
            Every traveler knows the feeling — you book a flight then see it
            cheaper the next day. Travel Deal Hunter uses AI to scan 500+
            platforms in real-time so that never happens again.
          </p>
          <Button variant="secondary" className="mt-2 px-7 py-3 text-sm">
            See How It Works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex-1"
        >
          <div className="relative mx-auto aspect-[0.72] w-full max-w-md overflow-hidden rounded-card bg-cream shadow-lg">
            <Image
              src={aboutImage}
              alt="Dark server room technology infrastructure"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
