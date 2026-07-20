import type { Gender, MuscleGroup } from "../../types";

// 2D 參數化人形幾何 —— 純函式：輸入身體數據，輸出 SVG 座標／路徑。
// 體態幾何生成的單一事實來源。座標系：viewBox 100 x 210，人形中心 x=50。

export type BodyView = "front" | "back" | "left" | "right";

export interface BodyParams {
  heightM: number;
  weightKg: number;
  bodyFatPct: number;
  gender: Gender;
}

export interface BodyShape {
  headRx: number;
  headRy: number;
  neckHalf: number;
  shoulderHalf: number;
  chestHalf: number;
  waistHalf: number;
  hipHalf: number;
  thighHalf: number;
  calfHalf: number;
  armUpperHalf: number;
  bellyDepth: number; // 側面肚子突出程度
  chestDepth: number; // 側面胸部厚度
  fatN: number;
  musN: number;
}

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

export function computeBodyShape(p: BodyParams): BodyShape {
  const male = p.gender !== "female";
  const H = p.heightM;
  const bmi = p.weightKg / (H * H);
  const fatN = clamp((p.bodyFatPct - (male ? 8 : 16)) / 28, 0, 1);
  const lean = p.weightKg * (1 - p.bodyFatPct / 100);
  const leanBMI = lean / (H * H);
  const musN = clamp((leanBMI - (male ? 15 : 13)) / 7, 0, 1);
  const bmiK = clamp((bmi - 21) / 12, -0.4, 1);

  return {
    headRx: 9.5,
    headRy: 11.5,
    neckHalf: 5 + musN * 1.5,
    shoulderHalf: 19 + musN * 8 + (male ? 1.5 : 0),
    chestHalf: 15 + musN * 4 + fatN * 4 + (male ? 0 : 1),
    waistHalf: 10.5 + fatN * 11 + bmiK * 2,
    hipHalf: 14 + fatN * 4 + (male ? 0 : 3),
    thighHalf: 6.5 + musN * 3 + fatN * 3.5,
    calfHalf: 4.5 + musN * 1.5 + fatN * 1,
    armUpperHalf: 3.6 + musN * 2.6 + fatN * 1.6,
    bellyDepth: 7 + fatN * 12 + bmiK * 2,
    chestDepth: 7 + musN * 4 + fatN * 2,
    fatN,
    musN,
  };
}

// Y 座標關鍵點（viewBox 高 210）
export const Y = {
  headTop: 8,
  headCy: 20,
  neckBottom: 40,
  shoulder: 45,
  chest: 74,
  waist: 106,
  hip: 126,
  crotch: 134,
  knee: 170,
  ankle: 202,
} as const;

const CX = 50;

// 正面／背面軀幹輪廓（對稱），回傳封閉 path d 字串。
export function torsoPath(s: BodyShape): string {
  const { neckHalf: n, shoulderHalf: sh, chestHalf: c, waistHalf: w, hipHalf: h } = s;
  return [
    `M ${CX - n} ${Y.neckBottom}`,
    `Q ${CX - sh - 2} ${Y.shoulder - 3} ${CX - sh} ${Y.shoulder + 3}`,
    `C ${CX - c} ${Y.chest} ${CX - w} ${Y.waist - 8} ${CX - w} ${Y.waist}`,
    `C ${CX - w} ${Y.waist + 8} ${CX - h} ${Y.hip - 6} ${CX - h} ${Y.hip}`,
    `Q ${CX - h} ${Y.crotch} ${CX - h + 5} ${Y.crotch}`,
    `L ${CX + h - 5} ${Y.crotch}`,
    `Q ${CX + h} ${Y.crotch} ${CX + h} ${Y.hip}`,
    `C ${CX + w} ${Y.hip - 6} ${CX + w} ${Y.waist + 8} ${CX + w} ${Y.waist}`,
    `C ${CX + w} ${Y.waist - 8} ${CX + c} ${Y.chest} ${CX + sh} ${Y.shoulder + 3}`,
    `Q ${CX + sh + 2} ${Y.shoulder - 3} ${CX + n} ${Y.neckBottom}`,
    "Z",
  ].join(" ");
}

// 手臂（左右各一），以圓角膠囊近似。回傳 {x,y,w,h,rx}
export function armRect(s: BodyShape, side: "l" | "r") {
  const width = s.armUpperHalf * 2;
  const gap = 1.5;
  const x = side === "r" ? CX + s.shoulderHalf - width + 3 : CX - s.shoulderHalf - 3 - gap;
  return { x, y: Y.shoulder + 2, w: width, h: 66, rx: width / 2 };
}

// 腿（左右各一）
export function legRect(s: BodyShape, side: "l" | "r") {
  const width = s.thighHalf * 1.7;
  const x = side === "r" ? CX + 1.5 : CX - 1.5 - width;
  return { x, y: Y.hip - 4, w: width, h: Y.ankle - Y.hip + 4, rx: width / 2 };
}

