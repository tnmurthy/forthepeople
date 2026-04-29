/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Coming Soon Rail — compact card grid for every module marked
 * status: "coming_soon" in INDIA_MODULES. Each card has icon, title,
 * tagline, sources line, and a "Vote to prioritise" button that the
 * Phase 6 voting widget will wire up to prefill the suggestion form.
 *
 * Driven by getComingSoonIndiaModules() — adding a new module to the
 * registry as coming_soon = it appears here automatically.
 */

import {
  getComingSoonIndiaModules,
  type IndiaModuleDef,
} from "@/lib/india/india-modules";
import { CATEGORY_ACCENT, INDIA_DESIGN, categoryTint } from "@/lib/india/india-design";
import { INDIA_SOURCES } from "@/lib/india/india-sources";

export default function IndiaComingSoonRail() {
  const modules = getComingSoonIndiaModules();
  if (modules.length === 0) return null;

  return (
    <section
      style={{
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
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: INDIA_DESIGN.textFaint,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span aria-hidden="true">🛠️</span> Coming Soon
            </div>
            <div style={{ fontSize: 13, color: INDIA_DESIGN.textMuted, marginTop: 2 }}>
              {modules.length} modules in the queue. Vote to prioritise.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {modules.map((mod) => (
            <ComingSoonCard key={mod.slug} module={mod} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComingSoonCard({ module }: { module: IndiaModuleDef }) {
  const accent = CATEGORY_ACCENT[module.category];
  const tint = categoryTint(module.category);
  const sourceNames = module.sources
    .map((s) => INDIA_SOURCES[s.sourceKey]?.name)
    .filter((n): n is string => Boolean(n))
    .map((n) => n.replace(/^Ministry of /, "M/o ").replace(/^Department.*?· /, ""))
    .slice(0, 3);

  return (
    <div
      style={{
        background: INDIA_DESIGN.bgCard,
        border: `1px dashed ${INDIA_DESIGN.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 156,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            fontSize: 16,
            width: 30,
            height: 30,
            borderRadius: 8,
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
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: INDIA_DESIGN.textPrimary,
            letterSpacing: "-0.2px",
            flex: 1,
            minWidth: 0,
          }}
        >
          {module.title}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 10,
            background: "#F3F4F6",
            color: "#6B7280",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Coming
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: INDIA_DESIGN.textMuted,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {module.tagline}
      </p>
      {sourceNames.length > 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: 10.5,
            color: INDIA_DESIGN.textFaint,
            lineHeight: 1.45,
            paddingTop: 6,
            borderTop: `1px dashed ${INDIA_DESIGN.border}`,
            fontFamily: INDIA_DESIGN.fontMono,
          }}
        >
          {sourceNames.join(" · ")}
        </p>
      ) : null}
      <a
        href="#india-vote"
        data-prefill={module.title}
        style={{
          alignSelf: "flex-start",
          fontSize: 11,
          fontWeight: 600,
          color: INDIA_DESIGN.accentBlue,
          textDecoration: "none",
          padding: "4px 0",
          marginTop: 2,
        }}
      >
        Vote to prioritise →
      </a>
    </div>
  );
}
