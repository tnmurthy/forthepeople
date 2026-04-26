/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 *
 * Session 11 redesign — PricingTiers (3 cards: District / State / Patron).
 *
 * PRICE VERIFICATION (Session 11 audit, 2026-04-26):
 *   Local source-of-truth confirms ₹999/mo for State Champion across:
 *     - src/lib/razorpay/plans.ts:56  (state_champion_monthly amount: 99900)
 *     - src/components/common/BadgeExplainer.tsx:51  ("₹999/month")
 *     - src/components/common/StateSponsorSection.tsx:204,222  ("₹999/mo")
 *     - src/components/common/DistrictSponsorBanner.tsx:294
 *     - src/app/api/data/contributors/route.ts  (visibility threshold lowered
 *       from ₹1,999 to ₹999 on 2026-04-24)
 *     - src/app/[locale]/admin/supporters/ManualSupporterForm.tsx:44
 *   Production /support page may still show ₹1,999 (stale build); the
 *   unified push from Session 12 will sync production to ₹999.
 *
 * District = ₹99/mo  ·  State = ₹999/mo  ·  Patron = ₹9,999/mo
 *
 * One-Time + Founding Builder are linked as text below the 3 cards.
 */

import Link from "next/link";

interface TierCardProps {
  badge: string;
  badgeBg: string;
  badgeColor: string;
  /** Price amount only, e.g. "₹999". Period suffix is rendered in a smaller span. */
  price: string;
  /** Period suffix, e.g. "/ mo". Rendered smaller + lighter than the price. */
  pricePeriod?: string;
  perDay: string;
  description: string;
  ctaLabel: string;
  ctaBg: string;
  ctaHref: string;
  cardBg: string;
  cardBorder: string;
  highlighted?: boolean;
  popularLabel?: string;
}

const SUPPORT_BASE = (locale: string) => `/${locale}/support`;

export default function PricingTiers({ locale }: { locale: string }) {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="ftp-section-wrap ftp-pricing-wrap"
      style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0EC" }}
    >
      <div className="ftp-section-inner">
      <div style={{ marginBottom: 18 }}>
        <h2
          id="pricing-heading"
          style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1A1A" }}
        >
          Choose your contribution
        </h2>
        <p style={{ marginTop: 4, fontSize: 13, color: "#6B7280" }}>
          Click any tier — auto-selects on the support page.
        </p>
      </div>

      <style>{`
        .ftp-pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr 1fr;
          gap: 16px;
          align-items: stretch;
        }
        @media (max-width: 767px) {
          .ftp-pricing-grid { grid-template-columns: 1fr !important; }
        }
        .ftp-tier-card {
          padding: 22px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 240px;
        }
        .ftp-tier-card.highlighted {
          animation: ftp-tier-glow 4s ease-in-out infinite;
        }
        @keyframes ftp-tier-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(110, 89, 192, 0.0); }
          50%      { box-shadow: 0 0 0 6px rgba(110, 89, 192, 0.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-tier-card.highlighted { animation: none; }
        }
        .ftp-tier-badge {
          display: inline-block;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          border-radius: 999px;
          align-self: flex-start;
        }
        .ftp-tier-popular {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 3px 10px;
          background: #6E59C0;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          border-radius: 999px;
        }
        .ftp-tier-cta {
          margin-top: auto;
          padding: 10px 16px;
          border-radius: 999px;
          color: #FFFFFF;
          font-weight: 600;
          font-size: 13px;
          text-align: center;
          text-decoration: none;
          display: block;
        }
      `}</style>

      <div className="ftp-pricing-grid">
        <TierCard
          badge="⌂ DISTRICT CHAMPION"
          badgeBg="#DCFCE7"
          badgeColor="#166534"
          price="₹99"
          pricePeriod="/ mo"
          perDay="≈ ₹3.30 / day"
          description="Pick your district · name on its page"
          ctaLabel="Subscribe ₹99 →"
          ctaBg="#16A34A"
          ctaHref={`${SUPPORT_BASE(locale)}?tier=district&autoselect=district`}
          cardBg="#FFFFFF"
          cardBorder="#E5E7EB"
        />
        <TierCard
          badge="⛳ STATE CHAMPION"
          badgeBg="#EEEDFE"
          badgeColor="#3C3489"
          price="₹999"
          pricePeriod="/ mo"
          perDay="≈ ₹33 / day"
          description="Pick your state · name on every district in it"
          ctaLabel="Subscribe ₹999 →"
          ctaBg="#6E59C0"
          ctaHref={`${SUPPORT_BASE(locale)}?tier=state&autoselect=state`}
          cardBg="#EEEDFE"
          cardBorder="#6E59C0"
          highlighted
          popularLabel="MOST POPULAR"
        />
        <TierCard
          badge="★ ALL-INDIA PATRON"
          badgeBg="#FCEBEB"
          badgeColor="#791F1F"
          price="₹9,999"
          pricePeriod="/ mo"
          perDay="≈ ₹333 / day"
          description="Featured across all 780+ districts"
          ctaLabel="Subscribe ₹9,999 →"
          ctaBg="#DC2626"
          ctaHref={`${SUPPORT_BASE(locale)}?tier=patron`}
          cardBg="#FCEBEB"
          cardBorder="#E24B4A"
        />
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          fontSize: 13,
        }}
      >
        <Link
          href={`${SUPPORT_BASE(locale)}#one-time`}
          style={{ color: "#6B7280", textDecoration: "none" }}
        >
          Or make a one-time contribution →
        </Link>
        <Link
          href={`${SUPPORT_BASE(locale)}#founding-builder`}
          style={{ color: "#BA7517", fontWeight: 500, textDecoration: "none" }}
        >
          Become a Founding Builder →
        </Link>
      </div>
      </div>
    </section>
  );
}

function TierCard(props: TierCardProps) {
  return (
    <div
      className={`ftp-tier-card${props.highlighted ? " highlighted" : ""}`}
      style={{
        background: props.cardBg,
        border: `${props.highlighted ? "2px" : "0.5px"} solid ${props.cardBorder}`,
      }}
    >
      {props.popularLabel && (
        <span className="ftp-tier-popular">{props.popularLabel}</span>
      )}
      <span
        className="ftp-tier-badge"
        style={{ background: props.badgeBg, color: props.badgeColor }}
      >
        {props.badge}
      </span>
      <div
        style={{
          marginTop: 18,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700 }}>{props.price}</span>
        {props.pricePeriod && (
          <span
            style={{
              marginLeft: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "#6B7280",
            }}
          >
            {props.pricePeriod}
          </span>
        )}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "#6B7280" }}>{props.perDay}</div>
      <p
        style={{
          marginTop: 16,
          fontSize: 13,
          color: "#374151",
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {props.description}
      </p>
      <Link
        href={props.ctaHref}
        className="ftp-tier-cta"
        style={{ background: props.ctaBg }}
      >
        {props.ctaLabel}
      </Link>
    </div>
  );
}
