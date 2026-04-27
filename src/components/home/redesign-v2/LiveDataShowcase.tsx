/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — LiveDataShowcase. District chip tabs + 4 module cards.
 *
 * Per slim-core scope:
 *   - District SVG slot at /districts/<slug>.svg with a generic fallback
 *     pin icon. Drop new SVGs in to upgrade. (See public/districts/.gitkeep)
 *   - 4 cards always render with skeletons; if a module API is offline,
 *     the card shows "Data temporarily unavailable" but the View-all link
 *     still routes to the district module page.
 *   - Cross-fade on tab switch (250ms; respects prefers-reduced-motion).
 */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDistrictIcon } from "@/components/district/icons";

interface ActiveDistrict {
  slug: string;
  name: string;
  nameLocal?: string | null;
  tagline?: string | null;
  stateSlug: string;
  stateName: string;
}

export interface LiveDataShowcaseProps {
  locale: string;
  districts: ActiveDistrict[];
}

type ModuleData = {
  loading: boolean;
  failed: boolean;
  text: string;
};

type DistrictModuleSet = {
  crops: ModuleData;
  infra: ModuleData;
  news: ModuleData;
  weather: ModuleData;
};

const EMPTY_SET: DistrictModuleSet = {
  crops:   { loading: true, failed: false, text: "" },
  infra:   { loading: true, failed: false, text: "" },
  news:    { loading: true, failed: false, text: "" },
  weather: { loading: true, failed: false, text: "" },
};

