const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

interface CalendarProps {
  year: number;
  month: number; // 0-indexed
  activity: Record<string, number>; // "YYYY-MM-DD" -> 熱點強度(例如當天紀錄筆數)
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function heatClass(count: number): string {
  if (count <= 0) return "bg-black/5 dark:bg-white/5";
  if (count === 1) return "bg-violet-300/60 dark:bg-violet-800/60";
  if (count === 2) return "bg-violet-400/70 dark:bg-violet-700/80";
  return "bg-violet-600 text-white";
}

export default function Calendar({ year, month, activity, selectedDate, onSelectDate }: CalendarProps) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (first.getDay() + 6) % 7; // 週一開頭

  const cells: (number | null)[] = [...Array(leadingBlanks).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-neutral-400">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`b${i}`} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const count = activity[dateStr] ?? 0;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate?.(dateStr)}
              className={`aspect-square rounded-lg text-xs ${heatClass(count)} ${isSelected ? "ring-2 ring-violet-600" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
