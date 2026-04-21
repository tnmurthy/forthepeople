"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import {
  VIRIDIS,
  isNonEmptyObject,
  type LanguageData,
  type ProfileLike,
} from "../types";

interface Props {
  language: LanguageData | null | undefined;
}

export function canRenderLanguageBarChart(profile: ProfileLike | null | undefined): boolean {
  if (!isNonEmptyObject(profile?.language)) return false;
  const l = profile!.language as Record<string, unknown>;
  return Array.isArray(l.top10) && l.top10.length > 0;
}

export default function LanguageBarChart({ language }: Props) {
  if (!language || !Array.isArray(language.top10) || language.top10.length === 0) {
    return <EmptyBlock icon="📊" message="Language data not available for this district yet" />;
  }

  const data = [...language.top10].sort((a, b) => b.pct - a.pct);
  const max = data[0]?.pct ?? 0;

  return (
    <div style={{ width: "100%", height: Math.max(260, data.length * 32) }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <XAxis
            type="number"
            domain={[0, Math.max(5, Math.ceil(max / 5) * 5)]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis type="category" dataKey="name" width={90} style={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(1)}%` : "—")} />
          <Bar dataKey="pct" name="Share of speakers">
            {data.map((d, i) => (
              <Cell key={d.name} fill={VIRIDIS[Math.min(i, VIRIDIS.length - 1)]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
