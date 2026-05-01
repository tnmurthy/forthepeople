"use client";

/**
 * SuperCategoryPreviewBand — v3 Split Hero pattern (file 47 §4.6.4).
 *
 * Layout:
 *   ┌──────────────────┬─────────────────────────────────┐
 *   │                  │  Featured + 2 stacked (grid)    │
 *   │  Identity zone   │     OR                           │
 *   │  (320px, accent  │  Module table (5 cols)           │
 *   │   gradient)      │                                  │
 *   └──────────────────┴─────────────────────────────────┘
 *
 * Identity zone holds: watermarks (3 layered emoji), eyebrow, section
 * name, tagline, mini-stats (live count + headline KPI), browse-all CTA,
 * grid/table toggle. Modules zone swaps content based on toggle state.
 *
 * Entrance animation: opacity + translateY, delay = bandIndex × 200ms.
 * Featured-card headline number wraps in CountUpNumber.
 * Hover on grid cards reveals a metadata strip.
 * Hover on table row source dot surfaces a tooltip.
 */

import * as React from "react";
import Link from "next/link";
import {
  Building,
  BookOpenText,
  Globe2,
  PawPrint,
  Pickaxe,
  Rocket,
  Scale,
  Theater,
  TrendingUp,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import {
  IndiaSuperCategoryAccents,
  type IndiaAccentColorKey,
} from "@/lib/india/design-tokens";
import type {
  IndiaSuperCategoryDef,
  WatermarkIconKey,
} from "@/lib/india/india-super-categories";

/**
 * Client-side resolver: maps the registry's serializable string key to the
 * actual Lucide component. Server-rendered registry data crosses the client
 * boundary as plain strings; the function reference stays on this side.
 */
const WATERMARK_ICONS: Record<WatermarkIconKey, LucideIcon> = {
  "trending-up": TrendingUp,
  "book-open-text": BookOpenText,
  "globe-2": Globe2,
  "paw-print": PawPrint,
  wheat: Wheat,
  pickaxe: Pickaxe,
  building: Building,
  scale: Scale,
  rocket: Rocket,
  theater: Theater,
};
import type { IndiaModuleDef } from "@/lib/india/india-modules";
import { CountUpNumber } from "@/components/india/primitives/CountUpNumber";
import { getBandDecoration } from "@/components/india/primitives/decorations";
import { SourceDot } from "@/components/india/primitives/SourceDot";
import { formatIndiaNumber } from "@/lib/india/format-number";
import { INDIA_SOURCES } from "@/lib/india/india-sources";

export interface SuperCategoryPreviewBandProps {
  superCategory: IndiaSuperCategoryDef;
  modules: IndiaModuleDef[];
  defaultView?: "grid" | "table";
  locale: string;
  bandIndex: number;
}

type ViewMode = "grid" | "table";

const accentVarName = (key: IndiaAccentColorKey, stop: 700 | 800 | 900): string =>
  `var(--accent-${key}-${stop})`;

function StatusPill({ status }: { status: IndiaModuleDef["status"] }) {
  if (status === "live") {
    return (
      <span
        style={{
          fontSize: "9px",
          fontWeight: 500,
          letterSpacing: "0.04em",
          background: "#E1F5EE",
          color: "#16A34A",
          padding: "1px 6px",
          borderRadius: "3px",
          textTransform: "uppercase",
        }}
      >
        Live
      </span>
    );
  }
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: 500,
        letterSpacing: "0.04em",
        background: "#FAEEDA",
        color: "#854F0B",
        padding: "1px 6px",
        borderRadius: "3px",
        textTransform: "uppercase",
      }}
    >
      Soon
    </span>
  );
}

function moduleHeadlineValue(m: IndiaModuleDef): { value: number | null; unit: string } {
  if (!m.headlineMetric) return { value: null, unit: "" };
  return { value: m.headlineMetric.mockValue, unit: m.headlineMetric.mockUnit };
}

function moduleSourceDomain(m: IndiaModuleDef): string {
  const key = m.sources[0]?.sourceKey;
  if (!key) return "—";
  const meta = INDIA_SOURCES[key];
  if (!meta?.url) return key;
  try {
    return new URL(meta.url).hostname.replace(/^www\./, "");
  } catch {
    return key;
  }
}

