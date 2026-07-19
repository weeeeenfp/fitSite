import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface WeightPoint {
  date: string; // MM/DD
  weight: number;
}

interface WeightLineChartProps {
  data: WeightPoint[];
}

export default function WeightLineChart({ data }: WeightLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 1", "dataMax + 1"]} />
        <Tooltip />
        <Line type="monotone" dataKey="weight" name="體重(kg)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
