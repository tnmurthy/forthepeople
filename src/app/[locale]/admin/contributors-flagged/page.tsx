/**
 * Flagged Names — admin review tab.
 * Lists all Supporter rows with nameFlagged=true so Jayanth can review
 * auto-cleaned (salvaged) and anonymized entries.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import FlaggedNamesClient from "./FlaggedNamesClient";

const COOKIE = "ftp_admin_v1";
type Params = Promise<{ locale: string }>;

export default async function FlaggedContributorsPage({ params }: { params: Params }) {
  const { locale } = await params;
  const authed = (await cookies()).get(COOKIE)?.value === "ok";
  if (!authed) redirect(`/${locale}/admin`);

  const rows = await prisma.supporter.findMany({
    where: { nameFlagged: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      originalName: true,
      email: true,
      tier: true,
      amount: true,
      createdAt: true,
    },
  });

  const serialized = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Flagged Names</h1>
        <p style={{ color: "#6B6B6B", fontSize: 13 }}>
          Supporters whose original name failed validation. Already-cleaned names
          are visible on the public contributors page; this tab is for manual review
          and override. {rows.length} flagged {rows.length === 1 ? "row" : "rows"}.
        </p>
      </div>
      <FlaggedNamesClient initialRows={serialized} />
    </div>
  );
}