function moduleCadenceLine(m: IndiaModuleDef): string {
  const refresh = m.sources[0]?.refresh ?? "Annual";
  return `${refresh} cadence · Initial dataset`;
}

const ACCENT_RGB_TUPLE: Record<IndiaAccentColorKey, string> = {
  blue: "24, 95, 165",
  indigo: "83, 74, 183",
  teal: "15, 110, 86",
  "forest-green": "90, 143, 46",
  wheat: "181, 138, 30",
  slate: "74, 83, 88",
  amber: "186, 117, 23",
  purple: "60, 52, 137",
  coral: "153, 60, 29",
  pink: "153, 53, 86",
};

interface ModuleHoverContentProps {
  module: IndiaModuleDef;
}

function ModuleHoverReveal({ module }: ModuleHoverContentProps) {
  return (
    <div
      className="band-hover-reveal"
      style={{
        marginTop: "10px",
        paddingTop: "8px",
        borderTop: "1px dashed var(--color-border-tertiary)",
        display: "grid",
        gap: "3px",
        fontSize: "10.5px",
        color: "var(--color-text-secondary)",
        lineHeight: 1.5,
      }}
    >
      <div>
        Source · <span style={{ fontWeight: 500 }}>{moduleSourceDomain(module)}</span>
      </div>
      <div style={{ color: "var(--color-text-tertiary)" }}>
        {moduleCadenceLine(module)}
      </div>
    </div>
  );
}

interface FeaturedCardProps {
  module: IndiaModuleDef;
  accentColor: IndiaAccentColorKey;
  locale: string;
}

function FeaturedCard({ module, accentColor, locale }: FeaturedCardProps) {
  const { value, unit } = moduleHeadlineValue(module);
  const accentRgb = ACCENT_RGB_TUPLE[accentColor];

  return (
    <Link
      href={`/${locale}/india/${module.slug}`}
      className="band-featured-card"
      style={{
        display: "block",
        padding: "16px 18px 14px",
        background: `linear-gradient(180deg, rgba(${accentRgb}, 0.025) 0%, var(--color-surface) 100%)`,
        textDecoration: "none",
        color: "inherit",
        height: "100%",
        gridColumn: "1",
        gridRow: "1 / span 2",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: "18px" }}>{module.icon}</span>
        <span style={{ fontSize: "13.5px", fontWeight: 500, flex: 1 }}>{module.title}</span>
        <StatusPill status={module.status} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
        {value !== null ? (
          <CountUpNumber
            target={value}
            inlineStyle={{
              fontFamily: "var(--font-mono)",
              fontSize: "36px",
              fontWeight: 500,
              lineHeight: 1,
              color: accentVarName(accentColor, 800),
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "36px",
              fontWeight: 500,
              lineHeight: 1,
              color: accentVarName(accentColor, 800),
            }}
          >
            —
          </span>
        )}
        {unit && (
          <span style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>{unit}</span>
        )}
      </div>

      <p
        style={{
          fontSize: "11.5px",
          color: "var(--color-text-secondary)",
          lineHeight: 1.45,
          margin: "0 0 10px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {module.tagline}
      </p>

      {module.featuredCardDataGrid && module.featuredCardDataGrid.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "rgba(0,0,0,0.06)",
            marginTop: "8px",
            border: "0.5px solid rgba(0,0,0,0.06)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {module.featuredCardDataGrid.slice(0, 4).map((cell, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface)",
                padding: "6px 8px",
                fontSize: "10.5px",
              }}
            >
              <div
                style={{
                  color: "var(--color-text-tertiary)",
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: "1px",
                }}
              >
                {cell.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: "11.5px",
                  color: "var(--color-text-primary)",
                }}
              >
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <ModuleHoverReveal module={module} />
    </Link>
  );
}

interface StackedCardProps {
  module: IndiaModuleDef;
  accentColor: IndiaAccentColorKey;
  locale: string;
}

