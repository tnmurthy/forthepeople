/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 13 v8 Phase L (Fix #15) — single-line footer.
 *
 * One warning row + one main row that holds:
 *   [links]   [brand IG + project GitHub]   [Built by Jayanth M B · Updated ...]
 *
 * Personal Instagram (@jayanth_m_b) removed — only the brand
 * @forthepeople_in IG and the project GitHub remain. Mobile wraps
 * gracefully into stacked rows.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Instagram } from "lucide-react";
import { timeAgoLabel, type TimeAgoResult } from "@/lib/utils/timeAgo";

export interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const [updated, setUpdated] = useState<TimeAgoResult>({
    label: "—",
    isStale: false,
    isLive: false,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/data/homepage-stats");
        if (!res.ok) return;
        const data = (await res.json()) as { mostRecentAt?: string | null };
        if (!cancelled) {
          setUpdated(timeAgoLabel(data.mostRecentAt ?? null));
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
      className="ftp-footer"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E8E8E4",
        marginTop: 32,
      }}
    >
      <style>{`
        .ftp-footer-warning {
          font-size: 11px;
          color: #92400E;
          background: #FFFBEB;
          border-bottom: 0.5px solid #FDE68A;
          text-align: center;
          padding: 6px 12px;
          letter-spacing: 0.02em;
        }
        .ftp-footer-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 12px;
          color: #6B7280;
        }
        .ftp-footer-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ftp-footer-links a {
          color: #6B7280;
          text-decoration: none;
        }
        .ftp-footer-links a:hover {
          color: #1A1A1A;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ftp-footer-links span.sep { color: #D1D5DB; }
        .ftp-footer-social {
          display: inline-flex;
          gap: 8px;
        }
        .ftp-footer-social a {
          color: #6B7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          transition: background-color 150ms, color 150ms;
        }
        .ftp-footer-social a:hover {
          background: #F5F5F0;
          color: #1A1A1A;
        }
        .ftp-footer-social a.brand-ig:hover {
          background: linear-gradient(135deg, #F58529, #DD2A7B, #8134AF);
          color: #FFFFFF;
        }
        .ftp-footer-icon { width: 18px; height: 18px; }
        .ftp-footer-built {
          font-size: 11px;
          color: #9B9B9B;
        }
        @media (max-width: 767px) {
          .ftp-footer-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 12px 16px;
          }
        }
      `}</style>

      <div className="ftp-footer-warning">
        ⚠ Independent · NOT an official government website · NDSAP · Article 19(1)(a)
      </div>

      <div className="ftp-footer-main">
        <div className="ftp-footer-links">
          <Link href={`/${locale}/about`}>About</Link>
          <span className="sep">·</span>
          <Link href={`/${locale}/privacy`}>Privacy</Link>
          <span className="sep">·</span>
          <Link href={`/${locale}/disclaimer`}>Disclaimer</Link>
          <span className="sep">·</span>
          <Link href={`/${locale}/contribute`}>Contribute</Link>
          <span className="sep">·</span>
          <Link href={`/${locale}/features`}>Features</Link>
          <span className="sep">·</span>
          <Link href={`/${locale}/feedback`}>Feedback</Link>
        </div>

        <div className="ftp-footer-social">
          <a
            href="https://www.instagram.com/forthepeople_in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ForThePeople on Instagram"
            className="brand-ig"
          >
            <Instagram className="ftp-footer-icon" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/jayanthmb14/forthepeople"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ForThePeople on GitHub"
          >
            <Github className="ftp-footer-icon" aria-hidden="true" />
          </a>
        </div>

        <div className="ftp-footer-built">
          Built by Jayanth M B · Updated{" "}
          {updated.isLive ? "Live" : updated.label}
        </div>
      </div>
    </footer>
  );
}
