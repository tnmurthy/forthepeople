/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Alternative "Grid" layout for /[locale]/india. Triggered by ?view=grid.
 *
 * Composition:
 *   - 12 metric tiles up top — clicking one swaps the active metric.
 *   - Sub-toggle below: Choropleth | Bar | Table — three views of the
 *     same dataset.
 *   - Center: India choropleth (or bar / table per sub-toggle).
 *   - Right sidebar: state-specific drill (mock — Session C1 lands real
 *     IndiaStateBreakdown reads).
 *
 * Mobile (≤900px): everything stacks vertically. Sidebar collapses to
 * the bottom of the page.
 *
 * MOCK DATA — replace in Session C1 (entire state-by-state grid is
 * synthesised by src/lib/india/mock-state-data.ts).
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import IndiaChoroplethMap from "./IndiaChoroplethMap";
import IndiaMetricPicker from "./IndiaMetricPicker";
import { CATEGORY_ACCENT, INDIA_DESIGN, categoryTint } from "@/lib/india/india-design";
import {
  MOCK_METRICS,
  getMockMetric,
  getStateValuesForMetric,
} from "@/lib/india/mock-state-data";

type SubView = "map" | "bar" | "table";

interface Props {
  locale: string;
}

export default function IndiaGridView({ locale }: Props) {
  const [activeMetric, setActiveMetric] = useState<string>(MOCK_METRICS[0].key);
  const [subView, setSubView] = useState<SubView>("map");
  const [selectedStateSlug, setSelectedStateSlug] = useState<string | null>(null);

  const metric = getMockMetric(activeMetric);
  const values = useMemo(
    () => getStateValuesForMetric(activeMetric),
    [activeMetric],
  );
  const accent = metric ? CATEGORY_ACCENT[metric.category] : INDIA_DESIGN.accentBlue;

  const max = values.length ? Math.max(...values.map((v) => v.value)) : 1;
  const selectedRow = selectedStateSlug
    ? values.find((v) => v.stateSlug === selectedStateSlug) ?? null
    : null;
  const selectedRank = selectedRow
    ? values.findIndex((v) => v.stateSlug === selectedStateSlug) + 1
    : null;

  return (
    <section
      style={{
        padding: "24px 16px 48px",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <MockBanner />

      {/* 12 metric tiles */}
      <IndiaMetricPicker
        activeMetric={activeMetric}
        onSelect={(k) => setActiveMetric(k)}
      />

      {/* Sub-view toggle */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: accent,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: INDIA_DESIGN.textPrimary,
            }}
          >
            {metric?.label ?? activeMetric}
          </span>
          {metric?.unit ? (
            <span
              style={{
                fontSize: 12,
                color: INDIA_DESIGN.textFaint,
                marginLeft: 2,
              }}
            >
              ({metric.unit})
            </span>
          ) : null}
        </div>

        <div
          role="tablist"
          aria-label="Choose how to display the data"
          style={{
            display: "inline-flex",
            gap: 2,
            padding: 3,
            background: INDIA_DESIGN.bgCard,
            border: `1px solid ${INDIA_DESIGN.border}`,
            borderRadius: 8,
          }}
        >
          {(["map", "bar", "table"] as SubView[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={subView === v}
              onClick={() => setSubView(v)}
              style={{
                background: subView === v ? INDIA_DESIGN.accentBlue : "transparent",
                color: subView === v ? "#FFFFFF" : INDIA_DESIGN.textSecondary,
                border: "none",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 26,
              }}
            >
              {v === "map" ? "Choropleth" : v === "bar" ? "Bar" : "Table"}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid: visualisation (left) + sidebar (right) */}
      <div
        className="india-grid-main"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div>
          {subView === "map" ? (
            <IndiaChoroplethMap
              metricKey={activeMetric}
              selectedStateSlug={selectedStateSlug}
              onSelect={setSelectedStateSlug}
            />
          ) : subView === "bar" ? (
            <BarView
              metricKey={activeMetric}
              accent={accent}
              max={max}
              selectedStateSlug={selectedStateSlug}
              onSelect={setSelectedStateSlug}
            />
          ) : (
            <TableView
              metricKey={activeMetric}
              selectedStateSlug={selectedStateSlug}
              onSelect={setSelectedStateSlug}
            />
          )}
        </div>

        <SidebarPanel
          locale={locale}
          metric={metric}
          activeMetric={activeMetric}
          selectedRow={selectedRow}
          selectedRank={selectedRank}
          totalStates={values.length}
        />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .india-grid-main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function BarView({
  metricKey,
  accent,
  max,
  selectedStateSlug,
  onSelect,
}: {
  metricKey: string;
  accent: string;
  max: number;
  selectedStateSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const values = getStateValuesForMetric(metricKey);
  const metric = getMockMetric(metricKey);
  return (
    <div
      style={{
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        maxHeight: 720,
        overflowY: "auto",
      }}
    >
      {values.map((v, idx) => {
        const isActive = v.stateSlug === selectedStateSlug;
        const pct = max > 0 ? (v.value / max) * 100 : 0;
        return (
          <button
            key={v.stateSlug}
            type="button"
            onClick={() => onSelect(isActive ? null : v.stateSlug)}
            style={{
              background: isActive ? "#F3F4F6" : "transparent",
              border: "none",
              padding: "6px 8px",
              borderRadius: 6,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                color: INDIA_DESIGN.textPrimary,
                marginBottom: 3,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontFamily: INDIA_DESIGN.fontMono,
                    color: INDIA_DESIGN.textFaint,
                    fontSize: 11,
                    width: 22,
                    display: "inline-block",
                    textAlign: "right",
                  }}
                >
                  #{idx + 1}
                </span>
                {v.stateName}
              </span>
              <span
                style={{
                  fontFamily: INDIA_DESIGN.fontMono,
                  fontWeight: 600,
                  color: INDIA_DESIGN.textPrimary,
                }}
              >
                {v.value.toLocaleString("en-IN")}
                {metric?.unit ? (
                  <span style={{ color: INDIA_DESIGN.textFaint, marginLeft: 3 }}>
                    {metric.unit}
                  </span>
                ) : null}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "#F1F5F9",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: accent,
                  transition: "width 240ms ease",
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TableView({
  metricKey,
  selectedStateSlug,
  onSelect,
}: {
  metricKey: string;
  selectedStateSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const values = getStateValuesForMetric(metricKey);
  const metric = getMockMetric(metricKey);
  return (
    <div
      style={{
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 12,
        overflowX: "auto",
        maxHeight: 720,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr
            style={{
              background: INDIA_DESIGN.bgMuted,
              textAlign: "left",
              color: INDIA_DESIGN.textFaint,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 700,
              position: "sticky",
              top: 0,
            }}
          >
            <th style={{ padding: "10px 14px" }}>Rank</th>
            <th style={{ padding: "10px 14px" }}>State / UT</th>
            <th style={{ padding: "10px 14px", textAlign: "right" }}>
              Value{metric?.unit ? ` (${metric.unit})` : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {values.map((v, idx) => {
            const isActive = v.stateSlug === selectedStateSlug;
            return (
              <tr
                key={v.stateSlug}
                onClick={() => onSelect(isActive ? null : v.stateSlug)}
                style={{
                  borderTop: `1px solid ${INDIA_DESIGN.border}`,
                  background: isActive ? "#F3F4F6" : "transparent",
                  cursor: "pointer",
                }}
              >
                <td
                  style={{
                    padding: "8px 14px",
                    fontFamily: INDIA_DESIGN.fontMono,
                    color: INDIA_DESIGN.textMuted,
                  }}
                >
                  #{idx + 1}
                </td>
                <td style={{ padding: "8px 14px", color: INDIA_DESIGN.textPrimary }}>
                  {v.stateName}
                </td>
                <td
                  style={{
                    padding: "8px 14px",
                    textAlign: "right",
                    fontFamily: INDIA_DESIGN.fontMono,
                    fontWeight: 600,
                    color: INDIA_DESIGN.textPrimary,
                  }}
                >
                  {v.value.toLocaleString("en-IN")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SidebarPanel({
  locale,
  metric,
  activeMetric,
  selectedRow,
  selectedRank,
  totalStates,
}: {
  locale: string;
  metric: ReturnType<typeof getMockMetric>;
  activeMetric: string;
  selectedRow: { stateSlug: string; stateName: string; value: number } | null;
  selectedRank: number | null;
  totalStates: number;
}) {
  const accent = metric ? CATEGORY_ACCENT[metric.category] : INDIA_DESIGN.accentBlue;
  const tint = metric ? categoryTint(metric.category) : INDIA_DESIGN.bgMuted;
  const values = getStateValuesForMetric(activeMetric);
  const top3 = values.slice(0, 3);
  const bottom3 = values.slice(-3).reverse();

  return (
    <aside
      style={{
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "sticky",
        top: 80,
        alignSelf: "flex-start",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: INDIA_DESIGN.textFaint,
            marginBottom: 4,
          }}
        >
          State drill
        </div>
        {selectedRow ? (
          <>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: INDIA_DESIGN.textPrimary,
                lineHeight: 1.25,
              }}
            >
              {selectedRow.stateName}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: INDIA_DESIGN.textMuted,
              }}
            >
              <strong style={{ color: accent }}>#{selectedRank}</strong> of {totalStates}
              {" · "}
              <span style={{ fontFamily: INDIA_DESIGN.fontMono }}>
                {selectedRow.value.toLocaleString("en-IN")}
                {metric?.unit ? ` ${metric.unit}` : ""}
              </span>
            </div>
            <Link
              href={`/${locale}/${selectedRow.stateSlug}`}
              style={{
                display: "inline-flex",
                marginTop: 10,
                padding: "6px 10px",
                background: tint,
                color: accent,
                border: `1px solid ${accent}33`,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Open state page →
            </Link>
          </>
        ) : (
          <div
            style={{
              fontSize: 13,
              color: INDIA_DESIGN.textMuted,
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            Click a state on the map (or a row in the bar/table view) to see its
            rank + value for the active metric.
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: INDIA_DESIGN.textFaint,
            marginBottom: 6,
          }}
        >
          Top 3
        </div>
        {top3.map((v, idx) => (
          <SidebarRow key={v.stateSlug} rank={idx + 1} row={v} unit={metric?.unit ?? ""} />
        ))}
      </div>

      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: INDIA_DESIGN.textFaint,
            marginBottom: 6,
          }}
        >
          Bottom 3
        </div>
        {bottom3.map((v, idx) => (
          <SidebarRow
            key={v.stateSlug}
            rank={values.length - 2 + idx}
            row={v}
            unit={metric?.unit ?? ""}
          />
        ))}
      </div>
    </aside>
  );
}

function SidebarRow({
  rank,
  row,
  unit,
}: {
  rank: number;
  row: { stateName: string; value: number };
  unit: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 0",
        fontSize: 12,
        color: INDIA_DESIGN.textPrimary,
      }}
    >
      <span style={{ display: "inline-flex", gap: 6 }}>
        <span
          style={{
            fontFamily: INDIA_DESIGN.fontMono,
            color: INDIA_DESIGN.textFaint,
            fontSize: 11,
            width: 18,
            textAlign: "right",
          }}
        >
          #{rank}
        </span>
        {row.stateName}
      </span>
      <span
        style={{
          fontFamily: INDIA_DESIGN.fontMono,
          fontWeight: 600,
          color: INDIA_DESIGN.textPrimary,
        }}
      >
        {row.value.toLocaleString("en-IN")}
        {unit ? <span style={{ color: INDIA_DESIGN.textFaint, marginLeft: 3 }}>{unit}</span> : null}
      </span>
    </div>
  );
}

function MockBanner() {
  return (
    <div
      role="note"
      style={{
        background: INDIA_DESIGN.amberStrip,
        border: `1px solid ${INDIA_DESIGN.amberStripBorder}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 11,
        color: "#78350F",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span aria-hidden="true">🛠️</span>
      <span>
        <strong>MOCK DATA</strong> — every state-by-state value below is
        synthetic (from{" "}
        <code style={{ background: "#FEF3C7", padding: "1px 4px", borderRadius: 3 }}>
          src/lib/india/mock-state-data.ts
        </code>
        ). Real values land in Session C1 once IndiaStateBreakdown is populated.
      </span>
    </div>
  );
}
