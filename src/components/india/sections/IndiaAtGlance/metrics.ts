/**
 * Metric KEY registry for the macro-snapshot "India at a Glance" v4 band.
 *
 * Holds nothing but identifiers — the (moduleSlug, metricKey) pairs that
 * tell the data fetcher which IndiaIndicator rows to load and tell each
 * presentational slot which row to read. Numeric values, source names,
 * dates, and growth percentages all come from Prisma; this file is
 * configuration, not data.
 */

export type MetricRef = {
  moduleSlug: string;
  metricKey: string;
  /** For combined displays like "28 + 8" — secondary value folded in. */
  companion?: MetricRef;
};

export type MetricFormat =
  | "billion_people"
  | "trillion_usd"
  | "percent"
  | "lakh_inr"
  | "count"
  | "scheduled"
  | "millions_workforce"
  | "states_uts";

export type MetricSlot = {
  ref: MetricRef;
  label: string;
  format: MetricFormat;
};

// ── Headline + growth (middle column hero) ──
export const MACRO_HEADLINE: MetricRef = {
  moduleSlug: "demographics-population",
  metricKey: "population_total",
};

export const MACRO_GROWTH: MetricRef = {
  moduleSlug: "demographics-population",
  metricKey: "population_growth_yoy",
};

// ── 2x2 grid below the headline (3 metric cells + 1 source cell) ──
export const MACRO_FEATURED_GRID: MetricSlot[] = [
  {
    ref: { moduleSlug: "economy-gdp", metricKey: "gdp_per_capita_inr" },
    label: "per capita",
    format: "lakh_inr",
  },
  {
    ref: { moduleSlug: "economy-employment", metricKey: "workforce_size" },
    label: "workforce",
    format: "millions_workforce",
  },
  {
    ref: {
      moduleSlug: "national-snapshot",
      metricKey: "states_count",
      companion: { moduleSlug: "national-snapshot", metricKey: "uts_count" },
    },
    label: "states · UTs",
    format: "states_uts",
  },
  // 4th cell ("source") is derived from headline.source — no metric ref.
];

// ── Right-column stack (two cards, each links to its module page) ──
export type RightStackEntry = {
  moduleSlug: string;
  ref: MetricRef;
  label: string;
  emoji: string;
  format: MetricFormat;
};

export const MACRO_RIGHT_STACK: RightStackEntry[] = [
  {
    moduleSlug: "economy-gdp",
    ref: { moduleSlug: "economy-gdp", metricKey: "gdp_nominal_usd_trillion" },
    label: "Economy & GDP",
    emoji: "📈",
    format: "trillion_usd",
  },
  {
    moduleSlug: "economy-inflation",
    ref: { moduleSlug: "economy-inflation", metricKey: "cpi_inflation" },
    label: "Inflation & Prices",
    emoji: "🛒",
    format: "percent",
  },
];

// ── Identity-zone stats rows (left column) ──
export type IdentityStat = {
  ref: MetricRef;
  label: string;
  format: MetricFormat;
  greenIfPositive?: boolean;
};

export const MACRO_IDENTITY_STATS: IdentityStat[] = [
  {
    ref: { moduleSlug: "economy-gdp", metricKey: "gdp_nominal_usd_trillion" },
    label: "Nominal GDP",
    format: "trillion_usd",
  },
  {
    ref: { moduleSlug: "economy-gdp", metricKey: "gdp_growth_yoy" },
    label: "GDP Growth",
    format: "percent",
    greenIfPositive: true,
  },
];

// ── Helpers ──
export function indicatorKey(ref: MetricRef): string {
  return `${ref.moduleSlug}::${ref.metricKey}`;
}

/**
 * Walk every slot in the registry and emit the flat list of refs the
 * fetcher needs to load. Used by getMacroSnapshotData; keeping the walk
 * here means the fetcher never has to know about which slots exist.
 */
export function allMacroRefs(): MetricRef[] {
  const refs: MetricRef[] = [MACRO_HEADLINE, MACRO_GROWTH];
  for (const slot of MACRO_FEATURED_GRID) {
    refs.push(slot.ref);
    if (slot.ref.companion) refs.push(slot.ref.companion);
  }
  for (const entry of MACRO_RIGHT_STACK) {
    refs.push(entry.ref);
  }
  for (const stat of MACRO_IDENTITY_STATS) {
    refs.push(stat.ref);
  }
  // De-dupe by composite key.
  const seen = new Set<string>();
  return refs.filter((r) => {
    const k = indicatorKey(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
