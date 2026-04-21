"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import {
  VIRIDIS,
  isNonEmptyObject,
  type EducationData,
  type ProfileLike,
} from "../types";

interface Props {
  education: EducationData | null | undefined;
}

const LEVELS: { key: keyof EducationData; label: string; color: string }[] = [
  { key: "illiterate", label: "Illiterate", color: VIRIDIS[0] },
  { key: "belowPrimary", label: "Below Primary", color: VIRIDIS[1] },
  { key: "primary", label: "Primary", color: VIRIDIS[2] },
  { key: "middle", label: "Middle", color: VIRIDIS[3] },
  { key: "secondary", label: "Secondary", color: VIRIDIS[4] },
  { key: "higherSec", label: "Higher Secondary", color: VIRIDIS[5] },
  { key: "graduate", label: "Graduate", color: VIRIDIS[6] },
  { key: "postgrad", label: "Postgraduate", color: VIRIDIS[8] },
];

export function canRenderEducationBreakdownBar(
  profile: ProfileLike | null | undefined,
): boolean {
  return isNonEmptyObject(profile?.education);
}

export default function EducationBreakdownBar({ education }: Props) {
  if (!education) {
    return <EmptyBlock icon="📊" message="Education data not available for this district yet" />;
  }

  const row: Record<string, number | string> = { name: "Education attainment" };
  let any = false;
  for (const l of LEVELS) {
    const v = education[l.key];
    if (typeof v === "number") {
      row[l.key] = v;
      any = true;
    } else {
      row[l.key] = 0;
    }
  }
  if (!any) {
    return <EmptyBlock icon="📊" message="Education data not available for this district yet" />;
  }

  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <BarChart data={[row]} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {LEVELS.map((l) => (
            <Bar key={l.key} dataKey={l.key} name={l.label} stackId="edu" fill={l.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
