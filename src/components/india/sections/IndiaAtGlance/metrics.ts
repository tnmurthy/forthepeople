/**
 * Metric KEY registry for the macro-snapshot "India at a Glance" band.
 *
 * Holds nothing but identifiers — the (moduleSlug, metricKey) pairs that
 * tell the data fetcher which IndiaIndicator rows to load and tell each
 * presentational component which row to read. Numeric values, source
 * names, dates, and growth percentages are all pulled from the database
 * by the fetcher; this file is configuration, not data.
 *
 * Adding a primary card or secondary pill = adding one entry here. The
 * components iterate these arrays.
 */

export type MetricRef = {
  moduleSlug: string;
  metricKey: string;
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

export type MetricDisplay = MetricRef & {
  label: string;
  format: MetricFormat;
  /** Emerald accent (used for the growth card). */
  green?: boolean;
  /**
   * For combined displays like "28 + 8 UTs" — the secondary metric whose
   * value is folded into the same card as the primary.
   */
  companion?: MetricRef;
};

// ── Headline + growth (hero row) ──
export const MACRO_HEADLINE: MetricRef = {
  moduleSlug: "demographics-population",
  metricKey: "population_total",
};

export const MACRO_GROWTH: MetricRef = {
  moduleSlug: "demographics-population",
  metricKey: "population_growth_yoy",
};

// ── Primary stat cards (4) ──
export const MACRO_PRIMARY: MetricDisplay[] = [
  {
    moduleSlug: "economy-gdp",
    metricKey: "gdp_nominal_usd_trillion",
    label: "nominal GDP",
    format: "trillion_usd",
  },
  {
    moduleSlug: "economy-gdp",
    metricKey: "gdp_growth_yoy",
    label: "growth",
    format: "percent",
    green: true,
  },
  {
    moduleSlug: "economy-gdp",
    metricKey: "gdp_per_capita_inr",
    label: "per capita",
    format: "lakh_inr",
  },
  {
    moduleSlug: "economy-inflation",
    metricKey: "cpi_inflation",
    label: "inflation",
    format: "percent",
  },
];

// ── Secondary pills (3) ──
export const MACRO_SECONDARY: MetricDisplay[] = [
  {
    moduleSlug: "national-snapshot",
    metricKey: "states_count",
    label: "states",
    format: "states_uts",
    companion: { moduleSlug: "national-snapshot", metricKey: "uts_count" },
  },
  {
    moduleSlug: "national-snapshot",
    metricKey: "scheduled_languages",
    label: "languages",
    format: "scheduled",
  },
  {
    moduleSlug: "economy-employment",
    metricKey: "workforce_size",
    label: "workforce",
    format: "millions_workforce",
  },
];

// ── Editorial copy (structural strings, not data) ──
export const MACRO_MASTHEAD_LABEL =
  "at a glance · india's macroeconomic snapshot";
export const MACRO_HEADLINE_TAGLINE = "the world's most populous nation";

// ── Helpers ──
export function indicatorKey(ref: MetricRef): string {
  return `${ref.moduleSlug}::${ref.metricKey}`;
}
