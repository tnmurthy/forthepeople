"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import { SEX_COLORS, type AgeBand } from "../types";

interface Props {
  ageBands: AgeBand[] | null | undefined;
}

export function canRenderPopulationPyramid(
  profile: { ageBands?: AgeBand[] | null } | null | undefined,
): boolean {
  return Array.isArray(profile?.ageBands) && profile!.ageBands!.length > 0;
}

export default function PopulationPyramid({ ageBands }: Props) {
  if (!Array.isArray(ageBands) || ageBands.length === 0) {
    return (
      <EmptyBlock
        icon="📊"
        message="5-year age-band pyramid data not available — see 4-group fallback below"
      />
    );
  }

  const data = ageBands.map((b) => ({
    band: b.band,
    male: -Math.abs(b.male),
    female: b.female,
  }));

  return (
    <div style={{ width: "100%", height: Math.max(280, ageBands.length * 22) }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="sign"
          margin={{ left: 10, right: 10 }}
        >
          <XAxis type="number" tickFormatter={(v) => String(Math.abs(Number(v)))} />
          <YAxis type="category" dataKey="band" width={50} style={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => (typeof v === "number" ? new Intl.NumberFormat("en-IN").format(Math.abs(v)) : "—")} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="male" name="Male" fill={SEX_COLORS.male} />
          <Bar dataKey="female" name="Female" fill={SEX_COLORS.female} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
