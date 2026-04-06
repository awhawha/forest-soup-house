import Link from "next/link";
import type { Adventure } from "@/data/adventures";

interface AdventureCardProps {
  adventure: Adventure;
}

/**
 * One adventure on the Little Adventures page — links to `/adventures/[slug]`.
 */
export function AdventureCard({ adventure }: AdventureCardProps) {
  const { slug, title, titleEn, description, location, character } = adventure;

  return (
    <Link
      href={`/adventures/${slug}`}
      id={slug}
      className="block rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding scroll-mt-sp-4 transition-[box-shadow,border-color] hover:border-moss-soft/40 hover:shadow-[var(--shadow-paper)] focus:outline-none"
    >
      <h2 className="text-lg font-medium text-wood">{title}</h2>
      <p className="mt-sp-1 text-sm text-wood-muted">{titleEn}</p>
      <p className="mt-sp-2 line-clamp-3 text-wood leading-relaxed">{description}</p>
      <p className="mt-sp-3 text-sm text-wood-muted">
        {location} · {character}
      </p>
    </Link>
  );
}
