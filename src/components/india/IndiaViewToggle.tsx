/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Top-right "List | Grid" toggle for /[locale]/india. Persists the
 * choice in the URL via ?view=list | ?view=grid so the link is
 * shareable and the SSR pre-render serves the right layout.
 */

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { INDIA_DESIGN } from "@/lib/india/india-design";

export default function IndiaViewToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "grid" ? "grid" : "list";

  function urlFor(target: "list" | "grid"): string {
    const params = new URLSearchParams(searchParams.toString());
    if (target === "list") params.delete("view");
    else params.set("view", "grid");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const Item = ({
    target,
    label,
    icon,
  }: {
    target: "list" | "grid";
    label: string;
    icon: string;
  }) => {
    const active = view === target;
    return (
      <Link
        href={urlFor(target)}
        scroll={false}
        prefetch={false}
        aria-current={active ? "true" : undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          fontSize: 12,
          fontWeight: 600,
          color: active ? "#FFFFFF" : INDIA_DESIGN.textSecondary,
          background: active ? INDIA_DESIGN.accentBlue : "transparent",
          borderRadius: 6,
          textDecoration: "none",
          minHeight: 26,
          transition: "background-color 120ms ease, color 120ms ease",
        }}
      >
        <span aria-hidden="true">{icon}</span>
        {label}
      </Link>
    );
  };

  return (
    <div
      role="group"
      aria-label="Switch between list and grid layouts"
      style={{
        display: "inline-flex",
        gap: 2,
        padding: 3,
        background: INDIA_DESIGN.bgCard,
        border: `1px solid ${INDIA_DESIGN.border}`,
        borderRadius: 8,
      }}
    >
      <Item target="list" label="List" icon="≣" />
      <Item target="grid" label="Grid" icon="▦" />
    </div>
  );
}
