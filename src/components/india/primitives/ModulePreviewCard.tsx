/**
 * ModulePreviewCard — module preview tile per Mockup 1 v2.
 *
 * Used inside SuperCategoryPreviewBand on /en/india AND inside the
 * Level-2 super-category page grid. File 45 §4.
 *
 * Phase 4 placeholder: sparkline is a static polyline. Real data lives
 * in IndiaIndicator + IndiaTimeSeries; Phase 5 wires them in.
 */

import * as React from "react";
import Link from "next/link";
import type { IndiaModuleDef } from "@/lib/india/india-modules";
import {
  IndiaSuperCategoryAccents,
  type IndiaAccentColorKey,
} from "@/lib/india/design-tokens";

export interface ModulePreviewCardProps {
  module: IndiaModuleDef;
  accentColor: IndiaAccentColorKey;
  locale: string;
  className?: string;
}

function StatusPill({ status }: { status: IndiaModuleDef["status"] }) {
  if (status === "live") {
    return (
      <span
        style={{
          fontSize: "9px",
          background: "#E1F5EE",
          color: "#16A34A",
          padding: "1px 6px",
          borderRadius: "3px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        Live
      </span>
    );
  }
  return (
    <span
      style={{
        fontSize: "9px",
        background: "#FAEEDA",
        color: "#854F0B",
        padding: "1px 6px",
        borderRadius: "3px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}
    >
      Soon
    </span>
  );
}

function PlaceholderSparkline({ accentHex }: { accentHex: string }) {
  // Simple 7-point polyline placeholder, replaced in Phase 5.
  return (
    <svg viewBox="0 0 200 40" width="100%" height="32" aria-hidden>
      <polyline
        points="0,30 30,26 60,28 90,18 120,22 150,12 200,8"
        fill="none"
        stroke={accentHex}
        strokeOpacity="0.85"
        strokeWidth="1.4"
      />
      <polyline
        points="0,30 30,26 60,28 90,18 120,22 150,12 200,8 200,40 0,40"
        fill={accentHex}
        fillOpacity="0.10"
        stroke="none"
      />
    </svg>
  );
}

export function ModulePreviewCard({
  module,
  accentColor,
  locale,
  className,
}: ModulePreviewCardProps) {
  const accent = IndiaSuperCategoryAccents[accentColor];
  const headlineValue =
    module.headlineMetric?.mockValue !== undefined
      ? module.headlineMetric.mockValue
      : "—";
  const headlineUnit = module.headlineMetric?.mockUnit ?? "";

  return (
    <Link
      href={`/${locale}/india/${module.slug}`}
      className={className}
      style={{
        display: "block",
        position: "relative",
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "16px 18px 14px 22px",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 150ms",
      }}
    >
      {/* 3px accent stripe */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: accent.hex,
          borderTopLeftRadius: "var(--border-radius-lg)",
          borderBottomLeftRadius: "var(--border-radius-lg)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>{module.icon}</span>
          <span style={{ fontSize: "14px", fontWeight: 500 }}>{module.title}</span>
        </div>
        <StatusPill status={module.status} />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: 1.1,
            color: accent.text,
          }}
        >
          {headlineValue}
        </span>
        {headlineUnit && (
          <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
            {headlineUnit}
          </span>
        )}
      </div>

      <PlaceholderSparkline accentHex={accent.hex} />

      <p
        style={{
          fontSize: "12px",
          color: "var(--color-text-secondary)",
          margin: "8px 0 0",
          lineHeight: 1.5,
        }}
      >
        {module.tagline}
      </p>
    </Link>
  );
}

export default ModulePreviewCard;
