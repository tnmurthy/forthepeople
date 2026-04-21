"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import {
  ALPHABETICAL_RELIGIONS,
  RELIGION_COLORS,
  isNonEmptyObject,
  type ReligionMap,
  type ProfileLike,
} from "../types";

interface Props {
  religion: ReligionMap | null | undefined;
}

export function canRenderReligionDonut(profile: ProfileLike | null | undefined): boolean {
  return isNonEmptyObject(profile?.religion);
}

export default function ReligionDonut({ religion }: Props) {
  if (!religion || Object.keys(religion).length === 0) {
    return <EmptyBlock icon="📊" message="Religion data not available for this district yet" />;
  }

  const data = ALPHABETICAL_RELIGIONS.filter((k) => typeof religion[k] === "number").map((k) => ({
    key: k,
    name: k === "NotStated" ? "Not Stated" : k,
    value: religion[k]!,
  }));

  if (data.length === 0) {
    return <EmptyBlock icon="📊" message="Religion data not available for this district yet" />;
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={1}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={RELIGION_COLORS[d.key] ?? "#9CA3AF"} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
