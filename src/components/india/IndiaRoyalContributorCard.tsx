/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "Royal Contributor of India · ₹9,999/month" CTA.
 *
 * Ported from /en/india-detail Section 8. Visual matches the original
 * exactly (amber gradient + "Become a Royal Contributor" pill) so the
 * redirect handoff is seamless. Tier slug `royal_india` is unchanged
 * from the original; the support page knows how to handle it.
 */

import Link from "next/link";
import { INDIA_DESIGN } from "@/lib/india/india-design";

interface Props {
  locale: string;
  activeDistrictCount: number;
}

export default function IndiaRoyalContributorCard({ locale, activeDistrictCount }: Props) {
  return (
    <section
      style={{
        padding: "24px 16px",
        maxWidth: INDIA_DESIGN.sectionMaxWidth,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          border: "1px solid #FDE68A",
          borderRadius: 16,
          padding: "24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#92400E",
          }}
        >
          ❤️ Keep all of India covered
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: INDIA_DESIGN.textPrimary,
            lineHeight: 1.3,
          }}
        >
          Royal Contributor of India · ₹9,999/month
        </div>
        <p
          style={{
            fontSize: 13,
            color: INDIA_DESIGN.textSecondary,
            lineHeight: 1.6,
            margin: "4px 0 0",
            maxWidth: 480,
          }}
        >
          Your name featured on every district dashboard across {activeDistrictCount} live
          districts — and on all future districts as they launch.
        </p>
        <Link
          href={`/${locale}/support?tier=royal_india`}
          style={{
            marginTop: 10,
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            background: INDIA_DESIGN.textPrimary,
            color: "#FFFFFF",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Become a Royal Contributor →
        </Link>
      </div>
    </section>
  );
}
