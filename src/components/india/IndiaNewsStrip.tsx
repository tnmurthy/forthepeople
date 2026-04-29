/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "Latest from India" news strip for /[locale]/india.
 *
 * Top 5 NewsItem rows (with a district association — pure-national
 * news isn't tracked yet at the platform level) ordered by publishedAt
 * desc. Each row links out to the original publisher; we never reproduce
 * article paragraphs (file 31 §4 — headline + 1-line snippet + source
 * link only).
 *
 * Ported from /en/india-detail Section 5; data shape and visual style
 * preserved 1:1 so the redirect handoff is seamless.
 */

import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORY_ACCENT, INDIA_DESIGN, categoryTint } from "@/lib/india/india-design";
import {
  INDIA_MODULES,
  getModuleNewsKeywords,
  type IndiaModuleDef,
} from "@/lib/india/india-modules";

interface ModuleChip {
  slug: string;
  title: string;
  accent: string;
  tint: string;
}

/**
 * Match news headline + summary against each module's newsKeywords and
 * return up to 2 best matches. Pure read-time computation — no DB column,
 * no async job. The longest matching keyword wins ties so "ayushman" beats
 * "health".
 */
function tagModulesForNews(
  title: string,
  summary: string | null,
): ModuleChip[] {
  const haystack = `${title} ${summary ?? ""}`.toLowerCase();
  const scored: { mod: IndiaModuleDef; score: number }[] = [];
  for (const mod of INDIA_MODULES) {
    let best = 0;
    for (const k of getModuleNewsKeywords(mod)) {
      const needle = k.toLowerCase();
      if (needle.length < 3) continue;
      if (haystack.includes(needle)) best = Math.max(best, needle.length);
    }
    if (best > 0) scored.push({ mod, score: best });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((s) => ({
    slug: s.mod.slug,
    title: s.mod.title,
    accent: CATEGORY_ACCENT[s.mod.category],
    tint: categoryTint(s.mod.category),
  }));
}

export default async function IndiaNewsStrip({ locale = "en" }: { locale?: string } = {}) {
  const items = await prisma.newsItem.findMany({
    where: { duplicateOf: null, districtId: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 5,
    include: {
      district: { select: { slug: true, name: true, state: { select: { slug: true } } } },
    },
  });

  if (items.length === 0) return null;

  return (
    <section
      style={{
        padding: "20px 16px",
        maxWidth: INDIA_DESIGN.sectionMaxWidth,
        margin: "0 auto",
      }}
    >
      <SectionLabel icon="📰">Latest from India</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((n) => {
          const chips = tagModulesForNews(n.title, n.summary);
          return (
            <div
              key={n.id}
              style={{
                background: INDIA_DESIGN.bgCard,
                border: `1px solid ${INDIA_DESIGN.border}`,
                borderRadius: 12,
                padding: "12px 16px",
              }}
            >
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: INDIA_DESIGN.textPrimary,
                  display: "block",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: INDIA_DESIGN.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: INDIA_DESIGN.textFaint,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span>{n.district?.name ?? ""}</span>
                  <span>·</span>
                  <span>{n.publisher ?? n.source}</span>
                  <span>·</span>
                  <span style={{ fontFamily: INDIA_DESIGN.fontMono }}>
                    {n.publishedAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </a>
              {chips.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  {chips.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${locale}/india/${c.slug}`}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: c.accent,
                        background: c.tint,
                        border: `1px solid ${c.accent}33`,
                        borderRadius: 999,
                        padding: "2px 10px",
                        textDecoration: "none",
                      }}
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: INDIA_DESIGN.textFaint,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </div>
  );
}
