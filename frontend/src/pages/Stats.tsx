import { useLiveQuery } from "dexie-react-hooks";
import Calendar from "../components/charts/Calendar";
import WeeklyBarChart, { type WeeklyBarDatum } from "../components/charts/WeeklyBarChart";
import WeightLineChart, { type WeightPoint } from "../components/charts/WeightLineChart";
import Card from "../components/layout/Card";
import Shell from "../components/layout/Shell";
import { addDays, todayStr } from "../lib/date";
import { db } from "../lib/db";

function computeStreak(activeDates: Set<string>): number {
  let streak = 0;
  let cursor = todayStr();
  while (activeDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export default function Stats() {
  const workouts = useLiveQuery(() => db.workouts.toArray(), []) ?? [];
  const meals = useLiveQuery(() => db.meals.toArray(), []) ?? [];
  const bodyMetrics = useLiveQuery(() => db.bodyMetrics.orderBy("date").toArray(), []) ?? [];

  const activeDates = new Set<string>([...workouts.map((w) => w.date), ...meals.map((m) => m.date)]);
  const streak = computeStreak(activeDates);

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(todayStr(), i - 6));
  const weeklyData: WeeklyBarDatum[] = last7.map((date) => {
    const [, m, d] = date.split("-");
    return {
      date: `${m}/${d}`,
      burned: workouts.filter((w) => w.date === date).reduce((s, w) => s + w.kcal, 0),
      intake: meals.filter((m2) => m2.date === date).reduce((s, m2) => s + m2.kcal, 0),
    };
  });

  const weightData: WeightPoint[] = bodyMetrics.slice(-30).map((b) => {
    const [, m, d] = b.date.split("-");
    return { date: `${m}/${d}`, weight: b.weight };
  });

  const now = new Date();
  const activity: Record<string, number> = {};
  for (const date of activeDates) {
    const count = workouts.filter((w) => w.date === date).length + meals.filter((m) => m.date === date).length;
    activity[date] = count;
  }

  return (
    <Shell title="統計">
      <div className="flex flex-col gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">🔥 {streak}</div>
            <div className="text-sm text-neutral-400">連續紀錄天數</div>
          </div>
        </Card>

        <Card title="近 7 天消耗 / 攝取">
          <WeeklyBarChart data={weeklyData} />
        </Card>

        <Card title="體重趨勢">
          {weightData.length > 0 ? <WeightLineChart data={weightData} /> : <p className="text-sm text-neutral-400">還沒有體重紀錄，到「體態」頁更新吧</p>}
        </Card>

        <Card title="紀錄熱點">
          <Calendar year={now.getFullYear()} month={now.getMonth()} activity={activity} selectedDate={todayStr()} />
        </Card>
      </div>
    </Shell>
  );
}
