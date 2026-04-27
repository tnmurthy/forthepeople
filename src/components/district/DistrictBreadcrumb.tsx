/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session 19.3 Phase B — visual breadcrumb + peer switcher.
 *
 * Pattern: 🇮🇳 India ▼ › 🟢 Karnataka ▼ › 🟢 Mandya ▼ › Select sub-district ▼
 *
 * Each crumb is BOTH a clickable link (jump to that level) AND a caret
 * dropdown for switching to peer entities at the same level — so a user
 * on /en/karnataka/mandya can hop directly to Bengaluru Urban or Mysuru
 * without visiting the homepage.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Peer {
  slug: string;
  name: string;
  isLive?: boolean; // present on state/district peers; missing/true for sub-districts
}

export interface DistrictBreadcrumbProps {
  locale: string;
  stateSlug: string;
  stateName: string;
  districtSlug: string;
  districtName: string;
  /** All states (Session 19.5: live + coming-soon). Live ones get a green
   *  dot, coming-soon get a muted grey dot. Sorted live-first by the caller. */
  peerLiveStates: Peer[];
  /** All districts in the current state (Session 19.5: live + coming-soon). */
  peerLiveDistricts: Peer[];
  /** Sub-districts (taluks/tehsils/mandals) of the current district. */
  taluks: Peer[];
  currentTalukSlug?: string; // when on a taluk page, the active taluk
  currentTalukName?: string;
  /** Compact mode: strips wrapper chrome so the breadcrumb fits inline in the header row. */
  compact?: boolean;
}

type MenuKey = null | "india" | "state" | "district" | "taluk";

