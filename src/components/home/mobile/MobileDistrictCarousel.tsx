/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase D: horizontal swipe carousel for live districts.
 * Replaces the desktop vertical district list at viewport ≤ 767px.
 *
 * Each card: SVG district icon + NEW badge + name + nameLocal + tagline.
 * Scroll-snap-x with intersection observer driving the dot indicator.
 */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getDistrictIcon } from "@/components/district/icons";

interface DistrictRow {
  slug: string;
  name: string;
  nameLocal: string;
  tagline: string | null;
  stateSlug: string;
  stateName: string;
  goLiveDate: string | null;
}

function isWithin30Days(iso: string | null): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 30 * 24 * 60 * 60 * 1000;
}

interface Props {
  locale: string;
  districts: DistrictRow[];
}

export function MobileDistrictCarousel({ locale, districts }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = parseInt(
              (e.target as HTMLElement).dataset.idx || "0",
              10,
            );
            setActiveIdx(idx);
          }
        }
      },
      { root: el, threshold: 0.5 },
    );
    el.querySelectorAll(".ftp-m-district-card").forEach((c) =>
      observer.observe(c),
    );
    return () => observer.disconnect();
  }, [districts.length]);

  return (
    <section
      className="ftp-m-section ftp-m-districts-section"
      aria-labelledby="m-districts-heading"
    >
      <header className="ftp-m-section-head">
        <h2 id="m-districts-heading">
          <span className="ftp-m-live-dot" aria-hidden="true" /> LIVE DISTRICTS ·{" "}
          {districts.length}
        </h2>
        <Link href={`/${locale}`} className="ftp-m-section-cta">
          View map →
        </Link>
      </header>

      <div
        className="ftp-m-carousel"
        ref={carouselRef}
        role="region"
        aria-label="Live districts"
      >
        {districts.map((d, i) => {
          const Icon = getDistrictIcon(d.slug);
          const isNew = isWithin30Days(d.goLiveDate);
          return (
            <Link
              key={d.slug}
              href={`/${locale}/${d.stateSlug}/${d.slug}`}
              className="ftp-m-district-card"
              data-idx={i}
            >
              <div className="ftp-m-district-card-head">
                {Icon && <Icon size={32} className="ftp-m-district-card-icon" />}
                {isNew && <span className="ftp-m-district-card-new">NEW</span>}
              </div>
              <div className="ftp-m-district-card-name">{d.name}</div>
              {d.nameLocal && (
                <div className="ftp-m-district-card-name-local">{d.nameLocal}</div>
              )}
              {d.tagline && (
                <div className="ftp-m-district-card-tagline">{d.tagline}</div>
              )}
              <div className="ftp-m-district-card-state">{d.stateName}</div>
            </Link>
          );
        })}
      </div>

      <div
        className="ftp-m-carousel-dots"
        role="tablist"
        aria-label="Carousel position"
      >
        {districts.map((_, i) => (
          <span
            key={i}
            className={`ftp-m-dot ${i === activeIdx ? "active" : ""}`}
            aria-current={i === activeIdx}
          />
        ))}
      </div>
    </section>
  );
}
