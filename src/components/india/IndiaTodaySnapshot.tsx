/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "India at a glance — today" — 12 KPI tiles immediately below the
 * sticky nav. Replaces the 5-tile section that used to live in
 * /en/india-detail (which was hardcoded; deliberately NOT ported here).
 *
 * The 12 tiles are a curated set of headline national indicators that
 * change at sub-monthly cadence (anything slower belongs in its own
 * module band lower on the page). Values come from /api/india/snapshot
 * `today` array — until scrapers populate the DB, every tile shows
 * "Awaiting first sync — <source>" instead of a fake number.
 */

import Link from "next/link";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import { formatAsOfDate } from "@/lib/india/india-formatters";
import { INDIA_SOURCES } from "@/lib/india/india-sources";
import type { HeroTileData } from "./IndiaHero";

interface Props {
  /** From /api/india/snapshot.today — empty means awaiting first sync. */
  tiles: HeroTileData[];
}

/**
 * Canonical 12-tile order. Each entry declares its source so the empty
 * state still cites the upstream — no blank tiles, ever.
 */
const TODAY_DEFAULTS: HeroTileData[] = [
  { metricKey: "cpi_inflation_yoy", label: "CPI Inflation (YoY)", value: null, sourceKey: "MoSPI", unit: "%" },
  { metricKey: "wpi_inflation_yoy", label: "WPI Inflation (YoY)", value: null, sourceKey: "EAINDUSTRY_WPI", unit: "%" },
  { metricKey: "unemployment_cws", label: "Unemployment (CWS)", value: null, sourceKey: "MoSPI", unit: "%" },
  { metricKey: "rbi_repo_rate", label: "RBI Repo Rate", value: null, sourceKey: "RBI", unit: "%" },
  { metricKey: "forex_reserves_usd_b", label: "Forex Reserves", value: null, sourceKey: "RBI", unit: "$ B" },
  { metricKey: "gst_monthly_collection", label: "GST Collection (mo)", value: null, sourceKey: "GST_COUNCIL" },
  { metricKey: "upi_monthly_volume", label: "UPI Volume (mo)", value: null, sourceKey: "NPCI" },
  { metricKey: "upi_monthly_value", label: "UPI Value (mo)", value: null, sourceKey: "NPCI" },
  { metricKey: "power_generation_yoy", label: "Power Gen (YoY)", value: null, sourceKey: "CEA", unit: "%" },
  { metricKey: "renewable_capacity_gw", label: "Renewable Capacity", value: null, sourceKey: "MNRE", unit: "GW" },
  { metricKey: "pmkisan_beneficiaries_cr", label: "PM-KISAN Beneficiaries", value: null, sourceKey: "PMKISAN", unit: "cr" },
  { metricKey: "uwin_beneficiaries_cr", label: "U-WIN Beneficiaries", value: null, sourceKey: "UWIN", unit: "cr" },
];

function mergeTiles(api: HeroTileData[]): HeroTileData[] {
  if (api.length === 0) return TODAY_DEFAULTS;
  return TODAY_DEFAULTS.map((def) => {
    const hit = api.find((t) => t.metricKey === def.metricKey);
    return hit ?? def;
  });
}

export default function IndiaTodaySnapshot({ tiles }: Props) {
  const merged = mergeTiles(tiles);

  return (
    <section
      id="india-today"
      style={{
        padding: "24px 16px",
        maxWidth: INDIA_DESIGN.sectionMaxWidth,
        margin: "0 auto",
        scrollMarginTop: 80,
      }}
    >
      <SectionLabel icon="📊">India at a glance — today</SectionLabel>
      <div
        style={{
          fontSize: 13,
          color: INDIA_DESIGN.textMuted,
          marginBottom: 14,
          marginTop: -6,
        }}
      >
        Selected national indicators that change at sub-monthly cadence.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {merged.map((tile) => (
          <TodayTile key={tile.metricKey} tile={tile} />
        ))}
      </div>
    </section>
  );
}

function TodayTile({ tile }: { tile: HeroTileData }) {
  const source = INDIA_SOURCES[tile.sourceKey];
  const hasValue = tile.value != null && tile.value !== "";

  return (
    <div
      style={{
        padding: "12px 14px",
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 10,
        minHeight: 96,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: INDIA_DESIGN.textFaint,
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        {tile.label}
      </div>

      {hasValue ? (
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: INDIA_DESIGN.textPrimary,
            fontFamily: INDIA_DESIGN.fontMono,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
          }}
        >
          {tile.value}
          {tile.unit ? (
            <span style={{ fontSize: 12, color: INDIA_DESIGN.textMuted, marginLeft: 4 }}>
              {tile.unit}
            </span>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            fontSize: 12,
            color: INDIA_DESIGN.textFaint,
            fontStyle: "italic",
            lineHeight: 1.4,
          }}
        >
          Awaiting first sync
        </div>
      )}

      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: INDIA_DESIGN.textMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {source ? (
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: INDIA_DESIGN.accentBlue,
              textDecoration: "none",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {source.name.replace(/^Ministry of /, "M/o ")}
          </Link>
        ) : (
          <span>{tile.sourceKey}</span>
        )}
        {tile.asOfDate ? (
          <span style={{ color: INDIA_DESIGN.textFaint }}>{formatAsOfDate(tile.asOfDate)}</span>
        ) : null}
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: INDIA_DESIGN.textFaint,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </div>
  );
}
