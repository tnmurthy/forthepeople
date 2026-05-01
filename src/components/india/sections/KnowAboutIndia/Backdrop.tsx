"use client";

/**
 * Decoration for the Know About India identity zone — an open-book
 * watermark sitting where Macro's compass sits. Decorative only;
 * never claims to represent specific content.
 */

import styles from "./styles.module.css";

export function BookWatermark() {
  return (
    <svg
      className={styles.bookWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        <path d="M 15 25 Q 15 18, 25 18 L 75 18 Q 85 18, 85 25 L 85 80 Q 85 87, 75 87 L 25 87 Q 15 87, 15 80 Z" />
        <line x1="50" y1="18" x2="50" y2="87" />
        <line x1="22" y1="32" x2="44" y2="32" />
        <line x1="22" y1="40" x2="44" y2="40" />
        <line x1="22" y1="48" x2="44" y2="48" />
        <line x1="22" y1="56" x2="44" y2="56" />
        <line x1="56" y1="32" x2="78" y2="32" />
        <line x1="56" y1="40" x2="78" y2="40" />
        <line x1="56" y1="48" x2="78" y2="48" />
        <line x1="56" y1="56" x2="78" y2="56" />
      </g>
    </svg>
  );
}