// 側面整體輪廓（頭到臀），凸顯肚子厚度。回傳封閉 path d。
export function sidePath(s: BodyShape): string {
  const backX = CX - 6; // 背部基準線
  const belly = backX + 10 + s.bellyDepth; // 肚子最前緣
  const chest = backX + 8 + s.chestDepth;
  return [
    `M ${backX + 2} ${Y.neckBottom}`,
    // 前側：胸 → 肚子 → 髖
    `C ${chest} ${Y.chest - 4} ${belly} ${Y.chest + 8} ${belly} ${Y.waist}`,
    `C ${belly} ${Y.waist + 8} ${backX + 12} ${Y.hip} ${backX + 10} ${Y.crotch}`,
    `L ${backX - 2} ${Y.crotch}`,
    // 後側：臀 → 下背 → 上背
    `C ${backX - 8 - s.fatN * 3} ${Y.hip} ${backX - 6} ${Y.waist + 6} ${backX - 4} ${Y.waist}`,
    `C ${backX - 6} ${Y.chest + 6} ${backX - 4} ${Y.chest} ${backX + 2} ${Y.neckBottom}`,
    "Z",
  ].join(" ");
}

// 側面手臂
export function sideArmRect(s: BodyShape) {
  const width = s.armUpperHalf * 2;
  return { x: CX - 2, y: Y.shoulder + 2, w: width, h: 60, rx: width / 2 };
}

// 側面腿
export function sideLegRect(s: BodyShape) {
  const width = s.thighHalf * 1.8;
  return { x: CX - 6, y: Y.hip - 4, w: width, h: Y.ankle - Y.hip + 4, rx: width / 2 };
}

export interface MuscleRegion {
  muscle: MuscleGroup;
  kind: "ellipse" | "rect";
  // ellipse: cx,cy,rx,ry ; rect: x,y,w,h,rx
  cx?: number; cy?: number; rx?: number; ry?: number;
  x?: number; y?: number; w?: number; h?: number;
}

// 各視圖上可點擊的肌群區域（座標依 shape 動態算）。
export function muscleRegions(view: BodyView, s: BodyShape): MuscleRegion[] {
  if (view === "front") {
    return [
      { muscle: "肩", kind: "ellipse", cx: CX - s.shoulderHalf + 4, cy: Y.shoulder + 5, rx: 6, ry: 5 },
      { muscle: "肩", kind: "ellipse", cx: CX + s.shoulderHalf - 4, cy: Y.shoulder + 5, rx: 6, ry: 5 },
      { muscle: "胸", kind: "rect", x: CX - s.chestHalf + 2, y: Y.shoulder + 8, w: s.chestHalf * 2 - 4, h: 20, rx: 6 },
      { muscle: "核心", kind: "rect", x: CX - s.waistHalf + 2, y: Y.chest + 6, w: s.waistHalf * 2 - 4, h: Y.waist - Y.chest, rx: 6 },
      { muscle: "手臂", kind: "rect", ...armRectRegion(s, "l") },
      { muscle: "手臂", kind: "rect", ...armRectRegion(s, "r") },
      { muscle: "腿", kind: "rect", ...legRectRegion(s, "l") },
      { muscle: "腿", kind: "rect", ...legRectRegion(s, "r") },
    ];
  }
  if (view === "back") {
    return [
      { muscle: "肩", kind: "ellipse", cx: CX - s.shoulderHalf + 4, cy: Y.shoulder + 5, rx: 6, ry: 5 },
      { muscle: "肩", kind: "ellipse", cx: CX + s.shoulderHalf - 4, cy: Y.shoulder + 5, rx: 6, ry: 5 },
      { muscle: "背", kind: "rect", x: CX - s.chestHalf + 2, y: Y.shoulder + 8, w: s.chestHalf * 2 - 4, h: 26, rx: 6 },
      { muscle: "手臂", kind: "rect", ...armRectRegion(s, "l") },
      { muscle: "手臂", kind: "rect", ...armRectRegion(s, "r") },
      { muscle: "臀", kind: "rect", x: CX - s.hipHalf + 3, y: Y.hip - 2, w: s.hipHalf * 2 - 6, h: 14, rx: 6 },
      { muscle: "腿", kind: "rect", ...legRectRegion(s, "l") },
      { muscle: "腿", kind: "rect", ...legRectRegion(s, "r") },
    ];
  }
  // 側面
  return [
    { muscle: "核心", kind: "ellipse", cx: CX + 4 + s.bellyDepth * 0.3, cy: Y.waist - 6, rx: 7, ry: 10 },
    { muscle: "腿", kind: "rect", ...sideLegRect(s) },
  ];
}

function armRectRegion(s: BodyShape, side: "l" | "r") {
  const a = armRect(s, side);
  return { x: a.x, y: a.y, w: a.w, h: 40, rx: a.rx };
}
function legRectRegion(s: BodyShape, side: "l" | "r") {
  const l = legRect(s, side);
  return { x: l.x, y: l.y + 2, w: l.w, h: 46, rx: l.rx };
}
