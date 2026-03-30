interface PageHeroProps {
  title: string;
  subtitle?: string;
}

/**
 * Page-level title and optional subtitle for inner pages.
 * Editorial style: no card, no box. Used on World, Characters, Stories, Soup Cards, Missions, About.
 *
 * Spacing tokens used:
 *   px-page-px / sm:px-page-px-sm → --page-px / --page-px-sm  (16px / 24px)
 *   pt-hero-pt / sm:pt-hero-pt-sm → --hero-pt / --hero-pt-sm  (32px / 40px)
 *   pb-hero-pb / sm:pb-hero-pb-sm → --hero-pb / --hero-pb-sm  (24px / 32px)
 */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="mx-auto max-w-3xl px-page-px pt-hero-pt pb-hero-pb sm:px-page-px-sm sm:pt-hero-pt-sm sm:pb-hero-pb-sm">
      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-sp-2 text-lg text-wood-muted leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}
