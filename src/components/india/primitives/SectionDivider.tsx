"use client";

/**
 * SectionDivider — single transition between two super-categories on
 * /[locale]/india.
 *
 * Renders a horizontal layout: faint gradient line on the left, a
 * Lucide icon in the center (the icon for the INCOMING section), and
 * a faint gradient line on the right. The icon + line color match
 * SECTION_ACCENT_COLORS[nextSlug] so the visual cue announces the
 * next band without yet seeing it.
 *
 * Used in place of the repeating MughalArchDivider for the bands
 * between the 10 super-categories (so 9 dividers total).
 */

import * as React from "react";
import { SECTION_WATERMARK_ICONS } from "@/lib/india/section-watermark-icons";
import { SECTION_ACCENT_COLORS } from "@/lib/india/section-accents";

export function SectionDivider({ nextSlug }: { nextSlug: string }) {
  const Icon = SECTION_WATERMARK_ICONS[nextSlug];
  const color = SECTION_ACCENT_COLORS[nextSlug];
  if (!Icon || !color) return null;

  // Hex → rgba helper for the gradient endpoints (55% peak opacity).
  const peak = `color-mix(in srgb, ${color} 55%, transparent)`;

  return (
    <div
      role="separator"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 0",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <span
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to right, transparent 0%, ${peak} 100%)`,
        }}
      />
      <Icon
        width={32}
        height={24}
        strokeWidth={0.8}
        color={color}
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(to right, ${peak} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

export default SectionDivider;
