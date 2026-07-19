import type { Gender, Intensity, Profile, WorkoutCategory } from "../types";

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

// 重訓分動作：複合動作（多關節、大肌群）MET 較高，孤立動作（單關節、小肌群）較低。
export const WEIGHT_MET: Record<string, Record<Intensity, number>> = {
  // 複合動作
  "深蹲": { 輕: 4.5, 中: 6.0, 高: 7.5 },
  "硬舉": { 輕: 5.0, 中: 6.5, 高: 8.0 },
  "臥推": { 輕: 4.0, 中: 5.5, 高: 7.0 },
  "上斜臥推": { 輕: 4.0, 中: 5.5, 高: 7.0 },
  "肩推": { 輕: 4.0, 中: 5.5, 高: 7.0 },
  "槓鈴划船": { 輕: 4.0, 中: 5.5, 高: 7.0 },
  "引體向上": { 輕: 4.5, 中: 6.5, 高: 8.5 },
  "滑輪下拉": { 輕: 3.5, 中: 5.0, 高: 6.5 },
  "腿推": { 輕: 4.0, 中: 5.5, 高: 7.0 },
  // 孤立動作
  "二頭彎舉": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "三頭下壓": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "側平舉": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "腿彎舉": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "腿伸": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "核心捲腹": { 輕: 3.0, 中: 4.0, 高: 5.0 },
  "其他": { 輕: 3.5, 中: 5.0, 高: 6.0 },
};

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
