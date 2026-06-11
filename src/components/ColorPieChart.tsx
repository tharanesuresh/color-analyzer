"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ColorResult, COLOR_DISPLAY_HEX } from "@/lib/colorAnalysis";

interface Props {
  colors: ColorResult[];
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: ColorResult;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full border border-black/10"
          style={{ backgroundColor: COLOR_DISPLAY_HEX[d.name as keyof typeof COLOR_DISPLAY_HEX] }}
        />
        <span className="font-semibold text-gray-800">{d.name}</span>
        <span className="text-gray-500 ml-1">{d.value.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function ColorPieChart({ colors }: Props) {
  const data = colors.map((c) => ({
    name: c.name,
    value: parseFloat(c.percentage.toFixed(2)),
    hex: COLOR_DISPLAY_HEX[c.name],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.hex}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
