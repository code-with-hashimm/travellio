"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { faqsLeft, faqsRight } from "@/lib/data";
import { SectionTag } from "./ui/SectionTag";
import { Plus, X } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.12, 0.23, 0.5, 1]
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="overflow-hidden rounded-card border border-black/20 bg-white shadow-sm"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-body">
          {question}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
          <motion.span
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </motion.span>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.12, 0.23, 0.5, 1] }}
        className="px-5 pb-4 text-sm text-gray-muted"
      >
        {answer}
      </motion.div>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section
      id="faq"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="bg-cream/80">FAQs</SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            Got Questions? We&apos;ve Got Answers
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            {faqsLeft.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
          <div className="space-y-4">
            {faqsRight.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index + faqsLeft.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
