/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — drop-in replacement for src/components/layout/DisclaimerBar.tsx.
 *
 * Differences from the legacy banner:
 *   - sessionStorage (per-session) instead of localStorage (permanent dismiss)
 *   - left-border accent + amber-50/600/900 palette per spec
 *   - prefers-reduced-motion guard on the slide-in
 *
 * Wire-up to [locale]/layout.tsx is deferred to Phase 2.12 of Session 11.
 */

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ftp_disclaimer_v2";

export default function DisclaimerBanner() {
  // Render only after we know the dismiss state to avoid an SSR/CSR mismatch flash.
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(!dismissed);
    } catch {
      // Private mode / sandbox — show by default.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!hydrated || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Site disclaimer"
      style={{
        background: "#FAEEDA",
        borderLeft: "4px solid #BA7517",
        borderBottom: "1px solid #E8C68B",
        padding: "8px 16px",
        fontSize: 12,
        color: "#78350F",
        display: "flex",
        alignItems: "center",
        gap: 10,
        lineHeight: 1.5,
        animation: reducedMotion ? "none" : "ftp-disclaimer-slide-in 250ms ease-out",
      }}
    >
      <style>{`
        @keyframes ftp-disclaimer-slide-in {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>

      <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 14 }}>⚠</span>
      <span style={{ flex: 1 }}>
        <strong>Not an official government website.</strong>{" "}
        Data aggregated from official government portals (NDSAP), accredited
        research institutions, and verified public sources. Always verify
        critical information at the original source.
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss disclaimer for this session"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          color: "#92400E",
          padding: "0 4px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
