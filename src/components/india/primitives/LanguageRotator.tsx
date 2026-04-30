"use client";

/**
 * LanguageRotator — cycles a bilingual subtitle through all 22 scheduled
 * languages of India (Schedule 8 of the Constitution).
 *
 * File 48 §4.7.3. 3000ms per language. Respects prefers-reduced-motion
 * (halts on the first language — Hindi). Locks min-width to prevent
 * layout shift when scripts of different visual widths cycle through.
 * Announces changes via aria-live="polite".
 *
 * Some scripts use Devanagari ("भारत") as a placeholder for languages
 * (Bodo, Dogri, Konkani, Maithili, Sindhi) that are commonly written
 * in Devanagari but have native variants. Phase 5 may refine with
 * native-speaker input.
 */

import * as React from "react";

const LANGUAGES = [
  { script: "भारत", name: "Hindi" },
  { script: "অসমীয়া", name: "Assamese" },
  { script: "ভারত", name: "Bengali" },
  { script: "भारत", name: "Bodo" },
  { script: "भारत", name: "Dogri" },
  { script: "ભારત", name: "Gujarati" },
  { script: "ಭಾರತ", name: "Kannada" },
  { script: "بھارت", name: "Kashmiri" },
  { script: "भारत", name: "Konkani" },
  { script: "भारत", name: "Maithili" },
  { script: "ഇന്ത്യ", name: "Malayalam" },
  { script: "ꯏꯟꯗꯤꯌꯥ", name: "Manipuri" },
  { script: "भारत", name: "Marathi" },
  { script: "भारत", name: "Nepali" },
  { script: "ଭାରତ", name: "Odia" },
  { script: "ਭਾਰਤ", name: "Punjabi" },
  { script: "भारतम्", name: "Sanskrit" },
  { script: "ᱥᱤᱧᱚᱛ", name: "Santali" },
  { script: "भारत", name: "Sindhi" },
  { script: "இந்தியா", name: "Tamil" },
  { script: "భారత్", name: "Telugu" },
  { script: "بھارت", name: "Urdu" },
] as const;

const ROTATION_INTERVAL_MS = 3000;

export function LanguageRotator() {
  const [index, setIndex] = React.useState(0);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  React.useEffect(() => {
    if (reduceMotion) return;
    const tick = setInterval(() => {
      setIndex((i) => (i + 1) % LANGUAGES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(tick);
  }, [reduceMotion]);

  const current = LANGUAGES[index];

  return (
    <span
      style={{
        fontFamily: "var(--font-serif), Georgia, serif",
        fontStyle: "italic",
        fontSize: "18px",
        color: "var(--color-text-secondary)",
        display: "inline-flex",
        alignItems: "baseline",
        gap: "8px",
        minWidth: "180px",
        transition: "opacity 200ms ease",
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        style={{
          fontStyle: "normal",
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
        }}
      >
        {current.script}
      </span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span style={{ fontSize: "15px" }}>{current.name}</span>
    </span>
  );
}

export default LanguageRotator;
