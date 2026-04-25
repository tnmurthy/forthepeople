"use client";

/**
 * Scrolls to the #request anchor on /<locale>.
 *
 * Why this is hand-rolled rather than using `window.scrollTo({behavior:'smooth'})`
 * or `el.scrollIntoView({behavior:'smooth'})`:
 *
 *   In this Next.js 16 + Turbopack runtime, every native smooth-scroll API
 *   (scrollIntoView/scrollTo with `behavior:'smooth'`) silently no-ops
 *   mid-animation — verified via Chrome MCP across Sessions 6.5, 7, 7.5.
 *   The only API that reliably moves the viewport is the positional
 *   `window.scrollTo(x, y)` two-arg form. CSS `html { scroll-behavior:
 *   smooth }` (Session 7) actually MAKES IT WORSE: it intercepts the
 *   positional call too, so the viewport stays put.
 *
 *   Session 7.6 removes that CSS rule and animates manually with
 *   requestAnimationFrame, calling window.scrollTo(0, easedY) ~30 times
 *   over 500ms. Cubic ease-out feels close to the native smooth API.
 *
 *   Honors prefers-reduced-motion by jumping directly to the target.
 *
 * Returns true if the click was fully handled (caller should preventDefault).
 * Returns false if cross-page navigation should be allowed to proceed.
 */

const STORAGE_KEY = "ftp:scrollToRequest";
const HEADER_OFFSET = 80;
const ANIM_DURATION_MS = 500;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function smoothScrollTo(targetY: number): void {
  const clamped = Math.max(0, targetY);

  if (prefersReducedMotion()) {
    window.scrollTo(0, clamped);
    return;
  }

  const startY = window.scrollY || window.pageYOffset || 0;
  const distance = clamped - startY;
  if (Math.abs(distance) < 1) {
    window.scrollTo(0, clamped);
    return;
  }

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / ANIM_DURATION_MS);
    // cubic ease-out: 1 - (1 - t)^3
    const eased = 1 - Math.pow(1 - t, 3);
    const y = startY + distance * eased;
    window.scrollTo(0, y);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      // Snap to exact target on the last frame.
      window.scrollTo(0, clamped);
    }
  }

  requestAnimationFrame(step);
}

export function scrollToRequestSection(
  currentPathname: string,
  targetLocale: string = "en",
): boolean {
  const targetPath = `/${targetLocale}`;
  const isAlreadyOnTarget =
    currentPathname === targetPath || currentPathname === `${targetPath}/`;

  if (isAlreadyOnTarget) {
    const el = document.getElementById("request");
    if (!el) return false;

    const offsetTop = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    smoothScrollTo(offsetTop);

    if (window.location.hash !== "#request") {
      try {
        window.history.replaceState(null, "", "#request");
      } catch {
        // file:// or sandboxed contexts — ignore.
      }
    }
    return true;
  }

  // Cross-page: stash the intent for the destination page.
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private mode — destination still picks up `#request` if href has it.
  }
  return false;
}

/**
 * Mounted once at the top of /<locale>'s root client component. Reads the
 * sessionStorage flag (set by a prior cross-page click) OR a `#request`
 * fragment on direct URL load, then scrolls after a 150ms post-mount
 * delay so React hydration + layout has settled.
 *
 * Safe to call from a useEffect with `[]` deps.
 */
export function scrollOnMountIfRequested(): void {
  if (typeof window === "undefined") return;

  let shouldScroll = false;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      sessionStorage.removeItem(STORAGE_KEY);
      shouldScroll = true;
    }
  } catch {
    // ignore
  }
  if (!shouldScroll && window.location.hash === "#request") {
    shouldScroll = true;
  }
  if (!shouldScroll) return;

  setTimeout(() => {
    const el = document.getElementById("request");
    if (!el) return;
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    smoothScrollTo(offsetTop);
  }, 150);
}
