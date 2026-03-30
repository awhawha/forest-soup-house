import { Button } from "@/components/Button";
import type { Location } from "@/data/locations";

interface LocationCardProps {
  location: Location;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

/**
 * One place in the forest (World page). Soft card; optional image.
 * In v1 locations don't link to a detail page; CTA triggers an optional handler.
 *
 * Spacing tokens:
 *   p-card-padding → --card-padding (24px) card inner padding
 *   mb-sp-4        → --sp-4         (16px) image bottom margin
 *   mb-sp-2        → --sp-2         (8px)  description bottom margin
 *   mt-sp-3        → --sp-3         (12px) button top margin
 */
export function LocationCard({ location, ctaLabel = "Explore", onCtaClick }: LocationCardProps) {
  const { name, description, image } = location;

  return (
    <div className="rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding">
      {image ? (
        <div className="relative mb-sp-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <p className="mb-sp-2 text-sm text-wood-muted leading-snug">{description}</p>
      <h2 className="text-lg font-medium text-wood">{name}</h2>
      <Button variant="primary" size="md" onClick={onCtaClick} className="mt-sp-3">
        {ctaLabel}
      </Button>
    </div>
  );
}
