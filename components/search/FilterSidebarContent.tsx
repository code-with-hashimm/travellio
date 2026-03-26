"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const allAirlines: any[] = [];
import type { SearchTab } from "@/lib/searchTypes";
import type { FilterState } from "./FilterSidebar";

function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: number[]) => void;
}) {
  return (
    <Slider
      range
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(v) => onChange(v as number[])}
      styles={{
        track: { backgroundColor: "#033d4a", height: 4 },
        handle: {
          backgroundColor: "#00d4ff",
          borderColor: "#033d4a",
          height: 16,
          width: 16,
          marginTop: -6,
          opacity: 1,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        },
        rail: { backgroundColor: "#e5e7eb", height: 4 }
      }}
    />
  );
}

const timeBlocks = [
  { id: "early", label: "Early Morning", range: "00-06" },
  { id: "morning", label: "Morning", range: "06-12" },
  { id: "afternoon", label: "Afternoon", range: "12-18" },
  { id: "evening", label: "Evening", range: "18-00" }
];

function FilterGroup({
  title,
  defaultOpen = true,
  children
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f3f4f6] py-4 first:pt-0 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-[#374151]"
      >
        <span className="font-display">{title}</span>
        <CaretDown
          size={14}
          className={`text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

interface FilterSidebarContentProps {
  tab: SearchTab;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export function FilterSidebarContent({ tab, filters, onFiltersChange }: FilterSidebarContentProps) {
  const update = (partial: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...partial });

  return (
    <div>
      {/* STOPS */}
      {tab !== "hotels" && (
        <FilterGroup title="Stops">
          <div className="space-y-2">
            {["any", "0", "1", "2"].map((val) => (
              <label key={val} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="stops-mobile"
                  checked={filters.stops === val}
                  onChange={() => update({ stops: val })}
                  className="h-4 w-4 border-[#e5e7eb] text-teal accent-teal"
                />
                <span className="text-sm text-[#374151]">
                  {val === "any" ? "Any" : val === "0" ? "Non-stop" : val === "1" ? "1 Stop" : "2+ Stops"}
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* PRICE RANGE */}
      <FilterGroup title="Price Range">
        <div className="space-y-3">
          <DualRangeSlider
            min={0}
            max={50000}
            step={500}
            value={[filters.priceMin, filters.priceMax]}
            onChange={([min, max]: number[]) => update({ priceMin: min, priceMax: max })}
          />
          <div className="flex items-center justify-between font-mono text-xs text-[#0a0a0a]">
            <span>₹{new Intl.NumberFormat("en-IN").format(filters.priceMin)}</span>
            <span>₹{new Intl.NumberFormat("en-IN").format(filters.priceMax)}</span>
          </div>
        </div>
      </FilterGroup>

      {/* DEPARTURE TIME */}
      {tab !== "hotels" && (
        <FilterGroup title="Departure Time">
          <div className="grid grid-cols-2 gap-2">
            {timeBlocks.map((b) => {
              const active = filters.departureTimes.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() =>
                    update({
                      departureTimes: active
                        ? filters.departureTimes.filter((t) => t !== b.id)
                        : [...filters.departureTimes, b.id]
                    })
                  }
                  className={`rounded-lg border px-2 py-2 text-center text-xs transition-colors ${active
                    ? "border-teal bg-teal text-white"
                    : "border-[#e5e7eb] bg-[#f9fafb] text-[#374151] hover:bg-[#f3f4f6]"
                    }`}
                >
                  <div className="font-medium">{b.label}</div>
                  <div className="text-[10px] opacity-70">{b.range}</div>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {/* AIRLINES */}
      {tab === "flights" && (
        <FilterGroup title="Airlines">
          <div className="space-y-2">
            {allAirlines.map((airline: any) => (
              <label key={airline.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.selectedAirlines.includes(airline.id)}
                  onChange={() =>
                    update({
                      selectedAirlines: filters.selectedAirlines.includes(airline.id)
                        ? filters.selectedAirlines.filter((a) => a !== airline.id)
                        : [...filters.selectedAirlines, airline.id]
                    })
                  }
                  className="h-4 w-4 rounded border-[#e5e7eb] text-teal accent-teal"
                />
                {airline.logo && (
                  <img src={airline.logo} alt={airline.name} className="h-4 w-4 object-contain" />
                )}
                <span className="text-sm text-[#374151]">{airline.name}</span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* HOTEL RATING */}
      {tab === "hotels" && (
        <FilterGroup title="Hotel Rating">
          <div className="flex gap-2">
            {[3, 4, 5].map((star) => {
              const active = filters.hotelStars.includes(star);
              return (
                <button
                  key={star}
                  onClick={() =>
                    update({
                      hotelStars: active
                        ? filters.hotelStars.filter((s) => s !== star)
                        : [...filters.hotelStars, star]
                    })
                  }
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${active
                    ? "bg-teal text-white"
                    : "bg-[#f9fafb] text-[#374151] hover:bg-[#f3f4f6]"
                    }`}
                >
                  {star} Stars
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
    </div>
  );
}
