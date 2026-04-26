/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 12 v7 — HowItWorks 4-step explainer.
 *
 * Sections in order: Aggregate → Process → Surface → Sustain.
 * Step numbers count up from 00 → 01/02/03/04 via useCountUp.
 * Stagger reveal on scroll-into-view (80ms apart).
 * Sources caption below the grid acknowledges every upstream we use.
 */

"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

// Session 15 v9 Phase G (Fix #9): production wording — 3 short steps.
const STEPS = [
  {
    num: 1,
    icon: "📡",
    title: "We Collect",
    desc: "Data from government portals every 5–30 minutes.",
  },
  {
    num: 2,
    icon: "📊",
    title: "We Organize",
    desc: "Into 32 dashboards with charts & maps.",
  },
  {
    num: 3,
    icon: "👁️",
    title: "You See",
    desc: "Real-time district data. Free. Open source. Yours.",
  },
];

function StepNumber({ target }: { target: number }) {
  const { value, ref } = useCountUp<HTMLDivElement>(target);
  const display = value.toString().padStart(2, "0");
  return (
    <div className="ftp-how-num-circle" ref={ref}>
      {display}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="ftp-section-wrap ftp-how-wrap"
      style={{ borderTop: "1px solid #F0F0EC" }}
    >
      <style>{`
        .ftp-how-h2 {
          margin: 0 0 24px;
          font-size: 22px; font-weight: 600;
          letter-spacing: -0.01em;
          color: #1A1A1A;
        }
        /* Session 13 v8 Phase K (Fix #17) + Session 15 v9 Phase G: 3 columns now (was 4) */
        .ftp-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
          position: relative;
        }
        /* Connecting line behind the cards (desktop only) */
        /* Session 14 v8.1 Phase I (Fix #16): line tinted blue to match site theme. */
        .ftp-how-grid::before {
          content: "";
          position: absolute;
          top: 40px;
          left: 12.5%;
          right: 12.5%;
          height: 1px;
          background: linear-gradient(to right, transparent, #DBEAFE 10%, #DBEAFE 90%, transparent);
          z-index: 0;
        }
        .ftp-how-step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          opacity: 0;
          transform: translateY(8px);
          animation: ftp-card-reveal 400ms ease-out forwards;
          transition: transform 200ms ease, border-color 150ms ease, box-shadow 200ms ease;
        }
        .ftp-how-step:hover {
          border-color: #2563EB;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.08);
        }
        .ftp-how-num-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          align-self: flex-start;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
          animation: ftp-num-pop 0.5s ease-out;
        }
        @keyframes ftp-num-pop {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .ftp-how-icon { font-size: 28px; line-height: 1; }
        .ftp-how-title { font-size: 16px; font-weight: 600; color: #1A1A1A; }
        .ftp-how-desc {
          font-size: 12px; color: #4B5563; line-height: 1.55;
        }
        .ftp-how-caption {
          font-size: 11px; color: #9B9B9B;
          line-height: 1.6; font-style: italic;
          text-align: center;
          padding-top: 16px;
          border-top: 0.5px solid #E5E7EB;
          margin: 0;
        }
        @keyframes ftp-card-reveal {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .ftp-how-grid { grid-template-columns: repeat(2, 1fr); }
          .ftp-how-grid::before { display: none; }
        }
        @media (max-width: 767px) {
          .ftp-how-grid { grid-template-columns: 1fr; gap: 12px; }
          .ftp-how-grid::before { display: none; }
          .ftp-how-step { padding: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-how-step { animation: none; opacity: 1; transform: none; transition: none; }
          .ftp-how-step:hover { transform: none; box-shadow: none; }
          .ftp-how-num-circle { animation: none; }
        }
      `}</style>

      <div className="ftp-section-inner">
        <h2 id="how-heading" className="ftp-how-h2">
          How it works
        </h2>
        <div className="ftp-how-grid">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="ftp-how-step"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <StepNumber target={step.num} />
              <div className="ftp-how-icon" aria-hidden="true">{step.icon}</div>
              <div className="ftp-how-title">{step.title}</div>
              <div className="ftp-how-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
