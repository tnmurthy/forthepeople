/**
 * ForThePeople.in — AI Feedback Classifier
 * Classifies user feedback with legal guardrails.
 * Uses callAI() with purpose 'classify' (routes to free model).
 */

import { callAI } from "@/lib/ai-provider";
import { prisma } from "@/lib/db";

export interface FeedbackClassification {
  category: "bug" | "feature" | "data_error" | "praise" | "general" | "partnership";
  priority: "critical" | "high" | "medium" | "low";
  summary: string;
  confidence: number;
  flags: string[];
  adminWarning: string | null;
}

const SYSTEM_PROMPT = `You are a feedback classifier for ForThePeople.in, an INDEPENDENT citizen transparency platform (NOT a government website). You classify user feedback AND flag risks for the admin.

CRITICAL RULES:
1. ForThePeople.in is NOT a government website. We aggregate publicly available government data under India's NDSAP policy and Article 19(1)(a).
2. We NEVER store personal citizen data (Aadhaar, PAN, voter ID, phone numbers).
3. We NEVER use government logos, emblems, or seals.
4. The word "scraper/scraping/scraped" must NEVER appear in any response.
5. Data about politicians/leaders must be factual only.
6. Any feedback requesting features that could create legal risk MUST be flagged.

CATEGORY: bug (UI broken), data_error (wrong/outdated data), feature (new request), praise (compliment), partnership (volunteer/collaborate offer), general (other)

PRIORITY: critical (wrong data misleading citizens, site broken), high (missing data, popular feature, partnership), medium (nice-to-have, minor UI), low (vague, test, praise only)

FLAGS (array, add any that apply):
- "legal_risk", "data_verification_needed", "personal_data_exposed", "partnership_opportunity", "testimonial_worthy", "duplicate_request", "requires_new_data_source", "revenue_relevant", "accessibility_request"

ADMIN WARNING (string or null):
- Politicians with accusations → "DEFAMATION RISK: Verify claims about named individuals."
- Store personal data → "LEGAL: We do NOT store PII. Decline this request."
- Government logos → "LEGAL: Using govt emblems prohibited. Do not implement."
- Crime data inaccurate → "SENSITIVE: Only use NCRB data. Add disclaimer."
- Scrape login-protected portals → "LEGAL: Only use publicly accessible data."
- Hate speech/threats → "CONTENT: Inappropriate content. Review before responding."
- No warning → null

Return ONLY JSON: {"category":"...","priority":"...","summary":"...","confidence":0.0-1.0,"flags":[],"adminWarning":null}`;

export async function classifyFeedback(
  feedbackId: string,
  type: string,
  subject: string,
  message: string,
  module?: string | null,
  district?: string | null
): Promise<FeedbackClassification | null> {
  try {
    const userPrompt = `Classify this feedback:\n\nType: ${type}\nSubject: ${subject}\nMessage: ${message}${module ? `\nModule: ${module}` : ""}${district ? `\nDistrict: ${district}` : ""}`;

    const response = await callAI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      purpose: "classify",
      jsonMode: true,
      maxTokens: 512,
      temperature: 0.1,
    });

    const parsed = JSON.parse(response.text) as FeedbackClassification;

    // Save classification to DB
    await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        aiCategory: parsed.category,
        aiPriority: parsed.priority,
        aiSummary: parsed.summary?.slice(0, 200),
        aiConfidence: parsed.confidence,
        aiFlags: parsed.flags || [],
        aiAdminWarning: parsed.adminWarning,
        aiClassifiedAt: new Date(),
      },
    });

    return parsed;
  } catch (err) {
    console.error("[feedback-classifier] Failed:", err);
    return null;
  }
}

export async function batchClassifyFeedback(): Promise<{ classified: number; failed: number; skipped: number }> {
  const unclassified = await prisma.feedback.findMany({
    where: { aiClassifiedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { district: { select: { name: true } } },
  });

  let classified = 0;
  let failed = 0;

  for (const fb of unclassified) {
    const result = await classifyFeedback(
      fb.id, fb.type, fb.subject, fb.message, fb.module, fb.district?.name
    );
    if (result) classified++;
    else failed++;

    // Rate limit: 500ms between calls
    await new Promise((r) => setTimeout(r, 500));
  }

  return { classified, failed, skipped: 0 };
}
