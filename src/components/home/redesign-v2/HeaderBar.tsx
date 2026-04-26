/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — major HeaderBar overhaul:
 *   - Logo with 👥 emoji prefix; mobile collapses to "👥 FTP.in"
 *   - Product dropdown items get emojis (👥/🤝/💼) + green/red status dots
 *   - District autocomplete search: live (green) + locked (lock icon)
 *     districts. Click live → district page. Click locked → /vote-district?d=slug
 *   - Theme toggle LOCKED (☀️🔒) with "Dark mode coming soon" tooltip;
 *     resets any prior dark-mode localStorage to be safe
 *   - Language dropdown: English active, others lock-prefixed + "Soon" badge
 *   - Desktop nav: Support text link, Vote on Features text link, ♥ Support btn
 *   - GitHub badge REMOVED from desktop header (moves to footer / mobile menu)
 *   - Mobile: 👥 FTP.in + search icon + ♥ + ☰ — full nav in hamburger panel
 *
 * Wire-up to [locale]/layout.tsx is already in place from Session 11.1.
 */

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Github,
  Heart,
  Lock,
  Menu,
  Search,
} from "lucide-react";
import { INDIA_STATES } from "@/lib/constants/districts";
import { timeAgoLabel, type TimeAgoResult } from "@/lib/utils/timeAgo";

// ── Product dropdown items ────────────────────────────────
type Product = {
  key: "in" | "connect" | "jobs";
  emoji: string;
  name: string;
  suffix: string;
  suffixColor: string;
  href: string;
  status: "live" | "soon";
};

const PRODUCTS: Product[] = [
  { key: "in",      emoji: "👥", name: "ForThePeople", suffix: ".in",      suffixColor: "#2563EB", href: "/",            status: "live" },
  { key: "connect", emoji: "🤝", name: "ForThePeople", suffix: ".connect", suffixColor: "#7C3AED", href: "/coming-soon", status: "soon" },
  { key: "jobs",    emoji: "💼", name: "ForThePeople", suffix: ".jobs",    suffixColor: "#BA7517", href: "/coming-soon", status: "soon" },
];

// ── Languages (en active, others production-style "Soon") ──
type Lang = { code: string; name: string; nameLocal: string; active: boolean };
const LANGUAGES: Lang[] = [
  { code: "en", name: "English",   nameLocal: "English",      active: true  },
  { code: "hi", name: "Hindi",     nameLocal: "हिन्दी",         active: false },
  { code: "kn", name: "Kannada",   nameLocal: "ಕನ್ನಡ",        active: false },
  { code: "ta", name: "Tamil",     nameLocal: "தமிழ்",        active: false },
  { code: "te", name: "Telugu",    nameLocal: "తెలుగు",       active: false },
  { code: "bn", name: "Bengali",   nameLocal: "বাংলা",         active: false },
  { code: "mr", name: "Marathi",   nameLocal: "मराठी",         active: false },
  { code: "gu", name: "Gujarati",  nameLocal: "ગુજરાતી",       active: false },
  { code: "pa", name: "Punjabi",   nameLocal: "ਪੰਜਾਬੀ",        active: false },
  { code: "ml", name: "Malayalam", nameLocal: "മലയാളം",       active: false },
];

// ── Flatten INDIA_STATES into a single searchable list ──
type FlatDistrict = {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  active: boolean;
};

function flattenDistricts(): FlatDistrict[] {
  const out: FlatDistrict[] = [];
  for (const s of INDIA_STATES) {
    for (const d of s.districts) {
      out.push({
        slug: d.slug,
        name: d.name,
        stateSlug: s.slug,
        stateName: s.name,
        active: d.active,
      });
    }
  }
  return out;
}

// ── "Updated X ago" pill — uses shared timeAgoLabel utility ──
function useUpdatedPill(): TimeAgoResult {
  const [mostRecentAt, setMostRecentAt] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchStat() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as { mostRecentAt?: string | null };
        if (cancelled) return;
        setMostRecentAt(data.mostRecentAt ?? null);
      } catch {
        /* ignore */
      }
    }
    fetchStat();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const tick = setInterval(() => {
      fetchStat();
      setNow(Date.now());
    }, 60_000);
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, []);

  if (now == null) return { label: "—", isStale: false, isLive: false };
  return timeAgoLabel(mostRecentAt, { nowMs: now });
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export interface HeaderBarProps {
  locale: string;
  /** Optional callback for the mobile hamburger. */
  onOpenMobileNav?: () => void;
}

