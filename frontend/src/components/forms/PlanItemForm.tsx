import { useState } from "react";
import type { Intensity, PlanItem, PlanItemType } from "../../types";

interface PlanItemFormProps {
  initial?: PlanItem;
  onSave: (item: PlanItem) => void;
  onCancel: () => void;
}

const TYPES: PlanItemType[] = ["重訓", "有氧", "球類", "休息"];

const chip = (active: boolean) =>
  `flex-1 rounded-lg border px-2 py-2 text-sm ${
    active ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15 dark:border-white/15"
  }`;

export default function PlanItemForm({ initial, onSave, onCancel }: PlanItemFormProps) {
  const [type, setType] = useState<PlanItemType>(initial?.type ?? "重訓");
  const [name, setName] = useState(initial?.name ?? "");
  const [sets, setSets] = useState(initial?.sets ?? 3);
  const [reps, setReps] = useState(initial?.reps ?? "8-12");
  const [minutes, setMinutes] = useState(initial?.minutes ?? 30);
  const [intensity, setIntensity] = useState<Intensity>(initial?.intensity ?? "中");
  const [hint, setHint] = useState(initial?.hint ?? "");

  const isStrength = type === "重訓";
  const isTimed = type === "有氧" || type === "球類";
  const isRest = type === "休息";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item: PlanItem = {
      id: initial?.id ?? crypto.randomUUID(),
      type,
      name: isRest ? "休息" : name.trim() || type,
      hint: hint.trim() || undefined,
    };
    if (isStrength) {
      item.sets = sets;
      item.reps = reps.trim() || undefined;
      item.intensity = intensity;
    } else if (isTimed) {
      item.minutes = minutes;
      item.intensity = intensity;
    }
    onSave(item);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        類型
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button type="button" key={t} onClick={() => setType(t)} className={chip(type === t)}>
              {t}
            </button>
          ))}
        </div>
      </label>

      {!isRest && (
        <label className="flex flex-col gap-1 text-sm">
          名稱
          <input
            className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isStrength ? "例如：槓鈴臥推" : "例如：跑步機、籃球"}
          />
        </label>
      )}

      {isStrength && (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            組數
            <input
              type="number"
              min={1}
              max={12}
              className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            次數
            <input
              className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="8-12"
            />
          </label>
        </div>
      )}

      {isTimed && (
        <label className="flex flex-col gap-1 text-sm">
          時間（分鐘）
          <input
            type="number"
            min={1}
            max={180}
            className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>
      )}

      {!isRest && (
        <label className="flex flex-col gap-1 text-sm">
          強度
          <div className="flex gap-2">
            {(["輕", "中", "高"] as Intensity[]).map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setIntensity(level)}
                className={chip(intensity === level)}
              >
                {level}
              </button>
            ))}
          </div>
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        備註／建議（可留空）
        <input
          className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder={isRest ? "例如：充分休息、伸展" : "例如：漸進加重"}
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
