/**
 * InfrastructureDecoration — repeating Mughal arch frame across the top
 * + jaali pattern bottom-left. Section 2.5+3 Commit 10. Amber accent.
 */

import * as React from "react";

export function InfrastructureDecoration() {
  return (
    <>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 28,
          pointerEvents: "none",
          opacity: 0.5,
          zIndex: 0,
        }}
        viewBox="0 0 700 28"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="#BA7517" strokeWidth="0.9">
          <path d="M 0,28 L 0,18 Q 50,18 60,8 Q 70,-2 80,8 Q 90,18 140,18" />
          <path d="M 140,28 L 140,18 Q 190,18 200,8 Q 210,-2 220,8 Q 230,18 280,18" />
          <path d="M 280,28 L 280,18 Q 330,18 340,8 Q 350,-2 360,8 Q 370,18 420,18" />
          <path d="M 420,28 L 420,18 Q 470,18 480,8 Q 490,-2 500,8 Q 510,18 560,18" />
          <path d="M 560,28 L 560,18 Q 610,18 620,8 Q 630,-2 640,8 Q 650,18 700,18 L 700,28" />
        </g>
      </svg>
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          width: 110,
          height: 110,
          pointerEvents: "none",
          opacity: 0.40,
          zIndex: 0,
        }}
        viewBox="0 0 110 110"
      >
        <defs>
          <pattern id="ftp-jaali-infra" width="22" height="22" patternUnits="userSpaceOnUse">
            <path
              d="M11,0 L22,5.5 L22,16.5 L11,22 L0,16.5 L0,5.5 Z"
              fill="none"
              stroke="#BA7517"
              strokeWidth="0.7"
            />
            <circle cx="11" cy="11" r="2.8" fill="none" stroke="#BA7517" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="110" height="110" fill="url(#ftp-jaali-infra)" />
      </svg>
    </>
  );
}

export default InfrastructureDecoration;
