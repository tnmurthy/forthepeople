/**
 * Server-side data loader for the culture band (Section 10).
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allCultureRefs,
  indicatorKey,
} from "@/components/india/sections/Culture/metrics";

const CUL_SLUG = "culture";

export type CultureIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type CultureModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type CultureData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: CultureModuleRef[];
  moduleBySlug: Record<string, CultureModuleRef>;
  totalCount: number;
  liveCount: number;
  comingSoonCount: number;
  indicatorByKey: Record<string, CultureIndicator>;
  totalSuperCategories: number;
};

export async function getCultureData(): Promise<CultureData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === CUL_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${CUL_SLUG}' not found in registry`);
  }

  const culModules = INDIA_MODULES.filter((m) => m.superCategory === CUL_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allCultureRefs();

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

  const indicatorByKey: Record<string, CultureIndicator> = {};
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

  const modules: CultureModuleRef[] = culModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, CultureModuleRef> = Object.fromEntries(
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
