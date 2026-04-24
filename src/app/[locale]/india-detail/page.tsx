/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
*
 * /en/india-detail — India aggregate view (Session 3).
 *
 * Nine sections: back link + hero, new districts this month, next-district
 * leaderboard, latest India news, health ranking, 4× Coming Soon placeholders,
 * Royal support CTA, footer (inherited from layout).
 *
 * Server-rendered. Reuses existing Prisma models and utilities — zero new
 * API routes, zero schema changes.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { INDIA_STATES, getTotalActiveDistrictCount } from "@/lib/constants/districts";
import { NextDistrictLeaderboard, type LeaderboardRow } from "@/components/home/NextDistrictLeaderboard";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forthepeople.in";
const DAYS_NEW = 45;
const FUTURE_GRACE_MS = 24 * 60 * 60 * 1000;

function isNewDistrict(goLiveDate: Date | null | undefined): boolean {
  if (!goLiveDate) return false;
  const ms = Date.now() - goLiveDate.getTime();
  return ms >= -FUTURE_GRACE_MS && ms < DAYS_NEW * 24 * 60 * 60 * 1000;
}

function gradeColor(grade: string | null): { bg: string; text: string } {
  if (!grade) return { bg: "#F3F4F6", text: "#6B7280" };
  if (grade.startsWith("A")) return { bg: "#DCFCE7", text: "#15803D" };
  if (grade.startsWith("B")) return { bg: "#DBEAFE", text: "#1D4ED8" };
  if (grade.startsWith("C")) return { bg: "#FEF3C7", text: "#92400E" };
  if (grade.startsWith("D")) return { bg: "#FEE2E2", text: "#991B1B" };
  return { bg: "#F3F4F6", text: "#6B7280" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE_URL}/${locale}/india-detail`;
  const activeCount = getTotalActiveDistrictCount();
  return {
    title: `India in One Page · ForThePeople.in`,
    description: `${activeCount} active districts, 29 dashboards each. Rankings, latest news, and what's coming next — all on one page.`,
    alternates: { canonical: url },
    openGraph: { url, title: "India in One Page · ForThePeople.in" },
  };
}

