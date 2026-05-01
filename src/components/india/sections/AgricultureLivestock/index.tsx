/**
 * AgricultureLivestockSection — server entry for the
 * agriculture-livestock band.
 */

import { getAgricultureLivestockData } from "@/lib/india/getAgricultureLivestockData";
import { AgricultureLivestockClient } from "./AgricultureLivestockClient";

export async function AgricultureLivestockSection({ locale }: { locale: string }) {
  const data = await getAgricultureLivestockData();
  return <AgricultureLivestockClient data={data} locale={locale} />;
}
