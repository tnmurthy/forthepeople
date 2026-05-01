"use client";

/**
 * SectionProgressBar — sticky 4px bar at the top of the viewport
 * (just below IndiaBreadcrumb at top:56) that shows scroll progress
 * across the 10 super-categories as 10 equal-width segments.
 *
 * v2 (Step 12): segment fill is driven by `transform: scaleX(p)` on
 * a pseudo-fill element inside each segment, where `p` (0..1) is the
 * scroll progress through that band. We update the per-segment
 * `--seg-progress` CSS variable on a requestAnimationFrame loop, so
 * scrolling produces buttery 60fps fills with NO React re-renders.
 * No CSS transition is used — the rAF loop *is* the smoothing.
 *
 * Equal segment widths regardless of band height: scrolling halfway
 * through a tall section still shows that segment half-filled.
 *
 * Lighter colors: SECTION_ACCENT_LIGHT_COLORS gives the bar a sky /
 * honey / sage palette instead of the deep band accents.
 *
 * prefers-reduced-motion: globals.css disables the (already absent)
 * transition. The transform jumps update on every frame regardless.
 */

import * as React from "react";
import {
  SECTION_ACCENT_LIGHT_COLORS,
  SECTION_SLUGS_IN_ORDER,
} from "@/lib/india/section-accents";

/** Inverse of TINT_BY_SC in /[locale]/india/page.tsx — maps the
 *  data-tint-id attribute back to a super-category slug. */
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

/**
 * Style + behaviour for one segment.
 * Each segment has a transparent host span and an absolutely-positioned
 * fill child that scales horizontally based on `--seg-progress` (0..1).
 */
const segmentHostStyle: React.CSSProperties = {
  flex: 1,
  position: "relative",
  overflow: "hidden",
  background: "transparent",
};

const segmentFillStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "var(--seg-color, transparent)",
  transformOrigin: "left center",
  transform: "scaleX(var(--seg-progress, 0))",
  willChange: "transform",
  pointerEvents: "none",
};

export function SectionProgressBar() {
  const segmentRefs = React.useRef<Array<HTMLSpanElement | null>>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    type SectionEntry = { slug: string; el: HTMLElement };
    let sections: SectionEntry[] = [];
    let rafId: number | null = null;
    let lastProgress: number[] = [];

    const collectSections = () => {
      const all = Array.from(
        document.querySelectorAll<HTMLElement>("[data-tint-id]"),
      );
      const found: SectionEntry[] = [];
      for (const el of all) {
        const tintId = el.getAttribute("data-tint-id") ?? "";
        const slug = TINT_TO_SLUG[tintId];
        if (!slug) continue; // skip 'hero' and any unknown tint
        found.push({ slug, el });
      }
      // Document-order, matching SECTION_SLUGS_IN_ORDER.
      found.sort((a, b) => {
        const r = a.el.compareDocumentPosition(b.el);
        // eslint-disable-next-line no-bitwise
        return r & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      sections = found;
      // Reset cache so the next compute() forces an update.
      lastProgress = new Array(SECTION_SLUGS_IN_ORDER.length).fill(-1);
    };

    /**
     * Compute per-segment scroll progress relative to a pivot line at
     * 1/3 of the viewport height. progress = scrolled past section.top
     * divided by section.height, clamped to [0, 1]. Sections that
     * haven't reached the pivot yield 0; sections fully scrolled past
     * yield 1.
     */
    const compute = () => {
      const pivot = window.innerHeight / 3;
      // Map slug → progress so we can write to the right segment ref
      // even if document order ever drifts from registry order.
      const progressBySlug = new Map<string, number>();

      for (const { slug, el } of sections) {
        const rect = el.getBoundingClientRect();
        const total = rect.height || 1;
        const scrolledPast = pivot - rect.top;
        const p = Math.min(1, Math.max(0, scrolledPast / total));
        progressBySlug.set(slug, p);
      }

      for (let i = 0; i < SECTION_SLUGS_IN_ORDER.length; i++) {
        const slug = SECTION_SLUGS_IN_ORDER[i];
        const next = progressBySlug.get(slug) ?? 0;
        if (next === lastProgress[i]) continue;
        lastProgress[i] = next;
        const segEl = segmentRefs.current[i];
        if (segEl) {
          segEl.style.setProperty("--seg-progress", String(next));
        }
      }
    };

    const tick = () => {
      rafId = window.requestAnimationFrame(() => {
        compute();
        rafId = null;
      });
    };

    const onScroll = () => {
      if (rafId === null) tick();
    };
    const onResize = () => {
      collectSections();
      tick();
    };

    collectSections();
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Section scroll progress"
      aria-valuemin={0}
      aria-valuemax={SECTION_SLUGS_IN_ORDER.length}
      style={{
        position: "sticky",
        // Sits below the global header (56) + breadcrumb (~36) — same
        // top offset the previous bar used.
        top: "100px",
        width: "100%",
        height: "4px",
        zIndex: 39,
        display: "flex",
        gap: "1px",
        pointerEvents: "none",
        background: "rgba(0,0,0,0.025)",
      }}
    >
      {SECTION_SLUGS_IN_ORDER.map((slug, i) => {
        const color = SECTION_ACCENT_LIGHT_COLORS[slug] ?? "#A0A0A0";
        const cssVars = {
          "--seg-color": color,
          "--seg-progress": "0",
        } as React.CSSProperties;
        return (
          <span
            key={slug}
            ref={(el) => {
              segmentRefs.current[i] = el;
            }}
            data-section-progress-segment
            style={{ ...segmentHostStyle, ...cssVars }}
          >
            <span aria-hidden style={segmentFillStyle} />
          </span>
        );
      })}
    </div>
  );
}

export default SectionProgressBar;
