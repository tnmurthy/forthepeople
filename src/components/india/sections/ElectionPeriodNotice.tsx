/**
 * ElectionPeriodNotice — amber banner shown on /en/india/category/governance
 * during the Model Code of Conduct (MCC) period.
 *
 * Driven by NEXT_PUBLIC_ELECTION_MODE: 'on' | 'pending' | 'off'.
 * Returns null when 'off' (no banner rendered).
 */

import * as React from "react";

export interface ElectionPeriodNoticeProps {
  className?: string;
}

export function ElectionPeriodNotice({ className }: ElectionPeriodNoticeProps) {
  const mode = process.env.NEXT_PUBLIC_ELECTION_MODE;
  if (mode !== "on" && mode !== "pending") {
    return null;
  }

  const headline =
    mode === "on" ? "Election Period · Model Code of Conduct active" : "Election period approaching";
  const body =
    mode === "on"
      ? "Decisions involving electoral data are paused per the Election Commission of India's Model Code of Conduct. ForThePeople surfaces ECI press releases only during this window."
      : "The Election Commission may notify the Model Code of Conduct shortly. Some governance modules will switch to ECI-only sourcing once notified.";

  return (
    <div
      className={className}
      role="note"
      style={{
        background: "#FAEEDA",
        borderLeft: "3px solid #BA7517",
        borderRadius: "var(--border-radius-md)",
        padding: "12px 14px",
        marginBottom: "1rem",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 500, color: "#633806", marginBottom: "4px" }}>
        {headline}
      </div>
      <p style={{ fontSize: "12px", color: "#854F0B", margin: 0, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

export default ElectionPeriodNotice;
