/**
 * SuperCategoryPreviewBand — one band per super-category on /en/india.
 *
 * 10 bands total below the hero. File 45 §4 Level 1.
 *
 * Reads INDIA_MODULES via getModulesForSuperCategory and renders the
 * top 4 modules as preview cards plus a "View all N modules ›" link.
 */

import * as React from "react";
import Link from "next/link";
import type { IndiaSuperCategoryDef } from "@/lib/india/india-super-categories";
import {
  INDIA_MODULES,
  getLiveModuleCountInSuperCategory,
} from "@/lib/india/india-modules";
import { getModulesForSuperCategory } from "@/lib/india/india-super-categories";
import {
  IndiaSuperCategoryAccents,
} from "@/lib/india/design-tokens";
import { ModulePreviewCard } from "@/components/india/primitives/ModulePreviewCard";

export interface SuperCategoryPreviewBandProps {
  superCategory: IndiaSuperCategoryDef;
  locale: string;
}

export function SuperCategoryPreviewBand({
  superCategory,
  locale,
}: SuperCategoryPreviewBandProps) {
  const accent = IndiaSuperCategoryAccents[superCategory.accentColor];
  const modules = getModulesForSuperCategory(superCategory.slug, INDIA_MODULES).slice(0, 4);
  const totalInSuperCategory = INDIA_MODULES.filter(
    (m) => m.superCategory === superCategory.slug,
  ).length;
  const liveCount = getLiveModuleCountInSuperCategory(superCategory.slug);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      {/* Band hero strip with accent radial wash */}
      <div
        style={{
          position: "relative",
          padding: "18px 22px",
          borderRadius: "var(--border-radius-lg)",
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border-tertiary)",
          marginBottom: "14px",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(50% 100% at 0% 0%, ${accent.hex}1F 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: accent.hex,
                marginBottom: "2px",
                fontWeight: 500,
              }}
            >
              {superCategory.icon} {superCategory.title}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "22px",
                fontWeight: 500,
                margin: "0 0 4px",
                letterSpacing: "-0.01em",
              }}
            >
              {superCategory.title}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", margin: 0 }}>
              {superCategory.tagline}
            </p>
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textAlign: "right" }}>
            <div>{totalInSuperCategory} modules · {liveCount} live</div>
            <Link
              href={`/${locale}/india/category/${superCategory.slug}`}
              style={{ color: "var(--color-text-info)", marginTop: "4px", display: "inline-block" }}
            >
              View all {totalInSuperCategory} ›
            </Link>
          </div>
        </div>
      </div>

      {/* Preview cards */}
      <div
        className="india-preview-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "14px",
        }}
      >
        {modules.map((m) => (
          <ModulePreviewCard
            key={m.slug}
            module={m}
            accentColor={superCategory.accentColor}
            locale={locale}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .india-preview-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .india-preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default SuperCategoryPreviewBand;
