"use client";

/**
 * ScrollProgressBar — sticky 5px top bar that paints a section-anchored
 * gradient as the user scrolls. Past sections retain their painted color;
 * the leading edge advances rightward as scroll progress increases.
 *
 * File 48 §Section 4 Step 3. The gradient stops are computed at runtime
 * from each [data-tint-id] section's offsetTop / scrollableRange so they
 * stay correct as content heights change. The paint reveal is done via
 * clip-path on the gradient fill, driven by --scroll-progress (0–100%)
 * which the scroll listener writes onto :root.
 */

import * as React from "react";

const ACCENTS: Record<string, string> = {
  hero:        "#185FA5",
  macro:       "#185FA5",
  know:        "#534AB7",
  living:      "#0F6E56",
  wildlife:    "#5A8F2E",
  agriculture: "#B58A1E",
  natural:     "#4A5358",
  infra:       "#BA7517",
  governance:  "#3C3489",
  innovation:  "#993C1D",
  culture:     "#993556",
};

// SSR / pre-hydration fallback so the bar never renders empty before the
// real per-section computation runs in a useEffect.
const FALLBACK_GRADIENT =
  "linear-gradient(90deg, #185FA5 0%, #534AB7 33%, #5A8F2E 50%, #BA7517 76%, #993556 100%)";

export function ScrollProgressBar() {
  const [gradient, setGradient] = React.useState<string>(FALLBACK_GRADIENT);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const computeGradient = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-tint-id]"),
      );
      if (sections.length === 0) return;

      const scrollableRange =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableRange <= 0) return;

      const stops: string[] = [];
      const firstId = sections[0].getAttribute("data-tint-id") ?? "";
      const firstColor = ACCENTS[firstId] ?? "#185FA5";
      stops.push(`${firstColor} 0%`);

      sections.forEach((section) => {
        const id = section.getAttribute("data-tint-id") ?? "";
        const color = ACCENTS[id];
        if (!color) return;
        const pct = Math.min(
          100,
          Math.max(0, (section.offsetTop / scrollableRange) * 100),
        );
        stops.push(`${color} ${pct.toFixed(2)}%`);
      });

      const lastId =
        sections[sections.length - 1].getAttribute("data-tint-id") ?? "";
      const lastColor = ACCENTS[lastId] ?? "#993556";
      stops.push(`${lastColor} 100%`);

      setGradient(`linear-gradient(90deg, ${stops.join(", ")})`);
    };

    computeGradient();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(computeGradient, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const scrollableRange =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableRange > 0
          ? Math.min(
              100,
              Math.max(0, (window.scrollY / scrollableRange) * 100),
            )
          : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${progress.toFixed(2)}%`,
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        // Stacks below the global sticky header (56px) and the sticky breadcrumb
        // (~36px). z-index sits one below the breadcrumb's so the bar tucks under it.
        top: "100px",
        width: "100%",
        height: "5px",
        background: "rgba(0,0,0,0.04)",
        zIndex: 39,
        overflow: "hidden",
      }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: gradient,
          clipPath: "inset(0 calc(100% - var(--scroll-progress, 0%)) 0 0)",
          transition:
            "clip-path 80ms linear, background 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default ScrollProgressBar;
