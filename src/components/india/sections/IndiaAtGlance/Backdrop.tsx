"use client";

/**
 * v4 backdrop: only the small white compass watermark inside the
 * identity zone. The v3 India outline + grid lines were dropped
 * with the magazine-spread layout.
 */

import styles from "./styles.module.css";

export function CompassWatermark() {
  return (
    <svg
      className={styles.compassWatermark}
      viewBox="-50 -50 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        <circle cx="0" cy="0" r="44" />
        <circle cx="0" cy="0" r="32" />
        <line x1="0" y1="-44" x2="0" y2="44" />
        <line x1="-44" y1="0" x2="44" y2="0" />
        <line x1="-31" y1="-31" x2="31" y2="31" />
        <line x1="-31" y1="31" x2="31" y2="-31" />
      </g>
    </svg>
  );
}
