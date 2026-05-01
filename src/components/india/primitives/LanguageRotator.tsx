"use client";

/**
 * LanguageRotator — cycles a bilingual subtitle through all 22 scheduled
 * languages of India (Schedule 8 of the Constitution).
 *
 * File 48 §4.7.3 + Section 2 polish: smooth keyframe-based fade/slide instead
 * of the abrupt setState swap. The fixed-height wrapper prevents layout shift,
 * and the keyframe runs every 3s — synchronized with a setInterval that
 * advances the language index at the same cadence so the rendered language
 * always matches the animation cycle.
 *
 * `prefers-reduced-motion: reduce` halts on the first language (Hindi) and
 * disables the keyframe entirely.
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
        display: "inline-flex",
        alignItems: "center",
        height: "24px",
        minWidth: "180px",
        overflow: "hidden",
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        // The `key` resets the animation each time the index changes, so each
        // new language plays the keyframe from the start.
        key={index}
        className={reduceMotion ? "ftp-rotator ftp-rotator--reduced" : "ftp-rotator"}
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontStyle: "italic",
          fontSize: "19px",
          lineHeight: 1,
          color: "var(--color-text-primary)",
          display: "inline-flex",
          alignItems: "baseline",
          gap: "8px",
          willChange: reduceMotion ? "auto" : "opacity, transform",
        }}
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

      <style>{`
        @keyframes ftp-rotator-cycle {
          0%   { opacity: 0; transform: translateY(8px); }
          12%  { opacity: 1; transform: translateY(0); }
          88%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .ftp-rotator {
          animation: ftp-rotator-cycle ${ROTATION_INTERVAL_MS}ms ease-in-out forwards;
        }
        .ftp-rotator--reduced {
          animation: none !important;
          opacity: 1;
          transform: none;
        }
      `}</style>
    </span>
  );
}

export default LanguageRotator;
