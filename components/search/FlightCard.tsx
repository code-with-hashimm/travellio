"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FlightResult } from "@/lib/searchTypes";
import { generateProviderUrl, type ProviderUrlContext } from "@/lib/mappers";
import { PriceHistoryChart } from "./PriceHistoryChart";
import {
  CaretDown,
  Leaf,
  AirplaneTilt
} from "@phosphor-icons/react";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

interface FlightCardProps {
  flight: FlightResult;
  index: number;
  context?: ProviderUrlContext;
  isCheapest?: boolean;
}

function AirlineAvatar({ code, name }: { code: string; name: string }) {
  if (!code) {
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-cyan/20 font-mono text-xs font-bold text-white bg-teal"
        style={{ background: "linear-gradient(135deg, #033d4a, #0a4a5a)" }}
      >
        {name.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-cyan/20 overflow-hidden bg-white"
    >
      <img src={code} alt={name} className="h-full w-full object-contain" />
    </div>
  );
}

export function FlightCard({ flight, index, context = {}, isCheapest }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState(0);

  const toggleExpand = () => {
    if (expanded) {
      setExpanded(false);
      setActiveDetailTab(0); // reset to Flight Details on collapse
    } else {
      setExpanded(true);
    }
  };

  const detailTabs = ["Flight Details", "Fare Breakdown", "Price History"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.12, 0.23, 0.5, 1] }}
      className={`relative overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md ${
        isCheapest
          ? 'border-accent-cyan ring-1 ring-accent-cyan/20 shadow-lg shadow-accent-cyan/10'
          : flight.isAIBestPick
          ? 'border-teal/30 hover:border-teal/50'
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
      {/* Main row */}
      <button
        onClick={toggleExpand}
        className="group flex w-full items-center gap-4 px-5 py-5 text-left md:gap-6 md:px-6"
      >
        {/* Airline */}
        <div className="hidden shrink-0 flex-col items-center gap-1 md:flex">
          <AirlineAvatar code={flight.airlineLogo} name={flight.airline} />
          <span className="text-[11px] text-[#6b7280]">{flight.airline}</span>
          {(flight as any).isBestPrice && (
            <span className="mt-0.5 inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600 ring-1 ring-orange-400/40">
              🔥 Best
            </span>
          )}
        </div>

        {/* Departure */}
        <div className="shrink-0">
          <p className="font-mono text-lg font-bold text-[#0a0a0a]">{flight.departureTime}</p>
          <p className="text-xs text-[#6b7280]">{flight.departureCode}</p>
        </div>

        {/* Duration */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <span className="text-xs text-[#374151]">{flight.duration}</span>
          <div className="relative flex w-full items-center justify-center">
            <div className="h-px w-full border-t border-dashed border-[#d1d5db]" />
            <AirplaneTilt
              size={14}
              weight="fill"
              className="absolute text-teal"
            />
          </div>
          <span
            className={`text-[11px] font-medium ${
              flight.stops === 0 ? "text-[#10b981]" : "text-[#f59e0b]"
            }`}
          >
            {flight.stops === 0
              ? "Non-stop"
              : `${flight.stops} stop${flight.stops > 1 ? "s" : ""} · ${flight.stopCity}`}
          </span>
        </div>

        {/* Arrival */}
        <div className="shrink-0">
          <p className="font-mono text-lg font-bold text-[#0a0a0a]">{flight.arrivalTime}</p>
          <p className="text-xs text-[#6b7280]">{flight.arrivalCode}</p>
        </div>

        {/* CO₂ — desktop only */}
        {flight.co2 && (
          <div className="hidden shrink-0 flex-col items-center gap-0.5 lg:flex">
            <Leaf
              size={14}
              weight="duotone"
              className={
                flight.co2Level === "low"
                  ? "text-[#10b981]"
                  : flight.co2Level === "high"
                  ? "text-[#f59e0b]"
                  : "text-[#6b7280]"
              }
            />
            <span className="text-[10px] text-[#9ca3af]">CO₂</span>
            <span className="text-[10px] text-[#6b7280]">{flight.co2}</span>
          </div>
        )}

        {/* Price */}
        <div className="shrink-0 text-right">
          {flight.originalPrice > 0 && (
            <p className="font-mono text-xs text-[#9ca3af] line-through">
              ₹{fmt(flight.originalPrice)}
            </p>
          )}
          <p className="font-mono text-lg font-bold text-[#0a0a0a]">
            {flight.displayPrice || `₹${fmt(flight.price)}`}
          </p>
          {flight.savings > 0 && (
            <span className="inline-block rounded-full bg-[#dcfce7] px-[8px] py-[2px] text-[12px] font-semibold leading-tight text-[#16a34a]">
              Save {flight.savings}%
            </span>
          )}
          <p className="mt-0.5 text-[10px] text-[#6b7280]">per person</p>
        </div>

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#374151] transition-colors group-hover:bg-teal group-hover:text-white"
        >
          <CaretDown size={18} />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#e5e7eb] bg-[#f8fafc] px-5 py-5 md:px-6">
              {/* Tabs */}
              <div className="mb-5 flex gap-6 border-b border-[#e5e7eb]">
                {detailTabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(i)}
                    className={`pb-2.5 text-sm font-medium transition-colors ${
                      activeDetailTab === i
                        ? "border-b-2 border-teal text-teal-deep"
                        : "text-[#6b7280] hover:text-[#374151]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Flight Details */}
              {activeDetailTab === 0 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full border-2 border-teal bg-white" />
                      <div className="h-16 w-px bg-teal/30" />
                      <div className="h-3 w-3 rounded-full bg-teal" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-[#0a0a0a]">
                          {flight.departureTime} · {flight.departureName} ({flight.departureCode})
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          {flight.flightNumber} · {flight.aircraft}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0a0a0a]">
                          {flight.arrivalTime} · {flight.arrivalName} ({flight.arrivalCode})
                        </p>
                        <p className="text-xs text-[#6b7280]">Duration: {flight.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {flight.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-teal/[0.06] px-3 py-1 text-[11px] font-medium text-teal-deep"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fare Breakdown */}
              {activeDetailTab === 1 && (
                <div className="space-y-0 overflow-hidden rounded-xl border border-[#e5e7eb]">
                  {[
                    { label: "Base fare", value: flight.baseFare },
                    { label: "Taxes", value: flight.taxes },
                    { label: "Fees & surcharges", value: flight.fees }
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-b border-[#f3f4f6] bg-white px-4 py-3 last:border-0"
                    >
                      <span className="text-sm text-[#374151]">{row.label}</span>
                      <span className="font-mono text-sm text-[#0a0a0a]">
                        ₹{fmt(row.value)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-[#f8fafc] px-4 py-3 font-semibold">
                    <span className="text-sm text-[#0a0a0a]">Total</span>
                    <span className="font-mono text-sm text-[#0a0a0a]">
                      {flight.displayPrice || `₹${fmt(flight.price)}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Price History */}
              {activeDetailTab === 2 && flight.priceHistory?.length > 0 ? (
                <PriceHistoryChart
                  data={flight.priceHistory}
                  currentPrice={flight.price}
                />
              ) : activeDetailTab === 2 ? (
                <div className="py-8 text-center text-sm text-[#6b7280]">No price history available</div>
              ) : null}

              {/* Book button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => {
                    const url = generateProviderUrl(flight, context)
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                  className="rounded-full bg-teal px-8 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
