"use client";

import Link from "next/link";
import { useRef } from "react";

const FOREST_WORLD_LINKS: { href: string; label: string }[] = [
  { href: "/world", label: "Forest Map · 森林地圖" },
  { href: "/characters", label: "Forest Friends · 森林朋友" },
  { href: "/soup-cards", label: "Soup Cards · 湯譜卡" },
];

const navLinkClass =
  "inline-flex min-h-tap-target min-w-tap-target items-center rounded-full px-sp-3 text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:bg-white/10 hover:text-ink-on-green focus:outline-none focus:ring-2 focus:ring-ink-on-green/40 focus:ring-offset-2 focus:ring-offset-moss-dark";

const dropdownItemClass =
  "block rounded-md px-sp-3 py-sp-2 text-sm text-wood transition-colors hover:bg-paper-section hover:text-moss focus:outline-none focus:ring-2 focus:ring-inset focus:ring-moss/30";

/**
 * Native <details> does not close when a Next.js client navigation fires from a child link.
 * Close imperatively on submenu item activate (click / keyboard).
 */
export function ForestWorldDropdown() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    const el = detailsRef.current;
    if (el) el.open = false;
  };

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        className={`${navLinkClass} list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden`}
      >
        <span className="inline-flex items-center gap-1">
          Forest World · 森林世界
          <span className="text-ink-on-green/70" aria-hidden>
            ▾
          </span>
        </span>
      </summary>
      <ul
        className="absolute left-0 top-full z-20 mt-sp-1 min-w-[min(100vw-2rem,14rem)] rounded-lg border border-border-paper bg-paper-card py-sp-2 shadow-[var(--shadow-paper)]"
        role="list"
      >
        {FOREST_WORLD_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={dropdownItemClass}
              onClick={closeMenu}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
