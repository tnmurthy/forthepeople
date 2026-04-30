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
  Languages as LanguagesIcon,
  Moon,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
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

      {/* KPI strip */}
      <div
        className="india-hero-kpi-strip"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "12px",
          marginTop: "1rem",
        }}
      >
        <KpiCell
          label="Population"
          value={
            <CountUpNumber
              target={1.43}
              decimals={2}
              inlineStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            />
          }
          unit="billion · 2024 est."
        />
        <KpiCell
          label="Area"
          value={
            <CountUpNumber
              target={3.29}
              decimals={2}
              inlineStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            />
          }
          unit="million km²"
        />
        <KpiCell
          label="Nominal GDP"
          value={
            <CountUpNumber
              target={4.1}
              decimals={1}
              prefix="$"
              suffix="T"
              inlineStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            />
          }
          unit="FY26 · IMF"
        />
        <KpiCell label="States · UTs" value="28 · 8" unit="780 districts" />
        <KpiCell
          label="Languages"
          value={
            <CountUpNumber
              target={22}
              decimals={0}
              inlineStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: "24px",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            />
          }
          unit="scheduled · Schedule 8"
        />
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

function KpiCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: React.ReactNode;
  unit: string;
}) {
  return (
    <div
      style={{
        background: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-md)",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--color-text-tertiary)",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      {typeof value === "string" ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      ) : (
        <div>{value}</div>
      )}
      <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
        {unit}
      </div>
    </div>
  );
}

export default IndiaHero;
