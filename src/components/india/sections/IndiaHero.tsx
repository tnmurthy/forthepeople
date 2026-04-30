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
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { BilingualRotator } from "./BilingualRotator";
import { IndiaInTheWorldCard } from "./IndiaInTheWorldCard";
import { ModuleDropdown } from "@/components/india/primitives/ModuleDropdown";
import { CountUpNumber } from "@/components/india/primitives/CountUpNumber";
import { IndiaTricolor } from "@/lib/india/design-tokens";
import {
  INDIA_OUTLINE_PATH_D,
  INDIA_OUTLINE_VIEWBOX,
  INDIA_TROPIC_OF_CANCER_Y,
  INDIA_CITY_MARKERS,
} from "@/data/india-outline";

interface IdentityChip {
  emoji: string;
  text: string;
  family: string;
  bg: string;
  fg: string;
  worldFirst?: boolean;
}

const ROW_1: IdentityChip[] = [
  { emoji: "🥇", text: "World's largest democracy", family: "blue", bg: "#E6F1FB", fg: "#0C447C", worldFirst: true },
  { emoji: "🥇", text: "Most populous nation", family: "teal", bg: "#E1F5EE", fg: "#085041", worldFirst: true },
  { emoji: "🥇", text: "Largest film industry", family: "red", bg: "#FAECE7", fg: "#712B13", worldFirst: true },
];
const ROW_2: IdentityChip[] = [
  { emoji: "🪙", text: "3rd largest economy (PPP)", family: "purple", bg: "#EEEDFE", fg: "#26215C" },
  { emoji: "🌙", text: "4th nation on the Moon", family: "amber", bg: "#FAEEDA", fg: "#633806" },
  { emoji: "🗣️", text: "22 official languages", family: "pink", bg: "#FBEAF0", fg: "#72243E" },
];
const ROW_3: IdentityChip[] = [
  { emoji: "🌐", text: "G20 founding member", family: "green", bg: "#EAF3DE", fg: "#27500A" },
  { emoji: "🧘", text: "Birthplace of yoga & chess", family: "coral", bg: "#FAECE7", fg: "#712B13" },
  { emoji: "🏺", text: "5,000-year civilization", family: "gray", bg: "#E8EAEC", fg: "#2C3033" },
];

function ChipRow({ chips }: { chips: IdentityChip[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
      {chips.map((c) => (
        <span
          key={c.text}
          style={{
            background: c.bg,
            color: c.fg,
            opacity: 0.92,
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            lineHeight: 1.5,
          }}
        >
          {c.worldFirst && (
            <span
              aria-hidden
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#BA7517",
                display: "inline-block",
              }}
            />
          )}
          <span>{c.emoji}</span>
          <span>{c.text}</span>
        </span>
      ))}
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

interface IndiaHeroProps {
  locale: string;
  freshnessLine?: string;
}

export function IndiaHero({ locale, freshnessLine }: IndiaHeroProps) {
  const ceremonialDots = [
    { color: IndiaTricolor.saffron, border: false },
    { color: IndiaTricolor.white, border: true },
    { color: IndiaTricolor.green, border: false },
  ];

  return (
    <section style={{ padding: "0 0 1rem 0" }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "var(--color-text-tertiary)",
          marginBottom: "12px",
        }}
      >
        <Link href={`/${locale}`} style={{ color: "var(--color-text-tertiary)" }}>
          Home
        </Link>
        <span>›</span>
        <span style={{ color: "var(--color-text-secondary)" }}>India</span>
        <span>›</span>
        <ModuleDropdown currentLabel="Select module" scope="all-india" locale={locale} />
      </nav>

      {/* Hero stage */}
      <div
        style={{
          position: "relative",
          padding: "22px 26px",
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border-tertiary)",
        }}
      >
        {/* tricolor washes */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: IndiaTricolor.containerOpacity,
            pointerEvents: "none",
            background: `radial-gradient(60% 60% at 0% 0%, rgba(255, 153, 51, ${IndiaTricolor.saffronWashOpacity}) 0%, transparent 60%), radial-gradient(60% 60% at 100% 100%, rgba(19, 136, 8, ${IndiaTricolor.greenWashOpacity}) 0%, transparent 60%)`,
          }}
        />

        <div
          className="india-hero-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* LEFT — title block */}
          <div>
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-tertiary)",
                marginBottom: "10px",
              }}
            >
              South Asia · Republic
            </div>

            <h1
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "60px",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 4px",
              }}
              className="india-hero-headline"
            >
              India
            </h1>

            <BilingualRotator />

            <div
              style={{
                fontSize: "15px",
                fontStyle: "italic",
                color: "var(--color-text-secondary)",
                margin: "8px 0",
              }}
            >
              &quot;Sovereign, socialist, secular, democratic republic&quot;
            </div>

            <a
              href="https://www.constitutionofindia.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "var(--color-text-info)",
                background: "var(--color-background-info)",
                padding: "5px 10px",
                borderRadius: "999px",
                textDecoration: "none",
              }}
            >
              <BookOpen size={13} />
              Read the Preamble — every Indian should
            </a>

            {/* 3 rows of identity chips */}
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <ChipRow chips={ROW_1} />
              <ChipRow chips={ROW_2} />
              <ChipRow chips={ROW_3} />
            </div>
            <div
              style={{ fontSize: "10px", color: "var(--color-text-tertiary)", marginTop: "8px" }}
            >
              ● denotes a current world #1 ranking
            </div>
          </div>

          {/* RIGHT — India outline */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
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
            <div style={{ fontSize: "10px", color: "var(--color-text-tertiary)" }}>
              — Tropic of Cancer —
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
