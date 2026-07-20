import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-neutral-900 dark:shadow-none ${className}`}>
      {title && <h2 className="mb-3 text-base font-semibold text-neutral-800 dark:text-neutral-100">{title}</h2>}
      {children}
    </div>
  );
}
