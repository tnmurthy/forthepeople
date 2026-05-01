"use client";

/**
 * IndiaBreadcrumb — sticky breadcrumb row above the hero.
 *
 * File 48 §4.7.1 + Section 1 (functional dropdown) + Section 2 (sticky + inline pill).
 *
 * Layout: [🏠 Home] › [📍 India] › [Select module ▾]   (all inline, no auto margin)
 *
 * Position: sticky at top:56px (right under the global header which is sticky at
 * top:0 with height 56). The page-level scroll-progress bar lives directly below
 * this breadcrumb (sticky at top:100px, z-index one less than the breadcrumb).
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
        top: "56px",
        zIndex: 40,
        background: "var(--color-background)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        color: "var(--color-text-tertiary)",
        padding: "12px 16px",
      }}
    >
      <Link
        href={`/${locale}`}
        style={{
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <Home size={13} />
        {t.home}
      </Link>

      <ChevronRight size={13} style={{ opacity: 0.4 }} />

      <span
        style={{
          color: "var(--color-text-primary)",
          fontWeight: 500,
          fontSize: "15px",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <MapPin size={13} style={{ opacity: 0.7 }} />
        {t.india}
      </span>

      <ChevronRight size={13} style={{ opacity: 0.4 }} />

      <ModuleSelectorDropdown
        locale={locale}
        superCategorySlug={superCategorySlug}
        triggerLabel={t.selectModule}
      />
    </nav>
  );
}

export default IndiaBreadcrumb;
