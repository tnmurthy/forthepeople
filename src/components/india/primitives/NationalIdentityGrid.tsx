/**
 * NationalIdentityGrid — single-row 1×6 strip of national identity facts.
 *
 * File 48 §Section 2 hero v10. Six static facts (Capital / Currency / Animal
 * / Bird / Flower / Tree). Renders as a horizontal row below the banner block.
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
  { label: "Capital",  icon: Building,    glyph: "🏛", value: "New Delhi" },
  { label: "Currency", icon: IndianRupee, glyph: "₹",  value: "INR" },
  { label: "Animal",   icon: PawPrint,    glyph: "🐅", value: "Bengal Tiger" },
  { label: "Bird",     icon: Bird,        glyph: "🦚", value: "Peacock" },
  { label: "Flower",   icon: Flower,      glyph: "🪷", value: "Lotus" },
  { label: "Tree",     icon: Trees,       glyph: "🌳", value: "Banyan" },
];

export function NationalIdentityGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "1px",
        background: "rgba(0,0,0,0.08)",
        border: "0.5px solid rgba(0,0,0,0.10)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {CELLS.map((cell) => {
        const Icon = cell.icon;
        return (
          <div
            key={cell.label}
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "7px 8px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
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
                gap: "5px",
                fontSize: "11.5px",
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              <Icon size={11} style={{ color: "#185FA5", flexShrink: 0 }} />
              <span aria-hidden style={{ fontSize: "11px" }}>
                {cell.glyph}
              </span>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {cell.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NationalIdentityGrid;
