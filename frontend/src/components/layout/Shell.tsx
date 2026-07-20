import type { ReactNode } from "react";

interface ShellProps {
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
}

export default function Shell({ title, headerRight, children }: ShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="safe-top sticky top-0 z-40 flex items-center justify-between border-b border-black/[0.06] bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/[0.06] dark:bg-neutral-900/80">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h1>
        {headerRight}
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  );
}
