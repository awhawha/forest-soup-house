import Link from "next/link";

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "Forest Gate" },
  { href: "/world", label: "The Forest" },
  { href: "/characters", label: "Forest Friends" },
  { href: "/stories", label: "Story Time" },
  { href: "/soup-cards", label: "Soup Cards" },
  { href: "/missions", label: "Little Adventures" },
  { href: "/about", label: "About" },
];

/**
 * Global site header — appears on every page.
 *
 * Spacing tokens used:
 *   px-page-px / sm:px-page-px-sm → --page-px / --page-px-sm  (16px / 24px)
 *   py-page-py                    → --page-py                  (24px)
 *   gap-gap-inline                → --gap-inline               (16px)
 *   gap-x-card-gap-sm             → --card-gap-sm              (24px, nav item gaps)
 *   min-h-tap-target              → --tap-target               (44px)
 */
export function SiteHeader() {
  return (
    <header
      className="border-b border-border-paper bg-paper/95"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-gap-inline px-page-px py-sp-4 sm:flex-row sm:items-center sm:justify-between sm:px-page-px-sm">
        <Link
          href="/"
          className="text-lg font-medium text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
        >
          Forest Soup House
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-card-gap-sm gap-y-sp-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-tap-target min-w-tap-target items-center text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
