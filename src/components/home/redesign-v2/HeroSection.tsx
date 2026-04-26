/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — homepage hero.
 *   - Layout: 60% map LEFT / 40% text RIGHT (was 55/45 in v6)
 *   - No inline stats — those moved to the StatsBar above the hero
 *   - 2 CTAs: primary "Find my district →" + secondary "Browse all 10 →"
 *   - DrillDownMap unchanged — only its placement and CSS wrapper change
 *   - Responds to prefers-reduced-motion on hover transforms + fade-in
 */

"use client";

import dynamic from "next/dynamic";

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

export interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="ftp-section-wrap ftp-hero-wrap"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-hero {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: 32px;
          align-items: center;
          min-height: 480px;
          max-height: calc(100vh - 240px);
          padding: 32px 24px;
        }
        .ftp-hero-map-large {
          width: 100%;
          height: 100%;
          min-height: 420px;
          max-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #FAFAF8;
          border: 1px solid #E8E8E4;
          border-radius: 16px;
        }
        .ftp-hero-map-large svg {
          width: 100%;
          height: 100%;
          max-height: 520px;
        }
        .ftp-hero-text {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ftp-hero-h1 {
          margin: 0;
          font-size: 36px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #1A1A1A;
        }
        .ftp-hero-subtitle {
          margin: 0;
          font-size: 15px;
          color: #4B5563;
          line-height: 1.6;
          max-width: 520px;
        }
        .ftp-hero-ctas {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ftp-hero-cta-primary {
          background: #10B981;
          color: #FFFFFF;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: transform 200ms ease, background 150ms ease;
        }
        .ftp-hero-cta-primary:hover {
          background: #059669;
          transform: scale(1.02);
        }
        .ftp-hero-cta-secondary {
          color: #2563EB;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          padding: 10px 12px;
        }
        .ftp-hero-cta-secondary:hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        @media (max-width: 767px) {
          .ftp-hero {
            grid-template-columns: 1fr;
            max-height: none;
            min-height: auto;
            padding: 20px 16px;
          }
          .ftp-hero-map-large {
            order: -1;
            min-height: 280px;
            max-height: 360px;
          }
          .ftp-hero-h1 { font-size: 28px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-hero-cta-primary { transition: none; }
          .ftp-hero-cta-primary:hover { transform: none; }
        }
      `}</style>

      <div className="ftp-hero">
        <div
          className="ftp-hero-map-large"
          aria-label="India map showing active states"
          role="img"
        >
          <DrillDownMap locale={locale} />
        </div>

        <div className="ftp-hero-text">
          <h1 id="hero-heading" className="ftp-hero-h1">
            Your district.{" "}
            <span style={{ color: "#9CA3AF" }}>Your data.</span>{" "}
            <span style={{ color: "#2563EB" }}>Your right.</span>{" "}
            <span style={{ fontSize: "0.85em" }} aria-label="India">🇮🇳</span>
          </h1>
          <p className="ftp-hero-subtitle">
            India&apos;s first free, real-time district transparency platform.
            Open-source, NDSAP-aligned, citizen-built.
          </p>
          <div className="ftp-hero-ctas">
            <a href="#live-districts" className="ftp-hero-cta-primary">
              Find my district →
            </a>
            <a href="#live-districts" className="ftp-hero-cta-secondary">
              Browse all 10 districts →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
