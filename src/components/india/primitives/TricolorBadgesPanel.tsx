/**
 * TricolorBadgesPanel — the right-column panel of the v8 hero.
 *
 * File 48 §Section 2 hero v8. Three vertical sections — saffron / white / green —
 * each holding 4 themed achievement badges, plus a footer strip with "Updated
 * Xm ago" and a "View Almanac" link. 12 badges total.
 *
 * Phase 5 TODO: lift the badge data into a registry / DB and wire the footer's
 * "Updated Xm ago" to the live MAX(IndiaScraperRun.startedAt) (the same value
 * LiveStrip uses). Right now the timestamp is a hardcoded placeholder.
 */

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Building,
  Film,
  Globe2,
  Languages,
  Layers,
  MapPin,
  Milk,
  Moon,
  Shield,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Badge {
  icon: LucideIcon;
  headline: string;
  meta: string;
}

const SAFFRON_BADGES: Badge[] = [
  { icon: Award, headline: "Largest democracy", meta: "UN · 2024" },
  { icon: Users, headline: "Most populous · 1.43B", meta: "UN Population Prospects" },
  { icon: Film, headline: "Largest film industry", meta: "UNESCO · 2023" },
  { icon: Milk, headline: "Largest milk producer · 230 MT", meta: "FAO · 2024" },
];

const WHITE_BADGES: Badge[] = [
  { icon: TrendingUp, headline: "3rd largest economy (PPP)", meta: "IMF · FY26" },
  { icon: Moon, headline: "4th nation on the Moon", meta: "ISRO Chandrayaan-3 · 2023" },
  { icon: Globe2, headline: "G20 founding member", meta: "since 1999" },
  { icon: Shield, headline: "4th most powerful military", meta: "Global Firepower · 2025" },
];

const GREEN_BADGES: Badge[] = [
  { icon: Languages, headline: "22 official languages", meta: "Schedule 8 · Constitution" },
  { icon: Layers, headline: "Birthplace of yoga & chess", meta: "3000 BCE" },
  { icon: Building, headline: "5,000+ year civilization", meta: "Mehrgarh · Indus · Vedic" },
  { icon: MapPin, headline: "43 UNESCO World Heritage sites", meta: "UNESCO · 2024" },
];

function BadgeRow({ badge, iconColor }: { badge: Badge; iconColor: string }) {
  const Icon = badge.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.95)",
        border: "0.5px solid rgba(0,0,0,0.08)",
        borderRadius: "6px",
        padding: "5px 9px",
      }}
    >
      <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: "12.5px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.2,
          }}
        >
          {badge.headline}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            color: "var(--color-text-tertiary)",
            marginTop: "2px",
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
  badges,
  iconColor,
}: {
  label: string;
  labelColor: string;
  background: string;
  badges: Badge[];
  iconColor: string;
}) {
  return (
    <div style={{ background, padding: "12px" }}>
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

interface TricolorBadgesPanelProps {
  locale: string;
}

export function TricolorBadgesPanel({ locale }: TricolorBadgesPanelProps) {
  return (
    <aside
      aria-label="India achievement badges"
      style={{
        border: "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Section
        label="World no. 1"
        labelColor="#633806"
        background="linear-gradient(135deg, rgba(255,153,51,0.34) 0%, rgba(255,153,51,0.20) 100%)"
        badges={SAFFRON_BADGES}
        iconColor="#BA7517"
      />
      <Section
        label="Global standing"
        labelColor="var(--color-text-tertiary)"
        background="rgba(255,255,255,0.88)"
        badges={WHITE_BADGES}
        iconColor="#185FA5"
      />
      <Section
        label="Heritage & people"
        labelColor="#173404"
        background="linear-gradient(135deg, rgba(19,136,8,0.22) 0%, rgba(19,136,8,0.34) 100%)"
        badges={GREEN_BADGES}
        iconColor="#3B6D11"
      />

      <div
        style={{
          background: "rgba(250,250,248,1)",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "0.5px solid rgba(0,0,0,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            color: "var(--color-text-tertiary)",
          }}
        >
          {/* TODO Phase 5+: wire to MAX(IndiaScraperRun.startedAt) like LiveStrip. */}
          Updated 14m ago
        </span>
        <Link
          href={`/${locale}/india/almanac`}
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "#534AB7",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          View Almanac →
        </Link>
      </div>
    </aside>
  );
}

export default TricolorBadgesPanel;
