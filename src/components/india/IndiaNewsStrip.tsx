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

import { prisma } from "@/lib/db";
import { INDIA_DESIGN } from "@/lib/india/india-design";

export default async function IndiaNewsStrip() {
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
        {items.map((n) => (
          <a
            key={n.id}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: INDIA_DESIGN.bgCard,
              border: `1px solid ${INDIA_DESIGN.border}`,
              borderRadius: 12,
              padding: "12px 16px",
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
        ))}
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
