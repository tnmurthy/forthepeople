/**
 * Server-side data loader for the natural-resources-energy band
 * (Section 06).
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allNaturalResourcesEnergyRefs,
  indicatorKey,
} from "@/components/india/sections/NaturalResourcesEnergy/metrics";

const NRE_SLUG = "natural-resources-energy";

export type NaturalResourcesEnergyIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type NaturalResourcesEnergyModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type NaturalResourcesEnergyData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: NaturalResourcesEnergyModuleRef[];
  moduleBySlug: Record<string, NaturalResourcesEnergyModuleRef>;
  totalCount: number;
  liveCount: number;
  comingSoonCount: number;
  indicatorByKey: Record<string, NaturalResourcesEnergyIndicator>;
  totalSuperCategories: number;
};

export async function getNaturalResourcesEnergyData(): Promise<NaturalResourcesEnergyData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === NRE_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${NRE_SLUG}' not found in registry`);
  }

  const nreModules = INDIA_MODULES.filter((m) => m.superCategory === NRE_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allNaturalResourcesEnergyRefs();

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

  const indicatorByKey: Record<string, NaturalResourcesEnergyIndicator> = {};
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

  const modules: NaturalResourcesEnergyModuleRef[] = nreModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, NaturalResourcesEnergyModuleRef> = Object.fromEntries(
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
