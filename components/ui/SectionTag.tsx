import { ReactNode } from "react";

interface SectionTagProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionTag({ icon, children, className = "" }: SectionTagProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-gray-border/60 bg-white/70 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] text-gray-muted backdrop-blur ${className}`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

