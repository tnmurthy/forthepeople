"use client";

/**
 * v4 IndiaAtGlance band — three-column layout (identity zone /
 * featured module / right two-card stack). All values come in via
 * the data prop; this component owns:
 *  - the IntersectionObserver that sets `visible` for the entry animation
 *  - the CountUpNumber wiring on the headline
 *  - link composition (browse-all + per-module deep links, locale-aware)
 *
 * Featured module identity (icon + title + tagline) is read from the
 * INDIA_MODULES registry by matching MACRO_HEADLINE.moduleSlug, so a
 * registry rename automatically flows through.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { CompassWatermark } from "./Backdrop";
import { CountUpNumber } from "./CountUpNumber";
import {
  MACRO_HEADLINE,
  MACRO_GROWTH,
  MACRO_FEATURED_GRID,
  MACRO_RIGHT_STACK,
  MACRO_IDENTITY_STATS,
  indicatorKey,
} from "./metrics";
import { INDIA_SUPER_CATEGORIES } from "@/lib/india/india-super-categories";
import { INDIA_MODULES } from "@/lib/india/india-modules";
import type { MacroSnapshotData } from "@/lib/india/getMacroSnapshotData";

type Props = {
  data: MacroSnapshotData;
  locale: string;
};

function formatLakhInr(value: number): string {
  return `₹${(value / 100_000).toFixed(1)}L`;
}
function formatTrillionUsd(value: number): string {
  return `$${value.toFixed(1)}`;
}
function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
function formatWorkforce(value: number): string {
  return value >= 1e9
    ? `${(value / 1e9).toFixed(2)}B+`
    : `${Math.round(value / 1e6)}M+`;
}
function formatYear(date: Date): string {
  return String(new Date(date).getFullYear());
}
function formatMonthYear(date: Date): string {
  return new Date(date).toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function IndiaAtGlanceClient({ data, locale }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const headline = data.indicatorByKey[indicatorKey(MACRO_HEADLINE)];
  const growth = data.indicatorByKey[indicatorKey(MACRO_GROWTH)];
  const headlineBillions = headline ? headline.value / 1e9 : null;

  // Featured module identity from the registry.
  const featuredModule = INDIA_MODULES.find(
    (m) => m.slug === MACRO_HEADLINE.moduleSlug,
  );

  return (
    <section
      ref={ref}
      data-tint-id="macro"
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="india-at-a-glance-title"
    >
      <div className={styles.layout}>
        {/* LEFT — Identity zone */}
        <div className={styles.identityZone}>
          <div className={styles.sectionLabel}>
            <span className={styles.sectionLabelDot} aria-hidden />
            SECTION{" "}
            {String(data.superCategory.displayOrder).padStart(2, "0")} · OF{" "}
            {INDIA_SUPER_CATEGORIES.length}
          </div>
          <h2
            id="india-at-a-glance-title"
            className={styles.identityTitle}
          >
            {data.superCategory.title}
          </h2>
          <p className={styles.identityDesc}>
            {data.superCategory.tagline ?? ""}
          </p>

          <div className={styles.identityStats}>
            <div className={styles.identityStatRow}>
              <span className={styles.identityStatLabel}>Modules</span>
              <span className={styles.identityStatValue}>
                {data.liveCount} of {data.totalCount} live
              </span>
            </div>
            {MACRO_IDENTITY_STATS.map((s) => {
              const ind = data.indicatorByKey[indicatorKey(s.ref)];
              if (!ind) return null;
              let display: string;
              if (s.format === "trillion_usd")
                display = `${formatTrillionUsd(ind.value)}T`;
              else if (s.format === "percent")
                display = formatPercent(ind.value);
              else display = `${ind.value}`;
              const isPositive = ind.value > 0 && !!s.greenIfPositive;
              return (
                <div key={s.label} className={styles.identityStatRow}>
                  <span className={styles.identityStatLabel}>{s.label}</span>
                  <span
                    className={`${styles.identityStatValue} ${
                      isPositive ? styles.identityStatGreen : ""
                    }`}
                  >
                    {isPositive ? "↑ " : ""}
                    {display}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.identityActions}>
            <Link
              href={`/${locale}/india/category/${data.superCategory.slug}`}
              className={styles.browseBtn}
            >
              Browse all {data.totalCount} →
            </Link>
            <button
              type="button"
              className={styles.viewModeBtn}
              aria-label="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.viewModeBtn}
              aria-label="List view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1" />
                <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1" />
                <line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>

          <CompassWatermark />
        </div>

        {/* MIDDLE — Featured module */}
        <div className={styles.featured}>
          {featuredModule && (
            <div className={styles.featuredHeader}>
              <div className={styles.featuredTitleRow}>
                <span className={styles.featuredIcon} aria-hidden>
                  {featuredModule.icon}
                </span>
                <span className={styles.featuredTitle}>
                  {featuredModule.title}
                </span>
              </div>
              {featuredModule.status === "live" && (
                <span className={styles.livePill}>live</span>
              )}
            </div>
          )}

          {headlineBillions !== null && headline && (
            <>
              <div className={styles.headline}>
                <span className={styles.headlineMajor}>
                  <CountUpNumber
                    value={headlineBillions}
                    decimals={2}
                    visible={visible}
                  />
                </span>
                <span className={styles.headlineMinor}>billion</span>
                {growth && (
                  <span className={styles.growthPill}>
                    <span className={styles.growthArrow} aria-hidden>
                      ↑
                    </span>
                    <span className={styles.growthValue}>
                      {formatPercent(growth.value)} YoY
                    </span>
                  </span>
                )}
              </div>

              {featuredModule?.tagline && (
                <div className={styles.featuredDesc}>
                  {featuredModule.tagline}
                </div>
              )}
            </>
          )}

          <div className={styles.featuredGrid}>
            {MACRO_FEATURED_GRID.map((slot) => {
              const ind = data.indicatorByKey[indicatorKey(slot.ref)];
              if (!ind) return null;
              let display = "";
              if (slot.format === "lakh_inr") display = formatLakhInr(ind.value);
              else if (slot.format === "millions_workforce")
                display = formatWorkforce(ind.value);
              else if (slot.format === "states_uts") {
                const companion = slot.ref.companion
                  ? data.indicatorByKey[indicatorKey(slot.ref.companion)]
                  : null;
                display = companion
                  ? `${ind.value} + ${companion.value}`
                  : `${ind.value}`;
              } else {
                display = `${ind.value}`;
              }
              return (
                <div key={slot.label} className={styles.featuredCell}>
                  <div className={styles.featuredCellLabel}>{slot.label}</div>
                  <div className={styles.featuredCellValue}>{display}</div>
                </div>
              );
            })}
            {/* 4th cell — derived source attribution */}
            {headline?.source && (
              <div className={styles.featuredCell}>
                <div className={styles.featuredCellLabel}>source</div>
                <div className={styles.featuredCellSource}>
                  {headline.source}
                  {headline.asOfDate
                    ? ` · ${formatYear(headline.asOfDate)}`
                    : ""}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Two-card stack */}
        <div className={styles.rightStack}>
          {MACRO_RIGHT_STACK.map((entry) => {
            const ind = data.indicatorByKey[indicatorKey(entry.ref)];
            if (!ind) return null;
            let display = "";
            let unit = "";
            if (entry.format === "trillion_usd") {
              display = formatTrillionUsd(ind.value);
              unit = "T";
            } else if (entry.format === "percent") {
              display = ind.value.toFixed(1);
              unit = "%";
            } else {
              display = `${ind.value}`;
            }
            return (
              <Link
                key={entry.label}
                href={`/${locale}/india/${entry.moduleSlug}`}
                className={styles.rightCard}
              >
                <div className={styles.rightCardHeader}>
                  <div className={styles.rightCardTitleRow}>
                    <span className={styles.rightCardIcon} aria-hidden>
                      {entry.emoji}
                    </span>
                    <span className={styles.rightCardTitle}>{entry.label}</span>
                  </div>
                  <span className={styles.livePill}>live</span>
                </div>
                <div className={styles.rightCardValue}>
                  {display}
                  <span className={styles.rightCardValueUnit}>{unit}</span>
                </div>
                <div className={styles.rightCardSource}>
                  {ind.source}
                  {ind.asOfDate
                    ? ` · ${formatMonthYear(ind.asOfDate)}`
                    : ""}
                </div>
                <div className={styles.rightCardLink}>View module →</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
