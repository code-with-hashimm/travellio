"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 shadow-sm",
  secondary:
    "bg-teal text-white hover:bg-teal/90",
  dark:
    "bg-black text-white hover:bg-black/90 border border-white/10",
  ghost:
    "bg-white/5 text-white hover:bg-white/10 border border-white/10"
};

export function Button({
  children,
  variant = "primary",
  className = "",
  onClick
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-pill px-6 py-3 text-sm font-medium tracking-tight ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

