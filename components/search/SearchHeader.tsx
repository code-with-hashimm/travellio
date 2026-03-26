"use client";

import { motion } from "framer-motion";
import type { SearchTab } from "@/lib/searchTypes";
import { SearchTabs } from "./SearchTabs";
import { SearchForm } from "./SearchForm";

interface SearchHeaderProps {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
  onSearch: () => void;
  isLoading: boolean;
  formValues: {
    type: string;
    from: string;
    to: string;
    date: string;
    adults: string;
    cabinClass: string;
  };
  onFormChange: (updater: (prev: any) => any) => void;
  error: string | null;
  isAnyAgentRunning: boolean;
}

export function SearchHeader({
  activeTab,
  onTabChange,
  onSearch,
  isLoading,
  formValues,
  onFormChange,
  error,
  isAnyAgentRunning
}: SearchHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.12, 0.23, 0.5, 1] }}
      className="sticky top-0 z-40 border-b border-white/[0.08] bg-surface-dark/95 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        {/* Tabs */}
        <div className="mb-4 flex items-center gap-4">
          <SearchTabs active={activeTab} onChange={onTabChange} />
        </div>

        {/* Form */}
        <SearchForm 
          activeTab={activeTab} 
          onSearch={onSearch} 
          isLoading={isLoading}
          isAnyAgentRunning={isAnyAgentRunning}
          formValues={formValues}
          onFormChange={onFormChange}
          error={error}
        />
      </div>
    </motion.div>
  );
}
