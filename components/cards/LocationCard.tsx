import Link from "next/link";
import type { Location } from "@/data/locations";

interface LocationCardProps {
  location: Location;
  /** CTA label on the card (default matches reference copy). */
  ctaLabel?: string;
}

/**
 * One place on the World map carousel: links to `/world/[slug]`.
 * Fills track cell (`h-full w-full`); body uses flex so CTA aligns to bottom when heights match.
 */
export function LocationCard({
  location,
  ctaLabel = "探索地點 →",
}: LocationCardProps) {
  const { slug, name, nameEn, emoji, tagline, image, status } = location;
  const href = `/world/${slug}`;

  return (
    <Link
      href={href}
      className="group flex min-h-0 w-full flex-1 flex-col rounded-2xl border border-border-paper/80 bg-world-card-bg px-sp-4 py-sp-5 text-center shadow-[0_4px_24px_rgba(45,90,39,0.08)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(45,90,39,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-world-cta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-world-page-bg sm:px-sp-5 sm:py-sp-6"
    >
      {image ? (
        <div className="relative mb-sp-3 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-sp-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-sp-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-world-icon-bg text-3xl leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:h-[3.75rem] sm:w-[3.75rem] sm:text-4xl">
            <span aria-hidden>{emoji}</span>
            {status === "coming-soon" ? (
              <span className="absolute -right-1 -top-1 rounded-full border border-border-paper bg-paper-section px-1.5 py-0.5 text-[10px] font-medium text-world-muted">
                準備中
              </span>
            ) : null}
          </div>

          <h2 className="font-heading text-base font-bold leading-snug text-world-heading sm:text-lg">
            {name}
          </h2>
          <p className="mt-0.5 text-[11px] text-world-muted sm:text-xs">{nameEn}</p>
          <p className="mt-sp-3 text-sm leading-relaxed text-world-muted">{tagline}</p>
        </div>

        <span className="btn-world-cta w-full shrink-0 justify-center transition-transform duration-200 group-hover:translate-y-px sm:text-base">
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}
