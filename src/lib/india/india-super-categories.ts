import type { IndiaModuleDef } from "./india-modules";
import type { IndiaAccentColorKey } from "./design-tokens";

/**
 * India Super-Category Registry
 *
 * The 10 super-categories that organize the India Dashboard.
 * Display order, headline KPIs, and accent colors locked in file 40 + file 45.
 *
 * Last locked: 30 Apr 2026 (10 super-categories — Land & Resources split into 3)
 */

export interface IndiaSuperCategoryDef {
  slug: string;                          // kebab-case
  title: string;                         // English fallback
  titleKey: string;                      // i18n key
  icon: string;                          // emoji (Phase 1) or lucide name (Phase 4+)
  accentColor: IndiaAccentColorKey;      // key from IndiaSuperCategoryAccents
  tagline: string;                       // English fallback
  taglineKey: string;
  displayOrder: number;
  headlineMetric: {
    moduleSlug: string;
    metricKey: string;
  } | null;                              // null = editorial super-category
  description?: string;
  descriptionKey?: string;
}

export const INDIA_SUPER_CATEGORIES: IndiaSuperCategoryDef[] = [
  {
    slug: "macro-snapshot",
    title: "India at a Glance",
    titleKey: "india.superCategory.macroSnapshot.title",
    icon: "📊",
    accentColor: "blue",
    tagline:
      "How big India is, how fast it's growing, and how its 1.43 billion people earn and live.",
    taglineKey: "india.superCategory.macroSnapshot.tagline",
    displayOrder: 1,
    headlineMetric: { moduleSlug: "economy-gdp", metricKey: "gdp_growth_yoy" },
  },
  {
    slug: "know-india",
    title: "Know About India",
    titleKey: "india.superCategory.knowIndia.title",
    icon: "📖",
    accentColor: "indigo",
    tagline:
      "NCERT-aligned foundations: history, geography, polity, economy. How India works, explained.",
    taglineKey: "india.superCategory.knowIndia.tagline",
    displayOrder: 2,
    headlineMetric: null,
  },
  {
    slug: "living-standards",
    title: "Living Standards",
    titleKey: "india.superCategory.livingStandards.title",
    icon: "🌐",
    accentColor: "teal",
    tagline:
      "Health, education, water, food, housing — what daily life looks like across states.",
    taglineKey: "india.superCategory.livingStandards.tagline",
    displayOrder: 3,
    headlineMetric: { moduleSlug: "health-overview", metricKey: "life_expectancy_at_birth" },
  },
  {
    slug: "wildlife-forests",
    title: "Wildlife & Forests",
    titleKey: "india.superCategory.wildlifeForests.title",
    icon: "🐯",
    accentColor: "forest-green",
    tagline:
      "Tigers, forests, protected areas — what India safeguards in the wild.",
    taglineKey: "india.superCategory.wildlifeForests.tagline",
    displayOrder: 4,
    headlineMetric: { moduleSlug: "wildlife-forests", metricKey: "forest_cover_pct" },
  },
  {
    slug: "agriculture-livestock",
    title: "Agriculture & Livestock",
    titleKey: "india.superCategory.agricultureLivestock.title",
    icon: "🌾",
    accentColor: "wheat",
    tagline:
      "What India grows and raises — crops, livestock, and the lives of farmers.",
    taglineKey: "india.superCategory.agricultureLivestock.tagline",
    displayOrder: 5,
    headlineMetric: { moduleSlug: "agriculture-production", metricKey: "foodgrain_total" },
  },
  {
    slug: "natural-resources-energy",
    title: "Natural Resources & Energy",
    titleKey: "india.superCategory.naturalResourcesEnergy.title",
    icon: "⛏",
    accentColor: "slate",
    tagline:
      "Fuels, minerals, water — what powers India and what we draw from the earth.",
    taglineKey: "india.superCategory.naturalResourcesEnergy.tagline",
    displayOrder: 6,
    headlineMetric: { moduleSlug: "energy-fuels", metricKey: "crude_oil_domestic_mt" },
  },
  {
    slug: "infrastructure",
    title: "Infrastructure",
    titleKey: "india.superCategory.infrastructure.title",
    icon: "🏗",
    accentColor: "amber",
    tagline:
      "Roads, rail, aviation, ports, telecom, smart cities — the country's backbone.",
    taglineKey: "india.superCategory.infrastructure.tagline",
    displayOrder: 7,
    headlineMetric: { moduleSlug: "infra-roads", metricKey: "nh_total_length_km" },
  },
  {
    slug: "governance",
    title: "Governance & Justice",
    titleKey: "india.superCategory.governance.title",
    icon: "⚖️",
    accentColor: "purple",
    tagline:
      "Defence, police, courts, prisons, elections — the institutions that hold India together.",
    taglineKey: "india.superCategory.governance.tagline",
    displayOrder: 8,
    headlineMetric: { moduleSlug: "justice-pendency", metricKey: "total_pendency_district_hc" },
  },
  {
    slug: "innovation",
    title: "Innovation & Industry",
    titleKey: "india.superCategory.innovation.title",
    icon: "🚀",
    accentColor: "coral",
    tagline:
      "Space, science, startups, digital, foreign trade — where India is going next.",
    taglineKey: "india.superCategory.innovation.tagline",
    displayOrder: 9,
    headlineMetric: { moduleSlug: "science-startups", metricKey: "active_unicorns_count" },
  },
  {
    slug: "culture",
    title: "Culture & Heritage",
    titleKey: "india.superCategory.culture.title",
    icon: "🎭",
    accentColor: "pink",
    tagline:
      "Tourism, monuments, sports, GI tags — what makes India distinctly Indian.",
    taglineKey: "india.superCategory.culture.tagline",
    displayOrder: 10,
    headlineMetric: { moduleSlug: "tourism-heritage", metricKey: "unesco_world_heritage_sites_count" },
  },
];

// ──────────────────────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────────────────────

export function getSuperCategoryBySlug(slug: string): IndiaSuperCategoryDef | undefined {
  return INDIA_SUPER_CATEGORIES.find((sc) => sc.slug === slug);
}

export function getOrderedSuperCategories(): IndiaSuperCategoryDef[] {
  return [...INDIA_SUPER_CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Returns all modules belonging to a super-category, ordered by displayOrder.
 */
export function getModulesForSuperCategory(
  superCategorySlug: string,
  modules: IndiaModuleDef[],
): IndiaModuleDef[] {
  return modules
    .filter((m) => m.superCategory === superCategorySlug)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Group modules within a super-category by their subGroup field.
 * Returns Map of subGroup label → module list, ordered.
 * Modules without subGroup go under key 'UNGROUPED'.
 */
export function getModulesGroupedBySubGroup(
  superCategorySlug: string,
  modules: IndiaModuleDef[],
): Map<string, IndiaModuleDef[]> {
  const filtered = getModulesForSuperCategory(superCategorySlug, modules);
  const groups = new Map<string, IndiaModuleDef[]>();
  for (const mod of filtered) {
    const key = mod.subGroup || "UNGROUPED";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(mod);
  }
  return groups;
}
