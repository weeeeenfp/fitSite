import { useState } from "react";
import { BALL_MET, workoutKcal } from "../../lib/calorie";
import type { Intensity, WorkoutLog } from "../../types";

interface BallFormProps {
  date: string;
  bodyWeightKg: number;
  initial?: { name?: string; intensity?: Intensity; minutes?: number; note?: string };
  onSave: (log: WorkoutLog) => void;
  onCancel: () => void;
}

const NAMES = Object.keys(BALL_MET);

export default function BallForm({ date, bodyWeightKg, initial, onSave, onCancel }: BallFormProps) {
  const [name, setName] = useState(initial?.name && NAMES.includes(initial.name) ? initial.name : NAMES[0]);
  const [intensity, setIntensity] = useState<Intensity>(initial?.intensity ?? "中");
  const [minutes, setMinutes] = useState(initial?.minutes ?? 30);
  const [note, setNote] = useState(initial?.note ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const kcal = workoutKcal("ball", name, intensity, minutes, bodyWeightKg);
    onSave({
      id: crypto.randomUUID(),
      date,
      category: "ball",
      name,
      intensity,
      minutes,
      note,
      kcal,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        項目
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
      <label className="flex flex-col gap-1 text-sm">
        時間（分鐘）
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
        預估消耗：<span className="font-semibold text-neutral-800 dark:text-neutral-100">{workoutKcal("ball", name, intensity, minutes, bodyWeightKg)} kcal</span>
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
