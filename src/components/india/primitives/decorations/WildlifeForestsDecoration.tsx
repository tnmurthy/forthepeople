/**
 * WildlifeForestsDecoration — branch borders + peacock feather corner motif.
 *
 * File 48 §Section 2.5+3 Commit 4 — branches reworked to read as "branch with
 * leaves and berries" instead of "scattered dots." Stem thicker, leaves bigger,
 * intermediate leaves added, small tendrils between them. Host band must
 * have `position: relative; overflow: hidden;` so absolute children stay
 * inside; all decoration is `pointer-events: none`.
 */

import * as React from "react";

const BRANCH_PATH = "M 0,18 Q 50,4 100,18 T 200,18 T 300,18 T 400,18 T 500,18 T 600,18 T 700,18";

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
        height: 36,
        width: "100%",
        pointerEvents: "none",
        transform: flip ? "scaleY(-1)" : undefined,
        zIndex: 0,
      }}
      viewBox="0 0 700 36"
      preserveAspectRatio="none"
    >
      <path d={BRANCH_PATH} fill="none" stroke="#3B6D11" strokeWidth="1.4" opacity="0.85" />
      {/* Leaves — alternating sides, larger and more visible */}
      <g fill="#5A8F2E" opacity="0.75">
        <ellipse cx="80" cy="24" rx="9" ry="4" transform="rotate(28 80 24)" />
        <ellipse cx="130" cy="10" rx="7" ry="3.2" transform="rotate(-20 130 10)" />
        <ellipse cx="180" cy="24" rx="9" ry="4" transform="rotate(28 180 24)" />
        <ellipse cx="230" cy="10" rx="7" ry="3.2" transform="rotate(-20 230 10)" />
        <ellipse cx="280" cy="24" rx="9" ry="4" transform="rotate(28 280 24)" />
        <ellipse cx="330" cy="10" rx="7" ry="3.2" transform="rotate(-20 330 10)" />
        <ellipse cx="380" cy="24" rx="9" ry="4" transform="rotate(28 380 24)" />
        <ellipse cx="430" cy="10" rx="7" ry="3.2" transform="rotate(-20 430 10)" />
        <ellipse cx="480" cy="24" rx="9" ry="4" transform="rotate(28 480 24)" />
        <ellipse cx="530" cy="10" rx="7" ry="3.2" transform="rotate(-20 530 10)" />
        <ellipse cx="580" cy="24" rx="9" ry="4" transform="rotate(28 580 24)" />
        <ellipse cx="630" cy="10" rx="7" ry="3.2" transform="rotate(-20 630 10)" />
        <ellipse cx="680" cy="24" rx="9" ry="4" transform="rotate(28 680 24)" />
      </g>
      {/* Tendrils — small curved stems between leaves */}
      <g fill="none" stroke="#3B6D11" strokeWidth="0.7" opacity="0.65">
        <path d="M 105,18 Q 110,12 118,12" />
        <path d="M 205,18 Q 210,24 218,24" />
        <path d="M 305,18 Q 310,12 318,12" />
        <path d="M 405,18 Q 410,24 418,24" />
        <path d="M 505,18 Q 510,12 518,12" />
        <path d="M 605,18 Q 610,24 618,24" />
      </g>
      {/* Berries — small dark dots along stem */}
      <g fill="#173404" opacity="0.85">
        <circle cx="40" cy="18" r="2.2" />
        <circle cx="155" cy="18" r="2.2" />
        <circle cx="255" cy="18" r="2.2" />
        <circle cx="355" cy="18" r="2.2" />
        <circle cx="455" cy="18" r="2.2" />
        <circle cx="555" cy="18" r="2.2" />
        <circle cx="655" cy="18" r="2.2" />
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
          top: 30,
          right: 26,
          width: 70,
          height: 110,
          pointerEvents: "none",
          opacity: 0.5,
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
