"use client";

/**
 * Decoration for the Agriculture & Livestock identity zone — a single
 * wheat stalk with paired grain heads. Decorative only.
 */

import styles from "./styles.module.css";
import {
  SVG_VIEWBOX,
  WHEAT_STALK_STEM,
  WHEAT_STALK_BRACTS,
  WHEAT_STALK_GRAINS,
} from "./decorationPath";

export function WheatStalkWatermark() {
  return (
    <svg
      className={styles.wheatWatermark}
      viewBox={SVG_VIEWBOX}
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        <path d={WHEAT_STALK_STEM} />
        {WHEAT_STALK_BRACTS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {WHEAT_STALK_GRAINS.map((g, i) => (
          <ellipse
            key={i}
            cx={g.cx}
            cy={g.cy}
            rx={g.rx}
            ry={g.ry}
            transform={`rotate(${g.rotateDeg} ${g.cx} ${g.cy})`}
          />
        ))}
      </g>
    </svg>
  );
}
