"use client";

/**
 * IndiaBreadcrumb — slim breadcrumb row above the hero.
 *
 * File 48 §4.7.1 + Section 1 functional dropdown patch. Renders
 * "🏠 Home › India" with a functional "Select module ▾" dropdown on the
 * right (ModuleSelectorDropdown). Pass `superCategorySlug` to scope the
 * picker to a single super-category (used on /en/india/category/<slug>
 * if that page swaps in this breadcrumb).
 *
 * Strings come from `dict.breadcrumb`; the project's i18n stack uses direct
 * JSON imports rather than next-intl's `useTranslations`, so the dictionary
 * is passed in as a prop from the server route.
 */

import * as React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
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
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        color: "var(--color-text-tertiary)",
        marginBottom: "10px",
        padding: "0 4px",
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
        <Home size={11} />
        {t.home}
      </Link>
      <ChevronRight size={11} style={{ opacity: 0.4 }} />
      <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
        {t.india}
      </span>

      <ModuleSelectorDropdown
        locale={locale}
        superCategorySlug={superCategorySlug}
        triggerLabel={t.selectModule}
      />
    </nav>
  );
}

export default IndiaBreadcrumb;
