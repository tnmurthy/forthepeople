/**
 * HeroMandala — 8-fold geometric mandala watermark behind the India title.
 * File 48 §Section 2.5+3 Commit 2.
 *
 * IMPORTANT: This is an 8-fold mandala (NOT 24-fold) — never the Ashoka
 * chakra (legally restricted under State Emblem Act 2005). Indigo line work
 * at low opacity makes it read as a watermark, not a focal element.
 */

import * as React from "react";

export function HeroMandala() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 24,
        left: 110,
        width: 150,
        height: 150,
        pointerEvents: "none",
        opacity: 0.13,
        zIndex: 0,
      }}
      viewBox="-75 -75 150 150"
    >
      <g stroke="#534AB7" strokeWidth="0.8" fill="none">
        <circle cx="0" cy="0" r="68" />
        <circle cx="0" cy="0" r="52" />
        <circle cx="0" cy="0" r="36" />
        <circle cx="0" cy="0" r="20" />
        <g>
          <ellipse cx="0" cy="-44" rx="8" ry="24" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(45)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(90)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(135)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(180)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(225)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(270)" />
          <ellipse cx="0" cy="-44" rx="8" ry="24" transform="rotate(315)" />
        </g>
        <g>
          <line x1="0" y1="-68" x2="0" y2="68" />
          <line x1="-68" y1="0" x2="68" y2="0" />
          <line x1="-48" y1="-48" x2="48" y2="48" />
          <line x1="-48" y1="48" x2="48" y2="-48" />
        </g>
      </g>
    </svg>
  );
}
