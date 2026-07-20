import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[26px] border border-black/[0.05] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.16)] dark:border-white/[0.08] dark:bg-neutral-900 dark:shadow-none ${className}`}
    >
      {title && <h2 className="mb-4 text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h2>}
      {children}
    </div>
  );
}
