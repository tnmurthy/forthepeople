/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  MOCK DATA — replace in Session C1                       ║
 * ║                                                           ║
 * ║  Every value below is hand-fabricated for visual layout   ║
 * ║  testing only. The numbers are deliberately rounded so    ║
 * ║  they read as PLACEHOLDERS, not as cited statistics.      ║
 * ║                                                           ║
 * ║  When real values land, swap STATE_METRIC_VALUES rows     ║
 * ║  with IndiaStateBreakdown queries and delete the          ║
 * ║  __MOCK__ banner at the bottom.                           ║
 * ╚═══════════════════════════════════════════════════════════╝
 *
 * grep this file via:  rg "MOCK DATA — replace in Session C1"
 */

import { CATEGORY_ACCENT } from "./india-design";
import type { IndiaModuleCategory } from "./india-modules";

export const __MOCK__ = "MOCK DATA — replace in Session C1" as const;

export interface MockMetric {
  key: string;
  label: string;
  unit: string;
  category: IndiaModuleCategory;
  /** Higher is better when ranked? Drives the leaderboard sort + map polarity. */
  higherIsBetter: boolean;
  description: string;
  /** sourceKey from src/lib/india/india-sources. */
  sourceKey: string;
}

/**
 * 12 headline metrics that the choropleth + tile picker can switch
 * between. Each one maps to a category so the map color uses the
 * right accent hue.
 */
export const MOCK_METRICS: MockMetric[] = [
  {
    key: "population_total",
    label: "Population",
    unit: "cr",
    category: "demographics",
    higherIsBetter: true,
    description: "Estimated population in crores",
    sourceKey: "CENSUS",
  },
  {
    key: "gsdp_inr",
    label: "GSDP",
    unit: "₹ lakh cr",
    category: "economy",
    higherIsBetter: true,
    description: "Gross State Domestic Product (current prices)",
    sourceKey: "MoSPI",
  },
  {
    key: "literacy_pct",
    label: "Literacy",
    unit: "%",
    category: "education",
    higherIsBetter: true,
    description: "Adult literacy rate",
    sourceKey: "AISHE",
  },
  {
    key: "forest_cover_pct",
    label: "Forest Cover",
    unit: "%",
    category: "wildlife",
    higherIsBetter: true,
    description: "Forest cover as share of geographic area",
    sourceKey: "FSI",
  },
  {
    key: "renewable_capacity_mw",
    label: "Renewable Capacity",
    unit: "GW",
    category: "energy",
    higherIsBetter: true,
    description: "Installed renewable energy capacity",
    sourceKey: "MNRE",
  },
  {
    key: "highway_km",
    label: "National Highways",
    unit: "km",
    category: "infrastructure",
    higherIsBetter: true,
    description: "National highway length within the state",
    sourceKey: "MORTH",
  },
  {
    key: "infant_mortality",
    label: "Infant Mortality",
    unit: "per 1k",
    category: "health",
    higherIsBetter: false,
    description: "Infant deaths per 1,000 live births (lower = better)",
    sourceKey: "RCHIIPS_NFHS",
  },
  {
    key: "police_strength_per_lakh",
    label: "Police per lakh",
    unit: "",
    category: "justice",
    higherIsBetter: true,
    description: "Civil police personnel per lakh population",
    sourceKey: "BPRD",
  },
  {
    key: "agri_share_pct",
    label: "Agri Share of GSDP",
    unit: "%",
    category: "agriculture",
    higherIsBetter: true,
    description: "Agriculture & allied share of GSDP",
    sourceKey: "DAFW",
  },
  {
    key: "tourism_arrivals",
    label: "Tourist Arrivals",
    unit: "lakh",
    category: "tourism",
    higherIsBetter: true,
    description: "Annual domestic + foreign tourist arrivals",
    sourceKey: "TOURISM",
  },
  {
    key: "startup_count",
    label: "DPIIT Startups",
    unit: "",
    category: "science",
    higherIsBetter: true,
    description: "DPIIT-recognised startups (cumulative)",
    sourceKey: "STARTUP_INDIA",
  },
  {
    key: "trade_exports_inr",
    label: "Exports",
    unit: "₹ '000 cr",
    category: "trade",
    higherIsBetter: true,
    description: "Annual merchandise exports from the state",
    sourceKey: "COMMERCE",
  },
];

export interface MockState {
  slug: string;
  name: string;
  /** Whether the FTP platform has this state's district pages live. */
  active: boolean;
}

/**
 * 28 states + 8 UTs as recognised by the Republic of India.
 * Slugs match those used by /[locale]/[stateSlug] routes (DrillDownMap).
 */
