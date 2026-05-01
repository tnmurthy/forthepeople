/**
 * Server-side data loader for the living-standards "Living Standards"
 * v1 band (Section 03).
 *
 * Mirrors the know-india fetcher pattern: super-category + modules
 * from the TypeScript registries, numeric values from IndiaIndicator.
 * Editorial constants (state names, label strings) live in metrics.ts.
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allLivingStandardsRefs,
  indicatorKey,
} from "@/components/india/sections/LivingStandards/metrics";

const LS_SLUG = "living-standards";

export type LivingStandardsIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type LivingStandardsModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type LivingStandardsData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: LivingStandardsModuleRef[];
  moduleBySlug: Record<string, LivingStandardsModuleRef>;
  totalCount: number;
  liveCount: number;
  comingSoonCount: number;
  indicatorByKey: Record<string, LivingStandardsIndicator>;
  totalSuperCategories: number;
};

export async function getLivingStandardsData(): Promise<LivingStandardsData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === LS_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${LS_SLUG}' not found in registry`);
  }

  const lsModules = INDIA_MODULES.filter((m) => m.superCategory === LS_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allLivingStandardsRefs();

  const rows =
    wantedRefs.length === 0
      ? []
      : await prisma.indiaIndicator.findMany({
          where: {
            OR: wantedRefs.map((r) => ({
              moduleSlug: r.moduleSlug,
              metricKey: r.metricKey,
            })),
          },
          orderBy: { asOfDate: "desc" },
        });

  const indicatorByKey: Record<string, LivingStandardsIndicator> = {};
  for (const r of rows) {
    const key = indicatorKey({ moduleSlug: r.moduleSlug, metricKey: r.metricKey });
    if (indicatorByKey[key]) continue;
    if (r.numericValue == null) continue;
    indicatorByKey[key] = {
      moduleSlug: r.moduleSlug,
      metricKey: r.metricKey,
      value: Number(r.numericValue),
      unit: r.unit ?? "",
      source: r.source ?? null,
      sourceUrl: r.sourceUrl ?? null,
      asOfDate: r.asOfDate,
    };
  }

  const modules: LivingStandardsModuleRef[] = lsModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, LivingStandardsModuleRef> = Object.fromEntries(
    modules.map((m) => [m.slug, m]),
  );

  const liveCount = modules.filter((m) => m.status === "live").length;
  const comingSoonCount = modules.filter((m) => m.status === "coming_soon").length;

  return {
    superCategory,
    modules,
    moduleBySlug,
    totalCount: modules.length,
    liveCount,
    comingSoonCount,
    indicatorByKey,
    totalSuperCategories: INDIA_SUPER_CATEGORIES.length,
  };
}
