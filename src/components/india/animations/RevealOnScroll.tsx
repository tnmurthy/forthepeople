/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Wraps any block in a fade-in + 8px translateY-up when it enters the
 * viewport. Single IntersectionObserver per instance; once revealed,
 * the observer disconnects (one-shot). Respects prefers-reduced-motion
 * (becomes a no-op wrapper when reduce is on).
 */

"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface Props {
  children: ReactNode;
  /** Delay in ms before animation starts after entering viewport. */
  delay?: number;
  /** translateY start offset in px. Default 8. */
  offset?: number;
  /** Classname passed through to the wrapper div. */
  className?: string;
  /** rootMargin for the IntersectionObserver. */
  rootMargin?: string;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  offset = 8,
  className,
  rootMargin = "0px 0px -10% 0px",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    if (!ref.current || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const node = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => setRevealed(true), delay);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delay, reduced, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : `translateY(${offset}px)`,
        transition: reduced
          ? "none"
          : `opacity 360ms ease, transform 360ms cubic-bezier(0.22, 1, 0.36, 1)`,
        willChange: revealed ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
