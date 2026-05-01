/**
 * QuickAccessStrip — flex-wrap row of 6 quick-access pills with Lucide icons
 * + meta annotations. Renders below the National Identity grid in the hero.
 *
 * File 48 §Section 2 hero v8. Three pills point to existing routes (Districts,
 * States, Schemes); three (Elections, RTI Toolkit, Budget) point to placeholder
 * routes that don't exist yet — clicking will 404 until Phase 5 ships them.
 * The TODO is intentional and acceptable for the v8 hero ship.
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

interface QuickAccessPill {
  icon: LucideIcon;
  label: string;
  meta?: string;
  href: string;
}

interface QuickAccessStripProps {
  locale: string;
}

export function QuickAccessStrip({ locale }: QuickAccessStripProps) {
  // TODO Phase 5+: routes for Elections / RTI Toolkit / Budget don't exist yet;
  // clicking will 404 until the corresponding pages ship.
  const pills: QuickAccessPill[] = [
    { icon: MapPin, label: "Districts", meta: "10/780", href: `/${locale}/india/districts` },
    { icon: Square, label: "States", meta: "7/36", href: `/${locale}/india/states` },
    {
      icon: Building2,
      label: "Schemes",
      meta: "50+",
      href: `/${locale}/india/category/governance`,
    },
    { icon: ShieldAlert, label: "Elections", href: `/${locale}/india/elections` },
    { icon: FileText, label: "RTI Toolkit", href: `/${locale}/india/rti-toolkit` },
    { icon: IndianRupee, label: "Budget", meta: "FY26", href: `/${locale}/india/budget` },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px",
        marginBottom: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-tertiary)",
          marginRight: "4px",
        }}
      >
        Quick
      </span>

      {pills.map((pill) => {
        const Icon = pill.icon;
        return (
          <Link
            key={pill.label}
            href={pill.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: "rgba(255,255,255,0.95)",
              border: "0.5px solid rgba(0,0,0,0.10)",
              borderRadius: "999px",
              padding: "4px 10px",
              fontSize: "11.5px",
              color: "var(--color-text-primary)",
              textDecoration: "none",
              transition: "border-color 150ms",
            }}
          >
            <Icon size={11} style={{ opacity: 0.7 }} />
            <span>{pill.label}</span>
            {pill.meta && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10.5px",
                  color: "var(--color-text-tertiary)",
                }}
              >
                {pill.meta}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default QuickAccessStrip;