export default function DistrictBreadcrumb({
  locale,
  stateSlug,
  stateName,
  districtSlug,
  districtName,
  peerLiveStates,
  peerLiveDistricts,
  taluks,
  currentTalukSlug,
  currentTalukName,
  compact = false,
}: DistrictBreadcrumbProps) {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [openMenu]);

  const close = () => setOpenMenu(null);

  return (
    <nav
      ref={navRef}
      className="ftp-district-breadcrumb"
      data-compact={compact ? "true" : "false"}
      aria-label="District navigation"
    >
      <style>{`
        .ftp-district-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 4px;
          padding: 10px 16px;
          background: #FFFFFF;
          border-bottom: 1px solid #E8E8E4;
          font-size: 13px;
          color: #1A1A1A;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .ftp-district-breadcrumb::-webkit-scrollbar { display: none; }

        .ftp-breadcrumb-crumb {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .ftp-breadcrumb-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 6px;
          color: inherit;
          text-decoration: none;
          font-weight: 500;
          line-height: 1;
          transition: background 150ms ease;
        }
        .ftp-breadcrumb-link:hover { background: #F4F4F0; }
        .ftp-breadcrumb-link[data-current="true"] {
          color: #047857;
          font-weight: 600;
        }
        .ftp-breadcrumb-link[data-placeholder="true"] {
          color: #6B6B6B;
          font-weight: 500;
        }
        .ftp-breadcrumb-emoji { font-size: 14px; line-height: 1; }
        .ftp-breadcrumb-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.18);
          flex-shrink: 0;
        }

        .ftp-breadcrumb-caret {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          padding: 0;
          margin-left: -2px;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: #6B6B6B;
          font-size: 10px;
          line-height: 1;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease;
        }
        .ftp-breadcrumb-caret:hover {
          background: #F0F0EB;
          color: #1A1A1A;
        }
        .ftp-breadcrumb-caret[aria-expanded="true"] {
          background: #E8F5EF;
          color: #047857;
        }

        .ftp-breadcrumb-sep {
          color: #C8C8C2;
          font-size: 12px;
          padding: 0 2px;
          flex-shrink: 0;
          user-select: none;
        }

        .ftp-breadcrumb-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 40;
          min-width: 240px;
          max-height: 360px;
          overflow-y: auto;
          background: #FFFFFF;
          border: 1px solid #E5E5E0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          padding: 4px;
        }
        .ftp-breadcrumb-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 6px;
          color: #1A1A1A;
          text-decoration: none;
          font-size: 13px;
          line-height: 1.2;
          white-space: nowrap;
          transition: background 120ms ease;
        }
        .ftp-breadcrumb-menu-item-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ftp-breadcrumb-menu-item:hover { background: #F4F4F0; }
        /* Session 19.5: coming-soon items render in the same list, muted.
           Click still routes to the locked-district preview page. */
        .ftp-breadcrumb-menu-item[data-live="false"] {
          color: #9CA3AF;
        }
        .ftp-breadcrumb-menu-item[data-live="false"] .ftp-breadcrumb-dot {
          background: #D1D5DB;
          box-shadow: none;
        }
        /* Session 19.5: current item — muted with "Current" badge, no click. */
        .ftp-breadcrumb-menu-item[data-current="true"] {
          background: #F9FAFB;
          color: #6B7280;
          cursor: default;
          pointer-events: none;
        }
        .ftp-breadcrumb-menu-item[data-current="true"]::after {
          content: "Current";
          margin-left: auto;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #2563EB;
          font-weight: 700;
          flex-shrink: 0;
        }
        .ftp-breadcrumb-menu-empty {
          padding: 10px 12px;
          color: #9B9B9B;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .ftp-district-breadcrumb {
            padding: 8px 12px;
            font-size: 12px;
          }
          .ftp-breadcrumb-menu { min-width: 160px; }
        }

        /* Compact mode — flattens chrome so the breadcrumb sits inline
           in the global header row instead of a separate strip. */
        .ftp-district-breadcrumb[data-compact="true"] {
          padding: 0;
          background: transparent;
          border-bottom: none;
          font-size: 12px;
          flex-wrap: nowrap;
          overflow-x: visible;
          flex: 0 1 auto;
          min-width: 0;
        }
        .ftp-district-breadcrumb[data-compact="true"] .ftp-breadcrumb-link {
          padding: 3px 6px;
        }
        .ftp-district-breadcrumb[data-compact="true"] .ftp-breadcrumb-caret {
          width: 18px;
          height: 18px;
          font-size: 9px;
        }
        .ftp-district-breadcrumb[data-compact="true"] .ftp-breadcrumb-sep {
          padding: 0 1px;
        }
        @media (max-width: 1024px) {
          .ftp-district-breadcrumb[data-compact="true"] .ftp-breadcrumb-emoji,
          .ftp-district-breadcrumb[data-compact="true"] .ftp-breadcrumb-link span:not(.ftp-breadcrumb-emoji) {
            /* On medium screens trim non-current crumb labels to dots-only */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ftp-breadcrumb-link,
          .ftp-breadcrumb-caret,
          .ftp-breadcrumb-menu-item { transition: none; }
        }
      `}</style>

      {/* India crumb — caret opens the full state list (live + coming-soon) */}
      <BreadcrumbCrumb
        emoji="🇮🇳"
        label="India"
        href={`/${locale}`}
        isCurrent={false}
        menuOpen={openMenu === "india"}
        onCaretClick={() => setOpenMenu(openMenu === "india" ? null : "india")}
        ariaCaretLabel="Open state switcher"
      >
        {peerLiveStates.length === 0 ? (
          <div className="ftp-breadcrumb-menu-empty">No states listed</div>
        ) : (
          peerLiveStates.map((s) => (
            <PeerMenuItem
              key={s.slug}
              href={`/${locale}/${s.slug}`}
              isLive={s.isLive !== false}
              isCurrent={s.slug === stateSlug}
              onClick={close}
            >
              {s.name}
            </PeerMenuItem>
          ))
        )}
      </BreadcrumbCrumb>

      <span className="ftp-breadcrumb-sep" aria-hidden="true">›</span>

      {/* State crumb — caret opens all districts of the current state */}
      <BreadcrumbCrumb
        dot
        label={stateName}
        href={`/${locale}/${stateSlug}`}
        isCurrent={false}
        menuOpen={openMenu === "state"}
        onCaretClick={() => setOpenMenu(openMenu === "state" ? null : "state")}
        ariaCaretLabel={`Open districts of ${stateName}`}
      >
        {peerLiveDistricts.length === 0 ? (
          <div className="ftp-breadcrumb-menu-empty">
            No districts listed for {stateName}
          </div>
        ) : (
          peerLiveDistricts.map((d) => (
            <PeerMenuItem
              key={d.slug}
              href={`/${locale}/${stateSlug}/${d.slug}`}
              isLive={d.isLive !== false}
              isCurrent={d.slug === districtSlug}
              onClick={close}
            >
              {d.name}
            </PeerMenuItem>
          ))
        )}
      </BreadcrumbCrumb>

      <span className="ftp-breadcrumb-sep" aria-hidden="true">›</span>

      {/* District crumb (current unless a taluk is selected) — caret shows
          all districts in the same state, current marked, coming-soon greyed. */}
      <BreadcrumbCrumb
        dot
        label={districtName}
        href={`/${locale}/${stateSlug}/${districtSlug}`}
        isCurrent={!currentTalukSlug}
        menuOpen={openMenu === "district"}
        onCaretClick={() =>
          setOpenMenu(openMenu === "district" ? null : "district")
        }
        ariaCaretLabel={`Switch district (currently ${districtName})`}
      >
        {peerLiveDistricts.length === 0 ? (
          <div className="ftp-breadcrumb-menu-empty">
            No districts listed for {stateName}
          </div>
        ) : (
          peerLiveDistricts.map((d) => (
            <PeerMenuItem
              key={d.slug}
              href={`/${locale}/${stateSlug}/${d.slug}`}
              isLive={d.isLive !== false}
              isCurrent={d.slug === districtSlug}
              onClick={close}
            >
              {d.name}
            </PeerMenuItem>
          ))
        )}
      </BreadcrumbCrumb>

      <span className="ftp-breadcrumb-sep" aria-hidden="true">›</span>

      {/* Taluk crumb — current when on a taluk page, placeholder otherwise */}
      <BreadcrumbCrumb
        dot={!!currentTalukSlug}
        label={currentTalukName ?? "Select sub-district"}
        href={
          currentTalukSlug
            ? `/${locale}/${stateSlug}/${districtSlug}/${currentTalukSlug}`
            : null
        }
        placeholder={!currentTalukSlug}
        isCurrent={!!currentTalukSlug}
        menuOpen={openMenu === "taluk"}
        onCaretClick={() => setOpenMenu(openMenu === "taluk" ? null : "taluk")}
        ariaCaretLabel={`Choose a sub-district in ${districtName}`}
      >
        {taluks.length === 0 ? (
          <div className="ftp-breadcrumb-menu-empty">No sub-districts listed</div>
        ) : (
          taluks.map((t) => (
            <PeerMenuItem
              key={t.slug}
              href={`/${locale}/${stateSlug}/${districtSlug}/${t.slug}`}
              isLive
              isCurrent={t.slug === currentTalukSlug}
              onClick={close}
            >
              {t.name}
            </PeerMenuItem>
          ))
        )}
      </BreadcrumbCrumb>
    </nav>
  );
}

