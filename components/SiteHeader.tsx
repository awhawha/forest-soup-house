import Link from "next/link";

const FOREST_WORLD_LINKS: { href: string; label: string }[] = [
  { href: "/world", label: "Forest Map · 森林地圖" },
  { href: "/characters", label: "Forest Friends · 森林朋友" },
  { href: "/soup-cards", label: "Soup Cards · 湯譜卡" },
];

const TOP_LEVEL_LINKS: { href: string; label: string }[] = [
  { href: "/stories", label: "Story Time · 故事時間" },
  { href: "/missions", label: "Little Adventures · 森林小冒險" },
  { href: "/about", label: "About · 關於湯湯屋" },
];

const linkClass =
  "inline-flex min-h-tap-target min-w-tap-target items-center text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper";

const dropdownItemClass =
  "block rounded-md px-sp-3 py-sp-2 text-sm text-wood transition-colors hover:bg-paper-section hover:text-moss focus:outline-none focus:ring-2 focus:ring-inset focus:ring-moss/30";

/**
 * Global site header — appears on every page.
 *
 * Forest World is a lightweight disclosure (not an app mega-menu).
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
          Forest Soup House · 森林湯湯屋
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-x-card-gap-sm gap-y-sp-2"
        >
          <details className="group relative">
            <summary
              className={`${linkClass} list-none cursor-pointer select-none rounded-md px-1 [&::-webkit-details-marker]:hidden`}
            >
              <span className="inline-flex items-center gap-1">
                Forest World · 森林世界
                <span className="text-wood-muted" aria-hidden>
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
                  <Link href={href} className={dropdownItemClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {TOP_LEVEL_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
