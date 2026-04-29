/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Hero block for /[locale]/india.
 *
 * Three rows:
 *   1. INDIA AT A GLANCE (kicker) + "India in one page." (h1)
 *   2. live-coverage subtitle ("N districts live · 29 dashboards/district")
 *   3. 6 KPI tiles (Population, GDP, Area, States, Districts, Languages)
 *
 * KPI values come from /api/india/snapshot.hero. When a tile has no
 * value (stub / awaiting first sync), the number slot shows
 * "Awaiting first sync" in muted text instead of a fake placeholder.
 *
 * Source line under each tile is always visible — every value on this
 * page traces back to a .gov.in / .nic.in / NDSAP / accredited source
 * (file 31 §4, file 32 §0).
 */

import Link from "next/link";
import { INDIA_DESIGN, INDIA_TRICOLOR } from "@/lib/india/india-design";
import { formatAsOfDate } from "@/lib/india/india-formatters";
import { INDIA_SOURCES } from "@/lib/india/india-sources";

export interface HeroTileData {
  metricKey: string;
  label: string;
  /** Pre-formatted display string ("1,40,00,00,000", "₹3.5 lakh crore"). */
  value: string | null;
  unit?: string | null;
  /** Source key into INDIA_SOURCES — looked up for name + URL display. */
  sourceKey: string;
  asOfDate?: string | null;
}

interface Props {
  locale: string;
  /** From /api/india/snapshot.hero — empty array means awaiting first sync. */
  tiles: HeroTileData[];
  activeDistrictCount: number;
  dashboardsPerDistrict: number;
  totalDataPoints: number;
}

/**
 * The 6 hero metrics in canonical order. When `tiles` from the API is
 * empty, these defaults render with "Awaiting first sync" in the value
 * slot but still cite the right source.
 */
const HERO_DEFAULTS: HeroTileData[] = [
  { metricKey: "population_total", label: "Population", value: null, sourceKey: "CENSUS" },
  { metricKey: "gdp_nominal_inr", label: "Nominal GDP", value: null, sourceKey: "MoSPI" },
  { metricKey: "geographic_area", label: "Geographic Area", value: null, sourceKey: "SOI", unit: "km²" },
  { metricKey: "states_count", label: "States & UTs", value: null, sourceKey: "MHA", unit: "count" },
  { metricKey: "districts_count", label: "Districts", value: null, sourceKey: "LGD", unit: "count" },
  { metricKey: "scheduled_languages", label: "Scheduled Languages", value: null, sourceKey: "CONSTITUTION", unit: "count" },
];

function mergeTiles(api: HeroTileData[]): HeroTileData[] {
  if (api.length === 0) return HERO_DEFAULTS;
  // Preserve canonical order; override with API row when key matches.
  return HERO_DEFAULTS.map((def) => {
    const hit = api.find((t) => t.metricKey === def.metricKey);
    return hit ?? def;
  });
}

export default function IndiaHero({
  locale,
  tiles,
  activeDistrictCount,
  dashboardsPerDistrict,
  totalDataPoints,
}: Props) {
  const merged = mergeTiles(tiles);

  return (
    <section
      style={{
        background: INDIA_DESIGN.bgPage,
        borderBottom: `1px solid ${INDIA_DESIGN.border}`,
        padding: "32px 16px 28px",
      }}
    >
      <div style={{ maxWidth: INDIA_DESIGN.sectionMaxWidth, margin: "0 auto" }}>
        {/* Tricolor sprinkle: 3-dot motif from the FTP logo + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div style={{ display: "inline-flex", gap: 3 }} aria-hidden="true">
            <span style={dot(INDIA_TRICOLOR.saffron)} />
            <span style={dot("#9B9B9B")} />
            <span style={dot(INDIA_TRICOLOR.green)} />
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INDIA_DESIGN.textFaint,
            }}
          >
            India at a glance
          </span>
        </div>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: INDIA_DESIGN.textPrimary,
            letterSpacing: "-1px",
            lineHeight: 1.08,
            margin: 0,
            fontFamily: INDIA_DESIGN.fontDisplay,
          }}
        >
          India in one page.
        </h1>

        <p
          style={{
            fontSize: 14,
            color: INDIA_DESIGN.textSecondary,
            lineHeight: 1.6,
            maxWidth: 640,
            marginTop: 10,
          }}
        >
          <strong style={{ color: INDIA_DESIGN.textPrimary }}>
            {activeDistrictCount} districts live
          </strong>
          {"  ·  "}
          {dashboardsPerDistrict} dashboards per district
          {"  ·  "}
          <span
            style={{
              fontFamily: INDIA_DESIGN.fontMono,
              color: INDIA_DESIGN.accentBlue,
              fontWeight: 700,
            }}
          >
            {totalDataPoints.toLocaleString("en-IN")}
          </span>{" "}
          live data points.
        </p>

        {/* 6 KPI tiles — the National Snapshot. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 20,
          }}
        >
          {merged.map((tile) => (
            <HeroKpiTile key={tile.metricKey} tile={tile} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroKpiTile({ tile, locale: _locale }: { tile: HeroTileData; locale: string }) {
  const source = INDIA_SOURCES[tile.sourceKey];
  const hasValue = tile.value != null && tile.value !== "";

  return (
    <div
      style={{
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: INDIA_DESIGN.cardRadius,
        padding: "16px 18px",
        minHeight: 116,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: INDIA_DESIGN.textFaint,
        }}
      >
        {tile.label}
      </div>

      <div style={{ marginTop: 4 }}>
        {hasValue ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: INDIA_DESIGN.textPrimary,
              fontFamily: INDIA_DESIGN.fontMono,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
            }}
          >
            {tile.value}
            {tile.unit && tile.unit !== "count" ? (
              <span style={{ fontSize: 13, color: INDIA_DESIGN.textMuted, marginLeft: 4 }}>
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
      </div>

      <div
        style={{
          marginTop: 10,
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
            style={{ color: INDIA_DESIGN.accentBlue, textDecoration: "none" }}
          >
            {source.name.replace(/^Ministry of /, "M/o ").slice(0, 40)}
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

function dot(color: string): React.CSSProperties {
  return {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  };
}
