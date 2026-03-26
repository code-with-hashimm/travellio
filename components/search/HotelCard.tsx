"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { HotelResult } from "@/lib/searchTypes";
import { generateProviderUrl, type ProviderUrlContext } from "@/lib/mappers";
import {
  Star,
  MapPin,
  WifiHigh,
  Drop,
  Coffee,
  Barbell,
  Car,
  PawPrint
} from "@phosphor-icons/react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

const amenityIcons: Record<string, typeof WifiHigh> = {
  WiFi: WifiHigh,
  Pool: Drop,
  Breakfast: Coffee,
  Gym: Barbell,
  Parking: Car,
  "Pet Friendly": PawPrint
};

interface HotelCardProps {
  hotel  : HotelResult;
  index  : number;
  context?: ProviderUrlContext;
  isCheapest?: boolean;
}

export function HotelCard({ hotel, index, context = {}, isCheapest }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.12, 0.23, 0.5, 1] }}
      className={`group flex flex-col relative overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md md:flex-row ${
        isCheapest
          ? 'border-accent-cyan ring-1 ring-accent-cyan/20 shadow-lg shadow-accent-cyan/10'
          : 'border-[#e5e7eb] hover:border-teal/20'
      }`}
    >
      {isCheapest && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-accent-cyan px-4 py-1.5 rounded-bl-xl shadow-lg">
            <span className="text-[11px] font-black uppercase tracking-widest text-black flex items-center gap-1.5">
              <span className="text-sm">🔥</span> Best Value
            </span>
          </div>
        </div>
      )}
      {/* Image */}
      <div className="relative h-48 w-full shrink-0 md:h-auto md:w-[200px] bg-slate-100">
        <Image
          src={hotel.image || "https://placehold.co/400x300?text=Hotel"}
          alt={hotel.name}
          fill
          className="object-cover"
        />
        {hotel.freeCancellation && (
          <span className="absolute left-3 top-3 rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-semibold text-[#16a34a]">
            Free cancellation
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-base text-[#0a0a0a]">{hotel.name}</h3>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} size={12} weight="fill" className="text-[#f59e0b]" />
                ))}
                <span className="ml-2 text-xs text-[#6b7280]">
                  {hotel.reviewScore}/10 · {hotel.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <MapPin size={14} weight="duotone" className="text-teal" />
            <span className="text-xs text-[#374151]">{hotel.location}</span>
          </div>
          <div className="mt-3 flex gap-2">
            {hotel.amenities.map((a) => {
              const Icon = amenityIcons[a];
              return Icon ? (
                <Icon key={a} size={16} weight="duotone" className="text-teal" />
              ) : null;
            })}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-end justify-between border-t border-[#f3f4f6] pt-3">
          <div>
            {hotel.originalPrice > 0 && (
              <p className="font-mono text-xs text-[#9ca3af] line-through">₹{fmt(hotel.originalPrice)}</p>
            )}
            <p className="font-mono text-lg font-bold text-[#0a0a0a]">
              {hotel.displayPrice || `₹${fmt(hotel.price)}`}
            </p>
            <span className="text-[10px] text-[#6b7280]">per night</span>
          </div>
          <div className="flex items-center gap-2">
            {hotel.savings > 0 && (
              <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">
                Save {hotel.savings}%
              </span>
            )}
            <button
              onClick={() => {
                const url = generateProviderUrl(hotel, context)
                window.open(url, '_blank', 'noopener,noreferrer')
              }}
              className="rounded-full bg-teal px-6 py-2 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
