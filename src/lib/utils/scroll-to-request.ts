"use client";

/**
 * Smooth-scrolls to the #request anchor on /<locale>, with guaranteed
 * instant-scroll fallback if the rAF polyfill fails.
 *
 * TWO-LAYER STRATEGY:
 *   Layer 1: rAF polyfill calling positional window.scrollTo(0, easedY)
 *            → smooth perceived motion if the runtime cooperates
 *   Layer 2: After 700 ms, if window.scrollY hasn't moved within tolerance
 *            of the target, force el.scrollIntoView({block:'start'}) as
 *            an instant fallback
 *            → guaranteed scroll, even if Layer 1 was canceled
 *
 * Why this design: Sessions 6.5/7/7.5/7.6 each shipped a different
 * "smooth scroll" approach, all of which tested as broken in Chrome
 * runtime. behavior:'smooth' is fundamentally broken in this Next.js 16
 * + Turbopack environment. el.scrollIntoView() with no args is the only
 * scroll API that has worked in EVERY Chrome MCP test — instant, but
 * reliable. Used as the floor.
 *
 * Diagnostic logging is included with [FTP scroll] prefix, gated behind
 * DEBUG_LOG. Flip the flag off in a future cleanup session once the bug
 * is confirmed fixed in the wild.
 */

const STICKY_HEADER_OFFSET = 80;
const SMOOTH_SCROLL_DURATION_MS = 500;
const FALLBACK_CHECK_DELAY_MS = 700;
const FALLBACK_TOLERANCE_PX = 100;

const DEBUG_LOG = true;

function log(...args: unknown[]) {
  if (DEBUG_LOG && typeof window !== "undefined") {
    console.log("[FTP scroll]", ...args);
  }
}

/**
 * rAF cubic-ease-out polyfill with deterministic instant fallback.
 */
function smoothScrollToY(targetY: number, anchorEl?: HTMLElement | null): void {
  if (typeof window === "undefined") return;

  const startY = window.scrollY;
  const distance = targetY - startY;

  log("smoothScrollToY", { targetY, startY, distance });

  if (Math.abs(distance) < 2) {
    log("already at target, skipping");
    return;
  }

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    log("reduce-motion preferred — using instant scroll");
    if (anchorEl) {
      anchorEl.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, targetY);
    }
    return;
  }

  // Layer 1: rAF polyfill
  const startTime = performance.now();
  let frameCount = 0;

  function step(now: number): void {
    frameCount++;
    const elapsed = now - startTime;
    const t = Math.min(elapsed / SMOOTH_SCROLL_DURATION_MS, 1);
    const easeT = 1 - Math.pow(1 - t, 3); // cubic ease-out
    const newY = startY + distance * easeT;

    window.scrollTo(0, newY);

    if (t < 1) {
      window.requestAnimationFrame(step);
    } else {
      log("rAF polyfill completed", { frames: frameCount, finalY: window.scrollY });
    }
  }

  window.requestAnimationFrame(step);

  // Layer 2: deterministic fallback. After 700 ms, if we haven't landed
  // within tolerance, force-scroll via the only API confirmed working in
  // every test (el.scrollIntoView with no args).
  setTimeout(() => {
    const currentY = window.scrollY;
    const distFromTarget = Math.abs(currentY - targetY);

    if (distFromTarget > FALLBACK_TOLERANCE_PX) {
      log("rAF polyfill failed — engaging instant fallback", {
        currentY,
        targetY,
        distFromTarget,
      });
      if (anchorEl) {
        anchorEl.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo(0, targetY);
      }
      log("instant fallback applied", { newY: window.scrollY });
    } else {
      log("rAF polyfill landed within tolerance", { currentY, targetY });
    }
  }, FALLBACK_CHECK_DELAY_MS);
}

/**
 * Same-page handler. Returns true if scroll was attempted (caller should
 * preventDefault). Cross-page returns false (caller lets default <a>
 * navigation happen; scrollOnMountIfRequested picks up at destination
 * via sessionStorage flag or window.location.hash).
 */
export function scrollToRequestSection(
  currentPathname: string,
  targetLocale: string = "en",
): boolean {
  const targetPath = `/${targetLocale}`;
  const isAlreadyOnTarget =
    currentPathname === targetPath || currentPathname === `${targetPath}/`;

  log("scrollToRequestSection", { currentPathname, targetLocale, isAlreadyOnTarget });

  if (isAlreadyOnTarget) {
    const el = document.getElementById("request");
    if (!el) {
      log("element #request not found");
      return false;
    }

    const offsetTop = el.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET;
    smoothScrollToY(Math.max(0, offsetTop), el);

    if (window.location.hash !== "#request") {
      try {
        window.history.replaceState(null, "", "#request");
      } catch {
        // file:// or sandboxed contexts — ignore.
      }
    }
    return true;
  }

  try {
    sessionStorage.setItem("ftp:scrollToRequest", "1");
    log("set sessionStorage flag for cross-page scroll");
  } catch (e) {
    log("sessionStorage unavailable", e);
  }
  return false;
}

/**
 * Mount-time handler — called by RequestScrollMount on /<locale> mount.
 * Handles both:
 *   - sessionStorage flag from cross-page CTA click
 *   - Direct URL with #request hash (bookmark, share link)
 */
export function scrollOnMountIfRequested(): void {
  if (typeof window === "undefined") return;

  let shouldScroll = false;
  let reason = "";

  try {
    if (sessionStorage.getItem("ftp:scrollToRequest") === "1") {
      sessionStorage.removeItem("ftp:scrollToRequest");
      shouldScroll = true;
      reason = "sessionStorage flag";
    }
  } catch (e) {
    log("sessionStorage check failed", e);
  }

  if (window.location.hash === "#request") {
    shouldScroll = true;
    reason = reason ? `${reason} + hash` : "hash";
  }

  log("scrollOnMountIfRequested", { shouldScroll, reason });

  if (!shouldScroll) return;

  // Defer until after hydration completes (200 ms is conservative).
  setTimeout(() => {
    const el = document.getElementById("request");
    if (!el) {
      log("mount handler: #request not found");
      return;
    }
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET;
    smoothScrollToY(Math.max(0, offsetTop), el);
  }, 200);
}
