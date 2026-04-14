/**
 * ForThePeople.in — Lazy Infrastructure Project Analysis
 *
 * GET /api/data/infra-analysis?projectId=<cuid>
 *
 * Generates a NEUTRAL project analysis with Gemini 2.5 Pro
 * (purpose="insight"). Cached in Redis for 24h per project so repeat
 * clicks don't trigger extra AI calls.
 *
 * Tone rules — enforced in the system prompt:
 *   • Facts only. No judgment.
 *   • Never "scam/loot/corrupt/waste". Never attribute blame.
 *   • Comparative data welcomed (cost per km vs peer projects).
 */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/db";
import { callAI } from "@/lib/ai-provider";
import redis from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 60;

const CACHE_TTL_SECONDS = 24 * 60 * 60;

interface InfraAnalysis {
  citizenImpact: string[];
  accountability: string[];
  notes: string;
  sources: number;
  generatedAt: string;
  cached: boolean;
}

const SYSTEM_PROMPT =
  "You produce a NEUTRAL, factual infrastructure project analysis. " +
  "Return ONLY JSON. You must: (1) never use 'scam', 'loot', 'corrupt', 'waste', or any moral judgment; " +
  "(2) never attribute blame to any person or party; " +
  "(3) never invent figures or dates that aren't in the supplied data; " +
  "(4) quote any news-alleged controversy as 'According to [source], concerns were raised about…'. " +
  "Output 2 short, factual bullet lists: citizenImpact (~3 bullets, what the project means for citizens) and " +
  "accountability (~3 bullets, comparative or quantitative facts citizens can weigh themselves). " +
  "Keep every bullet under 160 characters.";

function buildPrompt(project: Record<string, unknown>, updates: Array<Record<string, unknown>>): string {
  return `Project record:
${JSON.stringify(project, null, 2)}

Recent news updates (most recent first):
${JSON.stringify(updates.slice(0, 15), null, 2)}

Return JSON shaped:
{
  "citizenImpact": ["bullet 1", "bullet 2", "bullet 3"],
  "accountability": ["bullet 1", "bullet 2", "bullet 3"],
  "notes": "Optional one-line caveat for readers."
}

Rules reminder:
- Neutral tone only. Facts, not opinions.
- If you don't have a fact, leave it out — don't invent.
- If you cite cost-per-km or timeline comparisons, only reference well-known public projects.`;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const projectId = sp.get("projectId") ?? "";
  if (!projectId) {
    return NextResponse.json({ error: "projectId param required" }, { status: 400 });
  }

  // ── Cache ─────────────────────────────────────────────────
  const cacheKey = `ftp:infra-analysis:${projectId}:v1`;
  try {
    if (redis) {
      const cached = await redis.get<InfraAnalysis>(cacheKey);
      if (cached) {
        const resp = NextResponse.json({ ...cached, cached: true });
        resp.headers.set("Cache-Control", "public, s-maxage=3600");
        return resp;
      }
    }
  } catch {
    /* non-fatal */
  }

  try {
    const project = await prisma.infraProject.findUnique({
      where: { id: projectId },
      select: {
        id: true, name: true, shortName: true, category: true, status: true, scope: true,
        announcedBy: true, announcedByRole: true, party: true, executingAgency: true,
        keyPeople: true,
        originalBudget: true, revisedBudget: true, costOverrun: true, costOverrunPct: true,
        announcedDate: true, actualStartDate: true, originalEndDate: true,
        revisedEndDate: true, completionDate: true, cancelledDate: true,
        cancellationReason: true, delayMonths: true, progressPct: true,
        verificationCount: true,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updates = await prisma.infraUpdate.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      take: 20,
      select: {
        date: true, updateType: true, headline: true, summary: true,
        personName: true, personRole: true, personParty: true,
        budgetChange: true, progressPct: true, newsSource: true, newsUrl: true,
      },
    });

    const response = await callAI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildPrompt(project as unknown as Record<string, unknown>, updates as unknown as Array<Record<string, unknown>>),
      purpose: "insight", // Gemini 2.5 Pro per spec
      jsonMode: true,
      maxTokens: 700,
      temperature: 0.3,
    });

    let analysis: InfraAnalysis;
    try {
      const cleaned = response.text.trim().replace(/```(?:json)?/g, "").trim();
      const parsed = JSON.parse(cleaned) as Partial<InfraAnalysis>;
      analysis = {
        citizenImpact: Array.isArray(parsed.citizenImpact) ? parsed.citizenImpact.filter((s): s is string => typeof s === "string").slice(0, 6) : [],
        accountability: Array.isArray(parsed.accountability) ? parsed.accountability.filter((s): s is string => typeof s === "string").slice(0, 6) : [],
        notes: typeof parsed.notes === "string" ? parsed.notes : "AI-generated from news sources. Verify with the executing agency for official project status.",
        sources: updates.length,
        generatedAt: new Date().toISOString(),
        cached: false,
      };
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    // Cache 24h
    try {
      if (redis) await redis.set(cacheKey, analysis, { ex: CACHE_TTL_SECONDS });
    } catch {
      /* non-fatal */
    }

    const resp = NextResponse.json(analysis);
    resp.headers.set("Cache-Control", "public, s-maxage=3600");
    return resp;
  } catch (err) {
    Sentry.captureException(err);
    console.error("[api/data/infra-analysis] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
