/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "Awaiting first sync" empty state for a module band that's marked
 * `live` in the registry but has no IndiaIndicator rows yet (because
 * the schema isn't db-pushed, or the scraper hasn't run successfully).
 *
 * Single muted line citing the upstream source — never a fake number.
 * Per file 32 §10.
 */

import Link from "next/link";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import { INDIA_SOURCES } from "@/lib/india/india-sources";

interface Props {
  /** First source key from the module's sources array. */
  sourceKey: string;
}

export default function IndiaAwaitingSync({ sourceKey }: Props) {
  const source = INDIA_SOURCES[sourceKey];

  return (
    <div
      style={{
        padding: "20px 18px",
        background: INDIA_DESIGN.bgMuted,
        border: `1px dashed ${INDIA_DESIGN.border}`,
        borderRadius: 10,
        fontSize: 13,
        color: INDIA_DESIGN.textMuted,
        lineHeight: 1.55,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14 }}>
        ⏳
      </span>
      <span>
        <span style={{ fontWeight: 600, color: INDIA_DESIGN.textSecondary }}>
          Awaiting first sync
        </span>
        {source ? (
          <>
            {" — sourced from "}
            <Link
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INDIA_DESIGN.accentBlue, textDecoration: "none" }}
            >
              {source.name}
            </Link>
            .
          </>
        ) : (
          <> — sourced from {sourceKey}.</>
        )}
      </span>
    </div>
  );
}
