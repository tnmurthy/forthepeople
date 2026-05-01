/**
 * GovernanceSection — server entry for the governance band.
 */

import { getGovernanceData } from "@/lib/india/getGovernanceData";
import { GovernanceClient } from "./GovernanceClient";

export async function GovernanceSection({ locale }: { locale: string }) {
  const data = await getGovernanceData();
  return <GovernanceClient data={data} locale={locale} />;
}
