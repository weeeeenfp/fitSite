export type Gender = "male" | "female";
export type GoalType = "增肌" | "減脂" | "維持";
export type Intensity = "輕" | "中" | "高";
export type WorkoutCategory = "ball" | "cardio" | "weight";
export type MealType = "早餐" | "午餐" | "晚餐" | "點心";
export type PlanItemType = "重訓" | "有氧" | "球類" | "休息";
export type WeekDay = "週一" | "週二" | "週三" | "週四" | "週五" | "週六" | "週日";

export interface Profile {
  height: number; // cm
  weight: number; // kg，目前體重
  age: number;
  gender: Gender;
  bodyFat: number | null; // %，留空則用 Deurenberg 公式由 BMI 估算
  goalType: GoalType;
  goalWeight: number;
  goalBodyFat: number | null;
}

export interface SetRecord {
  weight: number; // kg
  reps: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  category: WorkoutCategory;
  name: string; // 例如「籃球」「跑步機」「臥推」，重訓需對應 WEIGHT_MET 的動作名稱
  intensity: Intensity;
  minutes: number;
  sets?: SetRecord[]; // 只有 category === "weight" 才有
  note: string;
  kcal: number; // 存檔當下算好，不要每次重算（體重會變動）
}

export interface MealLog {
  id: string;
  date: string;
  meal: MealType;
  name: string;
  kcal: number;
}

export interface BodyMetric {
  id?: number;
  date: string;
  weight: number;
  bodyFat: number | null;
}

export interface PlanItem {
  id: string;
  type: PlanItemType;
  name: string;
  sets?: number;
  reps?: string; // 例如 "8-10"
  minutes?: number;
  intensity?: Intensity;
  hint?: string; // 重量或執行建議
}

export interface PlanDay {
  day: WeekDay;
  focus: string; // 例如「推｜胸肩三頭」
  items: PlanItem[];
}

export interface Plan {
  daysPerWeek: number;
  days: PlanDay[]; // 固定 7 筆，週一到週日
  tips: string;
  done: Record<string, string[]>; // date -> 已完成的 PlanItem id 陣列
}
