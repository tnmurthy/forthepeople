/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — DistrictExplorer (slim, single "By tier" tab).
 *
 * Drop-in replacement for the legacy HomeDrilldown's right-column
 * scrollable list. Map column is a placeholder (defer interactive
 * 780-district map to a future session per slim-core scope).
 *
 * SECTIONS:
 *   ⚡ Recently launched   — top 3 active districts by launch order
 *   METRO                  — 6 metro slugs (hardcoded fallback)
 *   TIER 2                 — 3 city slugs
 *   TIER 3 / EMERGING      — remaining
 *   Coming next · vote     — top 3 districtRequest votes
 *
 * TODO(Session-11-followup): once District schema gains a `tier` column,
 * replace the hardcoded TIER_HARDCODE map with a per-row classification.
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// ── Tier classification (hardcoded fallback; see TODO above) ──
const TIER_HARDCODE: Record<string, "metro" | "tier2" | "emerging"> = {
  "bengaluru-urban": "metro",
  "mumbai":          "metro",
  "new-delhi":       "metro",
  "chennai":         "metro",
  "kolkata":         "metro",
  "hyderabad":       "metro",
  "pune":            "tier2",
  "lucknow":         "tier2",
  "mysuru":          "tier2",
  "mandya":          "emerging",
};

interface ActiveDistrict {
  slug: string;
  name: string;
  stateSlug: string;
  goLiveDate?: string | null;
  // Future: dataPointCount when an aggregated endpoint exists
}

type DistrictRequestRow = {
  id: string;
  stateName: string;
  districtName: string;
  requestCount: number;
};

export interface DistrictExplorerProps {
  locale: string;
  /** Server-fetched active districts (avoids client roundtrip; props-in pattern). */
  activeDistricts: ActiveDistrict[];
  /** Server-fetched top-voted requests (excluding active districts). */
  voteRequests: DistrictRequestRow[];
}

