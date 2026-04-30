/**
 * formatIndiaNumber — centralized number formatter that preserves
 * precision based on magnitude (file 47 §4.6.3).
 *
 * Rules:
 *   |value| < 10    → 2 decimals  (6.22, 9.05)
 *   |value| < 100   → 1 decimal   (78.5, 21.7)
 *   |value| < 1000  → integer     (3,682)
 *   |value| ≥ 1000  → integer with locale-formatted thousands (1,000+, 53,723,481)
 *
 * Pass `decimals` to override the magnitude-based default.
 * `style: 'percent'` → always 1 decimal (21.7%, 5.0%).
 * `style: 'currency-lakh-cr'` → always 2 decimals (₹6.22 lakh cr).
 */

export type FormatStyle = "auto" | "percent" | "currency-lakh-cr" | "integer";

export interface FormatNumberOptions {
  decimals?: number;
  style?: FormatStyle;
  prefix?: string;
  suffix?: string;
  locale?: string;
}

const LOCALE = "en-IN";

function decimalsForMagnitude(abs: number): number {
  if (abs < 10) return 2;
  if (abs < 100) return 1;
  return 0;
}

export function formatIndiaNumber(
  value: number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  const { style = "auto", prefix = "", suffix = "", locale = LOCALE } = options;
  let decimals = options.decimals;

  if (decimals === undefined) {
    if (style === "percent") decimals = 1;
    else if (style === "currency-lakh-cr") decimals = 2;
    else if (style === "integer") decimals = 0;
    else decimals = decimalsForMagnitude(Math.abs(value));
  }

  const formatted = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix}${formatted}${suffix}`;
}
