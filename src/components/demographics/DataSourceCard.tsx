"use client";

import DataAgeChip from "./DataAgeChip";

interface DataSourceCardProps {
  source: string;
  sourceUrl?: string;
  license?: string;
  referenceYear: number;
  retrievedAt: Date;
  boundaryVintage?: string;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function DataSourceCard({
  source,
  sourceUrl,
  license,
  referenceYear,
  retrievedAt,
  boundaryVintage,
}: DataSourceCardProps) {
  return (
    <div
      style={{
        background: "#FAFAF8",
        border: "1px solid #E8E8E4",
        borderRadius: 10,
        padding: "8px 12px",
        margin: "8px 0 16px",
        fontSize: 12,
        color: "#6B6B6B",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        lineHeight: 1.6,
      }}
    >
      <span>📊</span>
      <span>
        Source: <strong style={{ color: "#4B4B4B" }}>{source}</strong>
      </span>
      <span style={{ color: "#D0D0D0" }}>•</span>
      <span>
        Ref year: <strong style={{ color: "#4B4B4B" }}>{referenceYear}</strong>
      </span>
      <span style={{ color: "#D0D0D0" }}>•</span>
      <DataAgeChip referenceYear={referenceYear} />
      {license && (
        <>
          <span style={{ color: "#D0D0D0" }}>•</span>
          <span
            title={`License: ${license}`}
            style={{
              fontSize: 10,
              padding: "1px 6px",
              border: "1px solid #E8E8E4",
              borderRadius: 4,
              color: "#9B9B9B",
              cursor: "help",
            }}
          >
            {license}
          </span>
        </>
      )}
      <span style={{ color: "#D0D0D0" }}>•</span>
      <span style={{ fontSize: 11, color: "#9B9B9B" }}>
        Retrieved: {formatDate(retrievedAt)}
      </span>
      {boundaryVintage && (
        <>
          <span style={{ color: "#D0D0D0" }}>•</span>
          <span style={{ fontSize: 11, color: "#9B9B9B" }}>
            Boundary: {boundaryVintage}
          </span>
        </>
      )}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginLeft: "auto",
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: 500,
          }}
          aria-label="Open source"
        >
          ↗
        </a>
      )}
    </div>
  );
}
