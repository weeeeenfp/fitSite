import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import BallForm from "../components/forms/BallForm";
import CardioForm from "../components/forms/CardioForm";
import WeightForm from "../components/forms/WeightForm";
import Card from "../components/layout/Card";
import Modal from "../components/layout/Modal";
import Shell from "../components/layout/Shell";
import { todayStr } from "../lib/date";
import { db, getPlan, getProfile, savePlan } from "../lib/db";
import { generateRulePlan } from "../lib/planRules";
import type { PlanItem, WorkoutCategory, WorkoutLog } from "../types";

const TYPE_ICON: Record<PlanItem["type"], string> = { 重訓: "🏋️", 有氧: "🏃", 球類: "🏀", 休息: "😴" };
const TYPE_TO_CATEGORY: Partial<Record<PlanItem["type"], WorkoutCategory>> = { 重訓: "weight", 有氧: "cardio", 球類: "ball" };

export default function Plan() {
  const profile = useLiveQuery(() => getProfile(), []);
  const plan = useLiveQuery(() => getPlan(), []);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [activeItem, setActiveItem] = useState<{ item: PlanItem; category: WorkoutCategory } | null>(null);

  if (!profile) return null;

  const today = todayStr();
  const doneToday = plan?.done[today] ?? [];

  async function generate() {
    const next = generateRulePlan(profile!.goalType, daysPerWeek);
    await savePlan(next);
  }

  async function markDone(itemId: string) {
    if (!plan) return;
    const done = { ...plan.done, [today]: [...(plan.done[today] ?? []), itemId] };
    await savePlan({ ...plan, done });
  }

  async function saveFromPlan(log: WorkoutLog) {
    await db.workouts.add(log);
    if (activeItem) await markDone(activeItem.item.id);
    setActiveItem(null);
  }

  return (
    <Shell title="課表">
      <div className="flex flex-col gap-4">
        <Card title="產生課表">
          <label className="mb-3 flex flex-col gap-1 text-sm">
            每週訓練天數
            <div className="flex gap-2">
              {[3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDaysPerWeek(n)}
                  className={`flex-1 rounded-lg border px-3 py-2 ${daysPerWeek === n ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15"}`}
                >
                  {n} 天
                </button>
              ))}
            </div>
          </label>
          <button type="button" onClick={generate} className="w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white">
            產生規則式課表
          </button>
        </Card>

        {plan && (
          <>
            <Card>
              <p className="text-sm text-neutral-500">
                目前課表：每週 {plan.daysPerWeek} 天
              </p>
              {plan.tips && <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{plan.tips}</p>}
            </Card>

            {plan.days.map((day) => (
              <Card key={day.day} title={`${day.day}｜${day.focus}`}>
                <ul className="flex flex-col gap-2">
                  {day.items.map((item) => {
                    const category = TYPE_TO_CATEGORY[item.type];
                    const isDone = doneToday.includes(item.id);
                    return (
                      <li key={item.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/5">
                        <div>
                          <div className="font-medium">
                            {TYPE_ICON[item.type]} {item.name}
                            {item.intensity ? ` · ${item.intensity}` : ""}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {item.sets && item.reps ? `${item.sets} 組 x ${item.reps} 下` : ""}
                            {item.minutes ? `${item.sets ? " · " : ""}${item.minutes} 分鐘` : ""}
                            {item.hint ? ` · ${item.hint}` : ""}
                          </div>
                        </div>
                        {category ? (
                          <button
                            type="button"
                            disabled={isDone}
                            onClick={() => setActiveItem({ item, category })}
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${isDone ? "bg-green-500/20 text-green-600" : "bg-violet-600 text-white"}`}
                          >
                            {isDone ? "已完成" : "完成"}
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400">休息</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal open={activeItem?.category === "ball"} title={`完成：${activeItem?.item.name ?? ""}`} onClose={() => setActiveItem(null)}>
        {activeItem && (
          <BallForm
            date={today}
            bodyWeightKg={profile.weight}
            initial={{ name: activeItem.item.name, intensity: activeItem.item.intensity, minutes: activeItem.item.minutes, note: `課表項目：${activeItem.item.name}` }}
            onSave={saveFromPlan}
            onCancel={() => setActiveItem(null)}
          />
        )}
      </Modal>
      <Modal open={activeItem?.category === "cardio"} title={`完成：${activeItem?.item.name ?? ""}`} onClose={() => setActiveItem(null)}>
        {activeItem && (
          <CardioForm
            date={today}
            bodyWeightKg={profile.weight}
            initial={{ name: activeItem.item.name, intensity: activeItem.item.intensity, minutes: activeItem.item.minutes, note: `課表項目：${activeItem.item.name}` }}
            onSave={saveFromPlan}
            onCancel={() => setActiveItem(null)}
          />
        )}
      </Modal>
      <Modal open={activeItem?.category === "weight"} title={`完成：${activeItem?.item.name ?? ""}`} onClose={() => setActiveItem(null)}>
        {activeItem && (
          <WeightForm
            date={today}
            bodyWeightKg={profile.weight}
            initial={{
              name: activeItem.item.name,
              intensity: activeItem.item.intensity,
              minutes: activeItem.item.minutes ?? 20,
              note: `課表項目：${activeItem.item.name}`,
              setCount: activeItem.item.sets,
            }}
            onSave={saveFromPlan}
            onCancel={() => setActiveItem(null)}
          />
        )}
      </Modal>
    </Shell>
  );
}
