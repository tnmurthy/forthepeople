/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Category-level SVG illustration map. ModuleHero looks up the right
 * SVG by IndiaModuleCategory key. Phase 2.5d ships the actual 18 SVGs;
 * Phase 2.5c (this phase) ships an interim Lucide-icon fallback so the
 * module deep-dive pages render now, before Phase 2.5d lands.
 *
 * After Phase 2.5d:
 *   - Replace the Lucide fallback with imports from
 *     ./SvgSnapshot, ./SvgEconomy, etc.
 *   - The CategorySvg component below stays — only its internals change.
 */

import type { ComponentType } from "react";
import {
  Cog,
  Banknote,
  Building2,
  Wheat,
  PawPrint,
  Bird,
  Bus,
  Sun,
  Stethoscope,
  GraduationCap,
  Shield,
  Scale,
  Vote,
  Rocket,
  Globe2,
  Map,
  Trophy,
  Users,
} from "lucide-react";
import type { IndiaModuleCategory } from "@/lib/india/india-modules";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Phase 2.5c interim — Lucide icons keyed by category. Phase 2.5d
// swaps these with bespoke SVGs (same component signature).
const CATEGORY_LUCIDE: Record<IndiaModuleCategory, ComponentType<IconProps>> = {
  snapshot: Globe2,
  demographics: Users,
  economy: Banknote,
  budget: Building2,
  agriculture: Wheat,
  livestock: PawPrint,
  wildlife: Bird,
  infrastructure: Bus,
  energy: Sun,
  health: Stethoscope,
  education: GraduationCap,
  defence: Shield,
  justice: Scale,
  elections: Vote,
  science: Rocket,
  trade: Globe2,
  tourism: Map,
  sports: Trophy,
  custom: Cog,
};

interface CategorySvgProps {
  category: IndiaModuleCategory;
  accent: string;
  size?: number;
}

export function CategorySvg({ category, accent, size = 208 }: CategorySvgProps) {
  const Icon = CATEGORY_LUCIDE[category] ?? Cog;
  // Phase 2.5d will replace this with the bespoke SVG components.
  // Until then we render the Lucide icon at scale, with a TODO_SVG
  // data attribute so a grep can find every site to swap.
  return (
    <div
      data-todo-svg={category}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={Math.round(size * 0.6)} color={accent} strokeWidth={1.6} />
    </div>
  );
}
