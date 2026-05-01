/**
 * AgricultureLivestockSection — server entry for Section 05.
 */

import { getAgricultureLivestockData } from "@/lib/india/getAgricultureLivestockData";
import { AgricultureLivestockClient } from "./AgricultureLivestockClient";

export async function AgricultureLivestockSection({ locale }: { locale: string }) {
  const data = await getAgricultureLivestockData();
  return <AgricultureLivestockClient data={data} locale={locale} />;
}
