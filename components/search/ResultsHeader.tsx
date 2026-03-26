"use client";

import { List, SquaresFour } from "@phosphor-icons/react";
import type { SearchTab } from "@/lib/searchTypes";

interface ResultsHeaderProps {
  tab: SearchTab;
  count: number;
  route: string;
  date: string;

  view: "list" | "grid";
  onViewChange: (v: "list" | "grid") => void;
}

export function ResultsHeader({
  count,
  route,
  date,

  view,
  onViewChange
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-0">
      <div>
        <h2 className="font-display text-base text-[#0a0a0a]">
          {count} results for {route} · {date}
        </h2>
        <p className="text-xs text-[#6b7280]">
          Prices updated 2 mins ago
        </p>
      </div>
      <div className="flex items-center gap-2">

        <div className="flex overflow-hidden rounded-lg border border-[#e5e7eb]">
          <button
            onClick={() => onViewChange("list")}
            className={`flex h-9 w-9 items-center justify-center transition-colors ${
              view === "list" ? "bg-teal text-white" : "bg-[#f3f4f6] text-[#6b7280]"
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={`flex h-9 w-9 items-center justify-center transition-colors ${
              view === "grid" ? "bg-teal text-white" : "bg-[#f3f4f6] text-[#6b7280]"
            }`}
          >
            <SquaresFour size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
