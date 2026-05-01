"use client";

/**
 * Decoration for the Natural Resources & Energy identity zone — a
 * sun with radiating rays. Decorative only.
 */

import styles from "./styles.module.css";
import {
  SUN_CENTER_RADIUS,
  SUN_VIEWBOX_CENTER,
  SUN_RAYS,
} from "./decorationPath";

export function SunWatermark() {
  return (
    <svg
      className={styles.sunWatermark}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g stroke="#FFFFFF" strokeWidth="1" fill="none">
        <circle
          cx={SUN_VIEWBOX_CENTER}
          cy={SUN_VIEWBOX_CENTER}
          r={SUN_CENTER_RADIUS}
        />
        {SUN_RAYS.map((ray, i) => (
          <line
            key={i}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
          />
        ))}
      </g>
    </svg>
  );
}
