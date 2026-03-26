"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Faders, X } from "@phosphor-icons/react";
import type { SearchTab } from "@/lib/searchTypes";
import type { FilterState } from "./FilterSidebar";
import { FilterSidebarContent } from "./FilterSidebarContent";

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  tab: SearchTab;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

export function FilterBottomSheet({
  open,
  onClose,
  tab,
  filters,
  onFiltersChange
}: FilterBottomSheetProps) {
  // Scroll lock — feedback point #8
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Floating trigger — only on mobile when sheet is closed */}
      {!open && (
        <button
          onClick={() => onClose()}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(3,61,74,0.4)] lg:hidden"
        >
          <Faders size={18} weight="bold" />
          Filters · Sort
        </button>
      )}

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-4 lg:hidden"
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#e5e7eb]" />

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-base text-[#0a0a0a]">Filters</span>
                <button onClick={onClose}>
                  <X size={20} className="text-[#6b7280]" />
                </button>
              </div>

              <FilterSidebarContent
                tab={tab}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />

              <button
                onClick={onClose}
                className="mt-6 w-full rounded-full bg-teal py-3 text-sm font-semibold text-white"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
