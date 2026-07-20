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
    <div className="safe-bottom pointer-events-none sticky bottom-0 z-40 flex justify-center px-4 pb-3">
      <nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/90 px-2 py-1.5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-neutral-800/90">
        {TABS.map((tab) => {
          const on = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1.5 transition ${
                on ? "bg-violet-600 text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
