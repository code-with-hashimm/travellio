import { motion, AnimatePresence } from "framer-motion";
import { CircleNotch, WarningCircle } from "@phosphor-icons/react";
import type { AgentStreamState } from "@/hooks/useAgentStream";
import { AgentPanelHeader } from "./AgentPanelHeader";
import { AgentIframeView } from "./AgentIframeView";
import { AgentProgress } from "./AgentProgress";
import { AgentComplete } from "./AgentComplete";
import { AgentMinimized } from "./AgentMinimized";

interface Props {
  isOpen: boolean;
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
  onSearchAgain: () => void;
  agentStream: AgentStreamState;
}

export function AgentPanel({
  isOpen,
  isMinimized,
  onMinimize,
  onExpand,
  onClose,
  onSearchAgain,
  agentStream
}: Props) {
  const {
    streams,
    activeStreamId,
    setActiveStreamId,
    agents,
    progressPct,
    statusMsg,
    status,
    elapsedMs,
    sourcesCount,
    dealsFound
  } = agentStream;

  const isActive = status === "started" || status === "streaming";

  return (
    <>
      <AnimatePresence>
        {isMinimized && (
          <AgentMinimized
            elapsedMs={elapsedMs}
            progressPct={progressPct}
            onExpand={onExpand}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen && !isMinimized ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 z-[55] flex h-full w-full flex-col overflow-hidden border-l border-accent-cyan/15 bg-surface-dark shadow-[0_0_40px_rgba(0,0,0,0.5)] md:w-[460px]"
      >
        <AgentPanelHeader
          isActive={isActive}
          onMinimize={onMinimize}
          onClose={onClose}
        />

        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* STATE 1 & 2 — WAITING / STARTED */}
          {(status === "idle" || status === "started") && (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <CircleNotch size={48} weight="bold" className="animate-spin text-teal" />
              <h2 className="mt-6 font-display text-xl text-white">
                {status === "idle" ? "Connecting to AI Agent..." : "Agent is launching browser..."}
              </h2>
              <p className="mt-2 font-mono text-sm text-white/50">
                {status === "idle" ? "Your session is starting" : `00:${Math.floor(elapsedMs / 1000).toString().padStart(2, "0")}`}
              </p>
            </div>
          )}

          {/* STATE 5 — ERROR */}
          {status === "error" && (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <WarningCircle size={48} weight="duotone" className="text-accent-amber" />
              <h2 className="mt-6 font-display text-xl text-white">Agent session failed</h2>
              <p className="mt-2 text-sm text-white/50">{statusMsg}</p>
              <button
                onClick={onSearchAgain}
                className="mt-6 rounded-pill bg-[#033d4a] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
              >
                Try Again
              </button>
            </div>
          )}

          {/* STATE 3 & 4 — STREAMING / COMPLETE (Top half IFrame) */}
          {(status === "streaming" || status === "complete") && (
            <AgentIframeView 
              streams={streams} 
              activeStreamId={activeStreamId} 
              setActiveStreamId={setActiveStreamId}
              agents={agents}
              status={status} 
            />
          )}

          {/* STATE 3 — STREAMING (Bottom half Progress) */}
          {status === "streaming" && (
            <AgentProgress
              progressPct={progressPct}
              statusMsg={statusMsg}
              elapsedMs={elapsedMs}
              sourcesCount={sourcesCount}
              dealsFound={dealsFound}
              status={status}
            />
          )}

          {/* STATE 4 — COMPLETE (Bottom half Complete View) */}
          {status === "complete" && (
            <AgentComplete
              dealsFound={dealsFound}
              sourcesCount={sourcesCount}
              elapsedMs={elapsedMs}
              onViewResults={onClose}
              onSearchAgain={onSearchAgain}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
