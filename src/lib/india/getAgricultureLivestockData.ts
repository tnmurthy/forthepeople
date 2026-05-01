/**
 * Server-side data loader for the agriculture-livestock band (Section 05).
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allAgricultureLivestockRefs,
  indicatorKey,
} from "@/components/india/sections/AgricultureLivestock/metrics";

const AL_SLUG = "agriculture-livestock";

export type AgricultureLivestockIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type AgricultureLivestockModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type AgricultureLivestockData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: AgricultureLivestockModuleRef[];
  moduleBySlug: Record<string, AgricultureLivestockModuleRef>;
  totalCount: number;
  liveCount: number;
  comingSoonCount: number;
  indicatorByKey: Record<string, AgricultureLivestockIndicator>;
  totalSuperCategories: number;
};

export async function getAgricultureLivestockData(): Promise<AgricultureLivestockData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === AL_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${AL_SLUG}' not found in registry`);
  }

  const alModules = INDIA_MODULES.filter((m) => m.superCategory === AL_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allAgricultureLivestockRefs();

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

  const indicatorByKey: Record<string, AgricultureLivestockIndicator> = {};
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

  const modules: AgricultureLivestockModuleRef[] = alModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, AgricultureLivestockModuleRef> = Object.fromEntries(
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
