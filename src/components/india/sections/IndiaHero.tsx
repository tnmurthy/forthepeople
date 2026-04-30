/**
 * IndiaHero — homepage hero per file 38 (LOCKED) + file 45 §4 Level 1.
 *
 * Renders:
 *  - Breadcrumb with module-picker dropdown
 *  - Tricolor radial-wash hero stage
 *  - Title block: pre-headline / headline / bilingual rotator / motto / Preamble pill
 *  - 9 identity chips (3×3) with gold-medal dots on world #1 rankings
 *  - India outline (right column) with 3 ceremonial tricolor dots + Tropic of Cancer
 *  - 5-tile KPI strip
 *  - Live freshness strip
 *  - "India in the world" rankings card
 *  - Search anchor
 *
 * Server Component. The bilingual rotator is the only client-side bit.
 */

import * as React from "react";
import {
  BookOpenText,
  Building2,
  ChevronRight,
  Crown,
  Film,
  Globe2,
  IndianRupee,
  Languages as LanguagesIcon,
  Moon,
  Square,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LanguageRotator } from "@/components/india/primitives/LanguageRotator";
import { IndiaInTheWorldCard } from "./IndiaInTheWorldCard";
import { CountUpNumber } from "@/components/india/primitives/CountUpNumber";
import { IndiaTricolor } from "@/lib/india/design-tokens";
import {
  INDIA_OUTLINE_PATH_D,
  INDIA_OUTLINE_VIEWBOX,
  INDIA_TROPIC_OF_CANCER_Y,
  INDIA_CITY_MARKERS,
} from "@/data/india-outline";

interface IdentityChip {
  id: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  isGold?: boolean;
}

const HERO_CHIPS: IdentityChip[] = [
  { id: "democracy", icon: Crown, label: "World's largest democracy", isGold: true },
  { id: "population", icon: Users, label: "Most populous nation", isGold: true },
  { id: "films", icon: Film, label: "Largest film industry", isGold: true },
  { id: "gdp", icon: TrendingUp, label: "3rd largest economy (PPP)" },
  { id: "moon", icon: Moon, label: "4th nation on the Moon" },
  { id: "languages", icon: LanguagesIcon, label: "22 official languages" },
  { id: "g20", icon: Globe2, label: "G20 founding member" },
  { id: "origin", icon: Workflow, label: "Birthplace of yoga & chess" },
  { id: "civilization", icon: Building2, label: "5,000-year civilization" },
];

