"use client";

import { motion } from "framer-motion";
import type { SearchTab } from "@/lib/searchTypes";
import {
  AirplaneTilt,
  Train,
  Bus,
  Buildings
} from "@phosphor-icons/react";

const tabs: { id: SearchTab; label: string; icon: typeof AirplaneTilt }[] = [
  { id: "flights", label: "Flights", icon: AirplaneTilt },
  { id: "trains", label: "Trains", icon: Train },
  { id: "buses", label: "Buses", icon: Bus },
  { id: "hotels", label: "Hotels", icon: Buildings }
];

interface SearchTabsProps {
  active: SearchTab;
  onChange: (tab: SearchTab) => void;
}

export function SearchTabs({ active, onChange }: SearchTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-white/[0.05] p-1">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "text-white" : "text-white/50 hover:text-white/70"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-teal"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={18} weight="duotone" />
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTabLine"
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent-cyan"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
