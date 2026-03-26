"use client";

import { motion } from "framer-motion";
import { TrendUp, MagnifyingGlass, CheckCircle } from "@phosphor-icons/react";

interface SavingsSummaryProps {
  averagePrice: number;
  minPrice: number;
  savings: number;
  savingsPercentage: number;
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(Math.round(n));

export function SavingsSummary({ averagePrice, minPrice, savings, savingsPercentage }: SavingsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-1 md:p-1.5"
    >
      <div className="flex flex-col md:flex-row items-stretch gap-1">
        {/* Average Market Price */}
        <div className="flex-1 rounded-xl bg-white/60 px-4 py-4 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average Market Price</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-xl font-medium text-slate-400 line-through">₹{fmt(averagePrice)}</span>
            <span className="text-[10px] text-slate-400 font-medium">Expected</span>
          </div>
        </div>

        {/* TinyFish Best Deal */}
        <div className="flex-1 rounded-xl bg-white/80 px-4 py-4 backdrop-blur-sm border border-emerald-500/10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-1 -right-1">
            <div className="bg-emerald-500/10 p-2 rounded-full">
              <CheckCircle size={16} weight="fill" className="text-emerald-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">TinyFish Best Deal</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-emerald-600">₹{fmt(minPrice)}</span>
            <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded font-bold text-emerald-700">WINNER</span>
          </div>
        </div>

        {/* Total Savings */}
        <div className="flex-1 rounded-xl bg-emerald-500 px-4 py-4 shadow-lg shadow-emerald-500/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-50/80">Total Savings</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold text-white">₹{fmt(savings)} <span className="text-sm font-medium text-emerald-100">({fmt(savingsPercentage)}%)</span></span>
            <span className="text-lg">🎉</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={12} weight="bold" className="text-emerald-600" />
          <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-tighter">Scanned 15+ sources in 45 seconds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendUp size={12} weight="bold" className="text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter italic">Found {fmt(savingsPercentage)}% lower than average</span>
        </div>
      </div>
    </motion.div>
  );
}
