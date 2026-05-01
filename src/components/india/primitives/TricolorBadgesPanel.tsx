/**
 * TricolorBadgesPanel — horizontal 3-column achievement strip.
 *
 * File 48 §Section 2.1 hero v10. Replaces the prior vertical 3-section panel.
 * Three columns side-by-side — saffron / white / green — each holding 3
 * curated badges that DON'T duplicate facts already shown by the rankings
 * card below the hero (population, films, GDP, military, Moon, etc. live
 * only in IndiaInTheWorldCard).
 *
 * The footer ("Updated · sources" + "View Almanac →") moved out of the panel
 * into its own sibling component (`TricolorBadgesFooter`) so it can render
 * independently of the panel — useful if the page wants the strip without
 * the metadata row, or vice versa.
 *
 * Phase 5 TODO: lift the badge data into a registry / DB; wire the footer's
 * "Updated · 14m ago" to the live MAX(IndiaScraperRun.startedAt) (the same
 * value LiveStrip uses).
 */

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Building,
  Globe,
  Globe2,
  Layers,
  Languages,
  Mailbox,
  Milk,
  Train,
  type LucideIcon,
} from "lucide-react";

interface Badge {
  icon: LucideIcon;
  headline: string;
  meta: string;
}

const SAFFRON_BADGES: Badge[] = [
  { icon: Award,   headline: "Largest democracy",                       meta: "UN · 2024" },
  { icon: Mailbox, headline: "Largest postal network · 156K offices",   meta: "India Post" },
  { icon: Milk,    headline: "Largest milk producer · 230 MT",          meta: "FAO · 2024" },
];

const WHITE_BADGES: Badge[] = [
  { icon: Globe2, headline: "G20 founding member",                      meta: "since 1999" },
  { icon: Globe,  headline: "UN founding member",                       meta: "since 1945" },
  { icon: Train,  headline: "Largest railway employer · 1.4M staff",    meta: "Indian Railways" },
];

const GREEN_BADGES: Badge[] = [
  { icon: Languages, headline: "22 official languages",                 meta: "Schedule 8 · Constitution" },
  { icon: Layers,    headline: "Birthplace of yoga & chess",            meta: "3000 BCE" },
  { icon: Building,  headline: "5,000+ year civilization",              meta: "Mehrgarh · Indus · Vedic" },
];

function BadgeRow({ badge, iconColor }: { badge: Badge; iconColor: string }) {
  const Icon = badge.icon;
  return (
    <div
      className="ftp-tricolor-badge"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.95)",
        border: "0.5px solid rgba(0,0,0,0.10)",
        borderRadius: "6px",
        padding: "5px 8px",
        transition: "transform 150ms, border-color 150ms",
      }}
    >
      <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: "11.5px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {badge.headline}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--color-text-tertiary)",
            marginTop: "1px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {badge.meta}
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  labelColor,
  background,
  borderRight,
  badges,
  iconColor,
}: {
  label: string;
  labelColor: string;
  background: string;
  borderRight: boolean;
  badges: Badge[];
  iconColor: string;
}) {
  return (
    <div
      style={{
        background,
        padding: "10px 12px",
        borderRight: borderRight ? "0.5px solid rgba(0,0,0,0.08)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
          color: labelColor,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {badges.map((b) => (
          <BadgeRow key={b.headline} badge={b} iconColor={iconColor} />
        ))}
      </div>
    </div>
  );
}

export function TricolorBadgesPanel() {
  return (
    <aside
      aria-label="India achievement badges"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        border: "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Section
        label="World firsts"
        labelColor="#633806"
        background="linear-gradient(135deg, rgba(255,153,51,0.34) 0%, rgba(255,153,51,0.20) 100%)"
        borderRight
        badges={SAFFRON_BADGES}
        iconColor="#BA7517"
      />
      <Section
        label="International standing"
        labelColor="var(--color-text-tertiary)"
        background="rgba(255,255,255,0.88)"
        borderRight
        badges={WHITE_BADGES}
        iconColor="#185FA5"
      />
      <Section
        label="Heritage & people"
        labelColor="#173404"
        background="linear-gradient(135deg, rgba(19,136,8,0.22) 0%, rgba(19,136,8,0.34) 100%)"
        borderRight={false}
        badges={GREEN_BADGES}
        iconColor="#3B6D11"
      />

      <style>{`
        .ftp-tricolor-badge:hover {
          transform: translateY(-1px);
          border-color: rgba(0,0,0,0.20) !important;
        }
      `}</style>
    </aside>
  );
}

export interface TricolorBadgesFooterProps {
  locale: string;
  /** Optional override for the right-aligned freshness label. */
  updatedLabel?: string;
  /** Optional override for the left-side source-count text. */
  sourcesLabel?: string;
}

/**
 * Footer strip rendered as a sibling below the panel — keeps the panel pure
 * (just badges) so it can be dropped into other layouts without dragging the
 * metadata row along.
 */
export function TricolorBadgesFooter({
  locale,
  updatedLabel = "Updated 14m ago",
  sourcesLabel = "320 sources verified",
}: TricolorBadgesFooterProps) {
  return (
    <div
      style={{
        background: "rgba(250,250,248,1)",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "0.5px solid rgba(0,0,0,0.08)",
        borderTop: "none",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          color: "var(--color-text-tertiary)",
        }}
      >
        {/* TODO Phase 5+: wire updatedLabel to MAX(IndiaScraperRun.startedAt). */}
        {updatedLabel} · {sourcesLabel}
      </span>
      <Link
        href={`/${locale}/india/almanac`}
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "#534AB7",
          textDecoration: "none",
        }}
      >
        View India Almanac →
      </Link>
    </div>
  );
}

export default TricolorBadgesPanel;
