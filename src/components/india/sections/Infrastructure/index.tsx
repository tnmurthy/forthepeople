/**
 * InfrastructureSection — server entry for the infrastructure band.
 */

import { getInfrastructureData } from "@/lib/india/getInfrastructureData";
import { InfrastructureClient } from "./InfrastructureClient";

export async function InfrastructureSection({ locale }: { locale: string }) {
  const data = await getInfrastructureData();
  return <InfrastructureClient data={data} locale={locale} />;
}
