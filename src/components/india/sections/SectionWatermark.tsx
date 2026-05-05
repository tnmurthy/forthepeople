"use client";

/**
 * Identity-zone watermark for the v12 super-category bands. Resolves
 * the section's slug to the matching Lucide icon and renders it at
 * opacity 0.07 in white. Per-section CSS module supplies the
 * positioning class so each band can place the watermark in its
 * preferred corner.
 *
 * Replaces the previous per-section custom SVG components
 * (Backdrop.tsx in each section directory) with a single shared
 * component driven by SECTION_WATERMARK_ICONS.
 */

import { SECTION_WATERMARK_ICONS } from "@/lib/india/section-watermark-icons";

export function SectionWatermark({
  slug,
  className,
}: {
  slug: string;
  className: string;
}) {
  const Icon = SECTION_WATERMARK_ICONS[slug];
  if (!Icon) return null;
  // The data-ftp-watermark attribute lets india-mobile.css fade every
  // section's watermark on viewports < 768 px without touching the
  // 10 per-section CSS modules that own the positioning class.
  return (
    <Icon
      className={className}
      strokeWidth={1}
      aria-hidden
      data-ftp-watermark="1"
    />
  );
}
