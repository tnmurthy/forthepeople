/**
 * CultureSection — server entry for the culture band.
 */

import { getCultureData } from "@/lib/india/getCultureData";
import { CultureClient } from "./CultureClient";

export async function CultureSection({ locale }: { locale: string }) {
  const data = await getCultureData();
  return <CultureClient data={data} locale={locale} />;
}
