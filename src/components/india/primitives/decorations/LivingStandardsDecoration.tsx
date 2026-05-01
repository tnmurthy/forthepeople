/**
 * LivingStandardsDecoration — lotus motif + water-wave bottom border.
 * Section 2.5+3 Commit 7. Teal accent for living-standards.
 */

import * as React from "react";

export function LivingStandardsDecoration() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 16,
          right: 22,
          width: 72,
          height: 72,
          pointerEvents: "none",
          opacity: 0.45,
          zIndex: 0,
        }}
        viewBox="-36 -36 72 72"
      >
        <g stroke="#0F6E56" strokeWidth="0.7" fill="rgba(15, 110, 86, 0.16)">
          <ellipse cx="0" cy="-18" rx="6" ry="14" />
          <ellipse cx="0" cy="-18" rx="6" ry="14" transform="rotate(60)" />
          <ellipse cx="0" cy="-18" rx="6" ry="14" transform="rotate(120)" />
          <ellipse cx="0" cy="-18" rx="6" ry="14" transform="rotate(180)" />
          <ellipse cx="0" cy="-18" rx="6" ry="14" transform="rotate(240)" />
          <ellipse cx="0" cy="-18" rx="6" ry="14" transform="rotate(300)" />
          <circle cx="0" cy="0" r="5" fill="#0F6E56" opacity="0.5" />
          <circle cx="0" cy="0" r="2" fill="#993556" />
        </g>
      </svg>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 22,
          pointerEvents: "none",
          opacity: 0.55,
          zIndex: 0,
        }}
        viewBox="0 0 700 22"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,12 Q 35,4 70,12 T 140,12 T 210,12 T 280,12 T 350,12 T 420,12 T 490,12 T 560,12 T 630,12 T 700,12"
          fill="none"
          stroke="#0F6E56"
          strokeWidth="1"
        />
        <path
          d="M 0,16 Q 35,8 70,16 T 140,16 T 210,16 T 280,16 T 350,16 T 420,16 T 490,16 T 560,16 T 630,16 T 700,16"
          fill="none"
          stroke="#0F6E56"
          strokeWidth="0.7"
          opacity="0.6"
        />
      </svg>
    </>
  );
}

export default LivingStandardsDecoration;