function ChipsList() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
      {HERO_CHIPS.map((chip) => {
        const Icon = chip.icon;
        return (
          <span
            key={chip.id}
            style={{
              border: chip.isGold
                ? "0.5px solid rgba(239, 159, 39, 0.40)"
                : "0.5px solid rgba(0,0,0,0.08)",
              background: chip.isGold
                ? "linear-gradient(90deg, rgba(239, 159, 39, 0.10) 0%, rgba(239, 159, 39, 0.04) 100%)"
                : "var(--color-background)",
              color: chip.isGold ? "#633806" : "var(--color-text-secondary)",
              borderRadius: "999px",
              padding: "3px 9px",
              fontSize: "10.5px",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              transition: "border-color 150ms",
            }}
          >
            <Icon size={11} />
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}

function IndiaOutlineSVG() {
  // India outline sourced from Wikimedia Commons "India outline" (public
  // domain). Path data + viewBox + Tropic of Cancer + city markers come
  // from src/data/india-outline.ts so future tweaks (border refresh, marker
  // re-position) are a registry edit, not a component edit.
  const cityFontSize = 14;
  return (
    <svg
      viewBox={INDIA_OUTLINE_VIEWBOX}
      width="100%"
      style={{ maxWidth: "240px" }}
      aria-label="Outline map of India"
      role="img"
    >
      {/* Main outline */}
      <path
        d={INDIA_OUTLINE_PATH_D}
        fill="var(--color-surface)"
        stroke="var(--color-text-primary)"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fillRule="evenodd"
      />

      {/* Tropic of Cancer ~23.5°N, dashed line across India's width */}
      <line
        x1={20}
        y1={INDIA_TROPIC_OF_CANCER_Y}
        x2={620}
        y2={INDIA_TROPIC_OF_CANCER_Y}
        stroke="var(--color-text-tertiary)"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="8 6"
      />

      {/* 5 city dots (positions from src/data/india-outline.ts) */}
      {INDIA_CITY_MARKERS.map((city) => (
        <g key={city.name}>
          <circle
            cx={city.x}
            cy={city.y}
            r={city.name === "Delhi" ? 9 : 7}
            fill="var(--color-text-primary)"
          />
          <text
            x={city.x + 14}
            y={city.y + 5}
            fontSize={cityFontSize}
            fill="var(--color-text-secondary)"
          >
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export interface IndiaHeroDict {
  eyebrow: string;
  motto: string;
  readPreamble: string;
}

interface IndiaHeroProps {
  locale: string;
  freshnessLine?: string;
  dict?: IndiaHeroDict;
}

const HERO_FALLBACK: IndiaHeroDict = {
  eyebrow: "South Asia · Republic · Constitution adopted 26 Jan 1950",
  motto: '"Sovereign, socialist, secular, democratic republic"',
  readPreamble: "Read the Preamble — every Indian should",
};

export function IndiaHero({ freshnessLine, dict }: IndiaHeroProps) {
  const t = dict ?? HERO_FALLBACK;
  const ceremonialDots = [
    { color: IndiaTricolor.saffron, border: false },
    { color: IndiaTricolor.white, border: true },
    { color: IndiaTricolor.green, border: false },
  ];

  return (
    <section style={{ padding: "0 0 1rem 0" }}>
      {/* Hero stage */}
      <div
        style={{
          position: "relative",
          padding: "22px 26px",
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
          border: "0.5px solid rgba(0, 0, 0, 0.08)",
          background: `
            radial-gradient(ellipse 400px 240px at 0% 0%, rgba(255, 153, 51, 0.08), transparent 60%),
            radial-gradient(ellipse 400px 240px at 100% 100%, rgba(19, 136, 8, 0.08), transparent 60%),
            linear-gradient(180deg, #FEFEFB 0%, #FAFAF8 100%)
          `,
        }}
      >
        <div
          className="india-hero-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: "22px",
            alignItems: "start",
          }}
        >
          {/* LEFT — title block */}
          <div>
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-tertiary)",
                marginBottom: "10px",
              }}
            >
              {t.eyebrow}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "14px",
                marginBottom: "6px",
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "42px",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  margin: 0,
                }}
                className="india-hero-headline"
              >
                India
              </h1>
              <LanguageRotator />
            </div>

            <div
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                color: "var(--color-text-secondary)",
                margin: "0 0 12px",
              }}
            >
              {t.motto}
            </div>

            <a
              href="https://www.constitutionofindia.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 14px 7px 12px",
                background:
                  "linear-gradient(90deg, rgba(83, 74, 183, 0.10) 0%, rgba(83, 74, 183, 0.04) 100%)",
                border: "0.5px solid rgba(83, 74, 183, 0.30)",
                color: "#3C3489",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 500,
                marginBottom: "14px",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <BookOpenText size={13} />
              {t.readPreamble}
              <ChevronRight size={11} style={{ opacity: 0.7 }} />
            </a>

            {/* Identity chips */}
            <ChipsList />
            <div
              style={{ fontSize: "10px", color: "var(--color-text-tertiary)", marginTop: "8px" }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  marginRight: "4px",
                  background: "rgba(239, 159, 39, 0.30)",
                  border: "0.5px solid rgba(239, 159, 39, 0.55)",
                  borderRadius: "999px",
                  verticalAlign: "middle",
                }}
              />
              gold-tinted chips denote a current world #1 ranking
            </div>
          </div>

          {/* RIGHT — India outline (file 48 §4.7.3 map zone polish) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderLeft: "0.5px solid rgba(0, 0, 0, 0.08)",
              paddingLeft: "18px",
            }}
            className="india-hero-outline"
          >
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {ceremonialDots.map((d, i) => (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: d.color,
                    border: d.border ? "0.5px solid var(--color-text-tertiary)" : "none",
                  }}
                />
              ))}
            </div>
            <IndiaOutlineSVG />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                marginTop: "8px",
              }}
            >
              Tropic of Cancer · 23.5°N
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip — v5 per-cell accent tints + Lucide icons (file 48 §4.7.4) */}
      <div
        className="india-hero-kpi-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "6px",
          marginTop: "1rem",
        }}
      >
        {KPI_TILES.map((tile) => (
          <KpiTileV5 key={tile.id} tile={tile} />
        ))}
      </div>

      {/* Freshness strip */}
      <div
        style={{
          borderTop: "0.5px solid var(--color-border-tertiary)",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          padding: "8px 4px",
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--color-text-secondary)",
        }}
      >
        <span>{freshnessLine ?? "● Live"}</span>
        <span style={{ color: "var(--color-text-tertiary)" }}>
          Independent · Sourced from .gov.in &amp; NDSAP
        </span>
      </div>

      {/* India in the world */}
      <IndiaInTheWorldCard />

      <style>{`
        @media (max-width: 768px) {
          .india-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .india-hero-headline {
            font-size: 40px !important;
          }
          .india-hero-outline svg {
            max-width: 140px !important;
          }
          .india-hero-kpi-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .india-hero-kpi-strip > :nth-child(5) {
            grid-column: span 2;
          }
        }
      `}</style>
    </section>
  );
}

