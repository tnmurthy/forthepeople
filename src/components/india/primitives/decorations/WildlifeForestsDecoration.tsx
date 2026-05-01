/**
 * WildlifeForestsDecoration — branch borders + peacock feather corner motif.
 *
 * File 48 §Section 2.3 GAP 4 template. The host SuperCategoryPreviewBand
 * must have `position: relative; overflow: hidden;` so absolute children
 * stay inside the band. All decoration is `pointer-events: none` so it
 * never blocks interactions with the modules below.
 */

import * as React from "react";

const BRANCH_PATH = "M 0,14 Q 50,4 100,14 T 200,14 T 300,14 T 400,14 T 500,14 T 600,14 T 700,14";

function BranchBorder({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: flip ? "auto" : 0,
        bottom: flip ? 0 : "auto",
        height: 28,
        width: "100%",
        pointerEvents: "none",
        transform: flip ? "scaleY(-1)" : undefined,
        zIndex: 0,
      }}
      viewBox="0 0 700 28"
      preserveAspectRatio="none"
    >
      <path d={BRANCH_PATH} fill="none" stroke="#3B6D11" strokeWidth="0.8" opacity="0.55" />
      <g fill="#5A8F2E" opacity="0.55">
        <ellipse cx="80" cy="18" rx="6" ry="3" transform="rotate(28 80 18)" />
        <ellipse cx="180" cy="10" rx="5" ry="2.5" transform="rotate(-22 180 10)" />
        <ellipse cx="280" cy="18" rx="6" ry="3" transform="rotate(28 280 18)" />
        <ellipse cx="380" cy="10" rx="5" ry="2.5" transform="rotate(-22 380 10)" />
        <ellipse cx="480" cy="18" rx="6" ry="3" transform="rotate(28 480 18)" />
        <ellipse cx="580" cy="10" rx="5" ry="2.5" transform="rotate(-22 580 10)" />
        <ellipse cx="660" cy="18" rx="6" ry="3" transform="rotate(28 660 18)" />
      </g>
      <g fill="#173404" opacity="0.65">
        <circle cx="40" cy="14" r="1.5" />
        <circle cx="140" cy="14" r="1.5" />
        <circle cx="240" cy="14" r="1.5" />
        <circle cx="340" cy="14" r="1.5" />
        <circle cx="440" cy="14" r="1.5" />
        <circle cx="540" cy="14" r="1.5" />
        <circle cx="640" cy="14" r="1.5" />
      </g>
    </svg>
  );
}

export function WildlifeForestsDecoration() {
  return (
    <>
      <BranchBorder />
      <BranchBorder flip />

      {/* Peacock feather corner motif — top-right. */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 26,
          right: 26,
          width: 70,
          height: 110,
          pointerEvents: "none",
          opacity: 0.3,
          zIndex: 0,
        }}
        viewBox="0 0 70 110"
      >
        <g stroke="#185FA5" strokeWidth="0.7" fill="none">
          <path d="M 35,10 Q 28,40 35,75 Q 42,40 35,10 Z" fill="rgba(15, 110, 86, 0.18)" />
          <ellipse cx="35" cy="38" rx="9" ry="13" fill="rgba(24, 95, 165, 0.22)" />
          <circle cx="35" cy="38" r="5" fill="rgba(15, 110, 86, 0.30)" />
          <circle cx="35" cy="38" r="2.5" fill="#3C3489" />
          <line x1="35" y1="78" x2="35" y2="105" />
          <path d="M 35,78 Q 38,90 36,105" stroke="#3B6D11" />
        </g>
      </svg>
    </>
  );
}

export default WildlifeForestsDecoration;
