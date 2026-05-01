/**
 * AgricultureDecoration — wheat stalks (left + right vertical) + rangoli
 * floral dot pattern. Section 2.5+3 Commit 8. Wheat amber accent for the
 * agriculture-livestock super-category.
 */

import * as React from "react";

function WheatStalk({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        ...(flip ? { right: 4 } : { left: 4 }),
        width: 28,
        height: "100%",
        pointerEvents: "none",
        opacity: 0.55,
        transform: flip ? "scaleX(-1)" : undefined,
        zIndex: 0,
      }}
      viewBox="0 0 28 320"
      preserveAspectRatio="none"
    >
      <g stroke="#B58A1E" strokeWidth="1" fill="rgba(181, 138, 30, 0.30)">
        <line x1="14" y1="20" x2="14" y2="300" strokeWidth="1.2" />
        <ellipse cx="9" cy="40" rx="3" ry="6" />
        <ellipse cx="19" cy="60" rx="3" ry="6" />
        <ellipse cx="9" cy="80" rx="3" ry="6" />
        <ellipse cx="19" cy="100" rx="3" ry="6" />
        <ellipse cx="9" cy="120" rx="3" ry="6" />
        <ellipse cx="19" cy="140" rx="3" ry="6" />
        <ellipse cx="9" cy="160" rx="3" ry="6" />
        <ellipse cx="19" cy="180" rx="3" ry="6" />
        <ellipse cx="9" cy="200" rx="3" ry="6" />
        <ellipse cx="19" cy="220" rx="3" ry="6" />
        <ellipse cx="9" cy="240" rx="3" ry="6" />
        <ellipse cx="19" cy="260" rx="3" ry="6" />
        <ellipse cx="9" cy="280" rx="3" ry="6" />
      </g>
    </svg>
  );
}

export function AgricultureDecoration() {
  return (
    <>
      <WheatStalk />
      <WheatStalk flip />
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 18,
          right: 80,
          width: 56,
          height: 56,
          pointerEvents: "none",
          opacity: 0.5,
          zIndex: 0,
        }}
        viewBox="-28 -28 56 56"
      >
        <g fill="#B58A1E">
          <circle cx="0" cy="0" r="2.5" />
          <circle cx="0" cy="-12" r="2" />
          <circle cx="0" cy="12" r="2" />
          <circle cx="-12" cy="0" r="2" />
          <circle cx="12" cy="0" r="2" />
          <circle cx="-8" cy="-8" r="1.5" />
          <circle cx="8" cy="-8" r="1.5" />
          <circle cx="-8" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="0" cy="-20" r="1.5" opacity="0.7" />
          <circle cx="0" cy="20" r="1.5" opacity="0.7" />
          <circle cx="-20" cy="0" r="1.5" opacity="0.7" />
          <circle cx="20" cy="0" r="1.5" opacity="0.7" />
        </g>
      </svg>
    </>
  );
}

export default AgricultureDecoration;
