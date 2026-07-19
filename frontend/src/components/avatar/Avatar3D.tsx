import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { Gender } from "../../types";
import { buildBodyGroup } from "./bodyModel";

interface BodyState {
  heightM: number;
  weightKg: number;
  bodyFatPct: number;
}

interface Avatar3DProps {
  gender: Gender;
  current: BodyState;
  goal: BodyState;
}

function Figure({ state, gender, color, x, opacity }: { state: BodyState; gender: Gender; color: number; x: number; opacity?: number }) {
  const group = useMemo(
    () => buildBodyGroup({ heightM: state.heightM, weightKg: state.weightKg, bodyFatPct: state.bodyFatPct, gender, color, opacity }),
    [state.heightM, state.weightKg, state.bodyFatPct, gender, color, opacity],
  );
  return <primitive object={group} position={[x, -state.heightM * 0.55, 0]} />;
}

export default function Avatar3D({ gender, current, goal }: Avatar3DProps) {
  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1} />
        <Figure state={current} gender={gender} color={0x8b5cf6} x={-0.42} />
        <Figure state={goal} gender={gender} color={0x22c55e} x={0.42} opacity={0.55} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
}
