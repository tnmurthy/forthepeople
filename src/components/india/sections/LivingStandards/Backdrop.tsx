"use client";

/**
 * Decoration for the Living Standards identity zone — a hospital-cross
 * watermark sitting where Macro's compass / Section 02's book sits.
 * Decorative only.
 */

import styles from "./styles.module.css";
import { HOSPITAL_CROSS_PATH } from "./decorationPath";

export function HospitalCrossWatermark() {
  return (
    <svg
      className={styles.crossWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
        <path d={HOSPITAL_CROSS_PATH} />
      </g>
    </svg>
  );
}
