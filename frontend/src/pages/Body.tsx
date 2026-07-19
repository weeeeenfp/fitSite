import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import Avatar3D from "../components/avatar/Avatar3D";
import Card from "../components/layout/Card";
import Shell from "../components/layout/Shell";
import { bmiOf, effectiveBodyFat, estimateBodyFat } from "../lib/calorie";
import { todayStr } from "../lib/date";
import { db, getProfile, saveProfile } from "../lib/db";

export default function Body() {
  const profile = useLiveQuery(() => getProfile(), []);
  const [weight, setWeight] = useState<number | null>(null);
  const [bodyFat, setBodyFat] = useState<string>("");

  if (!profile) return null;

  const currentWeight = weight ?? profile.weight;
  const currentBodyFat = effectiveBodyFat(profile);
  const currentBmi = bmiOf(profile.weight, profile.height);

  const goalBodyFat = profile.goalBodyFat ?? estimateBodyFat(profile.goalWeight, profile.height, profile.age, profile.gender);
  const goalBmi = bmiOf(profile.goalWeight, profile.height);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    const w = weight ?? profile!.weight;
    const bf = bodyFat === "" ? null : Number(bodyFat);
    await db.bodyMetrics.add({ date: todayStr(), weight: w, bodyFat: bf });
    await saveProfile({ ...profile!, weight: w, bodyFat: bf });
    setWeight(null);
    setBodyFat("");
  }

  return (
    <Shell title="體態">
      <div className="flex flex-col gap-4">
        <Card>
          <Avatar3D
            gender={profile.gender}
            current={{ heightM: profile.height / 100, weightKg: profile.weight, bodyFatPct: currentBodyFat }}
            goal={{ heightM: profile.height / 100, weightKg: profile.goalWeight, bodyFatPct: goalBodyFat }}
          />
          <div className="mt-2 flex justify-center gap-6 text-xs text-neutral-500">
            <span>🟣 目前</span>
            <span>🟢 目標</span>
          </div>
        </Card>

        <Card title="數據對照">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="mb-1 text-xs text-neutral-400">目前</div>
              <div>體重 {profile.weight} kg</div>
              <div>體脂 {currentBodyFat}% {profile.bodyFat === null && <span className="text-neutral-400">(估算)</span>}</div>
              <div>BMI {currentBmi.toFixed(1)}</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-neutral-400">目標</div>
              <div>體重 {profile.goalWeight} kg</div>
              <div>體脂 {goalBodyFat}% {profile.goalBodyFat === null && <span className="text-neutral-400">(估算)</span>}</div>
              <div>BMI {goalBmi.toFixed(1)}</div>
            </div>
          </div>
        </Card>

        <Card title="更新今日體重／體脂">
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              體重（kg）
              <input
                type="number"
                step="0.1"
                className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
                value={currentWeight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              體脂率（%，可留空自動估算）
              <input
                type="number"
                step="0.1"
                placeholder="留空自動估算"
                className="rounded-lg border border-black/15 px-3 py-2 dark:bg-neutral-800"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </label>
            <button type="submit" className="rounded-lg bg-violet-600 py-2 font-semibold text-white">
              儲存
            </button>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
