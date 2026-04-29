/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Module deep-dive hero: SVG illustration (Phase 2.5d sets the real
 * SVG library; this phase falls back to a Lucide icon with a
 * data-testid="module-hero-svg-fallback" attribute so Jayanth can
 * grep + swap later) + title + tagline + 3-6 headline KPI cards.
 *
 * MOCK DATA — replace in Session C1 (the 6 KPI cards are seeded from
 * mock-state-data; production reads from IndiaIndicator).
 */

import { Layers } from "lucide-react";
import type { IndiaModuleDef } from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN, categoryTint } from "@/lib/india/india-design";
import { CategorySvg } from "@/components/india/svg";
import {
  MOCK_METRICS,
  STATE_METRIC_VALUES,
} from "@/lib/india/mock-state-data";

interface Props {
  module: IndiaModuleDef;
}

interface KpiSeed {
  label: string;
  value: string;
  unit?: string;
}

function deriveHeadlineKpis(module: IndiaModuleDef): KpiSeed[] {
  // Pick up to 6 metrics in this category as headline KPIs. Falls back
  // to first few MOCK_METRICS if the category has none.
  const inCategory = MOCK_METRICS.filter((m) => m.category === module.category);
  const picks = (inCategory.length > 0 ? inCategory : MOCK_METRICS).slice(0, 4);
  return picks.map((m) => {
    const valuesForMetric = STATE_METRIC_VALUES.filter(
      (v) => v.metricKey === m.key,
    );
    const sum = valuesForMetric.reduce((acc, v) => acc + v.value, 0);
    const avg = valuesForMetric.length ? sum / valuesForMetric.length : 0;
    return {
      label: m.label,
      value: avg.toLocaleString("en-IN", { maximumFractionDigits: 1 }),
      unit: m.unit,
    };
  });
}

export default function ModuleHero({ module }: Props) {
  const accent = CATEGORY_ACCENT[module.category];
  const tint = categoryTint(module.category);
  const kpis = deriveHeadlineKpis(module);

  return (
    <section
      style={{
        padding: "32px 16px 24px",
        borderBottom: `1px solid ${INDIA_DESIGN.border}`,
        background: INDIA_DESIGN.bgPage,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 240px",
          gap: 32,
          alignItems: "center",
        }}
        className="india-module-hero-grid"
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              borderRadius: 999,
              background: tint,
              border: `1px solid ${accent}33`,
            }}
          >
            <span aria-hidden="true">{module.icon}</span>
            {module.category}
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: INDIA_DESIGN.textPrimary,
              letterSpacing: "-0.6px",
              lineHeight: 1.1,
              margin: "8px 0 6px",
              fontFamily: INDIA_DESIGN.fontDisplay,
            }}
          >
            {module.title}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: INDIA_DESIGN.textSecondary,
              lineHeight: 1.55,
              margin: "0 0 18px",
              maxWidth: 580,
            }}
          >
            {module.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 10,
            }}
          >
            {kpis.map((k) => (
              <div
                key={k.label}
                style={{
                  background: INDIA_DESIGN.bgCard,
                  border: `1px solid ${INDIA_DESIGN.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: INDIA_DESIGN.textFaint,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: INDIA_DESIGN.textPrimary,
                    fontFamily: INDIA_DESIGN.fontMono,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 2,
                  }}
                >
                  {k.value}
                  {k.unit ? (
                    <span
                      style={{
                        fontSize: 11,
                        color: INDIA_DESIGN.textMuted,
                        marginLeft: 3,
                      }}
                    >
                      {k.unit}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ModuleHeroSvg module={module} accent={accent} tint={tint} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .india-module-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ModuleHeroSvg({
  module,
  accent,
  tint,
}: {
  module: IndiaModuleDef;
  accent: string;
  tint: string;
}) {
  return (
    <div
      style={{
        background: tint,
        border: `1px solid ${accent}33`,
        borderRadius: 16,
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CategorySvg category={module.category} accent={accent} size={208} />
      {/* Lucide fallback hidden behind data attribute so Jayanth can grep */}
      <Layers
        size={0}
        aria-hidden="true"
        data-testid="module-hero-svg-fallback"
        style={{ display: "none" }}
      />
    </div>
  );
}
