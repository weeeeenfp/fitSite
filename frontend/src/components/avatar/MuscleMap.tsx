import { useMemo } from "react";
import Model, { type IExerciseData, type IMuscleStats, type Muscle } from "react-body-highlighter";
import type { MuscleGroup } from "../../types";

// 解剖肌肉圖 —— 使用 react-body-highlighter（MIT）的人體解剖向量圖。
// 我們的七大肌群 ↔ 套件的細部肌肉對照表：

const GROUP_TO_MUSCLES: Record<MuscleGroup, Muscle[]> = {
  胸: ["chest"],
  背: ["trapezius", "upper-back", "lower-back"],
  肩: ["front-deltoids", "back-deltoids"],
  手臂: ["biceps", "triceps", "forearm"],
  核心: ["abs", "obliques"],
  腿: ["quadriceps", "hamstring", "calves", "adductor", "abductors", "left-soleus", "right-soleus"],
  臀: ["gluteal"],
};

const MUSCLE_TO_GROUP: Partial<Record<Muscle, MuscleGroup>> = {};
for (const [group, muscles] of Object.entries(GROUP_TO_MUSCLES) as [MuscleGroup, Muscle[]][]) {
  for (const m of muscles) MUSCLE_TO_GROUP[m] = group;
}

const COLOR_TRAINED = "#8b5cf6"; // 練過：紫
const COLOR_SELECTED = "#0f172a"; // 已選：深黑
const BODY_COLOR = "#d6dbe3"; // 未練：淺灰

export interface MuscleMapProps {
  selected: MuscleGroup | null;
  trained: Set<MuscleGroup>;
  onSelect: (m: MuscleGroup) => void;
}

export default function MuscleMap({ selected, trained, onSelect }: MuscleMapProps) {
  // frequency 1 = 練過（紫）；frequency >= 2 = 已選（深）。
  // 已選肌群塞兩筆保證 frequency 至少 2，不論有沒有練過。
  const data = useMemo<IExerciseData[]>(() => {
    const entries: IExerciseData[] = [];
    for (const g of trained) {
      entries.push({ name: `trained-${g}`, muscles: GROUP_TO_MUSCLES[g] });
    }
    if (selected) {
      entries.push({ name: "selected-1", muscles: GROUP_TO_MUSCLES[selected] });
      entries.push({ name: "selected-2", muscles: GROUP_TO_MUSCLES[selected] });
    }
    return entries;
  }, [selected, trained]);

  function handleClick({ muscle }: IMuscleStats) {
    const group = MUSCLE_TO_GROUP[muscle];
    if (group) onSelect(group);
  }

  const common = {
    data,
    bodyColor: BODY_COLOR,
    highlightedColors: [COLOR_TRAINED, COLOR_SELECTED, COLOR_SELECTED],
    onClick: handleClick,
    style: { width: "100%", padding: 0 },
  };

  return (
    <div className="grid grid-cols-2 items-start gap-3">
      <div className="flex flex-col items-center">
        <Model type="anterior" {...common} />
        <span className="mt-1.5 text-xs font-medium text-neutral-400">正面</span>
      </div>
      <div className="flex flex-col items-center">
        <Model type="posterior" {...common} />
        <span className="mt-1.5 text-xs font-medium text-neutral-400">背面</span>
      </div>
    </div>
  );
}
