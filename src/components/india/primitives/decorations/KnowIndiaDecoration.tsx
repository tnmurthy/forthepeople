/**
 * KnowIndiaDecoration — illuminated drop-cap "K" + manuscript scroll edge.
 * Section 2.5+3 Commit 6. Indigo accent for the know-india super-category.
 */

import * as React from "react";

export function KnowIndiaDecoration() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          width: 64,
          height: 64,
          pointerEvents: "none",
          opacity: 0.40,
          zIndex: 0,
        }}
        viewBox="0 0 64 64"
      >
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="6"
          fill="rgba(83, 74, 183, 0.18)"
          stroke="#534AB7"
          strokeWidth="0.8"
        />
        <text
          x="32"
          y="48"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="48"
          fontWeight="500"
          fill="#3C3489"
          textAnchor="middle"
        >
          K
        </text>
        <g stroke="#534AB7" strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M 6,8 Q 12,4 16,8" />
          <path d="M 48,56 Q 54,52 58,56" />
        </g>
      </svg>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 38,
          height: "100%",
          pointerEvents: "none",
          opacity: 0.35,
          zIndex: 0,
        }}
        viewBox="0 0 38 320"
        preserveAspectRatio="none"
      >
        <g stroke="#534AB7" strokeWidth="0.7" fill="none">
          <path d="M 38,0 Q 18,40 28,80 Q 38,120 18,160 Q 0,200 28,240 Q 38,280 22,320" />
          <path
            d="M 32,0 Q 14,40 22,80 Q 32,120 12,160 Q -2,200 22,240 Q 32,280 16,320"
            opacity="0.5"
          />
        </g>
      </svg>
    </>
  );
}

export default KnowIndiaDecoration;
