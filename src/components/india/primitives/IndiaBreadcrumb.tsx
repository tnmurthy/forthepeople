"use client";

/**
 * IndiaBreadcrumb — slim breadcrumb row above the hero.
 *
 * File 48 §4.7.1. Renders "🏠 Home › India" with a disabled "Select module ▾"
 * placeholder pill on the right. The functional module dropdown is Phase 5+.
 *
 * Strings come from `dict.breadcrumb`; the project's i18n stack uses direct
 * JSON imports rather than next-intl's `useTranslations`, so the dictionary
 * is passed in as a prop from the server route.
 */

import * as React from "react";
import Link from "next/link";
import { Home, ChevronDown, ChevronRight } from "lucide-react";

export interface IndiaBreadcrumbDict {
  home: string;
  india: string;
  selectModule: string;
}

export interface IndiaBreadcrumbProps {
  locale: string;
  dict?: IndiaBreadcrumbDict;
}

const FALLBACK: IndiaBreadcrumbDict = {
  home: "Home",
  india: "India",
  selectModule: "Select module",
};

export function IndiaBreadcrumb({ locale, dict }: IndiaBreadcrumbProps) {
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

      {/* Disabled placeholder pill — functional dropdown ships in a future phase. */}
      <button
        type="button"
        disabled
        aria-label={t.selectModule}
        title={`${t.selectModule} — coming soon`}
        style={{
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "999px",
          padding: "3px 10px 3px 12px",
          fontSize: "11px",
          cursor: "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginLeft: "auto",
          color: "var(--color-text-secondary)",
          opacity: 0.7,
        }}
      >
        {t.selectModule}
        <ChevronDown size={11} />
      </button>
    </nav>
  );
}

export default IndiaBreadcrumb;
