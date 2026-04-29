/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Single KPI card used inside a module band. Distinct from the hero +
 * today-snapshot tiles in that it's optimized for dense use (often 3-4
 * per band), with a slightly tighter footprint and a smaller number.
 *
 * Every card shows: label, value (mono) or "—" if null, unit, source
 * link, as-of date. Per file 32 §10.
 */

import Link from "next/link";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import { formatAsOfDate } from "@/lib/india/india-formatters";
import { INDIA_SOURCES } from "@/lib/india/india-sources";

interface Props {
  title: string;
  value: string | number | null | undefined;
  unit?: string | null;
  sourceKey: string;
  asOfDate?: string | Date | null;
  /** Optional sub-label shown above the title in faint uppercase. */
  kicker?: string;
}

export default function IndiaModuleCard({
  title,
  value,
  unit,
  sourceKey,
  asOfDate,
  kicker,
}: Props) {
  const source = INDIA_SOURCES[sourceKey];
  const display = value == null || value === "" ? "—" : String(value);
  const isPlaceholder = display === "—";

  return (
    <div
      style={{
        padding: "14px 16px",
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 12,
        minHeight: 108,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {kicker ? (
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INDIA_DESIGN.textFaint,
              marginBottom: 2,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 11,
            color: INDIA_DESIGN.textFaint,
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: isPlaceholder ? INDIA_DESIGN.textFaint : INDIA_DESIGN.textPrimary,
            fontFamily: INDIA_DESIGN.fontMono,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
          }}
        >
          {display}
          {unit && !isPlaceholder ? (
            <span style={{ fontSize: 12, color: INDIA_DESIGN.textMuted, marginLeft: 4 }}>
              {unit}
            </span>
          ) : null}
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: INDIA_DESIGN.textMuted,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {source ? (
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: INDIA_DESIGN.accentBlue, textDecoration: "none" }}
          >
            {source.name.replace(/^Ministry of /, "M/o ")}
          </Link>
        ) : (
          <span>{sourceKey}</span>
        )}
        {asOfDate ? (
          <span style={{ color: INDIA_DESIGN.textFaint }}>
            {formatAsOfDate(asOfDate)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
