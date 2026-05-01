"use client";

/**
 * Decoration for the Wildlife & Forests identity zone — a leafy
 * branch watermark replacing Macro's compass / Section 02's book.
 * Decorative only.
 */

import styles from "./styles.module.css";

export function LeafyBranchWatermark() {
  return (
    <svg
      className={styles.branchWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        <path d="M 50 90 L 50 30" />
        <path d="M 50 30 Q 35 25, 25 35 Q 30 28, 45 32" />
        <path d="M 50 40 Q 65 35, 75 45 Q 70 38, 55 42" />
        <path d="M 50 50 Q 35 45, 25 55 Q 30 48, 45 52" />
        <path d="M 50 60 Q 65 55, 75 65 Q 70 58, 55 62" />
        <ellipse cx="32" cy="33" rx="6" ry="3" transform="rotate(-30 32 33)" />
        <ellipse cx="68" cy="43" rx="6" ry="3" transform="rotate(30 68 43)" />
        <ellipse cx="32" cy="53" rx="6" ry="3" transform="rotate(-30 32 53)" />
        <ellipse cx="68" cy="63" rx="6" ry="3" transform="rotate(30 68 63)" />
      </g>
    </svg>
  );
}
