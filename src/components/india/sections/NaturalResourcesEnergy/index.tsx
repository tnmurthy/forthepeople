/**
 * NaturalResourcesEnergySection — server entry for the
 * natural-resources-energy band.
 */

import { getNaturalResourcesEnergyData } from "@/lib/india/getNaturalResourcesEnergyData";
import { NaturalResourcesEnergyClient } from "./NaturalResourcesEnergyClient";

export async function NaturalResourcesEnergySection({
  locale,
}: {
  locale: string;
}) {
  const data = await getNaturalResourcesEnergyData();
  return <NaturalResourcesEnergyClient data={data} locale={locale} />;
}
