/**
 * IndiaHero — homepage hero v8 (file 48 §Section 2).
 *
 * Renders:
 *  - Hero stage with 4px tricolor stripe on left edge + 24% tricolor radials
 *  - Left column: eyebrow / "India" + LanguageRotator / motto / Preamble CTA
 *                 / NationalIdentityGrid / QuickAccessStrip
 *  - Right column (320px): TricolorBadgesPanel
 *  - 5-tile KPI strip below the stage
 *  - Freshness strip
 *  - "India in the world" rankings card
 *
 * v8 dropped the India SVG outline column (it now lives only on the
 * super-category landing where breadcrumb context is more useful).
 */

import * as React from "react";
import {
  BookOpenText,
  Building2,
  ChevronRight,
  IndianRupee,
  Languages as LanguagesIcon,
  Square,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LanguageRotator } from "@/components/india/primitives/LanguageRotator";
import { NationalIdentityGrid } from "@/components/india/primitives/NationalIdentityGrid";
import { QuickAccessStrip } from "@/components/india/primitives/QuickAccessStrip";
import { TricolorBadgesPanel } from "@/components/india/primitives/TricolorBadgesPanel";
import { IndiaInTheWorldCard } from "./IndiaInTheWorldCard";
import { CountUpNumber } from "@/components/india/primitives/CountUpNumber";

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

export function IndiaHero({ locale, freshnessLine, dict }: IndiaHeroProps) {
  const t = dict ?? HERO_FALLBACK;

  return (
    <section style={{ padding: "0 0 1rem 0" }}>
      {/* Hero stage — v8: 4px tricolor stripe on left, 24% radial washes,
          right-column TricolorBadgesPanel replaces the India outline. */}
      <div
        style={{
          position: "relative",
          padding: "20px 20px 20px 26px",
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
          border: "0.5px solid rgba(0, 0, 0, 0.08)",
          background: `
            radial-gradient(ellipse 540px 320px at 0% 0%, rgba(255, 153, 51, 0.24), transparent 60%),
            radial-gradient(ellipse 540px 320px at 100% 100%, rgba(19, 136, 8, 0.24), transparent 60%),
            linear-gradient(180deg, #FEFEFB 0%, #FAFAF8 100%)
          `,
        }}
      >
        {/* 4px vertical tricolor stripe on left edge */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            background:
              "linear-gradient(180deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)",
          }}
        />

        <div
          className="india-hero-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "22px",
            alignItems: "start",
          }}
        >
          {/* LEFT — title block + identity grid + quick access */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
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
                  fontSize: "40px",
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
                fontSize: "13.5px",
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

            <NationalIdentityGrid />
            <QuickAccessStrip locale={locale} />
          </div>

          {/* RIGHT — Tricolor achievement badges panel */}
          <TricolorBadgesPanel locale={locale} />
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
        @media (max-width: 1024px) {
          .india-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .india-hero-headline {
            font-size: 32px !important;
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
