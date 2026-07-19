import { useState } from "react";
import { estimateBodyFat } from "../../lib/calorie";
import type { Gender, GoalType, Profile } from "../../types";

interface ProfileFormProps {
  initial?: Profile;
  submitLabel?: string;
  onSave: (profile: Profile) => void;
}

const DEFAULT_PROFILE: Profile = {
  height: 170,
  weight: 65,
  age: 25,
  gender: "male",
  bodyFat: null,
  goalType: "維持",
  goalWeight: 65,
  goalBodyFat: null,
};

export default function ProfileForm({ initial, submitLabel = "儲存", onSave }: ProfileFormProps) {
  const [p, setP] = useState<Profile>(initial ?? DEFAULT_PROFILE);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(p);
  }

  const estimatedBodyFat = estimateBodyFat(p.weight, p.height, p.age, p.gender);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          身高（cm）
          <input type="number" required className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={p.height} onChange={(e) => set("height", Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          體重（kg）
          <input type="number" required className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={p.weight} onChange={(e) => set("weight", Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          年齡
          <input type="number" required className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={p.age} onChange={(e) => set("age", Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          性別
          <select className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800" value={p.gender} onChange={(e) => set("gender", e.target.value as Gender)}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        體脂率（% ，留空則用 BMI 自動估算約 {estimatedBodyFat}%）
        <input
          type="number"
          className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
          value={p.bodyFat ?? ""}
          placeholder="留空自動估算"
          onChange={(e) => set("bodyFat", e.target.value === "" ? null : Number(e.target.value))}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        目標
        <div className="flex gap-2">
          {(["增肌", "減脂", "維持"] as GoalType[]).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => set("goalType", g)}
              className={`flex-1 rounded-lg border px-3 py-2 ${p.goalType === g ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          目標體重（kg）
          <input
            type="number"
            required
            className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
            value={p.goalWeight}
            onChange={(e) => set("goalWeight", Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          目標體脂率（%，可留空）
          <input
            type="number"
            className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
            value={p.goalBodyFat ?? ""}
            onChange={(e) => set("goalBodyFat", e.target.value === "" ? null : Number(e.target.value))}
          />
        </label>
      </div>

      <button type="submit" className="mt-2 rounded-lg bg-violet-600 py-2 font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
