/**
 * /[locale]/india/category/[superCategorySlug] — Level-2 super-category page.
 *
 * Phase 4.3 replaces the Phase 3A skeleton with the full design per file 45 §4 Level 2.
 * Renders:
 *  - Breadcrumb with module-picker dropdown scoped to the super-category
 *  - Optional ElectionPeriodNotice (governance only, env-flag-driven)
 *  - SuperCategoryHero (compact, with up to 3 KPI tiles)
 *  - Two-column layout: SubGroupedLeftRail + ModulePreviewCard grid
 *  - "N modules activating soon" CTA at the bottom
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getSuperCategoryBySlug,
  getModulesForSuperCategory,
} from "@/lib/india/india-super-categories";
import { INDIA_MODULES } from "@/lib/india/india-modules";
import { ModuleDropdown } from "@/components/india/primitives/ModuleDropdown";
import { ModulePreviewCard } from "@/components/india/primitives/ModulePreviewCard";
import { SuperCategoryHero } from "@/components/india/sections/SuperCategoryHero";
import { SubGroupedLeftRail } from "@/components/india/sections/SubGroupedLeftRail";
import { ElectionPeriodNotice } from "@/components/india/sections/ElectionPeriodNotice";

interface PageProps {
  params: Promise<{
    locale: string;
    superCategorySlug: string;
  }>;
}

export default async function IndiaSuperCategoryPage({ params }: PageProps) {
  const { locale, superCategorySlug } = await params;

  const superCategory = getSuperCategoryBySlug(superCategorySlug);
  if (!superCategory) {
    notFound();
  }

  const modules = getModulesForSuperCategory(superCategorySlug, INDIA_MODULES);
  const plannedCount = modules.filter(
    (m) => m.status === "planned" || m.status === "coming_soon",
  ).length;

  return (
    <main
      style={{
        background: "var(--color-background)",
        minHeight: "100vh",
        padding: "1.25rem 1rem 3rem",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "var(--color-text-tertiary)",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link href={`/${locale}`} style={{ color: "var(--color-text-tertiary)" }}>
            Home
          </Link>
          <span>›</span>
          <Link href={`/${locale}/india`} style={{ color: "var(--color-text-tertiary)" }}>
            India
          </Link>
          <span>›</span>
          <span style={{ color: "var(--color-text-secondary)" }}>{superCategory.title}</span>
          <span>›</span>
          <ModuleDropdown
            currentLabel="Select module"
            scope="super-category"
            superCategorySlug={superCategorySlug}
            locale={locale}
          />
        </nav>

        {superCategorySlug === "governance" && <ElectionPeriodNotice />}

        <SuperCategoryHero superCategory={superCategory} />

        <div
          className="super-cat-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <SubGroupedLeftRail
            superCategorySlug={superCategorySlug}
            modules={modules}
            accentColor={superCategory.accentColor}
            locale={locale}
          />

          <div>
            <div
              className="super-cat-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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

            {plannedCount > 0 && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "14px 16px",
                  background: "var(--color-background-secondary)",
                  borderRadius: "var(--border-radius-lg)",
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                }}
              >
                <strong style={{ color: "var(--color-text-primary)" }}>
                  {plannedCount} modules activating soon.
                </strong>{" "}
                Vote up the ones you&apos;d like to see first — feedback drives our data-sync roadmap.
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .super-cat-layout {
              grid-template-columns: 1fr !important;
            }
            .super-cat-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
