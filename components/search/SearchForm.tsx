"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { SearchTab } from "@/lib/searchTypes";
import {
  AirplaneTakeoff,
  AirplaneLanding,
  CalendarBlank,
  UserCircle,
  Crosshair,
  ArrowsClockwise,
  Bed,
  TrainSimple,
  Bus as BusIcon,
  CircleNotch,
  Minus,
  Plus,
  MapPin,
  SlidersHorizontal
} from "@phosphor-icons/react";

type SearchFormProps = {
  activeTab: SearchTab;
  formValues: {
    type: string;
    from: string;
    to: string;
    date: string;
    adults: string;
    cabinClass: string;
  };
  onFormChange: (updater: (prev: any) => any) => void;
  onSearch: () => void;
  isLoading: boolean;
  isAnyAgentRunning: boolean;
  error?: string | null;
};

const ease = [0.12, 0.23, 0.5, 1] as const;

/* ────────── Shared FormField (text input) ────────── */
function FormField({
  icon,
  placeholder,
  value,
  onChange,
  position = "middle",
  readOnly = false
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  position?: "first" | "middle" | "last" | "only";
  readOnly?: boolean;
}) {
  const radius =
    position === "first"
      ? "md:rounded-l-xl md:rounded-r-none"
      : position === "last"
      ? "md:rounded-r-xl md:rounded-l-none"
      : position === "only"
      ? "rounded-xl"
      : "md:rounded-none";

  const border =
    position === "first"
      ? "md:border-r-0"
      : position === "last"
      ? "md:border-l-0"
      : position === "middle"
      ? "md:border-x-0"
      : "";

  return (
    <div
      className={`group flex h-[56px] items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 transition-colors focus-within:border-accent-cyan focus-within:shadow-[0_0_0_2px_rgba(0,212,255,0.15)] ${radius} ${border}`}
    >
      <span className="shrink-0 text-accent-cyan">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="h-full w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
      />
    </div>
  );
}

