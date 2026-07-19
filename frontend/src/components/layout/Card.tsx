import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 ${className}`}>
      {title && <h2 className="mb-3 text-base font-semibold text-neutral-800 dark:text-neutral-100">{title}</h2>}
      {children}
    </div>
  );
}
