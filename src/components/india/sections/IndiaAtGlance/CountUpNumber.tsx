"use client";

/**
 * Animated count-up for the v4 headline stat.
 *
 * Renders 0 until `visible` flips to true, then eases to `value` via
 * requestAnimationFrame over `duration` ms. Honours
 * prefers-reduced-motion by snapping straight to the target.
 */

import { useEffect, useState } from "react";

type Props = {
  value: number;
  decimals?: number;
  duration?: number;
  visible: boolean;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUpNumber({
  value,
  decimals = 2,
  duration = 1500,
  visible,
}: Props) {
  const [display, setDisplay] = useState<number>(0);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / duration);
      setDisplay(value * easeOutCubic(progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, visible]);

  return <>{display.toFixed(decimals)}</>;
}
