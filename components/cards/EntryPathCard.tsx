import Link from "next/link";

interface EntryPathCardProps {
  title: string;
  href: string;
  description?: string;
}

/**
 * One "door" on the home page: Explore the forest, Meet the forest friends, etc.
 * Soft card style; whole card is tappable. Used only on homepage.
 */
export function EntryPathCard({ title, href, description }: EntryPathCardProps) {
  return (
    <Link
      href={href}
      className="block min-h-[44px] rounded-2xl border border-border-paper bg-paper-card/80 p-5 transition-[box-shadow,transform] hover:border-border-paper hover:shadow-md hover:shadow-wood/5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper motion-reduce:hover:shadow-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
    >
      <span className="font-medium text-wood">{title}</span>
        {description ? (
        <p className="mt-1.5 text-sm text-wood-muted leading-snug">
          {description}
        </p>
      ) : null}
    </Link>
  );
}
