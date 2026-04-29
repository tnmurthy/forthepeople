/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Sticky left rail navigation for /[locale]/india (≥1024px).
 *
 * Replaces the top-chip nav (now IndiaTopChipNav, kept as the mobile
 * fallback) with a 240px-wide sticky sidebar that groups modules by
 * category and highlights the active section via IntersectionObserver.
 *
 * Coming-soon-only categories render at 60% opacity with an italic
 * "Soon" tag and scroll to the Coming Soon Rail anchor on click.
 * The 💡 Suggest a module button at the bottom is pinned (always
 * visible) and routes to the voting widget.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type IndiaModuleCategory,
  getLiveIndiaModules,
  getComingSoonIndiaModules,
} from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN } from "@/lib/india/india-design";

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

interface RailItem {
  key: IndiaModuleCategory | "today";
  label: string;
  /** Anchor slug to scroll to on click. */
  anchorId: string;
  /** "live" if at least one live module in this category, else "coming". */
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

export default function IndiaLeftRailNav() {
  const items = useMemo<RailItem[]>(() => {
    const live = getLiveIndiaModules();
    const coming = getComingSoonIndiaModules();
    const out: RailItem[] = [];
    for (const key of ORDER) {
      if (key === "today") {
        out.push({
          key,
          label: CATEGORY_LABELS.today,
          anchorId: "india-today",
          state: "live",
        });
        continue;
      }
      const firstLive = live.find((m) => m.category === key);
      if (firstLive) {
        out.push({
          key,
          label: CATEGORY_LABELS[key],
          anchorId: firstLive.slug,
          state: "live",
        });
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
        rootMargin: `-${HEADER_OFFSET_PX + 8}px 0px -50% 0px`,
        threshold: [0, 0.1, 0.5, 1],
      },
    );
    for (const { el } of observed) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  function scrollTo(anchorId: string) {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  return (
    <aside
      aria-label="India dashboard sections"
      style={{
        position: "sticky",
        top: HEADER_OFFSET_PX,
        alignSelf: "flex-start",
        height: `calc(100vh - ${HEADER_OFFSET_PX}px)`,
        overflowY: "auto",
        background: INDIA_DESIGN.bgCard,
        borderRight: `1px solid ${INDIA_DESIGN.border}`,
        padding: "16px 12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: INDIA_DESIGN.textFaint,
          padding: "0 8px 8px",
        }}
      >
        Sections
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const accent = item.key === "today" ? "#1F2937" : CATEGORY_ACCENT[item.key];
          const isActive = active === item.key;
          const isComing = item.state === "coming";
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => scrollTo(item.anchorId)}
              aria-current={isActive ? "true" : undefined}
              title={isComing ? "Coming soon — opens the queue" : undefined}
              style={{
                position: "relative",
                background: isActive ? "#F3F4F6" : "transparent",
                color: isActive ? INDIA_DESIGN.textPrimary : INDIA_DESIGN.textSecondary,
                opacity: isComing ? 0.6 : 1,
                fontStyle: isComing ? "italic" : "normal",
                border: "none",
                borderRadius: 6,
                padding: "7px 10px 7px 14px",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minHeight: 32,
                transition: "background-color 120ms ease, color 120ms ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  bottom: 4,
                  width: 4,
                  borderRadius: 2,
                  background: isActive ? accent : "transparent",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accent,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
              {isComing ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: INDIA_DESIGN.textFaint,
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: "#F9FAFB",
                  }}
                >
                  Soon
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Pinned bottom action — Suggest a module */}
      <button
        type="button"
        onClick={() => scrollTo("india-vote")}
        style={{
          marginTop: 8,
          background: INDIA_DESIGN.bgMuted,
          border: `1px solid ${INDIA_DESIGN.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: INDIA_DESIGN.textPrimary,
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 36,
        }}
      >
        <span aria-hidden="true">💡</span>
        Suggest a module
      </button>
    </aside>
  );
}
