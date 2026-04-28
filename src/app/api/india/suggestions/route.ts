/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * GET  /api/india/suggestions  — list module suggestions (top voted)
 * POST /api/india/suggestions  — submit a new module suggestion
 *
 * Phase 1 stubs. Real validation, IP-hash, rate-limit, and DB writes
 * land in Phase 6 (file 31 §20). For now the GET returns an empty list
 * and POST 200s any body so the UI can be developed against a working
 * shape. See docs/india/31 §12 + §16.
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    suggestions: [],
    stub: true,
  });
}

export async function POST(request: Request) {
  // Phase 6 will validate (3-80 char title, no URLs, light profanity filter),
  // hash the IP, rate-limit, and insert into IndiaModuleSuggestion.
  // For now we just acknowledge so the form's optimistic UI can be wired up.
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  return NextResponse.json({
    accepted: false,
    message: "Suggestions endpoint not yet implemented (Phase 6).",
    received: body,
    stub: true,
  });
}
