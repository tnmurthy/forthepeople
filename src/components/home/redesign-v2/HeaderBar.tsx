/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — drop-in replacement for src/components/layout/Header.tsx.
 *
 * SCOPE NOTE
 * ──────────
 * The legacy Header.tsx is 938 lines and packs: per-locale routing, the full
 * MODULE_INDEX search (25 modules + 22-language dropdown + state/district
 * jump), MobileSidebar wiring, "Lock" gating, dynamic per-page state, etc.
 * This redesign-v2 HeaderBar is a CLEANER FOUNDATION that prioritises the
 * Session 11 spec (product dropdown, theme toggle, language menu, GitHub
 * star pill, support button) and intentionally defers some legacy behavior:
 *
 *   - Search submits to /<locale>?q=... and a future search results page
 *     handles the query. No client-side autocomplete in this commit.
 *   - GitHub star count is hardcoded (149) until SWR or fetch-cache is wired
 *     (swr is NOT installed; see Session 11 audit).
 *   - "Updated Xm ago" pill polls /api/data/homepage-stats every 60s.
 *   - Language menu lists the 22 scheduled languages but only English is
 *     active (matches the existing Header.tsx LANGUAGES constant + the
 *     fact that only en + kn dictionaries exist).
 *   - Mobile collapses to logo + search + ♥ + ☰; the existing MobileSidebar
 *     is reused in Phase 2.12 wire-up rather than rebuilt here.
 *
 * Wire-up to [locale]/layout.tsx is deferred to Phase 2.12 of Session 11.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Github,
  Heart,
  Menu,
  Search,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { timeAgoLabel, type TimeAgoResult } from "@/lib/utils/timeAgo";

// ── Product dropdown items ────────────────────────────────
type Product = {
  key: "in" | "connect" | "jobs";
  name: string;
  suffix: string;
  suffixColor: string;
  href: string;
  comingSoon: boolean;
};

const PRODUCTS: Product[] = [
  { key: "in",      name: "ForThePeople", suffix: ".in",      suffixColor: "#2563EB", href: "/",                comingSoon: false },
  { key: "connect", name: "ForThePeople", suffix: ".connect", suffixColor: "#7C3AED", href: "/coming-soon",     comingSoon: true },
  { key: "jobs",    name: "ForThePeople", suffix: ".jobs",    suffixColor: "#BA7517", href: "/coming-soon",     comingSoon: true },
];

// ── 22 scheduled languages + English (mirrors legacy Header.LANGUAGES) ──
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

// ── GitHub stars: hardcoded until SWR / fetch-cache layer is added ──
// TODO(Session-11-followup): wire to public GitHub API
//   `https://api.github.com/repos/jayanthmb14/forthepeople`. Cache 1h.
//   Without `swr` installed, use a simple useEffect + setTimeout polling.
const GITHUB_STAR_FALLBACK = 149;
const GITHUB_REPO_URL = "https://github.com/jayanthmb14/forthepeople";

// ── "Updated X ago" pill polls homepage-stats every 60s.
// Uses the shared timeAgoLabel so behavior is uniform with the hero stat
// pill, footer, and live-activity ribbon (>2h → "Live", else real label).
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
        /* ignore — keep last value */
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

// ── Click-outside helper for dropdowns ────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

// ──────────────────────────────────────────────────────────
//  HeaderBar
// ──────────────────────────────────────────────────────────
export interface HeaderBarProps {
  locale: string;
  /** Optional callback for the mobile hamburger — wires MobileSidebar in Phase 2.12. */
  onOpenMobileNav?: () => void;
}

