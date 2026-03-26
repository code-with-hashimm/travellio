import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-card bg-white text-gray-body shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

