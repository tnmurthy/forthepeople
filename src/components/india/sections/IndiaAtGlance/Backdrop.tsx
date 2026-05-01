/**
 * Three layered SVG decorations behind the IndiaAtGlance content:
 *   1. Abstract India silhouette watermark (faint, centered)
 *   2. Dashed grid lines (atlas-style)
 *   3. Animated compass rose (top-right, slow rotation)
 *
 * All decoration. No data. The silhouette is a stylised editorial
 * outline, not a precise GeoJSON — it never claims to be a map.
 */

import styles from "./styles.module.css";

const INDIA_PATH =
  "M 80,15 L 95,12 L 115,18 L 135,22 L 145,30 L 155,42 L 162,55 L 168,72 L 170,90 L 165,108 L 158,120 L 152,135 L 148,150 L 145,165 L 138,178 L 128,188 L 115,195 L 100,200 L 88,202 L 80,198 L 75,188 L 72,175 L 68,160 L 60,148 L 50,138 L 42,125 L 38,110 L 35,95 L 32,80 L 35,65 L 42,52 L 52,40 L 62,28 L 72,20 Z";

export function Backdrop() {
  return (
    <>
      <svg
        className={styles.outlineWatermark}
        viewBox="0 0 200 220"
        aria-hidden
      >
        <path
          d={INDIA_PATH}
          fill="var(--ftp-peacock-600)"
          stroke="var(--ftp-peacock-800)"
          strokeWidth="0.5"
        />
        <circle cx="105" cy="200" r="3" fill="var(--ftp-emerald-600)" />
        <circle cx="100" cy="195" r="2" fill="var(--ftp-emerald-600)" />
      </svg>

      <svg
        className={styles.gridLines}
        viewBox="0 0 700 540"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="var(--ftp-peacock-600)" strokeWidth="0.4" fill="none">
          <line x1="0" y1="60" x2="700" y2="60" strokeDasharray="2,4" />
          <line x1="0" y1="180" x2="700" y2="180" strokeDasharray="2,4" />
          <line x1="0" y1="320" x2="700" y2="320" strokeDasharray="2,4" />
          <line x1="0" y1="460" x2="700" y2="460" strokeDasharray="2,4" />
          <line x1="120" y1="0" x2="120" y2="540" strokeDasharray="2,4" />
          <line x1="280" y1="0" x2="280" y2="540" strokeDasharray="2,4" />
          <line x1="450" y1="0" x2="450" y2="540" strokeDasharray="2,4" />
          <line x1="600" y1="0" x2="600" y2="540" strokeDasharray="2,4" />
        </g>
      </svg>

      <svg className={styles.compass} viewBox="-40 -40 80 80" aria-hidden>
        <g stroke="var(--ftp-peacock-800)" strokeWidth="0.7" fill="none">
          <circle cx="0" cy="0" r="34" />
          <circle cx="0" cy="0" r="26" />
          <circle cx="0" cy="0" r="18" />
          <line x1="0" y1="-34" x2="0" y2="34" />
          <line x1="-34" y1="0" x2="34" y2="0" />
          <line x1="-24" y1="-24" x2="24" y2="24" />
          <line x1="-24" y1="24" x2="24" y2="-24" />
          <polygon
            points="0,-34 4,-12 0,-9 -4,-12"
            fill="var(--ftp-peacock-800)"
            opacity="0.95"
          />
          <polygon
            points="0,34 4,12 0,9 -4,12"
            fill="var(--ftp-peacock-800)"
            opacity="0.6"
          />
          <polygon
            points="34,0 12,4 9,0 12,-4"
            fill="var(--ftp-peacock-600)"
            opacity="0.7"
          />
          <polygon
            points="-34,0 -12,4 -9,0 -12,-4"
            fill="var(--ftp-peacock-600)"
            opacity="0.7"
          />
          <text
            x="0"
            y="-37"
            fontFamily="var(--font-serif)"
            fontSize="6"
            fill="var(--ftp-peacock-800)"
            textAnchor="middle"
            fontStyle="italic"
          >
            N
          </text>
        </g>
      </svg>
    </>
  );
}
