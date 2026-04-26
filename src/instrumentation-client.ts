/**
 * Sentry browser-side initialization.
 *
 * Loaded automatically by Next.js 16 in the client bundle via the
 * instrumentation-client hook. Replaces the deprecated
 * `sentry.client.config.ts` file.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.05,
  replaysSessionSampleRate: 0, // Session Replay disabled for now
  replaysOnErrorSampleRate: 0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
