"use client";

import { Faders } from "@phosphor-icons/react";
import type { SearchTab } from "@/lib/searchTypes";
import { FilterSidebarContent } from "./FilterSidebarContent";

export interface FilterState {
  stops: string;
  priceMin: number;
  priceMax: number;
  departureTimes: string[];
  arrivalTimes: string[];
  selectedAirlines: string[];
  maxDuration: number;
  cabinBag: boolean;
  checkedBag: boolean;
  hotelStars: number[];
  hotelAmenities: string[];
}

interface FilterSidebarProps {
  tab: SearchTab;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export function FilterSidebar({ tab, filters, onFiltersChange }: FilterSidebarProps) {
  const activeCount =
    (filters.stops !== "any" ? 1 : 0) +
    filters.departureTimes.length +
    filters.arrivalTimes.length +
    filters.selectedAirlines.length +
    (filters.cabinBag ? 1 : 0) +
    (filters.checkedBag ? 1 : 0) +
    filters.hotelStars.length +
    filters.hotelAmenities.length;

  const clearAll = () =>
    onFiltersChange({
      stops: "any",
      priceMin: 0,
      priceMax: 50000,
      departureTimes: [],
      arrivalTimes: [],
      selectedAirlines: [],
      maxDuration: 24,
      cabinBag: false,
      checkedBag: false,
      hotelStars: [],
      hotelAmenities: []
    });

  return (
    <div className="sticky top-[180px] hidden w-[280px] shrink-0 self-start overflow-y-auto rounded-2xl border-r border-[#e5e7eb] bg-white p-5 lg:block">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Faders size={18} className="text-teal" />
          <span className="font-display text-sm text-[#0a0a0a]">Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-accent-cyan hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSidebarContent
        tab={tab}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
}
