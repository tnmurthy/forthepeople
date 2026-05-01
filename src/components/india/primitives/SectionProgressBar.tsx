"use client";

/**
 * SectionProgressBar — sticky 4px bar at the top of the viewport
 * (just below IndiaBreadcrumb at top:56) that shows scroll progress
 * across the 10 super-categories as 10 equal-width segments.
 *
 * Each segment is colored with its section's accent (per
 * SECTION_ACCENT_COLORS) when "passed", gray when upcoming, and a
 * gradient between this section's color and the next when "active".
 * The segment widths are EQUAL regardless of how tall each band is —
 * scrolling halfway through a tall section still shows the segment
 * half-filled.
 *
 * Implementation notes:
 *   - We query every [data-tint-id] element on mount, filter out the
 *     hero, and rebuild on resize. Each remaining element corresponds
 *     to one super-category band.
 *   - A scroll listener (passive, throttled via rAF) recomputes which
 *     section is "active" by finding the highest-index section whose
 *     top has crossed past the viewport top + 1/3 of viewport height.
 *   - fillPct for the active segment = (scrolled past activeTop) /
 *     activeHeight, clamped 0..100.
 *   - prefers-reduced-motion just disables the background-color
 *     transition on each segment; positions still update.
 */

import * as React from "react";
import {
  SECTION_ACCENT_COLORS,
  SECTION_SLUGS_IN_ORDER,
} from "@/lib/india/section-accents";

/** Inverse of TINT_BY_SC in /[locale]/india/page.tsx. Kept here so the
 *  progress bar can map a [data-tint-id] back to its super-category slug. */
const TINT_TO_SLUG: Record<string, string> = {
  macro: "macro-snapshot",
  know: "know-india",
  living: "living-standards",
  wildlife: "wildlife-forests",
  agriculture: "agriculture-livestock",
  natural: "natural-resources-energy",
  infra: "infrastructure",
  governance: "governance",
  innovation: "innovation",
  culture: "culture",
};

type SectionMeasurement = {
  slug: string;
  el: HTMLElement;
};

export function SectionProgressBar() {
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const [fillPct, setFillPct] = React.useState<number>(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    let sections: SectionMeasurement[] = [];
    let rafId: number | null = null;

    const collectSections = () => {
      const all = Array.from(
        document.querySelectorAll<HTMLElement>("[data-tint-id]"),
      );
      sections = [];
      for (const el of all) {
        const tintId = el.getAttribute("data-tint-id") ?? "";
        const slug = TINT_TO_SLUG[tintId];
        if (!slug) continue; // skips 'hero' and any unknown tint
        sections.push({ slug, el });
      }
      // Order by document position (matches SECTION_SLUGS_IN_ORDER under
      // normal conditions but we don't assume).
      sections.sort((a, b) => {
        const r = a.el.compareDocumentPosition(b.el);
        // eslint-disable-next-line no-bitwise
        return r & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
    };

    const compute = () => {
      if (sections.length === 0) {
        setActiveIdx(-1);
        setFillPct(0);
        return;
      }
      const viewportH = window.innerHeight;
      // Active = the band whose top is closest to (but past) the
      // pivot line at 1/3 of the viewport height. We pick the highest
      // index whose rect.top is <= pivot.
      const pivot = viewportH / 3;
      let active = -1;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].el.getBoundingClientRect();
        if (rect.top <= pivot) active = i;
      }
      setActiveIdx(active);

      if (active < 0) {
        setFillPct(0);
      } else {
        const rect = sections[active].el.getBoundingClientRect();
        const total = rect.height;
        // How much of THIS section has scrolled past the pivot line.
        const scrolledPast = pivot - rect.top;
        const pct = Math.min(100, Math.max(0, (scrolledPast / total) * 100));
        setFillPct(pct);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        compute();
      });
    };

    collectSections();
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      collectSections();
      compute();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Section scroll progress"
      aria-valuemin={0}
      aria-valuemax={SECTION_SLUGS_IN_ORDER.length}
      aria-valuenow={Math.max(0, activeIdx + 1)}
      style={{
        position: "sticky",
        // Sits below the global header (56) + breadcrumb (~36) — same
        // top offset the previous ScrollProgressBar used.
        top: "100px",
        width: "100%",
        height: "4px",
        zIndex: 39,
        display: "flex",
        gap: "1px",
        pointerEvents: "none",
        background: "rgba(0,0,0,0.04)",
      }}
    >
      {SECTION_SLUGS_IN_ORDER.map((slug, i) => {
        const color = SECTION_ACCENT_COLORS[slug] ?? "#1A1A1A";
        const nextSlug = SECTION_SLUGS_IN_ORDER[i + 1];
        const nextColor = nextSlug
          ? (SECTION_ACCENT_COLORS[nextSlug] ?? color)
          : color;

        let background: string;
        if (i < activeIdx) {
          background = color; // fully passed
        } else if (i === activeIdx) {
          // Gradient from this section's color to the next, with the
          // stop at fillPct.
          background = `linear-gradient(90deg, ${color} 0%, ${color} ${fillPct}%, ${nextColor} ${fillPct}%, ${nextColor} 100%)`;
        } else {
          background = "rgba(0,0,0,0.05)"; // upcoming
        }

        return (
          <span
            key={slug}
            data-section-progress-segment
            style={{
              flex: 1,
              background,
              transition: "background 0.4s ease",
            }}
          />
        );
      })}
    </div>
  );
}

export default SectionProgressBar;
