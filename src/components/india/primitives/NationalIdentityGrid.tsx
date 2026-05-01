/**
 * NationalIdentityGrid — 3×2 mini-grid of national identity facts.
 *
 * File 48 §Section 2 hero v8. Six static facts (Capital / Currency / National
 * animal / National bird / National flower / National tree). Renders below the
 * Preamble CTA in the hero left column.
 *
 * Phase 5 TODO: lift the data into a registry (e.g. src/lib/india/national-identity.ts)
 * so it can be edited without touching this component.
 */

import * as React from "react";
import {
  Bird,
  Building,
  Flower,
  IndianRupee,
  PawPrint,
  Trees,
  type LucideIcon,
} from "lucide-react";

interface IdentityCell {
  label: string;
  icon: LucideIcon;
  glyph: string;
  value: string;
}

const CELLS: IdentityCell[] = [
  { label: "Capital",        icon: Building,    glyph: "🏛", value: "New Delhi" },
  { label: "Currency",       icon: IndianRupee, glyph: "₹",  value: "Indian Rupee" },
  { label: "National animal",icon: PawPrint,    glyph: "🐅", value: "Bengal Tiger" },
  { label: "National bird",  icon: Bird,        glyph: "🦚", value: "Indian Peacock" },
  { label: "National flower",icon: Flower,      glyph: "🪷", value: "Lotus" },
  { label: "National tree",  icon: Trees,       glyph: "🌳", value: "Banyan" },
];

export function NationalIdentityGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        background: "rgba(0,0,0,0.08)",
        border: "0.5px solid rgba(0,0,0,0.10)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "10px",
      }}
    >
      {CELLS.map((cell) => {
        const Icon = cell.icon;
        return (
          <div
            key={cell.label}
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10.5px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                marginBottom: "2px",
              }}
            >
              {cell.label}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              <Icon size={13} style={{ color: "#185FA5", flexShrink: 0 }} />
              <span aria-hidden style={{ fontSize: "13px" }}>
                {cell.glyph}
              </span>
              <span>{cell.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NationalIdentityGrid;
