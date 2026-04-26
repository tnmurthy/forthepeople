/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — homepage hero.
 * Session 11.6 v6 simplification:
 *   - Layout flipped to 55 (map-LEFT) / 45 (text-RIGHT). Map dominates.
 *   - 5-stat row trimmed to 3 stats (dropped "32 per district" and the
 *     "Last updated" tile — the latter is already in the header pill).
 *   - "View India in one page →" secondary CTA dropped (page is empty).
 *   - DrillDownMap (the existing react-simple-maps wrapper) is the
 *     LEFT column. Same component as before — only placement flipped.
 *   - Wrapped in .ftp-section-wrap so the white background spans
 *     edge-to-edge while content caps at 1200px.
 *
 * Stats source: /api/data/homepage-stats (read-only).
 */

"use client";

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

const PLANNED_DISTRICTS = 780;

interface HomepageStats {
  activeDistricts?: number;
  modulesPerDistrict?: number;
  totalDataPoints?: number;
  mostRecentAt?: string | null;
}

export interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const [stats, setStats] = useState<HomepageStats | null>(null);

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
    return () => {
      cancelled = true;
    };
  }, []);

  const activeDistricts = stats?.activeDistricts ?? 10;
  const totalDataPoints = stats?.totalDataPoints ?? 2366;
  const comingSoon = Math.max(0, PLANNED_DISTRICTS - activeDistricts);

  const countDistricts = useCountUp<HTMLDivElement>(activeDistricts);
  const countDataPoints = useCountUp<HTMLDivElement>(totalDataPoints);
  const countComing = useCountUp<HTMLDivElement>(comingSoon);

  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-section-wrap ftp-hero-wrap"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-hero {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 32px;
          align-items: center;
          min-height: 480px;
          max-height: calc(100vh - 200px);
        }
        .ftp-hero-map-large {
          width: 100%;
          height: 100%;
          min-height: 380px;
          max-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ftp-hero-map-large svg {
          width: 100%;
          height: 100%;
          max-height: 480px;
        }
        .ftp-hero-text {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ftp-hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 16px;
          margin-top: 4px;
          border-top: 0.5px solid #E5E7EB;
        }
        @media (max-width: 767px) {
          .ftp-hero {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            min-height: 0 !important;
            max-height: none !important;
          }
          .ftp-hero-map-large {
            order: -1;
            min-height: 280px !important;
            max-height: 360px !important;
          }
          .ftp-hero-map-large svg { max-height: 360px; }
          .ftp-hero-h1 { font-size: 28px !important; line-height: 1.15 !important; }
        }

        .ftp-hero-fade { animation: ftp-hero-fade-in 300ms ease-out; }
        @keyframes ftp-hero-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-fade { animation: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <div className="ftp-hero">
          {/* ── LEFT: India map (55%) ── */}
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

          {/* ── RIGHT: copy + CTA + 3-stat row (45%) ── */}
          <div className="ftp-hero-text ftp-hero-fade">
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
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: "#4B5563",
                maxWidth: 560,
              }}
            >
              India&apos;s first free, real-time district transparency platform.
              Open-source, NDSAP-aligned, citizen-built.
            </p>

            <div>
              <a
                href="#live-districts"
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
            </div>

            {/* 3-stat row (was 5; dropped "32 per district" + "Last updated") */}
            <div className="ftp-hero-stats" aria-label="Platform statistics">
              <Stat
                value={countDistricts.value.toLocaleString("en-IN")}
                label="districts live"
                statRef={countDistricts.ref}
              />
              <Stat
                value={countDataPoints.value.toLocaleString("en-IN")}
                label="data points"
                statRef={countDataPoints.ref}
              />
              <Stat
                value={countComing.value.toLocaleString("en-IN")}
                label="coming"
                statRef={countComing.ref}
              />
            </div>
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
  statRef,
}: {
  value: React.ReactNode;
  label: string;
  statRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="ftp-stat" ref={statRef}>
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
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
