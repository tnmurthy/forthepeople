"use client";

/**
 * ScrollColorShift — invisible client component that listens to which
 * `data-tint-id`-tagged section is closest to the viewport center and
 * updates the page-level `--ftp-page-tint` CSS variable accordingly.
 *
 * File 48 §Section 2.2 scroll-locked color journey. The body's background
 * is wired to var(--ftp-page-tint) with a 600ms ease transition (globals.css)
 * so the swap is smooth.
 */

import * as React from "react";

interface Tint {
  id: string;
  color: string;
}

const TINTS: Tint[] = [
  { id: "hero",        color: "#FFF7EC" }, // saffron warmth
  { id: "macro",       color: "#FEFAF1" },
  { id: "know",        color: "#F5EFE3" }, // earthen
  { id: "living",      color: "#ECEFEF" },
  { id: "wildlife",    color: "#E2EFE4" }, // forest
  { id: "agriculture", color: "#F4ECDF" }, // wheat
  { id: "natural",     color: "#ECEFF6" }, // peacock
  { id: "infra",       color: "#F4EAD8" },
  { id: "governance",  color: "#ECEFF6" },
  { id: "innovation",  color: "#F2EAE2" },
  { id: "culture",     color: "#F4ECDF" }, // terracotta
];

export function ScrollColorShift() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--ftp-page-tint", TINTS[0].color);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const vh = window.innerHeight;
        let best: IntersectionObserverEntry = visible[0];
        let bestDist = Infinity;
        for (const e of visible) {
          const r = e.boundingClientRect;
          const dist = Math.abs((r.top + r.bottom) / 2 - vh / 2);
          if (dist < bestDist) {
            best = e;
            bestDist = dist;
          }
        }
        const id = best.target.getAttribute("data-tint-id");
        const tint = TINTS.find((t) => t.id === id);
        if (tint) root.style.setProperty("--ftp-page-tint", tint.color);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    document.querySelectorAll<HTMLElement>("[data-tint-id]").forEach((el) =>
      observer.observe(el),
    );
    return () => observer.disconnect();
  }, []);

  return null;
}

export default ScrollColorShift;
