import Link from "next/link";
import { SiteHeaderNav } from "@/components/SiteHeaderNav";

/**
 * Global site header — appears on every page.
 * Below `lg`, navigation is a hamburger; `lg+` uses a single-row bar (no wrap).
 */
export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-ink-on-green/20 bg-gradient-to-r from-moss-dark/92 via-moss-soft/88 to-moss-dark/92 pt-[env(safe-area-inset-top,0px)] shadow-[var(--shadow-paper)] backdrop-blur-md supports-[backdrop-filter]:bg-moss-dark/80"
      role="banner"
    >
      <div className="relative mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-page-px py-sp-3 sm:px-page-px-sm sm:py-sp-4">
        <Link
          href="/"
          className="font-heading inline-flex shrink-0 items-center gap-sp-2 text-xl font-bold text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:scale-[1.02] hover:text-ink-on-green focus:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG is wide (~2.9:1); height-only + w-auto avoids square letterboxing */}
          <img
            src="/images/logo.svg"
            alt=""
            width={207}
            height={71}
            className="h-9 w-auto max-h-10 shrink-0 object-contain object-left sm:h-10 sm:max-h-11 md:h-11"
            aria-hidden
          />
        </Link>

        <SiteHeaderNav />
      </div>
    </header>
  );
}
