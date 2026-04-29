/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Shared scaffolding + types for the 18 category illustrations under
 * src/components/india/svg/. Every SVG component takes the same props
 * so swapping one for another is a one-line change.
 */

import type { ReactNode } from "react";

export interface SvgProps {
  /** Stroke colour. Always pass a CATEGORY_ACCENT hex from india-design. */
  accent: string;
  /** Pixel size for both width and height. Aspect ratio is always 1:1. */
  size?: number;
  className?: string;
  /** A11y title — falls back to category-specific text. */
  title?: string;
}

/**
 * Wraps an inline SVG with the canonical viewBox + accent-derived
 * styles. Children receive the resolved fill (8% opacity tint of the
 * accent) via the SvgChildProps shape.
 */
export interface SvgChildProps {
  accent: string;
  fill: string;
  stroke: number;
}

export function SvgFrame({
  accent,
  size = 208,
  className,
  title,
  children,
}: SvgProps & { children: (p: SvgChildProps) => ReactNode }) {
  // 14 in hex = 20/255 ≈ 8% opacity — the soft-fill tint per the
  // tricolor sprinkle rule (file 31 §4 + Phase 2.5d spec).
  const fill = `${accent}1F`;
  const stroke = 2.4;
  return (
    <svg
      role="img"
      aria-label={title ?? "Category illustration"}
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title ?? "Category illustration"}</title>
      <g
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children({ accent, fill, stroke })}
      </g>
    </svg>
  );
}
