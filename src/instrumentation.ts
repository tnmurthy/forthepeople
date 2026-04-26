/**
 * Sentry server + edge runtime initialization.
 *
 * Loaded automatically by Next.js 16 via the instrumentation hook.
 * Replaces the deprecated `sentry.{server,edge}.config.ts` files —
 * Sentry SDK v10 + Next.js 16 only auto-load init from
 * `instrumentation.ts` / `instrumentation-client.ts`.
 */
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.05, // 5% — saves quota
      environment: process.env.NODE_ENV,
      enabled: process.env.NODE_ENV === "production",
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.05,
      environment: process.env.NODE_ENV,
      enabled: process.env.NODE_ENV === "production",
      debug: false,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
