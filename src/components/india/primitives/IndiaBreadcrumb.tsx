"use client";

/**
 * IndiaBreadcrumb — sticky breadcrumb row above the hero.
 *
 * File 48 §4.7.1 + Section 1 (functional dropdown) + Section 2 (sticky + inline pill).
 *
 * Layout: [🏠 Home] › [📍 India] › [Select module ▾]   (all inline, no auto margin)
 *
 * Position: sticky at top:41px so the breadcrumb butts cleanly against the
 * bottom of the global header (Step 26 fix — was top:56px which left a 15 px
 * transparent strip visible while scrolling). The page-level scroll-progress
 * bar lives directly below this breadcrumb (sticky at top:100px, z-index one
 * less than the breadcrumb).
 */

import * as React from "react";
import Link from "next/link";
import { Home, ChevronRight, MapPin } from "lucide-react";
import { ModuleSelectorDropdown } from "./ModuleSelectorDropdown";

export interface IndiaBreadcrumbDict {
  home: string;
  india: string;
  selectModule: string;
}

export interface IndiaBreadcrumbProps {
  locale: string;
  dict?: IndiaBreadcrumbDict;
  /** When set, the picker scopes to that super-category's modules (flat list). */
  superCategorySlug?: string;
}

const FALLBACK: IndiaBreadcrumbDict = {
  home: "Home",
  india: "India",
  selectModule: "Select module",
};

export function IndiaBreadcrumb({
  locale,
  dict,
  superCategorySlug,
}: IndiaBreadcrumbProps) {
  const t = dict ?? FALLBACK;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        position: "sticky",
        top: "41px",
        zIndex: 40,
        background: "var(--color-background)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "var(--color-text-tertiary)",
        padding: "8px 14px",
      }}
    >
      <Link
        href={`/${locale}`}
        style={{
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Home size={12} />
        {t.home}
      </Link>

      <ChevronRight size={12} style={{ opacity: 0.4 }} />

      <span
        style={{
          color: "var(--color-text-primary)",
          fontWeight: 500,
          fontSize: "13px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <MapPin size={12} style={{ opacity: 0.7 }} />
        {t.india}
      </span>

      <ChevronRight size={12} style={{ opacity: 0.4 }} />

      <ModuleSelectorDropdown
        locale={locale}
        superCategorySlug={superCategorySlug}
        triggerLabel={t.selectModule}
      />
    </nav>
  );
}

export default IndiaBreadcrumb;