export default function DistrictExplorer({
  locale,
  activeDistricts,
  voteRequests,
}: DistrictExplorerProps) {
  const [tab, setTab] = useState<"tier" | "region">("tier");

  // ── Group by tier ──
  const grouped = useMemo(() => {
    const metro: ActiveDistrict[] = [];
    const tier2: ActiveDistrict[] = [];
    const emerging: ActiveDistrict[] = [];
    const recent: ActiveDistrict[] = [];

    // Recently launched: top 3 by goLiveDate desc
    const sortedByDate = [...activeDistricts].sort((a, b) => {
      const ax = a.goLiveDate ? new Date(a.goLiveDate).getTime() : 0;
      const bx = b.goLiveDate ? new Date(b.goLiveDate).getTime() : 0;
      return bx - ax;
    });
    for (const d of sortedByDate.slice(0, 3)) recent.push(d);

    for (const d of activeDistricts) {
      const t = TIER_HARDCODE[d.slug] ?? "emerging";
      if (t === "metro") metro.push(d);
      else if (t === "tier2") tier2.push(d);
      else emerging.push(d);
    }

    return { recent, metro, tier2, emerging };
  }, [activeDistricts]);

  return (
    <section
      id="district-explorer"
      aria-labelledby="explorer-heading"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 16px",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h2
          id="explorer-heading"
          style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}
        >
          Explore districts
        </h2>
        <p style={{ marginTop: 4, fontSize: 13, color: "#6B7280" }}>
          Click any district to see its 32 modules. Vote for the next launch.
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div
        role="tablist"
        aria-label="Group districts by"
        style={{
          display: "inline-flex",
          gap: 4,
          padding: 4,
          background: "#F5F5F0",
          borderRadius: 10,
          marginBottom: 18,
        }}
      >
        <TabButton active={tab === "tier"} onClick={() => setTab("tier")}>
          By tier
        </TabButton>
        <TabButton
          active={false}
          disabled
          title="Coming soon"
          onClick={() => {}}
        >
          By region
        </TabButton>
      </div>

      {/* ── 50/50 grid (map placeholder + list) ── */}
      <div
        className="ftp-explorer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 24,
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .ftp-explorer-grid { grid-template-columns: 1fr !important; }
            .ftp-explorer-map { min-height: 240px !important; }
          }
          .ftp-explorer-card {
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 14px;
            background: #FFFFFF;
            border: 1px solid #E8E8E4;
            border-radius: 10px;
            text-decoration: none;
            color: #1A1A1A;
            transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          }
          .ftp-explorer-card:hover {
            transform: translateY(-1px);
            border-color: #D1D5DB;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          @media (prefers-reduced-motion: reduce) {
            .ftp-explorer-card { transition: none; }
            .ftp-explorer-card:hover { transform: none; }
          }
          .ftp-section-label {
            font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
            text-transform: uppercase; color: #9B9B9B; margin: 16px 0 8px;
          }
        `}</style>

        {/* MAP placeholder (left) */}
        <div
          className="ftp-explorer-map"
          aria-label="India map placeholder — interactive map deferred"
          style={{
            minHeight: 360,
            background: "#FAFAF8",
            border: "1px solid #E8E8E4",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          {/* TODO(Session-11-followup): render react-simple-maps India choropleth here.
              Hovering a state highlights its districts on the right. Clicking a coming-soon
              state opens the request flow. */}
          <span style={{ fontSize: 64, lineHeight: 1 }} aria-hidden="true">🗺️</span>
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "#6B7280",
              maxWidth: 320,
              lineHeight: 1.5,
            }}
          >
            Interactive 780-district map is in the next sprint.
            <br />
            <span style={{ color: "#9B9B9B", fontSize: 12 }}>
              For now, browse the list →
            </span>
          </div>
        </div>

        {/* LIST (right) */}
        <div>
          {/* Recently launched */}
          {grouped.recent.length > 0 && (
            <>
              <div
                className="ftp-section-label"
                style={{ color: "#92400E", margin: "0 0 8px" }}
              >
                ⚡ Recently launched
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {grouped.recent.map((d) => (
                  <Link
                    key={`recent-${d.slug}`}
                    href={`/${locale}/${d.stateSlug}/${d.slug}`}
                    className="ftp-explorer-card"
                    style={{
                      background: "#FFFBEB",
                      borderColor: "#FDE68A",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</span>
                    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          background: "#FFFFFF",
                          color: "#92400E",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          borderRadius: 999,
                          border: "1px solid #FDE68A",
                        }}
                      >
                        NEW
                      </span>
                      <span aria-hidden="true" style={{ color: "#92400E" }}>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Tier groups */}
          <TierGroup
            label="Metro"
            districts={grouped.metro}
            locale={locale}
          />
          <TierGroup
            label="Tier 2"
            districts={grouped.tier2}
            locale={locale}
          />
          {grouped.emerging.length > 0 && (
            <TierGroup
              label="Tier 3 / Emerging"
              districts={grouped.emerging}
              locale={locale}
            />
          )}

          {/* Coming next vote */}
          {voteRequests.length > 0 && (
            <>
              <div
                className="ftp-section-label"
                style={{ color: "#1D4ED8", margin: "20px 0 8px" }}
              >
                🗳️ Coming next · vote
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {voteRequests.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="ftp-explorer-card"
                    style={{
                      background: "#EFF6FF",
                      borderColor: "#BFDBFE",
                      cursor: "default",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.districtName}</span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "#1D4ED8",
                        fontFamily: "var(--font-mono, ui-monospace, monospace)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span aria-hidden="true">▲</span>
                      {r.requestCount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
      title={title}
      onClick={onClick}
      style={{
        background: active ? "#FFFFFF" : "transparent",
        color: disabled ? "#9B9B9B" : active ? "#1A1A1A" : "#6B7280",
        border: active ? "1px solid #E8E8E4" : "1px solid transparent",
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function TierGroup({
  label,
  districts,
  locale,
}: {
  label: string;
  districts: ActiveDistrict[];
  locale: string;
}) {
  if (districts.length === 0) return null;
  return (
    <>
      <div className="ftp-section-label">{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {districts.map((d) => (
          <Link
            key={d.slug}
            href={`/${locale}/${d.stateSlug}/${d.slug}`}
            className="ftp-explorer-card"
          >
            <span style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</span>
            <span aria-hidden="true" style={{ color: "#9B9B9B" }}>→</span>
          </Link>
        ))}
      </div>
    </>
  );
}
