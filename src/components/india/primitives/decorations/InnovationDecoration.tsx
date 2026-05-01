/**
 * InnovationDecoration — circuit-board traces with lotus nodes at junctions.
 * Section 2.5+3 Commit 12. Coral accent for innovation.
 */

import * as React from "react";

export function InnovationDecoration() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        opacity: 0.30,
        zIndex: 0,
      }}
      viewBox="0 0 700 320"
      preserveAspectRatio="none"
    >
      <g stroke="#993C1D" strokeWidth="0.7" fill="none">
        <path d="M 0,40 L 80,40 L 80,80 L 200,80 L 200,40 L 320,40" />
        <path d="M 380,40 L 480,40 L 480,90 L 600,90 L 600,40 L 700,40" />
        <path d="M 0,160 L 100,160 L 100,200 L 220,200 L 220,160 L 380,160" />
        <path d="M 420,160 L 500,160 L 500,210 L 620,210 L 620,160 L 700,160" />
        <path d="M 0,280 L 90,280 L 90,250 L 220,250 L 220,280 L 350,280 L 350,260 L 480,260 L 480,280 L 700,280" />
      </g>
      <g fill="#993C1D">
        <circle cx="80" cy="40" r="3" />
        <circle cx="80" cy="80" r="3" />
        <circle cx="200" cy="80" r="3" />
        <circle cx="200" cy="40" r="3" />
        <circle cx="480" cy="40" r="3" />
        <circle cx="480" cy="90" r="3" />
        <circle cx="600" cy="90" r="3" />
        <circle cx="600" cy="40" r="3" />
        <circle cx="100" cy="160" r="3" />
        <circle cx="100" cy="200" r="3" />
        <circle cx="220" cy="200" r="3" />
        <circle cx="220" cy="160" r="3" />
        <circle cx="500" cy="160" r="3" />
        <circle cx="500" cy="210" r="3" />
        <circle cx="620" cy="210" r="3" />
        <circle cx="620" cy="160" r="3" />
      </g>
      <g
        transform="translate(640, 270)"
        fill="rgba(153, 60, 29, 0.30)"
        stroke="#993C1D"
        strokeWidth="0.6"
      >
        <ellipse cx="0" cy="-8" rx="3" ry="6" />
        <ellipse cx="0" cy="-8" rx="3" ry="6" transform="rotate(72)" />
        <ellipse cx="0" cy="-8" rx="3" ry="6" transform="rotate(144)" />
        <ellipse cx="0" cy="-8" rx="3" ry="6" transform="rotate(216)" />
        <ellipse cx="0" cy="-8" rx="3" ry="6" transform="rotate(288)" />
      </g>
    </svg>
  );
}

export default InnovationDecoration;
