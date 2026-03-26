import { motion } from "framer-motion";

interface Props {
  dealsFound: number;
  sourcesCount: number;
  elapsedMs: number;
  onViewResults: () => void;
  onSearchAgain: () => void;
}

export function AgentComplete({
  dealsFound,
  sourcesCount,
  elapsedMs,
  onViewResults,
  onSearchAgain
}: Props) {
  const seconds = (elapsedMs / 1000).toFixed(1);

  return (
    <div className="flex h-[45vh] md:h-[40%] w-full flex-col justify-center bg-[#161b22] px-6 py-4">
      {/* 100% Progress Bar Flash */}
      <div className="relative mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: "95%", opacity: 0.8 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal to-accent-green shadow-[0_0_12px_rgba(0,255,136,0.6)]"
        />
      </div>

      <div className="mb-6 text-center">
        <h3 className="font-display text-lg text-white">
          Found {dealsFound} deals for Mumbai → Dubai
        </h3>
        <p className="mt-2 font-mono text-[13px] tracking-wide text-white/40">
          Scanned {sourcesCount} sources in {seconds} seconds
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onViewResults}
          className="w-full rounded-pill bg-[#033d4a] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#055468]"
        >
          View Results &rarr;
        </button>
        <button
          onClick={onSearchAgain}
          className="w-full rounded-pill border border-white/[0.15] bg-transparent py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.04]"
        >
          Search Again
        </button>
      </div>
    </div>
  );
}
