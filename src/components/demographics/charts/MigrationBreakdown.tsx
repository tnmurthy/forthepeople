"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import EmptyBlock from "../../common/EmptyBlock";
import {
  OKABE_ITO,
  isNonEmptyObject,
  type MigrationData,
  type ProfileLike,
} from "../types";

interface Props {
  migration: MigrationData | null | undefined;
}

export function canRenderMigrationBreakdown(
  profile: ProfileLike | null | undefined,
): boolean {
  return isNonEmptyObject(profile?.migration);
}

export default function MigrationBreakdown({ migration }: Props) {
  if (!migration) {
    return <EmptyBlock icon="📊" message="Migration data not available for this district yet" />;
  }

  const origins = [
    { name: "Same state", value: migration.fromSameState ?? 0, color: OKABE_ITO.bluishGreen },
    { name: "Other state", value: migration.fromOtherState ?? 0, color: OKABE_ITO.skyBlue },
    { name: "From abroad", value: migration.fromAbroad ?? 0, color: OKABE_ITO.orange },
  ].filter((r) => r.value > 0);

  const reasonsData = migration.reasons
    ? ([
        { name: "Work", value: migration.reasons.work ?? 0, color: OKABE_ITO.blue },
        { name: "Marriage", value: migration.reasons.marriage ?? 0, color: OKABE_ITO.vermillion },
        { name: "Education", value: migration.reasons.education ?? 0, color: OKABE_ITO.reddishPurple },
        { name: "Family", value: migration.reasons.family ?? 0, color: OKABE_ITO.yellow },
        { name: "Other", value: migration.reasons.other ?? 0, color: "#9CA3AF" },
      ].filter((r) => r.value > 0))
    : [];

  if (origins.length === 0 && reasonsData.length === 0) {
    return <EmptyBlock icon="📊" message="Migration data not available for this district yet" />;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#4B4B4B", marginBottom: 4 }}>
          In-migrants by origin (%)
        </div>
        {origins.length > 0 ? (
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={origins} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={90} style={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
                <Bar dataKey="value">
                  {origins.map((o) => (
                    <Cell key={o.name} fill={o.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyBlock icon="📊" message="Origin breakdown not available" />
        )}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#4B4B4B", marginBottom: 4 }}>
          Reasons for migration (%)
        </div>
        {reasonsData.length > 0 ? (
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={reasonsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={80} style={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}%` : "—")} />
                <Bar dataKey="value">
                  {reasonsData.map((r) => (
                    <Cell key={r.name} fill={r.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyBlock icon="📊" message="Reason breakdown not available" />
        )}
      </div>
      {typeof migration.totalInMigrantsPct === "number" && (
        <div style={{ gridColumn: "1 / -1", fontSize: 11, color: "#9B9B9B" }}>
          Total in-migrants:{" "}
          <strong>{migration.totalInMigrantsPct.toFixed(1)}%</strong> of residents were born
          outside this district.
        </div>
      )}
    </div>
  );
}
