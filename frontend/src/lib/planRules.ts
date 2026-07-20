import type { GoalType, Intensity, Plan, PlanDay, PlanItem, WeekDay } from "../types";

// 規則式排課邏輯 —— 單一事實來源，改排課邏輯只動這個檔案。

const WEEKDAYS: WeekDay[] = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];

let seq = 0;
function nextId(): string {
  seq += 1;
  return `plan-item-${Date.now()}-${seq}`;
}

function weightItem(name: string, sets: number, reps: string, intensity: Intensity, hint: string): PlanItem {
  return { id: nextId(), type: "重訓", name, sets, reps, intensity, hint };
}

function cardioItem(name: string, minutes: number, intensity: Intensity, hint: string): PlanItem {
  return { id: nextId(), type: "有氧", name, minutes, intensity, hint };
}

function restItem(hint: string): PlanItem {
  return { id: nextId(), type: "休息", name: "休息", hint };
}

function restDay(day: WeekDay, hint = "讓肌肉恢復，睡眠與蛋白質攝取比訓練本身更重要"): PlanDay {
  return { day, focus: "休息", items: [restItem(hint)] };
}

// 動作模板：對應 lib/calorie.ts 的 WEIGHT_MET 動作名稱
function fullBodyDay(day: WeekDay, intensity: Intensity, variant: "A" | "B" | "C" = "A"): PlanDay {
  const templates: Record<"A" | "B" | "C", { focus: string; items: PlanItem[] }> = {
    A: {
      focus: "全身循環 A｜槓鈴深蹲＋推＋拉",
      items: [
        weightItem("槓鈴深蹲", 3, "8-10", intensity, "重量抓能標準完成組數的重量"),
        weightItem("槓鈴臥推", 3, "8-10", intensity, "掌握好肩胛穩定再加重"),
        weightItem("槓鈴划船", 3, "8-10", intensity, "背部夾緊，避免用甩的"),
        weightItem("捲腹", 3, "12-15", intensity, "動作放慢，避免用脖子代償"),
      ],
    },
    B: {
      focus: "全身循環 B｜硬舉＋槓鈴肩推＋滑輪",
      items: [
        weightItem("硬舉", 3, "6-8", intensity, "背打直，重量寧可保守"),
        weightItem("槓鈴肩推", 3, "8-10", intensity, "核心收緊避免腰椎代償"),
        weightItem("滑輪下拉", 3, "10-12", intensity, "肩胛下沉再拉"),
        weightItem("捲腹", 3, "12-15", intensity, "動作放慢"),
      ],
    },
    C: {
      focus: "全身循環 C｜腿推＋上斜槓鈴臥推＋引體",
      items: [
        weightItem("腿推", 3, "10-12", intensity, "膝蓋方向對齊腳尖"),
        weightItem("上斜槓鈴臥推", 3, "8-10", intensity, "訓練上胸"),
        weightItem("引體向上", 3, "力竭前1-2下", intensity, "做不到全次數可用輔助帶"),
        weightItem("捲腹", 3, "12-15", intensity, "動作放慢"),
      ],
    },
  };
  const t = templates[variant];
  return { day, focus: t.focus, items: t.items };
}

function pushDay(day: WeekDay, intensity: Intensity): PlanDay {
  return {
    day,
    focus: "推｜胸肩三頭",
    items: [
      weightItem("槓鈴臥推", 4, "6-10", intensity, "主項目，力竭前1-2下停止"),
      weightItem("上斜槓鈴臥推", 3, "8-12", intensity, "加強上胸"),
      weightItem("槓鈴肩推", 3, "8-10", intensity, "核心收緊"),
      weightItem("三頭下壓", 3, "10-15", intensity, "動作全程控制"),
    ],
  };
}

function pullDay(day: WeekDay, intensity: Intensity): PlanDay {
  return {
    day,
    focus: "拉｜背二頭",
    items: [
      weightItem("硬舉", 3, "5-8", intensity, "主項目，注意背部姿勢"),
      weightItem("槓鈴划船", 3, "8-10", intensity, "背部夾緊"),
      weightItem("滑輪下拉", 3, "10-12", intensity, "肩胛下沉再拉"),
      weightItem("槓鈴彎舉", 3, "10-15", intensity, "避免甩動借力"),
    ],
  };
}