interface PeerMenuItemProps {
  href: string;
  isLive: boolean;
  isCurrent: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/** Session 19.5: shared menu-item renderer.
 *  - Coming-soon (isLive=false): muted text + grey dot, still clickable
 *    (target route already has a LockedDistrictPreview).
 *  - Current (isCurrent=true): muted with a "Current" badge, click does
 *    nothing (CSS pointer-events: none — kept as <a> for screen readers). */
function PeerMenuItem({
  href,
  isLive,
  isCurrent,
  onClick,
  children,
}: PeerMenuItemProps) {
  return (
    <Link
      href={href}
      className="ftp-breadcrumb-menu-item"
      data-live={isLive ? "true" : "false"}
      data-current={isCurrent ? "true" : "false"}
      aria-current={isCurrent ? "true" : undefined}
      onClick={onClick}
    >
      <span className="ftp-breadcrumb-dot" aria-hidden="true" />
      <span className="ftp-breadcrumb-menu-item-label">{children}</span>
    </Link>
  );
}

interface CrumbProps {
  emoji?: string;
  dot?: boolean;
  label: string;
  href: string | null;
  isCurrent: boolean;
  placeholder?: boolean;
  menuOpen: boolean;
  onCaretClick: () => void;
  ariaCaretLabel: string;
  children: React.ReactNode;
}

function BreadcrumbCrumb({
  emoji,
  dot,
  label,
  href,
  isCurrent,
  placeholder,
  menuOpen,
  onCaretClick,
  ariaCaretLabel,
  children,
}: CrumbProps) {
  const labelContent = (
    <>
      {emoji && (
        <span className="ftp-breadcrumb-emoji" aria-hidden="true">
          {emoji}
        </span>
      )}
      {dot && <span className="ftp-breadcrumb-dot" aria-hidden="true" />}
      <span>{label}</span>
    </>
  );

  return (
    <span className="ftp-breadcrumb-crumb">
      {href ? (
        <Link
          href={href}
          className="ftp-breadcrumb-link"
          data-current={isCurrent ? "true" : "false"}
          aria-current={isCurrent ? "page" : undefined}
        >
          {labelContent}
        </Link>
      ) : (
        <span
          className="ftp-breadcrumb-link"
          data-placeholder={placeholder ? "true" : undefined}
        >
          {labelContent}
        </span>
      )}
      <button
        type="button"
        className="ftp-breadcrumb-caret"
        aria-label={ariaCaretLabel}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={onCaretClick}
      >
        ▼
      </button>
      {menuOpen && (
        <div className="ftp-breadcrumb-menu" role="menu">
          {children}
        </div>
      )}
    </span>
  );
}
