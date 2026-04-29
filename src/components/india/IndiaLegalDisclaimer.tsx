/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Top-of-page amber legal disclaimer for /[locale]/india. Persistent
 * within the session, dismissible per session via sessionStorage
 * (NOT localStorage — project rule).
 *
 * Distinct from the global DisclaimerBanner that the layout renders;
 * that one carries the site-wide "not an official govt website" line.
 * This one carries the india-specific "always verify at the original
 * source" line from dictionaries.india.disclaimers.top.
 */

"use client";

import { useSyncExternalStore } from "react";
import { INDIA_DESIGN } from "@/lib/india/india-design";

const STORAGE_KEY = "ftp:india-disclaimer-dismissed-v1";

interface Props {
  text: string;
}

// useSyncExternalStore hydrates correctly (SSR returns the snapshot, client
// reads sessionStorage on first paint) without the "setState-in-effect"
// anti-pattern. The store is per-component-instance because dismissal
// notifies via a Set of subscribers.
const subscribers = new Set<() => void>();
function subscribe(cb: () => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
function notify() {
  for (const cb of subscribers) cb();
}
function getSnapshot(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}
function getServerSnapshot(): boolean {
  // SSR has no sessionStorage — render visible by default. The first
  // client paint reads the real value via getSnapshot.
  return true;
}

export default function IndiaLegalDisclaimer({ text }: Props) {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Independent platform disclaimer"
      style={{
        background: INDIA_DESIGN.amberStrip,
        borderBottom: `1px solid ${INDIA_DESIGN.amberStripBorder}`,
        padding: "10px 16px",
        fontSize: 12,
        lineHeight: 1.5,
        color: "#78350F",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14, flexShrink: 0 }}>
        ⚠️
      </span>
      <span style={{ flex: 1 }}>{text}</span>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* ignore storage errors */
          }
          notify();
        }}
        aria-label="Dismiss disclaimer for this session"
        style={{
          flexShrink: 0,
          minWidth: 36,
          minHeight: 20,
          background: "transparent",
          border: "none",
          color: "#92400E",
          fontSize: 16,
          cursor: "pointer",
          padding: "0 6px",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
