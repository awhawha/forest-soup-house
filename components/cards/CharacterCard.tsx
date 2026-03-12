import Link from "next/link";
import type { Character } from "@/data/characters";

interface CharacterCardProps {
  character: Character;
}

/**
 * Character in list view (Forest Friends page). Soft card; optional image.
 * Links to character profile. Handles missing image gracefully.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const { slug, name, tagline, image } = character;

  return (
    <Link
      href={`/characters/${slug}`}
      className="block min-h-[44px] rounded-2xl border border-border-paper bg-paper-card/80 p-5 transition-[box-shadow,transform] hover:border-border-paper hover:shadow-md hover:shadow-wood/5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper motion-reduce:hover:shadow-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
      >
      {image ? (
        <div className="relative mb-3 aspect-square w-20 overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <span className="font-medium text-wood">{name}</span>
      <p className="mt-1 text-sm text-wood-muted leading-snug">{tagline}</p>
    </Link>
  );
}
