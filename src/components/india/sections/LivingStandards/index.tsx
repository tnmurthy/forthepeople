/**
 * LivingStandardsSection — server entry for the living-standards band.
 */

import { getLivingStandardsData } from "@/lib/india/getLivingStandardsData";
import { LivingStandardsClient } from "./LivingStandardsClient";

export async function LivingStandardsSection({ locale }: { locale: string }) {
  const data = await getLivingStandardsData();
  return <LivingStandardsClient data={data} locale={locale} />;
}
