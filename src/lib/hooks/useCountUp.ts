/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * useCountUp — animates a numeric value from 0 → target over duration ms
 * using cubic ease-out + requestAnimationFrame.
 *
 * Behavior:
 *   - Returns current animated value + a ref to attach to the element
 *     that should trigger the animation when scrolled into view.
 *   - Uses IntersectionObserver (threshold 0.3) so off-screen tiles
 *     don't burn frames before the user can see them.
 *   - Respects prefers-reduced-motion: jumps straight to target.
 *   - If IntersectionObserver is unavailable (server / very old
 *     browsers), animates immediately.
 *   - Re-runs only when `target` changes, and only the first time the
 *     element becomes visible.
 *   - Safe with target=0 (no animation; stays at 0).
 */

"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  target: number,
  durationMs: number = 1200,
): { value: number; ref: React.RefObject<T | null> } {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState<number>(0);
  const triggered = useRef(false);

  useEffect(() => {
    triggered.current = false;
    setValue(0);

    if (target === 0) return;

    if (typeof window === "undefined") return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    function animate() {
      if (triggered.current) return;
      triggered.current = true;
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
        else setValue(target);
      }
      requestAnimationFrame(tick);
    }

    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    const node = ref.current;
    if (!node) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}
