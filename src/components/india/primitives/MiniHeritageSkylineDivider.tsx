/**
 * MiniHeritageSkylineDivider — five Mughal silhouettes (chhatri, dome,
 * minaret, dome, chhatri) sitting between two faded peacock-blue rules.
 *
 * Pure SVG + CSS module. No JS state, no animation, no observer —
 * shipped this way deliberately for the 100K-users/day path. Replaces
 * the heavier MughalArchDivider that previously sat between the India
 * hero card and the KPI strip.
 */

import styles from "./MiniHeritageSkylineDivider.module.css";

export function MiniHeritageSkylineDivider() {
  return (
    <div role="separator" aria-hidden="true" className={styles.divider}>
      <span className={styles.line} />
      <svg
        className={styles.skyline}
        viewBox="0 0 200 28"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
          transform="translate(0 26)"
        >
          <g transform="translate(60 0)">
            <path d="M 0,0 L 0,-8 Q 4,-12 8,-8 L 8,0 Z" />
            <line x1="2" y1="-9" x2="2" y2="-12" strokeWidth="0.4" />
            <line x1="6" y1="-9" x2="6" y2="-12" strokeWidth="0.4" />
          </g>
          <g transform="translate(82 0)">
            <path d="M 0,0 L 0,-12 Q 8,-20 16,-12 L 16,0 Z" />
            <circle cx="8" cy="-18" r="1" fill="currentColor" />
          </g>
          <g transform="translate(108 0)">
            <rect x="0" y="-16" width="3" height="16" />
            <path d="M -1,-16 Q 1.5,-22 4,-16" />
            <line x1="1.5" y1="-22" x2="1.5" y2="-25" strokeWidth="0.5" />
            <circle cx="1.5" cy="-26" r="0.6" fill="currentColor" />
          </g>
          <g transform="translate(122 0)">
            <path d="M 0,0 L 0,-12 Q 8,-20 16,-12 L 16,0 Z" />
            <circle cx="8" cy="-18" r="1" fill="currentColor" />
          </g>
          <g transform="translate(146 0)">
            <path d="M 0,0 L 0,-8 Q 4,-12 8,-8 L 8,0 Z" />
            <line x1="2" y1="-9" x2="2" y2="-12" strokeWidth="0.4" />
            <line x1="6" y1="-9" x2="6" y2="-12" strokeWidth="0.4" />
          </g>
        </g>
      </svg>
      <span className={styles.line} />
    </div>
  );
}

export default MiniHeritageSkylineDivider;
