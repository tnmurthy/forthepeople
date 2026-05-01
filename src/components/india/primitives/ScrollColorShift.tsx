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

// File 48 §Section 2.3 GAP 3 — saturated tints (~30-50 RGB units of difference
// between adjacent bands so the shift is visibly perceptible while scrolling).
const TINTS: Tint[] = [
  { id: "hero",        color: "#FCFAF4" }, // neutral cream — less saffron-dominant body bg
  { id: "macro",       color: "#E8F1FA" }, // blue dawn
  { id: "know",        color: "#ECEAF6" }, // indigo manuscript
  { id: "living",      color: "#DEF0EA" }, // teal lotus
  { id: "wildlife",    color: "#DCEED6" }, // forest deep
  { id: "agriculture", color: "#F4EAD0" }, // wheat field
  { id: "natural",     color: "#DEE3E8" }, // slate stone
  { id: "infra",       color: "#FAEAD2" }, // amber arch
  { id: "governance",  color: "#ECE8F4" }, // purple pillar
  { id: "innovation",  color: "#FAE6DE" }, // coral spark
  { id: "culture",     color: "#F4DCE6" }, // rose kalamkari
];

// Section 4 Step 1 — saturated accent per super-category. Drives
// var(--ftp-current-section-color), which the scroll progress bar reads
// for its solid fill color (so the bar reflects the section in view).
const ACCENTS: Record<string, string> = {
  hero:        "#185FA5", // peacock blue (default at top of page)
  macro:       "#185FA5", // blue
  know:        "#534AB7", // indigo
  living:      "#0F6E56", // teal
  wildlife:    "#5A8F2E", // forest green
  agriculture: "#B58A1E", // wheat amber
  natural:     "#4A5358", // slate
  infra:       "#BA7517", // amber
  governance:  "#3C3489", // royal purple
  innovation:  "#993C1D", // coral
  culture:     "#993556", // rose
};

export function ScrollColorShift() {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    document.body.classList.add("ftp-india-tinted");
    root.style.setProperty("--ftp-page-tint", TINTS[0].color);
    root.style.setProperty("--ftp-current-section-color", ACCENTS.hero);

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
        if (id && ACCENTS[id]) {
          root.style.setProperty("--ftp-current-section-color", ACCENTS[id]);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    document.querySelectorAll<HTMLElement>("[data-tint-id]").forEach((el) =>
      observer.observe(el),
    );
    return () => {
      observer.disconnect();
      document.body.classList.remove("ftp-india-tinted");
      root.style.removeProperty("--ftp-page-tint");
      root.style.removeProperty("--ftp-current-section-color");
    };
  }, []);

  return null;
}

export default ScrollColorShift;
