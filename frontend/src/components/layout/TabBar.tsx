export type PageKey = "today" | "plan" | "body" | "stats" | "settings";

const TABS: { key: PageKey; label: string; icon: string }[] = [
  { key: "today", label: "今日", icon: "📝" },
  { key: "plan", label: "課表", icon: "📅" },
  { key: "body", label: "體態", icon: "🧍" },
  { key: "stats", label: "統計", icon: "📊" },
  { key: "settings", label: "設定", icon: "⚙️" },
];

interface TabBarProps {
  active: PageKey;
  onChange: (page: PageKey) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="safe-bottom sticky bottom-0 z-40 flex border-t border-black/[0.06] bg-white/85 px-2 pt-1.5 backdrop-blur-xl dark:border-white/[0.06] dark:bg-neutral-900/85">
      {TABS.map((tab) => {
        const on = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            <span
              className={`flex h-8 w-14 items-center justify-center rounded-full text-lg leading-none transition ${
                on ? "bg-violet-500/15" : ""
              }`}
            >
              {tab.icon}
            </span>
            <span className={`text-[11px] ${on ? "font-semibold text-violet-600 dark:text-violet-400" : "text-neutral-500 dark:text-neutral-400"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
