/**
 * Server-side data loader for the infrastructure band (Section 07).
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allInfrastructureRefs,
  indicatorKey,
} from "@/components/india/sections/Infrastructure/metrics";

const INF_SLUG = "infrastructure";

export type InfrastructureIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type InfrastructureModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type InfrastructureData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: InfrastructureModuleRef[];
  moduleBySlug: Record<string, InfrastructureModuleRef>;
  totalCount: number;
  liveCount: number;
  comingSoonCount: number;
  indicatorByKey: Record<string, InfrastructureIndicator>;
  totalSuperCategories: number;
};

export async function getInfrastructureData(): Promise<InfrastructureData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === INF_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${INF_SLUG}' not found in registry`);
  }

  const infModules = INDIA_MODULES.filter((m) => m.superCategory === INF_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allInfrastructureRefs();

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

  const indicatorByKey: Record<string, InfrastructureIndicator> = {};
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

  const modules: InfrastructureModuleRef[] = infModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, InfrastructureModuleRef> = Object.fromEntries(
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
