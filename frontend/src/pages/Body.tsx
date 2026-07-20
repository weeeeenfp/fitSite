import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import BodyAvatar2D from "../components/avatar/BodyAvatar2D";
import Card from "../components/layout/Card";
import Shell from "../components/layout/Shell";
import { bmiOf, effectiveBodyFat, estimateBodyFat, muscleGroupOf } from "../lib/calorie";
import { todayStr } from "../lib/date";
import { db, getProfile, saveProfile } from "../lib/db";
import type { MuscleGroup } from "../types";

export default function Body() {
  const profile = useLiveQuery(() => getProfile(), []);
  const workouts = useLiveQuery(() => db.workouts.where("category").equals("weight").toArray(), []) ?? [];
  const [weight, setWeight] = useState<number | null>(null);
  const [bodyFat, setBodyFat] = useState<string>("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  if (!profile) return null;

  const currentWeight = weight ?? profile.weight;
  const currentBodyFat = effectiveBodyFat(profile);
  const currentBmi = bmiOf(profile.weight, profile.height);
  const goalBodyFat = profile.goalBodyFat ?? estimateBodyFat(profile.goalWeight, profile.height, profile.age, profile.gender);
  const goalBmi = bmiOf(profile.goalWeight, profile.height);

  // 選定肌群的訓練統計
  const muscleLogs = selectedMuscle
    ? workouts.filter((w) => (w.muscleGroup ?? muscleGroupOf(w.name)) === selectedMuscle)
    : [];
  const totalSets = muscleLogs.reduce((s, w) => s + (w.sets?.length ?? 0), 0);
  const exerciseCount: Record<string, number> = {};
  for (const w of muscleLogs) exerciseCount[w.name] = (exerciseCount[w.name] ?? 0) + 1;
  const topExercises = Object.entries(exerciseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
          <BodyAvatar2D
            gender={profile.gender}
            current={{ heightM: profile.height / 100, weightKg: profile.weight, bodyFatPct: currentBodyFat }}
            goal={{ heightM: profile.height / 100, weightKg: profile.goalWeight, bodyFatPct: goalBodyFat }}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={(m) => setSelectedMuscle((cur) => (cur === m ? null : m))}
          />
          <div className="mt-2 flex items-center justify-center gap-5 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" /> 目前
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-3 rounded-sm border-2 border-dashed border-green-500" /> 目標
            </span>
          </div>
          <p className="mt-2 text-center text-xs text-neutral-400">點身上的肌群看訓練狀況</p>
        </Card>

        {selectedMuscle && (
          <Card title={`${selectedMuscle}｜訓練狀況`}>
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
                <div className="text-xl font-bold text-violet-600">{muscleLogs.length}</div>
                <div className="text-xs text-neutral-400">訓練次數</div>
              </div>
              <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
                <div className="text-xl font-bold text-violet-600">{totalSets}</div>
                <div className="text-xs text-neutral-400">累計組數</div>
              </div>
            </div>
            {topExercises.length > 0 ? (
              <div className="mt-3">
                <div className="mb-1 text-xs text-neutral-400">常做動作</div>
                <div className="flex flex-wrap gap-1.5">
                  {topExercises.map(([n, c]) => (
                    <span key={n} className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-600">
                      {n} ×{c}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-400">還沒有這個部位的重訓紀錄，去「今日」新增一筆吧。</p>
            )}
            <p className="mt-3 text-xs text-neutral-400">
              上方人形已高亮此部位，可比較目前（實心）與目標（虛線）體態的差異。
            </p>
          </Card>
        )}

        <Card title="數據對照">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div className="mb-1 text-xs text-neutral-400">目前</div>
              <div>體重 {profile.weight} kg</div>
              <div>
                體脂 {currentBodyFat}% {profile.bodyFat === null && <span className="text-neutral-400">(估算)</span>}
              </div>
              <div>BMI {currentBmi.toFixed(1)}</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-neutral-400">目標</div>
              <div>體重 {profile.goalWeight} kg</div>
              <div>
                體脂 {goalBodyFat}% {profile.goalBodyFat === null && <span className="text-neutral-400">(估算)</span>}
              </div>
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
                className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
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
                className="rounded-lg border border-black/15 px-3 py-2 dark:border-white/15 dark:bg-neutral-800"
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