export default function HeaderBar({ locale, onOpenMobileNav }: HeaderBarProps) {
  const pathname = usePathname();
  const updated = useUpdatedPill();

  const [productOpen, setProductOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [search, setSearch] = useState("");

  const productRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(productRef, () => setProductOpen(false));
  useClickOutside(langRef, () => setLangOpen(false));

  // Escape closes whichever dropdown is open.
  useEffect(() => {
    if (!productOpen && !langOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProductOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [productOpen, langOpen]);

  const activeLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    // TODO(Session-11-followup): wire to a real /search route or to the
    // existing Header.tsx MODULE_INDEX autocomplete. For now we route to
    // the homepage with the query as a param so it survives navigation.
    window.location.href = `/${locale}?q=${encodeURIComponent(q)}`;
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
        }
        @media (min-width: 768px) {
          .ftp-header-bar .ftp-mobile-only { display: none !important; }
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
      `}</style>

      {/* ── Logo + product dropdown (combined trigger) ──
          The logo IS the trigger button. Clicking opens the menu listing
          .in / .connect / .jobs. The active product (.in) menu item still
          routes to /<locale> so the legacy "click logo → home" affordance
          is preserved (one extra click via the menu).

          ftplogofinal.png is intentionally not referenced — file does not
          exist in /public per Session 11 audit. Text fallback. Drop the
          image in /public/ftplogofinal.png and switch to <Image> later. */}
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
          <span>
            ForThePeople<span style={{ color: "#2563EB" }}>.in</span>
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
              const isActive = !p.comingSoon; // only .in is active today
              const targetHref = p.comingSoon ? "/coming-soon" : `/${locale}`;
              return (
                <li key={p.key} role="none">
                  <Link
                    role="menuitem"
                    href={targetHref}
                    onClick={() => setProductOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    title={isActive ? "Currently here" : "Not yet live"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "#1A1A1A",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      aria-label={isActive ? "Live" : "Not yet live"}
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: isActive ? "#10B981" : "#DC2626",
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {p.name}
                      <span style={{ color: p.suffixColor, fontWeight: 600 }}>{p.suffix}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── "Updated Xm ago" pill (or "Live" when stale >2h) ── */}
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
      <form
        onSubmit={onSearchSubmit}
        role="search"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#FAFAF8",
          border: "1px solid #E8E8E4",
          borderRadius: 10,
          padding: "6px 10px",
          maxWidth: 480,
        }}
      >
        <Search size={14} style={{ color: "#9B9B9B", flexShrink: 0 }} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search district or module…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search district or module"
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

      {/* ── Theme toggle ── */}
      <span className="ftp-desktop-only">
        <ThemeToggle />
      </span>

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
              minWidth: 220,
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
              const item = (
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 13,
                    color: l.active ? "#1A1A1A" : "#9B9B9B",
                  }}
                >
                  <span>{l.nameLocal}</span>
                  <span style={{ fontSize: 11, color: "#6B6B6B" }}>{l.name}</span>
                </span>
              );
              return (
                <li key={l.code} role="none">
                  {l.active ? (
                    <Link
                      role="menuitem"
                      href={`/${l.code}${pathname?.replace(/^\/[a-z]{2}/, "") ?? ""}`}
                      onClick={() => setLangOpen(false)}
                      style={{
                        display: "block",
                        padding: "8px 10px",
                        borderRadius: 6,
                        textDecoration: "none",
                        background: isActive ? "#EFF6FF" : "transparent",
                      }}
                    >
                      {item}
                    </Link>
                  ) : (
                    <span
                      role="menuitem"
                      title="Coming soon"
                      style={{
                        display: "block",
                        padding: "8px 10px",
                        borderRadius: 6,
                        cursor: "not-allowed",
                      }}
                    >
                      {item}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── GitHub link + star count ── */}
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`GitHub repository (${GITHUB_STAR_FALLBACK} stars)`}
        className="ftp-link-btn ftp-desktop-only"
        style={{ fontSize: 12 }}
      >
        <Github size={14} aria-hidden="true" />
        <span style={{ fontFamily: "var(--font-mono, monospace)" }}>★ {GITHUB_STAR_FALLBACK}</span>
      </a>

      {/* ── Support button ── */}
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
      >
        <Heart size={14} aria-hidden="true" fill="currentColor" />
        Support
      </Link>

      {/* ── Mobile hamburger ── */}
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className="ftp-link-btn ftp-mobile-only"
        style={{ padding: 6 }}
      >
        <Menu size={18} aria-hidden="true" />
      </button>
    </header>
  );
}
