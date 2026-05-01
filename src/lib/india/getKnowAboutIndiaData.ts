/**
 * Server-side data loader for the know-india "Know About India" v6 band.
 *
 * SuperCategory + Module data come from the TypeScript registries
 * (single source of truth for editorial structure). Numeric values
 * come from IndiaIndicator (Prisma). Editorial constants (Constitution
 * drafting milestones, notable Article labels) live in metrics.ts.
 *
 * NEVER invents a value. If a row is missing, the indicator is
 * omitted from the lookup map and the corresponding component
 * renders an em-dash or a "Planned" pill.
 */

import { prisma } from "@/lib/db";
import { INDIA_SUPER_CATEGORIES } from "./india-super-categories";
import { INDIA_MODULES, type IndiaModuleDef } from "./india-modules";
import {
  allKnowRefs,
  indicatorKey,
} from "@/components/india/sections/KnowAboutIndia/metrics";

const KNOW_SLUG = "know-india";

export type KnowIndicator = {
  moduleSlug: string;
  metricKey: string;
  value: number;
  unit: string;
  source: string | null;
  sourceUrl: string | null;
  asOfDate: Date;
};

export type KnowModuleRef = {
  slug: string;
  title: string;
  status: IndiaModuleDef["status"];
  displayOrder: number;
};

export type KnowAboutIndiaData = {
  superCategory: (typeof INDIA_SUPER_CATEGORIES)[number];
  modules: KnowModuleRef[];
  moduleBySlug: Record<string, KnowModuleRef>;
  /** Modules in any state (live, planned, beta, coming_soon) — total roster size. */
  totalCount: number;
  /** Modules currently 'live' — drives the green-dot "X of Y live" copy. */
  liveCount: number;
  /** Modules currently 'planned' — drives the amber "all planned" status. */
  plannedCount: number;
  indicatorByKey: Record<string, KnowIndicator>;
  totalSuperCategories: number;
};

export async function getKnowAboutIndiaData(): Promise<KnowAboutIndiaData> {
  const superCategory = INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === KNOW_SLUG);
  if (!superCategory) {
    throw new Error(`Super-category '${KNOW_SLUG}' not found in registry`);
  }

  const knowModules = INDIA_MODULES.filter((m) => m.superCategory === KNOW_SLUG).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const wantedRefs = allKnowRefs();

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

  const indicatorByKey: Record<string, KnowIndicator> = {};
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

  const modules: KnowModuleRef[] = knowModules.map((m) => ({
    slug: m.slug,
    title: m.title,
    status: m.status,
    displayOrder: m.displayOrder,
  }));

  const moduleBySlug: Record<string, KnowModuleRef> = Object.fromEntries(
    modules.map((m) => [m.slug, m]),
  );

  const liveCount = modules.filter((m) => m.status === "live").length;
  const plannedCount = modules.filter((m) => m.status === "planned").length;

  return {
    superCategory,
    modules,
    moduleBySlug,
    totalCount: modules.length,
    liveCount,
    plannedCount,
    indicatorByKey,
    totalSuperCategories: INDIA_SUPER_CATEGORIES.length,
  };
}
