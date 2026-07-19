import { useState } from "react";
import { WEIGHT_MET, workoutKcal } from "../../lib/calorie";
import type { Intensity, SetRecord, WorkoutLog } from "../../types";

interface WeightFormProps {
  date: string;
  bodyWeightKg: number;
  initial?: { name?: string; intensity?: Intensity; minutes?: number; note?: string; setCount?: number };
  onSave: (log: WorkoutLog) => void;
  onCancel: () => void;
}

const NAMES = Object.keys(WEIGHT_MET);

export default function WeightForm({ date, bodyWeightKg, initial, onSave, onCancel }: WeightFormProps) {
  const [name, setName] = useState(initial?.name && NAMES.includes(initial.name) ? initial.name : NAMES[0]);
  const [intensity, setIntensity] = useState<Intensity>(initial?.intensity ?? "中");
  const [minutes, setMinutes] = useState(initial?.minutes ?? 20);
  const [note, setNote] = useState(initial?.note ?? "");
  const [sets, setSets] = useState<SetRecord[]>(
    Array.from({ length: initial?.setCount ?? 1 }, () => ({ weight: 20, reps: 10 })),
  );

  function updateSet(i: number, field: keyof SetRecord, value: number) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function addSet() {
    setSets((prev) => [...prev, { ...prev[prev.length - 1] }]);
  }

  function removeSet(i: number) {
    setSets((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const kcal = workoutKcal("weight", name, intensity, minutes, bodyWeightKg);
    onSave({
      id: crypto.randomUUID(),
      date,
      category: "weight",
      name,
      intensity,
      minutes,
      sets,
      note,
      kcal,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        動作
        <select className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={name} onChange={(e) => setName(e.target.value)}>
          {NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        強度
        <div className="flex gap-2">
          {(["輕", "中", "高"] as Intensity[]).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => setIntensity(level)}
              className={`flex-1 rounded-lg border px-3 py-2 ${intensity === level ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15"}`}
            >
              {level}
            </button>
          ))}
        </div>
      </label>

      <div className="flex flex-col gap-2 text-sm">
        <span>組數紀錄</span>
        {sets.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 rounded-lg border border-black/15 px-2 py-1 dark:bg-neutral-800"
              value={s.weight}
              onChange={(e) => updateSet(i, "weight", Number(e.target.value))}
            />
            <span className="text-neutral-400">kg ×</span>
            <input
              type="number"
              className="w-16 rounded-lg border border-black/15 px-2 py-1 dark:bg-neutral-800"
              value={s.reps}
              onChange={(e) => updateSet(i, "reps", Number(e.target.value))}
            />
            <span className="text-neutral-400">下</span>
            {sets.length > 1 && (
              <button type="button" onClick={() => removeSet(i)} className="ml-auto text-neutral-400">
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSet} className="self-start rounded-lg border border-black/15 px-3 py-1 text-sm">
          + 新增一組
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        總時間（分鐘）
        <input
          type="number"
          min={1}
          max={300}
          className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        備註
        <input className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <p className="text-sm text-neutral-500">
        預估消耗：<span className="font-semibold text-neutral-800 dark:text-neutral-100">{workoutKcal("weight", name, intensity, minutes, bodyWeightKg)} kcal</span>
      </p>
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
