"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import { VIRIDIS, type ProfileLike } from "../types";

interface Props {
  pop_0_6?: number | null;
  pop_7_14?: number | null;
  pop_15_59?: number | null;
  pop_60_plus?: number | null;
}

export function canRenderAgePyramidStacked(profile: ProfileLike | null | undefined): boolean {
  return (
    typeof profile?.pop_0_6 === "number" ||
    typeof profile?.pop_7_14 === "number" ||
    typeof profile?.pop_15_59 === "number" ||
    typeof profile?.pop_60_plus === "number"
  );
}

export default function AgePyramidStacked({
  pop_0_6,
  pop_7_14,
  pop_15_59,
  pop_60_plus,
}: Props) {
  const rows = [
    { band: "60+", value: pop_60_plus ?? 0 },
    { band: "15–59", value: pop_15_59 ?? 0 },
    { band: "7–14", value: pop_7_14 ?? 0 },
    { band: "0–6", value: pop_0_6 ?? 0 },
  ].filter((r) => r.value > 0);

  if (rows.length === 0) {
    return <EmptyBlock icon="📊" message="Age-band data not available for this district yet" />;
  }

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis type="number" tickFormatter={(v) => new Intl.NumberFormat("en-IN").format(v)} />
          <YAxis type="category" dataKey="band" width={60} style={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => (typeof v === "number" ? new Intl.NumberFormat("en-IN").format(v) : "—")} />
          <Bar dataKey="value" name="Population" fill={VIRIDIS[3]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
