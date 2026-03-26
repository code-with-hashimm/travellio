"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTag } from "./ui/SectionTag";
import { teamMembers } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";

const badgeColors: Record<string, string> = {
  cyan: "bg-accent-cyan/20 text-accent-cyan",
  blue: "bg-blue-500/20 text-blue-400",
  amber: "bg-accent-amber/20 text-accent-amber",
  teal: "bg-teal/30 text-emerald-400",
  purple: "bg-purple-500/20 text-purple-400"
};

export function Blogs() {
  return (
    <section
      id="team"
      className="bg-white px-4 py-20 text-gray-body md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionTag className="bg-cream/80">The Builders</SectionTag>
          <h2 className="mt-4 font-display text-3xl text-teal-deep md:text-4xl">
            Meet the Hunters
          </h2>
          <p className="mt-2 text-sm text-gray-muted">
            Built at TinyFish Hackathon 🐟
          </p>
        </div>

        <div className="mt-10 grid justify-center gap-6 sm:grid-cols-2 lg:max-w-2xl lg:mx-auto">
          {teamMembers.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: [0.12, 0.23, 0.5, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="overflow-hidden rounded-card border border-gray-border/60 bg-white p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Profile photo */}
              {member.photo ? (
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-gray-border/40">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal to-accent-cyan">
                  <span className="font-display text-2xl text-white">
                    {member.initials}
                  </span>
                </div>
              )}
              <h3 className="mt-4 font-display text-lg text-teal-deep">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-gray-muted">{member.role}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  badgeColors[member.badgeColor] || badgeColors.cyan
                }`}
              >
                {member.badge}
              </span>
              <div className="mt-4 flex justify-center gap-3">
                <a
                  href={member.github}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-body/5 text-gray-muted transition-colors hover:bg-gray-body/10 hover:text-gray-body"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href={member.linkedin}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-body/5 text-gray-muted transition-colors hover:bg-gray-body/10 hover:text-gray-body"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center font-display text-sm text-gray-muted">
          Made with ❤️ at TinyFish Hackathon
        </p>
      </div>
    </section>
  );
}
