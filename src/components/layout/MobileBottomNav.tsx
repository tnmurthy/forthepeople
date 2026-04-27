/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 *
 * Session M1 Phase J: sticky bottom nav for mobile.
 * Home / Search / Vote / Support — 4 tabs, 52px tap targets.
 * Always rendered; CSS hides on viewport ≥ 768px.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Vote, Heart } from "lucide-react";

interface Props {
  locale: string;
}

export function MobileBottomNav({ locale }: Props) {
  const pathname = usePathname() ?? "";
  const items = [
    {
      href: `/${locale}`,
      label: "Home",
      icon: Home,
      match: (p: string) => p === `/${locale}` || p === `/${locale}/`,
    },
    {
      href: `/${locale}/search`,
      label: "Search",
      icon: Search,
      match: (p: string) => p.startsWith(`/${locale}/search`),
    },
    {
      href: `/${locale}/features`,
      label: "Vote",
      icon: Vote,
      match: (p: string) => p.startsWith(`/${locale}/features`),
    },
    {
      href: `/${locale}/support`,
      label: "Support",
      icon: Heart,
      match: (p: string) => p.startsWith(`/${locale}/support`),
      isSupport: true,
    },
  ] as const;

  return (
    <nav
      className="ftp-m-bottom-nav"
      role="navigation"
      aria-label="Primary"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`ftp-m-bn-item${active ? " is-active" : ""}${"isSupport" in item && item.isSupport ? " is-support" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
