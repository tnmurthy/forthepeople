/**
 * ForThePeople.in — State-level demographic rollup endpoint
 *
 * GET /api/data/population/state?state=<slug>
 *
 * Returns state-level Census 2011 totals + per-district rollup for choropleths.
 * Includes inactive districts (needed for map completeness).
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 86400;

type EconomicClassShape = { mpiHeadcount?: number; mpi?: number } | null | undefined;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const stateSlug = sp.get("state");

  if (!stateSlug) {
    return NextResponse.json({ error: "state param required" }, { status: 400 });
  }

  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: {
      demographicProfiles: {
        where: { level: "STATE" },
        orderBy: [{ year: "desc" }],
      },
      districts: {
        orderBy: { name: "asc" },
        include: {
          demographicProfiles: {
            orderBy: [{ year: "desc" }],
          },
        },
      },
    },
  });

  if (!state) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }

  const stateCensus =
    state.demographicProfiles.find((p) => p.dataset === "Census 2011") ??
    state.demographicProfiles[0] ??
    null;

  const districts = state.districts.map((d) => {
    const census =
      d.demographicProfiles.find((p) => p.dataset === "Census 2011") ??
      d.demographicProfiles[0] ??
      null;
    const mpiProfile = d.demographicProfiles.find((p) => p.dataset === "NITI MPI 2023");
    const ec = mpiProfile?.economicClass as EconomicClassShape;

    return {
      districtId: d.id,
      slug: d.slug,
      name: d.name,
      active: d.active,
      totalPopulation: census?.totalPopulation ?? null,
      literacy: census?.literacyTotal ?? null,
      sexRatio: census?.sexRatio ?? null,
      urbanPct: census?.urbanPct ?? null,
      mpi: ec?.mpiHeadcount ?? null,
    };
  });

  const latest = state.demographicProfiles[0] ?? null;
  const dataAgeDays = latest?.publishedAt
    ? Math.floor((Date.now() - latest.publishedAt.getTime()) / 86_400_000)
    : null;

  return NextResponse.json({
    state: stateCensus
      ? {
          totalPopulation: stateCensus.totalPopulation,
          literacy: stateCensus.literacyTotal,
          sexRatio: stateCensus.sexRatio,
          urbanPct: stateCensus.urbanPct,
          density: stateCensus.density,
          areaSqKm: stateCensus.areaSqKm,
          childSexRatio: stateCensus.childSexRatio,
        }
      : null,
    districts,
    meta: {
      lastUpdated: latest?.updatedAt?.toISOString() ?? null,
      source: stateCensus?.dataset ?? "Census 2011",
      dataAgeDays,
    },
  });
}
