"use client";

/**
 * SectionRightRailDots — N small dots displayed below a section's
 * right-rail container on mobile. The active dot tracks which card
 * is currently snapped into view inside the horizontal carousel.
 *
 * Active-state detection: a single IntersectionObserver watches the
 * direct children of the carousel container (selected via
 * `[data-ftp-right-rail="1"]`) on the same .section ancestor and
 * toggles `data-active` on the matching dot whenever a card crosses
 * the 0.5 visibility threshold.
 *
 * The carousel + dots are only visible on viewports < 768 px (CSS
 * gates display: none on the dots above that). At desktop widths the
 * observer still runs but never finds matching children — its cost is
 * negligible (one entry per scroll, gated behind a cached
 * NodeList).
 *
 * Renders as a `[role="tablist"]`-style purely-decorative element
 * (aria-hidden) — the dots are visual only; users navigate via swipe.
 */

import * as React from "react";

type Props = {
  count: number;
  accent: string;
};

export function SectionRightRailDots({ count, accent }: Props) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const dotsEl = rootRef.current;
    if (!dotsEl) return;
    // Locate the carousel container that immediately precedes us in
    // the same section. The wrapper is marked with the data-attribute
    // so we never need to know the per-section CSS module classname.
    const section = dotsEl.closest("section, [data-tint-id]");
    if (!section) return;
    const rail = section.querySelector<HTMLElement>(
      '[data-ftp-right-rail="1"]',
    );
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    if (cards.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersectionRatio that
        // crossed our threshold; fall back to noop on transient
        // multi-entry batches.
        let bestIdx = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = cards.indexOf(entry.target as HTMLElement);
          }
        }
        if (bestIdx !== -1 && bestRatio >= 0.5) {
          setActiveIndex(bestIdx);
        }
      },
      { root: rail, threshold: [0.5, 0.75, 0.95] },
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [count]);

  return (
    <div
      ref={rootRef}
      className="ftp-right-rail-dots"
      data-ftp-right-rail-dots="1"
      aria-hidden="true"
      style={{ ["--ftp-dot-accent" as string]: accent }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="ftp-right-rail-dot"
          data-active={i === activeIndex ? "true" : "false"}
        />
      ))}
    </div>
  );
}

export default SectionRightRailDots;
