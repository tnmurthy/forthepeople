/**
 * HeroJaali — saffron jaali (top-right) + green jaali (bottom-left) corner motifs
 * for the /en/india hero card. File 48 §Section 2.5+3 Commit 1.
 *
 * Mughal-influenced hexagonal lattice pattern. Pure decoration; pointer-events
 * disabled so it never blocks interactions inside the hero.
 */

import * as React from "react";

export function HeroJaaliTopRight() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: -10,
        right: -10,
        width: 150,
        height: 150,
        pointerEvents: "none",
        opacity: 0.25,
        zIndex: 0,
      }}
      viewBox="0 0 150 150"
    >
      <defs>
        <pattern id="ftp-jaali-tr" width="22" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M11,0 L22,5.5 L22,16.5 L11,22 L0,16.5 L0,5.5 Z"
            fill="none"
            stroke="#BA7517"
            strokeWidth="0.7"
          />
          <circle cx="11" cy="11" r="2.8" fill="none" stroke="#BA7517" strokeWidth="0.7" />
          <path
            d="M11,5.5 L14.5,8.5 L14.5,13.5 L11,16.5 L7.5,13.5 L7.5,8.5 Z"
            fill="none"
            stroke="#BA7517"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="150" height="150" fill="url(#ftp-jaali-tr)" />
    </svg>
  );
}

export function HeroJaaliBottomLeft() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        bottom: -10,
        left: -10,
        width: 110,
        height: 110,
        pointerEvents: "none",
        opacity: 0.20,
        zIndex: 0,
      }}
      viewBox="0 0 110 110"
    >
      <defs>
        <pattern id="ftp-jaali-bl" width="22" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M11,0 L22,5.5 L22,16.5 L11,22 L0,16.5 L0,5.5 Z"
            fill="none"
            stroke="#3B6D11"
            strokeWidth="0.7"
          />
          <circle cx="11" cy="11" r="2.8" fill="none" stroke="#3B6D11" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="110" height="110" fill="url(#ftp-jaali-bl)" />
    </svg>
  );
}
