/**
 * CultureDecoration — manuscript spine stack + kalamkari floral border.
 * Section 2.5+3 Commit 13. Rose accent for culture super-category.
 */

import * as React from "react";

export function CultureDecoration() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          width: 80,
          height: 56,
          pointerEvents: "none",
          opacity: 0.5,
          zIndex: 0,
        }}
        viewBox="0 0 80 56"
      >
        <g stroke="#993556" strokeWidth="0.7">
          <rect x="2" y="6" width="14" height="48" fill="rgba(153, 53, 86, 0.18)" rx="1" />
          <rect x="20" y="2" width="14" height="52" fill="rgba(153, 53, 86, 0.22)" rx="1" />
          <rect x="38" y="8" width="14" height="46" fill="rgba(153, 53, 86, 0.16)" rx="1" />
          <rect x="56" y="4" width="14" height="50" fill="rgba(153, 53, 86, 0.20)" rx="1" />
          <line x1="2" y1="14" x2="16" y2="14" />
          <line x1="2" y1="22" x2="16" y2="22" />
          <line x1="20" y1="10" x2="34" y2="10" />
          <line x1="20" y1="18" x2="34" y2="18" />
          <line x1="38" y1="14" x2="52" y2="14" />
          <line x1="56" y1="10" x2="70" y2="10" />
          <line x1="56" y1="20" x2="70" y2="20" />
        </g>
      </svg>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 24,
          pointerEvents: "none",
          opacity: 0.45,
          zIndex: 0,
        }}
        viewBox="0 0 700 24"
        preserveAspectRatio="none"
      >
        <g stroke="#993556" strokeWidth="0.8" fill="rgba(153, 53, 86, 0.18)">
          <path
            d="M 0,12 Q 20,4 40,12 T 80,12 T 120,12 T 160,12 T 200,12 T 240,12 T 280,12 T 320,12 T 360,12 T 400,12 T 440,12 T 480,12 T 520,12 T 560,12 T 600,12 T 640,12 T 680,12 T 700,12"
            fill="none"
          />
          <g>
            <circle cx="60" cy="8" r="3" />
            <circle cx="60" cy="8" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="140" cy="16" r="3" />
            <circle cx="140" cy="16" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="220" cy="8" r="3" />
            <circle cx="220" cy="8" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="300" cy="16" r="3" />
            <circle cx="300" cy="16" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="380" cy="8" r="3" />
            <circle cx="380" cy="8" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="460" cy="16" r="3" />
            <circle cx="460" cy="16" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="540" cy="8" r="3" />
            <circle cx="540" cy="8" r="1.5" fill="#993556" />
          </g>
          <g>
            <circle cx="620" cy="16" r="3" />
            <circle cx="620" cy="16" r="1.5" fill="#993556" />
          </g>
        </g>
      </svg>
    </>
  );
}

export default CultureDecoration;
