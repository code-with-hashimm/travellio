"use client";

import { AgentStatus } from "@/hooks/useAgentStream";

interface Props {
  streams: Record<string, string>;
  activeStreamId: string | null;
  setActiveStreamId: (id: string | null) => void;
  agents: { runId: string; label: string; status: string }[];
  status: AgentStatus;
}

const getAgentIcon = (label: string) => {
  if (label.toLowerCase().includes('flight') || label.toLowerCase().includes('skyscanner')) return "✈️";
  if (label.toLowerCase().includes('train') || label.toLowerCase().includes('ixigo')) return "🚆";
  if (label.toLowerCase().includes('bus') || label.toLowerCase().includes('redbus')) return "🚌";
  if (label.toLowerCase().includes('hotel') || label.toLowerCase().includes('booking')) return "🏨";
  return "🤖";
};

export function AgentIframeView({ streams, activeStreamId, setActiveStreamId, agents, status }: Props) {
  if (status !== "streaming" && status !== "complete") return null;

  const currentUrl = activeStreamId ? streams[activeStreamId] : null;

  return (
    <div className="flex flex-col w-full bg-[#030f12]">
      {/* ── Agent Tab Bar ── */}
      <div className="flex gap-2 overflow-x-auto p-3 scrollbar-hide border-b border-white/5">
        {agents.map((agent) => (
          <button
            key={agent.runId}
            onClick={() => setActiveStreamId(agent.runId)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
              activeStreamId === agent.runId
                ? "bg-teal text-white shadow-lg shadow-teal/20"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <span>{getAgentIcon(agent.label)}</span>
            <span>{agent.label}</span>
            {agent.status === 'RUNNING' ? (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-green shadow-[0_0_6px_rgba(0,255,136,0.8)]" />
            ) : agent.status === 'COMPLETED' ? (
              <span className="text-accent-green">✓</span>
            ) : (
              <span className="text-accent-amber">!</span>
            )}
          </button>
        ))}
      </div>

      {/* Responsive 16:9 container — Tinyfish recommended style */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">

          {/* ── Connecting spinner (streaming but no URL yet) ── */}
          {!currentUrl && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#030f12]">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-teal opacity-30" />
                <svg className="h-10 w-10 animate-spin text-teal" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                </svg>
              </div>
              <p className="font-mono text-sm font-semibold tracking-wider text-teal">
                {activeStreamId ? "Connecting to Live Feed..." : "Select an Agent to View"}
              </p>
              <p className="text-xs text-white/40">
                {activeStreamId ? "Agent is launching browser session" : "Parallel search in progress"}
              </p>
            </div>
          )}

          {/* ── Live iframe ── */}
          {currentUrl && (
            <iframe
              key={activeStreamId}
              src={currentUrl}
              className="h-full w-full border-none"
              title="TinyFish Live Browser Session"
              allow="autoplay"
            />
          )}

          {/* LIVE / Complete badge */}
          {activeStreamId && (
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-black/60 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-accent-green backdrop-blur-md">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  agents.find(a => a.runId === activeStreamId)?.status === "COMPLETED"
                    ? "bg-accent-green"
                    : "animate-pulse bg-accent-green shadow-[0_0_6px_rgba(0,255,136,0.8)]"
                }`}
              />
              {agents.find(a => a.runId === activeStreamId)?.status === "COMPLETED" ? "✓ Task Finished" : "STREAMING"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
