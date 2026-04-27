/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase I: client wrapper that owns the drawer-open state for
 * the district MobileHeader. Mounts BOTH the mobile header (with the
 * hamburger callback) and the drawer itself. The plain MobileHeader in
 * the global locale layout is hidden on district pages via CSS so this
 * wrapper's header takes over (avoids duplicate headers).
 */

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileDistrictDrawer } from "./MobileDistrictDrawer";

interface Props {
  locale: string;
  stateSlug: string;
  districtSlug: string;
  districtName: string;
}

export function MobileDistrictChrome({
  locale,
  stateSlug,
  districtSlug,
  districtName,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname() ?? "";
  // Active module from URL: /[locale]/[state]/[district]/<module-or-overview>
  const parts = pathname.split("/").filter(Boolean);
  const activeSlug = parts[3] ?? "overview";

  return (
    <div className="ftp-m-district-chrome">
      <MobileHeader
        locale={locale}
        variant="district"
        onModuleMenuClick={() => setDrawerOpen(true)}
      />
      <MobileDistrictDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locale={locale}
        stateSlug={stateSlug}
        districtSlug={districtSlug}
        districtName={districtName}
        activeSlug={activeSlug}
      />
    </div>
  );
}
