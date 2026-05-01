"use client";

/**
 * ScrollProgressBar — sticky 5px top bar whose fill expands with scroll
 * progress and whose color tracks the currently-visible super-category.
 *
 * File 48 §Section 4 Step 1. Background reads from the
 * --ftp-current-section-color CSS variable maintained by ScrollColorShift.
 * Width still tracks scroll progress with a fast 80ms linear transition;
 * the color crossfades over 350ms to match the body bg transition.
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
          background: "var(--ftp-current-section-color, #185FA5)",
          transition:
            "background-color 350ms cubic-bezier(0.4, 0, 0.2, 1), width 80ms linear",
        }}
      />
    </div>
  );
}

export default ScrollProgressBar;
