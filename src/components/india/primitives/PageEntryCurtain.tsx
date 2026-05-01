"use client";

/**
 * PageEntryCurtain — saffron + green panels slide apart on first visit per
 * session. File 48 §Section 2.2 heritage entrance.
 *
 * Once shown, the visit is recorded in sessionStorage so the curtain doesn't
 * re-trigger on intra-session navigation/reload. Reduced-motion users see
 * nothing at all (the panels are display:none via CSS).
 */

import * as React from "react";

const SESSION_KEY = "ftp-india-curtain-seen";

export function PageEntryCurtain() {
  const [shouldShow, setShouldShow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = sessionStorage.getItem(SESSION_KEY);
      if (!seen) {
        setShouldShow(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        const timer = setTimeout(() => setShouldShow(false), 1900);
        return () => clearTimeout(timer);
      }
    } catch {
      // sessionStorage may be unavailable (private mode, embedded contexts) —
      // in that case skip the curtain rather than crash.
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <div className="ftp-curtain-left" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "50%" }} />
      <div className="ftp-curtain-right" style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "50%" }} />
    </div>
  );
}

export default PageEntryCurtain;
