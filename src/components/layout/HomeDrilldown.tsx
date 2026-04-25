/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { useState, Component, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { INDIA_STATES } from "@/lib/constants/districts";

// Districts activated within the last 45 days get a "NEW" badge.
// Driven primarily by District.goLiveDate (populated via backfill script
// + set on activation). For SSR (when the React Query hasn't resolved
// yet) we also fall back to a static lookup below — so the pill renders
// in initial HTML, not just after hydration.
const DAYS_NEW = 45;
// Grace window: if goLiveDate is up to 1 day in the future (IST/UTC skew
// around midnight — goLiveDate stored as UTC 00:00 reads as 05:30 IST on
// launch day), still treat as NEW. Prevents the same-day activation from
// silently failing the "ms >= 0" check on launch morning.
const FUTURE_GRACE_MS = 24 * 60 * 60 * 1000;

// Static SSR-time fallback for the NEW window. Keep aligned with the
// District.goLiveDate values written by
// scripts/backfill-district-go-live-dates-2026-04-25.ts. Older districts
// (>45 days) need not be listed.
const DISTRICT_LAUNCH_SSR_FALLBACK: Record<string, string> = {
  pune: "2026-04-25",
  lucknow: "2026-04-15",
  hyderabad: "2026-04-10",
};

function isNewDistrict(goLiveDate: string | null | undefined): boolean {
  if (!goLiveDate) return false;
  const ms = Date.now() - new Date(goLiveDate).getTime();
  return ms >= -FUTURE_GRACE_MS && ms < DAYS_NEW * 24 * 60 * 60 * 1000;
}

function isNewDistrictBySlug(slug: string, apiGoLive?: string | null): boolean {
  return isNewDistrict(apiGoLive ?? DISTRICT_LAUNCH_SSR_FALLBACK[slug]);
}
import dynamic from "next/dynamic";
import HomepageStats from "@/components/home/HomepageStats";
import TopTierShowcase from "@/components/support/TopTierShowcase";
import LiveDataPreview from "@/components/home/LiveDataPreview";
import HowItWorks from "@/components/home/HowItWorks";
import DistrictRequestSection from "@/components/home/DistrictRequestSection";

const DrillDownMap = dynamic(() => import("@/components/map/DrillDownMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        minHeight: 300,
        background: "#F5F7FF",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9B9B9B",
        fontSize: 13,
      }}
    >
      Loading map…
    </div>
  ),
});

// Error boundary so a map crash never brings down the whole page
class MapErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ width: "100%", height: "100%", minHeight: 300, background: "#F5F7FF", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#9B9B9B", fontSize: 13 }}>
          <span style={{ fontSize: 28 }}>🗺️</span>
          <span>Map unavailable</span>
          <span style={{ fontSize: 11 }}>Select your district from the list →</span>
        </div>
      );
    }
    return this.props.children;
  }
}

interface DistrictPreview {
  slug: string;
  name: string;
  nameLocal: string;
  tagline: string | null;
  goLiveDate: string | null;
  weather: { temp: number | null; conditions: string | null } | null;
  dam: { name: string; storagePct: number } | null;
  crop: { commodity: string; price: number } | null;
  healthGrade: string | null;
  healthScore: number | null;
}

interface PreviewResponse {
  districtPreviews: DistrictPreview[];
}

interface HomeDrilldownProps {
  locale: string;
  tickerShown?: boolean;
  /** When true (Session 4), the new HeroIndia component is rendered above
   *  this component, so we suppress the legacy HomepageStats stat row. */
  heroShown?: boolean;
}

