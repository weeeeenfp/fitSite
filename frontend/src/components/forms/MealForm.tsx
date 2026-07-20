import { useEffect, useRef, useState } from "react";
import { type FoodMatch, searchLocalFoods } from "../../lib/foods";
import { type OnlineFoodMatch, searchOnlineFoods } from "../../lib/nutrition";
import type { MealLog, MealType } from "../../types";

interface MealFormProps {
  date: string;
  onSave: (log: MealLog) => void;
  onCancel: () => void;
}

const MEALS: MealType[] = ["早餐", "午餐", "晚餐", "點心"];
type Suggestion = FoodMatch | OnlineFoodMatch;

export default function MealForm({ date, onSave, onCancel }: MealFormProps) {
  const [meal, setMeal] = useState<MealType>("早餐");
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState<number | "">("");
  const [portion, setPortion] = useState("");
  const [local, setLocal] = useState<FoodMatch[]>([]);
  const [online, setOnline] = useState<OnlineFoodMatch[]>([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [showList, setShowList] = useState(false);
  const [picked, setPicked] = useState(false);
  const reqId = useRef(0);

  // 內建表：即時搜尋
  useEffect(() => {
    if (picked || name.trim().length < 1) {
      setLocal([]);
      return;
    }
    setLocal(searchLocalFoods(name));
  }, [name, picked]);

  // 線上：debounce 查 Open Food Facts
  useEffect(() => {
    if (picked || name.trim().length < 2 || !navigator.onLine) {
      setOnline([]);
      setLoadingOnline(false);
      return;
    }
    const id = ++reqId.current;
    setLoadingOnline(true);
    const t = setTimeout(async () => {
      const res = await searchOnlineFoods(name);
      if (id === reqId.current) {
        setOnline(res);
        setLoadingOnline(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [name, picked]);

  function pick(s: Suggestion) {
    setName(s.name);
    setKcal(s.kcal);
    setPortion(s.portion);
    setPicked(true);
    setShowList(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ id: crypto.randomUUID(), date, meal, name: name.trim(), kcal: Number(kcal) || 0 });
  }

  const hasSuggestions = local.length > 0 || online.length > 0 || loadingOnline;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        餐別
        <div className="flex gap-2">
          {MEALS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMeal(m)}
              className={`flex-1 rounded-lg border px-2 py-2 text-sm ${meal === m ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15 dark:border-white/15"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </label>

      <div className="relative flex flex-col gap-1 text-sm">
        品項（輸入食物名稱自動查熱量）
        <input
          required
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setPicked(false);
            setShowList(true);
          }}
          onFocus={() => setShowList(true)}
          placeholder="例如：雞胸便當、珍珠奶茶"
          autoComplete="off"
        />
        {showList && hasSuggestions && !picked && (
          <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-800">
            {local.map((s, i) => (
              <button
                type="button"
                key={`l${i}`}
                onClick={() => pick(s)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-violet-500/10"
              >
                <span className="truncate">
                  {s.name} <span className="text-xs text-neutral-400">· {s.portion}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-amber-500">{s.kcal} kcal</span>
              </button>
            ))}
            {online.map((s, i) => (
              <button
                type="button"
                key={`o${i}`}
                onClick={() => pick(s)}
                className="flex w-full items-center justify-between gap-2 border-t border-black/5 px-3 py-2 text-left hover:bg-violet-500/10 dark:border-white/5"
              >
                <span className="truncate">
                  <span className="mr-1 rounded bg-sky-500/15 px-1 text-[10px] text-sky-600">線上</span>
                  {s.name} <span className="text-xs text-neutral-400">· {s.portion}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-amber-500">{s.kcal} kcal</span>
              </button>
            ))}
            {loadingOnline && <div className="px-3 py-2 text-xs text-neutral-400">線上查詢中…</div>}
          </div>
        )}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        熱量（kcal）{portion && <span className="text-xs text-neutral-400">· {portion}</span>}
        <input
          type="number"
          min={0}
          required
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
          value={kcal}
          onChange={(e) => setKcal(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="選上方建議自動填入，或手動輸入"
        />
      </label>

      <div className="mt-1 flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-black/15 py-2 dark:border-white/15">
          取消
        </button>
        <button type="submit" className="flex-1 rounded-lg bg-violet-600 py-2 font-semibold text-white">
          儲存
        </button>
      </div>
    </form>
  );
}
