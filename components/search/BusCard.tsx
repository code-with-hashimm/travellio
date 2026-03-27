"use client";

import { motion } from "framer-motion";
import type { BusResult } from "@/lib/searchTypes";
import { generateProviderUrl, type ProviderUrlContext } from "@/lib/mappers";
import { Star, WifiHigh, Lightning, Bed } from "@phosphor-icons/react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

const amenityIcons: Record<string, typeof WifiHigh> = {
  WiFi: WifiHigh,
  Charging: Lightning,
  Blanket: Bed
};

interface BusCardProps {
  bus    : BusResult;
  index  : number;
  context?: ProviderUrlContext;
  isCheapest?: boolean;
}

export function BusCard({ bus, index, context = {}, isCheapest }: BusCardProps) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left — operator and times */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-base text-[#0a0a0a]">
              {bus.operatorName}
              {bus.source && (
                <span className="ml-2 inline-flex items-center rounded-md bg-[#f3f4f6] px-1.5 py-0.5 text-[9px] font-bold text-[#4b5563] ring-1 ring-inset ring-gray-500/10 whitespace-nowrap">
                  {bus.source}
                </span>
              )}
            </h3>
            <span className="text-xs text-[#6b7280]">{bus.busType}</span>
            {(bus as any).isBestPrice && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 ring-1 ring-orange-400/40">
                🔥 Best Price
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="font-mono text-lg font-bold text-[#0a0a0a]">{bus.departureTime}</p>
              <p className="max-w-[140px] truncate text-xs text-[#6b7280]">{bus.departurePoint}</p>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <span className="text-xs text-[#374151]">{bus.duration}</span>
              <div className="mt-1 h-px w-full border-t border-dashed border-[#d1d5db]" />
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-[#0a0a0a]">{bus.arrivalTime}</p>
              <p className="max-w-[140px] truncate text-xs text-[#6b7280]">{bus.arrivalPoint}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={12} weight="fill" className="text-[#f59e0b]" />
              <span className="text-xs font-semibold text-[#374151]">{bus.rating}</span>
              <span className="text-[10px] text-[#6b7280]">({bus.reviews.toLocaleString("en-IN")})</span>
            </div>
            <div className="flex gap-2">
              {bus.amenities.map((a) => {
                const Icon = amenityIcons[a];
                return Icon ? (
                  <Icon key={a} size={14} weight="duotone" className="text-teal" />
                ) : (
                  <span key={a} className="text-[10px] text-teal">{a}</span>
                );
              })}
            </div>
            {bus.seatsLeft <= 10 && (
              <span className="text-[10px] font-medium text-[#dc2626]">
                {bus.seatsLeft} seats left
              </span>
            )}
          </div>
        </div>

        {/* Right — price */}
        <div className="flex items-center gap-4 border-t border-[#f3f4f6] pt-3 md:flex-col md:items-end md:border-t-0 md:pt-0">
          <div className="text-right">
            {bus.originalPrice > 0 && (
              <p className="font-mono text-xs text-[#9ca3af] line-through">₹{fmt(bus.originalPrice)}</p>
            )}
            <p className="font-mono text-lg font-bold text-[#0a0a0a]">{bus.displayPrice || `₹${fmt(bus.price)}`}</p>
            {bus.savings > 0 && (
              <span className="inline-block rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">
                Save {bus.savings}%
              </span>
            )}
          </div>
          <button
            onClick={() => {
              const url = generateProviderUrl(bus, context)
              window.open(url, '_blank', 'noopener,noreferrer')
            }}
            className="rounded-full bg-teal px-6 py-2 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
