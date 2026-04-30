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
import { BookOpen, Search } from "lucide-react";
import { BilingualRotator } from "./BilingualRotator";
import { IndiaInTheWorldCard } from "./IndiaInTheWorldCard";
import { ModuleDropdown } from "@/components/india/primitives/ModuleDropdown";
import { IndiaTricolor } from "@/lib/india/design-tokens";

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
  // Calm placeholder: simplified outline path + 5 city dots + tropic of cancer.
  return (
    <svg viewBox="0 0 220 260" width="100%" style={{ maxWidth: "220px" }} aria-hidden>
      <path
        d="M70 30 L120 25 L155 50 L170 95 L185 130 L195 160 L180 200 L150 230 L120 245 L90 235 L70 215 L55 180 L45 140 L40 100 L50 60 Z"
        fill="#FAFAF8"
        stroke="var(--color-text-primary)"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <line
        x1="40"
        y1="120"
        x2="195"
        y2="120"
        stroke="var(--color-text-tertiary)"
        strokeOpacity="0.5"
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />
      {/* 5 cities */}
      <circle cx="92" cy="58" r="4" fill="var(--color-text-primary)" /> {/* Delhi */}
      <text x="98" y="62" fontSize="9" fill="var(--color-text-secondary)">Delhi</text>
      <circle cx="74" cy="155" r="3" fill="var(--color-text-primary)" /> {/* Mumbai */}
      <text x="80" y="158" fontSize="9" fill="var(--color-text-secondary)">Mumbai</text>
      <circle cx="105" cy="190" r="3" fill="var(--color-text-primary)" /> {/* Bengaluru */}
      <text x="111" y="193" fontSize="9" fill="var(--color-text-secondary)">Bengaluru</text>
      <circle cx="132" cy="195" r="3" fill="var(--color-text-primary)" /> {/* Chennai */}
      <text x="138" y="198" fontSize="9" fill="var(--color-text-secondary)">Chennai</text>
      <circle cx="160" cy="115" r="3" fill="var(--color-text-primary)" /> {/* Kolkata */}
      <text x="166" y="118" fontSize="9" fill="var(--color-text-secondary)">Kolkata</text>
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
        <KpiCell label="Population" value="1.43" unit="billion · 2024 est." />
        <KpiCell label="Area" value="3.29" unit="million km²" />
        <KpiCell label="Nominal GDP" value="$4.1T" unit="FY26 · IMF" />
        <KpiCell label="States · UTs" value="28 · 8" unit="780 districts" />
        <KpiCell label="Languages" value="22" unit="scheduled · Schedule 8" />
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
          Foundation page — module data syncs in Phase 5
        </span>
      </div>

      {/* India in the world */}
      <IndiaInTheWorldCard />

      {/* Search anchor */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem 1.25rem",
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--color-background-info)",
            color: "var(--color-text-info)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search size={16} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 500 }}>Search across India</div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>
            53 modules · 36 state breakdowns · 780 districts · 320 verified data points
          </div>
        </div>
        <kbd
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            background: "var(--color-surface)",
            border: "0.5px solid var(--color-border-tertiary)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          ⌘K
        </kbd>
      </div>

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

function KpiCell({ label, value, unit }: { label: string; value: string; unit: string }) {
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
      <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
        {unit}
      </div>
    </div>
  );
}

export default IndiaHero;
