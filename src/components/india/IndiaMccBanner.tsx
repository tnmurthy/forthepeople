/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Model Code of Conduct banner. Renders above the first elections
 * module band when NEXT_PUBLIC_ELECTION_MODE === "true". Required by
 * file 31 §4 (election period non-endorsement notice).
 *
 * Visually distinct from per-module legal notes — full-width amber band
 * to grab attention. Text comes from dictionaries.india.disclaimers.mcc.
 */

import { INDIA_DESIGN } from "@/lib/india/india-design";

interface Props {
  text: string;
}

export default function IndiaMccBanner({ text }: Props) {
  return (
    <div
      role="region"
      aria-label="Model Code of Conduct notice"
      style={{
        background: INDIA_DESIGN.amberStrip,
        border: `1px solid ${INDIA_DESIGN.amberStripBorder}`,
        borderRadius: 10,
        padding: "12px 14px",
        margin: "16px auto",
        maxWidth: INDIA_DESIGN.sectionMaxWidth,
        marginLeft: 16,
        marginRight: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }}>
        🗳️
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#92400E",
            marginBottom: 3,
          }}
        >
          Model Code of Conduct in effect
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            color: "#78350F",
            lineHeight: 1.55,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
