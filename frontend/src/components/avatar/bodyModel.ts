import * as THREE from "three";

// 純函式：輸入身體數據，輸出一個 THREE.Group（球體+圓柱體組成的參數化人形）。
// 純程式生成的幾何體，不依賴外部模型檔，離線也能跑、載入快。

export interface BodyParams {
  heightM: number;
  weightKg: number;
  bodyFatPct: number;
  gender: "male" | "female";
  color: number;
  opacity?: number;
}

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

export function buildBodyGroup(p: BodyParams): THREE.Group {
  const male = p.gender !== "female";
  const H = p.heightM;
  const bmi = p.weightKg / (H * H);
  // 體脂 → 0~1 的「胖度」插值
  const fatN = clamp((p.bodyFatPct - (male ? 8 : 16)) / 28, 0, 1);
  // 去脂體重估算「肌肉量」插值
  const lean = p.weightKg * (1 - p.bodyFatPct / 100);
  const leanBMI = lean / (H * H);
  const musN = clamp((leanBMI - (male ? 15 : 13)) / 7, 0, 1);
  const widthK = clamp(0.82 + (bmi - 19) * 0.03, 0.78, 1.35);

  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: p.color,
    roughness: 0.55,
    metalness: 0.08,
    transparent: (p.opacity ?? 1) < 1,
    opacity: p.opacity ?? 1,
  });

  function sphere(rx: number, ry: number, rz: number, x: number, y: number, z = 0): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), mat);
    m.scale.set(rx, ry, rz);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  }

  function limb(rTop: number, rBottom: number, height: number, x: number, y: number, z = 0): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, height, 14), mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  }

  function box(w: number, h: number, d: number, x: number, y: number, z = 0): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  }

  // 比例都用身高 H 的百分比推算；肩寬/手臂粗細依 musN（練得壯不壯）與
  // fatN（脂肪多不多）加權，widthK 反映整體 BMI 胖瘦。
  const headR = H * 0.065;
  const neckLen = H * 0.035;
  const shoulderHalf = (H * 0.13 * widthK * (0.92 + musN * 0.22)) / 2;
  const chestHalfW = (H * 0.19 * widthK * (0.9 + fatN * 0.15 + musN * 0.1)) / 2;
  const chestH = H * 0.16;
  const waistHalfW = (H * 0.155 * widthK * (0.85 + fatN * 0.4)) / 2;
  const waistH = H * 0.1;
  const pelvisHalfW = (H * 0.18 * widthK) / 2;
  const pelvisH = H * 0.09;

  const armLen = H * 0.19;
  const upperArmR = H * 0.028 * (0.85 + musN * 0.35 + fatN * 0.15);
  const forearmR = upperArmR * 0.82;
  const legLen = H * 0.245;
  const thighR = H * 0.047 * (0.85 + musN * 0.3 + fatN * 0.2);
  const shinR = thighR * 0.68;
  const footLen = H * 0.055;
  const hipHalfW = pelvisHalfW * 0.58;

  let y = 0;

  // 腳
  box(H * 0.045, H * 0.018, footLen, -hipHalfW, y + H * 0.009, footLen * 0.2);
  box(H * 0.045, H * 0.018, footLen, hipHalfW, y + H * 0.009, footLen * 0.2);
  y += H * 0.018;

  // 小腿
  const shinY = y + legLen * 0.5;
  limb(shinR * 0.85, shinR, legLen, -hipHalfW, shinY);
  limb(shinR * 0.85, shinR, legLen, hipHalfW, shinY);
  y += legLen;

  // 大腿
  const thighY = y + legLen * 0.5;
  limb(thighR * 0.85, thighR, legLen, -hipHalfW, thighY);
  limb(thighR * 0.85, thighR, legLen, hipHalfW, thighY);
  y += legLen;

  // 骨盆
  const pelvisY = y + pelvisH * 0.5;
  sphere(pelvisHalfW, pelvisH * 0.6, pelvisHalfW * 0.7, 0, pelvisY);
  y += pelvisH * 0.75;

  // 腰
  const waistY = y + waistH * 0.5;
  sphere(waistHalfW, waistH * 0.65, waistHalfW * 0.7, 0, waistY);
  y += waistH * 0.75;

  // 胸／軀幹
  const chestY = y + chestH * 0.5;
  sphere(chestHalfW, chestH * 0.62, chestHalfW * 0.72, 0, chestY);
  y += chestH * 0.85;

  // 肩＋手臂
  const shoulderY = y;
  const armX = shoulderHalf + upperArmR * 0.4;
  const upperArmY = shoulderY - armLen * 0.5;
  limb(upperArmR, upperArmR * 0.9, armLen, -armX, upperArmY);
  limb(upperArmR, upperArmR * 0.9, armLen, armX, upperArmY);
  const forearmY = upperArmY - armLen * 0.5 - armLen * 0.45;
  limb(forearmR, forearmR * 0.8, armLen * 0.9, -armX, forearmY);
  limb(forearmR, forearmR * 0.8, armLen * 0.9, armX, forearmY);

  // 頸
  const neckY = shoulderY + neckLen * 0.5;
  limb(headR * 0.4, headR * 0.45, neckLen, 0, neckY);
  y = shoulderY + neckLen;

  // 頭
  sphere(headR * 0.8, headR, headR * 0.85, 0, y + headR);

  return g;
}
