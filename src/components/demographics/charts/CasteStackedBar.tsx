"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import { CASTE_COLORS, isNonEmptyObject, type CasteMap, type ProfileLike } from "../types";

interface Props {
  caste: CasteMap | null | undefined;
}

export function canRenderCasteStackedBar(profile: ProfileLike | null | undefined): boolean {
  return isNonEmptyObject(profile?.caste);
}

export default function CasteStackedBar({ caste }: Props) {
  const hasAny =
    caste &&
    (typeof caste.SC === "number" ||
      typeof caste.ST === "number" ||
      typeof caste.Other === "number");

  if (!hasAny) {
    return (
      <EmptyBlock icon="📊" message="Caste-category data not available for this district yet" />
    );
  }

  const data = [
    {
      name: "Caste categories",
      SC: caste!.SC ?? 0,
      ST: caste!.ST ?? 0,
      Other: caste!.Other ?? 0,
    },
  ];

  return (
    <div>
      <div style={{ width: "100%", height: 140 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="SC" name="Scheduled Caste" stackId="c" fill={CASTE_COLORS.SC} />
            <Bar dataKey="ST" name="Scheduled Tribe" stackId="c" fill={CASTE_COLORS.ST} />
            <Bar dataKey="Other" name="Other" stackId="c" fill={CASTE_COLORS.Other} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6, lineHeight: 1.5 }}>
        Constitutional categories only (Scheduled Caste, Scheduled Tribe, Other). Sub-caste / jati
        data is not displayed — see the &quot;Caste-category data&quot; section of the disclosure
        panel above.
      </div>
    </div>
  );
}
