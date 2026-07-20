import type { Gender, Intensity, MuscleGroup, Profile, WorkoutCategory } from "../types";

// MET 對照表 —— 熱量計算的單一事實來源，改公式或數值只動這個檔案。

export const BALL_MET: Record<string, Record<Intensity, number>> = {
  "籃球": { 輕: 4.5, 中: 6.5, 高: 8.0 },
  "羽球": { 輕: 4.5, 中: 5.5, 高: 7.0 },
  "桌球": { 輕: 3.0, 中: 4.0, 高: 5.5 },
  "網球": { 輕: 5.0, 中: 7.3, 高: 8.0 },
  "排球": { 輕: 3.0, 中: 4.0, 高: 6.0 },
  "足球": { 輕: 5.0, 中: 7.0, 高: 10.0 },
  "棒壘球": { 輕: 4.0, 中: 5.0, 高: 6.0 },
  "高爾夫": { 輕: 3.5, 中: 4.3, 高: 4.8 },
  "其他": { 輕: 4.0, 中: 6.0, 高: 8.0 },
};

export const CARDIO_MET: Record<string, Record<Intensity, number>> = {
  "跑步機": { 輕: 6.0, 中: 8.3, 高: 11.0 },
  "戶外跑步": { 輕: 6.0, 中: 8.3, 高: 11.5 },
  "游泳": { 輕: 6.0, 中: 8.0, 高: 10.0 },
  "橢圓機": { 輕: 4.5, 中: 5.5, 高: 8.0 },
  "飛輪單車": { 輕: 5.5, 中: 7.0, 高: 10.5 },
  "健走": { 輕: 3.5, 中: 4.3, 高: 5.0 },
  "跳繩": { 輕: 8.0, 中: 11.0, 高: 12.3 },
  "划船機": { 輕: 4.8, 中: 7.0, 高: 8.5 },
  "登階爬梯": { 輕: 4.0, 中: 6.0, 高: 8.0 },
  "其他": { 輕: 4.0, 中: 6.0, 高: 8.0 },
};

// 重訓：先分肌群，再分器械 → 動作。複合動作（多關節、大肌群）MET 較高，孤立動作較低。
export type Equipment = "槓鈴" | "啞鈴" | "機械" | "纜繩" | "徒手" | "史密斯";

export interface WeightExercise {
  name: string;
  muscle: MuscleGroup;
  equipment: Equipment;
  met: Record<Intensity, number>;
}

const C = (輕: number, 中: number, 高: number): Record<Intensity, number> => ({ 輕, 中, 高 });

export const WEIGHT_EXERCISES: WeightExercise[] = [
  // 胸
  { name: "槓鈴臥推", muscle: "胸", equipment: "槓鈴", met: C(4.0, 5.5, 7.0) },
  { name: "啞鈴臥推", muscle: "胸", equipment: "啞鈴", met: C(4.0, 5.5, 7.0) },
  { name: "上斜槓鈴臥推", muscle: "胸", equipment: "槓鈴", met: C(4.0, 5.5, 7.0) },
  { name: "上斜啞鈴臥推", muscle: "胸", equipment: "啞鈴", met: C(4.0, 5.5, 7.0) },
  { name: "蝴蝶機夾胸", muscle: "胸", equipment: "機械", met: C(3.5, 4.5, 5.5) },
  { name: "纜繩夾胸", muscle: "胸", equipment: "纜繩", met: C(3.5, 4.5, 5.5) },
  { name: "伏地挺身", muscle: "胸", equipment: "徒手", met: C(3.8, 5.0, 6.5) },
  // 背
  { name: "引體向上", muscle: "背", equipment: "徒手", met: C(4.5, 6.5, 8.5) },
  { name: "滑輪下拉", muscle: "背", equipment: "纜繩", met: C(3.5, 5.0, 6.5) },
  { name: "槓鈴划船", muscle: "背", equipment: "槓鈴", met: C(4.0, 5.5, 7.0) },
  { name: "啞鈴單手划船", muscle: "背", equipment: "啞鈴", met: C(3.8, 5.0, 6.5) },
  { name: "坐姿划船", muscle: "背", equipment: "機械", met: C(3.5, 5.0, 6.5) },
  { name: "硬舉", muscle: "背", equipment: "槓鈴", met: C(5.0, 6.5, 8.0) },
  // 肩
  { name: "槓鈴肩推", muscle: "肩", equipment: "槓鈴", met: C(4.0, 5.5, 7.0) },
  { name: "啞鈴肩推", muscle: "肩", equipment: "啞鈴", met: C(4.0, 5.5, 7.0) },
  { name: "側平舉", muscle: "肩", equipment: "啞鈴", met: C(3.0, 4.0, 5.0) },
  { name: "臉拉", muscle: "肩", equipment: "纜繩", met: C(3.0, 4.0, 5.0) },
  { name: "機械肩推", muscle: "肩", equipment: "機械", met: C(3.5, 4.8, 6.0) },
  // 手臂
  { name: "槓鈴彎舉", muscle: "手臂", equipment: "槓鈴", met: C(3.2, 4.2, 5.2) },
  { name: "啞鈴彎舉", muscle: "手臂", equipment: "啞鈴", met: C(3.0, 4.0, 5.0) },
  { name: "三頭下壓", muscle: "手臂", equipment: "纜繩", met: C(3.0, 4.0, 5.0) },
  { name: "窄握臥推", muscle: "手臂", equipment: "槓鈴", met: C(3.8, 5.0, 6.5) },
  { name: "啞鈴三頭伸展", muscle: "手臂", equipment: "啞鈴", met: C(3.0, 4.0, 5.0) },
  // 核心
  { name: "捲腹", muscle: "核心", equipment: "徒手", met: C(3.0, 4.0, 5.0) },
  { name: "棒式", muscle: "核心", equipment: "徒手", met: C(3.0, 4.0, 5.0) },
  { name: "懸吊抬腿", muscle: "核心", equipment: "徒手", met: C(3.5, 4.5, 6.0) },
  { name: "纜繩捲腹", muscle: "核心", equipment: "纜繩", met: C(3.0, 4.2, 5.2) },
  // 腿
  { name: "槓鈴深蹲", muscle: "腿", equipment: "槓鈴", met: C(4.5, 6.0, 7.5) },
  { name: "腿推", muscle: "腿", equipment: "機械", met: C(4.0, 5.5, 7.0) },
  { name: "腿伸", muscle: "腿", equipment: "機械", met: C(3.0, 4.0, 5.0) },
  { name: "腿彎舉", muscle: "腿", equipment: "機械", met: C(3.0, 4.0, 5.0) },
  { name: "啞鈴弓箭步", muscle: "腿", equipment: "啞鈴", met: C(4.0, 5.5, 7.0) },
  { name: "羅馬尼亞硬舉", muscle: "腿", equipment: "槓鈴", met: C(4.5, 6.0, 7.5) },
  // 臀
  { name: "槓鈴臀推", muscle: "臀", equipment: "槓鈴", met: C(4.0, 5.5, 7.0) },
  { name: "髖外展", muscle: "臀", equipment: "機械", met: C(3.0, 4.0, 5.0) },
  { name: "相撲硬舉", muscle: "臀", equipment: "槓鈴", met: C(4.8, 6.2, 7.8) },
  { name: "纜繩後踢腿", muscle: "臀", equipment: "纜繩", met: C(3.0, 4.0, 5.0) },
  // 通用
  { name: "其他", muscle: "核心", equipment: "徒手", met: C(3.5, 5.0, 6.0) },
];

