import type { ReactNode } from "react";

interface ShellProps {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

export default function Shell({ title, headerRight, children }: ShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-neutral-900/95">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
        {headerRight}
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
