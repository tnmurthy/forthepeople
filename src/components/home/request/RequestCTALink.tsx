"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { scrollToRequestSection } from "@/lib/utils/scroll-to-request";

/**
 * <Link> wrapper that:
 *   - Same-page click: preventDefault + smooth-scroll to #request, replaces hash
 *   - Cross-page click: lets default Next.js navigation proceed; sessionStorage
 *     flag is set so the destination /<locale> page scrolls on mount
 *
 * Keeps the `href` attribute intact so right-click-open-in-new-tab,
 * keyboard tab+Enter, and no-JS fallback all work.
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

  return (
    <Link
      href={`/${locale}#request`}
      className={className}
      style={style}
      onClick={(e) => {
        const handled = scrollToRequestSection(pathname, locale);
        if (handled) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Link>
  );
}