/* ────────── Date Picker Field (future dates only) ────────── */
function DateField({
  value,
  onChange,
  position = "middle",
  placeholder = "Select date"
}: {
  value: string;
  onChange: (v: string) => void;
  position?: "first" | "middle" | "last";
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const radius =
    position === "first"
      ? "md:rounded-l-xl md:rounded-r-none"
      : position === "last"
      ? "md:rounded-r-xl md:rounded-l-none"
      : "md:rounded-none";
  const border =
    position === "first"
      ? "md:border-r-0"
      : position === "last"
      ? "md:border-l-0"
      : "md:border-x-0";

  const today = new Date().toISOString().split("T")[0];

  const formatDisplay = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleClick = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex h-[56px] cursor-pointer items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 transition-colors focus-within:border-accent-cyan focus-within:shadow-[0_0_0_2px_rgba(0,212,255,0.15)] ${radius} ${border}`}
    >
      <span className="shrink-0 text-accent-cyan">
        <CalendarBlank size={18} weight="duotone" />
      </span>
      <span className={`text-sm ${value ? "text-white" : "text-white/40"}`}>
        {value ? formatDisplay(value) : placeholder}
      </span>
      <input
        ref={inputRef}
        type="date"
        min={today}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0"
      />
    </div>
  );
}


/* ────────── Traveler Selector Dropdown ────────── */
function TravellerField({
  position = "last",
  formValues,
  onFormChange,
  activeTab
}: {
  position?: "first" | "middle" | "last";
  formValues: SearchFormProps["formValues"];
  onFormChange: SearchFormProps["onFormChange"];
  activeTab: SearchTab;
}) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const adults = parseInt(formValues.adults) || 1;
  const cabinClass = formValues.cabinClass;

  const setAdults = (v: number) => onFormChange((prev: any) => ({ ...prev, adults: String(v) }));
  const setCabinClass = (c: string) => onFormChange((prev: any) => ({ ...prev, cabinClass: c }));

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const total = adults + children + infants;
  const isTrain = activeTab === 'trains';
  const isBus = activeTab === 'buses';
  const isHotel = activeTab === 'hotels';
  
  const label = isHotel
    ? `${formValues.cabinClass}` // 1 Guest, 2 Guests etc
    : isTrain || isBus
      ? `${total} Pax · ${formValues.cabinClass}`
      : `${total} Traveller${total > 1 ? "s" : ""} · ${formValues.cabinClass}`;

  const radius =
    position === "first"
      ? "md:rounded-l-xl md:rounded-r-none"
      : position === "last"
      ? "md:rounded-r-xl md:rounded-l-none"
      : "md:rounded-none";
  const border =
    position === "first"
      ? "md:border-r-0"
      : position === "last"
      ? "md:border-l-0"
      : "md:border-x-0";

  const Counter = ({
    label: cLabel,
    sub,
    value: v,
    onDec,
    onInc,
    min = 0
  }: {
    label: string;
    sub: string;
    value: number;
    onDec: () => void;
    onInc: () => void;
    min?: number;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-[#0a0a0a]">{cLabel}</p>
        <p className="text-[11px] text-[#6b7280]">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={v <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#374151] transition-colors hover:border-teal hover:text-teal disabled:opacity-30"
        >
          <Minus size={14} weight="bold" />
        </button>
        <span className="w-5 text-center font-mono text-sm font-semibold text-[#0a0a0a]">{v}</span>
        <button
          onClick={onInc}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#374151] transition-colors hover:border-teal hover:text-teal"
        >
          <Plus size={14} weight="bold" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`group flex h-[56px] w-full items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 text-left transition-colors focus:border-accent-cyan focus:shadow-[0_0_0_2px_rgba(0,212,255,0.15)] ${radius} ${border}`}
      >
        <span className="shrink-0 text-accent-cyan">
          { (isTrain || isBus) ? (
            <SlidersHorizontal size={18} weight="duotone" />
          ) : (
            <UserCircle size={18} weight="duotone" />
          )}
        </span>
        <span className="truncate text-sm text-white">{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[62px] z-50 w-72 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-xl"
          >
            <Counter label="Adults" sub="12+ years" value={adults} onDec={() => setAdults(Math.max(1, adults - 1))} onInc={() => setAdults(adults + 1)} min={1} />
            <Counter label="Children" sub="2–11 years" value={children} onDec={() => setChildren(Math.max(0, children - 1))} onInc={() => setChildren(children + 1)} />
            <Counter label="Infants" sub="Under 2" value={infants} onDec={() => setInfants(Math.max(0, infants - 1))} onInc={() => setInfants(infants + 1)} />

            <div className="mt-3 border-t border-[#f3f4f6] pt-3">
              <p className="mb-2 text-xs font-semibold text-[#374151]">
                {isTrain || isBus ? "Class" : isHotel ? "Guests" : "Cabin Class"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(isTrain 
                  ? ["SL", "3A", "2A", "1A"] 
                  : isBus
                  ? ["AC Sleeper", "AC Seater", "Non-AC Sleeper", "Non-AC Seater"]
                  : isHotel
                  ? ["1 Guest", "2 Guests", "Family Room"]
                  : ["Economy", "Premium Economy", "Business", "First Class"]
                ).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCabinClass(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      cabinClass === c
                        ? "bg-teal text-white"
                        : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]"
                    }`}
                  >
                    {c === "SL" ? "Sleeper (SL)" : 
                     c === "3A" ? "3rd AC (3A)" :
                     c === "2A" ? "2nd AC (2A)" :
                     c === "1A" ? "1st AC (1A)" : c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg bg-teal py-2 text-sm font-semibold text-white"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────── Hunt Button ────────── */
function HuntButton({ 
  onSearch, 
  isLoading, 
  isAnyAgentRunning,
  error,
  formValues
}: { 
  onSearch: () => void; 
  isLoading: boolean; 
  isAnyAgentRunning: boolean;
  error?: string | null; 
  formValues: SearchFormProps["formValues"];
}) {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (error === "RATE_LIMIT") {
      setCooldown(10);
    }
  }, [error]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const disabled = isLoading || cooldown > 0 || !formValues.from || !formValues.to || !formValues.date;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03, boxShadow: disabled ? "none" : "0 0 20px rgba(0,212,255,0.4)" }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onSearch}
      disabled={disabled}
      className="flex h-[56px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-cyan text-sm font-bold text-black transition-opacity disabled:opacity-70 md:ml-3 md:w-[140px]"
    >
      {(isLoading || isAnyAgentRunning) ? (
        <CircleNotch size={16} weight="bold" className="animate-spin" />
      ) : cooldown > 0 ? (
        <div className="flex items-center gap-2 text-black/70">Wait {cooldown}s</div>
      ) : (
        <Crosshair size={16} weight="bold" />
      )}
      {cooldown > 0 ? null : (isLoading || isAnyAgentRunning) ? "Searching..." : "Hunt Deals"}
    </motion.button>
  );
}

