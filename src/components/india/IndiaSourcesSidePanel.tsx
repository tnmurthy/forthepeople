/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Slide-out panel listing every source cited on the India dashboard.
 * Always 1-click accessible from the floating IndiaSourcesButton.
 *
 * Top: trust line + search.
 * Body: sources grouped by category, each row clickable through to
 *   the source URL + a chip-list of modules using it.
 * Bottom: "Report an inaccuracy" mailto link.
 *
 * Replaces the bottom-of-page IndiaDataSourcesIndex (deleted in this
 * phase) with an always-on, anywhere-on-page surface.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import {
  type IndiaSource,
  type SourceDomain,
  getAllSources,
} from "@/lib/india/india-sources";
import { INDIA_MODULES } from "@/lib/india/india-modules";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Locale for the "modules using it" chip links. */
  locale: string;
}

export default function IndiaSourcesSidePanel({ open, onClose, locale }: Props) {
  const [query, setQuery] = useState("");

  const allSources = useMemo(() => getAllSources(), []);
  const usage = useMemo(() => {
    const map = new Map<string, { slug: string; title: string }[]>();
    for (const mod of INDIA_MODULES) {
      for (const s of mod.sources) {
        const cur = map.get(s.sourceKey) ?? [];
        cur.push({ slug: mod.slug, title: mod.title });
        map.set(s.sourceKey, cur);
      }
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSources;
    return allSources.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.key.toLowerCase().includes(q) ||
        (s.blurb ?? "").toLowerCase().includes(q),
    );
  }, [allSources, query]);

  const grouped = useMemo(() => {
    const m = new Map<SourceDomain, IndiaSource[]>();
    for (const s of filtered) {
      const cur = m.get(s.domain) ?? [];
      cur.push(s);
      m.set(s.domain, cur);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease",
          zIndex: 80,
        }}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Data sources"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(420px, 100vw)",
          background: INDIA_DESIGN.bgCard,
          boxShadow: "-12px 0 36px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 90,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 18px 12px",
            borderBottom: `1px solid ${INDIA_DESIGN.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: INDIA_DESIGN.textFaint,
              }}
            >
              Data sources
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "inline-flex",
                color: INDIA_DESIGN.textMuted,
              }}
            >
              <X size={20} />
            </button>
          </div>
          <p
            style={{
              fontSize: 12,
              color: INDIA_DESIGN.textMuted,
              lineHeight: 1.55,
              margin: "8px 0 12px",
            }}
          >
            All data on this page is sourced from official government portals
            (.gov.in / .nic.in) under India&apos;s NDSAP, accredited research
            institutions, and verified public sources. Always verify at the
            original source.
          </p>
          <input
            type="search"
            placeholder="Search sources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${INDIA_DESIGN.border}`,
              fontSize: 13,
              background: INDIA_DESIGN.bgPage,
              color: INDIA_DESIGN.textPrimary,
            }}
          />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 20px" }}>
          {grouped.length === 0 ? (
            <div
              style={{
                padding: "16px 0",
                color: INDIA_DESIGN.textMuted,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              No sources match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            grouped.map(([domain, sources]) => (
              <div key={domain} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: INDIA_DESIGN.textFaint,
                    marginBottom: 6,
                  }}
                >
                  {domain}
                </div>
                {sources.map((src) => {
                  const used = usage.get(src.key) ?? [];
                  return (
                    <div
                      key={src.key}
                      style={{
                        padding: "10px 0",
                        borderBottom: `1px solid ${INDIA_DESIGN.border}`,
                      }}
                    >
                      <Link
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: INDIA_DESIGN.accentBlue,
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {src.name}
                      </Link>
                      {src.blurb ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: INDIA_DESIGN.textMuted,
                            marginTop: 2,
                            lineHeight: 1.5,
                          }}
                        >
                          {src.blurb}
                        </div>
                      ) : null}
                      {used.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                            marginTop: 6,
                          }}
                        >
                          {used.slice(0, 6).map((u) => (
                            <Link
                              key={u.slug}
                              href={`/${locale}/india/${u.slug}`}
                              style={{
                                fontSize: 10,
                                padding: "2px 7px",
                                background: INDIA_DESIGN.bgMuted,
                                border: `1px solid ${INDIA_DESIGN.border}`,
                                borderRadius: 999,
                                color: INDIA_DESIGN.textSecondary,
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              {u.title}
                            </Link>
                          ))}
                          {used.length > 6 ? (
                            <span
                              style={{
                                fontSize: 10,
                                color: INDIA_DESIGN.textFaint,
                                padding: "2px 4px",
                              }}
                            >
                              +{used.length - 6}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 10,
                            color: INDIA_DESIGN.textFaint,
                            marginTop: 4,
                            fontStyle: "italic",
                          }}
                        >
                          Not yet used by any module
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${INDIA_DESIGN.border}`,
            background: INDIA_DESIGN.bgPage,
            fontSize: 12,
          }}
        >
          <a
            href="mailto:support@forthepeople.in?subject=Inaccuracy%20on%20India%20dashboard&body=Page%20URL%3A%20%0AModule%3A%20%0AInaccuracy%3A%20%0AUpstream%20source%3A%20"
            style={{
              color: INDIA_DESIGN.accentBlue,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Report an inaccuracy →
          </a>
          <span
            style={{
              marginLeft: 10,
              color: INDIA_DESIGN.textFaint,
            }}
          >
            We respond within 24 hours.
          </span>
        </div>
      </aside>
    </>
  );
}
