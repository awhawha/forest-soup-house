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

export function SiteHeader() {
  return (
    <header
      className="border-b border-border-paper bg-paper/95"
      role="banner"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="text-lg font-medium text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
        >
          Forest Soup House
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper min-h-[44px] min-w-[44px] inline-flex items-center"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