export default function HeaderBar({ locale, onOpenMobileNav }: HeaderBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const updated = useUpdatedPill();

  const [productOpen, setProductOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const productRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(productRef, () => setProductOpen(false));
  useClickOutside(langRef, () => setLangOpen(false));
  useClickOutside(searchRef, () => setSearchOpen(false));
  useClickOutside(mobileNavRef, () => setMobileNavOpen(false));

  // Reset any stale dark-mode preference (theme is locked in v7)
  useEffect(() => {
    try {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("ftp_theme");
      localStorage.removeItem("theme");
    } catch {
      /* ignore */
    }
  }, []);

  // Escape closes any open dropdown / panel.
  useEffect(() => {
    if (!productOpen && !langOpen && !searchOpen && !mobileNavOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProductOpen(false);
        setLangOpen(false);
        setSearchOpen(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [productOpen, langOpen, searchOpen, mobileNavOpen]);

  const allDistricts = useMemo(flattenDistricts, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return { live: [] as FlatDistrict[], locked: [] as FlatDistrict[] };
    const matches = allDistricts.filter((d) =>
      d.name.toLowerCase().includes(q) || d.stateName.toLowerCase().includes(q),
    );
    return {
      live: matches.filter((d) => d.active).slice(0, 8),
      locked: matches.filter((d) => !d.active).slice(0, 12),
    };
  }, [search, allDistricts]);

  const activeLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = filtered.live[0] ?? filtered.locked[0];
    if (!first) return;
    const href = first.active
      ? `/${locale}/${first.stateSlug}/${first.slug}`
      : `/${locale}/vote-district?d=${first.slug}`;
    setSearchOpen(false);
    router.push(href);
  }

  return (
    <header
      className="ftp-header-bar"
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E8E4",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .ftp-header-bar { padding: 8px 12px !important; gap: 8px !important; }
          .ftp-header-bar .ftp-desktop-only { display: none !important; }
          .ftp-header-bar .ftp-logo-full { display: none !important; }
          .ftp-header-bar .ftp-logo-short { display: inline !important; }
        }
        @media (min-width: 768px) {
          .ftp-header-bar .ftp-mobile-only { display: none !important; }
          .ftp-header-bar .ftp-logo-short { display: none !important; }
        }
        .ftp-pill { font-size: 11px; padding: 4px 10px; border-radius: 999px; }
        .ftp-pulse-dot {
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #16A34A;
          margin-right: 6px;
          animation: ftp-pulse 2s ease-in-out infinite;
        }
        @keyframes ftp-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-pulse-dot { animation: none; }
        }
        .ftp-link-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #1A1A1A; text-decoration: none;
          padding: 6px 10px; border-radius: 8px;
          background: transparent; border: none; cursor: pointer;
        }
        .ftp-link-btn:hover { background: #F5F5F0; }
        .ftp-product-trigger:hover { background: #F5F5F0; }
        .ftp-product-trigger:focus-visible {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }
        .ftp-status-dot {
          display: inline-block;
          width: 7px; height: 7px; border-radius: 50%;
          flex-shrink: 0;
        }
        .ftp-status-dot-green { background: #10B981; }
        .ftp-status-dot-red   { background: #DC2626; }
        .ftp-search-input:focus { outline: none; border-color: #2563EB; }
        .ftp-search-results {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 10px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.10);
          padding: 6px;
          max-height: 380px;
          overflow-y: auto;
          z-index: 50;
        }
        .ftp-search-divider {
          padding: 6px 10px;
          font-size: 10px;
          color: #9B9B9B;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .ftp-search-row {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 13px;
          color: #1A1A1A;
          text-decoration: none;
          cursor: pointer;
          min-height: 36px;
        }
        .ftp-search-row:hover { background: #F5F5F0; }
        .ftp-search-row .meta { color: #9B9B9B; font-size: 11px; margin-left: auto; }
        .ftp-theme-locked {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 8px;
          background: transparent; border: none; cursor: not-allowed;
          color: #6B7280;
          position: relative;
          font-size: 14px;
        }
        .ftp-theme-locked:hover { background: #F5F5F0; }
        .ftp-theme-locked .ftp-lock-overlay {
          position: absolute;
          right: 4px; bottom: 4px;
          font-size: 9px;
          color: #DC2626;
        }
        .ftp-mobile-panel {
          position: fixed;
          top: 56px; right: 12px;
          background: #FFFFFF;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 10px;
          min-width: 220px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.10);
          z-index: 40;
        }
        .ftp-mobile-panel a, .ftp-mobile-panel button {
          display: flex; align-items: center; gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #1A1A1A;
          font-size: 14px;
          text-decoration: none;
          text-align: left;
          min-height: 44px;
        }
        .ftp-mobile-panel a:hover, .ftp-mobile-panel button:hover { background: #F5F5F0; }
      `}</style>

      {/* ── Logo + product dropdown trigger ── */}
      <div ref={productRef} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setProductOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={productOpen}
          aria-label="ForThePeople product menu"
          className="ftp-product-trigger"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            color: "#1A1A1A",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden="true">👥</span>
          <span className="ftp-logo-full">
            ForThePeople<span style={{ color: "#2563EB" }}>.in</span>
          </span>
          <span className="ftp-logo-short">
            FTP<span style={{ color: "#2563EB" }}>.in</span>
          </span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            style={{
              color: "#9B9B9B",
              transform: productOpen ? "rotate(180deg)" : "none",
              transition: "transform 150ms ease",
            }}
          />
        </button>
        {productOpen && (
          <ul
            role="menu"
            aria-label="Switch product"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              minWidth: 240,
              background: "#FFFFFF",
              border: "1px solid #E8E8E4",
              borderRadius: 10,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              padding: 4,
              listStyle: "none",
              margin: 0,
              zIndex: 40,
            }}
          >
            {PRODUCTS.map((p) => {
              const isLive = p.status === "live";
              const targetHref = isLive ? `/${locale}` : "/coming-soon";
              return (
                <li key={p.key} role="none">
                  <Link
                    role="menuitem"
                    href={targetHref}
                    onClick={() => setProductOpen(false)}
                    aria-current={isLive ? "page" : undefined}
                    title={isLive ? "Currently here" : "Not yet live"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "#1A1A1A",
                      textDecoration: "none",
                    }}
                  >
                    <span aria-hidden="true" style={{ fontSize: 14 }}>{p.emoji}</span>
                    <span style={{ flex: 1 }}>
                      {p.name}
                      <span style={{ color: p.suffixColor, fontWeight: 600 }}>{p.suffix}</span>
                    </span>
                    <span
                      className={`ftp-status-dot ${isLive ? "ftp-status-dot-green" : "ftp-status-dot-red"}`}
                      aria-label={isLive ? "Live" : "Not yet live"}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── "Live · Updated X ago" pill ── */}
      <span
        className="ftp-pill ftp-desktop-only"
        title={
          updated.isLive
            ? "Live — most recent data write was over 2 hours ago"
            : "Most recent fresh data write"
        }
        style={{
          background: "#F0FDF4",
          color: "#166534",
          border: "1px solid #BBF7D0",
          whiteSpace: "nowrap",
        }}
      >
        <span className="ftp-pulse-dot" aria-hidden="true" />
        {updated.isLive ? "Live" : `Updated ${updated.label}`}
      </span>

      {/* ── Search ── */}
      <div ref={searchRef} style={{ flex: 1, minWidth: 0, maxWidth: 440, position: "relative" }} className="ftp-desktop-only">
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FAFAF8",
            border: "1px solid #E8E8E4",
            borderRadius: 10,
            padding: "6px 10px",
          }}
        >
          <Search size={14} style={{ color: "#9B9B9B", flexShrink: 0 }} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search any district…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            aria-label="Search any district"
            className="ftp-search-input"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              color: "#1A1A1A",
            }}
          />
        </form>

        {searchOpen && search.trim().length > 0 && (
          <div className="ftp-search-results" role="listbox" aria-label="District search results">
            {filtered.live.length === 0 && filtered.locked.length === 0 ? (
              <div style={{ padding: 14, fontSize: 12, color: "#9B9B9B", textAlign: "center" }}>
                No matching districts. Try a different name.
              </div>
            ) : (
              <>
                {filtered.live.length > 0 && (
                  <>
                    <div className="ftp-search-divider">
                      ─── {filtered.live.length} live ───
                    </div>
                    {filtered.live.map((d) => (
                      <Link
                        key={`live-${d.stateSlug}-${d.slug}`}
                        href={`/${locale}/${d.stateSlug}/${d.slug}`}
                        className="ftp-search-row"
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="ftp-status-dot ftp-status-dot-green" aria-hidden="true" />
                        <span>{d.name}</span>
                        <span className="meta">{d.stateName}</span>
                      </Link>
                    ))}
                  </>
                )}
                {filtered.locked.length > 0 && (
                  <>
                    <div className="ftp-search-divider">
                      ─── {filtered.locked.length} locked · vote to unlock ───
                    </div>
                    {filtered.locked.map((d) => (
                      <Link
                        key={`locked-${d.stateSlug}-${d.slug}`}
                        href={`/${locale}/vote-district?d=${d.slug}`}
                        className="ftp-search-row"
                        onClick={() => setSearchOpen(false)}
                      >
                        <Lock size={12} style={{ color: "#9B9B9B", flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ color: "#6B7280" }}>{d.name}</span>
                        <span className="meta">{d.stateName}</span>
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Desktop nav: Support text link, Vote on features text link ── */}
      <Link
        href={`/${locale}/support`}
        className="ftp-link-btn ftp-desktop-only"
        style={{ fontSize: 13 }}
      >
        Support
      </Link>
      <Link
        href={`/${locale}/features`}
        className="ftp-link-btn ftp-desktop-only"
        style={{ fontSize: 13 }}
      >
        🗳️ Vote on Features
      </Link>

      {/* ── Language dropdown ── */}
      <div ref={langRef} className="ftp-desktop-only" style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setLangOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={langOpen}
          className="ftp-link-btn"
          style={{ fontSize: 13 }}
        >
          {activeLang.code.toUpperCase()}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {langOpen && (
          <ul
            role="menu"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              minWidth: 240,
              maxHeight: 320,
              overflowY: "auto",
              background: "#FFFFFF",
              border: "1px solid #E8E8E4",
              borderRadius: 10,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              padding: 4,
              listStyle: "none",
              margin: 0,
            }}
          >
            {LANGUAGES.map((l) => {
              const isActive = l.code === locale;
              return (
                <li key={l.code} role="none">
                  {l.active ? (
                    <Link
                      role="menuitem"
                      href={`/${l.code}${pathname?.replace(/^\/[a-z]{2}/, "") ?? ""}`}
                      onClick={() => setLangOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 6,
                        textDecoration: "none",
                        color: "#1A1A1A",
                        fontSize: 13,
                        background: isActive ? "#EFF6FF" : "transparent",
                      }}
                    >
                      <span style={{ flex: 1 }}>{l.nameLocal}</span>
                      <span style={{ fontSize: 11, color: "#6B7280" }}>{l.name}</span>
                    </Link>
                  ) : (
                    <span
                      role="menuitem"
                      title="Coming soon"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 6,
                        cursor: "not-allowed",
                        color: "#9B9B9B",
                        fontSize: 13,
                      }}
                    >
                      <Lock size={11} aria-hidden="true" />
                      <span style={{ flex: 1 }}>{l.nameLocal}</span>
                      <span
                        style={{
                          background: "#FFFBEB",
                          color: "#A16207",
                          border: "1px solid #FDE68A",
                          fontSize: 9,
                          fontWeight: 600,
                          padding: "1px 6px",
                          borderRadius: 999,
                          letterSpacing: "0.04em",
                        }}
                      >
                        Soon
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Theme toggle (LOCKED — dark mode coming soon) ── */}
      <button
        type="button"
        className="ftp-theme-locked ftp-desktop-only"
        aria-label="Theme toggle (dark mode coming soon)"
        title="Dark mode coming soon"
        onClick={() => {
          /* no-op — theme is locked in v7 */
        }}
      >
        <span aria-hidden="true">☀️</span>
        <span className="ftp-lock-overlay" aria-hidden="true">🔒</span>
      </button>

      {/* ── Support button (♥) ── */}
      <Link
        href={`/${locale}/support`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 999,
          background: "#DC2626",
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
        aria-label="Support — financial contribution"
      >
        <Heart size={14} aria-hidden="true" fill="currentColor" />
        <span className="ftp-desktop-only">Support</span>
      </Link>

      {/* ── Mobile: search icon button + hamburger ── */}
      <button
        type="button"
        onClick={() => setSearchOpen((v) => !v)}
        aria-label="Open district search"
        className="ftp-link-btn ftp-mobile-only"
        style={{ padding: 6 }}
      >
        <Search size={18} aria-hidden="true" />
      </button>
      <div ref={mobileNavRef} className="ftp-mobile-only" style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => {
            setMobileNavOpen((v) => !v);
            onOpenMobileNav?.();
          }}
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
          className="ftp-link-btn"
          style={{ padding: 6 }}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        {mobileNavOpen && (
          <div className="ftp-mobile-panel" role="menu">
            <Link href={`/${locale}/support`} role="menuitem" onClick={() => setMobileNavOpen(false)}>
              <Heart size={14} aria-hidden="true" /> Support
            </Link>
            <Link href={`/${locale}/features`} role="menuitem" onClick={() => setMobileNavOpen(false)}>
              🗳️ Vote on Features
            </Link>
            <a
              href="https://github.com/jayanthmb14/forthepeople"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setMobileNavOpen(false)}
            >
              <Github size={14} aria-hidden="true" /> GitHub
            </a>
            <button type="button" disabled title="Dark mode coming soon" role="menuitem">
              <Lock size={12} aria-hidden="true" /> Dark mode (soon)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
