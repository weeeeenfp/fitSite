import Dexie, { type Table } from "dexie";
import type { BodyMetric, MealLog, Plan, Profile, WorkoutLog } from "../types";

class FitLogDB extends Dexie {
  profile!: Table<Profile & { id: 1 }, 1>;
  workouts!: Table<WorkoutLog, string>;
  meals!: Table<MealLog, string>;
  bodyMetrics!: Table<BodyMetric, number>;
  plan!: Table<Plan & { id: 1 }, 1>;

  constructor() {
    super("fit-log");
    this.version(1).stores({
      profile: "id",
      workouts: "id, date, category",
      meals: "id, date",
      bodyMetrics: "++id, date",
      plan: "id",
    });
  }
}

export const db = new FitLogDB();

export async function getProfile(): Promise<Profile | undefined> {
  const row = await db.profile.get(1);
  if (!row) return undefined;
  const { id: _id, ...profile } = row;
  return profile;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await db.profile.put({ ...profile, id: 1 });
}

export async function getPlan(): Promise<Plan | undefined> {
  const row = await db.plan.get(1);
  if (!row) return undefined;
  const { id: _id, ...plan } = row;
  return plan;
}

export async function savePlan(plan: Plan): Promise<void> {
  await db.plan.put({ ...plan, id: 1 });
}

export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.profile.clear(),
    db.workouts.clear(),
    db.meals.clear(),
    db.bodyMetrics.clear(),
    db.plan.clear(),
  ]);
}

export interface BackupPayload {
  profile?: Profile;
  workouts: WorkoutLog[];
  meals: MealLog[];
  bodyMetrics: BodyMetric[];
  plan?: Plan;
}

export async function exportBackup(): Promise<BackupPayload> {
  const [profile, workouts, meals, bodyMetrics, plan] = await Promise.all([
    getProfile(),
    db.workouts.toArray(),
    db.meals.toArray(),
    db.bodyMetrics.toArray(),
    getPlan(),
  ]);
  return { profile, workouts, meals, bodyMetrics, plan };
}

export async function importBackup(data: BackupPayload): Promise<void> {
  await clearAllData();
  await Promise.all([
    data.profile ? saveProfile(data.profile) : Promise.resolve(),
    data.plan ? savePlan(data.plan) : Promise.resolve(),
    db.workouts.bulkAdd(data.workouts ?? []),
    db.meals.bulkAdd(data.meals ?? []),
    db.bodyMetrics.bulkAdd((data.bodyMetrics ?? []).map(({ id: _id, ...rest }) => rest)),
  ]);
}
