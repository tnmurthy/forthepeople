/**
 * /en hero — Session 4 refresh.
 *
 * Three-line display headline + sub-headline + four animated counter
 * cards + solid-blue CTA pill linking to /india.
 *
 * Server component shell; AnimatedCounter is the only client island.
 *
 * Replaces the role of the previous HomepageStats stat row (which was
 * embedded inside HomeDrilldown). When this component is mounted on
 * /en, HomeDrilldown receives `heroShown=true` and skips its internal
 * HomepageStats render.
 */

import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { NewPill } from "@/components/ui/NewPill";

export function HeroIndia({
  locale,
  activeDistricts,
  modulesPerDistrict = 29,
  plannedDistricts = 780,
}: {
  locale: string;
  activeDistricts: number;
  modulesPerDistrict?: number;
  plannedDistricts?: number;
}) {
  const dataPoints = activeDistricts * modulesPerDistrict * 8; // 8 = avg live points per dashboard
  return (
    <section
      style={{
        background: "#FAFAF8",
        padding: "32px 16px 28px",
      }}
      className="md:py-12"
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Headline — 3 lines, large display */}
        <h1
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            fontFamily: "var(--font-plus-jakarta, system-ui, sans-serif)",
          }}
          className="md:!text-[64px]"
        >
          Your district.
          <br />
          Your data.
          <br />
          <span style={{ color: "#2563EB" }}>Your right.</span>
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 16,
            lineHeight: 1.55,
            color: "#4B4B4B",
            maxWidth: 620,
            fontWeight: 400,
          }}
          className="md:text-[19px]"
        >
          The first independent citizen-built transparency platform for Indian
          districts. Refreshed every 5–30 minutes from official sources.
        </p>

        {/* Stat cards — 2×2 mobile, 4-up desktop */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
          className="md:grid-cols-4 md:gap-4"
        >
          <StatCard
            value={<AnimatedCounter value={activeDistricts} />}
            label="Live districts"
          />
          <StatCard
            value={<AnimatedCounter value={modulesPerDistrict} />}
            label="Dashboards each"
          />
          <StatCard
            value={<AnimatedCounter value={dataPoints} />}
            label="Data points tracked"
          />
          <StatCard
            value={<AnimatedCounter value={plannedDistricts} suffix="+" />}
            label="Districts planned"
          />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <Link
            href={`/${locale}/india`}
            className="hero-cta-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 22px",
              minHeight: 44,
              background: "#2563EB",
              color: "#FFFFFF",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(37, 99, 235, 0.18), 0 4px 14px rgba(37, 99, 235, 0.22)",
              letterSpacing: "0.005em",
              transition: "background-color 150ms ease, transform 150ms ease",
            }}
          >
            <Globe size={16} aria-hidden="true" />
            <span>View India in one page</span>
            <ArrowRight size={15} aria-hidden="true" className="hero-cta-arrow" />
            <NewPill slug="india" />
          </Link>
        </div>

        {/* Hover affordance — subtle arrow nudge */}
        <style>{`
          .hero-cta-pill:hover { background: #1D4ED8 !important; }
          .hero-cta-pill:hover .hero-cta-arrow { transform: translateX(2px); transition: transform 120ms ease-out; }
        `}</style>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderRadius: 12,
        padding: "16px 14px",
        textAlign: "center",
        minWidth: 0,
      }}
      className="md:p-5"
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#2563EB",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
        }}
        className="md:!text-[40px]"
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 11,
          fontWeight: 600,
          color: "#6B7280",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
        className="md:text-[12px]"
      >
        {label}
      </div>
    </div>
  );
}