export const MOCK_STATES: MockState[] = [
  { slug: "andhra-pradesh", name: "Andhra Pradesh", active: false },
  { slug: "arunachal-pradesh", name: "Arunachal Pradesh", active: false },
  { slug: "assam", name: "Assam", active: false },
  { slug: "bihar", name: "Bihar", active: false },
  { slug: "chhattisgarh", name: "Chhattisgarh", active: false },
  { slug: "goa", name: "Goa", active: false },
  { slug: "gujarat", name: "Gujarat", active: false },
  { slug: "haryana", name: "Haryana", active: false },
  { slug: "himachal-pradesh", name: "Himachal Pradesh", active: false },
  { slug: "jharkhand", name: "Jharkhand", active: false },
  { slug: "karnataka", name: "Karnataka", active: true },
  { slug: "kerala", name: "Kerala", active: false },
  { slug: "madhya-pradesh", name: "Madhya Pradesh", active: false },
  { slug: "maharashtra", name: "Maharashtra", active: true },
  { slug: "manipur", name: "Manipur", active: false },
  { slug: "meghalaya", name: "Meghalaya", active: false },
  { slug: "mizoram", name: "Mizoram", active: false },
  { slug: "nagaland", name: "Nagaland", active: false },
  { slug: "odisha", name: "Odisha", active: false },
  { slug: "punjab", name: "Punjab", active: false },
  { slug: "rajasthan", name: "Rajasthan", active: false },
  { slug: "sikkim", name: "Sikkim", active: false },
  { slug: "tamil-nadu", name: "Tamil Nadu", active: true },
  { slug: "telangana", name: "Telangana", active: true },
  { slug: "tripura", name: "Tripura", active: false },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", active: true },
  { slug: "uttarakhand", name: "Uttarakhand", active: false },
  { slug: "west-bengal", name: "West Bengal", active: false },
  // Union Territories
  { slug: "andaman-nicobar", name: "Andaman & Nicobar Islands", active: false },
  { slug: "chandigarh", name: "Chandigarh", active: false },
  { slug: "dadra-nagar-haveli", name: "Dadra & Nagar Haveli and Daman & Diu", active: false },
  { slug: "delhi", name: "Delhi", active: false },
  { slug: "jammu-kashmir", name: "Jammu & Kashmir", active: false },
  { slug: "ladakh", name: "Ladakh", active: false },
  { slug: "lakshadweep", name: "Lakshadweep", active: false },
  { slug: "puducherry", name: "Puducherry", active: false },
];

/**
 * Deterministic plausible value generator. Given a metric + state slug,
 * returns a stable mock number that's roughly in the right ballpark.
 *
 * Uses a tiny string-hash so re-renders show the same numbers without
 * needing a giant lookup table.
 */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) / 0x7fffffff; // 0..1
}

/**
 * The full STATE_METRIC_VALUES grid: every state × every metric.
 * Computed once at module load. ~432 numbers total.
 *
 * Range targets (deliberately rounded so they don't look like real
 * citations):
 *   population_total            : 1 – 24 cr
 *   gsdp_inr                    : 0.5 – 38 lakh cr
 *   literacy_pct                : 60 – 96 %
 *   forest_cover_pct            : 4 – 78 %
 *   renewable_capacity_mw       : 0.1 – 24 GW
 *   highway_km                  : 200 – 12,000 km
 *   infant_mortality            : 5 – 48 per 1k
 *   police_strength_per_lakh    : 80 – 320
 *   agri_share_pct              : 4 – 32 %
 *   tourism_arrivals            : 5 – 220 lakh
 *   startup_count               : 50 – 14,000
 *   trade_exports_inr           : 1 – 380 ('000 cr)
 */
function rangeFor(metricKey: string): [number, number, number] {
  // [min, max, decimals]
  switch (metricKey) {
    case "population_total":          return [1, 24, 1];
    case "gsdp_inr":                  return [0.5, 38, 2];
    case "literacy_pct":              return [60, 96, 1];
    case "forest_cover_pct":          return [4, 78, 1];
    case "renewable_capacity_mw":     return [0.1, 24, 2];
    case "highway_km":                return [200, 12000, 0];
    case "infant_mortality":          return [5, 48, 0];
    case "police_strength_per_lakh":  return [80, 320, 0];
    case "agri_share_pct":            return [4, 32, 1];
    case "tourism_arrivals":          return [5, 220, 0];
    case "startup_count":             return [50, 14000, 0];
    case "trade_exports_inr":         return [1, 380, 0];
    default:                          return [0, 100, 0];
  }
}

export interface StateMetricValue {
  stateSlug: string;
  stateName: string;
  metricKey: string;
  value: number;
}

export const STATE_METRIC_VALUES: StateMetricValue[] = (() => {
  const out: StateMetricValue[] = [];
  for (const m of MOCK_METRICS) {
    const [min, max, decimals] = rangeFor(m.key);
    for (const s of MOCK_STATES) {
      const t = hash(`${s.slug}|${m.key}`);
      const raw = min + (max - min) * t;
      const factor = Math.pow(10, decimals);
      out.push({
        stateSlug: s.slug,
        stateName: s.name,
        metricKey: m.key,
        value: Math.round(raw * factor) / factor,
      });
    }
  }
  return out;
})();

export function getMockMetric(metricKey: string): MockMetric | undefined {
  return MOCK_METRICS.find((m) => m.key === metricKey);
}

export function getStateValuesForMetric(metricKey: string): StateMetricValue[] {
  return STATE_METRIC_VALUES.filter((v) => v.metricKey === metricKey).sort(
    (a, b) => b.value - a.value,
  );
}

export function getCategoryAccentForMetric(metricKey: string): string {
  const metric = getMockMetric(metricKey);
  return metric ? CATEGORY_ACCENT[metric.category] : "#2563EB";
}

/** Map a value in [min, max] to a hex color from light-grey to accent. */
export function mockColorScale(
  value: number,
  metricKey: string,
  min: number,
  max: number,
): string {
  const accent = getCategoryAccentForMetric(metricKey);
  if (max === min) return accent;
  const metric = getMockMetric(metricKey);
  let t = (value - min) / (max - min);
  if (metric && !metric.higherIsBetter) t = 1 - t; // invert for "lower is better" metrics
  t = Math.max(0, Math.min(1, t));
  // Interpolate from #F1F5F9 (very light) → accent
  const start = { r: 0xf1, g: 0xf5, b: 0xf9 };
  const end = parseHex(accent);
  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
