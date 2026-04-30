/**
 * IndiaInTheWorldCard — homepage rankings card.
 *
 * File 38 + file 45 §4 Level 1. 8 verified rankings shown in 2-col grid.
 * Static seed sourced from external authorities (IMF, UN, UNESCO, IRENA, ISRO).
 */

import * as React from "react";
import rawRankings from "@/data/india-world-rankings.json";

interface RankingMovement {
  kind: "up" | "down" | "stable" | "new";
  from?: number;
}

interface RankingEntry {
  rank: number;
  title: string;
  source: string;
  year: string;
  annotation?: string;
  movement: RankingMovement;
}

const rankings = (rawRankings as { rankings: RankingEntry[] }).rankings;

function tierColor(rank: number): string {
  if (rank === 1) return "#185FA5";
  if (rank === 2 || rank === 3) return "#0F6E56";
  if (rank === 4) return "#854F0B";
  return "#3C3489";
}

function MovementChip({ movement }: { movement: RankingMovement }) {
  if (movement.kind === "stable") {
    return (
      <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>— stable</span>
    );
  }
  if (movement.kind === "new") {
    return (
      <span style={{ fontSize: "11px", color: "#185FA5" }}>new entry</span>
    );
  }
  const glyph = movement.kind === "up" ? "↑" : "↓";
  const color = movement.kind === "up" ? "#16A34A" : "#A32D2D";
  return (
    <span style={{ fontSize: "11px", color }}>
      {glyph} from #{movement.from}
    </span>
  );
}

export function IndiaInTheWorldCard() {
  return (
    <section
      style={{
        background: "var(--color-surface)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "20px 22px",
        marginTop: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "4px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "22px",
            fontWeight: 500,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          India in the world
        </h2>
        <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
          Where India ranks globally
        </span>
      </div>
      <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "0 0 14px" }}>
        Each rank cites the issuing authority and report year.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0 24px",
        }}
        className="india-rankings-grid"
      >
        {rankings.map((r, i) => {
          const improved = r.movement.kind === "up";
          return (
            <div
              key={i}
              className="india-ranking-row"
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "baseline",
                padding: "14px 12px 14px 10px",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                borderLeft: improved ? "2px solid #534AB7" : "2px solid transparent",
                transition: "background 150ms",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "22px",
                  fontWeight: 500,
                  color: tierColor(r.rank),
                  lineHeight: 1,
                  minWidth: "32px",
                }}
              >
                #{r.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                  {r.title}
                  {r.annotation && (
                    <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginLeft: "6px" }}>
                      · {r.annotation}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                  {r.source} · {r.year}
                </div>
                <div style={{ marginTop: "3px" }}>
                  <MovementChip movement={r.movement} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "14px",
          fontSize: "11px",
          color: "var(--color-text-tertiary)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{rankings.length} of 24 tracked rankings shown</span>
        <span>View all rankings ›</span>
      </div>

      <style>{`
        .india-ranking-row:hover {
          background: rgba(83, 74, 183, 0.04);
        }
        @media (max-width: 768px) {
          .india-rankings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

export default IndiaInTheWorldCard;
