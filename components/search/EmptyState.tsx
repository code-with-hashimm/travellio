"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
        <MagnifyingGlass size={36} weight="duotone" className="text-teal" />
      </div>
      <h3 className="font-display text-xl text-[#0a0a0a]">
        No deals found for this route
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[#6b7280]">
        Try adjusting your dates or nearby airports for better results.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="rounded-full border border-teal px-5 py-2.5 text-sm font-medium text-teal transition-colors hover:bg-teal/5">
          Try nearby airports
        </button>
        <button className="rounded-full border border-teal px-5 py-2.5 text-sm font-medium text-teal transition-colors hover:bg-teal/5">
          Check flexible dates
        </button>
      </div>
    </div>
  );
}
