/**
 * ForThePeople.in — Compact population & demographics snippet for the district
 * overview. Matches InfraSnippet's visual shell. Renders nothing when the
 * district has no DemographicProfile, so empty districts don't show a hollow
 * card. Religion row displays the top 3 religions *alphabetically* (not
 * ranked by size) with their actual percentages, per the demographic
 * neutrality guideline.
 */

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import type { PopulationProfileResponse } from "@/hooks/useRealtimeData";

interface Props {
  district: string;
  state: string;
  base: string;
}

function formatInt(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-IN");
}

function top3Alphabetical(religion: Record<string, number> | null): Array<{
  name: string;
  pct: number;
}> {
  if (!religion) return [];
  const rows = Object.entries(religion)
    .filter(([, v]) => typeof v === "number" && Number.isFinite(v))
    .map(([k, v]) => ({ key: k, pct: v }));
  // Pick the 3 largest …
  const top = rows.sort((a, b) => b.pct - a.pct).slice(0, 3);
  // … then display them in alphabetical order (neutrality — not ranked).
  return top
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((r) => ({
      name: r.key === "NotStated" ? "Not Stated" : r.key,
      pct: r.pct,
    }));
}

export default function PopulationSnippet({ district, state, base }: Props) {
  const { data } = useQuery<PopulationProfileResponse>({
    queryKey: ["district", district, "population-profile", "snippet"],
    queryFn: () =>
      fetch(
        `/api/data/population/profile?district=${encodeURIComponent(district)}&state=${encodeURIComponent(state)}`,
      ).then((r) => r.json()),
    staleTime: 10 * 60_000,
  });

  const profile = data?.data ?? null;
  if (!profile) return null;

  const religions = top3Alphabetical(profile.religion);

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={14} style={{ color: "#2563EB" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9B9B9B",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Population &amp; Demographics
          </span>
        </div>
        <Link
          href={`${base}/population`}
          style={{
            fontSize: 12,
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          View full demographics →
        </Link>
      </div>

      <div
        style={{
          background: "#FFF",
          border: "1px solid #E8E8E4",
          borderRadius: 14,
          padding: "14px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 13,
            color: "#1A1A1A",
            marginBottom: 10,
          }}
        >
          <span>
            Population{profile.year ? ` (${profile.year})` : ""}:{" "}
            <strong style={{ fontFamily: "var(--font-mono)" }}>
              {formatInt(profile.totalPopulation)}
            </strong>
          </span>
          {typeof profile.sexRatio === "number" && (
            <span>
              Sex ratio:{" "}
              <strong style={{ fontFamily: "var(--font-mono)" }}>
                {profile.sexRatio}
                <span style={{ fontSize: 11, color: "#9B9B9B", fontWeight: 400 }}>
                  /1k
                </span>
              </strong>
            </span>
          )}
          {typeof profile.literacyTotal === "number" && (
            <span>
              Literacy:{" "}
              <strong style={{ fontFamily: "var(--font-mono)", color: "#16A34A" }}>
                {profile.literacyTotal.toFixed(1)}%
              </strong>
            </span>
          )}
        </div>

        {religions.length > 0 && (
          <div style={{ fontSize: 12, color: "#6B6B6B", lineHeight: 1.7 }}>
            Religion (top 3, alphabetical):{" "}
            {religions.map((r, i) => (
              <span key={r.name}>
                {i > 0 && <span style={{ color: "#D0D0D0" }}> · </span>}
                <span style={{ color: "#1A1A1A" }}>{r.name}</span>{" "}
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  {r.pct.toFixed(1)}%
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
