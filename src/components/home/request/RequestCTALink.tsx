"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { scrollToRequestSection } from "@/lib/utils/scroll-to-request";

/**
 * Plain <a> wrapper (NOT next/link) for "Request your district" CTAs.
 *
 * Same-page click on /<locale>: e.preventDefault() + scrollToRequestSection
 *   → smooth scroll via rAF polyfill (with instant fallback after 700ms)
 * Cross-page click: default <a> hard navigation
 *   → /<locale>'s mount handler reads sessionStorage flag and scrolls
 *
 * Why plain <a> instead of next/link <Link>:
 * Sessions 7.5/7.6 wired the polyfill correctly but Chrome MCP showed
 * scroll still didn't fire. Suspected: Next.js Link's client-side soft
 * routing was canceling the rAF tween mid-animation. Plain <a> avoids
 * the soft-route codepath entirely. href is preserved for right-click,
 * keyboard navigation, and no-JS graceful degradation.
 */
export function RequestCTALink({
  locale,
  style,
  className,
  children,
}: {
  locale: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Don't intercept cmd/ctrl-click (open in new tab), shift-click
    // (open in new window), middle-click, or non-primary button — let
    // the browser handle those natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const handled = scrollToRequestSection(pathname, locale);
    if (handled) {
      e.preventDefault();
    }
    // If not handled (cross-page), let default <a> hard nav proceed.
  }

  return (
    <a
      href={`/${locale}#request`}
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
