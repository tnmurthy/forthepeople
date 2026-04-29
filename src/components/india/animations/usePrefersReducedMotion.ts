/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Single source of truth for prefers-reduced-motion across the
 * India dashboard animations. Returns true when the OS-level
 * setting asks for reduced motion (or during SSR / pre-mount, so
 * no animation flicker before the media query resolves).
 */

"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  // Default to true on the very first render so SSR + pre-mount don't
  // flash an animation before the media query resolves.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return reduced;
}
