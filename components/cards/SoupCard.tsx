import Link from "next/link";
import type { SoupCard as SoupCardType } from "@/data/soupCards";

interface SoupCardProps {
  soup: SoupCardType;
}

/**
 * Soup in list view (Soup Cards page). Soft card; optional image.
 * Links to soup detail page. Handles optional image and character.
 */
export function SoupCard({ soup }: SoupCardProps) {
  const { slug, name, mood, description, image } = soup;

  return (
    <Link
      href={`/soup-cards/${slug}`}
      className="block min-h-[44px] rounded-2xl border border-border-paper bg-paper-card/80 p-5 transition-[box-shadow,transform] hover:border-border-paper hover:shadow-md hover:shadow-wood/5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper motion-reduce:hover:shadow-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
    >
      {image ? (
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <span className="font-medium text-wood">{name}</span>
      <p className="mt-0.5 text-sm text-wood-muted">{mood}</p>
      {description ? (
      <p className="mt-1.5 text-sm text-wood-muted leading-snug line-clamp-2">
          {description}
        </p>
      ) : null}
    </Link>
  );
}