function gradeColor(grade: string): { bg: string; text: string; border: string } {
  // Tailwind-50 backgrounds + 700 text + 200 border for visible-but-subtle chips.
  // emerald / blue / amber / rose — same family used by Phase 8 Coming Soon cards.
  if (grade === "A+" || grade === "A") return { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" };
  if (grade === "B+" || grade === "B") return { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" };
  if (grade === "C+" || grade === "C") return { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" };
  if (grade === "D") return { bg: "#FFF1F2", text: "#BE123C", border: "#FECACA" };
  return { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
}

export default function HomeDrilldown({ locale, heroShown = false }: HomeDrilldownProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: previewData } = useQuery<PreviewResponse>({
    queryKey: ["homepage-preview"],
    queryFn: () => fetch("/api/data/homepage-preview").then((r) => r.json()),
    staleTime: 300_000,
  });

  const allDistricts = INDIA_STATES.flatMap((s) =>
    s.districts.map((d) => ({ state: s, district: d }))
  );
  const filtered = searchQuery.length >= 2
    ? allDistricts
        .filter(({ district }) =>
          district.active &&
          (district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            district.nameLocal.includes(searchQuery))
        )
        .slice(0, 5)
    : [];

  const activeDistricts = INDIA_STATES.flatMap((s) =>
    s.districts.filter((d) => d.active).map((d) => ({ ...d, _stateSlug: s.slug }))
  );

  const districtPreviews = previewData?.districtPreviews ?? [];
  const goLiveBySlug = new Map(districtPreviews.map((d) => [d.slug, d.goLiveDate]));

  return (
    <main style={{ background: "#FAFAF8", paddingBottom: 40 }}>
      {/* Hero Stats — suppressed when /en mounts the new HeroIndia above. */}
      {!heroShown && <HomepageStats />}

      {/* Session 8: BACKED BY supporter strip. Moved here from above-kicker
          (page.tsx) so the kicker → CTAs → stats funnel runs uninterrupted,
          and supporters appear in a contextual "after the value, before
          the product" position. */}
      <TopTierShowcase locale={locale} />

      {/* Map + District cards: 2-col on desktop, stacked on mobile */}
      <div>
        <div
          style={{ padding: "12px 16px 8px" }}
        >
          <span
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "#9B9B9B",
            }}
          >
            <span className="hidden md:inline">Click</span>
            <span className="md:hidden">Tap</span>
            {" "}a state to explore
          </span>
        </div>

        <div className="md:grid md:grid-cols-[3fr_2fr]" style={{ gap: 20, padding: "0 16px" }}>
          {/* Map column */}
          <div>
            <div className="touch-pan-y md:touch-auto">
              <MapErrorBoundary>
                <DrillDownMap locale={locale} />
              </MapErrorBoundary>
            </div>
          </div>

          {/* Districts + Search column */}
          <div style={{ marginTop: 16 }} className="md:mt-0">
            {/* Search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#FFFFFF", border: "1.5px solid #E8E8E4",
                  borderRadius: 12, padding: "11px 14px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Search size={15} style={{ color: "#9B9B9B", flexShrink: 0 }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your district…"
                  style={{
                    flex: 1, border: "none", outline: "none",
                    fontSize: 15, color: "#1A1A1A", background: "transparent",
                  }}
                />
              </div>
              {filtered.length > 0 && (
                <div
                  style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                    background: "#fff", border: "1px solid #E8E8E4", borderRadius: 10,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)", zIndex: 20, overflow: "hidden",
                  }}
                >
                  {filtered.map(({ state, district }) => (
                    <Link key={district.slug} href={`/${locale}/${state.slug}/${district.slug}`}
                      style={{
                        display: "flex", alignItems: "center", padding: "11px 14px",
                        textDecoration: "none", color: "#1A1A1A",
                        borderBottom: "1px solid #F5F5F0",
                      }}
                    >
                      <MapPin size={13} style={{ color: "#2563EB", marginRight: 8, flexShrink: 0 }} />
                      <span style={{ fontSize: 14 }}>{district.name}</span>
                      {district.nameLocal && (
                        <span style={{ fontSize: 11, color: "#9B9B9B", marginLeft: 5, fontFamily: "var(--font-regional)" }}>
                          {district.nameLocal}
                        </span>
                      )}
                      {isNewDistrictBySlug(district.slug, goLiveBySlug.get(district.slug)) && (
                        <span style={{ fontSize: 9, fontWeight: 500, padding: "1px 6px", background: "#D1FAE5", color: "#065F46", borderRadius: 10, marginLeft: 5 }}>NEW</span>
                      )}
                      <span style={{ fontSize: 12, color: "#9B9B9B", marginLeft: "auto" }}>{state.name}</span>
                      <ArrowRight size={12} style={{ color: "#C0C0C0", marginLeft: 6 }} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Active district cards */}
            {activeDistricts.length > 0 && (
              <ActiveDistrictsCard
                locale={locale}
                activeDistricts={activeDistricts}
                districtPreviews={districtPreviews}
              />
            )}
          </div>
        </div>
      </div>

      {/* Remaining sections — full width, stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {/* Live Data Preview cards */}
        <LiveDataPreview locale={locale} />

        {/* How It Works */}
        <HowItWorks />

        {/* District Request voting */}
        <DistrictRequestSection />

        {/* Support button */}
        <div style={{ padding: "0 16px" }}>
          <Link
            href="/support"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "13px 0", background: "#FFF1F2", border: "1px solid #FECDD3",
              borderRadius: 12, fontSize: 15, fontWeight: 600, color: "#DC2626",
              textDecoration: "none", minHeight: 44,
            }}
          >
            ❤️ Support — ₹1.50/day serves one district
          </Link>
        </div>

        {/* Disclaimer */}
        <DisclaimerStrip />
      </div>
    </main>
  );
}