function StackedCard({ module, accentColor, locale }: StackedCardProps) {
  const { value, unit } = moduleHeadlineValue(module);
  const isSoon = module.status !== "live";

  return (
    <Link
      href={`/${locale}/india/${module.slug}`}
      className="band-stacked-card"
      style={{
        display: "block",
        padding: "14px 16px 12px",
        background: "var(--color-surface)",
        textDecoration: "none",
        color: "inherit",
        opacity: isSoon ? 0.78 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "16px" }}>{module.icon}</span>
        <span style={{ fontSize: "12.5px", fontWeight: 500, flex: 1 }}>{module.title}</span>
        <StatusPill status={module.status} />
      </div>

      {isSoon ? (
        <p
          style={{
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            lineHeight: 1.45,
            margin: "0 0 6px",
          }}
        >
          {module.tagline}
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "22px",
              fontWeight: 500,
              lineHeight: 1.1,
              color: accentVarName(accentColor, 800),
            }}
          >
            {value !== null ? formatIndiaNumber(value) : "—"}
          </span>
          {unit && (
            <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{unit}</span>
          )}
        </div>
      )}

      <ModuleHoverReveal module={module} />
    </Link>
  );
}

interface ModuleTableProps {
  modules: IndiaModuleDef[];
  accentColor: IndiaAccentColorKey;
  locale: string;
}

