"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import {
  FOREST_WORLD_LINKS,
  TOP_LEVEL_NAV_LINKS,
} from "@/data/siteHeaderNav";
import { ForestWorldDropdown } from "@/components/ForestWorldDropdown";

const navLinkClass =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-sp-3 text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:bg-white/10 hover:text-ink-on-green focus:outline-none min-h-tap-target";

const mobileLinkClass =
  "block rounded-lg px-sp-4 py-sp-3 text-base font-medium text-ink-on-green transition-colors hover:bg-white/10 focus:outline-none";

const mobileSubLinkClass =
  "block rounded-lg py-sp-2 pl-sp-8 pr-sp-4 text-sm text-ink-on-green/90 transition-colors hover:bg-white/10";

/**
 * Desktop (lg+): single-row nav, nowrap + horizontal scroll fallback.  
 * Below lg: hamburger opens a full-bleed panel under the header.
 */
export function SiteHeaderNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-end">
      <nav
        className="hidden min-w-0 flex-1 flex-nowrap items-center gap-x-card-gap-sm lg:flex"
        aria-label="Main navigation"
      >
        {/* Dropdown must not sit inside overflow-x-auto or the panel is clipped */}
        <ForestWorldDropdown />
        <div className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-x-card-gap-sm overflow-x-auto scrollbar-hide">
          {TOP_LEVEL_NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <button
        type="button"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-ink-on-green transition-colors hover:bg-white/10 focus:outline-none lg:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "關閉選單" : "開啟選單"}</span>
        {open ? <IconClose /> : <IconMenu />}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-1/2 top-full z-50 mt-0 w-screen max-w-[100vw] -translate-x-1/2 border-b border-white/10 bg-gradient-to-b from-moss-dark/98 to-moss-dark shadow-lg lg:hidden"
        >
          <nav
            className="mx-auto max-h-[min(70vh,calc(100dvh-5rem))] max-w-5xl overflow-y-auto px-page-px py-sp-4 sm:px-page-px-sm"
            aria-label="手機選單"
          >
            <p className="mb-sp-2 px-sp-4 text-xs font-medium uppercase tracking-wide text-ink-on-green/60">
              Forest World · 森林世界
            </p>
            <ul className="space-y-0.5" role="list">
              {FOREST_WORLD_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={mobileSubLinkClass}
                    onClick={close}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className="my-sp-4 h-px bg-white/15"
              role="separator"
              aria-hidden
            />

            <ul className="space-y-1" role="list">
              {TOP_LEVEL_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={mobileLinkClass} onClick={close}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function IconMenu() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
