"use client";

/**
 * Smooth-scrolls to the #request anchor on /<locale>.
 *
 * Behaviour:
 *   - If user is already on /<locale>, scroll directly via window.scrollTo
 *     (more reliable than scrollIntoView which gets cancelled by competing
 *     scroll-restoration during React re-render).
 *   - If user is on a different page, set a sessionStorage flag — the
 *     destination /<locale> page's mount handler reads it and scrolls.
 *
 * Why this exists: Session 7's CSS `scroll-behavior: smooth` + inline
 * `<Script>` at root layout never fired in Chrome MCP runtime. Manual
 * `el.scrollIntoView({ behavior: 'instant' })` from console worked, but
 * `el.scrollIntoView({ behavior: 'smooth' })` did not — some scroll-
 * restoration / re-render was killing the smooth animation. Direct
 * `window.scrollTo({ top, behavior: 'smooth' })` with a precomputed Y
 * is more robust because it doesn't depend on the element's offset
 * chain remaining stable during the tween.
 *
 * Returns true if the click was fully handled (caller should call
 * preventDefault). Returns false if cross-page navigation should be
 * allowed to proceed normally.
 */

const STORAGE_KEY = "ftp:scrollToRequest";
const HEADER_OFFSET = 80;

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
    window.scrollTo({ top: Math.max(0, offsetTop), behavior: "smooth" });

    // Reflect the new fragment in the URL bar without triggering another
    // hashchange/scroll-restoration round-trip.
    if (window.location.hash !== "#request") {
      try {
        window.history.replaceState(null, "", "#request");
      } catch {
        // Some browsers throw on file:// or sandboxed contexts — ignore.
      }
    }
    return true;
  }

  // Cross-page navigation: stash the intent for the destination page.
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private mode or storage disabled — fall through; the destination
    // page's mount handler still picks up `window.location.hash` if the
    // <a href> includes it.
  }
  return false;
}

/**
 * Called once at the top of /<locale>'s root client component. Reads the
 * sessionStorage flag (set by a prior cross-page click) OR a `#request`
 * fragment on direct URL load, then scrolls after a 150 ms post-mount
 * delay (lets React hydration + layout settle).
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
    window.scrollTo({ top: Math.max(0, offsetTop), behavior: "smooth" });
  }, 150);
}
