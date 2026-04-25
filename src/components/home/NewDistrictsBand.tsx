/**
 * NEW DISTRICTS THIS MONTH band — server component for /en.
 *
 * Reads from Prisma directly (parallels the data layer used by
 * /en/india-detail). Renders 3-up grid on desktop and horizontal
 * scroll-snap row on mobile.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

const DAYS_NEW = 45;
const FUTURE_GRACE_MS = 24 * 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isNew(goLiveDate: Date | null): boolean {
  if (!goLiveDate) return false;
  const ms = Date.now() - goLiveDate.getTime();
  return ms >= -FUTURE_GRACE_MS && ms < DAYS_NEW * MS_PER_DAY;
}

function gradeColor(grade: string | null): { bg: string; text: string; border: string } {
  if (!grade) return { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
  if (grade.startsWith("A")) return { bg: "#ECFDF5", text: "#15803D", border: "#A7F3D0" };
  if (grade.startsWith("B")) return { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" };
  if (grade.startsWith("C")) return { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" };
  if (grade.startsWith("D")) return { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" };
  return { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
}

export async function NewDistrictsBand({ locale }: { locale: string }) {
  const districts = await prisma.district.findMany({
    where: { active: true },
    select: {
      id: true, slug: true, name: true, nameLocal: true, tagline: true,
      goLiveDate: true,
      state: { select: { slug: true, name: true } },
      healthScore: { select: { grade: true } },
    },
  });

  const newDistricts = districts
    .filter((d) => isNew(d.goLiveDate))
    .sort((a, b) => (b.goLiveDate?.getTime() ?? 0) - (a.goLiveDate?.getTime() ?? 0))
    .slice(0, 3);

  if (newDistricts.length === 0) return null;

  return (
    <section
      style={{
        padding: "24px 16px 8px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "#9B9B9B",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span aria-hidden="true">🆕</span> New districts this month
          </div>
          <div style={{ fontSize: 13, color: "#6B6B6B", marginTop: 2 }}>
            {newDistricts.length} {newDistricts.length === 1 ? "district" : "districts"} launched in the last 30 days
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 8,
          marginRight: -16,
          paddingRight: 16,
          scrollbarWidth: "none",
        }}
        className="md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:m-0 md:p-0"
      >
        {newDistricts.map((d) => {
          const gc = gradeColor(d.healthScore?.grade ?? null);
          return (
            <Link
              key={d.id}
              href={`/${locale}/${d.state.slug}/${d.slug}`}
              style={{
                flex: "0 0 280px",
                scrollSnapAlign: "start",
                background: "#FFFFFF",
                border: "1px solid #E8E8E4",
                borderRadius: 14,
                padding: "16px 18px",
                textDecoration: "none",
                color: "#1A1A1A",
                display: "flex",
                flexDirection: "column",
                minHeight: 152,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "border-color 150ms, box-shadow 150ms",
              }}
              className="md:flex-auto"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px" }}>
                  {d.name}
                </span>
                {d.healthScore?.grade && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: gc.bg,
                      color: gc.text,
                      border: `1px solid ${gc.border}`,
                    }}
                  >
                    {d.healthScore.grade}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: 10,
                    background: "#ECFDF5",
                    color: "#065F46",
                    border: "1px solid #A7F3D0",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  New
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 10 }}>
                {d.state.name}
              </div>
              {d.tagline && (
                <div style={{ fontSize: 12.5, color: "#6B6B6B", flex: 1, lineHeight: 1.5 }}>
                  {d.tagline}
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: "#2563EB",
                  fontWeight: 600,
                  marginTop: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Explore <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
