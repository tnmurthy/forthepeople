/**
 * Validator for the free-text "message" field on Supporter / Contribution.
 *
 * Permits: most prose, emoji, punctuation.
 * Rejects: phone numbers, URLs/TLDs, percentages, interest-rate language,
 * investment/loan promotional content, "contact us", "whatsapp", etc.
 *
 * Paid-supporter policy: when existing paid records have messages that fail
 * this validator, the cleanup script CLEARS the message (preserving the
 * original in `originalMessage` + setting `messageFlagged=true`) rather than
 * deleting the Supporter row.
 */

const MESSAGE_SPAM_PATTERNS: Array<{ pattern: RegExp; note: string }> = [
  { pattern: /\b\d{10}\b/, note: "10-digit phone" },
  { pattern: /\+\d{2,3}/, note: "country code" },
  { pattern: /\d+\s*%/, note: "percent" },
  { pattern: /\bp\.a\.?\b/i, note: "p.a" },
  { pattern: /\bp\.m\.?\b/i, note: "p.m" },
  { pattern: /per\s+annum/i, note: "per annum" },
  { pattern: /whatsapp/i, note: "whatsapp" },
  { pattern: /\bcall\s+\d/i, note: "call <digit>" },
  { pattern: /\bcontact\s+(us\s+)?(on|at|:)/i, note: "contact us" },
  { pattern: /https?:\/\//i, note: "url" },
  { pattern: /www\./i, note: "www" },
  { pattern: /\.(com|in|net|org|co)\b/i, note: "tld" },
  { pattern: /interest\s+rate/i, note: "interest rate" },
  { pattern: /investment/i, note: "investment" },
  { pattern: /\bloan\b/i, note: "loan" },
  { pattern: /since\s+\d{4}/i, note: "since YYYY" },
];

const MAX_MSG_LEN = 280;
const MIN_MSG_LEN = 5;

export type MessageValidationResult =
  | { ok: true; cleaned: string | null }
  | { ok: false; reason: string };

export function validateSupporterMessage(input: unknown): MessageValidationResult {
  if (input == null || input === "") return { ok: true, cleaned: null };
  if (typeof input !== "string") return { ok: false, reason: "Message must be text." };

  const trimmed = input.trim().replace(/\s+/g, " ");
  if (trimmed.length === 0) return { ok: true, cleaned: null };
  if (trimmed.length < MIN_MSG_LEN) {
    return { ok: false, reason: "Message too short — leave it blank or write at least 5 characters." };
  }
  if (trimmed.length > MAX_MSG_LEN) {
    return { ok: false, reason: `Maximum ${MAX_MSG_LEN} characters.` };
  }
  for (const { pattern } of MESSAGE_SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        ok: false,
        reason:
          "Messages can't contain phone numbers, URLs, interest rates, or promotional content. Keep it personal.",
      };
    }
  }
  return { ok: true, cleaned: trimmed };
}
