"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Compass } from "lucide-react";
import { SectionTag } from "./ui/SectionTag";
import { Button } from "./ui/Button";
import { aboutImage } from "@/lib/data";
import { useRouter } from "next/navigation";

export function About() {
  const router = useRouter();
  return (
    <section
      id="about"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16 overflow-hidden"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left / Top - Image */}
        <motion.div
           initial={{ opacity: 0, x: -40, scale: 0.95 }}
           whileInView={{ opacity: 1, x: 0, scale: 1 }}
           transition={{ duration: 0.6, ease: [0.12, 0.23, 0.5, 1] }}
           viewport={{ once: true, margin: "-50px" }}
           className="relative aspect-video w-full max-h-[500px] overflow-hidden rounded-3xl bg-cream shadow-xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80"
            alt="Traveler with phone looking at a map"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Right / Bottom - Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.12, 0.23, 0.5, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <SectionTag
            icon={<Compass className="h-3.5 w-3.5" />}
            className="bg-cream/80 text-teal-deep font-semibold"
          >
            Our Story
          </SectionTag>
          <h2 className="font-display text-3xl leading-tight text-teal-deep md:text-[40px]">
            We Built the Tool We Always Needed
          </h2>
          <p className="text-lg leading-relaxed text-gray-muted">
            Every traveler knows the feeling — you book a flight then see it
            cheaper the next day. <span className="text-teal-deep font-medium">Travellio</span> uses AI to scan 500+
            platforms in real-time so that never happens again. Our mission is to democratize elite travel intelligence for everyone.
          </p>
          <div className="pt-2">
            <Button 
              onClick={() => router.push('/search')}
              variant="secondary" 
              className="px-8 py-3.5 text-sm font-bold shadow-lg shadow-teal/10 hover:shadow-teal/20 transition-all active:scale-95"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
