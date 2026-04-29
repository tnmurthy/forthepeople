/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * "New districts this month" rail for /[locale]/india.
 *
 * Thin india-namespaced wrapper around the existing NewDistrictsBand
 * server component (src/components/home/) to keep all India page surface
 * grouped under /components/india/ for code review, while not duplicating
 * the data layer or markup.
 */

import { NewDistrictsBand } from "@/components/home/NewDistrictsBand";

export default async function IndiaNewDistrictsRail({ locale }: { locale: string }) {
  return <NewDistrictsBand locale={locale} />;
}
