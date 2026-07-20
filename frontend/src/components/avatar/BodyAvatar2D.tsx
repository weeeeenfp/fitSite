import { useMemo } from "react";
import type { Gender, MuscleGroup } from "../../types";
import {
  armRect,
  type BodyShape,
  type BodyView,
  computeBodyShape,
  legRect,
  muscleRegions,
  sideArmRect,
  sideLegRect,
  sidePath,
  torsoPath,
  Y,
} from "./bodyModel2d";

interface BodyState {
  heightM: number;
  weightKg: number;
  bodyFatPct: number;
}

interface BodyAvatar2DProps {
  gender: Gender;
  current: BodyState;
  goal: BodyState;
  selectedMuscle: MuscleGroup | null;
  onSelectMuscle: (m: MuscleGroup) => void;
}

const VIEW_LABEL: Record<BodyView, string> = { front: "正面", back: "背面", left: "左側", right: "右側" };
const VIEWS: BodyView[] = ["front", "back", "left", "right"];
const CX = 50;

function Figure({ shape, mode }: { shape: BodyShape; mode: "fill" | "outline"; }) {
  const outline = mode === "outline";
  const common = outline
    ? { fill: "none", stroke: "#22c55e", strokeWidth: 1.6, strokeDasharray: "3 2.5", opacity: 0.9 }
    : { fill: "url(#bodyGrad)", stroke: "none" as const };

  const headFront = (
    <>
      <ellipse cx={CX} cy={Y.headCy} rx={shape.headRx} ry={shape.headRy} {...common} />
      <path d={torsoPath(shape)} {...common} />
      {(["l", "r"] as const).map((sd) => {
        const a = armRect(shape, sd);
        return <rect key={sd} x={a.x} y={a.y} width={a.w} height={a.h} rx={a.rx} {...common} />;
      })}
      {(["l", "r"] as const).map((sd) => {
        const l = legRect(shape, sd);
        return <rect key={sd} x={l.x} y={l.y} width={l.w} height={l.h} rx={l.rx} {...common} />;
      })}
    </>
  );

  return headFront;
}

function SideFigure({ shape, mode, flip }: { shape: BodyShape; mode: "fill" | "outline"; flip: boolean }) {
  const outline = mode === "outline";
  const common = outline
    ? { fill: "none", stroke: "#22c55e", strokeWidth: 1.6, strokeDasharray: "3 2.5", opacity: 0.9 }
    : { fill: "url(#bodyGrad)", stroke: "none" as const };
  const leg = sideLegRect(shape);
  const arm = sideArmRect(shape);
  return (
    <g transform={flip ? `translate(${CX * 2} 0) scale(-1 1)` : undefined}>
      <ellipse cx={CX} cy={Y.headCy} rx={shape.headRx * 0.92} ry={shape.headRy} {...common} />
      <path d={sidePath(shape)} {...common} />
      <rect x={leg.x} y={leg.y} width={leg.w} height={leg.h} rx={leg.rx} {...common} />
      <rect x={arm.x} y={arm.y} width={arm.w} height={arm.h} rx={arm.rx} {...common} />
    </g>
  );
}

function ViewPanel({
  view,
  current,
  goal,
  selectedMuscle,
  onSelectMuscle,
}: {
  view: BodyView;
  current: BodyShape;
  goal: BodyShape;
  selectedMuscle: MuscleGroup | null;
  onSelectMuscle: (m: MuscleGroup) => void;
}) {
  const isSide = view === "left" || view === "right";
  const regions = muscleRegions(isSide ? (view === "left" ? "left" : "right") : view, current);

  return (
    <div className="flex flex-col items-center rounded-xl bg-black/[0.03] p-1 dark:bg-white/[0.04]">
      <span className="mb-0.5 mt-1 text-[11px] text-neutral-400">{VIEW_LABEL[view]}</span>
      <svg viewBox="0 0 100 210" className="h-44 w-full touch-none">
        {isSide ? (
          <>
            <SideFigure shape={goal} mode="outline" flip={view === "right"} />
            <SideFigure shape={current} mode="fill" flip={view === "right"} />
          </>
        ) : (
          <>
            <Figure shape={goal} mode="outline" />
            <Figure shape={current} mode="fill" />
          </>
        )}
        {regions.map((r, i) => {
          const selected = selectedMuscle === r.muscle;
          const props = {
            fill: selected ? "#7c3aed" : "#7c3aed",
            fillOpacity: selected ? 0.55 : 0.001,
            stroke: selected ? "#5b21b6" : "none",
            strokeWidth: selected ? 1 : 0,
            style: { cursor: "pointer" as const },
            onClick: () => onSelectMuscle(r.muscle),
          };
          const g = view === "right" ? { transform: `translate(${CX * 2} 0) scale(-1 1)` } : {};
          const shapeEl =
            r.kind === "ellipse" ? (
              <ellipse cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} {...props} />
            ) : (
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} {...props} />
            );
          return (
            <g key={i} {...g}>
              {shapeEl}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function BodyAvatar2D({ gender, current, goal, selectedMuscle, onSelectMuscle }: BodyAvatar2DProps) {
  const curShape = useMemo(() => computeBodyShape({ ...current, gender }), [current, gender]);
  const goalShape = useMemo(() => computeBodyShape({ ...goal, gender }), [goal, gender]);

  return (
    <div>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="grid grid-cols-4 gap-1.5">
        {VIEWS.map((v) => (
          <ViewPanel
            key={v}
            view={v}
            current={curShape}
            goal={goalShape}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={onSelectMuscle}
          />
        ))}
      </div>
    </div>
  );
}
