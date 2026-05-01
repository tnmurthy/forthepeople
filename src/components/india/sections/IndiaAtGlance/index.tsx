/**
 * IndiaAtGlanceSection — server entry for the macro-snapshot band.
 *
 * Loads data on the server and hands it to a client component that
 * owns the IntersectionObserver, the count-up animation, and the
 * 3-column v4 layout.
 *
 * locale is threaded through so module links respect /kn/ as well as
 * /en/. The page passes it down already; we keep the contract.
 */

import { getMacroSnapshotData } from "@/lib/india/getMacroSnapshotData";
import { IndiaAtGlanceClient } from "./IndiaAtGlanceClient";

export async function IndiaAtGlanceSection({ locale }: { locale: string }) {
  const data = await getMacroSnapshotData();
  return <IndiaAtGlanceClient data={data} locale={locale} />;
}
