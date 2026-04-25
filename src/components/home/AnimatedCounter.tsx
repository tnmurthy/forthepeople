"use client";

/**
 * Animated number counter — eases from 0 to `value` using
 * requestAnimationFrame. Respects prefers-reduced-motion.
 *
 * Used in the /en hero stat cards.
 */

import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 1500;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedCounter({
  value,
  durationMs = DEFAULT_DURATION_MS,
  suffix = "",
  format = (n: number) => n.toLocaleString("en-IN"),
}: {
  value: number;
  durationMs?: number;
  suffix?: string;
  format?: (n: number) => string;
}) {
  // Start at the target value when SSR/JS-disabled, so we never show "0"
  // during the first paint. Effect overrides to 0 + animates on client.
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    setDisplay(0);
    const start = performance.now();
    let frameId: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      setDisplay(Math.round(value * eased));
      if (t < 1) frameId = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs]);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(display)}{suffix}
    </span>
  );
}
