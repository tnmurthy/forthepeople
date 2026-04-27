/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import QueryProvider from "@/components/providers/QueryProvider";
import MigrationBanner from "@/components/layout/MigrationBanner";
import PageProgressBar from "@/components/common/PageProgressBar";

// Session 11.1 — chrome swapped to redesign-v2 site-wide.
// Legacy components (Header.tsx 938 LOC, Footer.tsx 144 LOC,
// DisclaimerBar.tsx 73 LOC) remain on disk for rollback. Some
// district-page-specific behavior of the legacy Header (lock state,
// state/district jump, MobileSidebar wiring) is intentionally simpler
// in HeaderBar — see component header comment for the deferred list.
import DisclaimerBanner from "@/components/home/redesign-v2/DisclaimerBanner";
import HeaderBar from "@/components/home/redesign-v2/HeaderBar";
import Footer from "@/components/home/redesign-v2/Footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <QueryProvider>
      <PageProgressBar />
      <MigrationBanner />
      <DisclaimerBanner />
      <HeaderBar locale={locale} />
      {children}
      <Footer locale={locale} />
    </QueryProvider>
  );
}
