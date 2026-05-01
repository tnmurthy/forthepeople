/**
 * InnovationSection — server entry for the innovation band.
 */

import { getInnovationData } from "@/lib/india/getInnovationData";
import { InnovationClient } from "./InnovationClient";

export async function InnovationSection({ locale }: { locale: string }) {
  const data = await getInnovationData();
  return <InnovationClient data={data} locale={locale} />;
}
