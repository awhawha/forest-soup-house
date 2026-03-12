import type { Location } from "@/data/locations";

interface LocationCardProps {
  location: Location;
}

/**
 * One place in the forest (World page). Soft card; optional image.
 * In v1 locations don't link to a detail page; card is display-only or links to anchor.
 */
export function LocationCard({ location }: LocationCardProps) {
  const { name, description, image } = location;

  return (
    <div className="rounded-2xl border border-border-paper bg-paper-card/80 p-5">
      {image ? (
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <h2 className="text-lg font-medium text-wood">{name}</h2>
      <p className="mt-1.5 text-wood-muted leading-snug">{description}</p>    </div>
  );
}