// ── Shared subcomponents ─────────────────────────────────────────────────────

function ActiveDistrictsCard({
  locale, activeDistricts, districtPreviews,
}: {
  locale: string;
  activeDistricts: Array<(typeof INDIA_STATES)[number]["districts"][number] & { _stateSlug: string }>;
  districtPreviews: DistrictPreview[];
}) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 16, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#1D4ED8", fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, background: "#22C55E", borderRadius: "50%", display: "inline-block" }} />
          LIVE — {activeDistricts.length} Districts
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeDistricts.map((d) => {
          const preview = districtPreviews.find((p) => p.slug === d.slug);
          return (
            <Link key={d.slug} href={`/${locale}/${d._stateSlug}/${d.slug}`}
              style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                padding: "12px 14px", background: "#F8FAFF", border: "1px solid #DBEAFE",
                borderRadius: 10, textDecoration: "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{d.name}</span>
                  {preview?.healthGrade && (() => {
                    const gc = gradeColor(preview.healthGrade);
                    return (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 6px",
                        background: gc.bg,
                        color: gc.text,
                        border: `1px solid ${gc.border}`,
                        borderRadius: 4,
                      }}>
                        {preview.healthGrade}
                      </span>
                    );
                  })()}
                  {isNewDistrictBySlug(d.slug, preview?.goLiveDate) && (
                    <span style={{
                      fontSize: 10, fontWeight: 500, padding: "2px 8px",
                      background: "#D1FAE5", color: "#065F46",
                      borderRadius: 10,
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                {d.nameLocal && (
                  <div style={{ fontSize: 12, color: "#6B6B6B", fontFamily: "var(--font-regional)" }}>{d.nameLocal}</div>
                )}
                {d.tagline && (
                  <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 1 }}>{d.tagline}</div>
                )}
                {/* Badges + weather */}
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {(d.badges ?? []).slice(0, 3).map((b, i) => (
                    <span key={i} style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      padding: "2px 8px", borderRadius: 100,
                      fontSize: 10, fontWeight: 600,
                      background: "rgba(0,0,0,0.04)", color: "#6B6B6B",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}>
                      {b.emoji} {b.label}
                    </span>
                  ))}
                  {preview?.weather?.temp != null && (
                    <span style={{ fontSize: 11, color: "#2563EB", fontFamily: "var(--font-mono, monospace)" }}>
                      🌡️ {preview.weather.temp}°C
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight size={14} style={{ color: "#2563EB", flexShrink: 0, marginTop: 2 }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DisclaimerStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid #E8E8E4", padding: "10px 16px",
        fontSize: 11, color: "#9B9B9B", background: "#FFFFFF",
        borderRadius: 10, margin: "0 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}
    >
      <span>
        <strong style={{ color: "#6B6B6B" }}>ForThePeople.in</strong> — Independent. NOT an official government website. Data under NDSAP.{" "}
        <Link href="/disclaimer" style={{ color: "#2563EB", textDecoration: "none" }}>Disclaimer →</Link>
      </span>
      <span>
        Built by{" "}
        <a href="https://www.instagram.com/jayanth_m_b/" target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none" }}>
          Jayanth M B
        </a>
      </span>
    </div>
  );
}
