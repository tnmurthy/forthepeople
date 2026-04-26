/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — drop-in replacement for src/components/layout/Footer.tsx.
 *
 * The legacy Footer renders a live IST clock; this redesign trades that
 * for an "Updated Xm ago" pill (consistent with the HeaderBar pill) and
 * adds the brand Instagram (@forthepeople_in) which was previously
 * missing from the homepage chrome.
 *
 * Wire-up to [locale]/layout.tsx is deferred to a future cleanup so
 * district pages keep the legacy footer until they too get a redesign.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Instagram } from "lucide-react";

function formatAgo(now: number, then: Date): string {
  const ms = now - then.getTime();
  if (ms < 60_000) return "just now";
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const [ago, setAgo] = useState<string>("—");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as { mostRecentAt?: string | null };
        if (!cancelled && data.mostRecentAt) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAgo(formatAgo(Date.now(), new Date(data.mostRecentAt)));
        }
      } catch {
        /* ignore */
      }
    }
    load();
    const t = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <footer
      role="contentinfo"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E8E8E4",
        marginTop: 32,
      }}
    >
      <style>{`
        .ftp-footer-warn {
          background: #FAEEDA;
          color: #78350F;
          padding: 8px 16px;
          font-size: 11px;
          text-align: center;
          letter-spacing: 0.02em;
        }
        .ftp-footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 16px 12px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: #6B7280;
        }
        .ftp-footer-grid a { color: #6B7280; text-decoration: none; }
        .ftp-footer-grid a:hover { color: #1A1A1A; }
        .ftp-footer-social {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8px 16px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 12px;
          color: #9B9B9B;
        }
        .ftp-footer-social-icons {
          display: inline-flex;
          gap: 8px;
        }
        .ftp-footer-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          color: #6B7280;
          transition: background-color 150ms, color 150ms;
        }
        .ftp-footer-icon:hover { background: #F5F5F0; color: #1A1A1A; }
        .ftp-footer-icon.brand-ig:hover {
          background: linear-gradient(135deg, #F58529, #DD2A7B, #8134AF);
          color: #FFFFFF;
        }
        .ftp-footer-icon.personal-ig {
          width: 26px; height: 26px;
        }
        @media (max-width: 767px) {
          .ftp-footer-grid { gap: 10px; }
          .ftp-footer-social { flex-direction: column-reverse; align-items: flex-start; gap: 8px; }
        }
      `}</style>

      {/* ── Row 1: warning ── */}
      <div className="ftp-footer-warn">
        ⚠ Independent · NOT an official government website · NDSAP · Article 19(1)(a)
      </div>

      {/* ── Row 2: links ── */}
      <div className="ftp-footer-grid">
        <Link href={`/${locale}/about`}>About</Link>
        <Link href={`/${locale}/privacy`}>Privacy</Link>
        <Link href={`/${locale}/disclaimer`}>Disclaimer</Link>
        <Link href={`/${locale}/contribute`}>Contribute</Link>
        <Link href={`/${locale}/features`}>Features</Link>
        <Link href={`/${locale}/feedback`}>Feedback</Link>
        <span style={{ marginLeft: "auto", color: "#9B9B9B" }}>
          Built by{" "}
          <a
            href="https://www.instagram.com/jayanth_m_b/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6B7280" }}
          >
            Jayanth M B
          </a>
        </span>
      </div>

      {/* ── Row 3: social + updated pill ── */}
      <div className="ftp-footer-social">
        <div className="ftp-footer-social-icons">
          <a
            href="https://www.instagram.com/forthepeople_in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ForThePeople on Instagram (@forthepeople_in)"
            className="ftp-footer-icon brand-ig"
          >
            <Instagram size={16} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/jayanthmb14/forthepeople"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ForThePeople on GitHub"
            className="ftp-footer-icon"
          >
            <Github size={16} aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/jayanth_m_b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Jayanth M B personal Instagram"
            className="ftp-footer-icon personal-ig"
            title="Personal — @jayanth_m_b"
          >
            <Instagram size={13} aria-hidden="true" />
          </a>
        </div>
        <span style={{ fontSize: 11 }}>Updated {ago}</span>
      </div>
    </footer>
  );
}
