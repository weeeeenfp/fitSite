import { useMemo, useState } from "react";
import {
  type Equipment,
  MUSCLE_GROUPS,
  WEIGHT_EXERCISES,
  exercisesByMuscle,
  muscleGroupOf,
  workoutKcal,
} from "../../lib/calorie";
import type { Intensity, MuscleGroup, SetRecord, WorkoutLog } from "../../types";

interface WeightFormProps {
  date: string;
  bodyWeightKg: number;
  initial?: { name?: string; intensity?: Intensity; minutes?: number; note?: string; setCount?: number };
  onSave: (log: WorkoutLog) => void;
  onCancel: () => void;
}

const chip = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    active ? "bg-violet-600 text-white shadow-sm" : "bg-black/5 text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
  }`;

export default function WeightForm({ date, bodyWeightKg, initial, onSave, onCancel }: WeightFormProps) {
  const initialExercise = initial?.name ? WEIGHT_EXERCISES.find((e) => e.name === initial.name) : undefined;

  const [muscle, setMuscle] = useState<MuscleGroup>(initialExercise?.muscle ?? muscleGroupOf(initial?.name ?? "") ?? "胸");
  const [equipment, setEquipment] = useState<Equipment>(initialExercise?.equipment ?? "槓鈴");
  const [name, setName] = useState(initial?.name ?? "");
  const [intensity, setIntensity] = useState<Intensity>(initial?.intensity ?? "中");
  const [minutes, setMinutes] = useState(initial?.minutes ?? 20);
  const [note, setNote] = useState(initial?.note ?? "");
  const [sets, setSets] = useState<SetRecord[]>(
    Array.from({ length: initial?.setCount ?? 1 }, () => ({ weight: 20, reps: 10 })),
  );

  const equipments = useMemo(() => {
    const list = exercisesByMuscle(muscle);
    return [...new Set(list.map((e) => e.equipment))];
  }, [muscle]);

  // 確保 equipment / name 在切換肌群後仍有效
  const effEquipment = equipments.includes(equipment) ? equipment : equipments[0];
  const effExercises = exercisesByMuscle(muscle).filter((e) => e.equipment === effEquipment);
  const effName = effExercises.some((e) => e.name === name) ? name : effExercises[0]?.name ?? "";

  function pickMuscle(m: MuscleGroup) {
    setMuscle(m);
    const eqs = [...new Set(exercisesByMuscle(m).map((e) => e.equipment))];
    const eq = eqs[0];
    setEquipment(eq);
    setName(exercisesByMuscle(m).filter((e) => e.equipment === eq)[0]?.name ?? "");
  }

  function pickEquipment(eq: Equipment) {
    setEquipment(eq);
    setName(exercisesByMuscle(muscle).filter((e) => e.equipment === eq)[0]?.name ?? "");
  }

  function updateSet(i: number, field: keyof SetRecord, value: number) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }
  function addSet() {
    setSets((prev) => [...prev, { ...prev[prev.length - 1] }]);
  }
  function removeSet(i: number) {
    setSets((prev) => prev.filter((_, idx) => idx !== i));
  }

  const kcal = workoutKcal("weight", effName, intensity, minutes, bodyWeightKg);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: crypto.randomUUID(),
      date,
      category: "weight",
      name: effName,
      intensity,
      minutes,
      sets,
      muscleGroup: muscle,
      note,
      kcal,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 text-sm">
        <span className="text-neutral-500">1. 肌群</span>
        <div className="flex flex-wrap gap-1.5">
          {MUSCLE_GROUPS.map((m) => (
            <button type="button" key={m} onClick={() => pickMuscle(m)} className={chip(muscle === m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <span className="text-neutral-500">2. 器械</span>
        <div className="flex flex-wrap gap-1.5">
          {equipments.map((eq) => (
            <button type="button" key={eq} onClick={() => pickEquipment(eq)} className={chip(effEquipment === eq)}>
              {eq}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <span className="text-neutral-500">3. 動作</span>
        <div className="flex flex-wrap gap-1.5">
          {effExercises.map((e) => (
            <button type="button" key={e.name} onClick={() => setName(e.name)} className={chip(effName === e.name)}>
              {e.name}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        強度
        <div className="flex gap-2">
          {(["輕", "中", "高"] as Intensity[]).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => setIntensity(level)}
              className={`flex-1 rounded-lg border px-3 py-2 ${intensity === level ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15 dark:border-white/15"}`}
            >
              {level}
            </button>
          ))}
        </div>
      </label>

      <div className="flex flex-col gap-2 text-sm">
        <span className="text-neutral-500">組數紀錄</span>
        {sets.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 rounded-lg border border-black/15 px-2 py-1 dark:border-white/15 dark:bg-neutral-800"
              value={s.weight}
              onChange={(e) => updateSet(i, "weight", Number(e.target.value))}
            />
            <span className="text-neutral-400">kg ×</span>
            <input
              type="number"
              className="w-16 rounded-lg border border-black/15 px-2 py-1 dark:border-white/15 dark:bg-neutral-800"
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
        <button type="button" onClick={addSet} className="self-start rounded-lg border border-black/15 px-3 py-1 text-sm dark:border-white/15">
          + 新增一組
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        總時間（分鐘）
        <input
          type="number"
          min={1}
          max={300}
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        備註
        <input className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <p className="text-sm text-neutral-500">
        預估消耗：<span className="font-semibold text-neutral-800 dark:text-neutral-100">{kcal} kcal</span>
      </p>
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
