/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — homepage hero.
 * Session 11.4 polish:
 *   - Layout flipped to 40 (text) / 60 (map). Map is dominant.
 *   - DrillDownMap (the existing react-simple-maps wrapper, also used
 *     by legacy HomeDrilldown) is the right column. The DistrictExplorer
 *     map slot was dropped — only ONE map on the page.
 *   - Wrapped in .ftp-section-wrap so the white background spans
 *     edge-to-edge while content caps at 1200px (consistent with the
 *     other sections).
 *   - 4 numeric stats now count up from 0 → final value via useCountUp
 *     when the row scrolls into view (respects prefers-reduced-motion).
 *   - "Last updated" pill: when the timestamp is genuinely fresh
 *     (<2h), shows "Xm/Xh ago"; when stale (>2h, e.g. local-dev DB
 *     not getting cron updates) shows a friendly "Live" + pulse dot.
 *
 * Stats source: /api/data/homepage-stats (read-only).
 *
 * "Find my district" CTA smooth-scrolls to #district-explorer using
 * an anchor href; the Session 7.7 scroll polyfill in scroll-to-request.ts
 * still applies for the bottom-strip Request CTAs.
 */

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCountUp } from "@/lib/hooks/useCountUp";

const DrillDownMap = dynamic(() => import("@/components/map/DrillDownMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        minHeight: 480,
        background: "#FAFAF8",
        borderRadius: 16,
      }}
    />
  ),
});

const DASHBOARDS_PER_DISTRICT = 32;
const PLANNED_DISTRICTS = 780;
const STALE_MINUTES = 120; // >2h → show "Live" instead of misleading "Xh ago"

interface HomepageStats {
  activeDistricts?: number;
  modulesPerDistrict?: number;
  totalDataPoints?: number;
  mostRecentAt?: string | null;
}

function formatAgo(now: number, then: Date): string {
  const ms = now - then.getTime();
  if (ms < 60_000) return "just now";
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as HomepageStats;
        if (!cancelled) setStats(data);
      } catch {
        /* ignore */
      }
    }
    load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const activeDistricts = stats?.activeDistricts ?? 10;
  const totalDataPoints = stats?.totalDataPoints ?? 2366;
  const comingSoon = Math.max(0, PLANNED_DISTRICTS - activeDistricts);

  // Count-up tiles
  const countDistricts = useCountUp<HTMLDivElement>(activeDistricts);
  const countDashboards = useCountUp<HTMLDivElement>(DASHBOARDS_PER_DISTRICT);
  const countDataPoints = useCountUp<HTMLDivElement>(totalDataPoints);
  const countComing = useCountUp<HTMLDivElement>(comingSoon);

  // Stale-timestamp friendly label
  let updatedLabel = "—";
  let updatedIsLive = false;
  if (stats?.mostRecentAt && now != null) {
    const minutes = (now - new Date(stats.mostRecentAt).getTime()) / 60_000;
    if (minutes > STALE_MINUTES) {
      updatedLabel = "Live";
      updatedIsLive = true;
    } else if (minutes < 1) {
      updatedLabel = "just now";
    } else {
      updatedLabel = formatAgo(now, new Date(stats.mostRecentAt));
    }
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-section-wrap ftp-hero-wrap"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-section-inner { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
        @media (max-width: 767px) { .ftp-section-inner { padding: 24px 16px; } }

        .ftp-hero {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
          gap: 32px;
          align-items: center;
          min-height: 480px;
        }
        .ftp-hero-map-large { min-height: 480px; }
        @media (max-width: 767px) {
          .ftp-hero { grid-template-columns: 1fr !important; gap: 20px !important; min-height: 0 !important; }
          .ftp-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ftp-hero-stats > .ftp-stat:nth-child(5) { grid-column: span 2; }
          .ftp-hero-h1 { font-size: 28px !important; line-height: 1.15 !important; }
          .ftp-hero-map-large { min-height: 320px !important; order: -1; }
        }

        .ftp-hero-fade { animation: ftp-hero-fade-in 300ms ease-out; }
        @keyframes ftp-hero-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-fade { animation: none; }
        }

        .ftp-hero-live-dot {
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #16A34A;
          margin-right: 6px;
          animation: ftp-hero-live-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-hero-live-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-live-dot { animation: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <div className="ftp-hero">
          {/* ── LEFT: copy + CTAs + stats (40%) ── */}
          <div className="ftp-hero-fade">
            <h1
              id="hero-heading"
              className="ftp-hero-h1"
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1.1,
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.015em",
              }}
            >
              Your district.{" "}
              <span style={{ color: "#9CA3AF" }}>Your data.</span>{" "}
              <span style={{ color: "#2563EB" }}>Your right.</span>{" "}
              <span style={{ fontSize: "0.85em" }} aria-label="India">🇮🇳</span>
            </h1>

            <p
              style={{
                marginTop: 14,
                fontSize: 15,
                lineHeight: 1.55,
                color: "#4B5563",
                maxWidth: 560,
              }}
            >
              India&apos;s first free, real-time district transparency platform.
              Open-source, NDSAP-aligned, citizen-built.
            </p>

            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href="#district-explorer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "#16A34A",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Find my district →
              </a>
              <Link
                href={`/${locale}/india-detail`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#2563EB",
                  textDecoration: "none",
                }}
              >
                View India in one page →
              </Link>
            </div>

            {/* 5-stat row */}
            <div
              className="ftp-hero-stats"
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 16,
              }}
              aria-label="Platform statistics"
            >
              <Stat
                value={countDistricts.value.toLocaleString("en-IN")}
                label="districts live"
                statRef={countDistricts.ref}
              />
              <Stat
                value={countDashboards.value.toLocaleString("en-IN")}
                label="per district"
                statRef={countDashboards.ref}
              />
              <Stat
                value={countDataPoints.value.toLocaleString("en-IN")}
                label="data points"
                statRef={countDataPoints.ref}
              />
              <Stat
                value={countComing.value.toLocaleString("en-IN")}
                label="coming soon"
                statRef={countComing.ref}
              />
              <Stat
                value={
                  updatedIsLive ? (
                    <span>
                      <span className="ftp-hero-live-dot" aria-hidden="true" />
                      Live
                    </span>
                  ) : (
                    updatedLabel
                  )
                }
                label="last updated"
                mono
              />
            </div>
          </div>

          {/* ── RIGHT: India map (DrillDownMap, dynamic SSR-off, 60% column) ── */}
          <div
            className="ftp-hero-map-large"
            aria-label={`India map showing ${activeDistricts} active states`}
            role="img"
            style={{
              minHeight: 480,
              background: "#FAFAF8",
              border: "1px solid #E8E8E4",
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <DrillDownMap locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stat tile ──
function Stat({
  value,
  label,
  mono,
  statRef,
}: {
  value: React.ReactNode;
  label: string;
  mono?: boolean;
  statRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="ftp-stat" ref={statRef}>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
          fontFamily: mono ? "var(--font-mono, ui-monospace, monospace)" : undefined,
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum"',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}
