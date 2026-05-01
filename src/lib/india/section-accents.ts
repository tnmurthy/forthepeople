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
