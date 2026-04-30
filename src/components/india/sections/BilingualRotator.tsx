"use client";

/**
 * BilingualRotator — cycles through 22 scheduled languages of India.
 *
 * File 38 hero §3. 2200ms per language, 400ms fade. Uses tokens from
 * IndiaScheduledLanguages + IndiaMotion in design-tokens.ts.
 */

import * as React from "react";
import {
  IndiaScheduledLanguages,
  IndiaMotion,
} from "@/lib/india/design-tokens";

export function BilingualRotator() {
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const total = IndiaScheduledLanguages.length;
    const interval = setInterval(() => {
      setVisible(false);
      const fade = setTimeout(() => {
        setIndex((i) => (i + 1) % total);
        setVisible(true);
      }, IndiaMotion.langFadeDuration);
      return () => clearTimeout(fade);
    }, IndiaMotion.langRotationInterval);
    return () => clearInterval(interval);
  }, []);

  const lang = IndiaScheduledLanguages[index];

  return (
    <div
      style={{
        height: "36px",
        fontFamily: "var(--font-serif)",
        fontSize: "26px",
        fontWeight: 400,
        color: "var(--color-text-secondary)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: `opacity ${IndiaMotion.langFadeDuration}ms, transform ${IndiaMotion.langFadeDuration}ms`,
      }}
      aria-live="polite"
    >
      {lang.script} · {lang.name}
    </div>
  );
}

export default BilingualRotator;