export const MUSCLE_GROUPS: MuscleGroup[] = ["胸", "背", "肩", "手臂", "核心", "腿", "臀"];

const EXERCISE_BY_NAME = new Map(WEIGHT_EXERCISES.map((e) => [e.name, e]));

export function exercisesByMuscle(muscle: MuscleGroup): WeightExercise[] {
  return WEIGHT_EXERCISES.filter((e) => e.muscle === muscle);
}

export function equipmentsOfMuscle(muscle: MuscleGroup): Equipment[] {
  const seen = new Set<Equipment>();
  for (const e of exercisesByMuscle(muscle)) seen.add(e.equipment);
  return [...seen];
}

export function muscleGroupOf(name: string): MuscleGroup | undefined {
  return EXERCISE_BY_NAME.get(name)?.muscle;
}

export const WEIGHT_MET: Record<string, Record<Intensity, number>> = Object.fromEntries(
  WEIGHT_EXERCISES.map((e) => [e.name, e.met]),
);

export const MET_TABLES: Record<WorkoutCategory, Record<string, Record<Intensity, number>>> = {
  ball: BALL_MET,
  cardio: CARDIO_MET,
  weight: WEIGHT_MET,
};

export function metOf(category: WorkoutCategory, name: string, intensity: Intensity): number {
  const table = MET_TABLES[category];
  const row = table[name] ?? table["其他"];
  return row[intensity];
}

export function kcalOf(met: number, kg: number, minutes: number): number {
  return Math.round(met * kg * (minutes / 60));
}

export function workoutKcal(
  category: WorkoutCategory,
  name: string,
  intensity: Intensity,
  minutes: number,
  bodyWeightKg: number,
): number {
  return kcalOf(metOf(category, name, intensity), bodyWeightKg, minutes);
}

export function bmrOf(p: Pick<Profile, "weight" | "height" | "age" | "gender">): number {
  const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
  return Math.round(p.gender === "female" ? base - 161 : base + 5);
}

// 每日基礎消耗（含日常活動係數 1.2，久坐族群保守估計）
export function dailyBase(p: Pick<Profile, "weight" | "height" | "age" | "gender">): number {
  return Math.round(bmrOf(p) * 1.2);
}

export function bmiOf(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

// Deurenberg 公式：體脂率 = 1.20×BMI + 0.23×年齡 − 10.8×性別(男1女0) − 5.4
export function estimateBodyFat(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  const bmi = bmiOf(weightKg, heightCm);
  const sexFactor = gender === "male" ? 1 : 0;
  const result = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return Math.round(Math.max(3, Math.min(60, result)) * 10) / 10;
}

export function effectiveBodyFat(p: Pick<Profile, "weight" | "height" | "age" | "gender" | "bodyFat">): number {
  return p.bodyFat ?? estimateBodyFat(p.weight, p.height, p.age, p.gender);
}
