import Link from "next/link";

interface EntryPathCardProps {
  title: string;
  href: string;
  description?: string;
}

/**
 * One path on the home page: Explore the forest, Meet the forest friends, etc.
 * Compact horizontal card; whole card is tappable. Used only on homepage.
 *
 * Spacing tokens:
 *   px-sp-4      → --sp-4  (16px) horizontal padding — aligned from px-3.5 (14px)
 *   py-sp-2      → --sp-2  (8px)  vertical padding   — aligned from py-2.5 (10px)
 *   gap-sp-1     → --sp-1  (4px)  stacked gap        — aligned from gap-0.5 (2px)
 *   sm:gap-sp-3  → --sp-3  (12px) row gap desktop
 *   sm:px-card-gap → --card-gap (16px) desktop h-padding (same as px-sp-4, explicit token)
 *   sm:py-sp-3   → --sp-3  (12px) desktop v-padding
 *   mt-sp-1      → --sp-1  (4px)  description top margin — aligned from mt-0.5 (2px)
 */
export function EntryPathCard({ title, href, description }: EntryPathCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-sp-1 rounded-xl border border-border-card bg-paper-card/60 px-sp-4 py-sp-2 transition-colors hover:border-border-paper hover:bg-paper-card/80 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper sm:flex-row sm:items-center sm:justify-between sm:gap-sp-3 sm:px-card-gap sm:py-sp-3"
    >
      <div className="min-w-0">
        <span className="font-medium text-wood text-sm sm:text-base">
          {title}
        </span>
        {description ? (
          <p className="mt-sp-1 text-xs text-wood-muted leading-snug line-clamp-1 sm:line-clamp-none">
            {description}
          </p>
        ) : null}
      </div>
      <span className="shrink-0 text-xs text-wood-muted sm:text-moss">
        →
      </span>
    </Link>
  );
}