// ── KPI strip v5 (file 48 §4.7.4) ─────────────────────────────
//
// Five accent-tinted tiles. Each cell uses an accent ramp from
// :root (Phase 4.6.9): blue / forest-green / amber / indigo / pink.
// Lucide icon top-right at 70% opacity. Number is CountUpNumber with
// the accent's "800" stop. Source pill at the bottom.

interface KpiTileSpec {
  id: string;
  icon: LucideIcon;
  label: string;
  // Either a numeric value (uses CountUpNumber) or a raw string composite.
  value?: number;
  valueRaw?: string;
  decimals?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  meta: string;
  source: string;
  accent: "blue" | "forest-green" | "amber" | "indigo" | "pink";
  numColor: string;
  iconColor: string;
}

const ACCENT_RGB: Record<KpiTileSpec["accent"], string> = {
  blue: "24, 95, 165",
  "forest-green": "90, 143, 46",
  amber: "186, 117, 23",
  indigo: "83, 74, 183",
  pink: "153, 53, 86",
};

const KPI_TILES: KpiTileSpec[] = [
  {
    id: "population",
    icon: Users,
    label: "Population",
    value: 1.43,
    decimals: 2,
    unit: "billion",
    meta: "↑ 0.8% YoY",
    source: "UN · 2024 est.",
    accent: "blue",
    numColor: "#082F58",
    iconColor: "#185FA5",
  },
  {
    id: "area",
    icon: Square,
    label: "Area",
    value: 3.29,
    decimals: 2,
    unit: "M km²",
    meta: "7th largest country",
    source: "Survey of India",
    accent: "forest-green",
    numColor: "#27500A",
    iconColor: "#5A8F2E",
  },
  {
    id: "gdp",
    icon: IndianRupee,
    label: "Nominal GDP",
    value: 4.1,
    decimals: 1,
    prefix: "$",
    suffix: "T",
    meta: "↑ 6.5% projected",
    source: "IMF · FY26",
    accent: "amber",
    numColor: "#633806",
    iconColor: "#BA7517",
  },
  {
    id: "states",
    icon: Building2,
    label: "States · UTs",
    valueRaw: "28 · 8",
    meta: "780 districts",
    source: "MHA · 2024",
    accent: "indigo",
    numColor: "#26215C",
    iconColor: "#534AB7",
  },
  {
    id: "languages",
    icon: LanguagesIcon,
    label: "Languages",
    value: 22,
    decimals: 0,
    unit: "scheduled",
    meta: "+ 100s of dialects",
    source: "Schedule 8",
    accent: "pink",
    numColor: "#4D182A",
    iconColor: "#993556",
  },
];

function KpiTileV5({ tile }: { tile: KpiTileSpec }) {
  const Icon = tile.icon;
  const accentRgb = ACCENT_RGB[tile.accent];
  const numStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "22px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    color: tile.numColor,
  };

  return (
    <div
      style={{
        border: `0.5px solid rgba(${accentRgb}, 0.20)`,
        background: `linear-gradient(135deg, rgba(${accentRgb}, 0.06) 0%, rgba(${accentRgb}, 0.01) 100%)`,
        borderRadius: "var(--border-radius-md)",
        padding: "11px 13px",
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 200ms",
      }}
    >
      <Icon
        size={14}
        style={{
          position: "absolute",
          right: "8px",
          top: "8px",
          color: tile.iconColor,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9.5px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-text-tertiary)",
          fontWeight: 500,
        }}
      >
        {tile.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "1px" }}>
        {tile.valueRaw ? (
          <span style={numStyle}>{tile.valueRaw}</span>
        ) : (
          <>
            {tile.prefix && <span style={numStyle}>{tile.prefix}</span>}
            <CountUpNumber
              target={tile.value ?? 0}
              decimals={tile.decimals}
              inlineStyle={numStyle}
            />
            {tile.suffix && <span style={numStyle}>{tile.suffix}</span>}
            {tile.unit && (
              <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                {tile.unit}
              </span>
            )}
          </>
        )}
      </div>
      <div style={{ fontSize: "10px", color: "var(--color-text-tertiary)", marginTop: "1px" }}>
        {tile.meta}
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          padding: "1px 6px",
          background: "rgba(0,0,0,0.04)",
          color: "var(--color-text-secondary)",
          borderRadius: "3px",
          display: "inline-block",
          marginTop: "5px",
          width: "fit-content",
        }}
      >
        {tile.source}
      </span>
    </div>
  );
}

export default IndiaHero;
