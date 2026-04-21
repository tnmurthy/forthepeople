"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import { OKABE_ITO, type ProfileLike } from "../types";

interface Props {
  urbanPct?: number | null;
  ruralPct?: number | null;
}

export function canRenderUrbanRuralDonut(profile: ProfileLike | null | undefined): boolean {
  return typeof profile?.urbanPct === "number";
}

export default function UrbanRuralDonut({ urbanPct, ruralPct }: Props) {
  const urban = typeof urbanPct === "number" ? urbanPct : null;
  if (urban == null) {
    return <EmptyBlock icon="📊" message="Urban/rural split not available for this district yet" />;
  }
  const rural = typeof ruralPct === "number" ? ruralPct : Math.max(0, 100 - urban);

  const data = [
    { name: "Urban", value: urban },
    { name: "Rural", value: rural },
  ];

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
            <Cell fill={OKABE_ITO.skyBlue} />
            <Cell fill={OKABE_ITO.bluishGreen} />
          </Pie>
          <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
          <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
