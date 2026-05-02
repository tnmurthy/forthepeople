/**
 * JaliPanelDivider — a 7-cell octagonal jali (lattice) panel between
 * two faded peacock-blue rules. The jali is a recurring Indo-Islamic
 * architectural motif; sits naturally between the Indian KPI strip and
 * the "India in the World" comparative card.
 *
 * Pure SVG + CSS module. No JS state, no animation, no observer —
 * shipped this way deliberately for the 100K-users/day path. Replaces
 * the Step-14 GlobeOrnamentDivider.
 */

import styles from "./JaliPanelDivider.module.css";

export function JaliPanelDivider() {
  return (
    <div role="separator" aria-hidden="true" className={styles.divider}>
      <span className={styles.line} />
      <svg
        className={styles.panel}
        viewBox="0 0 220 20"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g
          stroke="currentColor"
          strokeWidth="0.7"
          fill="none"
          opacity="0.85"
        >
          <rect x="0" y="0" width="220" height="20" />
          <polygon points="14,4 26,4 32,10 32,16 26,20 14,20 8,16 8,10" />
          <polygon points="42,4 54,4 60,10 60,16 54,20 42,20 36,16 36,10" />
          <polygon points="70,4 82,4 88,10 88,16 82,20 70,20 64,16 64,10" />
          <polygon points="98,4 110,4 116,10 116,16 110,20 98,20 92,16 92,10" />
          <polygon points="126,4 138,4 144,10 144,16 138,20 126,20 120,16 120,10" />
          <polygon points="154,4 166,4 172,10 172,16 166,20 154,20 148,16 148,10" />
          <polygon points="182,4 194,4 200,10 200,16 194,20 182,20 176,16 176,10" />
          <g strokeWidth="0.4" opacity="0.7">
            <line x1="8" y1="10" x2="32" y2="10" />
            <line x1="8" y1="16" x2="32" y2="16" />
            <line x1="36" y1="10" x2="60" y2="10" />
            <line x1="36" y1="16" x2="60" y2="16" />
            <line x1="64" y1="10" x2="88" y2="10" />
            <line x1="64" y1="16" x2="88" y2="16" />
            <line x1="92" y1="10" x2="116" y2="10" />
            <line x1="92" y1="16" x2="116" y2="16" />
            <line x1="120" y1="10" x2="144" y2="10" />
            <line x1="120" y1="16" x2="144" y2="16" />
            <line x1="148" y1="10" x2="172" y2="10" />
            <line x1="148" y1="16" x2="172" y2="16" />
            <line x1="176" y1="10" x2="200" y2="10" />
            <line x1="176" y1="16" x2="200" y2="16" />
          </g>
        </g>
      </svg>
      <span className={styles.line} />
    </div>
  );
}

export default JaliPanelDivider;
