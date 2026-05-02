/**
 * LotusVineGarlandDivider — full-width edge-to-edge vine + lotus
 * pattern in peacock blue. One continuous wavy vine path (20
 * quadratic curves) with 10 lotus blossoms at the upper peaks and
 * 9 small dots at the lower troughs.
 *
 * Pure SVG + CSS module. No JS state, no animation, no observer.
 * `preserveAspectRatio="none"` lets the vine stretch edge-to-edge
 * across any container width; `vectorEffect="non-scaling-stroke"`
 * keeps the line strokes thin (0.6–0.7 px) regardless of horizontal
 * scaling — without it the strokes would distort into elongated
 * ellipses on wide viewports.
 */

import styles from "./LotusVineGarlandDivider.module.css";

export function LotusVineGarlandDivider() {
  return (
    <div role="separator" aria-hidden="true" className={styles.divider}>
      <svg
        className={styles.garland}
        viewBox="0 0 680 28"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 14 Q 17 4 34 14 Q 51 24 68 14 Q 85 4 102 14 Q 119 24 136 14 Q 153 4 170 14 Q 187 24 204 14 Q 221 4 238 14 Q 255 24 272 14 Q 289 4 306 14 Q 323 24 340 14 Q 357 4 374 14 Q 391 24 408 14 Q 425 4 442 14 Q 459 24 476 14 Q 493 4 510 14 Q 527 24 544 14 Q 561 4 578 14 Q 595 24 612 14 Q 629 4 646 14 Q 663 24 680 14"
          fill="none"
          stroke="#0C447C"
          strokeWidth="0.7"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
        <g
          fill="none"
          stroke="#0C447C"
          strokeWidth="0.6"
          opacity="0.85"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        >
          <g transform="translate(34 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(102 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(170 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(238 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(306 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(374 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(442 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(510 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(578 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
          <g transform="translate(646 4)"><path d="M -4 1 Q -3 -2 -1 -1" /><path d="M 0 -3 Q 0 -2 0 -1" /><path d="M 4 1 Q 3 -2 1 -1" /></g>
        </g>
        <g fill="#0C447C" opacity="0.7">
          <circle cx="68" cy="24" r="1" />
          <circle cx="136" cy="24" r="1" />
          <circle cx="204" cy="24" r="1" />
          <circle cx="272" cy="24" r="1" />
          <circle cx="340" cy="24" r="1" />
          <circle cx="408" cy="24" r="1" />
          <circle cx="476" cy="24" r="1" />
          <circle cx="544" cy="24" r="1" />
          <circle cx="612" cy="24" r="1" />
        </g>
      </svg>
    </div>
  );
}

export default LotusVineGarlandDivider;
