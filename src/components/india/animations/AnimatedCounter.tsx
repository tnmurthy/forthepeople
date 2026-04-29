/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Counts a number from 0 → target when the element enters the
 * viewport. Uses requestAnimationFrame + a cubic-ease-out easing
 * for a polished but quick run-up (~700ms by default).
 *
 * Respects prefers-reduced-motion — when on, the target value is
 * shown immediately with no animation.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface Props {
  /** Final numeric value. */
  value: number;
  /** Format the displayed string from the current animated number. */
  format?: (n: number) => string;
  /** Animation duration in ms. */
  duration?: number;
  /** Pre / post strings (eg currency / unit). */
  prefix?: string;
  suffix?: string;
  /** className passed through to the span. */
  className?: string;
}

const DEFAULT_FORMAT = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 1 });

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  value,
  format = DEFAULT_FORMAT,
  duration = 700,
  prefix,
  suffix,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState<number>(reduced ? value : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (typeof window === "undefined" || !ref.current) return;
    if (!("IntersectionObserver" in window)) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            obs.disconnect();
            const start = performance.now();
            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = easeOutCubic(t);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(animate);
              else setDisplay(value);
            };
            requestAnimationFrame(animate);
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value, duration, reduced]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix ?? ""}
      {format(display)}
      {suffix ?? ""}
    </span>
  );
}
