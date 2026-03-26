"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchHeader } from "./SearchHeader";
import { ResultsHeader } from "./ResultsHeader";
import { FlightCard } from "./FlightCard";
import { TrainCard } from "./TrainCard";
import { BusCard } from "./BusCard";
import { HotelCard } from "./HotelCard";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { AgentPanel } from "./AgentPanel";
import { AgentTriggerButton } from "./AgentTriggerButton";
import { useAgentStream } from "@/hooks/useAgentStream";

import { PartialLoadingIndicator } from "./PartialLoadingIndicator";
import { ResultsErrorBoundary } from "./ResultsErrorBoundary";
import { SavingsSummary } from "./SavingsSummary";
import type { SearchTab } from "@/lib/searchTypes";

const loadingMessages = [
  "Scanning Skyscanner...",
  "Scanning MakeMyTrip...",
  "Scanning Booking.com...",
  "Scanning Google Flights...",
  "Found results. Ranking with AI..."
];

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("type") as SearchTab | null;

  const [activeTab, setActiveTab] = useState<SearchTab>(urlTab || "flights");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const agentStream = useAgentStream();

  const router = useRouter();

  const [formValues, setFormValues] = useState({
    type      : urlTab || 'flights',
    from      : '',
    to        : '',
    date      : '',
    adults    : '1',
    cabinClass: urlTab === 'trains' ? 'SL' : 
                urlTab === 'buses' ? 'AC Sleeper' : 
                urlTab === 'hotels' ? '1 Guest' : 
                'Economy',
  });

  const [view, setView] = useState<"list" | "grid">("list");
  
  const isActuallyHunting = agentStream.status === "started" || agentStream.status === "streaming";
  const hasSomeResults = agentStream.dealsFound > 0;
  const isFullyDone = agentStream.status === "complete";

  const handleSearch = useCallback(() => {
    if (!formValues.from || !formValues.to || !formValues.date) {
      return;
    }

    const params = new URLSearchParams({
      type      : formValues.type,
      from      : formValues.from,
      to        : formValues.to,
      date      : formValues.date,
      adults    : formValues.adults,
      class     : formValues.cabinClass,
    });

    router.push(`/search?${params.toString()}`);

    setIsPanelOpen(true);
    setIsMinimized(false);
    agentStream.startStream(params);
  }, [formValues, agentStream, router]);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setIsMinimized(false);
  }, []);

  const handleTabChange = useCallback((tab: SearchTab) => {
    setActiveTab(tab);
    const defaultClass = 
      tab === 'flights' ? 'Economy' :
      tab === 'trains' ? 'SL' :
      tab === 'buses' ? 'AC Sleeper' :
      '1 Guest';
      
    setFormValues(prev => ({ 
      ...prev, 
      type: tab,
      cabinClass: defaultClass
    }));
  }, []);

  const routeLabel = formValues.from && formValues.to ? `${formValues.from} → ${formValues.to}` : "";
  const dateLabel = formValues.date ?? "";

  const getMinPrice = (item: any, type: string) => {
    if (type === 'trains') {
      return item.classes && item.classes.length > 0 
        ? Math.min(...item.classes.map((c: any) => c.price)) 
        : Infinity;
    }
    return item.price || 0;
  };

  const flights = (agentStream.result?.flights ?? []).sort((a: any, b: any) => a.price - b.price);
  const trains = (agentStream.result?.trains ?? []).sort((a: any, b: any) => getMinPrice(a, 'trains') - getMinPrice(b, 'trains'));
  const buses = (agentStream.result?.buses ?? []).sort((a: any, b: any) => a.price - b.price);
  const hotels = (agentStream.result?.hotels ?? []).sort((a: any, b: any) => a.price - b.price);

  const cheapestFlightId = flights[0]?.id;
  const cheapestTrainId = trains[0]?.id;
  const cheapestBusId = buses[0]?.id;
  const cheapestHotelId = hotels[0]?.id;

  const getSavingsData = (items: any[]) => {
    if (!items || items.length <= 1) return null;
    const min = getMinPrice(items[0], activeTab);
    const avg = items.reduce((acc, item) => acc + getMinPrice(item, activeTab), 0) / items.length;
    const diff = avg - min;
    const pct = (diff / avg) * 100;
    return { avg, min, diff, pct };
  };

  const currentResults = 
    activeTab === 'flights' ? flights :
    activeTab === 'trains' ? trains :
    activeTab === 'buses' ? buses :
    hotels;

  const savingsData = getSavingsData(currentResults);

  const cardContext = {
    origin: formValues.from,
    dest  : formValues.to,
    date  : formValues.date,
    adults: formValues.adults,
  };

  return (
    <div className={`min-h-screen bg-white transition-all duration-300 ${isPanelOpen && !isMinimized ? "md:pr-[460px]" : ""}`}>
      <SearchHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        isLoading={agentStream.isInitialLoading}
        isAnyAgentRunning={agentStream.isAnyAgentRunning}
        formValues={formValues}
        onFormChange={setFormValues}
        error={agentStream.error}
      />

      <div className="mx-auto max-w-4xl border-t border-[#e5e7eb] px-4 pt-6 pb-6 md:px-6">

        {/* Loading state skeletons — only if NO results yet */}
        {agentStream.isInitialLoading && (
          <div className="mt-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {agentStream.status === "error" && agentStream.error && agentStream.error !== "RATE_LIMIT" && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {agentStream.error}
            <button
              onClick={() => agentStream.startStream(searchParams)}
              className="ml-4 underline"
            >
              Try again
            </button>
          </div>
        )}


        {/* Results — render as soon as any exist */}
        {(hasSomeResults || isFullyDone) && (
          <div className="flex-1">
            <ResultsHeader
              tab={activeTab}
              count={currentResults.length}
              route={routeLabel}
              date={dateLabel}
              view={view}
              onViewChange={setView}
            />

            <ResultsErrorBoundary>
              <div className="mt-4 space-y-3">
                {savingsData && (
                  <SavingsSummary 
                    averagePrice={savingsData.avg}
                    minPrice={savingsData.min}
                    savings={savingsData.diff}
                    savingsPercentage={savingsData.pct}
                  />
                )}
                
                {activeTab === "flights" &&
                  flights.map((flight: any, i: number) => (
                    <FlightCard key={flight.id} flight={flight} index={i} context={cardContext} isCheapest={flight.id === cheapestFlightId} />
                  ))}

                {activeTab === "trains" &&
                  trains.map((train: any, i: number) => (
                    <TrainCard key={train.id} train={train} index={i} isCheapest={train.id === cheapestTrainId} />
                  ))}

                {activeTab === "buses" &&
                  buses.map((bus: any, i: number) => (
                    <BusCard key={bus.id} bus={bus} index={i} context={cardContext} isCheapest={bus.id === cheapestBusId} />
                  ))}

                {activeTab === "hotels" &&
                  hotels.map((hotel: any, i: number) => (
                    <HotelCard key={hotel.id} hotel={hotel} index={i} context={cardContext} isCheapest={hotel.id === cheapestHotelId} />
                  ))}

                {/* Background hunting indicator */}
                {agentStream.isAnyAgentRunning && hasSomeResults && (
                   <PartialLoadingIndicator />
                )}
              </div>
            </ResultsErrorBoundary>
          </div>
        )}

        {!isActuallyHunting && !isFullyDone && (
          <p className="py-24 text-center text-[#6b7280]">
            Enter your trip details above to hunt deals
          </p>
        )}

        {isFullyDone && currentResults.length === 0 && (
          <EmptyState />
        )}
      </div>

      <AgentPanel
        isOpen={isPanelOpen}
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized(true)}
        onExpand={() => setIsMinimized(false)}
        onClose={handleClosePanel}
        onSearchAgain={() => agentStream.startStream(searchParams)}
        agentStream={agentStream}
      />

      <AnimatePresence>
        {!isPanelOpen && !isMinimized && (
          <AgentTriggerButton
            isActive={agentStream.status !== "idle" && agentStream.status !== "complete"}
            onClick={() => setIsPanelOpen(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
