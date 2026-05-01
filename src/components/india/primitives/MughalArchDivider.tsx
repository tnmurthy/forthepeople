/**
 * MughalArchDivider — slim decorative SVG divider with a Mughal-style ogee
 * arch crest at the center.
 *
 * File 48 §Section 2.2 heritage foundation. Used between major sections of
 * the homepage (hero / KPI strip / rankings card / super-category bands).
 *
 * Pure presentational — no animation, no interactivity. Default accent is
 * the saffron 700 stop; pass `accent` to override (e.g. teal between
 * Living Standards and Wildlife sections).
 */

import * as React from "react";

interface MughalArchDividerProps {
  accent?: string;
  className?: string;
  /** Vertical breathing room outside the divider; default ~6px each side. */
  marginY?: string;
}

export function MughalArchDivider({
  accent = "#BA7517",
  className,
  marginY = "6px",
}: MughalArchDividerProps) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        height: "28px",
        marginTop: marginY,
        marginBottom: marginY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%"
        height="28"
        viewBox="0 0 700 28"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <path
          d="M 0,18 L 280,18 Q 320,18 332,8 Q 350,-4 350,-4 Q 350,-4 368,8 Q 380,18 420,18 L 700,18"
          fill="none"
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="0.7"
        />
        <circle cx="350" cy="0" r="3" fill={accent} fillOpacity="0.7" />
        <circle
          cx="350"
          cy="0"
          r="6"
          fill="none"
          stroke={accent}
          strokeOpacity="0.30"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

export default MughalArchDivider;
