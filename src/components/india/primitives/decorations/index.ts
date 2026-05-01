/**
 * Per-super-category decoration registry.
 *
 * File 48 §Section 2.3 GAP 4. Each super-category band can opt into a
 * thematic decoration (branch borders, ogee arches, motifs, etc.) by
 * registering a component here keyed on the super-category slug. Bands
 * without a registered decoration render plain.
 *
 * Section 3 (later) will add the remaining 9 super-category decorations.
 */

import * as React from "react";
import { WildlifeForestsDecoration } from "./WildlifeForestsDecoration";

export const BAND_DECORATIONS: Record<string, React.FC | undefined> = {
  "wildlife-forests": WildlifeForestsDecoration,
  // others added in Section 3:
  // "macro-snapshot":          MacroSnapshotDecoration,
  // "know-india":              KnowIndiaDecoration,
  // "living-standards":        LivingStandardsDecoration,
  // "agriculture-livestock":   AgricultureLivestockDecoration,
  // "natural-resources-energy": NaturalResourcesDecoration,
  // "infrastructure":          InfrastructureDecoration,
  // "governance":              GovernanceDecoration,
  // "innovation":              InnovationDecoration,
  // "culture":                 CultureDecoration,
};

export function getBandDecoration(slug: string): React.FC | undefined {
  return BAND_DECORATIONS[slug];
}
