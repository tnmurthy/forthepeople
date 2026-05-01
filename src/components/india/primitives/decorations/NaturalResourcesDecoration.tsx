/**
 * NaturalResourcesDecoration — Himalayan mountain peaks silhouette across
 * the top edge with snow caps. Section 2.5+3 Commit 9. Slate accent for
 * natural-resources-energy.
 */

import * as React from "react";

export function NaturalResourcesDecoration() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        pointerEvents: "none",
        opacity: 0.40,
        zIndex: 0,
      }}
      viewBox="0 0 700 50"
      preserveAspectRatio="none"
    >
      <path
        d="M 0,50 L 30,30 L 60,18 L 100,32 L 140,8 L 180,28 L 220,15 L 260,38 L 300,12 L 340,30 L 380,22 L 420,5 L 460,30 L 500,18 L 540,35 L 580,12 L 620,28 L 660,20 L 700,38 L 700,50 Z"
        fill="rgba(74, 83, 88, 0.50)"
      />
      <g fill="rgba(255, 255, 255, 0.6)">
        <polygon points="140,8 134,16 146,16" />
        <polygon points="300,12 294,20 306,20" />
        <polygon points="420,5 414,13 426,13" />
        <polygon points="580,12 574,20 586,20" />
      </g>
      <path
        d="M 0,50 L 30,30 L 60,18 L 100,32 L 140,8 L 180,28 L 220,15 L 260,38 L 300,12 L 340,30 L 380,22 L 420,5 L 460,30 L 500,18 L 540,35 L 580,12 L 620,28 L 660,20 L 700,38"
        fill="none"
        stroke="#2A3338"
        strokeWidth="0.7"
      />
    </svg>
  );
}

export default NaturalResourcesDecoration;
