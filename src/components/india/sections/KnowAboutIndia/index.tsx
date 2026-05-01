/**
 * KnowAboutIndiaSection — server entry for the know-india band.
 *
 * Fetches data on the server, hands it to the client child that
 * owns the IntersectionObserver, marquee directory, and animations.
 */

import { getKnowAboutIndiaData } from "@/lib/india/getKnowAboutIndiaData";
import { KnowAboutIndiaClient } from "./KnowAboutIndiaClient";

export async function KnowAboutIndiaSection({ locale }: { locale: string }) {
  const data = await getKnowAboutIndiaData();
  return <KnowAboutIndiaClient data={data} locale={locale} />;
}
