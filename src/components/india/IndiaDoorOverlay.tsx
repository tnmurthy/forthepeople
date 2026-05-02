"use client";

/**
 * IndiaDoorOverlay — twin teak doors with brass details swing outward
 * to reveal /en/india on first visit per session, with a golden glow
 * through the gap as they open.
 *
 * Animation chain (1500 ms total) is driven entirely by CSS keyframes
 * — no JS frame loop. The overlay is removed from the DOM after the
 * animation completes (state transitions hidden → playing → done).
 *
 * Triggers:
 *   - First visit per session (sessionStorage 'ftp_door_seen')
 *   - Skipped entirely if prefers-reduced-motion: reduce
 *   - Skip button dismisses immediately
 *
 * Performance contract:
 *   - Only `transform` and `opacity` animate on hot paths
 *   - will-change: transform / opacity hints on door + glow elements
 *   - backface-visibility: hidden so we don't paint the door's reverse
 *     side past 90° rotateY
 *   - Single CSS animation chain — zero rAF, zero observers
 */

import { useEffect, useState } from "react";
import styles from "./IndiaDoorOverlay.module.css";

const SESSION_KEY = "ftp_door_seen";
const ANIMATION_MS = 1500;

export function IndiaDoorOverlay() {
  const [phase, setPhase] = useState<"hidden" | "playing" | "done">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        sessionStorage.setItem(SESSION_KEY, "1");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage may be unavailable (private mode, embedded contexts).
      // Skip the overlay rather than crash.
      return;
    }
    setPhase("playing");
    const t = window.setTimeout(() => setPhase("done"), ANIMATION_MS + 200);
    return () => window.clearTimeout(t);
  }, []);

  if (phase !== "playing") return null;

  return (
    <div className={styles.overlay} role="presentation" aria-hidden="true">
      <div className={styles.glow} />
      <DoorPanel side="left" />
      <DoorPanel side="right" />
      <button
        type="button"
        className={styles.skip}
        onClick={() => setPhase("done")}
      >
        Skip →
      </button>
    </div>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`${styles.door} ${styles[side]}`}
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wood-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a180a" />
          <stop offset="50%" stopColor="#4a2c14" />
          <stop offset="100%" stopColor="#2a180a" />
        </linearGradient>
      </defs>

      <path
        d="M 8 60 Q 200 0 392 60 L 392 800 L 8 800 Z"
        fill={`url(#wood-${side})`}
        stroke="#C9A45A"
        strokeWidth="2"
      />

      <g transform="translate(200 160)">
        <circle r="60" fill="none" stroke="#C9A45A" strokeWidth="3" />
        <circle r="56" fill="none" stroke="#8B6F33" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180;
          const cx = Math.cos(a) * 68;
          const cy = Math.sin(a) * 68;
          return <circle key={i} cx={cx} cy={cy} r="2.5" fill="#C9A45A" />;
        })}
        <rect x="-32" y="-32" width="64" height="64" fill="none" stroke="#C9A45A" strokeWidth="2" />
        <rect x="-32" y="-32" width="64" height="64" fill="none" stroke="#C9A45A" strokeWidth="2" transform="rotate(45)" />
        <circle r="3" fill="#F4D9A4" />
      </g>

      <g transform="translate(40 280)" stroke="#C9A45A" strokeWidth="1.2" fill="none" opacity="0.85">
        <rect x="0" y="0" width="320" height="280" />
        {Array.from({ length: 6 }).flatMap((_, row) =>
          Array.from({ length: 4 }).map((_, col) => {
            const x = 20 + col * 80;
            const y = 20 + row * 45;
            return (
              <polygon
                key={`${row}-${col}`}
                points={`${x + 15},${y} ${x + 45},${y} ${x + 60},${y + 15} ${x + 60},${y + 30} ${x + 45},${y + 45} ${x + 15},${y + 45} ${x},${y + 30} ${x},${y + 15}`}
                strokeWidth="0.8"
              />
            );
          }),
        )}
      </g>

      <g
        transform="translate(200 680)"
        stroke="#C9A45A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M 0 -50 Q -8 -30 0 -10 Q 8 -30 0 -50 Z" />
        <path d="M -10 -10 Q -45 -30 -55 -5 Q -50 15 -10 0 Z" />
        <path d="M -55 -5 Q -85 -10 -85 20 Q -65 25 -50 10 Z" />
        <path d="M 10 -10 Q 45 -30 55 -5 Q 50 15 10 0 Z" />
        <path d="M 55 -5 Q 85 -10 85 20 Q 65 25 50 10 Z" />
        <line x1="-100" y1="35" x2="100" y2="35" strokeWidth="1" />
      </g>

      <g transform={side === "left" ? "translate(370 400)" : "translate(30 400)"}>
        <circle r="14" fill="none" stroke="#C9A45A" strokeWidth="3" />
        <circle r="10" fill="none" stroke="#8B6F33" strokeWidth="1" />
        <circle r="3" fill="#C9A45A" />
      </g>
    </svg>
  );
}

export default IndiaDoorOverlay;
