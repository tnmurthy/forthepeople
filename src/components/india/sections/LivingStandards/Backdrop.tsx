"use client";

/**
 * Decoration for the Living Standards identity zone — a hospital-cross
 * watermark sitting where Macro's compass / Section 02's book sits.
 * Decorative only.
 */

import styles from "./styles.module.css";

export function HospitalCrossWatermark() {
  return (
    <svg
      className={styles.crossWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
        <path d="M 35 25 L 35 45 L 25 45 L 25 65 L 35 65 L 35 85 L 55 85 L 55 65 L 65 65 L 65 45 L 55 45 L 55 25 Z" />
      </g>
    </svg>
  );
}
