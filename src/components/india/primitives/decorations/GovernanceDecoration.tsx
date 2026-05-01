/**
 * GovernanceDecoration — architectural pillar shafts (left + right) with
 * lotus-capital abstraction. Section 2.5+3 Commit 11. Purple accent.
 *
 * LEGAL NOTE: This is a decorative pillar/column motif only. Deliberately
 * does NOT depict the 24-spoke Ashoka chakra or the four-lion capital,
 * both of which are restricted under the State Emblem of India (Prohibition
 * of Improper Use) Act 2005.
 */

import * as React from "react";

function PillarColumn({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 8,
        ...(flip ? { right: 8 } : { left: 8 }),
        width: 22,
        height: "calc(100% - 16px)",
        pointerEvents: "none",
        opacity: 0.45,
        transform: flip ? "scaleX(-1)" : undefined,
        zIndex: 0,
      }}
      viewBox="0 0 22 320"
      preserveAspectRatio="none"
    >
      <g stroke="#3C3489" strokeWidth="0.8" fill="rgba(60, 52, 137, 0.20)">
        <rect x="2" y="6" width="18" height="4" />
        <ellipse cx="11" cy="14" rx="9" ry="3" />
        <ellipse cx="11" cy="22" rx="7" ry="2.5" />
        <rect x="6" y="28" width="10" height="270" />
        <line x1="8" y1="28" x2="8" y2="298" />
        <line x1="11" y1="28" x2="11" y2="298" />
        <line x1="14" y1="28" x2="14" y2="298" />
        <rect x="3" y="298" width="16" height="4" />
        <rect x="2" y="304" width="18" height="6" />
      </g>
    </svg>
  );
}

export function GovernanceDecoration() {
  return (
    <>
      <PillarColumn />
      <PillarColumn flip />
    </>
  );
}

export default GovernanceDecoration;