export default function LiveDataShowcase({ locale, districts }: LiveDataShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [moduleData, setModuleData] = useState<Record<string, DistrictModuleSet>>({});
  const [svgExists, setSvgExists] = useState<Record<string, boolean>>({});

  const active = districts[activeIdx];

  // Fetch the 4 modules for the active district when chip changes.
  useEffect(() => {
    if (!active) return;
    if (moduleData[active.slug] && !moduleData[active.slug].crops.loading) return;

    let cancelled = false;
    const slug = active.slug;
    const stateSlug = active.stateSlug;

    async function fetchModule(path: string): Promise<{ ok: boolean; data: unknown }> {
      try {
        const res = await fetch(`/api/data/${path}?state=${stateSlug}&district=${slug}`);
        if (!res.ok) return { ok: false, data: null };
        return { ok: true, data: await res.json() };
      } catch {
        return { ok: false, data: null };
      }
    }

    async function loadAll() {
      const [cropsR, weatherR, newsR, infraR] = await Promise.all([
        fetchModule("crops"),
        fetchModule("weather"),
        fetchModule("news"),
        fetchModule("infrastructure-projects"),
      ]);
      if (cancelled) return;

      const set: DistrictModuleSet = {
        crops:   summarizeCrops(cropsR),
        weather: summarizeWeather(weatherR),
        news:    summarizeNews(newsR),
        infra:   summarizeInfra(infraR),
      };

      setModuleData((prev) => ({ ...prev, [slug]: set }));
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [active, moduleData]);

  // Probe whether per-district SVG exists (HEAD request to /districts/<slug>.svg).
  useEffect(() => {
    if (!active) return;
    if (active.slug in svgExists) return;
    let cancelled = false;
    fetch(`/districts/${active.slug}.svg`, { method: "HEAD" })
      .then((r) => {
        if (cancelled) return;
        setSvgExists((prev) => ({ ...prev, [active.slug]: r.ok }));
      })
      .catch(() => {
        if (cancelled) return;
        setSvgExists((prev) => ({ ...prev, [active.slug]: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [active, svgExists]);

  const set = useMemo<DistrictModuleSet>(() => {
    if (!active) return EMPTY_SET;
    return moduleData[active.slug] ?? EMPTY_SET;
  }, [active, moduleData]);

  if (!active) return null;

  const districtPageBase = `/${locale}/${active.stateSlug}/${active.slug}`;
  const hasSvg = svgExists[active.slug] === true;

  return (
    <section
      aria-labelledby="livedata-heading"
      className="ftp-section-wrap ftp-livedata-wrap"
      style={{ borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        /* Session 16 v10 Phase G (Fix #8): rich card design with accent stripes */
        .ftp-livedata-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
          gap: 16px;
        }
        .ftp-livedata-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.2;
        }
        .ftp-live-pulse {
          width: 8px; height: 8px;
          background: #10B981;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
          animation: ftp-livedata-live-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-livedata-live-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.85); opacity: 0.6; }
        }
        .ftp-livedata-sub {
          font-size: 12px;
          color: #6B7280;
          margin: 4px 0 0;
        }
        .ftp-livedata-cta {
          font-size: 13px;
          font-weight: 600;
          color: #2563EB;
          text-decoration: none;
          white-space: nowrap;
        }
        .ftp-livedata-cta:hover { text-decoration: underline; text-underline-offset: 3px; }

        .ftp-livedata-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          padding-bottom: 4px;
        }
        .ftp-livedata-tabs::-webkit-scrollbar { height: 4px; }
        .ftp-livedata-tab {
          flex-shrink: 0;
          padding: 6px 14px;
          background: #F0F7FF;
          border: 1px solid #DBEAFE;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          color: #4B5563;
          cursor: pointer;
          white-space: nowrap;
          transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
        }
        .ftp-livedata-tab:hover {
          background: #DBEAFE;
          border-color: #2563EB;
        }
        .ftp-livedata-tab-active {
          background: #2563EB;
          border-color: #2563EB;
          color: #FFFFFF;
        }

        .ftp-livedata-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .ftp-data-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 16px;
          text-decoration: none;
          color: #1A1A1A;
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
          position: relative;
          overflow: hidden;
          min-height: 180px;
        }
        .ftp-data-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--card-accent);
        }
        .ftp-data-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px var(--card-shadow);
          border-color: var(--card-accent);
        }
        .ftp-data-card-emerald { --card-accent: #10B981; --card-shadow: rgba(16,185,129,0.15); }
        .ftp-data-card-blue    { --card-accent: #2563EB; --card-shadow: rgba(37,99,235,0.15); }
        .ftp-data-card-amber   { --card-accent: #EAB308; --card-shadow: rgba(234,179,8,0.15); }
        .ftp-data-card-cyan    { --card-accent: #06B6D4; --card-shadow: rgba(6,182,212,0.15); }

        .ftp-data-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .ftp-data-card-icon { font-size: 18px; line-height: 1; }
        .ftp-data-card-title {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--card-accent);
        }
        .ftp-data-card-body {
          flex: 1;
          font-size: 12px;
          color: #1A1A1A;
          line-height: 1.5;
        }
        .ftp-data-card-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: #9B9B9B;
          gap: 2px;
        }
        .ftp-data-card-empty-sub { font-size: 10px; color: #B5B5B5; }
        .ftp-data-card-loading {
          color: #9B9B9B;
          font-style: italic;
        }
        .ftp-data-card-footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid #E5E7EB;
          font-size: 11px;
          font-weight: 700;
          color: var(--card-accent);
        }

        .ftp-livedata-fade { animation: ftp-livedata-fade 250ms ease-out; }
        @keyframes ftp-livedata-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 767px) {
          .ftp-livedata-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .ftp-livedata-header-row { flex-direction: column; align-items: flex-start; gap: 8px; }
          .ftp-data-card { padding: 12px; min-height: 140px; }
          .ftp-data-card-title { font-size: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-data-card { transition: none; }
          .ftp-data-card:hover { transform: none; }
          .ftp-livedata-fade { animation: none; }
          .ftp-live-pulse { animation: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        {/* ── Header row ── */}
        <div className="ftp-livedata-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
            <DistrictAvatar slug={active.slug} hasSvg={hasSvg} />
            <div style={{ minWidth: 0 }}>
              <h2 id="livedata-heading" className="ftp-livedata-title">
                <span className="ftp-live-pulse" aria-hidden="true" />
                Live data right now — {active.name}
              </h2>
              <p className="ftp-livedata-sub">
                {active.nameLocal && (
                  <span style={{ fontFamily: "var(--font-regional, var(--font-sans))" }}>
                    {active.nameLocal}
                  </span>
                )}
                {active.nameLocal && active.tagline && <span> · </span>}
                {active.tagline && <span>{active.tagline}</span>}
                {(active.nameLocal || active.tagline) && <span> · </span>}
                <span>{active.stateName}</span>
              </p>
            </div>
          </div>
          <Link href={districtPageBase} className="ftp-livedata-cta">
            View full district →
          </Link>
        </div>

        {/* ── District tabs ── */}
        <div className="ftp-livedata-tabs" role="tablist" aria-label="Select district">
          {districts.map((d, i) => (
            <button
              key={d.slug}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              className={`ftp-livedata-tab ${i === activeIdx ? "ftp-livedata-tab-active" : ""}`}
              type="button"
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* ── 4 module cards (color-coded accents) ── */}
        <div className="ftp-livedata-grid ftp-livedata-fade" key={active.slug}>
          <DataCard
            accent="emerald"
            icon="🌾"
            title="Crop prices"
            data={set.crops}
            href={`${districtPageBase}/crops`}
          />
          <DataCard
            accent="blue"
            icon="🛣️"
            title="Infrastructure"
            data={set.infra}
            href={`${districtPageBase}/infrastructure`}
          />
          <DataCard
            accent="amber"
            icon="📰"
            title="Local news"
            data={set.news}
            href={`${districtPageBase}/news`}
          />
          <DataCard
            accent="cyan"
            icon="🌦️"
            title="Weather"
            data={set.weather}
            href={`${districtPageBase}/weather`}
          />
        </div>
      </div>
    </section>
  );
}

function DistrictAvatar({ slug, hasSvg }: { slug: string; hasSvg: boolean }) {
  const SIZE = 56;
  // Session 19.2 Phase F: prefer the per-district registry icon.
  // Falls back to /districts/<slug>.svg file (if hosted) and finally
  // to the generic location pin.
  const RegistryIcon = getDistrictIcon(slug);
  if (RegistryIcon) {
    return (
      <div
        className="ftp-livedata-active-icon-wrap"
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background: "#FAFAF8",
          border: "1px solid #E8E8E4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: 8,
        }}
      >
        <RegistryIcon
          size={36}
          className="ftp-livedata-active-icon"
          aria-label={`${slug} icon`}
        />
      </div>
    );
  }
  if (hasSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/districts/${slug}.svg`}
        alt=""
        width={SIZE}
        height={SIZE}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          background: "#FAFAF8",
          border: "1px solid #E8E8E4",
          padding: 6,
          flexShrink: 0,
        }}
      />
    );
  }
  // Fallback: generic location-pin SVG
  return (
    <div
      aria-hidden="true"
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: "1px solid #BFDBFE",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    </div>
  );
}

type AccentColor = "emerald" | "blue" | "amber" | "cyan";

function DataCard({
  accent,
  icon,
  title,
  data,
  href,
}: {
  accent: AccentColor;
  icon: string;
  title: string;
  data: ModuleData;
  href: string;
}) {
  return (
    <Link href={href} className={`ftp-data-card ftp-data-card-${accent}`}>
      <div className="ftp-data-card-header">
        <span className="ftp-data-card-icon" aria-hidden="true">{icon}</span>
        <h3 className="ftp-data-card-title">{title}</h3>
      </div>
      <div className="ftp-data-card-body">
        {data.loading ? (
          <span className="ftp-data-card-loading">Loading…</span>
        ) : data.failed ? (
          <div className="ftp-data-card-empty">
            <span>📭 Data syncing</span>
            <span className="ftp-data-card-empty-sub">Refreshing every 5–30 min</span>
          </div>
        ) : (
          data.text
        )}
      </div>
      <div className="ftp-data-card-footer">View all →</div>
    </Link>
  );
}

// ── Tolerant summarizers — each module endpoint shape varies; we render
// the best summary we can from whatever the API returns. ──

type Maybe<T> = T | null | undefined;

function summarizeCrops(r: { ok: boolean; data: unknown }): ModuleData {
  if (!r.ok) return { loading: false, failed: true, text: "" };
  const d = r.data as { items?: Array<{ commodity?: string; modalPrice?: number }>; data?: Array<{ commodity?: string; modalPrice?: number }> };
  const list = d.items ?? d.data ?? [];
  const top3 = list.slice(0, 3).filter((c) => c.commodity);
  if (top3.length === 0) return { loading: false, failed: false, text: "No active commodities today." };
  const text = top3
    .map((c) =>
      c.modalPrice
        ? `${c.commodity} ₹${c.modalPrice.toLocaleString("en-IN")}`
        : c.commodity ?? ""
    )
    .join(" · ");
  return { loading: false, failed: false, text };
}

function summarizeInfra(r: { ok: boolean; data: unknown }): ModuleData {
  if (!r.ok) return { loading: false, failed: true, text: "" };
  const d = r.data as { items?: Array<unknown>; projects?: Array<unknown>; total?: number };
  const projects = d.items ?? d.projects ?? [];
  const total = d.total ?? projects.length;
  if (total === 0) return { loading: false, failed: false, text: "No active projects logged." };
  return { loading: false, failed: false, text: `${total} active project${total === 1 ? "" : "s"} on record.` };
}

function summarizeNews(r: { ok: boolean; data: unknown }): ModuleData {
  if (!r.ok) return { loading: false, failed: true, text: "" };
  const d = r.data as { items?: Array<{ title?: string }>; news?: Array<{ title?: string }> };
  const items = d.items ?? d.news ?? [];
  const top2 = items.slice(0, 2).map((n) => n.title).filter(Boolean) as string[];
  if (top2.length === 0) return { loading: false, failed: false, text: "No fresh stories today." };
  const truncated = top2.map((t) => (t.length > 50 ? t.slice(0, 47) + "…" : t));
  return { loading: false, failed: false, text: `${items.length} stor${items.length === 1 ? "y" : "ies"} · ${truncated.join(" · ")}` };
}

function summarizeWeather(r: { ok: boolean; data: unknown }): ModuleData {
  if (!r.ok) return { loading: false, failed: true, text: "" };
  const d = r.data as {
    current?: { temperatureC?: number; humidity?: number; condition?: string };
    temperatureC?: number;
    humidity?: number;
  };
  const t = d.current?.temperatureC ?? d.temperatureC;
  const h = d.current?.humidity ?? d.humidity;
  const cond: Maybe<string> = d.current?.condition;
  if (t == null && h == null) return { loading: false, failed: false, text: "Weather data warming up." };
  const parts: string[] = [];
  if (t != null) parts.push(`${Math.round(t)}°C${cond ? " " + cond : ""}`);
  if (h != null) parts.push(`Humidity ${h}%`);
  return { loading: false, failed: false, text: parts.join(" · ") };
}
