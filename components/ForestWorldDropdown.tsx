"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FOREST_WORLD_LINKS } from "@/data/siteHeaderNav";

const navLinkClass =
  "inline-flex min-h-tap-target min-w-tap-target shrink-0 items-center whitespace-nowrap rounded-full px-sp-3 text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:bg-white/10 hover:text-ink-on-green focus:outline-none";

const dropdownItemClass =
  "block rounded-md px-sp-3 py-sp-2 text-sm text-wood transition-colors hover:bg-paper-section hover:text-moss focus:outline-none";

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

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = detailsRef.current;
      if (!el?.open) return;
      const target = e.target;
      if (target instanceof Node && !el.contains(target)) {
        el.open = false;
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <details ref={detailsRef} className="group relative shrink-0">
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
