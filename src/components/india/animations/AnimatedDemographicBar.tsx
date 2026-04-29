/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Two-segment ratio bar (e.g. male/female sex ratio, urban/rural).
 * Both segments grow from 0 to their target % simultaneously when
 * the bar enters the viewport. Respects reduced-motion.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface Segment {
  label: string;
  /** 0–100. The two segments should sum to 100. */
  pct: number;
  color: string;
}

interface Props {
  left: Segment;
  right: Segment;
  height?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedDemographicBar({
  left,
  right,
  height = 16,
  duration = 800,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [played, setPlayed] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setPlayed(true);
      return;
    }
    if (typeof window === "undefined" || !ref.current) return;
    if (!("IntersectionObserver" in window)) {
      setPlayed(true);
      return;
    }
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => setPlayed(true));
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          display: "flex",
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          background: "#F1F5F9",
        }}
      >
        <div
          style={{
            width: played ? `${left.pct}%` : "0%",
            height: "100%",
            background: left.color,
            transition: reduced ? "none" : `width ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
          aria-label={`${left.label}: ${left.pct.toFixed(1)}%`}
        />
        <div
          style={{
            width: played ? `${right.pct}%` : "0%",
            height: "100%",
            background: right.color,
            transition: reduced ? "none" : `width ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
          aria-label={`${right.label}: ${right.pct.toFixed(1)}%`}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#6B6B6B",
          marginTop: 6,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span
            aria-hidden="true"
            style={{ width: 8, height: 8, borderRadius: 2, background: left.color }}
          />
          {left.label} <strong>{left.pct.toFixed(1)}%</strong>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <strong>{right.pct.toFixed(1)}%</strong> {right.label}
          <span
            aria-hidden="true"
            style={{ width: 8, height: 8, borderRadius: 2, background: right.color }}
          />
        </span>
      </div>
    </div>
  );
}