function ModuleTable({ modules, accentColor, locale }: ModuleTableProps) {
  const accent = IndiaSuperCategoryAccents[accentColor];

  return (
    <div
      role="table"
      style={{
        width: "100%",
        background: "var(--color-surface)",
        fontSize: "12px",
      }}
    >
      <div
        role="row"
        style={{
          display: "grid",
          gridTemplateColumns:
            "32px minmax(180px, 2fr) minmax(160px, 1.6fr) minmax(140px, 1.4fr) 80px",
          gap: "18px",
          padding: "11px 22px",
          background: "var(--color-background-secondary)",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          fontFamily: "var(--font-mono)",
          fontSize: "9.5px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span aria-hidden></span>
        <span>Module</span>
        <span>Headline</span>
        <span>Top state</span>
        <span style={{ textAlign: "right" }}>Trend</span>
      </div>

      {modules.map((m) => {
        const { value, unit } = moduleHeadlineValue(m);
        const isSoon = m.status !== "live";
        return (
          <Link
            key={m.slug}
            role="row"
            href={`/${locale}/india/${m.slug}`}
            className="band-table-row"
            style={{
              display: "grid",
              gridTemplateColumns:
                "32px minmax(180px, 2fr) minmax(160px, 1.6fr) minmax(140px, 1.4fr) 80px",
              gap: "18px",
              padding: "13px 22px",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              textDecoration: "none",
              color: "var(--color-text-primary)",
              opacity: isSoon ? 0.6 : 1,
              alignItems: "center",
            }}
          >
            <span aria-hidden style={{ fontSize: "16px" }}>
              {m.icon}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{m.title}</span>
              <SourceDot
                accentHex={accent.hex}
                domain={moduleSourceDomain(m)}
                cadence={moduleCadenceLine(m)}
              />
              <StatusPill status={m.status} />
            </span>
            <span style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              {isSoon ? (
                <span style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>
                  {m.tagline}
                </span>
              ) : (
                <>
                  {value !== null ? (
                    <CountUpNumber
                      target={value}
                      inlineStyle={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      —
                    </span>
                  )}
                  {unit && (
                    <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                      {unit}
                    </span>
                  )}
                </>
              )}
            </span>
            <span style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>
              {isSoon ? (
                "—"
              ) : (
                <span
                  style={{
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  state-wise breakdown coming soon
                </span>
              )}
            </span>
            <span style={{ textAlign: "right", paddingRight: "4px" }}>
              {isSoon ? (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  vote ▲
                </span>
              ) : (
                <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>—</span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function SuperCategoryPreviewBand({
  superCategory,
  modules,
  defaultView = "grid",
  locale,
  bandIndex,
}: SuperCategoryPreviewBandProps) {
  const [view, setView] = React.useState<ViewMode>(defaultView);
  const accent = IndiaSuperCategoryAccents[superCategory.accentColor];
  const accentColorKey = superCategory.accentColor;

  const ordered = [...modules].sort((a, b) => a.displayOrder - b.displayOrder);
  const featured = ordered[0];
  const stacked = ordered.slice(1, 3);
  const totalLive = modules.filter((m) => m.status === "live").length;
  const headlineKpi = featured?.headlineMetric;
  const WatermarkIcon = WATERMARK_ICONS[superCategory.watermarkIcon];

  const eyebrow = `SECTION ${String(bandIndex + 1).padStart(2, "0")} · OF 10`;

  // Heuristic mini-stat #2: pick one of the stacked modules with a headline
  const secondaryKpi = stacked.find((m) => m.headlineMetric)?.headlineMetric;
  const secondaryLabel = stacked.find((m) => m.headlineMetric)?.title ?? "";

  // Per-super-category thematic decoration (file 48 §Section 2.3 GAP 4).
  const Decoration = getBandDecoration(superCategory.slug);
  const isWildlife = superCategory.slug === "wildlife-forests";

  return (
    <section
      className={`band-root ${isWildlife ? "band-wildlife" : ""}`}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        borderRadius: "var(--border-radius-lg)",
        overflow: "hidden",
        border: isWildlife
          ? "1px solid rgba(90, 143, 46, 0.30)"
          : "0.5px solid var(--color-border-tertiary)",
        minHeight: "320px",
        marginBottom: "1.5rem",
        // Wildlife band: forest-green linear-gradient backdrop (the modules
        // zone shows through this; identity zone overlays its own gradient).
        // Other bands keep the neutral surface color.
        background: isWildlife
          ? "linear-gradient(180deg, #F4F8EA 0%, #ECF2DD 100%)"
          : "var(--color-surface)",
        // Branch borders need 24px of breathing room top + bottom on wildlife.
        paddingTop: isWildlife ? "24px" : undefined,
        paddingBottom: isWildlife ? "24px" : undefined,
        opacity: 0,
        transform: "translateY(8px)",
        animation: "band-enter 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        animationDelay: `${bandIndex * 200}ms`,
      }}
    >
      {Decoration && <Decoration />}
      {/* Identity zone */}
      <div
        style={{
          position: "relative",
          padding: "24px 22px 20px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(165deg, ${accentVarName(accentColorKey, 700)}, ${accentVarName(
            accentColorKey,
            900,
          )})`,
          overflow: "hidden",
        }}
      >
        {/* Watermark — single Lucide SVG at 10% opacity, file 48 §4.7.7 */}
        <WatermarkIcon
          aria-hidden
          style={{
            position: "absolute",
            right: "-14px",
            bottom: "-20px",
            width: "180px",
            height: "180px",
            color: "white",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.12em",
            opacity: 0.78,
            marginBottom: "14px",
          }}
        >
          <WatermarkIcon size={12} aria-hidden />
          {eyebrow}
        </div>

        <h2
          style={{
            position: "relative",
            fontFamily: "var(--font-jakarta)",
            fontSize: "26px",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          {superCategory.title}
        </h2>

        <p
          style={{
            position: "relative",
            fontSize: "12.5px",
            opacity: 0.92,
            lineHeight: 1.55,
            margin: "0 0 18px",
          }}
        >
          {superCategory.tagline}
        </p>

        {/* Mini-stats — pushed to bottom via flex-1 spacer */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            position: "relative",
            paddingTop: "12px",
            borderTop: "0.5px solid rgba(255,255,255,0.22)",
            display: "grid",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "11px", opacity: 0.82 }}>Modules</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {totalLive} of {modules.length} live
            </span>
          </div>
          {headlineKpi && (
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  opacity: 0.82,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "60%",
                }}
              >
                {headlineKpi.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <CountUpNumber
                  target={headlineKpi.mockValue}
                  inlineStyle={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                />{" "}
                {headlineKpi.mockUnit}
              </span>
            </div>
          )}
          {secondaryKpi && (
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span
                style={{
                  fontSize: "11px",
                  opacity: 0.82,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "60%",
                }}
              >
                {secondaryLabel}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {formatIndiaNumber(secondaryKpi.mockValue)} {secondaryKpi.mockUnit}
              </span>
            </div>
          )}
        </div>

        {/* Footer row */}
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <Link
            href={`/${locale}/india/category/${superCategory.slug}`}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "999px",
              background: "rgba(255,255,255,0.18)",
              border: "0.5px solid rgba(255,255,255,0.26)",
              color: "white",
              textDecoration: "none",
              textAlign: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            Browse all {modules.length} →
          </Link>

          <div
            role="tablist"
            aria-label="View toggle"
            style={{
              display: "inline-flex",
              gap: "2px",
              borderRadius: "999px",
              border: "0.5px solid rgba(255,255,255,0.26)",
              padding: "2px",
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "grid"}
              onClick={() => setView("grid")}
              style={{
                width: "28px",
                height: "24px",
                borderRadius: "999px",
                border: "none",
                background: view === "grid" ? "rgba(255,255,255,0.28)" : "transparent",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                lineHeight: 1,
              }}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "table"}
              onClick={() => setView("table")}
              style={{
                width: "28px",
                height: "24px",
                borderRadius: "999px",
                border: "none",
                background: view === "table" ? "rgba(255,255,255,0.28)" : "transparent",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                lineHeight: 1,
              }}
              title="Table view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Modules zone */}
      <div style={{ background: "var(--color-border-tertiary)" }}>
        {view === "grid" ? (
          featured ? (
            <div
              className="band-grid-zone"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "1px",
                height: "100%",
                minHeight: "320px",
              }}
            >
              <FeaturedCard module={featured} accentColor={accentColorKey} locale={locale} />
              {stacked[0] && (
                <StackedCard
                  module={stacked[0]}
                  accentColor={accentColorKey}
                  locale={locale}
                />
              )}
              {stacked[1] && (
                <StackedCard
                  module={stacked[1]}
                  accentColor={accentColorKey}
                  locale={locale}
                />
              )}
              {!stacked[0] && (
                <div style={{ background: "var(--color-surface)" }} />
              )}
              {!stacked[1] && (
                <div style={{ background: "var(--color-surface)" }} />
              )}
            </div>
          ) : (
            <div
              style={{
                background: "var(--color-surface)",
                padding: "24px",
                color: "var(--color-text-tertiary)",
                fontSize: "13px",
              }}
            >
              No modules available yet.
            </div>
          )
        ) : (
          <ModuleTable modules={ordered} accentColor={accentColorKey} locale={locale} />
        )}
      </div>

      <style>{`
        @keyframes band-enter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .band-root {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
        .band-featured-card .band-hover-reveal,
        .band-stacked-card .band-hover-reveal {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 280ms ease-out, opacity 280ms ease-out, margin-top 280ms ease-out, padding-top 280ms ease-out;
          margin-top: 0;
          padding-top: 0;
          border-top-color: transparent;
        }
        .band-featured-card:hover .band-hover-reveal,
        .band-featured-card:focus-visible .band-hover-reveal,
        .band-stacked-card:hover .band-hover-reveal,
        .band-stacked-card:focus-visible .band-hover-reveal {
          max-height: 88px;
          opacity: 1;
          margin-top: 10px;
          padding-top: 8px;
          border-top-color: var(--color-border-tertiary);
        }
        .band-table-row:hover {
          background: ${accent.hex}0A;
        }
        /* Wildlife & Forests band — forest-green hover lift on cards.
           File 48 §Section 2.3 GAP 4 Step 4C. */
        .band-wildlife .band-featured-card,
        .band-wildlife .band-stacked-card {
          transition: transform 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out;
        }
        .band-wildlife .band-featured-card:hover,
        .band-wildlife .band-stacked-card:hover {
          transform: translateY(-2px);
          border-color: rgba(90, 143, 46, 0.7) !important;
          box-shadow: 0 4px 14px rgba(90, 143, 46, 0.12);
        }
      `}</style>
    </section>
  );
}

export default SuperCategoryPreviewBand;
