/**
 * Single source of truth mapping super-category slug → Lucide icon
 * component for the identity-zone watermark.
 *
 * The same map drives the section dropdown rows and the section
 * dividers, so one rename here cascades everywhere.
 *
 * Icons mirror the existing `watermarkIcon` field on the
 * IndiaSuperCategoryDef registry (see india-super-categories.ts) so
 * the dropdown and the watermark always agree.
 */

import {
  Building,
  BookOpenText,
  Globe2,
  PawPrint,
  Pickaxe,
  Rocket,
  Scale,
  Theater,
  TrendingUp,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export const SECTION_WATERMARK_ICONS: Record<string, LucideIcon> = {
  "macro-snapshot": TrendingUp,
  "know-india": BookOpenText,
  "living-standards": Globe2,
  "wildlife-forests": PawPrint,
  "agriculture-livestock": Wheat,
  "natural-resources-energy": Pickaxe,
  infrastructure: Building,
  governance: Scale,
  innovation: Rocket,
  culture: Theater,
};
