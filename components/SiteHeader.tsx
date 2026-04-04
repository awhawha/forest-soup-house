import Link from "next/link";
import { ForestWorldDropdown } from "@/components/ForestWorldDropdown";

const TOP_LEVEL_LINKS: { href: string; label: string }[] = [
  { href: "/stories", label: "Story Time · 故事時間" },
  { href: "/missions", label: "Little Adventures · 森林小冒險" },
  { href: "/about", label: "About · 關於湯湯屋" },
];

/** Links — cream text, rounded hover (forest-soup-house-adventures ForestNavigation) */
const navLinkClass =
  "inline-flex min-h-tap-target min-w-tap-target items-center rounded-full px-sp-3 text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:bg-white/10 hover:text-ink-on-green focus:outline-none focus:ring-2 focus:ring-ink-on-green/40 focus:ring-offset-2 focus:ring-offset-moss-dark";

/**
 * Global site header — appears on every page.
 *
 * Forest World submenu is a client `<details>` that closes after a link is chosen.
 */
export function SiteHeader() {
  return (
    <>
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-ink-on-green/20 bg-gradient-to-r from-moss-dark/92 via-moss-soft/88 to-moss-dark/92 shadow-[var(--shadow-paper)] backdrop-blur-md supports-[backdrop-filter]:bg-moss-dark/80"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-gap-inline px-page-px py-sp-4 sm:flex-row sm:items-center sm:justify-between sm:px-page-px-sm">
        <Link
          href="/"
          className="font-heading text-xl font-bold text-ink-on-green transition-[transform,colors] duration-300 ease-out hover:scale-[1.02] hover:text-ink-on-green focus:outline-none focus:ring-2 focus:ring-ink-on-green/40 focus:ring-offset-2 focus:ring-offset-moss-dark"
        >
          森林湯湯屋
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-x-card-gap-sm gap-y-sp-2"
        >
          <ForestWorldDropdown />

          {TOP_LEVEL_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
    <div className="h-16 shrink-0" aria-hidden />
    </>
  );
}
