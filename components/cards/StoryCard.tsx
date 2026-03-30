import Link from "next/link";
import type { Story } from "@/data/stories";

interface StoryCardProps {
  story: Story;
}

/**
 * Story in list view (Story Time page). Soft card; optional image.
 * Links to story episode. Handles missing image gracefully.
 *
 * Spacing tokens:
 *   p-card-padding   → --card-padding (24px) card inner padding
 *   mb-sp-3          → --sp-3         (12px) image bottom margin
 *   mt-sp-2          → --sp-2         (8px)  description top margin
 *   min-h-tap-target → --tap-target   (44px) min tap height
 */
export function StoryCard({ story }: StoryCardProps) {
  const { slug, title, description, image } = story;

  return (
    <Link
      href={`/stories/${slug}`}
      className="block min-h-tap-target rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding transition-[box-shadow,transform] hover:border-border-paper hover:shadow-md hover:shadow-wood/5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper motion-reduce:hover:shadow-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
    >
      {image ? (
        <div className="relative mb-sp-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <span className="font-medium text-wood">{title}</span>
      {description ? (
        <p className="mt-sp-2 text-sm text-wood-muted leading-snug">
          {description}
        </p>
      ) : null}
    </Link>
  );
}
