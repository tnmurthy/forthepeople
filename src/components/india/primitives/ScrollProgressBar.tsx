"use client";

/**
 * ScrollProgressBar — sticky 3px top bar that fills with a 5-stop accent
 * gradient as the user scrolls the page.
 *
 * File 48 §4.7.1. Stops cycle through accent ramps already declared on
 * :root in globals.css (Phase 4.6.9): blue → indigo → forest-green → amber → pink.
 *
 * Listens to scroll with `passive: true` and clamps progress to [0,1].
 */

import * as React from "react";

export function ScrollProgressBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docH > 0 ? window.scrollY / docH : 0;
      setProgress(Math.min(Math.max(ratio, 0), 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          // 800-stop saturated colors land harder against the off-white background
          // than the 700-stop tints did at 3px height.
          background:
            "linear-gradient(90deg, #082F58 0%, #26215C 25%, #27500A 50%, #633806 75%, #4D182A 100%)",
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}

export default ScrollProgressBar;
