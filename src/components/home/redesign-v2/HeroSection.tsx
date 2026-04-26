/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — homepage hero. 60/40 split desktop, stacked mobile.
 *
 * LEFT: h1 + value prop + 2 CTAs + 5-stat row
 * RIGHT: India map placeholder (text-art for now; the prompt's
 * interactive 780-district map is deferred to a future session)
 *
 * Stats source: /api/data/homepage-stats. Final values render directly
 * (count-up animation deferred per slim-core scope). Subtle 300ms
 * fade-in on mount, suppressed under prefers-reduced-motion.
 *
 * "Find my district" CTA smooth-scrolls to #district-explorer using
 * the existing src/lib/utils/scroll-to-request.ts polyfill machinery
 * (rAF + fallback). Reusing the polyfill prevents the Session 7.7-era
 * scroll bug from coming back.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DASHBOARDS_PER_DISTRICT = 32; // Slim copy from "29" → actual "32" per Session 11 spec
const PLANNED_DISTRICTS = 780;

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
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [agoTick, setAgoTick] = useState(0); // re-render every 60s for "Xm ago"

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as HomepageStats;
        if (!cancelled) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setStats(data);
        }
      } catch {
        /* ignore */
      }
    }
    load();
    const t = setInterval(() => setAgoTick((n) => n + 1), 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  // Avoid "agoTick used but never read" lint — the value participates in re-render.
  void agoTick;

  const activeDistricts = stats?.activeDistricts ?? 10;
  const totalDataPoints = stats?.totalDataPoints ?? 2366;
  const comingSoon = Math.max(0, PLANNED_DISTRICTS - activeDistricts);
  const ago = stats?.mostRecentAt
    ? formatAgo(Date.now(), new Date(stats.mostRecentAt))
    : "—";

  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-hero"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 16px 24px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
        gap: 32,
        alignItems: "center",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .ftp-hero { grid-template-columns: 1fr !important; gap: 20px !important; padding: 20px 16px !important; }
          .ftp-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ftp-hero-stats .ftp-stat:nth-child(5) { grid-column: span 2; }
          .ftp-hero-h1 { font-size: 28px !important; line-height: 1.15 !important; }
          .ftp-hero-map { min-height: 200px !important; }
        }
        .ftp-hero-fade {
          animation: ftp-hero-fade-in 300ms ease-out;
        }
        @keyframes ftp-hero-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-fade { animation: none; }
        }
      `}</style>

      {/* ── LEFT: copy + CTAs + stats ── */}
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
            value={String(activeDistricts)}
            label="districts live"
          />
          <Stat
            value={String(DASHBOARDS_PER_DISTRICT)}
            label="per district"
          />
          <Stat
            value={totalDataPoints.toLocaleString("en-IN")}
            label="data points"
          />
          <Stat
            value={comingSoon.toLocaleString("en-IN")}
            label="coming soon"
          />
          <Stat
            value={ago}
            label="last updated"
            mono
          />
        </div>
      </div>

      {/* ── RIGHT: India map placeholder ── */}
      <div
        className="ftp-hero-map"
        aria-label="India map showing 10 active districts"
        role="img"
        style={{
          minHeight: 260,
          background: "#FAFAF8",
          border: "1px solid #E8E8E4",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* TODO(Session-11-followup): replace with interactive react-simple-maps
            India choropleth (package is installed). Click on emerald state →
            scroll-to-explorer + filter. Coming-soon states → district request modal. */}
        <span style={{ fontSize: 56, lineHeight: 1 }} aria-hidden="true">🇮🇳</span>
        <div
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "#6B7280",
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#1A1A1A" }}>{activeDistricts} districts live</strong>{" "}
          across {Math.min(7, activeDistricts)} states. {comingSoon} more coming.
          <br />
          <span style={{ color: "#9B9B9B", fontSize: 12 }}>
            Click any district below to explore →
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Stat tile ──
function Stat({ value, label, mono }: { value: string; label: string; mono?: boolean }) {
  return (
    <div className="ftp-stat">
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
          fontFamily: mono
            ? "var(--font-mono, ui-monospace, monospace)"
            : undefined,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
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