function legDay(day: WeekDay, intensity: Intensity): PlanDay {
  return {
    day,
    focus: "腿｜下肢",
    items: [
      weightItem("槓鈴深蹲", 4, "6-10", intensity, "主項目，力竭前1-2下停止"),
      weightItem("腿推", 3, "10-12", intensity, "加強量"),
      weightItem("腿彎舉", 3, "10-15", intensity, "訓練後側鏈"),
      weightItem("腿伸", 3, "10-15", intensity, "收尾動作"),
    ],
  };
}

function upperDay(day: WeekDay, intensity: Intensity): PlanDay {
  return {
    day,
    focus: "上肢｜胸背肩手臂",
    items: [
      weightItem("槓鈴臥推", 3, "8-10", intensity, "主項目"),
      weightItem("槓鈴划船", 3, "8-10", intensity, "背部夾緊"),
      weightItem("槓鈴肩推", 3, "8-10", intensity, "核心收緊"),
      weightItem("槓鈴彎舉", 2, "10-15", intensity, "收尾"),
      weightItem("三頭下壓", 2, "10-15", intensity, "收尾"),
    ],
  };
}

function lowerDay(day: WeekDay, intensity: Intensity): PlanDay {
  return {
    day,
    focus: "下肢｜腿臀核心",
    items: [
      weightItem("槓鈴深蹲", 4, "6-10", intensity, "主項目"),
      weightItem("硬舉", 3, "6-8", intensity, "注意背部姿勢"),
      weightItem("腿彎舉", 3, "10-15", intensity, "後側鏈"),
      weightItem("捲腹", 3, "12-15", intensity, "收尾"),
    ],
  };
}

function cardioDay(day: WeekDay, name: string, minutes: number, intensity: Intensity, hint: string): PlanDay {
  return { day, focus: `有氧｜${name}`, items: [cardioItem(name, minutes, intensity, hint)] };
}

function hiitDay(day: WeekDay): PlanDay {
  return {
    day,
    focus: "HIIT｜間歇有氧",
    items: [
      cardioItem("跳繩", 20, "高", "30秒快跳＋30秒休息，重複循環"),
      cardioItem("飛輪單車", 15, "高", "衝刺30秒＋緩騎90秒交替"),
    ],
  };
}

function buildDays(pattern: Partial<Record<WeekDay, PlanDay>>): PlanDay[] {
  return WEEKDAYS.map((day) => pattern[day] ?? restDay(day));
}

function bulkPlan(daysPerWeek: 3 | 4 | 5): { days: PlanDay[]; tips: string } {
  if (daysPerWeek === 3) {
    return {
      days: buildDays({
        週一: fullBodyDay("週一", "中", "A"),
        週三: fullBodyDay("週三", "中", "B"),
        週五: fullBodyDay("週五", "中", "C"),
      }),
      tips: "增肌 3 天全身 A/B/C 循環：每個動作力竭前 1-2 下停止，組間休息 90-120 秒，蛋白質攝取抓每公斤體重 1.6-2.2 克。",
    };
  }
  if (daysPerWeek === 4) {
    return {
      days: buildDays({
        週一: upperDay("週一", "中"),
        週二: lowerDay("週二", "中"),
        週四: upperDay("週四", "中"),
        週五: lowerDay("週五", "中"),
      }),
      tips: "增肌 4 天上/下肢分化：兩次上肢、兩次下肢，強度可週週漸進（漸進超負荷），週三、六、日安排休息讓肌肉恢復。",
    };
  }
  return {
    days: buildDays({
      週一: pushDay("週一", "中"),
      週二: pullDay("週二", "中"),
      週三: legDay("週三", "中"),
      週五: pushDay("週五", "高"),
      週六: pullDay("週六", "高"),
    }),
    tips: "增肌 5 天推/拉/腿分化：第二輪（週五、六）可以提高強度到高，週四、日安排休息避免過度訓練。",
  };
}

