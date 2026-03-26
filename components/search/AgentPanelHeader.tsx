import { Robot, Minus, X } from "@phosphor-icons/react";

interface Props {
  isActive: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export function AgentPanelHeader({ isActive, onMinimize, onClose }: Props) {
  return (
    <div className="flex h-[56px] w-full shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0d1117] px-5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-accent-cyan">
          <Robot size={20} weight="duotone" />
          {isActive && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-accent-green shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
          )}
        </div>
        <h3 className="font-display font-semibold tracking-wide text-white">
          AI Agent
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/10 hover:text-white"
        >
          <Minus size={18} weight="bold" />
        </button>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
