"use client";

/**
 * Decoration for the Wildlife & Forests identity zone — a leafy
 * branch watermark. Decorative only.
 */

import styles from "./styles.module.css";
import { BRANCH_STEM_PATHS, BRANCH_LEAVES } from "./decorationPaths";

export function LeafyBranchWatermark() {
  return (
    <svg
      className={styles.branchWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        {BRANCH_STEM_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {BRANCH_LEAVES.map((leaf, i) => (
          <ellipse
            key={i}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            transform={`rotate(${leaf.rotateDeg} ${leaf.cx} ${leaf.cy})`}
          />
        ))}
      </g>
    </svg>
  );
}