export default async function IndiaDetailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeCount = getTotalActiveDistrictCount();

  // ── Data fetches (parallel) ──────────────────────────────────
  const [activeDistricts, districtRequests, topNews, healthScores] = await Promise.all([
    prisma.district.findMany({
      where: { active: true },
      select: {
        id: true, slug: true, name: true, nameLocal: true, tagline: true,
        goLiveDate: true,
        state: { select: { slug: true, name: true } },
        healthScore: { select: { grade: true, overallScore: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.districtRequest.findMany({
      orderBy: { requestCount: "desc" },
      take: 20,
    }),
    prisma.newsItem.findMany({
      where: { duplicateOf: null, districtId: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { district: { select: { slug: true, name: true, state: { select: { slug: true } } } } },
    }),
    prisma.districtHealthScore.findMany(),
  ]);

  // ── Derive: "NEW this month" districts (up to 3) ──────────────
  const newDistricts = activeDistricts
    .filter((d) => isNewDistrict(d.goLiveDate))
    .sort((a, b) => (b.goLiveDate?.getTime() ?? 0) - (a.goLiveDate?.getTime() ?? 0))
    .slice(0, 3);

  // ── Derive: top-3 next-district leaderboard (exclude active) ──
  const activeNamesLower = new Set(activeDistricts.map((d) => d.name.toLowerCase()));
  const leaderboard: LeaderboardRow[] = districtRequests
    .filter((r) => !activeNamesLower.has(r.districtName.toLowerCase()))
    .slice(0, 3)
    .map((r) => ({
      districtName: r.districtName,
      stateName: r.stateName,
      requestCount: r.requestCount,
    }));

  // ── Derive: full health-ranking sort ─────────────────────────
  const scoreByDistrict = new Map(healthScores.map((h) => [h.districtId, h]));
  const healthRanking = activeDistricts
    .map((d) => ({
      ...d,
      score: scoreByDistrict.get(d.id)?.overallScore ?? null,
      grade: scoreByDistrict.get(d.id)?.grade ?? null,
    }))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

  return (
    <main style={{ background: "#FAFAF8", minHeight: "100vh", paddingBottom: 48 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 16px 0" }}>
        {/* ═══════════════════════════════════════════════════════
            Section 1 · Back link + why-this-page
           ═══════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#6B6B6B",
              textDecoration: "none",
              padding: "6px 8px",
              marginLeft: -8,
              borderRadius: 6,
            }}
          >
            <ArrowLeft size={14} />
            Back to district explorer
          </Link>
          <span
            title="An India-level summary that sits above the usual district-by-district view. Same data, different lens."
            style={{
              fontSize: 11,
              color: "#9B9B9B",
              padding: "4px 8px",
              border: "1px solid #E8E8E4",
              borderRadius: 14,
              cursor: "help",
              background: "#FFFFFF",
            }}
          >
            Why this page?
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Section 2 · Hero
           ═══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9B9B9B",
              marginBottom: 8,
            }}
          >
            🇮🇳 India at a glance
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#1A1A1A",
              letterSpacing: "-1px",
              lineHeight: 1.08,
              margin: 0,
              fontFamily: "var(--font-plus-jakarta, system-ui, sans-serif)",
            }}
            className="md:text-[44px]"
          >
            India in one page.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#4B4B4B",
              lineHeight: 1.6,
              maxWidth: 560,
              marginTop: 12,
            }}
          >
            <strong style={{ color: "#1A1A1A" }}>{activeCount} districts live</strong>
            {"  ·  "}29 dashboards per district
            {"  ·  "}
            <span style={{ fontFamily: "var(--font-mono, monospace)", color: "#2563EB", fontWeight: 700 }}>
              {(activeCount * 29).toLocaleString("en-IN")}
            </span>{" "}
            live data points.
          </p>
          <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 8 }}>
            Refreshed every 5–30 minutes from official government portals.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════
            Section 3 · NEW districts this month
           ═══════════════════════════════════════════════════════ */}
        {newDistricts.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionLabel icon="🆕">New districts this month</SectionLabel>
            <div
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                paddingBottom: 6,
                marginRight: -16,
                paddingRight: 16,
              }}
            >
              {newDistricts.map((d) => {
                const gc = gradeColor(d.healthScore?.grade ?? null);
                return (
                  <Link
                    key={d.id}
                    href={`/${locale}/${d.state.slug}/${d.slug}`}
                    style={{
                      flex: "0 0 280px",
                      scrollSnapAlign: "start",
                      background: "#FFFFFF",
                      border: "1px solid #E8E8E4",
                      borderRadius: 14,
                      padding: "16px 18px",
                      textDecoration: "none",
                      color: "#1A1A1A",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 140,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px" }}>
                        {d.name}
                      </span>
                      {d.healthScore?.grade && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: gc.bg,
                            color: gc.text,
                          }}
                        >
                          {d.healthScore.grade}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: 10,
                          background: "#ECFDF5",
                          color: "#065F46",
                          border: "1px solid #A7F3D0",
                          letterSpacing: "0.04em",
                        }}
                      >
                        NEW
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 10 }}>
                      {d.state.name}
                    </div>
                    {d.tagline && (
                      <div style={{ fontSize: 12, color: "#6B6B6B", flex: 1, lineHeight: 1.5 }}>
                        {d.tagline}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600, marginTop: 10 }}>
                      Explore →
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            Section 4 · Next district leaderboard
           ═══════════════════════════════════════════════════════ */}
        {leaderboard.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <NextDistrictLeaderboard
              locale={locale}
              items={leaderboard}
              seeAllHref={`/${locale}/features?tab=vote`}
            />
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            Section 5 · Latest from India
           ═══════════════════════════════════════════════════════ */}
        {topNews.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionLabel icon="📰">Latest from India</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topNews.map((n) => (
                <a
                  key={n.id}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E8E4",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textDecoration: "none",
                    color: "#1A1A1A",
                    display: "block",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: "#1A1A1A", marginBottom: 4 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#9B9B9B", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span>{n.district?.name ?? ""}</span>
                    <span>·</span>
                    <span>{n.publisher ?? n.source}</span>
                    <span>·</span>
                    <span style={{ fontFamily: "var(--font-mono, monospace)" }}>
                      {n.publishedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════
            Section 6 · District health ranking
           ═══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 40 }}>
          <SectionLabel icon="📊">District health ranking</SectionLabel>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8E4",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {healthRanking.map((d, idx) => {
              const gc = gradeColor(d.grade);
              return (
                <Link
                  key={d.id}
                  href={`/${locale}/${d.state.slug}/${d.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    textDecoration: "none",
                    color: "#1A1A1A",
                    borderBottom: idx === healthRanking.length - 1 ? "none" : "1px solid #F0F0EC",
                    minHeight: 48,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9B9B9B",
                      fontFamily: "var(--font-mono, monospace)",
                      width: 24,
                      flexShrink: 0,
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 1 }}>
                      {d.state.name}
                    </div>
                  </div>
                  {d.grade && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: gc.bg,
                        color: gc.text,
                        flexShrink: 0,
                      }}
                    >
                      {d.grade}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1A1A1A",
                      fontFamily: "var(--font-mono, monospace)",
                      minWidth: 46,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {d.score !== null ? d.score.toFixed(1) : "—"}
                  </span>
                </Link>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: "#9B9B9B", marginTop: 8, textAlign: "center" }}>
            Grades from governance, education, health, infrastructure, water, economy, safety, agriculture, digital access, welfare.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════
            Section 7 · Coming Soon
           ═══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 40 }}>
          <SectionLabel icon="🛠️">Coming soon</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 10,
            }}
            className="md:grid-cols-2"
          >
            <ComingSoonCard
              emoji="💰"
              title="National economy"
              blurb="GDP, inflation, unemployment, import/export trends."
            />
            <ComingSoonCard
              emoji="🏛️"
              title="Parliament & budget"
              blurb="Lok Sabha, Rajya Sabha, Union Budget, CAG reports."
            />
            <ComingSoonCard
              emoji="🌾"
              title="Agriculture"
              blurb="All-India mandi prices, fertiliser, MSP data."
            />
            <ComingSoonCard
              emoji="🏥"
              title="Health"
              blurb="Ayushman Bharat coverage, epidemic surveillance."
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            Section 8 · Support CTA
           ═══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 40 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              border: "1px solid #FDE68A",
              borderRadius: 16,
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#92400E",
              }}
            >
              ❤️ Keep all of India covered
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}>
              Royal Contributor of India · ₹9,999/month
            </div>
            <p style={{ fontSize: 13, color: "#4B4B4B", lineHeight: 1.6, margin: "4px 0 0", maxWidth: 480 }}>
              Your name featured on every district dashboard across {activeCount} live districts — and on all future districts as they launch.
            </p>
            <Link
              href={`/${locale}/support?tier=royal_india`}
              style={{
                marginTop: 10,
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                background: "#1A1A1A",
                color: "#FFFFFF",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Become a Royal Contributor →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#9B9B9B",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 13 }}>{icon}</span>
      {children}
    </div>
  );
}

function ComingSoonCard({
  emoji, title, blurb,
}: {
  emoji: string; title: string; blurb: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px dashed #E0E0DA",
        borderRadius: 12,
        padding: "14px 16px",
        opacity: 0.75,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span aria-hidden="true" style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{title}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 10,
            background: "#F3F4F6",
            color: "#6B7280",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Coming soon
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: "#6B6B6B", lineHeight: 1.5 }}>{blurb}</p>
    </div>
  );
}
