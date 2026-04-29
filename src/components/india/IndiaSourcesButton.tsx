/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Floating "Sources" button + side-panel host. Mounts the
 * IndiaSourcesSidePanel and toggles its open state. Always visible
 * bottom-right at any scroll position so users can verify any
 * citation in one click.
 */

"use client";

import { useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { INDIA_DESIGN } from "@/lib/india/india-design";
import IndiaSourcesSidePanel from "./IndiaSourcesSidePanel";

interface Props {
  locale: string;
}

export default function IndiaSourcesButton({ locale }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open data sources panel"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 70,
          background: INDIA_DESIGN.bgCard,
          border: `1px solid ${INDIA_DESIGN.border}`,
          borderRadius: 999,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: INDIA_DESIGN.textPrimary,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.12)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 40,
        }}
      >
        <BookOpenCheck size={16} aria-hidden="true" color={INDIA_DESIGN.accentBlue} />
        Sources
      </button>
      <IndiaSourcesSidePanel
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
      />
    </>
  );
}
