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
        .ftp-livedata-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          min-height: 130px;
          transition: transform 150ms ease, border-color 150ms ease;
          text-decoration: none;
          color: #1A1A1A;
        }
        .ftp-livedata-card:hover { transform: translateY(-1px); border-color: #D1D5DB; }
        @media (prefers-reduced-motion: reduce) {
          .ftp-livedata-card { transition: none; }
          .ftp-livedata-card:hover { transform: none; }
        }
        .ftp-livedata-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 767px) {
          .ftp-livedata-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ftp-livedata-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .ftp-livedata-chips { padding: 4px 0 !important; }
        }
        .ftp-livedata-chips {
          display: flex; gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0 12px;
        }
        .ftp-livedata-chips::-webkit-scrollbar { display: none; }
        .ftp-livedata-chip {
          flex-shrink: 0;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #E8E8E4;
          background: #FFFFFF;
          color: #6B7280;
          cursor: pointer;
          transition: background 150ms;
        }
        .ftp-livedata-chip:hover { background: #F5F5F0; }
        .ftp-livedata-chip[data-active="true"] {
          background: #1A1A1A;
          color: #FFFFFF;
          border-color: #1A1A1A;
        }
        .ftp-livedata-fade {
          animation: ftp-livedata-fade 250ms ease-out;
        }
        @keyframes ftp-livedata-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-livedata-fade { animation: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
      {/* ── Header row ── */}
      <div
        className="ftp-livedata-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <DistrictAvatar slug={active.slug} hasSvg={hasSvg} />
          <div style={{ minWidth: 0 }}>
            <h2
              id="livedata-heading"
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#1A1A1A",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Live data right now — {active.name}
            </h2>
            <div style={{ marginTop: 2, fontSize: 12, color: "#6B7280" }}>
              {active.nameLocal && (
                <span style={{ fontFamily: "var(--font-regional, var(--font-sans))" }}>
                  {active.nameLocal}
                </span>
              )}
              {active.nameLocal && active.tagline && <span> · </span>}
              {active.tagline && <span>{active.tagline}</span>}
              {(active.nameLocal || active.tagline) && <span> · </span>}
              <span>{active.stateName}</span>
            </div>
          </div>
        </div>
        <Link
          href={districtPageBase}
          style={{
            color: "#2563EB",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          View full district →
        </Link>
      </div>

      {/* ── District chip tabs ── */}
      <div className="ftp-livedata-chips" role="tablist" aria-label="Select district">
        {districts.map((d, i) => (
          <button
            key={d.slug}
            role="tab"
            aria-selected={i === activeIdx}
            data-active={i === activeIdx}
            onClick={() => setActiveIdx(i)}
            className="ftp-livedata-chip"
            type="button"
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* ── 4 module cards ── */}
      <div className="ftp-livedata-grid ftp-livedata-fade" key={active.slug}>
        <ModuleCard
          icon="🌾"
          title="Crop prices"
          data={set.crops}
          href={`${districtPageBase}/crops`}
        />
        <ModuleCard
          icon="🛣️"
          title="Infrastructure"
          data={set.infra}
          href={`${districtPageBase}/infrastructure`}
        />
        <ModuleCard
          icon="📰"
          title="Local news"
          data={set.news}
          href={`${districtPageBase}/news`}
        />
        <ModuleCard
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

function ModuleCard({
  icon,
  title,
  data,
  href,
}: {
  icon: string;
  title: string;
  data: ModuleData;
  href: string;
}) {
  return (
    <Link href={href} className="ftp-livedata-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          fontWeight: 700,
          color: "#9B9B9B",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span aria-hidden="true">{icon}</span>
        {title}
      </div>
      <div style={{ marginTop: 10, flex: 1, fontSize: 13, color: "#1A1A1A", lineHeight: 1.4 }}>
        {data.loading ? (
          <span style={{ color: "#9B9B9B", fontStyle: "italic" }}>Loading…</span>
        ) : data.failed ? (
          <span style={{ color: "#9B9B9B", fontStyle: "italic" }}>Data temporarily unavailable</span>
        ) : (
          data.text
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "#2563EB", fontWeight: 500 }}>
        View all →
      </div>
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
