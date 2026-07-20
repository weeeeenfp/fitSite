import type { MuscleGroup } from "../../types";

// Motra 式解剖肌肉圖 —— 手刻 SVG，正面 + 背面。
// 每塊肌肉標記所屬肌群；選中變深、練過變紫。viewBox 120 x 300，中線 x=60。

interface MusclePath {
  muscle: MuscleGroup;
  d: string;
}

// 鏡射：右側 path 的 x 座標鏡射成左側（x' = 120 - x）。
function mirror(d: string): string {
  let i = 0;
  return d.replace(/-?\d+\.?\d*/g, (n) => {
    const v = parseFloat(n);
    const out = i % 2 === 0 ? 120 - v : v;
    i++;
    return String(Math.round(out * 10) / 10);
  });
}

const SKIN: string[] = [
  "M60 4 C69 4 76 12 76 22 C76 32 69 40 60 40 C51 40 44 32 44 22 C44 12 51 4 60 4 Z",
  "M55 38 L65 38 L64 50 L56 50 Z",
  "M42 50 C38 64 44 84 45 100 C46 128 42 150 48 170 L72 170 C78 150 74 128 75 100 C76 84 82 64 78 50 C68 44 52 44 42 50 Z",
  "M78 52 C90 55 95 66 94 80 C93 108 91 140 88 170 C87 176 81 176 80 170 C78 140 76 108 74 80 C73 66 70 52 78 52 Z",
  "M42 52 C30 55 25 66 26 80 C27 108 29 140 32 170 C33 176 39 176 40 170 C42 140 44 108 46 80 C47 66 50 52 42 52 Z",
  "M60 168 C72 168 80 178 80 196 C80 228 76 262 72 292 C71 298 63 298 62 292 C61 262 60 228 60 196 Z",
  "M60 168 C48 168 40 178 40 196 C40 228 44 262 48 292 C49 298 57 298 58 292 C59 262 60 228 60 196 Z",
];

const FRONT_R: MusclePath[] = [
  { muscle: "肩", d: "M61 52 C74 49 86 53 90 64 C88 72 80 72 72 68 C66 63 61 58 61 52 Z" },
  { muscle: "胸", d: "M60 60 C71 57 82 61 83 74 C83 86 72 90 60 88 Z" },
  { muscle: "手臂", d: "M80 68 C88 70 93 80 91 100 C90 112 83 110 81 98 C79 84 78 70 80 68 Z" },
  { muscle: "手臂", d: "M83 110 C90 114 93 132 90 158 C88 168 82 166 81 152 C80 134 80 116 83 110 Z" },
  { muscle: "核心", d: "M60 88 L73 88 C74 88 74 94 74 100 L74 150 C74 154 68 156 60 156 Z" },
  { muscle: "腿", d: "M60 172 C73 172 81 182 81 198 C81 224 76 242 70 244 C64 244 60 240 60 228 Z" },
  { muscle: "腿", d: "M61 246 C69 246 76 256 75 272 C74 286 69 294 63 294 L61 286 Z" },
];

const BACK_R: MusclePath[] = [
  { muscle: "肩", d: "M61 52 C74 49 86 53 90 64 C88 72 80 72 72 68 C66 63 61 58 61 52 Z" },
  { muscle: "背", d: "M60 58 L74 58 C76 58 76 66 74 72 C70 80 64 82 60 82 Z" },
  { muscle: "背", d: "M60 84 C70 84 76 92 74 108 C72 122 65 128 60 128 Z" },
  { muscle: "手臂", d: "M80 68 C88 70 93 80 91 100 C90 112 83 110 81 98 C79 84 78 70 80 68 Z" },
  { muscle: "手臂", d: "M83 110 C90 114 93 132 90 158 C88 168 82 166 81 152 C80 134 80 116 83 110 Z" },
  { muscle: "臀", d: "M60 150 C71 150 78 158 78 168 C78 178 70 182 60 180 Z" },
  { muscle: "腿", d: "M60 184 C72 184 80 194 80 210 C80 232 75 244 70 246 C64 246 60 242 60 230 Z" },
  { muscle: "腿", d: "M61 248 C69 248 76 258 75 274 C74 288 69 294 63 294 L61 286 Z" },
];

// 腹肌與胸溝分隔線（正面細節）
const FRONT_LINES_R = ["M60 108 L74 108", "M60 122 L74 122", "M60 136 L74 136"];
const FRONT_CENTER = ["M60 90 L60 156", "M60 62 L60 88"];

const FRONT_MUSCLES: MusclePath[] = [...FRONT_R, ...FRONT_R.map((m) => ({ muscle: m.muscle, d: mirror(m.d) }))];
const BACK_MUSCLES: MusclePath[] = [...BACK_R, ...BACK_R.map((m) => ({ muscle: m.muscle, d: mirror(m.d) }))];

export interface MuscleMapProps {
  selected: MuscleGroup | null;
  trained: Set<MuscleGroup>;
  onSelect: (m: MuscleGroup) => void;
}

function Figure({
  label,
  muscles,
  lines,
  selected,
  trained,
  onSelect,
}: {
  label: string;
  muscles: MusclePath[];
  lines?: string[];
  selected: MuscleGroup | null;
  trained: Set<MuscleGroup>;
  onSelect: (m: MuscleGroup) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 300" className="h-72 w-full touch-none">
        {SKIN.map((d, i) => (
          <path key={`s${i}`} d={d} className="fill-neutral-200 dark:fill-neutral-700" />
        ))}
        {muscles.map((m, i) => {
          const isSel = selected === m.muscle;
          const isTrained = trained.has(m.muscle);
          const fill = isSel ? "#0f172a" : isTrained ? "#8b5cf6" : "#c3c9d4";
          return (
            <path
              key={`m${i}`}
              d={m.d}
              fill={fill}
              stroke="#ffffff"
              strokeWidth={0.7}
              style={{ cursor: "pointer", transition: "fill 0.15s" }}
              onClick={() => onSelect(m.muscle)}
            />
          );
        })}
        {lines?.map((d, i) => (
          <g key={`l${i}`} className="pointer-events-none">
            <path d={d} stroke="#ffffff" strokeWidth={0.9} fill="none" opacity={0.7} />
            <path d={mirror(d)} stroke="#ffffff" strokeWidth={0.9} fill="none" opacity={0.7} />
          </g>
        ))}
      </svg>
      <span className="mt-1 text-xs font-medium text-neutral-400">{label}</span>
    </div>
  );
}

export default function MuscleMap({ selected, trained, onSelect }: MuscleMapProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Figure label="正面" muscles={FRONT_MUSCLES} lines={[...FRONT_LINES_R, ...FRONT_CENTER]} selected={selected} trained={trained} onSelect={onSelect} />
      <Figure label="背面" muscles={BACK_MUSCLES} selected={selected} trained={trained} onSelect={onSelect} />
    </div>
  );
}
