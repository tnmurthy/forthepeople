"use client";

import { useEffect } from "react";
import { scrollOnMountIfRequested } from "@/lib/utils/scroll-to-request";

/**
 * Mount-once handler that scrolls to #request when:
 *   - sessionStorage flag was set by a cross-page click (Session 7.5
 *     scrollToRequestSection utility), OR
 *   - URL already contains #request (direct navigation / bookmark / share)
 *
 * Renders nothing. Safe to mount inside a server component (it self-marks
 * 'use client').
 */
export function RequestScrollMount() {
  useEffect(() => {
    scrollOnMountIfRequested();
  }, []);
  return null;
}
