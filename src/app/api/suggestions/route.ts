/**
 * Public community suggestions endpoint.
 *
 *   POST /api/suggestions   submit (validated, rate-limited)
 *   GET  /api/suggestions   list ACCEPTED + IMPLEMENTED suggestions (public)
 *
 * Rate limit: 3 submissions per IP per rolling hour (in-memory; swap to
 * Upstash Redis when single-server assumption breaks).
 *
 * Email notification: if RESEND_API_KEY is set, a non-blocking email goes
 * to forthepeople1547@gmail.com (FTP product inbox, NOT jayanth's personal
 * email) so Jayanth sees new suggestions promptly.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateContributorName } from "@/lib/validators/contributor-name";
import { sendEmail } from "@/lib/email";

const VALID_CATEGORIES = ["Feature", "Bug", "Data", "UX", "Other"] as const;
const PRODUCT_NOTIFICATION_TO =
  process.env.ADMIN_EMAIL || "forthepeople1547@gmail.com";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + hour });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit — max 3 suggestions per hour." },
      { status: 429 },
    );
  }

  const body = await req.json();

  const nameResult = validateContributorName(body.name);
  if (!nameResult.ok) {
    return NextResponse.json({ error: nameResult.reason }, { status: 400 });
  }

  if (
    !body.title ||
    typeof body.title !== "string" ||
    body.title.trim().length < 5 ||
    body.title.trim().length > 120
  ) {
    return NextResponse.json({ error: "Title must be 5-120 characters." }, { status: 400 });
  }
  if (
    !body.body ||
    typeof body.body !== "string" ||
    body.body.trim().length < 20 ||
    body.body.trim().length > 2000
  ) {
    return NextResponse.json({ error: "Details must be 20-2000 characters." }, { status: 400 });
  }

  const category = VALID_CATEGORIES.includes(body.category) ? body.category : "Other";
  const email = typeof body.email === "string" && body.email.trim()
    ? body.email.trim().slice(0, 120)
    : null;

  const suggestion = await prisma.suggestion.create({
    data: {
      name: nameResult.cleaned,
      email,
      title: body.title.trim(),
      body: body.body.trim(),
      category,
      status: "PENDING",
    },
  });

  // Fire-and-forget email notification (never block submission on failure).
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  sendEmail({
    to: PRODUCT_NOTIFICATION_TO,
    subject: `[FTP Suggestion] ${suggestion.title.slice(0, 60)}`,
    html: `<p>From: <strong>${esc(suggestion.name)}</strong>${
      suggestion.email ? ` &lt;${esc(suggestion.email)}&gt;` : ""
    }</p>
           <p><strong>${esc(suggestion.title)}</strong></p>
           <p style="white-space:pre-wrap">${esc(suggestion.body)}</p>
           <p>Category: ${esc(suggestion.category ?? "Other")}</p>
           <p>Review in admin: <code>/admin/suggestions</code> (id ${suggestion.id})</p>`,
  }).catch((e) => console.error("[suggestions] Resend notify failed (non-blocking):", e));

  return NextResponse.json({ ok: true, id: suggestion.id });
}

export async function GET() {
  const items = await prisma.suggestion.findMany({
    where: { status: { in: ["ACCEPTED", "IMPLEMENTED"] } },
    select: {
      id: true,
      name: true,
      title: true,
      body: true,
      category: true,
      status: true,
      upvotes: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: items });
}
