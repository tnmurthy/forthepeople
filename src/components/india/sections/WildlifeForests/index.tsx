/**
 * WildlifeForestsSection — server entry for the wildlife-forests band.
 */

import { getWildlifeForestsData } from "@/lib/india/getWildlifeForestsData";
import { WildlifeForestsClient } from "./WildlifeForestsClient";

export async function WildlifeForestsSection({ locale }: { locale: string }) {
  const data = await getWildlifeForestsData();
  return <WildlifeForestsClient data={data} locale={locale} />;
}
