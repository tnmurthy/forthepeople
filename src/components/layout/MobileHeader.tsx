/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase B: mobile-only header. Renders unconditionally; CSS
 * hides the desktop HeaderBar and shows this one inside @media (max-width: 767px).
 *
 * - Hamburger ☰ on the LEFT, only on district pages, opens module drawer.
 * - Full "ForThePeople.in" logo (no "FTP.in" abbreviation on mobile).
 * - Search + Heart icons on the right (44×44 tap targets).
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart, Users } from "lucide-react";

interface Props {
  locale: string;
  /** Provided on district pages — opens the LEFT module drawer. */
  onModuleMenuClick?: () => void;
  /** Marks the variant so CSS can hide the global one when a district
   *  chrome instance is also mounted on the same page. */
  variant?: "global" | "district";
}

export function MobileHeader({
  locale,
  onModuleMenuClick,
  variant = "global",
}: Props) {
  const pathname = usePathname() ?? "";
  const isDistrictPage = /^\/[^/]+\/[^/]+\/[^/]+/.test(pathname);

  return (
    <header
      className="ftp-m-header"
      role="banner"
      data-mobile-header={variant}
    >
      {isDistrictPage && onModuleMenuClick ? (
        <button
          type="button"
          className="ftp-m-header-hamburger"
          onClick={onModuleMenuClick}
          aria-label="Open module list"
        >
          <Menu size={22} />
        </button>
      ) : (
        <span className="ftp-m-header-spacer" aria-hidden="true" />
      )}

      <Link
        href={`/${locale}`}
        className="ftp-m-header-logo"
        aria-label="ForThePeople.in home"
      >
        <Users size={18} className="ftp-m-header-logo-icon" aria-hidden="true" />
        <span className="ftp-m-header-logo-text">
          ForThePeople<span className="ftp-m-header-logo-tld">.in</span>
        </span>
      </Link>

      <div className="ftp-m-header-actions">
        <Link
          href={`/${locale}/search`}
          className="ftp-m-header-icon"
          aria-label="Search"
        >
          <Search size={20} />
        </Link>
        <Link
          href={`/${locale}/support`}
          className="ftp-m-header-icon ftp-m-header-icon-support"
          aria-label="Support"
        >
          <Heart size={20} />
        </Link>
      </div>
    </header>
  );
}
