import { useState } from "react";
import type { MealLog, MealType } from "../../types";

interface MealFormProps {
  date: string;
  onSave: (log: MealLog) => void;
  onCancel: () => void;
}

const MEALS: MealType[] = ["早餐", "午餐", "晚餐", "點心"];

export default function MealForm({ date, onSave, onCancel }: MealFormProps) {
  const [meal, setMeal] = useState<MealType>("早餐");
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ id: crypto.randomUUID(), date, meal, name, kcal });
  }

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
              className={`flex-1 rounded-lg border px-2 py-2 text-sm ${meal === m ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        品項
        <input required className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：雞胸便當" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        熱量（kcal）
        <input
          type="number"
          min={0}
          required
          className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
          value={kcal}
          onChange={(e) => setKcal(Number(e.target.value))}
        />
      </label>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-black/15 py-2">
          取消
        </button>
        <button type="submit" className="flex-1 rounded-lg bg-violet-600 py-2 font-semibold text-white">
          儲存
        </button>
      </div>
    </form>
  );
}
