import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import Card from "../components/layout/Card";
import Modal from "../components/layout/Modal";
import Shell from "../components/layout/Shell";
import BallForm from "../components/forms/BallForm";
import CardioForm from "../components/forms/CardioForm";
import MealForm from "../components/forms/MealForm";
import WeightForm from "../components/forms/WeightForm";
import { dailyBase } from "../lib/calorie";
import { addDays, displayDate, todayStr } from "../lib/date";
import { db, getProfile } from "../lib/db";
import type { MealLog, WorkoutLog } from "../types";

type FormKind = "ball" | "cardio" | "weight" | "meal" | null;

const CATEGORY_LABEL: Record<WorkoutLog["category"], string> = { ball: "🏀 球類", cardio: "🏃 有氧", weight: "🏋️ 重訓" };

export default function Today() {
  const [date, setDate] = useState(todayStr());
  const [openForm, setOpenForm] = useState<FormKind>(null);

  const profile = useLiveQuery(() => getProfile(), []);
  const workouts = useLiveQuery(() => db.workouts.where("date").equals(date).toArray(), [date]) ?? [];
  const meals = useLiveQuery(() => db.meals.where("date").equals(date).toArray(), [date]) ?? [];

  if (!profile) return null;

  const burned = workouts.reduce((s, w) => s + w.kcal, 0);
  const intake = meals.reduce((s, m) => s + m.kcal, 0);
  const base = dailyBase(profile);
  const net = intake - base - burned;

  async function saveWorkout(log: WorkoutLog) {
    await db.workouts.add(log);
    setOpenForm(null);
  }

  async function saveMeal(log: MealLog) {
    await db.meals.add(log);
    setOpenForm(null);
  }

  return (
    <Shell
      title="今日"
      headerRight={
        <div className="flex items-center gap-1 text-sm">
          <button type="button" onClick={() => setDate((d) => addDays(d, -1))} className="rounded-full px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">
            ‹
          </button>
          <span className="whitespace-nowrap">{displayDate(date)}</span>
          <button type="button" onClick={() => setDate((d) => addDays(d, 1))} className="rounded-full px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">
            ›
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 p-4 text-white shadow-[0_10px_30px_-12px_rgba(124,58,237,0.6)]">
          <div className="mb-1 text-xs text-white/70">今日淨熱量</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">{net > 0 ? "+" : ""}{net}</span>
            <span className="text-sm text-white/70">kcal</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-white/15 py-1.5">
              <div className="text-[11px] text-white/70">攝取</div>
              <div className="font-semibold">{intake}</div>
            </div>
            <div className="rounded-xl bg-white/15 py-1.5">
              <div className="text-[11px] text-white/70">運動消耗</div>
              <div className="font-semibold">{burned}</div>
            </div>
            <div className="rounded-xl bg-white/15 py-1.5">
              <div className="text-[11px] text-white/70">基礎代謝</div>
              <div className="font-semibold">{base}</div>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/60">淨值 = 攝取 − 基礎代謝 − 運動消耗</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {([
            ["ball", "🏀", "球類"],
            ["cardio", "🏃", "有氧"],
            ["weight", "🏋️", "重訓"],
            ["meal", "🍚", "飲食"],
          ] as const).map(([kind, icon, label]) => (
            <button
              key={kind}
              type="button"
              onClick={() => setOpenForm(kind)}
              className="flex flex-col items-center gap-1 rounded-2xl border border-black/[0.06] bg-white py-3 text-xs font-medium shadow-sm transition active:scale-95 dark:border-white/[0.08] dark:bg-neutral-900"
            >
              <span className="text-2xl">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <Card title="運動紀錄">
          {workouts.length === 0 && <p className="text-sm text-neutral-400">今天還沒有運動紀錄</p>}
          <ul className="flex flex-col gap-2">
            {workouts.map((w) => (
              <li key={w.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/5">
                <div>
                  <div className="font-medium">
                    {CATEGORY_LABEL[w.category]} {w.name} · {w.intensity}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {w.minutes} 分鐘{w.sets ? ` · ${w.sets.length} 組` : ""}
                    {w.note ? ` · ${w.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-violet-500">{w.kcal} kcal</span>
                  <button type="button" onClick={() => db.workouts.delete(w.id)} className="text-neutral-400">
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="飲食紀錄">
          {meals.length === 0 && <p className="text-sm text-neutral-400">今天還沒有飲食紀錄</p>}
          <ul className="flex flex-col gap-2">
            {meals.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/5">
                <div>
                  <div className="font-medium">
                    {m.meal} · {m.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-500">{m.kcal} kcal</span>
                  <button type="button" onClick={() => db.meals.delete(m.id)} className="text-neutral-400">
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal open={openForm === "ball"} title="新增球類運動" onClose={() => setOpenForm(null)}>
        <BallForm date={date} bodyWeightKg={profile.weight} onSave={saveWorkout} onCancel={() => setOpenForm(null)} />
      </Modal>
      <Modal open={openForm === "cardio"} title="新增有氧運動" onClose={() => setOpenForm(null)}>
        <CardioForm date={date} bodyWeightKg={profile.weight} onSave={saveWorkout} onCancel={() => setOpenForm(null)} />
      </Modal>
      <Modal open={openForm === "weight"} title="新增重訓" onClose={() => setOpenForm(null)}>
        <WeightForm date={date} bodyWeightKg={profile.weight} onSave={saveWorkout} onCancel={() => setOpenForm(null)} />
      </Modal>
      <Modal open={openForm === "meal"} title="新增飲食" onClose={() => setOpenForm(null)}>
        <MealForm date={date} onSave={saveMeal} onCancel={() => setOpenForm(null)} />
      </Modal>
    </Shell>
  );
}
