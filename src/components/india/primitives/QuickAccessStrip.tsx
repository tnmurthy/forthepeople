/**
 * QuickAccessStrip — single-row 1×6 strip of quick-access cards.
 *
 * File 48 §Section 2 hero v10. Each card is a 7px 9px tile with an icon +
 * title row plus a meta line below. Hover lifts the card 1px and tightens
 * the border tint.
 *
 * Three pills point to existing routes (Districts / States / Schemes); three
 * (Elections / RTI Toolkit / Budget) point to placeholder routes that don't
 * exist yet — clicking will 404 until Phase 5 ships them. Acceptable for v10.
 */

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  IndianRupee,
  MapPin,
  ShieldAlert,
  Square,
  type LucideIcon,
} from "lucide-react";

interface QuickAccessCard {
  icon: LucideIcon;
  label: string;
  meta: string;
  href: string;
}

interface QuickAccessStripProps {
  locale: string;
}

export function QuickAccessStrip({ locale }: QuickAccessStripProps) {
  // TODO Phase 5+: routes for Elections / RTI Toolkit / Budget don't exist yet;
  // clicking will 404 until the corresponding pages ship.
  const cards: QuickAccessCard[] = [
    { icon: MapPin,      label: "Districts",   meta: "10 of 780 live",        href: `/${locale}/india/districts` },
    { icon: Square,      label: "States",      meta: "7 of 36 covered",       href: `/${locale}/india/states` },
    { icon: Building2,   label: "Schemes",     meta: "50+ central",           href: `/${locale}/india/category/governance` },
    { icon: ShieldAlert, label: "Elections",   meta: "Lok Sabha · Vidhan",    href: `/${locale}/india/elections` },
    { icon: FileText,    label: "RTI Toolkit", meta: "File · track · escalate", href: `/${locale}/india/rti-toolkit` },
    { icon: IndianRupee, label: "Budget",      meta: "FY26 · ₹47.6L cr",      href: `/${locale}/india/budget` },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "6px",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.label}
            href={card.href}
            className="ftp-quick-access-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              background: "rgba(255,255,255,0.95)",
              border: "0.5px solid rgba(0,0,0,0.10)",
              borderRadius: "6px",
              padding: "7px 9px",
              color: "var(--color-text-primary)",
              textDecoration: "none",
              transition: "transform 150ms, border-color 150ms",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Icon size={12} style={{ opacity: 0.7, flexShrink: 0 }} />
              <span style={{ fontSize: "11.5px", fontWeight: 500 }}>{card.label}</span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9.5px",
                color: "var(--color-text-tertiary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {card.meta}
            </span>
          </Link>
        );
      })}

      <style>{`
        .ftp-quick-access-card:hover {
          transform: translateY(-1px);
          border-color: rgba(0,0,0,0.20) !important;
        }
      `}</style>
    </div>
  );
}

export default QuickAccessStrip;
