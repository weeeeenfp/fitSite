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
    <nav className="sticky bottom-0 z-40 flex border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-neutral-900/95">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
            active === tab.key ? "text-violet-600 dark:text-violet-400" : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
