/**
 * Single source of truth for super-category accent colors.
 *
 * One palette-locked hex per slug. Used by:
 *   - the module dropdown rows (numeric + dot + name)
 *   - the section dividers (Lucide icon + gradient line color)
 *   - the scroll progress bar (per-segment fill)
 *   - the right-column card borders inside each shipped section
 *
 * Anything in *.tsx that needs a section accent color MUST import
 * from this file — never inline a literal hex.
 */

export const SECTION_ACCENT_COLORS: Record<string, string> = {
  "macro-snapshot": "#0C447C",
  "know-india": "#2E2A6D",
  "living-standards": "#0F6E56",
  "wildlife-forests": "#3B6D11",
  "agriculture-livestock": "#B58A1E",
  "natural-resources-energy": "#1F5C5C",
  infrastructure: "#5F5E5A",
  governance: "#3C3489",
  innovation: "#993C1D",
  culture: "#993556",
};

/**
 * Lighter parallel palette for the SectionProgressBar.
 *
 * Each value is a mid-tone between the deep accent (above) and white,
 * giving the 4-pixel scroll bar a sky/honey/sage feel rather than the
 * heavier deep-color treatment used inside section bands. Used ONLY by
 * SectionProgressBar — section bands and dividers continue to use the
 * deep accents from SECTION_ACCENT_COLORS.
 */
export const SECTION_ACCENT_LIGHT_COLORS: Record<string, string> = {
  "macro-snapshot": "#5278A8",
  "know-india": "#7570B0",
  "living-standards": "#5BAC95",
  "wildlife-forests": "#86A85B",
  "agriculture-livestock": "#D9B25A",
  "natural-resources-energy": "#5C9696",
  infrastructure: "#9E9C95",
  governance: "#7670B5",
  innovation: "#C77858",
  culture: "#C97089",
};

/** Convenience: ordered slug list mirroring INDIA_SUPER_CATEGORIES displayOrder. */
export const SECTION_SLUGS_IN_ORDER: ReadonlyArray<string> = [
  "macro-snapshot",
  "know-india",
  "living-standards",
  "wildlife-forests",
  "agriculture-livestock",
  "natural-resources-energy",
  "infrastructure",
  "governance",
  "innovation",
  "culture",
];
