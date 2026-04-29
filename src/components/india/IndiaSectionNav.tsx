/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Sticky scroll-spy nav for /[locale]/india.
 *
 * Generated from getIndiaCategories() (one chip per category, not per
 * module — there are too many modules for that to be usable). Each chip
 * scrolls to the first live module in its category. The IntersectionObserver
 * watches every band's anchor; whichever band is highest in the viewport
 * sets the active category.
 *
 * Mobile: horizontal scroll-snap row of chips. Desktop: same row, just
 * wraps when needed. Sticks 56px below the header (matches HeaderBar).
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type IndiaModuleCategory,
  getLiveIndiaModules,
} from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN } from "@/lib/india/india-design";

const NAV_HEIGHT_PX = 48;
const HEADER_OFFSET_PX = INDIA_DESIGN.headerOffsetPx;

const CATEGORY_LABELS: Record<IndiaModuleCategory, string> = {
  snapshot: "Snapshot",
  demographics: "Demographics",
  economy: "Economy",
  budget: "Budget",
  agriculture: "Agriculture",
  livestock: "Livestock",
  wildlife: "Wildlife",
  infrastructure: "Infrastructure",
  energy: "Energy",
  health: "Health",
  education: "Education",
  defence: "Defence",
  justice: "Justice",
  elections: "Elections",
  science: "Science",
  trade: "Trade",
  tourism: "Tourism",
  sports: "Sports",
  custom: "More",
};

interface ChipDef {
  category: IndiaModuleCategory;
  label: string;
  /** Slug of the FIRST live module in this category (the scroll target). */
  anchorSlug: string;
}

export default function IndiaSectionNav() {
  const chips = useMemo<ChipDef[]>(() => {
    const live = getLiveIndiaModules();
    const seen = new Set<IndiaModuleCategory>();
    const out: ChipDef[] = [];
    for (const mod of live) {
      if (seen.has(mod.category)) continue;
      seen.add(mod.category);
      out.push({
        category: mod.category,
        label: CATEGORY_LABELS[mod.category],
        anchorSlug: mod.slug,
      });
    }
    return out;
  }, []);

  const [activeCategory, setActiveCategory] = useState<IndiaModuleCategory | null>(
    chips[0]?.category ?? null,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const live = getLiveIndiaModules();
    const elements: { el: HTMLElement; category: IndiaModuleCategory }[] = [];
    for (const mod of live) {
      const el = document.getElementById(mod.slug);
      if (el) elements.push({ el, category: mod.category });
    }
    if (elements.length === 0) return;

    let current: IndiaModuleCategory | null = chips[0]?.category ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is
        // currently intersecting.
        let best: { category: IndiaModuleCategory; top: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          const cat = elements.find((e) => e.el === target)?.category;
          if (!cat) continue;
          const top = target.getBoundingClientRect().top;
          if (!best || top < best.top) best = { category: cat, top };
        }
        if (best && best.category !== current) {
          current = best.category;
          setActiveCategory(best.category);
        }
      },
      {
        // Treat the top 60% of the viewport as the "is this section active"
        // zone. Triggers as soon as a band crosses the upper portion.
        rootMargin: `-${HEADER_OFFSET_PX + NAV_HEIGHT_PX}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.5, 1],
      },
    );

    for (const { el } of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [chips]);

  if (chips.length === 0) return null;

  function scrollTo(anchorSlug: string) {
    const el = document.getElementById(anchorSlug);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX - NAV_HEIGHT_PX;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  return (
    <nav
      aria-label="India dashboard sections"
      style={{
        position: "sticky",
        top: HEADER_OFFSET_PX,
        zIndex: 30,
        background: "rgba(250, 250, 248, 0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${INDIA_DESIGN.border}`,
      }}
    >
      <div
        style={{
          maxWidth: INDIA_DESIGN.sectionMaxWidth,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollSnapType: "x proximity",
            padding: "10px 0",
            margin: "0 -4px",
            // Hide scrollbar visually but keep the scroll behavior
            scrollbarWidth: "none",
          }}
          className="india-nav-scroll"
        >
          {chips.map((chip) => {
            const active = activeCategory === chip.category;
            const accent = CATEGORY_ACCENT[chip.category];
            return (
              <button
                key={chip.category}
                type="button"
                onClick={() => scrollTo(chip.anchorSlug)}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  background: active ? INDIA_DESIGN.accentBlue : INDIA_DESIGN.bgCard,
                  color: active ? "#FFFFFF" : INDIA_DESIGN.textSecondary,
                  border: active ? "none" : `1px solid ${INDIA_DESIGN.border}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  minHeight: 28,
                  transition: "background-color 120ms ease, color 120ms ease",
                }}
                aria-current={active ? "true" : undefined}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: active ? "#FFFFFF" : accent,
                    flexShrink: 0,
                  }}
                />
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .india-nav-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </nav>
  );
}
