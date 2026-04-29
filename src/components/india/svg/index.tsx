/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Category-level SVG illustration map. ModuleHero looks up the right
 * SVG by IndiaModuleCategory key. Phase 2.5d landed 18 bespoke
 * line-art illustrations (one per category) — see ./Svg<Name>.tsx.
 *
 * Design rules (file 31 §4 + Phase 2.5d):
 *   - 240×240 viewBox, single-color line art with one accent fill
 *     (8% opacity tint of the same accent).
 *   - NO Indian flag, NO Ashoka emblem, NO ministry / govt logos,
 *     NO copyrighted character art.
 *   - Stroke = CATEGORY_ACCENT[category] (passed via the SvgProps
 *     `accent` prop).
 *
 * Adding a new category = add a new SvgFoo.tsx and one entry below.
 */

import type { ComponentType } from "react";
import type { IndiaModuleCategory } from "@/lib/india/india-modules";
import type { SvgProps } from "./SvgBase";
import SvgSnapshot from "./SvgSnapshot";
import SvgDemographics from "./SvgDemographics";
import SvgEconomy from "./SvgEconomy";
import SvgBudget from "./SvgBudget";
import SvgAgriculture from "./SvgAgriculture";
import SvgLivestock from "./SvgLivestock";
import SvgWildlife from "./SvgWildlife";
import SvgInfrastructure from "./SvgInfrastructure";
import SvgEnergy from "./SvgEnergy";
import SvgHealth from "./SvgHealth";
import SvgEducation from "./SvgEducation";
import SvgDefence from "./SvgDefence";
import SvgJustice from "./SvgJustice";
import SvgElections from "./SvgElections";
import SvgScience from "./SvgScience";
import SvgTrade from "./SvgTrade";
import SvgTourism from "./SvgTourism";
import SvgSports from "./SvgSports";

export const CATEGORY_SVG: Record<IndiaModuleCategory, ComponentType<SvgProps>> = {
  snapshot: SvgSnapshot,
  demographics: SvgDemographics,
  economy: SvgEconomy,
  budget: SvgBudget,
  agriculture: SvgAgriculture,
  livestock: SvgLivestock,
  wildlife: SvgWildlife,
  infrastructure: SvgInfrastructure,
  energy: SvgEnergy,
  health: SvgHealth,
  education: SvgEducation,
  defence: SvgDefence,
  justice: SvgJustice,
  elections: SvgElections,
  science: SvgScience,
  trade: SvgTrade,
  tourism: SvgTourism,
  sports: SvgSports,
  // No bespoke SVG yet for "custom" — fall back to Snapshot's India outline.
  // (No module currently uses category="custom" so this never renders.)
  custom: SvgSnapshot,
};

interface CategorySvgProps {
  category: IndiaModuleCategory;
  accent: string;
  size?: number;
  className?: string;
}

export function CategorySvg({ category, accent, size = 208, className }: CategorySvgProps) {
  const Svg = CATEGORY_SVG[category] ?? SvgSnapshot;
  return <Svg accent={accent} size={size} className={className} />;
}