/* ────────── Form Variants ────────── */
function FlightForm({ onSearch, isLoading, isAnyAgentRunning, error, formValues, onFormChange }: Omit<SearchFormProps, 'activeTab'>) {
  const rotation = useMotionValue(0);
  const rotateZ = useTransform(rotation, (v) => `${v}deg`);

  // Auto-detect location is removed or refactored externally since state is lifted
  // We can just rely on the parent or user input

  const handleSwap = useCallback(() => {
    const currentRotation = rotation.get();
    const startTime = Date.now();
    const duration = 400;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      rotation.set(currentRotation + eased * 180);
      if (progress >= 0.5 && progress < 0.55) {
        onFormChange((prev: any) => ({ ...prev, from: prev.to, to: prev.from }));
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [rotation, onFormChange]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
      <div className="flex-1">
        <FormField icon={<AirplaneTakeoff size={18} weight="duotone" />} placeholder="Your Location" value={formValues.from} onChange={(v) => onFormChange((prev: any) => ({ ...prev, from: v }))} position="first" />
      </div>
      <motion.button
        onClick={handleSwap}
        style={{ rotate: rotateZ }}
        className="z-10 mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-surface-dark text-white/70 transition-colors hover:text-white md:-mx-[18px]"
      >
        <ArrowsClockwise size={16} weight="bold" />
      </motion.button>
      <div className="flex-1">
        <FormField icon={<AirplaneLanding size={18} weight="duotone" />} placeholder="Country or Airport" value={formValues.to} onChange={(v) => onFormChange((prev: any) => ({ ...prev, to: v }))} position="middle" />
      </div>
      <div className="flex-1">
        <DateField value={formValues.date} onChange={(v) => onFormChange((prev: any) => ({ ...prev, date: v }))} position="middle" placeholder="Departure date" />
      </div>
      <div className="flex-1">
        <TravellerField position="last" formValues={formValues} onFormChange={onFormChange} activeTab="flights" />
      </div>
      <HuntButton onSearch={onSearch} isLoading={isLoading} isAnyAgentRunning={isAnyAgentRunning} error={error} formValues={formValues} />
    </div>
  );
}

function TrainForm({ onSearch, isLoading, isAnyAgentRunning, error, formValues, onFormChange }: Omit<SearchFormProps, 'activeTab'>) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
      <div className="flex-1">
        <FormField icon={<TrainSimple size={18} weight="duotone" />} placeholder="Your Location" value={formValues.from} onChange={(v) => onFormChange((prev: any) => ({ ...prev, from: v }))} position="first" />
      </div>
      <div className="flex-1">
        <FormField icon={<TrainSimple size={18} weight="duotone" />} placeholder="Country or Station" value={formValues.to} onChange={(v) => onFormChange((prev: any) => ({ ...prev, to: v }))} position="middle" />
      </div>
      <div className="flex-1">
        <DateField value={formValues.date} onChange={(v) => onFormChange((prev: any) => ({ ...prev, date: v }))} position="middle" placeholder="Travel date" />
      </div>
      <div className="flex-1">
        <TravellerField position="last" formValues={formValues} onFormChange={onFormChange} activeTab="trains" />
      </div>
      <HuntButton onSearch={onSearch} isLoading={isLoading} isAnyAgentRunning={isAnyAgentRunning} error={error} formValues={formValues} />
    </div>
  );
}

