/**
 * DataModuleHero — module deep-dive hero with all authenticity moves visible.
 *
 * File 45 §4 Level 3 (data) + §6.
 *
 * Authenticity moves rendered:
 *  #1 Two dates (asOfDate + lastFetchedAt) in the freshness strip
 *  #2 Click-through verification — source pills are links
 *  #3 Scraper health indicator — dot in freshness strip
 *  #4 Methodology link — in freshness strip
 *  #5 Prior-value comparison — in headline KPI block
 *  #8 Data quality flag — chip on headline KPI
 */

import * as React from "react";
import { prisma } from "@/lib/db";
import type { IndiaModuleDef } from "@/lib/india/india-modules";
import { getSuperCategoryBySlug } from "@/lib/india/india-super-categories";
import { IndiaSuperCategoryAccents } from "@/lib/india/design-tokens";
import { DataQualityChip, type DataQualityKind } from "@/components/india/primitives/DataQualityChip";
import { SourceHealthDot, type ScraperCadence } from "@/components/india/primitives/SourceHealthDot";
import { SourcePill } from "@/components/india/primitives/SourcePill";

export interface DataModuleHeroProps {
  module: IndiaModuleDef;
  headlineMetricKey: string;       // moduleSlug + metricKey identifies the IndiaIndicator row
  expectedCadence?: ScraperCadence;
  scraperKey?: string;             // overrides module.scraperKeys[0] if needed
}

function formatNumber(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString("en-IN");
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function relativeTime(d: Date | null | undefined): string {
  if (!d) return "—";
  const ms = Date.now() - new Date(d).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function DataModuleHero({
  module,
  headlineMetricKey,
  expectedCadence = "annual",
  scraperKey,
}: DataModuleHeroProps) {
  const sc = getSuperCategoryBySlug(module.superCategory);
  const accent = sc ? IndiaSuperCategoryAccents[sc.accentColor] : IndiaSuperCategoryAccents.blue;

  const indicator = await prisma.indiaIndicator.findUnique({
    where: {
      moduleSlug_metricKey: {
        moduleSlug: module.slug,
        metricKey: headlineMetricKey,
      },
    },
  });

  const value = indicator?.numericValue ? Number(indicator.numericValue) : null;
  const previous = indicator?.previousValue ? Number(indicator.previousValue) : null;
  const delta =
    value !== null && previous !== null && previous !== 0
      ? ((value - previous) / previous) * 100
      : null;
  const deltaTrend: "up" | "down" | "flat" =
    delta === null ? "flat" : delta > 0.1 ? "up" : delta < -0.1 ? "down" : "flat";
  const deltaGlyph = deltaTrend === "up" ? "↑" : deltaTrend === "down" ? "↓" : "→";
  const deltaColor =
    deltaTrend === "up" ? "#16A34A" : deltaTrend === "down" ? "#A32D2D" : "var(--color-text-tertiary)";

  const quality = (indicator?.dataQuality ?? "published") as DataQualityKind;
  const sourceUrl = indicator?.sourceUrl ?? module.sources[0]?.sourceKey ?? "";
  const sourceName = indicator?.source ?? module.sources[0]?.sourceKey ?? "—";
  const methodologyUrl = indicator?.methodologyUrl;

  const resolvedScraperKey = scraperKey ?? module.scraperKeys[0] ?? `${module.slug}-no-scraper`;

  return (
    <section
      style={{
        position: "relative",
        padding: "24px 28px",
        borderRadius: "var(--border-radius-lg)",
        border: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-surface)",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 100% at 0% 0%, ${accent.hex}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        className="data-hero-grid"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT: title + headline KPI + freshness */}
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: accent.hex,
              fontWeight: 500,
              marginBottom: "4px",
            }}
          >
            {module.icon} {sc?.title ?? module.superCategory}
            {module.subGroup ? ` · ${module.subGroup}` : ""}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: "32px",
              fontWeight: 500,
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className="data-hero-title"
          >
            {module.title}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-text-secondary)",
              margin: "0 0 18px",
              maxWidth: "560px",
            }}
          >
            {module.tagline}
          </p>

          {/* Headline KPI block */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "44px",
                fontWeight: 500,
                lineHeight: 1,
                color: accent.text,
              }}
              className="data-hero-bignum"
            >
              {formatNumber(value)}
            </span>
            {indicator?.unit && (
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                {indicator.unit}
              </span>
            )}
            {previous !== null && delta !== null && (
              <span style={{ fontSize: "12px", color: deltaColor }}>
                {deltaGlyph} {Math.abs(delta).toFixed(1)}% from{" "}
                {indicator?.previousAsOfDate ? new Date(indicator.previousAsOfDate).getFullYear() : "prior"}
              </span>
            )}
            <DataQualityChip quality={quality} />
          </div>

          {/* Two-date freshness strip */}
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              fontSize: "11px",
              color: "var(--color-text-secondary)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <SourceHealthDot
                scraperKey={resolvedScraperKey}
                expectedCadence={expectedCadence}
              />
              <span>
                Data:{" "}
                <a
                  href={sourceUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-text-info)", textDecoration: "none" }}
                >
                  {sourceName}
                </a>{" "}
                · {formatDate(indicator?.asOfDate ?? null)}
              </span>
            </span>
            <span style={{ color: "var(--color-text-tertiary)" }}>
              · Synced {relativeTime(indicator?.fetchedAt ?? null)}
            </span>
            {methodologyUrl && (
              <a
                href={methodologyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-text-info)", fontSize: "11px" }}
              >
                · Methodology ↗
              </a>
            )}
          </div>
        </div>

        {/* RIGHT: sources mini-box */}
        <div
          style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--color-text-tertiary)",
              marginBottom: "8px",
            }}
          >
            Sources
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {module.sources.slice(0, 4).map((s) => (
              <SourcePill
                key={s.sourceKey}
                domain={s.sourceKey === sourceName ? domainOf(sourceUrl) : s.sourceKey}
                url={s.sourceKey === sourceName ? sourceUrl : undefined}
                variant="gov"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .data-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .data-hero-title {
            font-size: 24px !important;
          }
          .data-hero-bignum {
            font-size: 36px !important;
          }
        }
      `}</style>
    </section>
  );
}

export default DataModuleHero;
