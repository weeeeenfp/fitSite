import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import BallForm from "../components/forms/BallForm";
import CardioForm from "../components/forms/CardioForm";
import PlanItemForm from "../components/forms/PlanItemForm";
import WeightForm from "../components/forms/WeightForm";
import Card from "../components/layout/Card";
import Modal from "../components/layout/Modal";
import Shell from "../components/layout/Shell";
import { todayStr } from "../lib/date";
import { db, getPlan, getProfile, savePlan } from "../lib/db";
import { emptyPlan, generateRulePlan } from "../lib/planRules";
import type { Plan as PlanT, PlanItem, WorkoutCategory, WorkoutLog } from "../types";

const TYPE_ICON: Record<PlanItem["type"], string> = { 重訓: "🏋️", 有氧: "🏃", 球類: "🏀", 休息: "😴" };
const TYPE_TO_CATEGORY: Partial<Record<PlanItem["type"], WorkoutCategory>> = { 重訓: "weight", 有氧: "cardio", 球類: "ball" };

export default function Plan() {
  const profile = useLiveQuery(() => getProfile(), []);
  const plan = useLiveQuery(() => getPlan(), []);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [editMode, setEditMode] = useState(false);
  const [activeItem, setActiveItem] = useState<{ item: PlanItem; category: WorkoutCategory } | null>(null);
  const [editing, setEditing] = useState<{ dayIndex: number; item?: PlanItem } | null>(null);
  const [editFocusIndex, setEditFocusIndex] = useState<number | null>(null);

  if (!profile) return null;

  const today = todayStr();
  const doneToday = plan?.done[today] ?? [];

  async function generate() {
    await savePlan(generateRulePlan(profile!.goalType, daysPerWeek));
  }
  async function startCustom() {
    await savePlan(emptyPlan());
    setEditMode(true);
  }

  async function update(mut: (p: PlanT) => PlanT) {
    if (!plan) return;
    await savePlan(mut(structuredClone(plan)));
  }

  async function markDone(itemId: string) {
    await update((p) => {
      p.done[today] = [...(p.done[today] ?? []), itemId];
      return p;
    });
  }
  async function saveFromPlan(log: WorkoutLog) {
    await db.workouts.add(log);
    if (activeItem) await markDone(activeItem.item.id);
    setActiveItem(null);
  }

  async function saveItem(item: PlanItem) {
    if (!editing) return;
    const di = editing.dayIndex;
    await update((p) => {
      const items = p.days[di].items.filter((it) => it.type !== "休息" || it.id === item.id);
      const idx = items.findIndex((it) => it.id === item.id);
      if (idx >= 0) items[idx] = item;
      else items.push(item);
      p.days[di].items = items.length ? items : [item];
      return p;
    });
    setEditing(null);
  }
  async function deleteItem(dayIndex: number, itemId: string) {
    await update((p) => {
      const items = p.days[dayIndex].items.filter((it) => it.id !== itemId);
      p.days[dayIndex].items = items.length ? items : [{ id: crypto.randomUUID(), type: "休息", name: "休息" }];
      return p;
    });
  }
  async function setFocus(dayIndex: number, focus: string) {
    await update((p) => {
      p.days[dayIndex].focus = focus;
      return p;
    });
  }

  return (
    <Shell
      title="課表"
      headerRight={
        plan && (
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${editMode ? "bg-violet-600 text-white" : "bg-black/5 text-neutral-600 dark:bg-white/10 dark:text-neutral-300"}`}
          >
            {editMode ? "完成編輯" : "編輯"}
          </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <Card title="產生課表">
          <label className="mb-3 flex flex-col gap-1 text-sm">
            每週訓練天數（規則式）
            <div className="flex gap-2">
              {[3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDaysPerWeek(n)}
                  className={`flex-1 rounded-lg border px-3 py-2 ${daysPerWeek === n ? "border-violet-500 bg-violet-500/10 text-violet-600" : "border-black/15 dark:border-white/15"}`}
                >
                  {n} 天
                </button>
              ))}
            </div>
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={generate} className="flex-1 rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white">
              規則式自動排
            </button>
            <button type="button" onClick={startCustom} className="flex-1 rounded-lg border border-violet-500 py-2 text-sm font-semibold text-violet-600">
              自己排課表
            </button>
          </div>
        </Card>

        {plan && (
          <>
            {plan.tips && (
              <Card>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{plan.tips}</p>
              </Card>
            )}

            {plan.days.map((day, di) => (
              <Card key={day.day}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  {editMode && editFocusIndex === di ? (
                    <input
                      autoFocus
                      defaultValue={day.focus}
                      onBlur={(e) => {
                        setFocus(di, e.target.value.trim() || "訓練");
                        setEditFocusIndex(null);
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-black/15 px-2 py-1 text-base font-semibold dark:border-white/15 dark:bg-neutral-800"
                    />
                  ) : (
                    <h2
                      className={`text-base font-semibold text-neutral-800 dark:text-neutral-100 ${editMode ? "cursor-pointer" : ""}`}
                      onClick={() => editMode && setEditFocusIndex(di)}
                    >
                      {day.day}｜{day.focus}
                      {editMode && <span className="ml-1 text-xs text-neutral-400">✎</span>}
                    </h2>
                  )}
                </div>

                <ul className="flex flex-col gap-2">
                  {day.items.map((item) => {
                    const category = TYPE_TO_CATEGORY[item.type];
                    const isDone = doneToday.includes(item.id);
                    return (
                      <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/5">
                        <div className="min-w-0">
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
                        {editMode ? (
                          <div className="flex shrink-0 gap-1">
                            <button type="button" onClick={() => setEditing({ dayIndex: di, item })} className="rounded-full bg-black/5 px-2 py-1 text-xs dark:bg-white/10">
                              編輯
                            </button>
                            <button type="button" onClick={() => deleteItem(di, item.id)} className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500">
                              刪除
                            </button>
                          </div>
                        ) : category ? (
                          <button
                            type="button"
                            disabled={isDone}
                            onClick={() => setActiveItem({ item, category })}
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${isDone ? "bg-green-500/20 text-green-600" : "bg-violet-600 text-white"}`}
                          >
                            {isDone ? "已完成" : "完成"}
                          </button>
                        ) : (
                          <span className="shrink-0 text-xs text-neutral-400">休息</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {editMode && (
                  <button
                    type="button"
                    onClick={() => setEditing({ dayIndex: di })}
                    className="mt-2 w-full rounded-lg border border-dashed border-black/20 py-1.5 text-sm text-neutral-500 dark:border-white/20"
                  >
                    + 新增項目
                  </button>
                )}
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal open={!!editing} title={editing?.item ? "編輯項目" : "新增項目"} onClose={() => setEditing(null)}>
        {editing && <PlanItemForm initial={editing.item} onSave={saveItem} onCancel={() => setEditing(null)} />}
      </Modal>

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
