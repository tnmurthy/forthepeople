/**
 * GET /api/data/responsibility?state=X&district=Y
 *
 * Returns district-specific civic responsibility items grouped by section.
 * If the district has no items seeded, returns { data: null, fallback: "generic" }
 * so the UI can render its existing generic content.
 *
 * Unverified phones are served as null; admin tab surfaces them for review.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type PublicSection = {
  section: string;
  icon: string;
  order: number;
  items: Array<{
    action: string;
    whyRelevant: string;
    reportTo: {
      name: string | null;
      url: string | null;
      phone: string | null;
    };
    sourceNotes: string | null;
  }>;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stateSlug = searchParams.get("state");
  const districtSlug = searchParams.get("district");

  if (!stateSlug || !districtSlug) {
    return NextResponse.json({ error: "state and district params required" }, { status: 400 });
  }

  const district = await prisma.district.findFirst({
    where: {
      slug: districtSlug,
      state: { slug: stateSlug },
    },
  });

  if (!district) {
    return NextResponse.json({ data: null, fallback: "generic" });
  }

  const items = await prisma.responsibilityItem.findMany({
    where: { districtId: district.id, active: true },
    orderBy: [{ sectionOrder: "asc" }, { itemOrder: "asc" }],
  });

  if (items.length === 0) {
    return NextResponse.json({ data: null, fallback: "generic" });
  }

  const bySection = new Map<string, PublicSection>();
  for (const item of items) {
    let sec = bySection.get(item.section);
    if (!sec) {
      sec = {
        section: item.section,
        icon: item.sectionIcon,
        order: item.sectionOrder,
        items: [],
      };
      bySection.set(item.section, sec);
    }
    sec.items.push({
      action: item.action,
      whyRelevant: item.whyRelevant,
      reportTo: {
        name: item.reportToName,
        url: item.reportToUrl,
        phone: item.phoneVerified ? item.reportToPhone : null,
      },
      sourceNotes: item.sourceNotes,
    });
  }

  const sections = Array.from(bySection.values()).sort((a, b) => a.order - b.order);

  return NextResponse.json({
    data: {
      districtName: district.name,
      districtSlug: district.slug,
      sections,
      itemCount: items.length,
    },
    fallback: null,
  });
}