function cutPlan(daysPerWeek: 3 | 4 | 5): { days: PlanDay[]; tips: string } {
  if (daysPerWeek === 3) {
    return {
      days: buildDays({
        週一: fullBodyDay("週一", "中", "A"),
        週三: hiitDay("週三"),
        週五: fullBodyDay("週五", "中", "B"),
      }),
      tips: "減脂 3 天：維持重訓保留肌肉量，避免天天高強度重訓，中間穿插一天 HIIT 有氧衝刺熱量赤字。",
    };
  }
  if (daysPerWeek === 4) {
    return {
      days: buildDays({
        週一: fullBodyDay("週一", "中", "A"),
        週二: cardioDay("週二", "跑步機", 30, "中", "配速抓能維持對話但會喘"),
        週四: fullBodyDay("週四", "中", "B"),
        週五: hiitDay("週五"),
      }),
      tips: "減脂 4 天：全身重訓維持肌肉量＋兩天有氧/HIIT 拉開熱量赤字，避免重訓與高強度有氧連續兩天。",
    };
  }
  return {
    days: buildDays({
      週一: fullBodyDay("週一", "中", "A"),
      週二: cardioDay("週二", "飛輪單車", 30, "中", "穩定心率有氧"),
      週三: fullBodyDay("週三", "中", "B"),
      週五: hiitDay("週五"),
      週六: cardioDay("週六", "健走", 45, "輕", "低強度恢復性有氧，兼顧多走動"),
    }),
    tips: "減脂 5 天：重訓維持全身循環避免天天高強度，有氧強度輕重交替，注意飲食熱量赤字不要超過每日基礎消耗的 20-25%。",
  };
}

function maintainPlan(daysPerWeek: 3 | 4 | 5): { days: PlanDay[]; tips: string } {
  if (daysPerWeek === 3) {
    return {
      days: buildDays({
        週一: fullBodyDay("週一", "中", "A"),
        週三: fullBodyDay("週三", "中", "B"),
        週五: cardioDay("週五", "游泳", 30, "中", "全身性有氧，保護關節"),
      }),
      tips: "維持 3 天：全身循環兩天＋一天中強度有氧，重點是規律而非追求進步幅度。",
    };
  }
  if (daysPerWeek === 4) {
    return {
      days: buildDays({
        週一: fullBodyDay("週一", "中", "A"),
        週二: cardioDay("週二", "健走", 30, "輕", "維持活動量"),
        週四: fullBodyDay("週四", "中", "C"),
        週六: cardioDay("週六", "游泳", 30, "中", "全身性有氧"),
      }),
      tips: "維持 4 天：全身重訓兩天＋有氧兩天，強度維持中等，重點是長期可持續。",
    };
  }
  return {
    days: buildDays({
      週一: fullBodyDay("週一", "中", "A"),
      週二: cardioDay("週二", "健走", 30, "輕", "維持活動量"),
      週三: fullBodyDay("週三", "中", "B"),
      週五: fullBodyDay("週五", "中", "C"),
      週六: cardioDay("週六", "游泳", 30, "中", "全身性有氧"),
    }),
    tips: "維持 5 天：全身循環三天＋有氧兩天，強度維持中等即可，不需要天天挑戰高強度。",
  };
}

export function generateRulePlan(goalType: GoalType, daysPerWeek: number): Plan {
  const clamped = (daysPerWeek <= 3 ? 3 : daysPerWeek >= 5 ? 5 : 4) as 3 | 4 | 5;
  const builder = goalType === "增肌" ? bulkPlan : goalType === "減脂" ? cutPlan : maintainPlan;
  const { days, tips } = builder(clamped);
  return { daysPerWeek: clamped, days, tips, done: {} };
}

// 空白課表：7 天全休息，供使用者自訂。
export function emptyPlan(): Plan {
  return {
    daysPerWeek: 0,
    days: WEEKDAYS.map((day) => restDay(day, "點下方新增項目自己排課表")),
    tips: "",
    done: {},
  };
}