function BusForm({ onSearch, isLoading, isAnyAgentRunning, error, formValues, onFormChange }: Omit<SearchFormProps, 'activeTab'>) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
      <div className="flex-1">
        <FormField icon={<BusIcon size={18} weight="duotone" />} placeholder="Your Location" value={formValues.from} onChange={(v) => onFormChange((prev: any) => ({ ...prev, from: v }))} position="first" />
      </div>
      <div className="flex-1">
        <FormField icon={<BusIcon size={18} weight="duotone" />} placeholder="Country or City" value={formValues.to} onChange={(v) => onFormChange((prev: any) => ({ ...prev, to: v }))} position="middle" />
      </div>
      <div className="flex-1">
        <DateField value={formValues.date} onChange={(v) => onFormChange((prev: any) => ({ ...prev, date: v }))} position="middle" placeholder="Travel date" />
      </div>
      <div className="flex-1">
        <TravellerField position="last" formValues={formValues} onFormChange={onFormChange} activeTab="buses" />
      </div>
      <HuntButton onSearch={onSearch} isLoading={isLoading} isAnyAgentRunning={isAnyAgentRunning} error={error} formValues={formValues} />
    </div>
  );
}

function HotelForm({ onSearch, isLoading, isAnyAgentRunning, error, formValues, onFormChange }: Omit<SearchFormProps, 'activeTab'>) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-0">
      <div className="flex-[1.5]">
        <FormField icon={<Bed size={18} weight="duotone" />} placeholder="Country or Property" value={formValues.to} onChange={(v) => onFormChange((prev: any) => ({ ...prev, to: v }))} position="first" />
      </div>
      <div className="flex-1">
        <DateField value={formValues.from} onChange={(v) => onFormChange((prev: any) => ({ ...prev, from: v }))} position="middle" placeholder="Check-in" />
      </div>
      <div className="flex-1">
        <DateField value={formValues.date} onChange={(v) => onFormChange((prev: any) => ({ ...prev, date: v }))} position="middle" placeholder="Check-out" />
      </div>
      <div className="flex-1">
        <TravellerField position="last" formValues={formValues} onFormChange={onFormChange} activeTab="hotels" />
      </div>
      <HuntButton onSearch={onSearch} isLoading={isLoading} isAnyAgentRunning={isAnyAgentRunning} error={error} formValues={formValues} />
    </div>
  );
}

export function SearchForm(props: SearchFormProps) {
  const { activeTab, ...rest } = props;
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchWrapper = () => {
    if (pathname !== '/search') {
      const params = new URLSearchParams({
        type: activeTab,
        from: props.formValues.from || "",
        to: props.formValues.to || "",
        date: props.formValues.date || "",
        adults: props.formValues.adults || "1",
        cabinClass: props.formValues.cabinClass || "Economy",
      });
      router.push(`/search?${params.toString()}`);
    } else {
      props.onSearch();
    }
  };

  const restWithWrapper = { ...rest, onSearch: handleSearchWrapper };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.25, ease }}
      >
        {activeTab === "flights" && <FlightForm {...restWithWrapper} />}
        {activeTab === "trains" && <TrainForm {...restWithWrapper} />}
        {activeTab === "buses" && <BusForm {...restWithWrapper} />}
        {activeTab === "hotels" && <HotelForm {...restWithWrapper} />}
      </motion.div>
    </AnimatePresence>
  );
}
