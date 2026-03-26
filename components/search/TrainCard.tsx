"use client";

import { motion } from "framer-motion";
import type { TrainResult, ClassAvailability } from "@/lib/searchTypes";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

const statusStyles: Record<ClassAvailability, string> = {
  available: "bg-[#dcfce7] text-[#16a34a]",
  waitlist: "bg-[#fef3c7] text-[#d97706]",
  full: "bg-[#fee2e2] text-[#dc2626]"
};

const statusLabels: Record<ClassAvailability, string> = {
  available: "Available",
  waitlist: "Waitlist",
  full: "Full"
};

interface TrainCardProps {
  train: TrainResult;
  index: number;
  isCheapest?: boolean;
}

export function TrainCard({ train, index, isCheapest }: TrainCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.12, 0.23, 0.5, 1] }}
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md md:p-6 ${
        isCheapest
          ? 'border-accent-cyan ring-1 ring-accent-cyan/20 shadow-lg shadow-accent-cyan/10'
          : 'border-[#e5e7eb] hover:border-teal/20'
      }`}
    >
      {isCheapest && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-accent-cyan px-4 py-1.5 rounded-bl-xl shadow-lg">
            <span className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-1.5">
              <span className="text-sm">🔥</span> Cheapest
            </span>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base text-[#0a0a0a]">
            {train.trainName}
          </h3>
          <span className="font-mono text-xs text-[#6b7280]">#{train.trainNumber}</span>
        </div>
        <span className="text-xs text-[#374151]">{train.duration}</span>
      </div>

      {/* Journey */}
      <div className="flex items-center gap-4">
        <div>
          <p className="font-mono text-lg font-bold text-[#0a0a0a]">{train.departureTime}</p>
          <p className="text-xs text-[#6b7280]">{train.departureCode}</p>
          <p className="max-w-[120px] truncate text-[11px] text-[#6b7280]">{train.departureStation}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="h-px w-full border-t border-dashed border-[#d1d5db]" />
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <p className="font-mono text-lg font-bold text-[#0a0a0a]">{train.arrivalTime}</p>
            {train.dayChange > 0 && (
              <span className="rounded bg-[#fef3c7] px-1 py-0.5 text-[10px] font-semibold text-[#d97706]">
                +{train.dayChange}
              </span>
            )}
          </div>
          <p className="text-xs text-[#6b7280]">{train.arrivalCode}</p>
          <p className="max-w-[120px] truncate text-[11px] text-[#6b7280]">{train.arrivalStation}</p>
        </div>
      </div>

      {/* Class pills / Pricing Grid */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {train.classes.map((cls) => (
          <div
            key={cls.name}
            className="flex flex-col items-center rounded-xl bg-gray-50 py-2.5 transition-colors hover:bg-teal/5"
          >
            <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
              {cls.name === 'SL' ? 'Sleeper' : 
               cls.name === '3A' ? '3rd AC' : 
               cls.name === '2A' ? '2nd AC' : 
               cls.name === '1A' ? '1st AC' : cls.name}
            </span>
            <span className="font-mono text-sm font-bold text-[#0a0a0a]">
              {cls.displayPrice || `₹${fmt(cls.price)}`}
            </span>
            {cls.availability && (
               <span className={`mt-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase ${statusStyles[cls.availability]}`}>
                 {statusLabels[cls.availability]}
               </span>
            )}
          </div>
        ))}
      </div>

      {/* Book */}
      <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
        <a 
          href={train.bookingUrl || `https://www.google.com/search?q=book+train+${train.trainNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-teal-hover hover:shadow-teal/20"
        >
          Book Now
        </a>
      </div>
    </motion.div>
  );
}
