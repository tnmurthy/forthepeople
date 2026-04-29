/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * IndiaSectionBand — reusable wrapper around any module on /[locale]/india.
 *
 * Provides the consistent visual frame:
 *   - section anchor (id={module.slug}) for scroll-spy nav
 *   - 4px tricolor category-accent header underline
 *   - icon + title + tagline header row
 *   - status badge if module.status !== "live"
 *   - inline italic legal note if module.legalNote points to a dictionary key
 *   - children slot (caller-provided KPIs / charts / lists)
 *   - DataSourceBanner footer auto-built from module.sources
 *
 * Empty-state policy: if children is null/undefined the band falls back
 * to <IndiaAwaitingSync sourceKey={firstSource.sourceKey} /> so we never
 * leave a live band visually empty (file 32 §10).
 */

import Link from "next/link";
import type { ReactNode } from "react";
import type { IndiaModuleDef } from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN, categoryTint } from "@/lib/india/india-design";
import { INDIA_SOURCES } from "@/lib/india/india-sources";
import IndiaAwaitingSync from "./IndiaAwaitingSync";

interface Props {
  module: IndiaModuleDef;
  /** Resolved legal note text (Phase 7 looks up dict.disclaimers[key]). */
  legalNoteText?: string | null;
  /** Caller-provided content. If null/empty, IndiaAwaitingSync renders. */
  children?: ReactNode;
}

export default function IndiaSectionBand({ module, legalNoteText, children }: Props) {
  const accent = CATEGORY_ACCENT[module.category];
  const tint = categoryTint(module.category);
  const hasChildren =
    children != null &&
    (typeof children !== "object" ||
      // Treat empty arrays / fragments as "no children" too.
      !(Array.isArray(children) && children.length === 0));

  return (
    <section
      id={module.slug}
      aria-labelledby={`${module.slug}-title`}
      style={{
        scrollMarginTop: INDIA_DESIGN.headerOffsetPx + 56,
        padding: "32px 16px 28px",
        borderBottom: `1px solid ${INDIA_DESIGN.border}`,
      }}
    >
      <div
        style={{
          maxWidth: INDIA_DESIGN.sectionMaxWidth,
          margin: "0 auto",
        }}
      >
        {/* Header row — icon chip + title + tagline + status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 4,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 20,
              width: 40,
              height: 40,
              borderRadius: 10,
              background: tint,
              border: `1px solid ${accent}33`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {module.icon}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <h2
                id={`${module.slug}-title`}
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: INDIA_DESIGN.textPrimary,
                  margin: 0,
                  letterSpacing: "-0.3px",
                  fontFamily: INDIA_DESIGN.fontDisplay,
                }}
              >
                {module.title}
              </h2>
              {module.status !== "live" ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "2px 7px",
                    borderRadius: 10,
                    background: "#F3F4F6",
                    color: "#6B7280",
                  }}
                >
                  {module.status === "beta" ? "Beta" : "Coming soon"}
                </span>
              ) : null}
            </div>
            <div
              style={{
                fontSize: 13,
                color: INDIA_DESIGN.textMuted,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {module.tagline}
            </div>
          </div>
        </div>

        {/* 4px tricolor category accent — the "underline" */}
        <div
          style={{
            height: 4,
            width: 60,
            background: accent,
            borderRadius: 2,
            margin: "12px 0 16px 54px",
          }}
          aria-hidden="true"
        />

        {/* Inline legal disclaimer (Phase 7 populates legalNoteText) */}
        {legalNoteText ? (
          <p
            style={{
              fontSize: 12,
              color: INDIA_DESIGN.textMuted,
              fontStyle: "italic",
              lineHeight: 1.55,
              margin: "0 0 16px 54px",
              padding: "8px 12px",
              background: INDIA_DESIGN.bgMuted,
              borderLeft: `3px solid ${accent}`,
              borderRadius: 4,
              maxWidth: 760,
            }}
          >
            {legalNoteText}
          </p>
        ) : null}

        {/* Body */}
        <div style={{ marginLeft: 54 }}>
          {hasChildren ? (
            children
          ) : (
            <IndiaAwaitingSync
              sourceKey={module.sources[0]?.sourceKey ?? "MoSPI"}
            />
          )}
        </div>

        {/* Footer — sources banner. Auto-built from module.sources. */}
        <SourceBannerFooter module={module} />
      </div>
    </section>
  );
}

function SourceBannerFooter({ module }: { module: IndiaModuleDef }) {
  if (module.sources.length === 0) return null;
  return (
    <div
      style={{
        marginTop: 18,
        marginLeft: 54,
        padding: "10px 14px",
        background: INDIA_DESIGN.bgPage,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 8,
        fontSize: 11,
        color: INDIA_DESIGN.textMuted,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ fontWeight: 600, color: INDIA_DESIGN.textFaint, marginRight: 4 }}>
        Sourced from:
      </span>
      {module.sources.map((s, idx) => {
        const src = INDIA_SOURCES[s.sourceKey];
        if (!src) return null;
        return (
          <span key={s.sourceKey} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Link
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INDIA_DESIGN.accentBlue, textDecoration: "none" }}
            >
              {src.name.replace(/^Ministry of /, "M/o ")}
            </Link>
            <span style={{ color: INDIA_DESIGN.textFaint }}>· {s.refresh}</span>
            {idx < module.sources.length - 1 ? (
              <span style={{ color: INDIA_DESIGN.textFaint, marginLeft: 2 }}>·</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
