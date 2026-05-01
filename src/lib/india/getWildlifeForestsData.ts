/**
 * Server-side data loader for the wildlife-forests "Wildlife & Forests"
 * v1 band (Section 04).
 *
 * Mirrors the LS / KAI fetcher pattern.
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allWildlifeForestsRefs,
  indicatorKey,
} from "@/components/india/sections/WildlifeForests/metrics";

const WF_SLUG = "wildlife-forests";

export type WildlifeForestsIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type WildlifeForestsModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type WildlifeForestsData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: WildlifeForestsModuleRef[];
  moduleBySlug: Record<string, WildlifeForestsModuleRef>;
  totalCount: number;
  liveCount: number;
  indicatorByKey: Record<string, WildlifeForestsIndicator>;
  totalSuperCategories: number;
};

export async function getWildlifeForestsData(): Promise<WildlifeForestsData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === WF_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${WF_SLUG}' not found in registry`);
  }

  const wfModules = INDIA_MODULES.filter((m) => m.superCategory === WF_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allWildlifeForestsRefs();

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

  const indicatorByKey: Record<string, WildlifeForestsIndicator> = {};
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

  const modules: WildlifeForestsModuleRef[] = wfModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, WildlifeForestsModuleRef> = Object.fromEntries(
    modules.map((m) => [m.slug, m]),
  );

  const liveCount = modules.filter((m) => m.status === "live").length;

  return {
    superCategory,
    modules,
    moduleBySlug,
    totalCount: modules.length,
    liveCount,
    indicatorByKey,
    totalSuperCategories: INDIA_SUPER_CATEGORIES.length,
  };
}
