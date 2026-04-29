/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Mobile fallback for IndiaLeftRailNav (≤1024px). Adapted from the
 * Phase 2 IndiaSectionNav — same scroll-spy logic, same category chips,
 * but always visible at the top of the content column on smaller screens
 * because the sidebar is hidden.
 *
 * Coming-soon categories render in the chip strip too, at 60% opacity,
 * and click-through to the Coming Soon Rail anchor.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type IndiaModuleCategory,
  getLiveIndiaModules,
  getComingSoonIndiaModules,
} from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN } from "@/lib/india/india-design";

const NAV_HEIGHT_PX = 48;
const HEADER_OFFSET_PX = 64;

const CATEGORY_LABELS: Record<IndiaModuleCategory | "today", string> = {
  today: "Today",
  snapshot: "Snapshot",
  demographics: "People",
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
  key: IndiaModuleCategory | "today";
  label: string;
  anchorId: string;
  state: "live" | "coming";
}

const ORDER: Array<IndiaModuleCategory | "today"> = [
  "today",
  "demographics",
  "economy",
  "budget",
  "agriculture",
  "livestock",
  "wildlife",
  "infrastructure",
  "energy",
  "health",
  "education",
  "defence",
  "justice",
  "elections",
  "science",
  "trade",
  "tourism",
  "sports",
];

export default function IndiaTopChipNav() {
  const chips = useMemo<ChipDef[]>(() => {
    const live = getLiveIndiaModules();
    const coming = getComingSoonIndiaModules();
    const out: ChipDef[] = [];
    for (const key of ORDER) {
      if (key === "today") {
        out.push({ key, label: CATEGORY_LABELS.today, anchorId: "india-today", state: "live" });
        continue;
      }
      const firstLive = live.find((m) => m.category === key);
      if (firstLive) {
        out.push({ key, label: CATEGORY_LABELS[key], anchorId: firstLive.slug, state: "live" });
        continue;
      }
      const firstComing = coming.find((m) => m.category === key);
      if (firstComing) {
        out.push({
          key,
          label: CATEGORY_LABELS[key],
          anchorId: "india-coming-soon",
          state: "coming",
        });
      }
    }
    return out;
  }, []);

  const [active, setActive] = useState<IndiaModuleCategory | "today">("today");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const live = getLiveIndiaModules();
    const observed: { el: HTMLElement; cat: IndiaModuleCategory | "today" }[] = [];
    const today = document.getElementById("india-today");
    if (today) observed.push({ el: today, cat: "today" });
    for (const mod of live) {
      const el = document.getElementById(mod.slug);
      if (el) observed.push({ el, cat: mod.category });
    }
    if (observed.length === 0) return;
    let current: IndiaModuleCategory | "today" = "today";
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { cat: IndiaModuleCategory | "today"; top: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cat = observed.find((o) => o.el === entry.target)?.cat;
          if (!cat) continue;
          const top = (entry.target as HTMLElement).getBoundingClientRect().top;
          if (!best || top < best.top) best = { cat, top };
        }
        if (best && best.cat !== current) {
          current = best.cat;
          setActive(best.cat);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET_PX + NAV_HEIGHT_PX}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.5, 1],
      },
    );
    for (const { el } of observed) observer.observe(el);
    return () => observer.disconnect();
  }, [chips]);

  function scrollTo(anchorId: string) {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX - NAV_HEIGHT_PX;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  if (chips.length === 0) return null;

  return (
    <nav
      aria-label="India dashboard sections (mobile)"
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
            scrollbarWidth: "none",
          }}
          className="india-chip-scroll"
        >
          {chips.map((chip) => {
            const isActive = active === chip.key;
            const accent = chip.key === "today" ? "#1F2937" : CATEGORY_ACCENT[chip.key];
            const isComing = chip.state === "coming";
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => scrollTo(chip.anchorId)}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  background: isActive ? INDIA_DESIGN.accentBlue : INDIA_DESIGN.bgCard,
                  color: isActive ? "#FFFFFF" : INDIA_DESIGN.textSecondary,
                  border: isActive ? "none" : `1px solid ${INDIA_DESIGN.border}`,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  fontStyle: isComing && !isActive ? "italic" : "normal",
                  opacity: isComing && !isActive ? 0.65 : 1,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  minHeight: 28,
                  transition: "background-color 120ms ease, color 120ms ease",
                }}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isActive ? "#FFFFFF" : accent,
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
        .india-chip-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </nav>
  );
}
